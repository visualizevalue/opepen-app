<template>
  <div>
    <PaginatedContent
      :url="`${config.public.opepenApi}/votes/leaderboard`"
      #default="{ items }"
      class="no-scroller"
    >
      <div class="list">
        <article v-for="(item, index) of items">
          <span class="muted">{{ index + 1 }}.</span>

          <ApiAccount :account="item" />

          <span>{{ item.votes_count }} curations</span>

          <NuxtLink :to="`/${computeId(item)}`"><span>View {{ item.display }}</span></NuxtLink>
        </article>
      </div>
    </PaginatedContent>
  </div>
</template>

<script setup>
import { id as computeId } from '~/helpers/accounts'
import { useMetaData } from '~/helpers/head'

const config = useRuntimeConfig()

useMetaData({
  title: 'Opepen Curators',
})
</script>

<style lang="postcss" scoped>
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

    > span:first-child.muted {
      text-align: right;
      position: absolute;
      right: calc(100% + var(--size-3));
      align-self: center;
      display: none;

      @media (--sm) {
        display: block;
      }
    }

    > span:nth-child(3) {
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
