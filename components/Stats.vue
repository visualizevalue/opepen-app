<template>
  <div v-if="stats" class="grid">

    <Card class="static">
      <h1>Volume</h1>
      <p><small class="muted">$ </small>{{ formatNumber(stats.markets.history.totalUSD || 0) }}</p>
    </Card>

    <Card class="static">
      <h1>Permanent Artists</h1>
      <p>{{ formatNumber(stats.users.permanentArtists) }}</p>
    </Card>

    <Card class="static">
      <h1>Artists</h1>
      <p>{{ formatNumber(stats.users.artists) }}</p>
    </Card>

    <Card class="static">
      <h1>Submissions</h1>
      <p>{{ formatNumber(stats.submissions.sets) }}</p>
    </Card>

    <Card class="static">
      <h1>Curators</h1>
      <p>{{ formatNumber(stats.users.curators) }}</p>
    </Card>

    <Card class="static">
      <h1>Votes</h1>
      <p>{{ formatNumber(stats.optIns) }}</p>
    </Card>

    <Card class="static">
      <h1>Collectors</h1>
      <p>{{ formatNumber(stats.users.holders) }}</p>
    </Card>

    <Card class="static">
      <h1>Day</h1>
      <p>{{ formatNumber(day) }}</p>
    </Card>

    <Card class="static">
      <h1>Opt-Outs <small>(total)</small></h1>
      <p>{{ formatNumber(stats.optOuts.total) }}</p>
    </Card>

    <Card class="static">
      <h1>Opt-Outs <small>(unrevealed)</small></h1>
      <p>{{ formatNumber(stats.optOuts.unrevealed) }}</p>
    </Card>

  </div>
</template>

<script setup lang="ts">
const { day, stats } = await useStats()
</script>

<style scoped>
.card,
.card > div {
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  gap: var(--spacer-sm);
  text-align: center;
  min-height: 9rem;

  h1 {
    @mixin ui-font;
    font-size: var(--ui-font-size);
    color: var(--muted);
    margin: 0;
  }

  p {
    font-size: var(--font-xl);
  }
}

.grid,
.card:has(> div) {
  display: grid;
  gap: var(--spacer);
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));

  .span-2 {
    grid-column: span 2;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

