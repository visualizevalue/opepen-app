<template>
  <div>
    <PaginatedContent
      :url="stepsUrl"
      v-slot="{ items }"
    >
      <pre v-for="item in items">{{ item }}</pre>
    </PaginatedContent>
  </div>
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
