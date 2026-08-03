<template>
  <div ref="workspace" class="composition-workspace" :class="{ saving, dragging }">
    <div class="save-status" aria-live="polite">
      <span class="save-status-label">{{ saveStatus }}</span>
    </div>

    <Alert v-if="errorMessage" class="inline">
      <p>{{ errorMessage }}</p>
    </Alert>

    <div class="composition-layout">
      <aside class="pool-panel panel">
        <header class="panel-header">
          <div>
            <SectionTitle>Contribution Pool</SectionTitle>
            <small>
              {{ availableParticipations.length }} available · {{ availableArtistCount }}
              {{ availableArtistCount === 1 ? 'artist' : 'artists' }}
            </small>
          </div>
        </header>

        <div class="pool-controls">
          <input
            v-model="search"
            class="input"
            type="search"
            placeholder="Search contributions"
          />
          <select v-model="sort" class="select">
            <option value="recent">Recent</option>
            <option value="likes">Most liked</option>
            <option value="artist">Artist</option>
          </select>
        </div>

        <div ref="poolScroll" class="pool-scroll">
          <div
            ref="poolGrid"
            class="pool-grid composition-drop-zone"
            data-composition-zone="pool"
            data-drop-zone
            :style="poolStyle"
            :aria-busy="saving"
          >
            <SetCompositionPiece
              v-for="participation in visibleParticipations"
              :key="participation.id"
              :image="participation.image"
              :participation="participation"
              show-meta
              @view="openPreview(participation.image, participation)"
            />
          </div>

          <p v-if="!displayedParticipations.length" class="empty-pool">
            {{ search ? 'No matching contributions' : 'All contributions are selected' }}
          </p>
        </div>
      </aside>

      <section class="edition-board panel">
        <header class="panel-header">
          <div>
            <SectionTitle>Edition Board</SectionTitle>
            <small>{{ selectedCount }} / {{ slotCount }} slots filled</small>
          </div>
        </header>

        <div class="edition-rows">
          <section v-for="edition in EDITION_KEYS" :key="edition" class="edition-row">
            <header>
              <strong>1/{{ edition }}</strong>
              <small>{{ filledSlotCount(edition) }}/{{ slots[edition].length }}</small>
            </header>

            <div class="edition-slots">
              <div
                v-for="(image, offset) in slots[edition]"
                :key="`${edition}-${offset + 1}`"
                class="composition-slot composition-drop-zone"
                :class="{ filled: image }"
                data-composition-zone="slot"
                data-drop-zone
                :data-edition="edition"
                :data-index="offset + 1"
                :style="{ aspectRatio: submission.aspect_ratio || '1' }"
              >
                <SetCompositionPiece
                  v-if="image"
                  :image="image"
                  :participation="participationFor(image)"
                  @view="openPreview(image, participationFor(image))"
                />
                <span v-else class="slot-number">{{ offset + 1 }}</span>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>

    <ImageModal
      v-if="previewImage"
      v-model:open="previewOpen"
      :image="previewImage"
      :name="previewName"
      :tagline="previewTagline"
    />
  </div>
</template>

<script setup>
import { refDebounced } from '@vueuse/core'
import {
  applyCompositionDrop,
  createCompositionSlots,
  createCompositionUpdateBody,
  selectedCompositionImageUuids,
} from '~/utils/set-composition'

const POOL_TILE_MIN = 88

const props = defineProps({
  submission: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['updated'])
const config = useRuntimeConfig()

const workspace = ref(null)
const poolScroll = ref(null)
const poolGrid = ref(null)
const slots = ref(createCompositionSlots(props.submission))
const pendingSaves = ref(0)
const errorMessage = ref('')
const lastSaved = ref(null)
const search = ref('')
const sort = ref('recent')
const previewOpen = ref(false)
const previewImage = ref(null)
const previewName = ref('')
const previewTagline = ref('')

const saving = computed(() => pendingSaves.value > 0)
const debouncedSearch = refDebounced(search, 120)

const participations = computed(() => props.submission.participationImages || [])
// Searchable text is precomputed once per contribution rather than per keystroke.
const searchIndex = computed(
  () =>
    new Map(
      participations.value.map((participation) => [
        participation.id,
        [
          participation.image?.uuid,
          participation.creator?.display,
          participation.creator?.address,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase(),
      ]),
    ),
)
const selectedImageUuids = computed(() => selectedCompositionImageUuids(slots.value))
const availableParticipations = computed(() =>
  participations.value.filter(
    (participation) => !selectedImageUuids.value.has(participation.image?.uuid),
  ),
)
const availableArtistCount = computed(
  () =>
    new Set(
      availableParticipations.value
        .map((participation) => participation.creator?.address?.toLowerCase())
        .filter(Boolean),
    ).size,
)
const participationByImageUuid = computed(
  () =>
    new Map(
      participations.value.map((participation) => [participation.image?.uuid, participation]),
    ),
)
const imageByUuid = computed(() => {
  const images = Object.values(slots.value).flat().filter(Boolean)
  const poolImages = participations.value
    .map((participation) => participation.image)
    .filter(Boolean)

  return new Map([...images, ...poolImages].map((image) => [image.uuid, image]))
})

const displayedParticipations = computed(() => {
  const query = debouncedSearch.value.trim().toLowerCase()
  const filtered = query
    ? availableParticipations.value.filter((participation) =>
        searchIndex.value.get(participation.id)?.includes(query),
      )
    : availableParticipations.value

  if (sort.value === 'likes') {
    return [...filtered].sort((a, b) => (b.image?.points || 0) - (a.image?.points || 0))
  }

  if (sort.value === 'artist') {
    return [...filtered].sort((a, b) => creatorName(a).localeCompare(creatorName(b)))
  }

  return filtered
})

// Only the contributions in view are rendered: the pool stays cheap at any size.
const {
  start: poolStart,
  end: poolEnd,
  style: poolStyle,
} = useVirtualGrid({
  content: poolGrid,
  viewport: poolScroll,
  count: () => displayedParticipations.value.length,
  minTileWidth: POOL_TILE_MIN,
  aspectRatio: () => Number(props.submission.aspect_ratio) || 1,
})
const visibleParticipations = computed(() =>
  displayedParticipations.value.slice(poolStart.value, poolEnd.value),
)

watch([debouncedSearch, sort], () => {
  if (poolScroll.value) poolScroll.value.scrollTop = 0
})

const selectedCount = computed(() => Object.values(slots.value).flat().filter(Boolean).length)
const slotCount = computed(() => Object.values(slots.value).flat().length)
const saveStatus = computed(() => {
  if (saving.value) return 'Saving…'
  if (errorMessage.value) return 'Not saved'
  if (lastSaved.value) return 'Saved'
  return 'Autosave ready'
})

const creatorName = (participation) =>
  participation.creator?.display || participation.creator?.address || 'Unknown artist'
const participationFor = (image) => participationByImageUuid.value.get(image?.uuid)
const filledSlotCount = (edition) => slots.value[edition].filter(Boolean).length

const openPreview = (image, participation) => {
  previewImage.value = image
  previewName.value = participation
    ? `${props.submission.name} Contribution`
    : `${props.submission.name} Artwork`
  previewTagline.value = participation ? `By ${creatorName(participation)}` : ''
  previewOpen.value = true
}

const locationFromElement = (element) => {
  if (!element) return null
  if (element.dataset.compositionZone === 'pool') return { type: 'pool' }

  return {
    type: 'slot',
    edition: Number(element.dataset.edition),
    index: Number(element.dataset.index),
  }
}

const { dragging } = useDragAndDrop({
  root: workspace,
  itemSelector: '.composition-piece',
  zoneSelector: '[data-composition-zone]',
  onDrop: ({ item, from, to }) => {
    const image = imageByUuid.value.get(item.dataset.imageUuid)
    const target = locationFromElement(to)
    const source = locationFromElement(from)
    if (!image || !target || !source) return

    movePiece(
      {
        image,
        from: source,
        participationId: Number(item.dataset.participationId) || undefined,
      },
      target,
    )
  },
})

// Saves are queued rather than blocking: every drop lands immediately and the
// requests go out one after another, in the order they were made.
let saveQueue = Promise.resolve()
let saveGeneration = 0

const persist = async (body, snapshot) => {
  try {
    const response = await $fetch(
      `${config.public.opepenApi}/set-submissions/${props.submission.uuid}/images`,
      {
        method: 'POST',
        credentials: 'include',
        body,
      },
    )

    const updatedSubmission = {
      ...props.submission,
      ...response,
      participationImages: props.submission.participationImages,
    }

    // Only the last save in flight may overwrite the board, so a slow response
    // can't undo a move the user has already made.
    if (pendingSaves.value === 1) slots.value = createCompositionSlots(updatedSubmission)

    lastSaved.value = Date.now()
    emit('updated', updatedSubmission)
  } catch (error) {
    // Roll back to the last state the server confirmed and drop whatever was
    // queued behind this change, since it was built on top of it.
    slots.value = snapshot
    saveGeneration += 1
    errorMessage.value = error?.data?.message || 'The new arrangement could not be saved.'
  }
}

const movePiece = (piece, to) => {
  errorMessage.value = ''

  if (to.type === 'pool' && piece.from.type === 'slot' && !participationFor(piece.image)) {
    errorMessage.value = 'Only contributed pieces can be returned to the contribution pool.'
    return
  }

  const snapshot = slots.value
  const result = applyCompositionDrop({
    slots: slots.value,
    image: piece.image,
    from: piece.from,
    to,
  })

  if (!result.changes.length) return

  slots.value = result.slots

  const body = createCompositionUpdateBody({
    submission: props.submission,
    changes: result.changes,
    participationId: result.changes.some((change) => change.image?.uuid === piece.image.uuid)
      ? piece.participationId
      : undefined,
  })

  const generation = saveGeneration
  pendingSaves.value += 1
  saveQueue = saveQueue
    .then(() => (generation === saveGeneration ? persist(body, snapshot) : undefined))
    .finally(() => {
      pendingSaves.value -= 1
    })
}

watch(
  () => props.submission,
  (submission) => {
    if (!saving.value) slots.value = createCompositionSlots(submission)
  },
)
</script>

<style scoped>
.composition-workspace {
  --composition-gap: var(--spacer-sm);
  --composition-section-gap: var(--spacer);
  display: grid;
  gap: var(--composition-section-gap);
}

.panel-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--composition-gap);
}

.panel-header > div {
  display: grid;
  gap: var(--size-1);
}

.panel-header small {
  color: var(--muted);
}

.save-status {
  @mixin ui-font;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  justify-self: end;
  color: var(--muted);
  white-space: nowrap;
}

.save-status-label {
  width: 14ch;
  text-align: right;
}

.composition-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--composition-gap);
  align-items: start;
}

.panel {
  min-width: 0;
  padding: var(--composition-section-gap);
  background: var(--gray-z-1);
  border: var(--border);
  border-radius: var(--border-radius);
}

.pool-panel {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: var(--composition-section-gap);
  min-height: 0;
  height: 22rem;
}

.pool-controls {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 7.5rem;
  gap: var(--composition-gap);
}

.pool-scroll {
  position: relative;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
}

.pool-grid {
  display: grid;
  gap: var(--composition-gap);
  min-height: 100%;
  align-content: start;
  border-radius: var(--border-radius);
  transition: background-color var(--speed);

  &.is-drop-target {
    background: var(--gray-z-2);
    box-shadow: inset 0 0 0 1px var(--gray-z-5);
  }
}

.empty-pool {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: var(--composition-section-gap);
  color: var(--muted);
  text-align: center;
  pointer-events: none;
}

.edition-board,
.edition-rows {
  display: grid;
  gap: var(--composition-section-gap);
}

.edition-board {
  grid-template-rows: auto minmax(0, 1fr);
}

.edition-rows {
  align-content: start;
}

.edition-row {
  display: grid;
  grid-template-columns: var(--size-10) minmax(0, 1fr);
  gap: var(--composition-gap);
  align-items: start;

  > header {
    @mixin ui-font;
    display: grid;
    gap: var(--size-1);
    padding-top: var(--size-1);

    small {
      color: var(--muted);
    }
  }
}

.edition-slots {
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  gap: var(--size-1);
}

.composition-slot {
  position: relative;
  display: grid;
  width: auto;
  overflow: hidden;
  background: var(--gray-z-2);
  border: var(--border);
  border-radius: var(--border-radius);
  transition:
    background-color var(--speed),
    border-color var(--speed),
    transform var(--speed);

  .composition-piece {
    position: absolute;
    inset: 0;
    border: 0;
  }

  &.is-drop-target {
    background: var(--gray-z-4);
    border-color: var(--color);
    transform: scale(1.06);
    z-index: 2;
  }
}

.slot-number {
  @mixin ui-font;
  place-self: center;
  color: var(--muted);
  font-size: var(--font-xs);
  pointer-events: none;
}

/* Drop targets are hit tested under the pointer, so nothing may swallow it. */
.dragging {
  .composition-piece,
  .composition-piece :deep(*) {
    pointer-events: none;
  }
}

@media (--lg) {
  .composition-layout {
    grid-template-columns: minmax(18rem, 22rem) minmax(0, 1fr);
    align-items: stretch;
  }

  /* `contain: size` keeps the (very tall) pool from sizing the row, so the
     panel matches the board and follows it down the page. */
  .pool-panel {
    position: sticky;
    top: var(--spacer);
    contain: size;
    height: auto;
    max-height: calc(100dvh - var(--spacer) * 2);
    overflow: hidden;
  }
}
</style>
