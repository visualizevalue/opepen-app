<template>
  <PageFrameSm>
    <ClientOnly>
      <Loading v-if="!sessionChecked" />
      <CreateNewSetSubmission v-else-if="isAuthenticated" />
      <CreateIntro v-else />

      <template #fallback>
        <CreateIntro />
      </template>
    </ClientOnly>
  </PageFrameSm>
</template>

<script setup>
// Starts the session lookup that drives sessionChecked / isAuthenticated.
onMounted(() => useSignIn())

useMetaData({
  title: 'New Set Submission | Opepen',
  description:
    'Submit your interpretation of the Opepen silhouette as a set of six or eighty artworks.',
})
</script>
