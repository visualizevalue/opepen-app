<template>
  <NuxtLink v-bind="$attrs">
    <span>{{ title }}</span>
    <small>{{ subline }}</small>
  </NuxtLink>
</template>

<script setup>
defineProps({
  title: String,
  subline: String,
})
</script>

<style scoped>
a {
  margin-left: calc(-1 * var(--spacer));
  margin-right: calc(-1 * var(--spacer));
  padding: var(--spacer-sm) var(--spacer);
  width: calc(100% + 2 * var(--spacer));
  display: block;
  border-radius: var(--border-radius);
  transition: background var(--speed);

  span,
  small {
    display: block;
  }

  span {
    @mixin ui-font;
  }

  small {
    color: var(--gray-z-5);
    font-size: var(--font-sm);
  }

  &.router-link-active {
    background: var(--gray-z-2);
  }
}
</style>
