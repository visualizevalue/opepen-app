<template>
  <div>
    <pre>{{ data }}</pre>
    <PaginatedContent
      :url="`${config.public.opepenApi}/votes/leaderboard`"
      #default="{ items }"
    >
      <div class="list">
        <article v-for="item of items">
          <ApiAccount :account="item" />

          <span>{{ item.votes_count }} votes</span>
        </article>
      </div>
    </PaginatedContent>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()

const { data } = await useFetch()
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

    > span:nth-child(2) {
      text-align: right;
    }
  }
}
</style>
