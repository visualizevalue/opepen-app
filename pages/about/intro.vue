<template>
  <PageFrameSm class="prose">
    <h1>Where constraint meets creativity.</h1>

    <p class="lead">
      Opepen Edition is a public art protocol on Ethereum <span class="no-wrap">by <NuxtLink to="https://visualizevalue.com">Visualize Value</NuxtLink></span>.
    </p>

    <p>
      Creators submit their interpretations of the Opepen silhouette. <br />
      Collectors vote on the artwork to include in the permanent collection.
    </p>

    <p>
      There are 200 spots, {{ completeSets.length }} have been filled.
    </p>

    <div class="images">
      <Image image="/wireframe-light.png" />
      <Image image="/interpretations.jpg" />
    </div>

    <p>
      Permanent Opepen artists include Snowfro, ACK, VV, Diewiththemostlikes, Darkfarms, fvckrender, PIV, and more.
    </p>

    <p>
      Collectors may opt-out of the consensus building process at any time by burning their tokens.
      {{ formatNumber(stats?.optOuts.total || 0) }} tokens have been burned.
    </p>

    <p>
      It is Day {{ formatNumber(day) }} of Opepen. <br/>
      <span v-if="stats?.markets.history">
        ${{ formatNumber(stats.markets.history.totalUSD || 0) }} secondary sales volume.
      </span>
    </p>
  </PageFrameSm>
</template>

<script setup lang="ts">
const { completeSets } = await useSets()

const { day, stats } = await useStats()
</script>

<style scoped>
.images {
  margin: var(--spacer) 0;
  display: grid;
  gap: var(--spacer);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
</style>
