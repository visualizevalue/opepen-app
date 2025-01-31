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

    <Progress :percent="parseInt(completeSets.length / 200 * 100)">
      {{ completeSets.length }} / 200
    </Progress>

    <div class="grid">
      <SetPreview
        v-for="id in allSetIds"
        :data="setsById[id]?.submission || {}"
        :key="id"
        minimal
      />
    </div>
  </PageFrameMd>
</template>

<script setup>
const { completeSets, setsById } = useSets()

const allSetIds = [...Array(200)].map((_ , i) => i + 1)

definePageMeta({
  layout: 'page-group-browse',
})
</script>

<style scoped>
.alert {
  margin: 0 0 var(--size-7);
}

.progress {
  margin: var(--size-4) 0 var(--size-8);
}

.grid {
  display: grid;
  gap: var(--size-5);

  article {
    width: 100%;
  }

  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (--md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (--lg) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (min-width: 88rem) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}
</style>

