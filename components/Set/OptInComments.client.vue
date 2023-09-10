<template>

  <section v-if="set.name" class="opt-in-comments">
    <header>
      <h1>Community Comments</h1>
    </header>

    <PaginatedContent
      :url="url"
      :query="query"
      v-slot="{ items }"
      class="comments"
    >
      <article
        v-for="(entry, index) in items"
        :key="entry.id"
        class="comment"
      >
        <ApiAccount :account="entry.account" class="account" />
        <div>{{ entry.comment }}</div>
      </article>
    </PaginatedContent>
  </section>

</template>

<script setup>
const config = useRuntimeConfig()
const props = defineProps({ set: Object })

const url = computed(() => `${config.public.opepenApi}/opepen/sets/${props.set.id}/subscribers`)
const query = computed(() => {
  const q = new URLSearchParams({
    sort: `-created_at`,
    'filter[comment]': `!null`,
  })

  return q.toString()
})

</script>

<style lang="postcss" scoped>
  .opt-in-comments {
    padding-bottom: var(--size-5);

    header {
      margin-bottom: var(--size-5);

      h1 {
        color: var(--gray-z-6);
        font-size: var(--font-sm);
      }
    }

    .comments {
      display: grid;
      gap: var(--size-4);

      @media (--md) {
        grid-template-columns: repeat(auto-fill, minmax(40%, 1fr));
      }

      .comment {
        border: var(--border);
        border-radius: var(--size-4);
        border-top-left-radius: var(--size-1);
        padding: var(--size-3) var(--size-4);
        width: 100%;

        .account {
          font-size: var(--size-sm);
          color: var(--gray-z-5);
          margin-bottom: var(--size-2);
        }
      }
    }
  }
</style>
