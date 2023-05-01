<template>
  <aside v-if="set.name" class="stats-meta">
    <p>Opepen holders decide if a set is released: If demand is less than {{ set.min_subscription_percentage }}% within each bracket, the set will be replaced.</p>
  </aside>
</template>

<script setup>
defineProps({
  set: Object,
})
</script>

<style lang="postcss" scoped>
  .stats-meta {
    font-weight: var(--font-weight-bold);
    font-size: var(--font-sm);
    line-height: var(--line-height-lg);

    margin-top: calc(-1 * var(--size-4));

    @media (--md) {
      margin-top: calc(-1 * var(--size-6));
    }
  }
</style>
