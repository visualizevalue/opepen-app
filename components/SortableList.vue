<template>
  <div ref="el" class="list">
    <div v-for="(item, index) in list" :key="item.id || item._id" class="item">
      <SortHandle v-if="!disabled" />

      <slot :item="item" :index="index" />
    </div>
  </div>
</template>

<script setup>
import { useSortable } from '@vueuse/integrations/useSortable'

const el = ref(null)
const props = defineProps({
  items: Array,
  max: Number,
  disabled: Boolean,
})
const emit = defineEmits(['update'])

const list = ref(props.items)
watch(props, () => {
  list.value = props.items
})

useSortable(el, list, {
  handle: '.handle',
  animation: 150,
  onUpdate: (e) => {
    const sorted = [...list.value]

    // remove item
    const item = sorted.splice(e.oldIndex, 1)[0]

    // add item
    sorted.splice(e.newIndex, 0, item)

    emit('update', sorted)
  },
})
</script>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-sm);
}

.item {
  position: relative;
  display: flex;
  align-items: center;

  :deep(.handle) {
    position: absolute;
    left: calc(-1 * (var(--size-2) + var(--size-0)));
    z-index: 2;
  }
}
</style>
