<template>
  <WithAccount v-slot="{ isConnected, address, ens, profile }">
    <slot
      :address="address"
      :ens="ens"
      :is-connected="isConnected"
      :profile="profile"
      :is-admin="isAdmin"
    />
  </WithAccount>
</template>

<script setup>
import { useSignIn, isAuthenticated, isAdmin } from '~/helpers/siwe'

const { signIn } = useSignIn()

onMounted(async () => {
  if (! isAuthenticated.value)

  await signIn()
})
</script>
