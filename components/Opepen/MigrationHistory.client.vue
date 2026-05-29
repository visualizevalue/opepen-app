<template>
  <section v-if="v5 && history" class="migration-history">
    <header>
      <h2>Evolution</h2>
      <span v-if="hasMigrated" class="badge">Migrated</span>
    </header>

    <ol class="lineage">
      <li v-for="(step, i) in history.steps" :key="i" :class="{ current: step.current }">
        <span class="dot" />
        <div class="step">
          <NuxtLink v-if="step.set_id" :to="`/sets/${pad(step.set_id)}`" class="set">
            {{ step.set_name }}
          </NuxtLink>
          <span v-else class="set muted">{{ step.set_name }}</span>
          <time v-if="step.reveals_at">{{ formatDate(step.reveals_at) }}</time>
          <span v-if="step.current" class="here">now</span>
        </div>
      </li>
    </ol>

    <p class="caption">
      <template v-if="hasMigrated">
        This Opepen migrated forward across {{ revealedSteps }} sets. The path is
        part of the artwork.
      </template>
      <template v-else>
        Under forward-only migration, a revealed Opepen can opt into a future
        set. If selected, it migrates here and vacates its prior set.
      </template>
    </p>
  </section>
</template>

<script setup>
const { opepen } = defineProps({
  opepen: { type: Object, required: true },
})

const v5 = useV5Migration()
const opepenRef = computed(() => opepen)
const { history, hasMigrated } = useMigrationHistory(opepenRef)

const revealedSteps = computed(
  () => history.value?.steps.filter((s) => s.set_id !== null).length || 0,
)
</script>

<style scoped>
.migration-history {
  padding: var(--spacer) 0;
  border-top: var(--border);
}

header {
  display: flex;
  align-items: center;
  gap: var(--size-2);
  margin-bottom: var(--spacer);

  h2 {
    @mixin ui-font;
  }

  .badge {
    @mixin ui-font;
    font-size: var(--font-xs);
    padding: var(--size-1) var(--size-2);
    border: var(--border);
    border-radius: var(--size-1);
    color: var(--gray-z-6);
  }
}

.lineage {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0;

  li {
    display: grid;
    grid-template-columns: var(--size-4) 1fr;
    align-items: start;
    position: relative;
    padding-bottom: var(--spacer);

    /* connector line between dots */
    &:not(:last-child) .dot::after {
      content: '';
      position: absolute;
      left: 50%;
      top: var(--size-4);
      bottom: calc(-1 * var(--spacer));
      width: 1px;
      background: var(--gray-z-4);
      transform: translateX(-50%);
    }

    .dot {
      position: relative;
      width: var(--size-3);
      height: var(--size-3);
      margin-top: var(--size-1);
      border-radius: 50%;
      border: 1px solid var(--gray-z-5);
      background: var(--semi);
    }

    &.current .dot {
      background: var(--color);
      border-color: var(--color);
    }
  }

  .step {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--size-2);

    .set {
      @mixin ui-font;
      color: var(--color);
      text-decoration: none;

      &.muted {
        color: var(--gray-z-6);
      }
    }

    time {
      font-size: var(--font-xs);
      color: var(--gray-z-5);
    }

    .here {
      @mixin ui-font;
      font-size: var(--font-xs);
      color: var(--gray-z-6);
    }
  }
}

.caption {
  margin-top: var(--size-2);
  font-size: var(--font-xs);
  line-height: 1.4;
  color: var(--gray-z-6);
}
</style>
