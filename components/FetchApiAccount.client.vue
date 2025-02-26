<template>
  <ApiAccount v-if="account" :account="account" :hide-avatar="hideAvatar" :hide-address="hideAddress" />
</template>

<script setup>
const props = defineProps({
  id: String,
  hideAvatar: Boolean,
  hideAddress: {
    type: Boolean,
    default: true,
  },
})

const { data: account } = await useApi(`/accounts/${props.id}`, {
  lazy: true
})
</script>

