<template>
  <button
    type="button"
    class="composition-piece"
    :class="{ picked, 'with-meta': showMeta }"
    :data-image-uuid="image.uuid"
    :data-participation-id="participation?.id"
    :title="title"
    @click.stop="emit('click')"
  >
    <Image :image="image" version="sm" />

    <span v-if="showMeta && participation" class="piece-meta">
      <span>{{ creatorName }}</span>
      <span v-if="image.points">♥ {{ image.points }}</span>
    </span>
  </button>
</template>

<script setup>
const props = defineProps({
  image: {
    type: Object,
    required: true,
  },
  participation: {
    type: Object,
    default: null,
  },
  picked: Boolean,
  showMeta: Boolean,
})
const emit = defineEmits(['click'])

const creatorName = computed(
  () =>
    props.participation?.creator?.display ||
    props.participation?.creator?.address ||
    'Unknown artist',
)
const title = computed(() => (props.participation ? `By ${creatorName.value}` : 'Set artwork'))
</script>

<style scoped>
.composition-piece {
  position: relative;
  min-width: 0;
  padding: 0;
  overflow: hidden;
  color: inherit;
  background: var(--gray-z-2);
  border: var(--border);
  border-radius: var(--border-radius);
  cursor: grab;
  transition:
    opacity var(--speed),
    border-color var(--speed),
    transform var(--speed);

  &:active {
    cursor: grabbing;
  }

  &.picked {
    border-color: var(--color);
    box-shadow: 0 0 0 1px var(--color);
  }

  &.with-meta {
    display: grid;
    aspect-ratio: 1;
    content-visibility: auto;
    contain-intrinsic-size: 5.5rem;
  }

  :deep(.image) {
    width: 100%;
    height: 100%;
  }
}

.piece-meta {
  @mixin ui-font;
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacer-sm);
  padding: var(--size-1);
  color: var(--white);
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  font-size: var(--font-xs);

  span:first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
