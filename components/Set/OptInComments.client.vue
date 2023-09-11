<template>

  <section v-if="set.name" class="opt-in-comments">
    <PaginatedContent
      :url="url"
      :query="query"
      v-slot="{ items }"
      class="comments"
    >
      <header v-if="items.length">
        <h1>Community Comments</h1>
      </header>

      <Comment
        v-for="entry in items"
        :key="entry.id"
        :post="entry"
      />
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
      @media (--md) {
        grid-column: span 2;
        margin-bottom: var(--size-5);
      }

      h1 {
        color: var(--gray-z-6);
        font-size: var(--font-sm);
      }
    }

    .comments {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      gap: var(--size-4);

      @media (--md) {
        grid-template-columns: repeat(auto-fill, minmax(40%, 1fr));
      }
    }
  }
</style>
