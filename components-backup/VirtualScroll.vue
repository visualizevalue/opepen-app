<template>
  <RecycleScroller
    :items="items"
    :item-size="itemSize"
    :page-mode="true"
    :buffer="800"
    :updateInterval="0"
    class="virtual-scroller"
  >
    <template v-slot="{ item }">
      <slot :item="item" />
    </template>
  </RecycleScroller>
</template>

<script setup>
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { RecycleScroller } from 'vue-virtual-scroller'

const props = defineProps({
  items: Array,
  itemSize: {
    type: Number,
    default: 69,
  },
})
</script>

<style scoped>
</style>
