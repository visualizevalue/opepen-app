<template>
  <PaginatedContent
    :url="submissionsUrl"
    :query="submissionsQuery"
    tag="section"
    :class="class"
  >
    <template #default="{ items }">
      <div class="grid" :class="`count-${items.length}`">
        <slot :items="items">
          <div
            v-for="item in items"
            :key="item.opepen.burnedOpepen.token_id"
            class="timeline-item"
          >
            <Avatar :account="item.fromAccount" />
            <span class="meta">
              <NuxtLink :to="id(item.fromAccount)" class="name">{{ item.fromAccount.display }}</NuxtLink>
              <span class="sep">·</span>
              <p>Burned Opepen {{ item.opepen.token_id }}</p>
              <span class="sep">·</span>
              <NuxtLink :to="`https://etherscan.io/tx/${item.transaction_hash}`">
                <span class="date">{{ timeAgo(item.timestamp) }}</span>
              </NuxtLink>
            </span>
            <div class="content">
              <p>{{ item.opepen.burnedOpepen.data.name }}</p>
              <Image :image="item.opepen.burnedOpepen.image" version="sm" />
            </div>
            <NuxtLink :to="`/opt-out/${(item.opepen.burnedOpepen.token_id)}`">
              <span>View burned opepen {{ item.opepen.burnedOpepen.token_id }}</span>
            </NuxtLink>
          </div>
        </slot>
      </div>
    </template>

    <template #loading="{ loading }">
      <slot name="loading" :loading="loading">
        <Loading v-if="loading" />
      </slot>
    </template>
  </PaginatedContent>
</template>

<script setup>
import { id } from '~/helpers/accounts'
import { timeAgo } from '~/helpers/dates'

const props = defineProps({
  limit: {
    type: Number,
    default: 24,
  },
  sort: {
    type: String,
    default: '',
  },
  autoLoad: {
    type: Boolean,
    default: true,
  },
  status: String,
  class: String,
})

const config = useRuntimeConfig()

const submissionsUrl = `${config.public.opepenApi}/opepen/burned`
const submissionsQuery = computed(() => {
  return new URLSearchParams({
    // status: props.status,
    // limit: props.limit,
    // sort: props.sort,
  }).toString()
})
</script>

<style lang="postcss" scoped>
section {
  position: relative;

  .grid {
    display: grid;
    gap: var(--size-5);

    article {
      width: 100%;
    }
  }

  .timeline-item {
    position: relative;
    z-index: 1;
    height: 100%;
    width: 100%;
    padding: var(--spacer);
    overflow: hidden;
    display: grid;
    column-gap: var(--size-2);
    grid-template-columns: var(--size-6) 1fr;

    .avatar {
      height: var(--size-6);
      width: var(--size-6);
      grid-column: 1;
    }

    .content {
      grid-column: 2;
      overflow: hidden;

      p {
        margin: 0 0 var(--size-2);
        color: var(--gray-z-7);
      }
    }

    .meta {
      font-size: var(--font-sm);
      color: var(--gray-z-6);
      display: flex;
      align-items: center;
      gap: var(--size-1);
      line-height: 1em;
      overflow: hidden;

      > * {
        white-space: nowrap;
      }

      > a {
        &:--highlight {
          color: var(--gray-z-8);
        }
      }
    }

    > a {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      span {
      opacity: 0;
      }
    }

  }
}
</style>
