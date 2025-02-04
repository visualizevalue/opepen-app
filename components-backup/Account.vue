<template>
  <span v-if="address">
    <Avatar v-if="! hideAvatar" :account="account" />
    <span>{{ account?.display || shortAddress(address) }}</span>
  </span>
</template>

<script setup>
import { useProfile } from '~/helpers/use-wagmi'
import shortAddress from '~/helpers/short-address'

const props = defineProps({
  address: String,
  hideAvatar: Boolean,
})

const address = computed(() => props.address)
const account = await useProfile(address)
</script>

<style scoped>
span {
  display: inline-flex;
  align-items: center;
  gap: var(--size-2);

  :deep(img),
  :deep(.avatar) {
    width: var(--size-5);
    height: var(--size-5);
    align-self: center;
  }
}
</style>
