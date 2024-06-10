<template>
  <WithAccount v-slot="{ isConnected, address, ens, profile }">
    <slot
      :address="address"
      :ens="ens"
      :is-connected="isConnected"
      :profile="profile"
    />
  </WithAccount>
</template>

<script setup>
import { useSignIn, isAuthenticated } from '~/helpers/siwe'

const { signIn } = useSignIn()

onMounted(async () => {
  if (! isAuthenticated.value)

  await signIn()
})
</script>
