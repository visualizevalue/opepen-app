<template>
  <PaginatedContent :url="url" v-slot="{ items }" class="events">
    <div class="event header">
      <span>Event</span>
      <span>Account</span>
      <span>Price</span>
      <span>Date</span>
    </div>
    <div v-for="event in items" :key="event.id" class="event">
      <span>
        <span v-if="event.from === zeroAddress">Mint</span>
        <span v-else-if="event.data?.price">Sale</span>
        <span v-else>Transfer</span>
      </span>
      <NuxtLink :to="`/${id(event.toAccount)}`">
        {{ event.toAccount.display }}
      </NuxtLink>
      <span>
        <template v-if="event.data?.price">⟠ {{ event.data.price.amount.native }}</template>
      </span>
      <NuxtLink :to="`https://etherscan.io/tx/${event.transaction_hash}`">
        <span>{{ formatDate(event.timestamp) }}</span>
        <Icon type="external-link" />
      </NuxtLink>
    </div>
  </PaginatedContent>
</template>

<script setup>
import { zeroAddress } from 'viem'

const { opepen } = defineProps({
  opepen: Object,
})

const config = useRuntimeConfig()

const url = `${config.public.opepenApi}/opepen/${opepen.token_id}/events`
</script>

<style scoped>
.event {
  @mixin ui-font;
  background: var(--gray-z-1);
  display: grid;
  padding: var(--size-1) var(--size-2);
  font-size: var(--font-xs);
  border: var(--border);
  border-radius: var(--size-2);
  margin: var(--size-2) 0;
  grid-template-columns: 20% 1fr 20% 25%;

  &.header {
    color: var(--gray-z-5);
    border: 0;
    background: transparent;
    padding-bottom: 0;
    display: grid;
  }

  > * {
    color: var(--gray-z-6);
    display: flex;
    align-items: center;
    gap: var(--size-2);
    white-space: nowrap;

    &:first-child {
      margin-bottom: 0;
    }

    &:last-child {
      text-align: right;
      justify-content: flex-end;
    }

    :deep(.vue-feather) {
      width: var(--size-3);
      opacity: 0.5;
    }
  }

  > a {
    transition: all var(--speed);

    &:--highlight {
      color: var(--color);

      :deep(.vue-feather) {
        opacity: 1;
      }
    }
  }

  .icon {
    flex-shrink: 0;
  }
}
</style>
