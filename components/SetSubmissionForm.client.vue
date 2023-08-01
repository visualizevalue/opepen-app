<template>
  <form @submit.stop.prevent="store">
    <label class="name">
      <span class="label">Name</span>
      <input type="text" v-model="name" placeholder="Set Name" />
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
        <input type="text" v-model="name1"  :placeholder="image1 ?  '1/1 Name' :  'Upload 1/1 Media'" :disabled="! image1" />
      </div>
      <div>
        <div><Image :image="image4" /></div>
        <input type="text" v-model="name4"  :placeholder="image4 ?  '1/4 Name' :  'Upload 1/4 Media'" :disabled="! image4" />
      </div>
      <div>
        <div><Image :image="image5" /></div>
        <input type="text" v-model="name5"  :placeholder="image5 ?  '1/5 Name' :  'Upload 1/5 Media'" :disabled="! image5" />
      </div>
      <div>
        <div><Image :image="image10" /></div>
        <input type="text" v-model="name10" :placeholder="image10 ? '1/10 Name' : 'Upload 1/10 Media'" :disabled="! image10" />
      </div>
      <div>
        <div><Image :image="image20" /></div>
        <input type="text" v-model="name20" :placeholder="image20 ? '1/20 Name' : 'Upload 1/20 Media'" :disabled="! image20" />
      </div>
      <div>
        <div><Image :image="image40" /></div>
        <input type="text" v-model="name40" :placeholder="image40 ? '1/40 Name' : 'Upload 1/40 Media'" :disabled="! image40" />
      </div>
    </div>

    <label class="description">
      <span class="label">Description</span>
      <Input v-model="description" placeholder="Description" />
    </label>

    <div class="actions">
      <Button type="submit">Save</Button>
    </div>
  </form>
</template>

<script setup>
import { useSignIn } from '~/helpers/siwe'

const config = useRuntimeConfig()
const router = useRouter()

const { data } = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
})
const emit = defineEmits(['updated'])

const { session, signIn } = useSignIn()
watch(session, async (_, previous) => {
  if (previous === null) return

  if (! session.value) {
    await signIn()
  }
})

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

const store = async () => {
  if (! session.value) await signIn()

  const url = data?.uuid
    ? `${config.public.opepenApi}/set-submissions/${data.uuid}`
    : `${config.public.opepenApi}/set-submissions`

  const set = await $fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
      name: name.value,
      description: description.value,
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
    .actions {
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
    padding: var(--size-3) var(--size-4);
    background: var(--gray-z-1);
    border: var(--border-dark);
    border-radius: var(--size-5);
    border-top-left-radius: var(--size-1);

    > .label {
      margin: var(--size-2) 0 0;
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

  .actions {
    display: flex;
    justify-content: flex-end;

    button {
      min-height: var(--size-8);
    }
  }
}
</style>
