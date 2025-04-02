<template>
  <PageFrameMd>
    <PageHeader class="visible-md-flex">
      <SectionTitle>Permanent Collection</SectionTitle>
    </PageHeader>

    <Progress :percent="parseInt((completeSets.length / 200) * 100)">
      <span>{{ completeSets.length }} / 200</span>
    </Progress>

    <SetCardGrid :submissions="submissions" />
  </PageFrameMd>
</template>

<script setup>
const { completeSets, submissions } = await useSets()

useMetaData({
  title: `Permanent Collection | Opepen`,
  description: `The Opepen collection consists of 16.000 unique tokens on the Ethereum blockchain
                that are revealed in "sets" (batches of 80 tokens) as more and more artists
                contribute to the protocol and curators vote on the inclusion of art
                in the permanent collection.`,
  og: '/og/sets.png',
})
</script>

<style scoped>
.page-frame-md {
  gap: var(--spacer-lg);
  padding-top: var(--spacer);

  @media (--lg) {
    padding: var(--spacer) var(--spacer-lg);
  }
}

.progress {
  margin-bottom: var(--size-5);
}
</style>
