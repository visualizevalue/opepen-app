<template>
  <NuxtLink
    :to="to"
    :class="{ 'active': (strictExact ? $route.path == to : $route.path.indexOf(to) > -1) }"
  >
    <div>
      <div class="title">
        <span>{{ title }}</span>
        <span v-if="isNew" class="badge">New</span>
      </div>
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
  strictExact: Boolean,
  isNew: Boolean,
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

  small {
    margin-top: var(--spacer-xs);
  }

  span {
    @mixin ui-font;
  }

  .title {
    margin-top: var(--spacer-xs);
    gap: var(--spacer-sm);
    display: flex;
  }

  .badge {
    border-radius: var(--border-radius-sm);
    background: var(--success);
    font-size: var(--font-xs);
    color: var(--gray-z-0);
    padding: 2px 4px 1px;
    height: fit-content;
  }

  small {
    color: var(--gray-z-5);
    font-size: var(--font-sm);
  }

  &:hover {
    background: var(--gray-z-1);
    box-shadow: var(--border-shadow);
  }

  &.active {
    background: var(--gray-z-2);
    box-shadow: var(--border-shadow);
  }

  &.success {
    background: var(--green);
    color: var(--gray-z-0);

    &.active {
      background: var(--green-light);
    }

    span {
      color: var(--gray-z-2);
    }

    small {
      color: var(--gray-z-4);
    }
  }

  .icon {
    color: var(--gray-z-3);
    width: var(--size-4);
    justify-self: flex-end;
  }
}
</style>
