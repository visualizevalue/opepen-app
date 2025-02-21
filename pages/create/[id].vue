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

const { data, refresh } = await useApi(`/set-submissions/${route.params.id}`, {
  immediate: false,
  credentials: 'include',
})

onMounted(() => refresh())

useMetaData({
  title: `Update ${data.value?.name || 'Submission'} | Opepen`,
})
</script>

