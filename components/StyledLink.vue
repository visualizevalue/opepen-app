<template>
  <NuxtLink :to="to">
    <span><slot /></span>
    <Icon :type="icon"  />
  </NuxtLink>
</template>

<script setup>
const {
  icon,
  to,
} = defineProps({
  icon: {
    type: String,
    default: 'chevron-right',
  },
  to: {
    type: String,
    default: '/',
  },
})
</script>

<style lang="postcss" scoped>
a {
  display: inline-flex;
  align-items: center;
  width: auto;
  gap: var(--size-1);
  position: relative;

  .icon {
    width: 1.125em;
    color: var(--gray-z-5);
  }

  &:after {
    content: '';
    position: absolute;
    display: block;
    bottom: 0;
    left: 0;
    height: var(--size-0);
    width: 100%;
    background: var(--gray-z-2);
    transition: all var(--speed);
  }

  &:--highlight {
    &:after {
      height: var(--size-1);
    }
  }
}
</style>
