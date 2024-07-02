<template>
  <aside class="stats">

    <slot :stats="stats">
      <div class="stat-group">
        <h1>Curate</h1>
        <div>
          <p>{{ formatNumber(stats.optIns) }}</p>
          <small class="muted">Opt-Ins</small>
        </div>
        <div>
          <p>{{ formatNumber(stats.votes) }}</p>
          <small class="muted">Votes</small>
          <NuxtLink :to="`/curate/view/all`"><span>View Curations</span></NuxtLink>
        </div>
      </div>

      <div class="stat-group">
        <h1>Collect</h1>
        <div>
          <p>{{ formatNumber(16000 - stats.revealed.opepen) }}</p>
          <small class="muted">Unrevealed</small>
          <NuxtLink :to="`/collect/buy/unrevealed`"><span>View Listings</span></NuxtLink>
        </div>
        <div>
          <p>{{ formatNumber(stats.revealed.opepen) }}</p>
          <small class="muted">Revealed</small>
          <NuxtLink :to="`/collect/buy/revealed`"><span>View Revealed Listings</span></NuxtLink>
        </div>
      </div>

      <div class="stat-group">
        <h1>Create</h1>
        <div>
          <p>{{ formatNumber(stats.submissions.sets) }}</p>
          <small class="muted">Submissions</small>
          <NuxtLink :to="`/curate/view/all`"><span>View Submissions</span></NuxtLink>
        </div>
        <div>
          <p>{{ formatNumber(stats.submissions.images) }}</p>
          <small class="muted">Images</small>
          <NuxtLink :to="`/curate/view/all`"><span>View Images</span></NuxtLink>
        </div>
      </div>
    </slot>

  </aside>
</template>

<script setup>
import { formatEther } from 'viem'
import { formatNumber } from '~/helpers/format'
import { useStats } from '~/helpers/stats'

const { data: stats } = await useStats()
</script>

<style lang="postcss" scoped>
.stats {
  display: grid;
  gap: var(--size-4);
  container-type: inline-size;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));

  :deep(.stat-group) {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    text-align: center;
    border: var(--border);
    background: transparent;
    transition: all var(--speed);

    * {
      line-height: 1em;
      width: 100%;
    }

    h1 {
      font-size: var(--font-md);
      padding: var(--size-3) 0;
      border-bottom: var(--border);
      background: var(--gray-z-0);
    }

    p {
      padding: var(--size-5) 0.5em 0;
      font-family: var(--font-family-body);
      font-weight: 500;
      font-size: 2em;
    }

    small {
      font-size: var(--font-md);
      padding: 0 0.5rem var(--size-5);
    }

    a {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      span {
        opacity: 0;
      }
    }

    &:has(> a),
    div:has(> a) {
      &:--highlight {
        background: var(--gray-z-1);
      }
    }

    div {
      display: grid;
      gap: var(--size-3);
      position: relative;

      + div {
        border-top: var(--border);
      }
    }
  }
}
</style>
