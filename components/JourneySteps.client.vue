<template>
  <section class="journey-steps">
    <PaginatedContent
      :url="stepsUrl"
      v-slot="{ items }"
    >
      <JourneyStep v-for="item in items" :key="item.uuid" :step="item" />
    </PaginatedContent>
  </section>
</template>

<script setup>
import { post } from '~/api'

const config = useRuntimeConfig()

const { journey } = defineProps({ journey: Object })

const url = `${config.public.opepenApi}/journeys`
const stepsUrl = `${url}/${journey.uuid}/steps`
const newStep = async input => {
  await post(`${url}/${journey.uuid}/steps`, input)
}

defineExpose({
  newStep,
})
</script>

<style lang="postcss" scoped>
  section.journey-steps {
    position: relative;
    max-width: var(--content-width);
    width: 100%;
    margin: 0 auto;

    &:before,
    &:after {
      content: '';
      position: absolute;
      width: 2px;
      left: var(--size-4);
    }
    &:before {
      height: calc(100% - var(--size-8));
      top: var(--size-8);
      background: var(--gray-z-3);
    }
    &:after {
      height: var(--size-8);
      bottom: 0;
      background: linear-gradient(to bottom, var(--gray-z-3), var(--background));
    }
  }
</style>
