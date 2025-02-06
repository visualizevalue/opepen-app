<template>
  <div class="avatar">
    <Image
      v-if="account?.pfp"
      :image="account.pfp"
      :aspect-ratio="1"
      version="sm"
      :auto-embed="false"
    />
    <DefaultOpepenAvatar v-else :address="account?.address" :size="size" />
  </div>
</template>

<script setup>
const props = defineProps({
  account: Object,
  size: {
    type: Number,
    default: 32,
  },
})

const account = computed(() => props.account?.value || props.account)
</script>

<style scoped>
.avatar {
  display: relative;

  :deep(> img),
  :deep(> .image > .image) {
    border-radius: 50% !important;
    border: var(--border);
    background-color: var(--gray-z-1);
  }
}
</style>

