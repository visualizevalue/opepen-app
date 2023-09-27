<template>
  <article>
    <h1>User Settings</h1>
    <form @submit.prevent="save" v-if="session">
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
        <Button type="submit">Save</Button>
      </footer>
    </form>
  </article>
</template>

<script setup>
import { useAccount, useEnsName } from '~/helpers/use-wagmi'
import { useSignIn } from '~/helpers/siwe'

const config = useRuntimeConfig()

const { session } = useSignIn()
const { address } = useAccount()
const ens = useEnsName(address)

const url = `${config.public.opepenApi}/accounts/settings`
const { data: settings, status } = await useFetch(url, { credentials: 'include' })

const name = ref(settings.value?.name || ens.value)
const email = ref(settings.value?.email)
const notificationNewSet = ref(settings.value?.notification_new_set)

watch([status, settings, ens], () => {
  name.value = settings.value?.name || ens.value
  email.value = settings.value?.email
  notificationNewSet.value = settings.value?.notification_new_set
})

const save = async () => {
  await $fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      notification_new_set: notificationNewSet.value,
    })
  })
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
  }

  h1 {
    font-size: var(--font-lg);
  }
</style>
