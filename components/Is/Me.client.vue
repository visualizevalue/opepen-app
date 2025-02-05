<template>
  <WithAccount v-slot="{ address: currentAddress }">
    <slot v-if="address === currentAddress" />
  </WithAccount>
</template>

<script setup>
defineProps({
  address: String,
})
</script>
