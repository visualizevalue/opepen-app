<template>
  <PaginatedContent
    :url="submissionsUrl"
    :query="submissionsQuery"
    :auto-load="false"
    tag="section"
    class="featured"
  >
    <template #before>
      <SectionTitle>Curated</SectionTitle>
    </template>

    <template #default="{ items }">
      <div class="elements">
        <SetPreview
          v-for="submission in items"
          :key="submission.id"
          :data="submission"
          :style="itemStyles"
        />

        <button v-if="activeFeature > 0" @click="activeFeature -= 1" class="left"><Icon type="chevron-left" /></button>
        <button v-if="activeFeature < items.length - 1" @click="activeFeature += 1" class="right"><Icon type="chevron-right" /></button>
      </div>

    </template>
  </PaginatedContent>
</template>

<script setup>
const config = useRuntimeConfig()

const submissionsUrl = `${config.public.opepenApi}/set-submissions`
const submissionsQuery = new URLSearchParams({
  status: 'curated',
  limit: 5,
}).toString()

const activeFeature = ref(0)
const itemStyles = computed(() => ({
  transform: `translateX(calc((-100% - var(--size-4)) * ${activeFeature.value}))`,
}))
</script>

<style lang="postcss" scoped>
section.featured {
  .elements {
    --padding-x: calc((100vw - var(--container-padding-x)*2 - var(--content-width)) / 2);

    display: flex;
    flex-direction: column;
    gap: var(--size-4);

    @media (--md) {
      flex-direction: row;
      overflow: hidden;
      position: relative;
      flex-wrap: nowrap;
      padding-left: var(--padding-x);
    }

    :deep(> article) {
      flex-shrink: 0;
      width: 100%;

      transition: transform var(--speed);
    }

    :deep(> button) {
      transition: all var(--speed);
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      top: calc(50% - var(--size-8)/1.25);
      z-index: 100;
      background: var(--gray-z-3);
      width: var(--size-8);
      height: var(--size-8);
      border-radius: var(--size-8);
      border: var(--border);
      box-shadow: var(--shadow-lg);

      &:--highlight {
        background: var(--gray-z-4);
      }

      > * {
        margin: 0;
      }

      &.left {
        left: var(--size-2);

        @media (--xl) {
          left: calc(var(--padding-x) - var(--size-4)*5);
        }
      }
      &.right {
        right: var(--size-2);

        @media (--xl) {
          right: calc(var(--padding-x) - var(--size-4)*5);
        }
      }
    }

    &:before,
    &:after {
      content: '';
      position: absolute;
      z-index: 10;
      height: 100%;
      width: max(var(--padding-x), var(--size-4));
    }

    &:before {
      left: calc(-1 * var(--container-padding-x));
      background: linear-gradient(to right, var(--background), var(--transparent-background));
    }

    &:after {
      right: calc(-1 * var(--container-padding-x));
      background: linear-gradient(to left, var(--background), var(--transparent-background));
    }
  }
}
</style>
