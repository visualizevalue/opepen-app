<template>
  <section class="journey-steps">
    <PaginatedContent
      :url="stepsUrl"
      v-slot="{ items }"
      ref="content"
    >
      <JourneyStep v-for="item in newSteps.concat(items)" :key="item.uuid" :step="item" />
    </PaginatedContent>
  </section>
</template>

<script setup>
import { post } from '~/api'

const config = useRuntimeConfig()
const { journey } = defineProps({ journey: Object })
const emit = defineEmits(['newStep'])

const url = `${config.public.opepenAiApi}/journeys`
const stepsUrl = `${url}/${journey.uuid}/steps`
const newSteps = ref([])
const newStep = async input => {
  const step = await post(`${url}/${journey.uuid}/steps`, input)
  newSteps.value.unshift(step)
  emit('newStep', step)
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
