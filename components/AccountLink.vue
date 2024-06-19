<template>
  <NuxtLink :to="`/${id(account)}`">
    <ApiAccount :account="account" :hide-avatar="hideAvatar" />
  </NuxtLink>
</template>

<script setup>
import { id } from '~/helpers/accounts'

defineProps({
  account: Object,
  hideAvatar: Boolean,
})
</script>
