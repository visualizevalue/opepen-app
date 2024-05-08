<template>
  <PaginatedContent
    :url="url"
    :query="query"
    class="no-scroller"
  >
    <template #default="{ items }">

      <VirtualScrollDynamic
        v-if="items?.length"
        :items="withExtras(items)"
        :min-item-size="75"
      >
        <template #default="{ item: post }">

          <PostItem
            :key="post.id"
            :post="post"
            :style="{ height: post.size + 'px' }"
          />

        </template>
      </VirtualScrollDynamic>

    </template>
  </PaginatedContent>
</template>

<script setup>
const props = defineProps({
  limit: {
    type: Number,
    default: 100,
  },
  extraItems: {
    type: Array,
    default: () => [],
  },
  sort: {
    type: String,
    default: '-createdAt',
  },
})

const config = useRuntimeConfig()

const url = `${config.public.opepenApi}/posts`
const query = computed(() => {
  return new URLSearchParams({
    limit: props.limit,
    sort: props.sort,
  }).toString()
})

// const CONTAINER_WIDTH = 558
// const getSize = item => {
//   if (item.images?.length === 1) return CONTAINER_WIDTH + 6
//   if (item.images?.length === 2) return CONTAINER_WIDTH * 0.57
//   if (item.images?.length === 3) return CONTAINER_WIDTH * 0.41
//   if (item.images?.length === 4) return CONTAINER_WIDTH * 0.52

//   return 150 // default
// }
const withExtras = items => props.extraItems.concat(items)
// const addSizes = items => items.map(item => ({ ...item, size: getSize(item) }))
</script>

<style lang="postcss" scoped>

</style>
