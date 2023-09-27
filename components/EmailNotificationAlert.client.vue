<template>
  <Transition name="fade">
    <Alert v-if="session && ! hasSavedEmail && ! forceClose">
      <button class="close" @click="dismiss">
        <Icon type="x" />
      </button>

      <p>Receive an email notification when new sets are released!</p>
      <form @submit.prevent="save">
        <input v-model="email" placeholder="Your Email" type="email" />
        <Button type="submit" :disabled="saving">
          <span v-if="saving">Saving...</span>
          <span v-else>Save</span>
        </Button>
      </form>
    </Alert>
  </Transition>
</template>

<script setup>
import { delay } from '~/helpers/time'
import { useSignIn } from '~/helpers/siwe'

const CLOSE_KEY = 'opepen:set_email_notification_alert_close'
const forceClose = ref(localStorage.getItem(CLOSE_KEY) === 'true')

const config = useRuntimeConfig()

const { session } = useSignIn()

const url = `${config.public.opepenApi}/accounts/settings`
const { data: settings, status, refresh } = await useFetch(url, { credentials: 'include' })

const hasSavedEmail = computed(() => !! settings.value?.email)
const email = ref(settings.value?.email)

watch([status, settings], () => {
  email.value = settings.value?.email
})

const saving = ref(false)

const save = async () => {
  saving.value = true

  await Promise.all([
    $fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        name: settings.value.name,
        email: email.value,
        notification_new_set: true,
      })
    }),
    delay(1000)
  ])
  refresh()

  saving.value = false
}

const dismiss = () => {
  localStorage.setItem(CLOSE_KEY, true)
  forceClose.value = true
}
</script>

<style lang="postcss" scoped>
  .close {
    position: absolute;
    top: var(--size-4);
    right: var(--size-4);
  }

  form,
  form label {
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    white-space: nowrap;
    gap: var(--size-3);
  }

  p {
    color: var(--gray-z-6);
    margin: 0 0 var(--size-4);
  }

  .button,
  input {
    height: var(--size-8);
  }

  input {
    color: var(--gray-z-9);
  }
</style>
