<template>
  <IsAuthenticated>
    <SetSubmissionForm
      v-if="data"
      :data="data"
      :refresh="refresh"
      @updated="data = $event"
    />
  </IsAuthenticated>
</template>

<script setup>
const route = useRoute()

const { data, refresh } = await useApi(`/set-submissions/${route.params.id}`, {
  credentials: 'include',
})
</script>

