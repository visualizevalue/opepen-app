<template>
  <NuxtLink
    :to="to"
    :class="{ 'router-link-active': $route.path.includes(to) }"
  >
    <div>
      <span>{{ title }}</span>
      <small>{{ subline }}</small>
    </div>

    <Icon type="chevron-right" />
  </NuxtLink>
</template>

<script setup>
defineProps({
  to: String,
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
  border-radius: var(--border-radius);
  transition: background var(--speed);

  display: grid;
  grid-template-columns: 1fr var(--size-7);

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

  .icon {
    color: var(--gray-z-3);
    width: var(--size-4);
    justify-self: flex-end;
  }
}
</style>
