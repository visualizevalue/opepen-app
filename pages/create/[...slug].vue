<template>
  <div class="create scroll">
    <header v-if="journey">
      <h1 class="breadcrumb">
        <NuxtLink to="/create">Home</NuxtLink>
        <span class="separator">/</span>
        <span>{{ journey.title }}</span>
      </h1>
    </header>
    <JourneyForm :journey="journey" @submit="submit" />
    <ClientOnly>
      <JourneySteps
        v-if="journey"
        ref="steps"
        :journey="journey"
        @new-step="setLastStep"
      />
    </ClientOnly>
  </div>
</template>

<script setup>
import { post, get } from '~/api'
import { useMetaData } from '~/helpers/head';

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

// Validate route
const [ uuid, ...invalid ] = route.params.slug
if (invalid.length) router.replace(`/create/${uuid}`)

const url = `${config.public.opepenApi}/journeys`
console.log(url, config)
const journey = ref(null)
const steps = ref(null)

// Maybe load journey
// FIXME: Refactor into $fetch / asyncData
onMounted(async () => {
  if (uuid) {
    try {
      journey.value = await get(`${url}/${uuid}`)
    } catch (e) {
      router.replace(`/create`)
    }
  }
})

const submit = async input => {
  if (! journey.value) {
    journey.value = await post(url, input)
    router.replace(`/create/${journey.value.uuid}`)
  } else {
    steps.value.newStep(input)
  }
}

const setLastStep = step => {
  journey.value.lastStep = step
}

useMetaData({
  title: journey.value ? journey.value?.title : 'Create',
})
</script>

<style lang="postcss" scoped>
  .create {
    display: flex;
    flex-direction: column;
    padding: 0 var(--size-4);
  }

  header {
    width: 100%;
    max-width: var(--content-width);
    margin: var(--size-5) auto 0;

    h1 {
      text-transform: uppercase;
      font-size: var(--size-4);
      font-weight: var(--font-weight-bold);
      letter-spacing: var(--letter-spacing-md);
    }
  }
</style>
