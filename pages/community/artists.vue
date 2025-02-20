<template>
  <PageFrameMd>
    <SectionTitle>Artists</SectionTitle>
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
const url = `${useConfig('opepenApi')}/accounts/artists`
const sort = ref('-setsCount,-profileCompletion,-setSubmissionsCount,id')
const query = computed(() => {
  const q = new URLSearchParams(`limit=40`)

  q.set('sort', sort.value)

  return q.toString()
})
</script>

