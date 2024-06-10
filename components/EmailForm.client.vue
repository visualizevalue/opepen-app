<template>
  <div>
    <slot name="before"></slot>

    <div v-if="hasVerifiedEmail">
      <slot name="verified" />
    </div>

    <div v-else-if="hasSavedEmail">
      <slot name="saved" />
    </div>

    <div v-if="settingsLoaded">
      <slot>
        <form @submit.prevent="save">
          <input v-model="email" placeholder="Your Email" type="email" />
          <Button type="submit" :disabled="saving">
            <template v-if="hasVerifiedEmail">
              <Icon type="check" />
              <span>Verified</span>
            </template>
            <span v-else-if="saving">Saving...</span>
            <span v-else>Save</span>
          </Button>
        </form>
      </slot>
    </div>

    <Loading v-else />

  </div>
</template>

<script setup>
import { delay } from '~/helpers/time'
import { useSignIn } from '~/helpers/siwe'
import { useAccount } from '~/helpers/use-wagmi'

const config = useRuntimeConfig()

const { isConnected } = useAccount()
const { session } = useSignIn()

const url = `${config.public.opepenApi}/accounts/settings`
const { data: settings, status, refresh, execute } = await useFetch(url, { credentials: 'include', immediate: false })

onMounted(() => { if (isConnected.value) execute() })
watch(isConnected, () => refresh())

const settingsLoaded = computed(() => !! settings.value)
const hasSavedEmail = computed(() => !! settings.value?.email)
const hasVerifiedEmail = computed(() => !! settings.value?.email_verified)
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
</script>

<style lang="postcss" scoped>
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
