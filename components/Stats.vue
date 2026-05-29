<template>
  <div v-if="stats" class="stats-bento">
    <!-- Hero: lifetime volume -->
    <Card class="static tile volume wide">
      <h1>Volume</h1>
      <p class="big">{{ compactUSD(stats.markets.history.totalUSD || 0) }}</p>
      <span class="sub">{{ formatNumber(stats.markets.history.totalETH || 0) }} Ξ all-time</span>
    </Card>

    <!-- Reveal progress -->
    <Card class="static tile reveal wide">
      <h1>Revealed</h1>
      <p class="big">
        {{ formatNumber(stats.revealed.opepen) }}
        <small class="muted">/ {{ formatNumber(16000) }}</small>
      </p>
      <div class="bar">
        <div class="fill" :style="{ width: `${(stats.revealed.opepen / 16000) * 100}%` }" />
      </div>
      <span class="sub">{{ stats.revealed.sets }} / 200 sets in the permanent collection</span>
    </Card>

    <!-- Floor by edition — the scarcity curve -->
    <Card v-if="editionFloors.length" class="static tile floor wide tall">
      <h1>Floor by Edition</h1>
      <ul class="floor-bars">
        <li v-for="f in editionFloors" :key="f.edition">
          <span class="label">1 of {{ f.edition }}</span>
          <span class="track">
            <span class="value-bar" :style="{ width: `${f.pct}%` }" />
          </span>
          <span class="value">{{ f.eth }} Ξ</span>
        </li>
      </ul>
    </Card>

    <!-- Community + activity metrics -->
    <Card class="static tile"><h1>Collectors</h1><p>{{ formatNumber(stats.users.holders) }}</p></Card>
    <Card class="static tile"><h1>Artists</h1><p>{{ formatNumber(stats.users.artists) }}</p></Card>
    <Card class="static tile"><h1>Permanent Artists</h1><p>{{ formatNumber(stats.users.permanentArtists) }}</p></Card>
    <Card class="static tile"><h1>Curators</h1><p>{{ formatNumber(stats.users.curators) }}</p></Card>
    <Card class="static tile"><h1>Votes</h1><p>{{ formatNumber(stats.optIns) }}</p></Card>
    <Card class="static tile"><h1>Submissions</h1><p>{{ formatNumber(stats.submissions.sets) }}</p></Card>
    <Card class="static tile"><h1>Days Live</h1><p>{{ formatNumber(day) }}</p></Card>
    <Card class="static tile"><h1>Opt-Outs <small>(total)</small></h1><p>{{ formatNumber(stats.optOuts.total) }}</p></Card>
  </div>
</template>

<script setup lang="ts">
import { formatEther } from 'viem'

const { day, stats } = await useStats()

const editionFloors = computed(() => {
  const editions = stats.value?.markets?.floor?.unrevealedEditions
  if (!editions) return []

  const rows = ([1, 4, 5, 10, 20, 40] as const).map((edition) => {
    const eth = Number(formatEther(BigInt(editions[edition] || '0')))
    return { edition, eth }
  })

  const max = Math.max(...rows.map((r) => r.eth), 0.0001)
  return rows.map((r) => ({
    edition: r.edition,
    eth: r.eth >= 1 ? r.eth.toFixed(2) : r.eth.toFixed(3),
    pct: Math.max((r.eth / max) * 100, 2),
  }))
})

const compactUSD = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${formatNumber(n)}`
}
</script>

<style scoped>
.stats-bento {
  display: grid;
  gap: var(--spacer);
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: minmax(5.5rem, auto);

  @media (max-width: 60rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.tile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacer-sm);
  text-align: center;

  h1 {
    @mixin ui-font;
    font-size: var(--ui-font-size);
    color: var(--muted);
    margin: 0;
    border-bottom: 0 !important;
    padding: 0 !important;
  }

  p {
    font-size: var(--font-base);

    &.big {
      font-size: var(--font-lg);
      line-height: 1.1;
    }

    small {
      font-size: var(--font-sm, var(--font-xs));
    }
  }

  .sub {
    @mixin ui-font;
    font-size: var(--font-xs);
    color: var(--gray-z-6);
  }
}

/* Spans */
.wide {
  grid-column: span 2;
}
.tall {
  grid-row: span 2;
}
@media (max-width: 60rem) {
  .wide {
    grid-column: span 2;
  }
  .tall {
    grid-row: span 2;
  }
}

/* Volume hero: left-aligned, larger presence */
.volume,
.reveal,
.floor {
  text-align: left;
  align-items: stretch;
  justify-content: flex-start;
}

/* Reveal progress bar */
.reveal {
  .bar {
    height: var(--size-2);
    border-radius: var(--size-1);
    background: var(--gray-z-2);
    overflow: hidden;
    margin: var(--size-1) 0;
  }
  .fill {
    height: 100%;
    background: var(--color);
    border-radius: var(--size-1);
    transition: width var(--speed);
  }
}

/* Floor-by-edition bars */
.floor {
  .floor-bars {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--size-2);
    flex: 1;
    align-content: center;

    li {
      display: grid;
      grid-template-columns: 3.5rem 1fr 3.5rem;
      align-items: center;
      gap: var(--size-2);
    }

    .label {
      @mixin ui-font;
      font-size: var(--font-xs);
      color: var(--gray-z-6);
    }

    .track {
      height: var(--size-3);
      background: var(--gray-z-2);
      border-radius: var(--size-1);
      overflow: hidden;
    }

    .value-bar {
      display: block;
      height: 100%;
      background: var(--color);
      border-radius: var(--size-1);
    }

    .value {
      @mixin ui-font;
      font-size: var(--font-xs);
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
  }
}
</style>
