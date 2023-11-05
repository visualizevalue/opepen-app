<template>
  <article>
    <h1>User Settings</h1>
    <form @submit.prevent="save" v-if="session">
      <ImageUpload @stored="pfp = $event" @reset="pfp = null" name="PFP" :image="pfp" />
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
const name = ref(settings.value?.name || ens.value)
const email = ref(settings.value?.email)
const notificationNewSet = ref(settings.value?.notification_new_set)

const updateData = (data = {}) => {
  pfp.value = data?.pfp
  name.value = data?.name || ens.value
  email.value = data?.email
  notificationNewSet.value = data?.notification_new_set
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

  .image-upload {
    max-width: 10rem;

    :deep(.reset) {
      top: 0;
      right: 0;
    }
  }

  .image-upload,
  .image-upload :deep(.image) {
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
    border-bottom-left-radius: 50%;
  }
</style>
