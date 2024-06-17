<template>
  <PaginatedContent
    :url="url"
    tag="section"
    class="no-scroller"
  >
    <template #default="{ items }">
      <div class="grid" ref="grid">

        <RecycleScroller
          :items="items"
          :item-size="200"
          :grid-items="gridItems"
          key-field="uuid"
          v-slot="{ item: image }"
        >
          <Image
            :key="image.uuid"
            :image="image"
          />
        </RecycleScroller>

      </div>
    </template>
  </PaginatedContent>
</template>

<script setup>
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { useElementSize } from '@vueuse/core'
import { RecycleScroller } from 'vue-virtual-scroller'

const props = defineProps({
  path: String,
})

const config = useRuntimeConfig()
const url = computed(() => `${config.public.opepenApi}/${props.path}`)

const grid = ref(null)
const { width: gridWidth } = useElementSize(grid)
const gridItems = computed(() => gridWidth.value > 600
  ? 3
  : gridWidth.value > 400
    ? 2
    : 1
)
const gap = 20
// const itemSize = computed(() => Math.floor((gridWidth.value - gap * (gridItems.value - 1)) / gridItems.value))
const itemSize = computed(() => Math.floor(gridWidth.value / gridItems.value))
</script>

<style lang="postcss" scoped>
section {
  .grid {
    :deep(.vue-recycle-scroller__item-view) {
      padding: var(--size-3);
    }
  }
  /* .grid {
    display: grid;
    gap: var(--size-5);
    grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));

    @media (--md) {
      grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
    }
  } */
}
</style>
