<template>
  <ClientOnly>
    <PaginatedContent
      :url="url"
      tag="section"
      class="no-scroller"
      #default="{ items }"
    >
      <div class="grid" ref="grid">

        <div v-if="gridWidth">
          <RecycleScroller
            :items="items"
            :item-size="itemSize"
            :grid-items="gridItems"
            key-field="uuid"
            v-slot="{ item: image }"
          >
            <Image
              :key="image.uuid"
              :image="image"
              version="sm"
            />
          </RecycleScroller>
        </div>

      </div>
    </PaginatedContent>
  </ClientOnly>
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
  : gridWidth.value > 300
    ? 2
    : 1
)
const itemSize = computed(() => Math.floor(gridWidth.value / gridItems.value))
</script>

<style lang="postcss" scoped>
section {
  .grid {
    width: 100%;

    :deep(.vue-recycle-scroller__item-view) {
      padding: var(--size-2);

      @media (--md) {
        padding: var(--size-3);
      }
    }
  }
}
</style>
