<template>
  <form @submit.stop.prevent="store">
    <PageHeader>
      <SectionTitle>
        <span v-if="data.set_id">Permanent collection set</span>
        <span v-else>Update submission</span>
      </SectionTitle>

      <Actions>
        <small class="muted" v-if="lastSaved">Last saved {{ lastSavedAt }}</small>
        <SetEditOptions
          :submission="data"
          :refresh="refresh"
          :data-complete="dataComplete"
          @save="store"
        />
      </Actions>
    </PageHeader>

    <Alert v-if="!hasPreviewImages">
      <p>Base your art on the opepen schematics...</p>

      <Actions>
        <Button
          to="https://raw.githubusercontent.com/visualizevalue/opepen-api/refs/heads/main/app/Services/OpepenSVG/opepen-schematics.svg"
          target="_blank"
          class="small"
        >
          <Icon type="external-link" />
          <span>Opepen Schematics</span>
        </Button>
      </Actions>
    </Alert>

    <Alert v-if="toSign" class="inline">
      <p>Artist Signature: You can sign your set via an onchain transaction.</p>

      <Actions>
        <SignSet :data="data" @signed="markSigned" />
      </Actions>
    </Alert>

    <Card class="static grid meta" :disabled="disabled">
      <label class="name span-2">
        <input
          class="input"
          type="text"
          v-model="name"
          placeholder="Set Name"
          :disabled="disabled"
          required
        />
      </label>

      <div class="images">
        <ImageUpload
          @stored="image1 = $event"
          name="1/1 Media"
          :image="image1"
          :disabled="disabled"
        />
        <ImageUpload
          @stored="image4 = $event"
          name="1/4 Media"
          :image="image4"
          :disabled="disabled"
        />
        <ImageUpload
          @stored="image5 = $event"
          name="1/5 Media"
          :image="image5"
          :disabled="disabled"
        />
        <ImageUpload
          @stored="image10 = $event"
          name="1/10 Media"
          :image="image10"
          :disabled="disabled"
        />
        <ImageUpload
          @stored="image20 = $event"
          name="1/20 Media"
          :image="image20"
          :disabled="disabled"
        />
        <ImageUpload
          @stored="image40 = $event"
          name="1/40 Media"
          :image="image40"
          :disabled="disabled"
        />
      </div>
      <div class="names">
        <div>
          <div><Image :image="image1" /></div>
          <input type="text" v-model="name1" :disabled="disabled" placeholder="1/1 Name" />
        </div>
        <div>
          <div><Image :image="image4" /></div>
          <input type="text" v-model="name4" :disabled="disabled" placeholder="1/4 Name" />
        </div>
        <div>
          <div><Image :image="image5" /></div>
          <input type="text" v-model="name5" :disabled="disabled" placeholder="1/5 Name" />
        </div>
        <div>
          <div><Image :image="image10" /></div>
          <input type="text" v-model="name10" :disabled="disabled" placeholder="1/10 Name" />
        </div>
        <div>
          <div><Image :image="image20" /></div>
          <input type="text" v-model="name20" :disabled="disabled" placeholder="1/20 Name" />
        </div>
        <div>
          <div><Image :image="image40" /></div>
          <input type="text" v-model="name40" :disabled="disabled" placeholder="1/40 Name" />
        </div>
      </div>

      <label class="description span-2">
        <Input v-model="description" :disabled="disabled" placeholder="Description" />
      </label>

      <div v-if="imagesComplete" class="preview-links span-2">
        <Button :to="previewImageOG" target="_blank" class="small">
          <Icon type="external-link" />
          <span>Open Graph preview</span>
        </Button>
        <Button :to="previewImageSquare" target="_blank" class="small">
          <Icon type="external-link" />
          <span>Square preview</span>
        </Button>
        <Button @click="() => refreshPreview()" class="small">
          <Icon type="refresh-cw" />
          <span>Force Refresh</span>
        </Button>
      </div>
    </Card>

    <Card class="static" :disabled="disabled">
      <label class="artist">
        <span>Artist Name</span>
        <input
          class="input"
          type="text"
          v-model="artist"
          :disabled="disabled"
          placeholder="Your artist name"
        />
      </label>

      <label v-if="isAdmin" class="creator">
        <span>Creator Address (Ethereum Public Key)</span>
        <input
          class="input"
          v-model="creator"
          :disabled="disabled"
          :placeholder="data.creator"
        />
      </label>

      <label>
        <span>Co-Creator Addresses</span>
        <SortableList
          :items="coCreators"
          @update="coCreators = $event"
          class="co-creators"
          :disabled="disabled"
        >
          <template v-slot="{ item, index }">
            <input
              type="text"
              :value="item.address"
              @input="coCreators[index].address = $event.target.value"
              placeholder="0x000...000"
              :disabled="disabled"
              class="input"
            />
          </template>
        </SortableList>
      </label>
    </Card>

    <Card class="static" :disabled="disabled">
      <label class="type">
        <span>Edition Type</span>
        <select v-model="type" class="select" :disabled="disabled">
          <option value="DYNAMIC">Dynamic</option>
          <option value="PRINT" default>Prints</option>
          <option v-if="isAdmin" value="NUMBERED_PRINT" default>
            Numbered Prints (Admins only)
          </option>
        </select>
      </label>

      <DynamicImagesForm
        v-if="isDynamic && data.uuid"
        :set-submission-id="data.uuid"
        :dynamic-set-images="data.dynamicSetImages"
        :disabled="disabled"
        class="span-2"
      />
    </Card>

    <Card class="static" :disabled="disabled" v-if="!props.data.published_at">
      <label class="type">
        <span>Open For Participation</span>
        <select v-model="openForParticipation" class="select" :disabled="disabled">
          <option :value="false" default>Closed</option>
          <option :value="true">Open</option>
        </select>
        <p class="help-text" v-if="openForParticipation">
          This allows other creators to contribute ideas to your set.
        </p>
      </label>
    </Card>

    <Card class="static">
      <RichContentLinksForm
        title="Deep Dive Links"
        :loaded-links="data.richContentLinks"
        :new-link-data="{ address: data.creator, set_submission_id: data.id }"
      />
    </Card>
  </form>
</template>

<script setup>
import { watchDebounced } from '@vueuse/core'

const config = useRuntimeConfig()
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  refresh: Function,
})
const emit = defineEmits(['updated'])

const { account } = await useProfile()

const name = ref(props.data.name || '')
const image1 = ref(props.data.edition1Image || null)
const image4 = ref(props.data.edition4Image || null)
const image5 = ref(props.data.edition5Image || null)
const image10 = ref(props.data.edition10Image || null)
const image20 = ref(props.data.edition20Image || null)
const image40 = ref(props.data.edition40Image || null)
const name1 = ref(props.data.edition1Name || '')
const name4 = ref(props.data.edition4Name || '')
const name5 = ref(props.data.edition5Name || '')
const name10 = ref(props.data.edition10Name || '')
const name20 = ref(props.data.edition20Name || '')
const name40 = ref(props.data.edition40Name || '')
const description = ref(props.data.description || '')
const artist = ref(props.data.artist || account.value?.display)
const creator = ref(props.data.creator)
const openForParticipation = ref(!!props.data.open_for_participation)
const withEmptyCoCreators = (list) => {
  if (!list.length || list[list.length - 1].address !== '') {
    list.push({ id: list.length, address: '' })
  }

  return list
}
const sortableCoCreators = (list) => {
  const array = Array.isArray(list)
    ? list.filter((address) => !!address).map((address) => ({ id: address, address }))
    : [{ id: 0, address: '' }]

  return withEmptyCoCreators(array)
}
const coCreators = ref(
  sortableCoCreators(props.data.coCreators?.map((c) => c.account?.address || c.address) || []),
)
watch(
  () => JSON.stringify(coCreators.value),
  () => (coCreators.value = withEmptyCoCreators(coCreators.value)),
)
watch(account, () => {
  if (!artist.value) {
    artist.value = account.value?.display
  }
})
const hasPreviewImages = computed(
  () =>
    image1.value &&
    image4.value &&
    image5.value &&
    image10.value &&
    image20.value &&
    image40.value,
)
const previewImageSquare = computed(
  () => `${config.public.opepenApi}/render/sets/${props.data.uuid}/square`,
)
const previewImageOG = computed(
  () => `${config.public.opepenApi}/render/sets/${props.data.uuid}/og`,
)
const pendingPreviewRefresh = ref(false)
const refreshPreview = async () =>
  await Promise.all([
    $fetch(previewImageSquare.value, { method: 'POST' }),
    $fetch(previewImageOG.value, { method: 'POST' }),
  ])
watch([image1, image4, image5, image10, image20, image40, name], () => {
  if (!hasPreviewImages.value || !name.value) return
  pendingPreviewRefresh.value = true
})

const type = ref(props.data.edition_type || 'PRINT')
const isDynamic = computed(() => type.value !== 'PRINT')
const disabled = computed(
  () => !!(props.data.set_id || (!isAdmin.value && props.data.published_at)),
)
const imagesComplete = computed(() => {
  if (!isDynamic.value) return hasPreviewImages.value

  return (
    hasPreviewImages.value &&
    props.data.dynamicSetImages?.image4_1 &&
    props.data.dynamicSetImages?.image4_2 &&
    props.data.dynamicSetImages?.image4_3 &&
    props.data.dynamicSetImages?.image4_4 &&
    props.data.dynamicSetImages?.image5_1 &&
    props.data.dynamicSetImages?.image5_2 &&
    props.data.dynamicSetImages?.image5_3 &&
    props.data.dynamicSetImages?.image5_4 &&
    props.data.dynamicSetImages?.image5_5 &&
    props.data.dynamicSetImages?.image10_1 &&
    props.data.dynamicSetImages?.image10_2 &&
    props.data.dynamicSetImages?.image10_3 &&
    props.data.dynamicSetImages?.image10_4 &&
    props.data.dynamicSetImages?.image10_5 &&
    props.data.dynamicSetImages?.image10_6 &&
    props.data.dynamicSetImages?.image10_7 &&
    props.data.dynamicSetImages?.image10_8 &&
    props.data.dynamicSetImages?.image10_9 &&
    props.data.dynamicSetImages?.image10_10 &&
    props.data.dynamicSetImages?.image20_1 &&
    props.data.dynamicSetImages?.image20_2 &&
    props.data.dynamicSetImages?.image20_3 &&
    props.data.dynamicSetImages?.image20_4 &&
    props.data.dynamicSetImages?.image20_5 &&
    props.data.dynamicSetImages?.image20_6 &&
    props.data.dynamicSetImages?.image20_7 &&
    props.data.dynamicSetImages?.image20_8 &&
    props.data.dynamicSetImages?.image20_9 &&
    props.data.dynamicSetImages?.image20_10 &&
    props.data.dynamicSetImages?.image20_11 &&
    props.data.dynamicSetImages?.image20_12 &&
    props.data.dynamicSetImages?.image20_13 &&
    props.data.dynamicSetImages?.image20_14 &&
    props.data.dynamicSetImages?.image20_15 &&
    props.data.dynamicSetImages?.image20_16 &&
    props.data.dynamicSetImages?.image20_17 &&
    props.data.dynamicSetImages?.image20_18 &&
    props.data.dynamicSetImages?.image20_19 &&
    props.data.dynamicSetImages?.image20_20 &&
    props.data.dynamicSetImages?.image40_1 &&
    props.data.dynamicSetImages?.image40_2 &&
    props.data.dynamicSetImages?.image40_3 &&
    props.data.dynamicSetImages?.image40_4 &&
    props.data.dynamicSetImages?.image40_5 &&
    props.data.dynamicSetImages?.image40_6 &&
    props.data.dynamicSetImages?.image40_7 &&
    props.data.dynamicSetImages?.image40_8 &&
    props.data.dynamicSetImages?.image40_9 &&
    props.data.dynamicSetImages?.image40_10 &&
    props.data.dynamicSetImages?.image40_11 &&
    props.data.dynamicSetImages?.image40_12 &&
    props.data.dynamicSetImages?.image40_13 &&
    props.data.dynamicSetImages?.image40_14 &&
    props.data.dynamicSetImages?.image40_15 &&
    props.data.dynamicSetImages?.image40_16 &&
    props.data.dynamicSetImages?.image40_17 &&
    props.data.dynamicSetImages?.image40_18 &&
    props.data.dynamicSetImages?.image40_19 &&
    props.data.dynamicSetImages?.image40_20 &&
    props.data.dynamicSetImages?.image40_21 &&
    props.data.dynamicSetImages?.image40_22 &&
    props.data.dynamicSetImages?.image40_23 &&
    props.data.dynamicSetImages?.image40_24 &&
    props.data.dynamicSetImages?.image40_25 &&
    props.data.dynamicSetImages?.image40_26 &&
    props.data.dynamicSetImages?.image40_27 &&
    props.data.dynamicSetImages?.image40_28 &&
    props.data.dynamicSetImages?.image40_29 &&
    props.data.dynamicSetImages?.image40_30 &&
    props.data.dynamicSetImages?.image40_31 &&
    props.data.dynamicSetImages?.image40_32 &&
    props.data.dynamicSetImages?.image40_33 &&
    props.data.dynamicSetImages?.image40_34 &&
    props.data.dynamicSetImages?.image40_35 &&
    props.data.dynamicSetImages?.image40_36 &&
    props.data.dynamicSetImages?.image40_37 &&
    props.data.dynamicSetImages?.image40_38 &&
    props.data.dynamicSetImages?.image40_39 &&
    props.data.dynamicSetImages?.image40_40
  )
})
const dataComplete = computed(() => {
  return !!(
    name.value &&
    name1.value &&
    name4.value &&
    name5.value &&
    name10.value &&
    name20.value &&
    name40.value &&
    imagesComplete.value &&
    description.value &&
    artist.value &&
    type.value
  )
})
const isSigned = ref(!!props.data.artist_signature)
const isCreator = computed(() => currentAddress.value?.toLowerCase() === props.data.creator)
const toSign = computed(
  () => isCreator.value && !isSigned.value && dataComplete.value && !!props.data.published_at,
)
const markSigned = (set) => {
  isSigned.value = !!set.artist_signature
  emit('updated', set)
}

const saving = ref(false)
const lastSaved = ref(null)
const lastSavedAt = computed(() => (lastSaved.value ? formatTime(lastSaved.value) : ''))
const saveData = computed(() => ({
  name: name.value,
  description: description.value,
  artist: artist.value,
  edition_type: type.value,
  edition_1_image_id: image1.value?.uuid,
  edition_4_image_id: image4.value?.uuid,
  edition_5_image_id: image5.value?.uuid,
  edition_10_image_id: image10.value?.uuid,
  edition_20_image_id: image20.value?.uuid,
  edition_40_image_id: image40.value?.uuid,
  edition_1_name: name1.value,
  edition_4_name: name4.value,
  edition_5_name: name5.value,
  edition_10_name: name10.value,
  edition_20_name: name20.value,
  edition_40_name: name40.value,
  creator: creator.value,
  open_for_participation: openForParticipation.value,
  co_creators: coCreators.value
    .map((c) => c.address?.trim().toLowerCase())
    .filter((address) => address),
}))
const store = async () => {
  saving.value = true

  const set = await $fetch(`${config.public.opepenApi}/set-submissions/${props.data.uuid}`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ ...saveData.value }),
  })

  saving.value = false
  lastSaved.value = DateTime.now()

  if (pendingPreviewRefresh.value) {
    await refreshPreview()
  }

  emit('updated', set)

  if (!props.data?.uuid && set?.uuid) {
    await navigateTo(`/create/${set.uuid}`)
  }
}
watchDebounced(saveData, () => store(), {
  debounce: 500,
  maxWait: 2000,
  deep: true,
})

// Authentication
watchEffect(() => {
  if (!isAdmin.value && !isCreator.value) {
    showError({
      statusCode: 403,
      statusMessage: 'Not Authorized',
    })
  }
})
</script>

<style scoped>
form {
  > .card {
    pointer-events: none;

    &:not([disabled='true']) {
      pointer-events: all;
    }
  }
}

.actions {
  align-items: center;

  > small {
    @mixin ui-font;
    color: var(--muted);
    font-size: var(--font-xs);
  }
}

form,
form .card,
form .grid {
  display: grid;
  gap: var(--spacer);
}

.grid {
  @container page (min-width: 36rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    .span-2 {
      grid-column: span 2;
    }
  }
}

.meta {
  container-type: inline-size;

  @container page (min-width: 36rem) {
    grid-template-columns: max(20.8rem, 50cqw) 1fr;
  }
}

.images {
  height: min-content;
  align-self: center;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacer-sm);

  :first-child {
    grid-column: span 2;
    grid-row: span 2;
  }

  > * {
    object-fit: contain;
    aspect-ratio: 1;
  }
}

.preview-links {
  border-top: var(--border);
  padding-top: var(--spacer);
  display: flex;
  gap: var(--spacer-sm) var(--spacer);
  flex-wrap: wrap;
  align-items: center;

  p {
    @mixin ui-font;
    color: var(--gray-z-5);

    a:--highlight {
      color: var(--color);
    }
  }

  .button {
    text-decoration: none;
  }

  button.button {
    width: min-content;
    margin-left: auto;
  }
}

.names {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacer);

  label {
    margin: 0;
  }

  > div {
    display: flex;
    border: var(--border);
    border-radius: var(--border-radius);

    :deep(.image) {
      width: calc(var(--size-7) + var(--size-2));
      height: calc(var(--size-7) + var(--size-2));
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    input {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}

form {
  > .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--size-4);

    :deep(.button) {
      min-height: var(--size-8);
    }
  }

  .deep-dive {
    display: grid;
    gap: var(--size-5);
  }

  .help-text {
    @mixin ui-font;
    color: var(--muted);
    font-size: var(--font-xs);
    margin-top: var(--spacer-xs);
  }
}
</style>
