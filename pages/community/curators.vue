<template>
  <PageFrameMd>
    <SectionTitle>Curators</SectionTitle>
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
const url = `${useConfig('opepenApi')}/accounts/curators`
const sort = ref('-opepen_count,-profileCompletion,id')
const query = computed(() => {
  const q = new URLSearchParams(`limit=40`)

  q.set('sort', sort.value)

  return q.toString()
})
</script>

