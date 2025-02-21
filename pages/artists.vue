<template>
  <PageFrameMd>
    <PageHeader>
      <SectionTitle>Artists</SectionTitle>
    </PageHeader>

    <PaginatedContent
      :url="url"
      :query="query"
      v-slot="{ items }"
    >
      <ProfileCardGrid :accounts="items" />
    </PaginatedContent>
  </PageFrameMd>
</template>

<script setup lang="ts">
const url = `${useApiBase()}/accounts/artists`
const sort = ref('-featured,-setsCount,-profileCompletion,-setSubmissionsCount,id')
const query = computed(() => {
  const q = new URLSearchParams(`limit=40`)

  q.set('sort', sort.value)

  return q.toString()
})
</script>

