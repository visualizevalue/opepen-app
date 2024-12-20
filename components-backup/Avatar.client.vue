<template>
  <div class="avatar">
    <Image v-if="account?.pfp" :image="account.pfp" />
    <DefaultOpepenAvatar v-else-if="account?.address" :address="account.address" :size="size" />
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
</script>

<style lang="postcss" scoped>
  .avatar {
    display: relative;

    :deep(> img),
    :deep(> .image > .image) {
      border-radius: 50% !important;
      border-top-left-radius: 10% !important;
      border: var(--border);
      background-color: var(--gray-z-1);
    }
  }

</style>
