<template>
  <slot
    :address="address"
    :ens="ens"
    :is-connected="isConnected"
    :profile="profile"
    :is-admin="isAdmin"
  />
</template>

<script setup>
import { isAdmin } from '~/helpers/siwe'
import { useAccount } from '~/helpers/use-wagmi'

const {
  address,
  ens,
  isConnected,
  profile,
} = useAccount()
</script>
