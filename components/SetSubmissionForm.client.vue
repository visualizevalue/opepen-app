<template>
  <form @submit.stop.prevent="store">
    <Alert v-if="toSign" class="span-2 inline">
      <p>Artist Signature: Thank you so much for your contribution to Opepen. Please sign this set.</p>

      <div class="actions">
        <SignSet :data="data" @signed="markSigned" />
      </div>
    </Alert>
    <Alert v-else-if="isPublishedToSet" class="span-2 inline">
      <p>Note: This submission is published to <NuxtLink :to="`/sets/${data.set_id}`">set {{ pad(data.set_id, 3) }}</NuxtLink>. Changes here won't be immediately published, and manually reviewed by the VV team.</p>

      <div class="actions">
        <Button :to="`/sets/${data.set_id}`">View Set</Button>
      </div>
    </Alert>

    <label class="name">
      <span class="label">Name</span>
      <input type="text" v-model="name" placeholder="Set Name" required />
    </label>

    <div class="images">
      <ImageUpload @stored="image1 = $event" name="1/1 Media" :image="image1" />
      <ImageUpload @stored="image4 = $event" name="1/4 Media" :image="image4" />
      <ImageUpload @stored="image5 = $event" name="1/5 Media" :image="image5" />
      <ImageUpload @stored="image10 = $event" name="1/10 Media" :image="image10" />
      <ImageUpload @stored="image20 = $event" name="1/20 Media" :image="image20" />
      <ImageUpload @stored="image40 = $event" name="1/40 Media" :image="image40" />
    </div>

    <div class="names">
      <span class="label">Edition Names</span>
      <div>
        <div><Image :image="image1" /></div>
        <input type="text" v-model="name1"  placeholder="1/1 Name" />
      </div>
      <div>
        <div><Image :image="image4" /></div>
        <input type="text" v-model="name4"  placeholder="1/4 Name" />
      </div>
      <div>
        <div><Image :image="image5" /></div>
        <input type="text" v-model="name5"  placeholder="1/5 Name" />
      </div>
      <div>
        <div><Image :image="image10" /></div>
        <input type="text" v-model="name10" placeholder="1/10 Name" />
      </div>
      <div>
        <div><Image :image="image20" /></div>
        <input type="text" v-model="name20" placeholder="1/20 Name" />
      </div>
      <div>
        <div><Image :image="image40" /></div>
        <input type="text" v-model="name40" placeholder="1/40 Name" />
      </div>
    </div>

    <label class="description">
      <span class="label">Description</span>
      <Input v-model="description" placeholder="Description" />
    </label>

    <label class="artist">
      <span class="label">Artist</span>
      <input type="text" v-model="artist" placeholder="Your artist name" />
    </label>

    <label class="type">
      <span class="label">Edition Type</span>
      <select v-model="type" class="input">
        <option value="PRINT" default>Prints</option>
        <option value="NUMBERED_PRINT" default>Numbered Prints</option>
        <option value="DYNAMIC">Dynamic</option>
      </select>
      <aside class="note" v-if="isDynamic">
        The VV team will reach out to gather the dynamic images before launching your set.
      </aside>
    </label>

    <div class="actions">
      <small class="muted" v-if="lastSaved">Last saved {{ lastSavedAt }}</small>
      <Button type="submit" :disabled="saving">
        <span v-if="saving">Saving...</span>
        <span v-else>Save</span>
      </Button>

      <NotifySetPublicationForm v-if="isAdmin && data.set_id" :submission="data" />
      <PublishSetSubmissionForm v-if="isAdmin" :submission="data" />
    </div>
  </form>
</template>

<script setup>
import { DateTime } from 'luxon'
import { useAccount, useEnsName } from '~/helpers/use-wagmi'
import { useSignIn, isAdmin } from '~/helpers/siwe'
import { formatTime } from '~/helpers/dates'
import pad from '~/helpers/pad'

const config = useRuntimeConfig()
const router = useRouter()
const route = useRoute()

const { data } = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
})
const emit = defineEmits(['updated'])

const { session, signIn } = useSignIn()
const { address } = useAccount()
const ens = useEnsName(address)
watch(session, async (_, previous) => {
  if (previous === null) return

  if (! session.value) {
    await signIn()
  }
})

const isCreator = computed(() => address.value?.toLowerCase() === data.creator)

const name = ref(data.name || '')
const image1 = ref(data.edition1Image || null)
const image4 = ref(data.edition4Image || null)
const image5 = ref(data.edition5Image || null)
const image10 = ref(data.edition10Image || null)
const image20 = ref(data.edition20Image || null)
const image40 = ref(data.edition40Image || null)
const name1 = ref(data.edition1Name || '')
const name4 = ref(data.edition4Name || '')
const name5 = ref(data.edition5Name || '')
const name10 = ref(data.edition10Name || '')
const name20 = ref(data.edition20Name || '')
const name40 = ref(data.edition40Name || '')
const description = ref(data.description || '')
const artist = ref(data.artist)
const type = ref(data.edition_type)
const isDynamic = computed(() => type.value !== 'PRINT')
const isSigned = ref(!!data.artist_signature)
const isPublishedToSet = computed(() => !!data.set_id)
const toSign = computed(() =>
  isCreator.value &&
  isPublishedToSet.value &&
  !isSigned.value
)
const markSigned = (set) => {
  isSigned.value = !!set.artist_signature
  emit('updated', set)
}
watch(ens, () => {
  if (data.creator !== address.value.toLowerCase()) return

  artist.value = data.artist || ens.value || ''
})

const saving = ref(false)
const lastSaved = ref(null)
const lastSavedAt = computed(() => lastSaved.value ? formatTime(lastSaved.value) : '')
const store = async () => {
  if (! session.value) await signIn()

  saving.value = true

  const url = data?.uuid
    ? `${config.public.opepenApi}/set-submissions/${data.uuid}`
    : `${config.public.opepenApi}/set-submissions`

  const set = await $fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
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
    })
  })

  saving.value = false
  lastSaved.value = DateTime.now()

  emit('updated', set)

  if (! data?.uuid && set?.uuid) {
    router.replace(`/create/sets/${set.uuid}`)
  }
}
</script>

<style lang="postcss" scoped>
form {
  display: grid;
  gap: var(--size-7);
  margin: var(--size-7) 0;

  @media (--lg) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    .name,
    .description,
    .actions,
    .span-2 {
      grid-column: span 2;
    }
  }

  .images {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--size-5);

    :first-child {
      grid-column: span 2;
      grid-row: span 2;
    }
  }

  .names {
    display: grid;
    gap: var(--size-4);
    padding: var(--size-3) var(--size-4) var(--size-4);
    background: var(--gray-z-1);
    border: var(--border-dark);
    border-radius: var(--size-5);
    border-top-left-radius: var(--size-1);

    > .label {
      margin: var(--size-1) 0 0;
    }

    > div {
      display: flex;
      height: var(--size-8);

      :deep(.image) {
        width: var(--size-8);
        height: var(--size-8);
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      input {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }

  > .actions {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    gap: var(--size-4);

    :deep(button) {
      min-height: var(--size-8);
    }
  }
}
</style>
