<template>
  <section>
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
  section {
    position: relative;
    max-width: var(--content-width);
    width: 100%;
    height: 100%;
    margin: 0 auto;

    &:before {
      content: '';
      position: absolute;
      width: 2px;
      height: calc(100%);
      top: var(--size-4);
      left: var(--size-4);
      background: var(--gray-z-3);
    }

    > * {
      position: relative;

      &:before {
        content: '';
        position: absolute;
        width: var(--size-3);
        height: var(--size-3);
        top: var(--size-3);
        left: calc(var(--size-3) - 1px);
        background: var(--gray-z-4);
        border-radius: var(--size-2);
        z-index: 1;
      }
    }
  }
</style>
