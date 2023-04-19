<template>
  <div class="create scroll">
    <PageHeader v-if="journey">
      <h1 class="breadcrumb">
        <NuxtLink to="/create">Home</NuxtLink>
        <span class="separator">/</span>
        <span>{{ journey.title }}</span>
      </h1>
    </PageHeader>
    <JourneyForm :journey="journey" :journey-id="uuid" @submit="submit" />
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
import { post } from '~/api'
import { useMetaData } from '~/helpers/head'

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

// Validate route
const [ uuid, ...invalid ] = route.params.slug
if (invalid.length) router.replace(`/create/${uuid}`)

const url = `${config.public.opepenApi}/journeys`
const { data: journey, execute } = await useFetch(`${url}/${uuid}`, { immediate: false })
const steps = ref(null)

if (uuid) {
  await execute()
} else {
  router.replace(`/create`)
  journey.value = null
}

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
</style>
