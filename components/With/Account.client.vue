<template>
  <slot v-bind="$attrs" :address="address?.toLowerCase()" :is-connected="isConnected" />
</template>

<script setup>
import { useAccount } from '@wagmi/vue'

const { address, isConnected } = useAccount()
</script>
