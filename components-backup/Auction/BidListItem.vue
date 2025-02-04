<template>
  <div v-if="bid" class="bid">
    <NuxtLink :to="`/holders/${bid.account.address}`">
      <ApiAccount :account="bid.account" :hide-address="false" />
    </NuxtLink>
    <span>{{ bid.bidCount }} <span class="muted">×</span> <span class="muted">40-Editions</span></span>
  </div>
</template>

<script setup>
const props = defineProps({
  bid: Object,
})
</script>

<style scoped>
.bid {
  width: 100%;
  display: grid;
  align-items: center;
  padding: var(--size-4) 0;
  grid-template-columns: 50% 1fr;
  /* grid-template-columns: 50% 35% 1fr; */
  gap: var(--size-3);
  border-bottom: var(--border-dark);
  border-color: var(--gray-z-1);

  > span:last-child {
    text-align: right;
  }

  .muted:last-child {
    color: var(--gray-z-6);
  }
}
</style>
