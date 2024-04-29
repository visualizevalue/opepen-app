<template>
  <slot
    :address="address"
    :ens="ens"
    :is-connected="isConnected"
    :profile="profile"
  />
</template>

<script setup>
import { useAccount } from '~/helpers/use-wagmi'

const {
  address,
  ens,
  isConnected,
  profile,
} = useAccount()
</script>
