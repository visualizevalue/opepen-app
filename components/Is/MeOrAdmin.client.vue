<template>
  <WithAccount v-slot="{ address: currentAddress }">
    <slot v-if="address === currentAddress || isAdmin" />
  </WithAccount>
</template>

<script setup>
defineProps({
  address: String,
})
</script>
