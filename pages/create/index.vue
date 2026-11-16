<template>
  <PageFrameSm>
    <ClientOnly>
      <Loading v-if="!sessionChecked" />

      <template v-else-if="isAuthenticated">
        <PageHeader>
          <SectionTitle>Your Submissions</SectionTitle>

          <Button to="/create/new">
            <Icon type="plus" />
            <span>New</span>
          </Button>
        </PageHeader>

        <MySetSubmissions />
      </template>

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
  title: `Your Submissions | Opepen`,
})
</script>
