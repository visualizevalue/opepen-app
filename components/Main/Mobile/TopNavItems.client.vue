<template>
  <Teleport defer to="#top-sub-nav">
    <NuxtLink
      v-for="item in items"
      :to="item.to"
    >{{ item.text }}</NuxtLink>
  </Teleport>
</template>

<script setup>
defineProps({
  items: Array,
})
</script>

<style scoped>
  a {
    @mixin ui-font;
    padding: var(--size-3) var(--spacer-lg);
    position: relative;

    &:after {
      position: absolute;
      height: 3px;
      width: 100%;
      bottom: -1px;
      left: 0;
      content: '';
      background: transparent;
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
      transition: background var(--speed);
    }

    &.router-link-active {
      border-color: var(--color);

      &:after {
        background: var(--color);
      }
    }
  }
</style>

