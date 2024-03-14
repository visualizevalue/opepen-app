<template>
  <div v-if="bid" class="bid">
    <ApiAccount :account="bid.signerAccount" :hide-address="false" />
    <!-- <span>check</span> -->
    <span>{{ opepenCount }} <span class="muted">×</span> <span class="muted">40-Editions</span></span>
  </div>
</template>

<script setup>
const props = defineProps({
  bid: Object,
})

const object = computed(() => props.bid && JSON.parse(props.bid.object))
const auction = computed(() => object.value ? object.value.Auction : `Unknown`)
const opepen = computed(() => object.value ? object.value.Opepen : `Unknown`)
const opepenCount = computed(() => parseInt(opepen.value.split(' ')[0]))
</script>

<style lang="postcss">
.bid {
  display: grid;
  padding: var(--size-4) 0;
  grid-template-columns: 50% 1fr;
  /* grid-template-columns: 50% 35% 1fr; */
  gap: var(--size-3);
  border-bottom: var(--border-dark);

  > span:last-child {
    text-align: right;
  }

  .muted:last-child {
    color: var(--gray-z-6);
  }
}
</style>
