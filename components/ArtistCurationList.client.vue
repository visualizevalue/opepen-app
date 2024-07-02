<template>
  <ClientOnly>
    <PaginatedContent
      :url="url"
      :query="query"
      tag="section"
      class="no-scroller"
      :show-empty="true"
    >
      <template #before="{ items }">
        <slot name="before" :items="items" />
        <slot v-if="! items.length" name="empty" >
          <p class="muted">No curated items</p>
        </slot>
      </template>
      <template #default="{ items }">
        <div class="list">

          <RecycleScroller
            :items="items"
            :item-size="140"
            key-field="uuid"
            v-slot="{ item }"
          >
            <div :key="item.uuid">
              <slot name="item" :item="item" :image="item">
                <Image
                  @click="$emit('click', item)"
                  :image="item"
                  version="sm"
                  :aspect-ratio="1"
                />

                <div class="votes">
                  <span><Icon type="check" style="color: var(--error)" /> <span class="muted">x</span> {{ (item.votes_count - item.points) / 2 }}</span>
                  <span><Icon type="check" style="color: var(--success)" /> <span class="muted">x</span> {{ (item.votes_count + item.points) / 2  }}</span>

                  <span class="progress">
                    <span class="indicator" :style="{ left: `${(((item.votes_count + item.points) / 2 * 100) / item.votes_count)}%` }">
                      <Icon type="opepen" />
                    </span>
                  </span>
                </div>
              </slot>
            </div>
          </RecycleScroller>

        </div>
      </template>
    </PaginatedContent>
  </ClientOnly>
</template>

<script setup>
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { RecycleScroller } from 'vue-virtual-scroller'

const props = defineProps({
  address: String,
  query: String,
})

const emit = defineEmits('click')

const config = useRuntimeConfig()
const url = computed(() => `${config.public.opepenApi}/opepen/images/curated/my-art`)
</script>

<style lang="postcss" scoped>
section {
  .list {
    max-width: var(--content-width);
    width: 100%;
    margin: 0 auto;

    :deep(.vue-recycle-scroller__item-view > div) {
      padding: 0;
      height: 140px;
      display: grid;
      grid-template-columns: calc(140px - 1px) 1fr;
      border-bottom: var(--border-dark);
      align-items: center;
      transition: background var(--speed);

      &:--highlight {
        background: var(--gray-z-1);
      }

      .image {
        border-radius: 0;
        border: 0 !important;
      }

      .votes {
        padding: var(--size-4) var(--size-6);
        height: 100%;
        border-left: var(--border-dark);
        display: grid;
        align-items: center;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        /* grid-template-rows: min-content; */
        gap: 0;

        .progress {
          position: relative;
          grid-column: span 2;
          height: calc(var(--size-0)*2);
          background: var(--success);
          background: linear-gradient(to right, var(--error), var(--success));
          border-radius: var(--size-4);
          border: var(--border-dark);

          .indicator {
            width: var(--size-6);
            position: absolute;
            margin-left: calc(-1 * var(--size-6));
            border: var(--border-dark);
            width: var(--size-6) !important;
            padding: var(--size-0);
            border-radius: 50%;
            background: var(--background);

            .icon {
            }
          }
        }

        span {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--size-1);
        }

        .icon {
          width: var(--size-5);
          display: block;
        }
      }
    }
  }
}
</style>
