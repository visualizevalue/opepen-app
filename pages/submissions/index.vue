<template>
  <SubmissionsList :default-sort="'demand'" :sort-options="sortOptions" :query-map="queryMap">
    <template #title>
      <SectionTitle class="visible-md-flex">Submissions</SectionTitle>
    </template>

    <template #default="{ items }">
      <SetCardGrid :submissions="items" class="more-space" minimal show-demand />
    </template>
  </SubmissionsList>
</template>

<script setup lang="ts">
const sortOptions = [
  { value: 'demand', label: 'Demand' },
  { value: 'latest', label: 'Latest' },
  { value: 'earliest', label: 'Earliest' },
  { value: 'random', label: 'Random' },
]

const queryMap = {
  demand: `-submission_stats.demand.total`,
  latest: `-published_at`,
  earliest: `created_at`,
  random: `dailyRandom`,
}

useMetaData({
  title: `Set Submissions | Opepen`,
  og: '/og/og.png',
})
</script>
