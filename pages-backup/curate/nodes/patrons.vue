<template>
  <div>
    <PaginatedContent
      :url="url"
      :query="query"
      #default="{ items }"
    >
      <div class="list">
        <article v-for="item of items">
          <ApiAccount :account="item" />

          <span>{{ item.opepen_count }} tokens</span>

          <NuxtLink :to="`/${computeId(item)}`"><span>View {{ item.display }}</span></NuxtLink>
        </article>
      </div>
    </PaginatedContent>
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'
import { id as computeId } from '~/helpers/accounts'

const config = useRuntimeConfig()

const url = `${config.public.opepenApi}/accounts/curators`

const query = computed(() => {
  const q = new URLSearchParams({
    limit: 24,
    sort: `-opepen_count,-profileCompletion,id`,
  })

  return q.toString()
})

useMetaData({
  title: 'Opepen Owners',
})
</script>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: var(--size-5);
  max-width: var(--content-width-sm);
  margin: 0 auto;

  > article {
    display: grid;
    gap: var(--size-2);
    grid-template-columns: 1fr 1fr;
    position: relative;

    > span:nth-child(2) {
      text-align: right;
    }

    > a {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      > span {
        opacity: 0;
        pointer-events: none;
      }
    }
  }
}
</style>
