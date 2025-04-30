<template>
  <SubmissionsList :base-params="{ status: 'participation' }" :default-sort="'latest'">
    <template #title>
      <SectionTitle class="visible-md-flex">Open for Participation</SectionTitle>
    </template>

    <template #default="{ items }">
      <SetCardGrid :submissions="items" class="more-space" />
    </template>
  </SubmissionsList>
</template>

<script setup lang="ts">
useMetaData({
  title: `Contribute to Sets | Opepen`,
  description:
    'Explore sets open for contribution. Submit your renditions to be considered by set creators.',
  og: '/og/og.png',
})
</script>
