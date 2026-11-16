<template>
  <PageFrameSm>
    <ClientOnly>
      <Loading v-if="!sessionChecked" />

      <template v-else-if="isAuthenticated">
        <PageHeader>
          <SectionTitle>Your Sets</SectionTitle>

          <Button to="/create/new" class="primary">
            <Icon type="plus" />
            <span>New Set</span>
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
  title: `Your Sets | Opepen`,
})
</script>
