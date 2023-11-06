<template>
  <article>
    <h1>User Settings</h1>
    <form @submit.prevent="save" v-if="session">
      <ImageUpload @stored="pfp = $event" @reset="pfp = null" name="PFP" :image="pfp" class="pfp" />
      <ImageUpload @stored="cover = $event" @reset="cover = null" name="Cover Photo" :image="cover" class="cover" />
      <label class="name">
        <span class="label">Name</span>
        <input v-model="name" placeholder="Your display name" />
      </label>
      <label class="email">
        <span class="label">E-Mail</span>
        <input v-model="email" placeholder="Your Email" type="email" />
      </label>
      <label class="checkbox">
        <input type="checkbox" v-model="notificationNewSet">
        <span>New Set Notification</span>
      </label>

      <hr>

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

      <footer class="actions">
        <small class="muted" v-if="lastSaved">Last saved {{ lastSavedAt }}</small>
        <Button type="submit" :disabled="saving">
          <span v-if="saving">Saving...</span>
          <span v-else>Save</span>
        </Button>
      </footer>
    </form>
  </article>
</template>

<script setup>
import { DateTime } from 'luxon'
import { useAccount, useEnsName } from '~/helpers/use-wagmi'
import { useSignIn } from '~/helpers/siwe'
import { formatTime } from '~/helpers/dates'

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
const socials = ref(settings.value?.socials || [])

const updateData = (data = {}) => {
  pfp.value = data?.pfp
  cover.value = data?.coverImage
  name.value = data?.name || ens.value
  email.value = data?.email
  notificationNewSet.value = data?.notification_new_set

  tagline.value = data?.tagline
  quote.value = data?.quote
  bio.value = data?.bio
  socials.value = data?.socials
}

watch([status, settings, ens], () => updateData(settings.value))

const saving = ref(false)
const lastSaved = ref(null)
const lastSavedAt = computed(() => lastSaved.value ? formatTime(lastSaved.value) : '')

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
        socials: socials.value,
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

  footer {
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
  }
</style>
