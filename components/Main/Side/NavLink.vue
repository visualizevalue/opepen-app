<template>
  <NuxtLink
    :to="to"
    :class="{
      active: strictExact ? $route.path == to : $route.path.indexOf(to) > -1,
    }"
  >
    <Icon v-if="icon" :type="icon" class="leading" />

    <span class="label">
      <span class="title">{{ title }}</span>
      <small v-if="subline">{{ subline }}</small>
    </span>

    <span v-if="note" class="badge note">{{ note }}</span>
    <span v-if="badge" class="badge">{{ badge }}</span>
  </NuxtLink>
</template>

<script setup>
defineProps({
  to: String,
  title: String,
  // Leading glyph, as in a system sidebar row.
  icon: String,
  subline: String,
  strictExact: Boolean,
  badge: String,
  // Secondary chip sitting beside the badge, for live values like a countdown.
  note: String,
})
</script>

<style scoped>
a {
  display: flex;
  align-items: center;
  gap: var(--size-3);
  min-height: 2.5rem;
  padding: var(--size-2) var(--size-3);
  border-radius: 0.625rem;
  font-size: var(--ui-font-size);
  transition: background var(--speed-fast);

  .leading {
    flex-shrink: 0;
    width: 1.125rem;
    height: 1.125rem;
    color: var(--gray-z-6);
  }

  .label {
    display: grid;
    min-width: 0;
    flex: 1;
  }

  .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    color: var(--gray-z-5);
    font-size: var(--font-xs);
  }

  .badge {
    flex-shrink: 0;
    border-radius: 999px;
    background: var(--success);
    color: var(--black);
    font-family: var(--font-family-brand);
    font-size: var(--label-font-size);
    font-weight: 400;
    letter-spacing: var(--label-letter-spacing);
    text-transform: uppercase;
    padding: 2px 0.5rem 1px;

    &.note {
      background: var(--fill);
      color: var(--gray-z-7);
    }
  }

  &:hover {
    background: var(--fill);
  }

  &.active {
    background: var(--fill-highlight);
    font-weight: var(--font-weight-medium);

    .leading {
      color: var(--color);
    }
  }
}
</style>
