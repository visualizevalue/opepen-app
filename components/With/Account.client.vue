<template>
  <slot
    v-bind="$attrs"
    :address="address?.toLowerCase()"
  />
</template>

<script setup>
import { useAccount } from '@wagmi/vue'

const { address } = useAccount()
</script>
