<template>
  <PaginatedContent
    :url="url"
    v-slot="{ items }"
    class="events"
  >
    <h2>Provenance</h2>
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
      <NuxtLink :to="`/${id(event.fromAccount)}`">
        <span class="visible-sm">From: </span>{{ event.fromAccount.display }}
      </NuxtLink>
      <NuxtLink :to="`/${id(event.toAccount)}`">
        <span class="visible-sm">To: </span>{{ event.toAccount.display }}
      </NuxtLink>
      <NuxtLink :to="`https://etherscan.io/tx/${event.transaction_hash}`">
        <span class="visible-sm">Date: </span>
        <span>{{ formatDateTime(event.timestamp) }}</span>
        <Icon type="external-link" />
      </NuxtLink>
    </div>
  </PaginatedContent>
</template>

<script setup>
import { ZeroAddress } from 'ethers';
import { formatDateTime } from '~/helpers/dates'
import { id } from '~/helpers/accounts'

const { token } = defineProps({
  token: Object,
})

const config = useRuntimeConfig()

const url = `${config.public.opepenApi}/opepen/${token.token_id}/events`
</script>

<style scoped>

.event {
  background: var(--gray-z-1);
  display: grid;
  padding: var(--size-1) var(--size-2);
  font-size: var(--font-xs);
  border: var(--border);
  border-radius: var(--size-2);
  border-top-left-radius: var(--size-1);
  margin: var(--size-2) 0;

  > * {
    color: var(--gray-z-7);
    display: flex;
    align-items: center;
    gap: var(--size-2);

    &:last-child {
      @media (--md) {
        text-align: right;
        justify-content: flex-end;
      }
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
    display: none;

    @media (--md) {
      display: grid;
    }
  }
}
</style>
