<template>
  <aside v-if="data.name" class="stats-meta">
    <p>Opepen holders decide if a set is released: <span><span class="nowrap">If demand is</span> less than {{ formatNumber(data.min_subscription_percentage) }}%, <span class="nowrap">the set</span> will not be released.</span></p>
  </aside>
</template>

<script setup>
import { formatNumber } from '~/helpers/format'

defineProps({
  data: Object,
})
</script>

<style scoped>
  .stats-meta {
    font-weight: var(--font-weight-bold);
    font-size: var(--font-sm);
    line-height: var(--line-height-md);

    margin-top: calc(-1 * var(--size-4));

    @media (--md) {
      margin-top: calc(-1 * var(--size-6));
    }

    p {
      span {
        color: var(--gray-z-6);
      }
    }
  }
</style>
