<template>
  <span>
    <Avatar v-if="!hideAvatar" :account="account" :class="avatarSize" />
    <span>
      <span>{{ display }}</span>
      <small v-if="! hideAddress && display !== short" :title="account.address">{{ short }}</small>
    </span>
  </span>
</template>

<script setup>
const props = defineProps({
  account: Object,
  hideAvatar: Boolean,
  hideAddress: {
    type: Boolean,
    default: true,
  },
})

const display = computed(() => props.account.display)
const short = computed(() => shortAddress(props.account.address))
</script>

<style scoped>
span {
  display: inline-flex;
  align-items: center;
  gap: var(--size-2);
  line-height: 1em;

  :deep(.avatar) {
    width: var(--size-6);
    height: var(--size-6);
    border-radius: 50%;
    align-self: center;
  }

  > span {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;

    small {
      color: var(--gray-z-6);
    }
  }

}
</style>
