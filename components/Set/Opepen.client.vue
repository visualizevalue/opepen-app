<template>
  <SetOpepenGrid v-if="revealed">
    <Loading v-if="pending" />
    <template v-else>
      <div class="list list-1">
        <SectionTitle>
          {{ submission[`edition1Name`] }}
          <span class="muted">(1/1)</span>
        </SectionTitle>

        <OpepenCard v-if="edition1" :token="edition1" :set="1" />
        <div v-else-if="v5" class="ghost" title="Migrated forward">
          <Icon type="opepen" />
        </div>
      </div>

      <div v-for="edition of EDITIONS" class="list" :class="[`list-${edition}`]">
        <SectionTitle>
          {{ submission[`edition${edition}Name`] }}
          <span class="muted">(1/{{ edition }})</span>
        </SectionTitle>

        <OpepenCard v-for="token of visibleForEdition(edition)" :token="token" />
        <div
          v-for="n in ghostsFor(edition)"
          :key="`ghost-${edition}-${n}`"
          class="ghost"
          title="Migrated forward"
        >
          <Icon type="opepen" />
        </div>
      </div>
    </template>
  </SetOpepenGrid>
</template>

<script setup>
const { submission } = defineProps({
  submission: Object,
})

const v5 = useV5Migration()

const revealsAt = ref(DateTime.fromISO(submission.reveals_at).toUnixInteger())
const revealed = ref(revealsAt.value <= DateTime.now().toUnixInteger() && submission.set_id)

const config = useRuntimeConfig()
const url = `${config.public.opepenApi}/opepen/sets/${submission.set_id}/opepen`
const { data: opepen, pending } = useLazyFetch(url, { key: 'revealed-opepen' })

const EDITIONS = [4, 5, 10, 20, 40]
const opepenForEdition = (edition) =>
  (opepen.value || []).filter((o) => o.data.edition === edition)

// Preview: `?demo-shrink=N` vacates N positions (keystone first, then larger
// editions) so the sparse-set effect can be seen before any real migration.
const demoShrink = Number(useRoute().query['demo-shrink'] ?? 0)
const demoVacancies = computed(() => {
  const v = { 1: 0, 4: 0, 5: 0, 10: 0, 20: 0, 40: 0 }
  let remaining = demoShrink
  if (remaining > 0) {
    v[1] = 1 // empty the keystone first — the most striking signal
    remaining--
  }
  for (const e of [40, 20, 10, 5, 4]) {
    const take = Math.min(remaining, e)
    v[e] = take
    remaining -= take
    if (remaining <= 0) break
  }
  return v
})

// Members still present (real data minus any demo vacancies).
const visibleForEdition = (edition) => {
  const all = opepenForEdition(edition)
  return all.slice(0, all.length - (demoVacancies.value[edition] || 0))
}

const edition1 = computed(() =>
  demoVacancies.value[1] ? null : opepenForEdition(1)[0],
)

// v5: a revealed set only shrinks (members migrate forward, never refill). Show
// the departed positions as faint ghost slots so the set's composition itself
// reads as sparser — impermanence made visible in the artwork, not a stat.
const ghostsFor = (edition) => {
  if (!v5 && !demoShrink) return 0
  return Math.max(edition - visibleForEdition(edition).length, 0)
}
</script>

<style scoped>
.ghost {
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--border-radius);
  border: 1px dashed var(--gray-z-3);
  background: var(--gray-z-1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-z-3);
  opacity: 0.5;

  :deep(svg) {
    width: 28%;
    height: 28%;
  }
}
</style>
