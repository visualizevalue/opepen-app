<template>
  <PageFrameMd>
    <Alert type="muted" dismiss="explain-permanent-collection">
      <h1>The Permanent Collection</h1>
      <p>
        The Opepen collection consists of 16.000 unique tokens on the Ethereum blockchain
        that are revealed in "sets" (batches of 80 tokens) as more and more artists
        contribute to the protocol and curators vote on the inclusion of art
        in the permanent collection.
      </p>
      <Actions>
        <Button to="/about/intro" class="">Learn more</Button>
      </Actions>
    </Alert>

    <Progress :percent="parseInt(completeSets.length / 200 * 100)" >
      {{ completeSets.length }} / 200
    </Progress>

    <SetCardGrid :submissions="submissions" minimal />
  </PageFrameMd>
</template>

<script setup>
const { completeSets, fetchSets, loaded, setsById } = useSets()

if (! loaded.value) {
  await fetchSets()
}

const allSetIds = [...Array(200)].map((_ , i) => i + 1)
const submissions = computed(() => allSetIds.map(i => setsById.value[i]?.submission || {}))
</script>

