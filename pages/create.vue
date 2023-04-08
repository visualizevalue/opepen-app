<template>
  <div class="create">
    <header v-if="journey">
      <h1 class="breadcrumb">
        <span @click="expanded = false">Home</span>
        <span>/</span>
        <span>{{ journey.title }}</span>
      </h1>
    </header>
    <JourneyForm @submit="submit" />
    <JourneySteps v-if="journey" ref="steps" :journey="journey" />
  </div>
</template>

<script setup>
import { post, get } from '~/api'

const config = useRuntimeConfig()
const url = `${config.public.opepenApi}/journeys`

const journey = ref(null)
const steps = ref(null)

const submit = async input => {
  if (! journey.value) {
    journey.value = await post(url, input)
  } else {
    steps.value.newStep(input)
  }

  // // Generate AI Images for steps
  // const images = await Promise.all([
  //   post(`${config.public.opepenApi}/steps/${steps.value[0].uuid}/dream`),
  //   post(`${config.public.opepenApi}/steps/${steps.value[0].uuid}/dream`),
  //   post(`${config.public.opepenApi}/steps/${steps.value[0].uuid}/dream`),
  // ])

  // console.log(images)
}
</script>

<style lang="postcss" scoped>
  .create {
    display: flex;
    flex-direction: column;
    padding: var(--size-4);
  }

  header {
    max-width: var(--content-width);

    h1 {
      text-transform: uppercase;
      font-size: var(--size-4);
      font-weight: var(--font-weight-bold);
      letter-spacing: var(--letter-spacing-md);
    }
  }
</style>
