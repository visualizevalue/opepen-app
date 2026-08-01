<template>
  <div ref="workspace" class="composition-workspace" :class="{ saving }">
    <header class="workspace-header">
      <div>
        <SectionTitle>Arrange Contributions</SectionTitle>
        <p>Drag pieces between the pool and edition slots. Changes save automatically.</p>
      </div>

      <div class="save-status" aria-live="polite">
        <Loading v-if="saving" />
        <Icon v-else-if="lastSaved" type="check" />
        <span>{{ saveStatus }}</span>
      </div>
    </header>

    <Alert v-if="errorMessage" class="inline">
      <p>{{ errorMessage }}</p>
    </Alert>

    <div class="composition-layout">
      <aside class="pool-panel panel">
        <header class="panel-header">
          <div>
            <SectionTitle>Contribution Pool</SectionTitle>
            <small>{{ availableParticipations.length }} available</small>
          </div>

          <Button
            v-if="pickedPiece"
            class="small"
            @click="canReturnPickedPiece ? movePickedToPool() : clearPickedPiece()"
          >
            {{ canReturnPickedPiece ? 'Return to pool' : 'Cancel' }}
          </Button>
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

        <div class="pool-scroll">
          <div
            class="pool-grid composition-drop-zone"
            data-composition-zone="pool"
            :aria-busy="saving"
          >
            <SetCompositionPiece
              v-for="participation in displayedParticipations"
              :key="participation.id"
              :image="participation.image"
              :participation="participation"
              :picked="isPicked(participation.image)"
              show-meta
              @click="pickPiece(participation.image, { type: 'pool' }, participation.id)"
            />

            <p v-if="!displayedParticipations.length" class="empty-pool">
              {{ search ? 'No matching contributions' : 'All contributions are selected' }}
            </p>
          </div>
        </div>
      </aside>

      <section class="edition-board panel">
        <header class="panel-header">
          <div>
            <SectionTitle>Edition Board</SectionTitle>
            <small>{{ selectedCount }} / {{ slotCount }} slots filled</small>
          </div>
          <Button v-if="pickedPiece" class="small" @click="clearPickedPiece">
            Cancel selection
          </Button>
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
                :class="{ filled: image, target: pickedPiece && !isPicked(image) }"
                data-composition-zone="slot"
                :data-edition="edition"
                :data-index="offset + 1"
                :style="{ aspectRatio: submission.aspect_ratio || '1' }"
                :role="image ? undefined : 'button'"
                :tabindex="image ? undefined : 0"
                :aria-label="image ? undefined : `Empty 1/${edition} slot ${offset + 1}`"
                @click="placePickedPiece({ type: 'slot', edition, index: offset + 1 })"
                @keydown.enter.prevent="
                  placePickedPiece({ type: 'slot', edition, index: offset + 1 })
                "
                @keydown.space.prevent="
                  placePickedPiece({ type: 'slot', edition, index: offset + 1 })
                "
              >
                <SetCompositionPiece
                  v-if="image"
                  :image="image"
                  :participation="participationFor(image)"
                  :picked="isPicked(image)"
                  @click.stop="
                    pickOrPlacePiece(image, { type: 'slot', edition, index: offset + 1 })
                  "
                />
                <span v-else class="slot-number">{{ offset + 1 }}</span>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import Sortable from 'sortablejs'
import {
  applyCompositionDrop,
  createCompositionSlots,
  createCompositionUpdateBody,
  selectedCompositionImageUuids,
} from '~/utils/set-composition'

const props = defineProps({
  submission: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['updated'])
const config = useRuntimeConfig()

const workspace = ref(null)
const slots = ref(createCompositionSlots(props.submission))
const saving = ref(false)
const errorMessage = ref('')
const lastSaved = ref(null)
const search = ref('')
const sort = ref('recent')
const pickedPiece = ref(null)
const sortables = []

const participations = computed(() => props.submission.participationImages || [])
const selectedImageUuids = computed(() => selectedCompositionImageUuids(slots.value))
const availableParticipations = computed(() =>
  participations.value.filter(
    (participation) => !selectedImageUuids.value.has(participation.image?.uuid),
  ),
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
  const query = search.value.trim().toLowerCase()
  const filtered = query
    ? availableParticipations.value.filter((participation) =>
        [
          participation.image?.uuid,
          participation.creator?.display,
          participation.creator?.address,
        ].some((value) => value?.toLowerCase().includes(query)),
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

const selectedCount = computed(() => Object.values(slots.value).flat().filter(Boolean).length)
const slotCount = computed(() => Object.values(slots.value).flat().length)
const canReturnPickedPiece = computed(
  () =>
    pickedPiece.value?.from.type === 'slot' &&
    !!participationByImageUuid.value.get(pickedPiece.value.image.uuid),
)
const saveStatus = computed(() => {
  if (saving.value) return 'Saving…'
  if (lastSaved.value) return 'Saved'
  return 'Autosave ready'
})

const creatorName = (participation) =>
  participation.creator?.display || participation.creator?.address || 'Unknown artist'
const participationFor = (image) => participationByImageUuid.value.get(image?.uuid)
const filledSlotCount = (edition) => slots.value[edition].filter(Boolean).length
const isPicked = (image) => pickedPiece.value?.image.uuid === image?.uuid

const clearPickedPiece = () => {
  pickedPiece.value = null
}

const pickPiece = (image, from, participationId) => {
  if (saving.value) return

  if (isPicked(image)) {
    clearPickedPiece()
    return
  }

  pickedPiece.value = { image, from, participationId }
}

const pickOrPlacePiece = (image, location) => {
  if (!pickedPiece.value || isPicked(image)) {
    pickPiece(image, location, participationFor(image)?.id)
    return
  }

  movePiece(pickedPiece.value, location)
}

const placePickedPiece = (location) => {
  if (pickedPiece.value) movePiece(pickedPiece.value, location)
}

const movePickedToPool = () => {
  if (pickedPiece.value) movePiece(pickedPiece.value, { type: 'pool' })
}

const restoreDraggedElement = (event) => {
  if (event.from === event.to) return

  const siblings = [...event.from.children].filter((element) => element !== event.item)
  event.from.insertBefore(event.item, siblings[event.oldIndex] || null)
}

const locationFromElement = (element) => {
  if (element.dataset.compositionZone === 'pool') return { type: 'pool' }

  return {
    type: 'slot',
    edition: Number(element.dataset.edition),
    index: Number(element.dataset.index),
  }
}

const handleDrop = (event) => {
  restoreDraggedElement(event)

  const image = imageByUuid.value.get(event.item.dataset.imageUuid)
  if (!image) return

  movePiece(
    {
      image,
      from: locationFromElement(event.from),
      participationId: Number(event.item.dataset.participationId) || undefined,
    },
    locationFromElement(event.to),
  )
}

const movePiece = async (piece, to) => {
  if (saving.value) return

  errorMessage.value = ''

  if (to.type === 'pool' && piece.from.type === 'slot' && !participationFor(piece.image)) {
    errorMessage.value = 'Only contributed pieces can be returned to the contribution pool.'
    return
  }

  const previousSlots = slots.value
  const result = applyCompositionDrop({
    slots: slots.value,
    image: piece.image,
    from: piece.from,
    to,
  })

  if (!result.changes.length) {
    clearPickedPiece()
    return
  }

  slots.value = result.slots
  clearPickedPiece()
  saving.value = true

  try {
    const response = await $fetch(
      `${config.public.opepenApi}/set-submissions/${props.submission.uuid}/images`,
      {
        method: 'POST',
        credentials: 'include',
        body: createCompositionUpdateBody({
          submission: props.submission,
          changes: result.changes,
          participationId: result.changes.some(
            (change) => change.image?.uuid === piece.image.uuid,
          )
            ? piece.participationId
            : undefined,
        }),
      },
    )
    const updatedSubmission = {
      ...props.submission,
      ...response,
      participationImages: props.submission.participationImages,
    }

    slots.value = createCompositionSlots(updatedSubmission)
    lastSaved.value = Date.now()
    emit('updated', updatedSubmission)
  } catch (error) {
    slots.value = previousSlots
    errorMessage.value = error?.data?.message || 'The new arrangement could not be saved.'
  } finally {
    saving.value = false
  }
}

const initializeSortables = () => {
  for (const element of workspace.value?.querySelectorAll('[data-composition-zone]') || []) {
    sortables.push(
      Sortable.create(element, {
        group: 'set-composition',
        animation: 150,
        sort: false,
        draggable: '.composition-piece',
        emptyInsertThreshold: 24,
        onEnd: handleDrop,
      }),
    )
  }
}

watch(saving, (disabled) => {
  for (const sortable of sortables) sortable.option('disabled', disabled)
})

watch(
  () => props.submission,
  (submission) => {
    if (!saving.value) slots.value = createCompositionSlots(submission)
  },
)

onMounted(initializeSortables)
onBeforeUnmount(() => {
  for (const sortable of sortables) sortable.destroy()
})
</script>

<style scoped>
.composition-workspace {
  --composition-tile: clamp(2.75rem, 4vw, 3.75rem);
  display: grid;
  gap: var(--spacer);
}

.workspace-header,
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacer-sm);
}

.workspace-header p,
.panel-header small {
  color: var(--muted);
}

.save-status {
  @mixin ui-font;
  display: flex;
  align-items: center;
  gap: var(--size-2);
  color: var(--muted);
  white-space: nowrap;

  .icon {
    width: var(--size-4);
    height: var(--size-4);
  }
}

.composition-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacer);
  align-items: start;
}

.panel {
  min-width: 0;
  padding: var(--spacer-sm);
  background: var(--gray-z-1);
  border: var(--border);
  border-radius: var(--border-radius);
}

.pool-panel {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: var(--spacer-sm);
  height: 20rem;
}

.pool-controls {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--size-2);
}

.pool-scroll {
  min-height: 0;
  overflow-y: auto;
}

.pool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(4.25rem, 1fr));
  gap: var(--size-2);
  min-height: 100%;
  align-content: start;
}

.empty-pool {
  grid-column: 1 / -1;
  padding: var(--spacer);
  color: var(--muted);
  text-align: center;
}

.edition-board,
.edition-rows {
  display: grid;
  gap: var(--spacer-sm);
}

.edition-row {
  display: grid;
  grid-template-columns: var(--size-10) minmax(0, 1fr);
  gap: var(--spacer-sm);
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
  grid-template-columns: repeat(10, minmax(2.25rem, 1fr));
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
    border-color var(--speed);

  &.target:hover {
    background: var(--gray-z-3);
    border-color: var(--color);
    cursor: pointer;
  }

  .composition-piece {
    position: absolute;
    inset: 0;
    border: 0;
  }
}

.slot-number {
  @mixin ui-font;
  place-self: center;
  color: var(--muted);
  font-size: var(--font-xs);
  pointer-events: none;
}

.saving .composition-piece {
  cursor: wait;
  opacity: 0.65;
}

@media (--md) {
  .composition-layout {
    grid-template-columns: minmax(15rem, 20rem) minmax(0, 1fr);
  }

  .pool-panel {
    position: sticky;
    top: var(--spacer-sm);
    height: calc(100dvh - 2 * var(--spacer));
  }

  .edition-slots {
    grid-template-columns: repeat(10, var(--composition-tile));
  }

  .composition-slot {
    width: var(--composition-tile);
  }
}
</style>
