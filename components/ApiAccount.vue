<template>
  <span :class="{ avatar: !hideAvatar }">
    <DefaultOpepenAvatar v-if="!hideAvatar" :address="address" :class="{ lg: !hideAddress }" />
    <span>
      <span>{{ display }}</span>
      <small v-if="! hideAddress" :title="account.address">{{ shortAddress(account.address) }}</small>
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
  }
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
    gap: var(--size-1);

    small {
      color: var(--gray-z-6);
    }
  }

}
</style>
