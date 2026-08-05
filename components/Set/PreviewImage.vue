<template>
  <div class="preview" :class="{ cyclable: images.length > 1 }">
    <Image
      :image="image"
      :version="version"
      class="appear"
      auto-embed
      :aspect-ratio="1"
      @click="$emit('click', { edition, image })"
    >
      <div class="meta">
        <h1>{{ name }}</h1>
        <p>{{ tagline }}</p>
      </div>
    </Image>

    <!-- Dynamic sets carry an artwork per token in the edition; step through them. -->
    <template v-if="images.length > 1">
      <button class="cycle prev" :aria-label="`Previous ${name}`" @click.stop="step(-1)">
        <Icon type="chevron-left" />
      </button>
      <button class="cycle next" :aria-label="`Next ${name}`" @click.stop="step(1)">
        <Icon type="chevron-right" />
      </button>
      <span class="cycle-count">{{ index + 1 }}/{{ images.length }}</span>
    </template>
  </div>
</template>

<script setup>
const { data, edition } = defineProps({
  data: Object,
  edition: Number,
})
defineEmits(['click'])

const FALLBACK = `https://opepen.nyc3.cdn.digitaloceanspaces.com/token.svg`

const images = computed(() => {
  const single = data?.[`edition${edition}Image`]
  const dynamic = data?.dynamicSetImages

  // The 1/1 has a single artwork by definition.
  if (!data || edition === 1 || !dynamic) return single ? [single] : []

  const list = []
  for (let i = 1; i <= edition; i++) {
    const found = dynamic[`image${edition}_${i}`]
    if (found) list.push(found)
  }

  return list.length ? list : single ? [single] : []
})

const index = ref(0)
// Guard against the set reloading with fewer artworks than we point at.
watch(images, (list) => {
  if (index.value > list.length - 1) index.value = 0
})

const step = (direction) => {
  const count = images.value.length
  if (!count) return

  index.value = (index.value + direction + count) % count
}

const image = computed(() => images.value[index.value] || (data ? undefined : FALLBACK))
const version = computed(() =>
  image.value?.isAnimated || image.value?.isWebRendered ? '' : 'sm',
)

const name = computed(() => (data ? data[`edition${edition}Name`] : `Unrevealed`))
const tagline = computed(() => EDITIONS[edition]?.tagline)
</script>

<style scoped>
.preview {
  position: relative;

  > .image {
    cursor: pointer;
    border-radius: var(--border-radius);

    &.loaded {
      background: var(--background);

      :deep(.image) {
        background: var(--background);
      }
    }

    :deep(.image) {
      border-radius: var(--border-radius);
    }
  }

  &:--highlight {
    > .image :deep(img) {
      transform: scale(1.15);
    }
  }
}

.cycle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--size-5);
  height: var(--size-5);
  padding: 0;
  border: 0;
  border-radius: 100%;
  background: var(--semi);
  color: var(--color);
  cursor: pointer;
  opacity: 0;
  transition: opacity var(--speed);

  &.prev {
    left: var(--size-1);
  }

  &.next {
    right: var(--size-1);
  }

  .icon {
    width: var(--size-4);
  }
}

.cycle-count {
  position: absolute;
  bottom: var(--size-1);
  right: var(--size-1);
  @mixin ui-font;
  font-size: var(--font-xs);
  color: var(--color);
  background: var(--semi);
  padding: 0 var(--size-1);
  opacity: 0;
  transition: opacity var(--speed);
  pointer-events: none;
}

/*
 * Pointer devices reveal the controls on hover. Touch devices have no hover
 * state, so keep them faintly visible there and let the tap do the work.
 */
@media (hover: hover) {
  .cyclable:hover .cycle,
  .cyclable:hover .cycle-count {
    opacity: 0.55;
  }

  .cyclable .cycle:--highlight {
    opacity: 1;
  }
}

@media (hover: none) {
  .cyclable .cycle,
  .cyclable .cycle-count {
    opacity: 0.5;
  }
}
</style>
