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

<style scoped>
a {
  display: inline-flex;
  align-items: center;
  width: auto;
  gap: var(--size-1);
  position: relative;
  transition: all var(--speed);

  .icon {
    width: 1.125em;
    color: var(--gray-z-5);
  }

  &:after {
    content: '';
    position: absolute;
    display: block;
    bottom: -0.15em;
    left: 0;
    height: 0.15em;
    width: 100%;
    background: var(--gray-z-2);
    transition: all var(--speed);
  }

  &:not(.router-link-active) {
    color: var(--gray-z-6);
  }

  &:--highlight {
    color: var(--gray-z-9);

    &:after {
      height: 0.3em;
    }
  }
}
</style>
