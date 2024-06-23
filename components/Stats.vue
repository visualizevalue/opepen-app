<template>
  <aside class="stats">

    <div class="stat-group">
      <h1>Create</h1>
      <div>
        <p>{{ formatNumber(stats.submissions.images) }}</p>
        <small class="muted">Submissions</small>
        <NuxtLink :to="`/sets/explore`"><span>View Submissions</span></NuxtLink>
      </div>
      <div>
        <p>{{ formatNumber(stats.users.artists) }}</p>
        <small class="muted">Artists</small>
        <NuxtLink :to="`/artists`"><span>View Artists</span></NuxtLink>
      </div>
    </div>

    <div class="stat-group">
      <h1>Curate</h1>
      <div>
        <p>{{ formatNumber(stats.optIns) }}</p>
        <small class="muted">Opt-Ins</small>
        <!-- TODO: Link to /timeline -->
        <NuxtLink :to="`/curators`"><span>View Opt Ins</span></NuxtLink>
      </div>
      <div>
        <p>{{ formatNumber(stats.users.curators) }}</p>
        <small class="muted">Curators</small>
        <NuxtLink :to="`/curators`"><span>View Curators</span></NuxtLink>
      </div>
    </div>

    <div class="stat-group">
      <h1>Collect</h1>
      <div>
        <p>{{ formatNumber(16000 - stats.revealed.opepen) }}</p>
        <small class="muted">Unrevealed</small>
        <NuxtLink :to="`/sets/explore`"><span>View Submissions</span></NuxtLink>
      </div>
      <div>
        <p>{{ formatNumber(stats.revealed.opepen) }}</p>
        <small class="muted">Published</small>
        <NuxtLink :to="`/sets`"><span>View Permanent Collection</span></NuxtLink>
      </div>
    </div>

  </aside>
</template>

<script setup>
import { formatNumber } from '~/helpers/format'
import { useStats } from '~/helpers/stats'

const { data: stats } = await useStats()
</script>

<style lang="postcss" scoped>
.stats {
  display: grid;
  gap: var(--size-4);
  container-type: inline-size;

  @container (min-width: 28rem) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0;
  }

  .stat-group {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    border: var(--border);
    background: transparent;
    transition: all var(--speed);

    @container (min-width: 28rem) {
      &:not(&:nth-child(n+3)) {
        border-bottom: var(--border) !important;
      }

      &:nth-child(n+4) {
        border-top: 0;
      }

      &:not(&:nth-child(3n+1)) {
        border-left: 0;
      }
    }

    * {
      line-height: 1em;
      width: 100%;
    }

    h1 {
      font-size: var(--font-md);
      padding: var(--size-3) 0;
      border-bottom: var(--border);
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
