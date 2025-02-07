<template>
  <PaginatedContent
    :url="url"
    v-slot="{ items }"
    class="events"
  >
    <div class="event header">
      <span>Event</span>
      <span>From</span>
      <span>To</span>
      <span>Price</span>
      <span>Date</span>
    </div>
    <div
      v-for="event in items"
      :key="event.id"
      class="event"
    >
      <span>
        <span v-if="event.from === zeroAddress">Mint</span>
        <span v-else-if="event.data?.price">Sale</span>
        <span v-else>Transfer</span>
      </span>
      <NuxtLink :to="`/${id(event.fromAccount)}`">
        <span class="visible-sm">From: </span>{{ event.fromAccount.display }}
      </NuxtLink>
      <NuxtLink :to="`/${id(event.toAccount)}`">
        <span class="visible-sm">To: </span>{{ event.toAccount.display }}
      </NuxtLink>
      <span>
        <template v-if="event.data?.price">
          <span class="visible-sm">Price: </span>
          <span>⟠ {{ event.data.price.amount.native }}</span>
        </template>
      </span>
      <NuxtLink :to="`https://etherscan.io/tx/${event.transaction_hash}`">
        <span class="visible-sm">Date: </span>
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
  background: var(--gray-z-1);
  display: grid;
  padding: var(--size-1) var(--size-2);

  @mixin ui-font;
  font-size: var(--font-xs);
  border: var(--border);
  border-radius: var(--size-2);
  margin: var(--size-2) 0;

  > * {
    color: var(--gray-z-7);
    display: flex;
    align-items: center;
    gap: var(--size-2);

    &:first-child {
      margin-bottom: var(--spacer-xs);

      @container (min-width: 30rem) {
        margin-bottom: 0;
      }
    }

    &:last-child {
      @media (--md) {
        text-align: right;
        justify-content: flex-end;
      }
    }

    :deep(.vue-feather) {
      width: var(--size-3);
      opacity: 0.5;
    }
  }

  > *:not(:first-child) {
    color: var(--gray-z-6);
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

  .visible-sm {
    width: 2.4rem;
  }

  @container (min-width: 30rem) {
    grid-template-columns: 15% 25% 25% 15% 20%;

    .visible-sm {
      display: none;
    }
  }

  &.header {
    @mixin ui-font;
    color: var(--gray-z-5);
    background: transparent;
    padding-bottom: 0;
    border: none;
    display: none;

    @container (min-width: 30rem) {
      display: grid;
    }
  }
}
</style>
