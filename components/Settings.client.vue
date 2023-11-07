<template>
  <article>
    <h1>User Settings</h1>
    <hr>
    <form @submit.prevent="save" v-if="session">
      <ImageUpload @stored="pfp = $event" @reset="pfp = null" name="PFP" :image="pfp" class="pfp" />
      <ImageUpload @stored="cover = $event" @reset="cover = null" name="Cover Photo" :image="cover" class="cover" />

      <label class="name">
        <span class="label">Name</span>
        <input v-model="name" placeholder="Your display name" />
      </label>
      <label class="tagline">
        <span class="label">Tagline</span>
        <input v-model="tagline" placeholder="You in 1-5 words" />
      </label>
      <label class="quote">
        <span class="label">Quote</span>
        <Input v-model="quote" placeholder="A quote from you" />
      </label>
      <label class="bio">
        <span class="label">Bio</span>
        <Input v-model="bio" placeholder="A short bio" />
      </label>

      <SaveSettings :lastSaved="lastSaved" :saving="saving" />

      <hr>

      <div>
        <span class="label">Social Links</span>
        <SortableList :items="socials" @update="socials = $event" class="socials">
          <template v-slot="{ item, index }">
            <input type="text" :value="item.url" @input="socials[index].url = $event.target.value">
          </template>
        </SortableList>
      </div>

      <SaveSettings :lastSaved="lastSaved" :saving="saving" />

      <hr>

      <label class="email">
        <span class="label">E-Mail</span>
        <input v-model="email" placeholder="Your Email" type="email" />
      </label>
      <label class="checkbox">
        <input type="checkbox" v-model="notificationNewSet">
        <span>New Set Notification</span>
      </label>

      <SaveSettings :lastSaved="lastSaved" :saving="saving" />
    </form>
  </article>
</template>

<script setup>
import { DateTime } from 'luxon'
import { useAccount, useEnsName } from '~/helpers/use-wagmi'
import { useSignIn } from '~/helpers/siwe'
import { validateURI } from '~/helpers/urls'

const config = useRuntimeConfig()
const router = useRouter()

const { session } = useSignIn()
const { address } = useAccount()
const ens = useEnsName(address)

if (! session.value) router.replace('/')

const url = `${config.public.opepenApi}/accounts/settings`
const { data: settings, status, execute } = await useFetch(url, { credentials: 'include' })

const pfp = ref(settings.value?.pfp || null)
const cover = ref(settings.value?.coverImage || null)
const name = ref(settings.value?.name || ens.value)
const email = ref(settings.value?.email)
const notificationNewSet = ref(settings.value?.notification_new_set)

const tagline = ref(settings.value?.tagline || '')
const quote = ref(settings.value?.quote || '')
const bio = ref(settings.value?.bio || '')

const withEmptySocialsItem = list => {
  if (list[list.length - 1].url !== '') {
    list.push({ id: list.length, url: '' })
  }

  return list
}
const sortableSocials = list => {
  const array = Array.isArray(list)
    ? list.map((url, id) => ({ id, url }))
    : [{ id: 0, url: '' }]

  return withEmptySocialsItem(array)
}
const socials = ref(sortableSocials(settings.value?.socials))
watch(() => JSON.stringify(socials.value), () => socials.value = withEmptySocialsItem(socials.value))

const updateData = (data = {}) => {
  pfp.value = data?.pfp
  cover.value = data?.coverImage
  name.value = data?.name || ens.value
  email.value = data?.email
  notificationNewSet.value = data?.notification_new_set

  tagline.value = data?.tagline
  quote.value = data?.quote
  bio.value = data?.bio
  socials.value = sortableSocials(data?.socials)
}

watch([status, settings, ens], () => updateData(settings.value))

const saving = ref(false)
const lastSaved = ref(null)

const save = async () => {
  saving.value = true
  try {
    const data = await $fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        notification_new_set: notificationNewSet.value,
        pfp_image_id: pfp.value?.uuid || null,
        cover_image_id: cover.value?.uuid || null,
        tagline: tagline.value,
        quote: quote.value,
        bio: bio.value,
        socials: socials.value?.map(s => s.url).filter(s => validateURI(s)),
      })
    })
    updateData(data)

    lastSaved.value = DateTime.now()
  } catch (e) {
    // ...
  }

  saving.value = false
}
</script>

<style lang="postcss" scoped>
  article, article form {
    display: grid;
    gap: var(--size-5)
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--size-4);
  }

  h1 {
    font-size: var(--font-lg);
  }

  .pfp {
    max-width: 10rem;

    :deep(.reset) {
      top: 0;
      right: 0;
    }
  }

  .pfp,
  .pfp :deep(.image) {
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
    border-bottom-left-radius: 50%;
  }

  .cover {
    :deep(label) {
      height: 33cqw;
    }

    + .name {
      margin-top: var(--size-6);
    }
  }

  hr {
    margin: var(--size-7) 0;
  }

  .socials {
    margin-top: var(--size-2);
  }
</style>
