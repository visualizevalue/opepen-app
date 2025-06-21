<template>
  <PageFrameMd>
    <PageHeader class="visible-md-flex">
      <SectionTitle>Permanent Collection</SectionTitle>
    </PageHeader>

    <Progress
      :percent="parseInt((completeSets.length / 200) * 100)"
      :secondary-percent="parseInt(burnedPercentage)"
      secondary-link="/opepen/burned"
      class="progress"
    >
      <template #primary>
        <span>{{ completeSets.length }} Sets Complete</span>
      </template>
      <template #secondary>
        <span>{{ burnedPercentage }}% burned</span>
      </template>
    </Progress>

    <SetCardGrid :submissions="submissions" />
  </PageFrameMd>
</template>

<script setup>
const { completeSets, submissions } = await useSets()
const config = useRuntimeConfig()

const { data: burnedData } = await useFetch(`${config.public.opepenApi}/opepen/burned`)
const burnedTokens = computed(() => burnedData.value.meta.total || 0)
const totalTokens = 16000
const burnedPercentage = computed(() => ((burnedTokens.value / totalTokens) * 100).toFixed(2))

useMetaData({
  title: `Permanent Collection | Opepen`,
  description: `The Opepen collection consists of 16.000 unique tokens on the Ethereum blockchain
                that are revealed in "sets" (batches of 80 tokens) as more and more artists
                contribute to the protocol and curators vote on the inclusion of art
                in the permanent collection.`,
  og: '/og/og.png',
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
