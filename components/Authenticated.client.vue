<template>
  <slot
    v-if="isConnected"
    :address="address"
    :ens="ens"
    :is-connected="isConnected"
    :is-disconnected="isDisconnected"
    :profile="profile"
  ></slot>
</template>

<script setup>
import { useAccount, id } from '~/helpers/use-wagmi'

const {
  address,
  ens,
  isConnected,
  isConnecting,
  profile,
} = useAccount()
</script>
