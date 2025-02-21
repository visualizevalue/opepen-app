<template>
  <PageFrameSm>
    <IsAuthenticated>
      <SetSubmissionForm
        v-if="data"
        :data="data"
        :refresh="refresh"
        @updated="data = $event"
      />
      <Loading v-else />
    </IsAuthenticated>
  </PageFrameSm>
</template>

<script setup>
const route = useRoute()

const { data, refresh } = await useApi(`/set-submissions/${route.params.id}`)

if (! data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Submission Not Found',
  })
}

useMetaData({
  title: `Update ${data.value?.name || 'Submission'} | Opepen`,
})
</script>

