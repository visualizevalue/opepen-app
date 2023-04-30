<template>
  <div class="pagination">
    <NuxtLink :disabled="!previousSetId" :to="previousSetId"><Icon type="chevron-left" /></NuxtLink>

    <!-- <span>{{ pad(set.id, 3) }} · {{ set.name }}</span> -->
    <span>{{ pad(set.id, 3) }}<span v-if="set.name">: {{ set.name }}</span></span>
    <!-- <span>{{ pad(set.id, 3) }}</span> -->

    <NuxtLink :disabled="!nextSetId" :to="nextSetId"><Icon type="chevron-right" /></NuxtLink>
  </div>
</template>

<script setup>
import pad from '~/helpers/pad'

const { set } = defineProps({ set: Object })
const previousSetId = computed(() => set.id > 1 ? pad(set.id - 1, 3) : '')
const nextSetId = computed(() => set.id < 200 ? pad(set.id + 1, 3) : '')
</script>

<style lang="postcss" scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--size-5);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-md);
  user-select: none;

  > * {
    display: flex;
    align-items: center;
    color: var(--gray-z-8);
    font-size: var(--font-sm);
  }

  > a {
    color: var(--gray-z-5);

    &:--highlight:not([disabled="true"]) {
      color: var(--gray-z-8);
    }

    &[disabled]:not([disabled="false"]) {
      pointer-events: none;
      cursor: disabled;
      color: var(--gray-z-4);
    }
  }
}
</style>
