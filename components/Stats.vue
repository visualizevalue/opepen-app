<template>
  <div v-if="stats" class="stats-grid">
    <Card class="borderless static metric-card">
      <p class="metric-value">
        <small class="currency muted">$</small>{{ formatNumber(stats.markets.history.totalUSD || 0) }}
      </p>
      <h3>Volume</h3>
    </Card>

    <Card class="borderless static metric-card">
      <p class="metric-value">{{ formatNumber(stats.users.permanentArtists) }}</p>
      <h3>Permanent Artists</h3>
    </Card>

    <Card class="borderless static metric-card">
      <p class="metric-value">{{ formatNumber(stats.users.artists) }}</p>
      <h3>Artists</h3>
    </Card>

    <Card class="borderless static metric-card">
      <p class="metric-value">{{ formatNumber(stats.submissions.sets) }}</p>
      <h3>Submissions</h3>
    </Card>

    <Card class="borderless static metric-card">
      <p class="metric-value">{{ formatNumber(stats.users.curators) }}</p>
      <h3>Curators</h3>
    </Card>

    <Card class="borderless static metric-card">
      <p class="metric-value">{{ formatNumber(stats.optIns) }}</p>
      <h3>Votes</h3>
    </Card>

    <Card class="borderless static metric-card">
      <p class="metric-value">{{ formatNumber(stats.users.holders) }}</p>
      <h3>Collectors</h3>
    </Card>

    <Card class="borderless static metric-card">
      <p class="metric-value">{{ formatNumber(day) }}</p>
      <h3>Day</h3>
    </Card>

    <Card class="borderless static metric-card">
      <p class="metric-value">{{ formatNumber(stats.optOuts.total) }}</p>
      <h3>Opt-Outs <small>(total)</small></h3>
    </Card>

    <Card class="borderless static metric-card">
      <p class="metric-value">{{ formatNumber(stats.optOuts.unrevealed) }}</p>
      <h3>Opt-Outs <small>(unrevealed)</small></h3>
    </Card>
  </div>
</template>

<script setup lang="ts">
const { day, stats } = await useStats()
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  border-top: var(--border);
  border-left: var(--border);

  @container page (min-width: 44rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.metric-card {
  display: grid;
  align-content: center;
  gap: var(--spacer-sm);
  min-height: 0;
  padding: var(--spacer-lg);
  border-right: var(--border);
  border-bottom: var(--border);

  h3 {
    grid-row: 1;
    @mixin ui-font;
    font-size: 0.75rem;
    color: var(--muted);
    line-height: var(--line-height-md);
    margin: 0;
    border-bottom: 0 !important;
    padding: 0 !important;
  }

  .metric-value {
    grid-row: 2;
    font-size: clamp(var(--font-xl), 4cqw, var(--font-xxl));
    letter-spacing: var(--letter-spacing-sm);
    white-space: nowrap;

    .currency {
      margin-right: 0.1em;
      font-size: 0.7em;
    }
  }
}
</style>
