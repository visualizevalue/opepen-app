<template>
  <span>
    <Avatar v-if="!hideAvatar" :account="account" :class="avatarSize" :size="avatarSize === 'lg' ? 68 : 36" />
    <span>
      <span>{{ display }}</span>
      <small v-if="! hideAddress && display !== short" :title="account.address">{{ short }}</small>
    </span>
  </span>
</template>

<script setup>
import shortAddress from '~/helpers/short-address'

const props = defineProps({
  account: Object,
  hideAvatar: Boolean,
  hideAddress: {
    type: Boolean,
    default: true,
  },
  avatarSize: {
    type: String,
    default: 'lg',
  },
})

const display = computed(() => props.account.display)
const short = computed(() => shortAddress(props.account.address))
</script>

<style lang="postcss" scoped>
span {
  display: inline-flex;
  align-items: center;
  gap: var(--size-2);
  line-height: 1em;

  :deep(.avatar) {
    width: var(--size-5);
    height: var(--size-5);
    border-radius: 50%;
    align-self: center;

    &.lg {
      width: var(--size-7);
      height: var(--size-7);
      border-top-left-radius: var(--size-1);
    }
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
