<template>
  <PaginatedContent
    :url="url"
    v-slot="{ items }"
    class="events"
  >
    <div class="event header">
      <span>Type</span>
      <span>From</span>
      <span>To</span>
      <span>Date</span>
    </div>
    <div
      v-for="event in items"
      :key="event.id"
      class="event"
    >
      <span>
        <span v-if="event.from === ZeroAddress">Mint</span>
        <span v-else>Transfer</span>
      </span>
      <NuxtLink :to="`/holders/${event.from}`">{{ event.fromAccount.display }}</NuxtLink>
      <NuxtLink :to="`/holders/${event.to}`">{{ event.toAccount.display }}</NuxtLink>
      <NuxtLink :to="`https://etherscan.io/tx/${event.transaction_hash}`">
        <span>{{ formatDate(event.timestamp) }}</span>
        <Icon type="external-link" />
      </NuxtLink>
    </div>
    <pre
    >
      {{ event }}
    </pre>
  </PaginatedContent>
</template>

<script setup>
import { ZeroAddress } from 'ethers';
import { formatDate } from '~/helpers/dates'

const { token } = defineProps({
  token: Object,
})

const config = useRuntimeConfig()

const url = `${config.public.opepenApi}/opepen/${token.token_id}/events`
</script>

<style lang="postcss" scoped>
.events {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  gap: var(--size-2);
}

.event {
  background: var(--gray-z-1);
  display: grid;
  padding: var(--size-1) var(--size-2);
  font-size: var(--font-xs);
  border: var(--border);
  border-radius: var(--size-2);
  border-top-left-radius: var(--size-1);

  > * {
    color: var(--gray-z-7);
    display: flex;
    align-items: center;
    gap: var(--size-2);

    &:last-child {
      text-align: right;
      justify-content: flex-end;
    }

    :deep(.vue-feather) {
      width: var(--size-4);
      opacity: 0.5;
    }
  }

  > a {
    color: var(--gray-z-6);
    transition: all var(--speed);

    &:--highlight {
      color: var(--color);

      :deep(.vue-feather) {
        opacity: 1;
      }
    }
  }

  @media (--md) {
    grid-template-columns: 20% 25% 25% 30%;
  }

  &.header {
    font-size: var(--font-sm);
    color: var(--gray-z-5);
    background: transparent;
    padding-bottom: 0;
    border: none;
  }
}
</style>
