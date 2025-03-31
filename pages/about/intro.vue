<template>
  <PageFrameSm class="prose">
    <h1>Where constraint meets creativity.</h1>

    <p class="lead">
      Opepen Edition is a public art protocol on Ethereum
      <span class="no-wrap">
        by
        <NuxtLink to="https://visualizevalue.com">Visualize Value</NuxtLink>
      </span>
      .
    </p>

    <p>
      Creators submit their interpretations of the Opepen silhouette.
      <br />
      Collectors vote on the artwork to include in the permanent collection.
    </p>

    <p>There are 200 spots, {{ completeSets.length }} have been filled.</p>

    <div class="images">
      <Image image="/wireframe-light.png" />
      <Image image="/interpretations.jpg" />
    </div>

    <p>
      Permanent Opepen artists include
      <span v-for="artist in artistsResponse.data">
        <NuxtLink :to="`/${id(artist)}`">{{ artist.display }}</NuxtLink>
        ,
      </span>
      and
      <NuxtLink to="/community/artists">more</NuxtLink>
      .
    </p>

    <p>
      Collectors may opt-out of the consensus building process at any time by burning their
      tokens. So far,
      {{ formatNumber(stats?.optOuts.total || 0) }} tokens have been burned.
    </p>

    <h2 id="various-stats">
      <NuxtLink to="#various-stats">Various Statistics</NuxtLink>
    </h2>

    <Stats />

    <h2 id="history"><NuxtLink to="#history">History</NuxtLink></h2>
    <h2 id="sets-and-submissions">
      <NuxtLink to="#sets-and-submissions">Sets & Submissions</NuxtLink>
    </h2>

    <!-- <p> -->
    <!--   It is Day {{ formatNumber(day) }} of Opepen. -->
    <!-- </p> -->
    <!---->
    <!-- <p> -->
    <!--   So far, the collection has amassed ${{ formatNumber(stats.markets.history.totalUSD || 0) }} in secondary sales volume. -->
    <!-- </p> -->
  </PageFrameSm>
</template>

<script setup lang="ts">
const { completeSets } = await useSets()

const { stats } = await useStats()

const { data: artistsResponse } = await useApi(`/accounts/artists?limit=8&sort=-featured`)

useMetaData({
  title: `The Opepen Protocol | Opepen`,
})
</script>

<style scoped>
.images {
  margin: var(--spacer) 0;
  display: grid;
  gap: var(--spacer);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
</style>
