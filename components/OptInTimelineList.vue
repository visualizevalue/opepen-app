<template>
  <PaginatedContent
    :url="url"
    :query="query"
    :refresh-key="submissionId"
    :auto-load="autoLoad"
    class="timeline"
    tag="section"
  >
    <template v-slot:default="{ items }">
      <div
        v-for="entry in items"
        :key="entry.id"
      >
        <NuxtLink :to="`/${id(entry.account)}`">
          <ApiAccount
            :account="entry.account"
            avatar-size="sm"
          />
        </NuxtLink>
        <span v-if="entry.opepen_count">{{ entry.opepen_count }}</span>
        <span v-else></span>
        <span v-if="entry.is_opt_in">Opt-In<span v-if="entry.opepen_count > 1">s</span></span>
        <span v-else>Opt-Out</span>
        <span>
          <slot name="last" :entry="entry">{{ timeAgo(entry.created_at) }}</slot>
        </span>
      </div>
    </template>

    <template v-slot:after-block="{ items, meta }">
      <slot name="after" :items="items" :meta="meta"></slot>
    </template>
  </PaginatedContent>
</template>

<script setup>
import { timeAgo } from '~/helpers/dates'
import { id } from '~/helpers/accounts'

const { submissionId, paginated, limit, autoLoad } = defineProps({
  submissionId: String,
  paginated: Boolean,
  autoLoad: {
    type: Boolean,
    default: true,
  },
  limit: {
    type: Number,
    default: 20,
  },
})

const config = useRuntimeConfig()
const url = submissionId
  ? `${config.public.opepenApi}/set-submissions/${submissionId}/history`
  : `${config.public.opepenApi}/set-submissions/history`
const query = computed(() => {
  const q = new URLSearchParams({
    limit,
  })

  return q.toString()
})
</script>

<style lang="postcss">
.timeline {
  display: flex;
  flex-direction: column;
  gap: var(--size-2);
  position: relative;
  padding-bottom: var(--size-5);

  > div {
    width: 100%;
    overflow: hidden;
    display: grid;
    align-items: center;
    gap: var(--size-3);
    justify-content: space-between;
    grid-template-columns: 40% 10% 15% 1fr;
    color: var(--gray-z-6);
    font-size: var(--font-size-sm);

    > * {
      width: 100%;
      white-space: nowrap;
    }

    > *:nth-child(2),
    > *:last-child {
      text-align: right;
    }

    > *:last-child {
      margin-left: auto;
    }

    > a {
      display: flex;
      align-items: center;
      transition: all var(--speed);

      &:--highlight {
        color: var(--gray-z-9);
      }
    }
  }
}
</style>
