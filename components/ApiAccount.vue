<template>
  <span :class="{ avatar: !hideAvatar }">
    <img v-if="!hideAvatar && avatar" :src="avatar" />
    <DefaultOpepenAvatar v-else-if="!hideAvatar" :address="address" />
    <span>{{ display }}</span>
  </span>
</template>

<script setup>
const props = defineProps({
  account: Object,
  hideAvatar: Boolean,
})

const address = computed(() => props.account.address)
const display = computed(() => props.account.display)
</script>

<style lang="postcss" scoped>
span {
  display: inline-flex;
  align-items: center;
  gap: var(--size-2);

  :deep(img) {
    width: var(--size-5);
    height: var(--size-5);
    border-radius: 50%;
    align-self: center;
  }
}
</style>
