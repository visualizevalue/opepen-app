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

          <span>{{ item.sets_count }} sets</span>
          <span>{{ item.set_submissions_count }} submissions</span>

          <NuxtLink :to="`/${computeId(item)}`"><span>View {{ item.display }}</span></NuxtLink>
        </article>
      </div>
    </PaginatedContent>
  </div>
</template>

<script setup>
import { id as computeId } from '~/helpers/accounts'
const config = useRuntimeConfig()

const url = `${config.public.opepenApi}/accounts/artists`

const query = computed(() => {
  const q = new URLSearchParams({
    limit: 24,
    sort: `-setsCount,-setSubmissionsCount,-profileCompletion`
  })

  return q.toString()
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
    grid-template-columns: 4fr 2fr 2fr;
    position: relative;

    > span:nth-child(2),
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
