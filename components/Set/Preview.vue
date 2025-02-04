<template>
  <Card v-if="data" ref="el" class="set-preview" :class="{ minimal }" :style="style">
    <div class="wrapper">
      <section v-if="isVisible" class="items">
        <Image :image="data?.edition1Image" version="sm" class="appear" :auto-embed="false" />
        <Image :image="data?.edition4Image" version="sm" class="appear" :auto-embed="false" />
        <Image :image="data?.edition5Image" version="sm" class="appear" :auto-embed="false" />
        <Image :image="data?.edition10Image" version="sm" class="appear" :auto-embed="false" />
        <Image :image="data?.edition20Image" version="sm" class="appear" :auto-embed="false" />
        <Image :image="data?.edition40Image" version="sm" class="appear" :auto-embed="false" />
      </section>

      <h1>
        <small v-if="data.set_id">Set {{ pad(data.set_id, 3) }}</small>
        <small v-else>Set Submission</small>
        <span>{{ data.name }}</span>
      </h1>

      <Button :to="`/sets/${id}`" :title="data.name">
        <Icon type="chevron-right" />
        <span>View Set</span>
      </Button>
    </div>
  </Card>
</template>

<script setup>
import { useElementVisibility } from '@vueuse/core'

const el = ref(null)
const isVisible = useElementVisibility(el)

const { data, minimal, style } = defineProps({
  data: Object,
  minimal: Boolean,
  style: {
    type: Object,
    default: () => ({})
  }
})

const id = computed(() => data?.set_id ? pad(data.set_id, 3) : data?.uuid)
</script>

<style scoped>
  .set-preview {
    container-type: inline-size;
    container-name: preview;
    position: relative;
    width: 100%;
    height: 0;
    padding: 0;
    padding-bottom: calc(100% + var(--size-8));
    background-color: var(--gray-z-1);
    border: 0;

    &.minimal {
      padding-bottom: 100%;
    }

    .wrapper {
      position: absolute;
      width: 100%;
      top: 0;
      border: var(--border);
      border-radius: var(--border-radius);
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
    }
  }

  h1 {
    display: grid;
    gap: var(--spacer-xs);
    @mixin ui-font;

    small {
      display: block;
      color: var(--gray-z-6);
      font-size: var(--font-sm);
    }
  }

  .set-preview.minimal {
    h1 {
      display: none;
    }
  }
</style>
