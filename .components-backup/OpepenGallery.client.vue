<template>
  <PaginatedContent
    :url="url"
    :query="query"
    tag="section"
    class="no-scroller"
  >
    <template #default="{ items }">
      <div class="grid" ref="grid">

        <div v-if="gridWidth">
          <RecycleScroller
            :items="items"
            :item-size="itemSize*1.25"
            :item-secondary-size="itemSize"
            :grid-items="gridItems"
            key-field="token_id"
            v-slot="{ item: token }"
          >
            <OpepenCard
              :token="token"
              :set="token.data?.edition"
              :uri="marketplaceUri(token.data.order.source, token.token_id)"
            >
              <template #title>
                <h1>
                  <span>#{{ token.token_id }}</span>
                  <span>{{ formatEther(BigInt(token.price)) }} ETH</span>
                </h1>
              </template>
              <template #subline>
                <p>
                  <span>1/{{ token.data.edition }}</span>
                  <span>{{ token.data.order.source }}</span>
                </p>
              </template>
            </OpepenCard>
          </RecycleScroller>
        </div>

      </div>
    </template>
  </PaginatedContent>
</template>

<script setup>
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { useElementSize } from '@vueuse/core'
import { RecycleScroller } from 'vue-virtual-scroller'
import { formatEther } from 'viem'
import { marketplaceUri } from '~/helpers/marketplace-sources'

const props = defineProps({
  query: String,
})

const config = useRuntimeConfig()
const url = computed(() => `${config.public.opepenApi}/opepen`)

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

<style scoped>
section {
  .grid {
    width: 100%;
    padding: var(--size-3);

    @media (--md) {
      padding: 0;
    }

    :deep(.vue-recycle-scroller__item-view) {
      padding: var(--size-2);

      @media (--md) {
        padding: var(--size-3);
      }
    }
  }
}
</style>
