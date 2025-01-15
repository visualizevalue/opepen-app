<template>
  <div>
    <slot name="before"></slot>

    <div v-if="settingsLoaded">
      <slot>
        <form @submit.prevent="save">
          <input v-model="email" placeholder="Your Email" type="email" />
          <Button type="submit" :disabled="saving">
            <span v-if="saving">Submitting...</span>
            <template v-else-if="hasVerifiedEmail">
              <Icon type="check" />
              <span>Verified</span>
            </template>
            <span v-else-if="saved">Submitted</span>
            <span v-else>Submit</span>
          </Button>
        </form>
      </slot>
    </div>
    <Loading v-else />

    <div v-if="hasVerifiedEmail">
      <slot name="verified" />
    </div>

    <div v-if="hasSavedEmail && !hasVerifiedEmail">
      <slot name="unverified" />
    </div>

    <div v-else-if="hasSavedEmail">
      <slot name="saved" />
    </div>

  </div>
</template>

<script setup>
import { delay } from '~/helpers/time'
import { isAuthenticated } from '~/helpers/siwe'
import { useAccount, address } from '~/helpers/use-wagmi'

const config = useRuntimeConfig()

const { isConnected } = useAccount()

const url = `${config.public.opepenApi}/accounts/settings`
const { data: settings, status, refresh, execute } = await useFetch(url, { credentials: 'include', immediate: false })

onMounted(() => { if (isConnected.value) execute() })
watch(isConnected, () => refresh())
watch(isAuthenticated, () => refresh())

const settingsLoaded = computed(() => !! settings.value)
const hasSavedEmail = computed(() => !! settings.value?.email)
const hasVerifiedEmail = computed(() => !! settings.value?.email_verified)
const email = ref(settings.value?.email)
watch([status, settings], () => {
  email.value = settings.value?.email
})

const saving = ref(false)
const saved = ref(false)

const save = async () => {
  saving.value = true
  saved.value = false

  await Promise.all([
    $fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        ...settings.value,
        email: email.value,
        notification_new_set: true,
      })
    }),
    delay(1000)
  ])
  refresh()

  saved.value = true
  saving.value = false
}

// Automatically request a new email verification on connect
const requested = ref(false)
const requestVerifyEmail = async () => {
  if (!saved.value && !requested.value && isConnected.value && settingsLoaded.value && hasSavedEmail.value && !hasVerifiedEmail.value) {
    requested.value = true
    await $fetch(`${config.public.opepenApi}/accounts/settings/${address.value}/send-verify-email`, {
      method: 'POST',
      credentials: 'include',
    })

    saved.value = true
  }
}
onMounted(() => requestVerifyEmail())
watch([isAuthenticated, settingsLoaded], () => requestVerifyEmail())
</script>

<style scoped>
  form {
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    gap: 0;
  }

  p {
    color: var(--gray-z-6);
    margin: 0 0 var(--size-4);
  }

  .button,
  input {
    height: var(--size-8);
    font-size: var(--font-size-lg) !important;

    :deep(.icon) {
      width: var(--size-5);
      height: var(--size-5);
    }
  }

  input {
    color: var(--gray-z-9);
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    height: calc(var(--size-8) + 2px);
    margin-right: -1px;
    z-index: 10;
  }

  .button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    min-width: 8rem;
    flex-shrink: 0;
  }
</style>
