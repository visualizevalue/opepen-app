<template>
  <SubmissionsList
    :base-params="{ status: 'participation' }"
    :default-sort="'latest'"
    :sort-options="sortOptions"
    :query-map="queryMap"
  >
    <template #title>
      <SectionTitle class="visible-md-flex">Open for Participation</SectionTitle>
    </template>

    <template #default="{ items }">
      <SetCardGrid :submissions="items" class="more-space" />
    </template>
  </SubmissionsList>
</template>

<script setup lang="ts">
const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'earliest', label: 'Earliest' },
  { value: 'contributors', label: 'Most Contributors' },
  { value: 'random', label: 'Random' },
]

const queryMap = {
  latest: `-created_at`,
  earliest: `created_at`,
  contributors: `-contributors_count`,
  random: `dailyRandom`,
}

useMetaData({
  title: `Contribute to Sets | Opepen`,
  description:
    'Explore sets open for contribution. Submit your renditions to be considered by set creators.',
  og: '/og/og.png',
})
</script>
