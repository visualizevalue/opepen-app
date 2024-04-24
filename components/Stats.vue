<template>
  <aside class="stats">
    <div class="stat">
      <h1>Create</h1>
      <p>{{ formatNumber(stats.submissions.images) }}</p>
      <small class="muted">Submissions</small>
    </div>
    <div class="stat">
      <h1>Curate</h1>
      <p>{{ formatNumber(stats.optIns) }}</p>
      <small class="muted">Opt-Ins</small>
    </div>
    <div class="stat">
      <h1>Collect</h1>
      <p>{{ formatNumber(stats.revealed.opepen) }}</p>
      <small class="muted">Published</small>
    </div>
  </aside>
</template>

<script setup>
import { formatNumber } from '~/helpers/format'

const config = useRuntimeConfig()
const { data: stats } = await useFetch(`${config.public.opepenApi}/stats`)
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

  .stat {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: var(--size-3);
    border: var(--border);
    padding: var(--size-3) 0 var(--size-7);

    @container (min-width: 28rem) {
      border-bottom: var(--border) !important;

      &:not(&:last-child) {
        border-right: 0;
      }
    }

    > * {
      line-height: 1em;
      width: 100%;
    }

    h1 {
      font-size: var(--font-md);
      padding: 0 0 var(--size-3);
      border-bottom: var(--border);
    }

    p {
      padding: var(--size-4) 0.5em 0;
      font-family: var(--font-family-body);
      font-weight: 500;
      font-size: 2em;
    }

    small {
      font-size: var(--font-md);
    }
  }
}
</style>
