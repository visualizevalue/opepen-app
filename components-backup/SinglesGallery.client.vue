<template>
  <ClientOnly>
    <PaginatedContent
      :url="url"
      :query="query"
      tag="section"
      class="no-scroller"
      :show-empty="showEmpty"
    >
      <template #before="{ items }">
        <slot name="before" :items="items" />
        <slot v-if="! items.length" name="empty" />
      </template>
      <template #default="{ items }">
        <div class="grid" ref="grid">

          <div v-if="gridWidth">
            <RecycleScroller
              :items="items"
              :item-size="itemSize"
              :grid-items="gridItems"
              key-field="uuid"
              v-slot="{ item }"
            >
              <div :key="imageAccessor(item).uuid">
                <slot name="item" :item="item" :image="imageAccessor(item)">
                  <Image
                    @click="$emit('click', item)"
                    :image="imageAccessor(item)"
                    version="sm"
                    :aspect-ratio="1"
                  />
                </slot>
              </div>
            </RecycleScroller>
          </div>

        </div>
      </template>
    </PaginatedContent>
  </ClientOnly>
</template>

<script setup>
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { useElementSize } from '@vueuse/core'
import { RecycleScroller } from 'vue-virtual-scroller'

const props = defineProps({
  path: String,
  query: String,
  imageAccessor: {
    type: Function,
    default: item => item,
  },
  showEmpty: Boolean,
})

const emit = defineEmits('click')

const config = useRuntimeConfig()
const url = computed(() => `${config.public.opepenApi}/${props.path}`)

const grid = ref(null)
const { width: gridWidth } = useElementSize(grid)
const gridItems = computed(() => gridWidth.value > 800
  ? 4
  : gridWidth.value > 600
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
    width: calc(100% + 2*var(--size-2));
    margin: calc(var(--size-2) * -1);

    :deep(.vue-recycle-scroller__item-view) {
      padding: var(--size-2);
    }
  }
}
</style>
