<template>
  <!-- v5: only shown once a set has actually lost members to migration. -->
  <section v-if="v5 && migratedOut > 0" class="migration-composition">
    <div class="row">
      <span class="count">{{ current }}</span>
      <span class="label">Opepen in set</span>
    </div>
    <div class="row out">
      <span class="count">{{ migratedOut }}</span>
      <span class="label">migrated forward</span>
    </div>
    <p class="caption">
      This set has shrunk to {{ current }}. Under forward-only migration, members
      that opt into a later set leave permanently — sets only get smaller.
    </p>
  </section>
</template>

<script setup>
const { set } = defineProps({
  set: { type: Object, required: true },
})

const v5 = useV5Migration()
const current = computed(() => set?.members_current ?? 0)
const migratedOut = computed(() => set?.members_migrated_out ?? 0)
</script>

<style scoped>
.migration-composition {
  padding: var(--spacer) 0;
  border-top: var(--border);
  display: grid;
  gap: var(--size-2);
}

.row {
  display: flex;
  align-items: baseline;
  gap: var(--size-2);

  .count {
    @mixin ui-font;
    font-size: var(--font-lg);
    color: var(--color);
  }

  .label {
    @mixin ui-font;
    font-size: var(--font-xs);
    color: var(--gray-z-6);
  }

  &.out .count {
    color: var(--gray-z-6);
  }
}

.caption {
  margin-top: var(--size-1);
  font-size: var(--font-xs);
  line-height: 1.4;
  color: var(--gray-z-6);
}
</style>
