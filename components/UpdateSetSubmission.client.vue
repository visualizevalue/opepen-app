<template>
  <IsAuthenticated>
    <SetSubmissionForm v-if="data" @updated="data = $event" :data="data" />
  </IsAuthenticated>
</template>

<script setup>
const route = useRoute()

const { data } = await useApi(`/set-submissions/${route.params.id}`, {
  credentials: 'include',
})
</script>

