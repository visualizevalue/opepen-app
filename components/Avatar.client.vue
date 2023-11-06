<template>
  <img v-if="account?.pfp" :src="pfpURI" :alt="`Avatar of ${account.display}`" />
  <DefaultOpepenAvatar v-else-if="account?.address" :address="account.address" :size="size" />
</template>

<script setup>
import { imageURI } from '~/helpers/images'

const props = defineProps({
  account: Object,
  size: {
    type: Number,
    default: 32,
  },
})

const pfpURI = computed(() => props.account?.pfp && imageURI(props.account.pfp, 'sm'))
</script>

<style lang="postcss" scoped>
  img,
  :deep(img) {
    border-radius: 50%;
    border: var(--border);
  }
</style>
