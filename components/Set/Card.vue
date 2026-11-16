<template>
  <Card
    v-if="data"
    ref="el"
    class="borderless set-preview"
    :class="{ minimal, showDemand, imageLoaded }"
    :style="style"
  >
    <div class="wrapper">
      <Progress
        v-if="showDemand"
        :percent="demand"
        :class="{
          muted: !data.starred_at && demand <= 50,
          yellow: !data.starred_at && demand > 50,
        }"
      />

      <section v-if="isVisible" class="items">
        <Image
          :image="data?.edition1Image"
          version="sm"
          class="appear"
          :auto-embed="false"
          :aspect-ratio="1"
          @loaded="onImageLoad"
        />
        <Image
          :image="data?.edition4Image"
          version="sm"
          class="appear"
          :auto-embed="false"
          :aspect-ratio="1"
          @loaded="onImageLoad"
        />
        <Image
          :image="data?.edition5Image"
          version="sm"
          class="appear"
          :auto-embed="false"
          :aspect-ratio="1"
          @loaded="onImageLoad"
        />
        <Image
          :image="data?.edition10Image"
          version="sm"
          class="appear"
          :auto-embed="false"
          :aspect-ratio="1"
          @loaded="onImageLoad"
        />
        <Image
          :image="data?.edition20Image"
          version="sm"
          class="appear"
          :auto-embed="false"
          :aspect-ratio="1"
          @loaded="onImageLoad"
        />
        <Image
          :image="data?.edition40Image"
          version="sm"
          class="appear"
          :auto-embed="false"
          :aspect-ratio="1"
          @loaded="onImageLoad"
        />
      </section>

      <h1>
        <span>{{ data.name || 'Unreleased' }}</span>
        <small v-if="data.set_id">Set {{ pad(data.set_id, 3) }}</small>
        <small v-else>Submission</small>
      </h1>

      <!-- The whole card is the link; the name is its label. -->
      <NuxtLink :to="url" :aria-label="label"></NuxtLink>
    </div>
  </Card>
</template>

<script setup>
import { useElementVisibility } from '@vueuse/core'

const el = ref(null)
const isVisible = useElementVisibility(el, {
  rootMargin: '500px 0px',
})

const { data, minimal, style, showDemand } = defineProps({
  data: Object,
  minimal: Boolean,
  showDemand: Boolean,
  style: {
    type: Object,
    default: () => ({}),
  },
})

const id = computed(() => (data?.set_id ? pad(data.set_id, 3) : data?.uuid))
const url = computed(() => (data?.set_id ? `/sets/${id.value}` : `/submissions/${id.value}`))

const label = computed(() =>
  data?.set_id
    ? `Set ${pad(data.set_id, 3)}: ${data?.name || 'Unreleased'}`
    : data?.name || 'Submission',
)

const demand = computed(() => getDemandPercentage(data))

const imageLoaded = ref(false)
const onImageLoad = () => (imageLoaded.value = true)
</script>

<style scoped>
.set-preview {
  --text-height: calc(var(--size-7) + var(--size-3));
  --demand-height: 0px;

  &.minimal {
    --text-height: 0px;
  }

  &.showDemand {
    --demand-height: var(--size-3);
  }

  container-type: inline-size;
  container-name: preview;
  position: relative;
  width: 100%;
  padding-bottom: max(100%, calc(100% + var(--text-height) + var(--demand-height)));
  transition: transform var(--speed) !important;
  aspect-ratio: 1 / 1;
  height: 100%;

  .wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: var(--border-radius-lg);
    background-color: var(--gray-z-1);
    overflow: hidden;
    transition: background-color var(--speed);
  }

  &:hover .wrapper {
    background-color: var(--gray-z-2);
  }

  .wrapper > a {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.0001;
    cursor: pointer;
    height: 100%;
    width: 100%;
  }
}

.set-preview .wrapper {
  display: grid;
  height: 100%;
  gap: var(--spacer-sm);
  margin: 0;
  padding: var(--size-2);

  .items {
    display: grid;
    aspect-ratio: 1;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: repeat(3, minmax(0, 1fr));
    gap: var(--spacer-sm);
    grid-auto-flow: dense;

    > :first-child {
      grid-column: span 2;
      grid-row: span 2;
    }

    > .image {
      &.loaded {
        background: var(--background);

        :deep(.image) {
          background: var(--background);
        }
      }
    }
  }
}

h1 {
  display: grid;
  gap: 1px;
  margin-top: auto;
  padding: 0 var(--size-1) var(--size-1);
  white-space: nowrap;
  opacity: 0;
  transition: opacity var(--speed-slow);

  span,
  small {
    display: block;
    width: calc(100cqw - var(--size-2) * 2 - var(--size-1) * 2);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    font-size: var(--ui-font-size);
    font-weight: var(--font-weight-medium);
    line-height: var(--ui-line-height);
  }

  small {
    color: var(--muted);
    font-family: var(--font-family-brand);
    font-size: var(--label-font-size);
    font-weight: 400;
    letter-spacing: var(--label-letter-spacing);
    text-transform: uppercase;
  }
}

.set-preview.minimal {
  h1 {
    display: none;
  }
}

.set-preview.imageLoaded {
  h1 {
    opacity: 1;
  }
}
</style>
