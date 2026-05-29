<template>
  <section class="progress">
    <header>
      <SectionTitle>The Permanent Collection</SectionTitle>
      <span class="count">{{ filled }} / {{ total }}</span>
    </header>

    <div class="grid" :style="{ '--total': total }">
      <template v-for="n in total" :key="n">
        <NuxtLink
          v-if="n <= filled"
          :to="`/sets/${pad(n, 3)}`"
          class="cell filled"
          :title="`Set ${pad(n, 3)}`"
        />
        <span v-else class="cell" />
      </template>
    </div>

    <p class="caption">
      <strong>{{ filled }}</strong> permanent sets complete ·
      <strong>{{ total - filled }}</strong> remaining
    </p>
  </section>
</template>

<script setup>
defineProps({
  filled: { type: Number, default: 0 },
  total: { type: Number, default: 200 },
})
</script>

<style scoped>
.progress {
  display: grid;
  gap: var(--spacer);
}

header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacer);

  .count {
    @mixin ui-font;
    font-variant-numeric: tabular-nums;
    color: var(--gray-z-6);
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(20, minmax(0, 1fr));
  gap: var(--size-1);

  @container (max-width: 30rem) {
    grid-template-columns: repeat(10, minmax(0, 1fr));
  }
}

.cell {
  aspect-ratio: 1;
  border-radius: 2px;
  background: var(--gray-z-2);
  border: 0;
  transition: transform var(--speed), background var(--speed);

  &.filled {
    background: var(--color);
  }

  &.filled:hover {
    transform: scale(1.35);
    z-index: 1;
  }
}

.caption {
  @mixin ui-font;
  font-size: var(--font-xs);
  color: var(--gray-z-6);

  strong {
    color: var(--color);
  }
}
</style>
