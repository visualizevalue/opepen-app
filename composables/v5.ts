// v5 — forward-only migration.
//
// The single mechanic: a *revealed* Opepen can opt into future sets. If it is
// selected in a new set, it migrates forward and permanently vacates its prior
// set. Old sets only ever shrink (supply never refills); total supply stays at
// 16,000. Participation becomes iterative instead of terminal.
//
// This composable is the frontend feature gate. The real rules are enforced by
// the contracts + opepen-api; everything here degrades to current behaviour
// when the flag is off.

export const useV5Migration = (): boolean => !!useConfig('v5Migration')

// A single step in a token's set lineage (its "evolutionary history").
export type MigrationStep = {
  set_id: number | null // null === unrevealed / blank
  set_name: string
  reveals_at: string | null // ISO; when the token entered this state
  current: boolean // the token's present set
}

// Shape the migration view expects. Sourced from the API in production; mocked
// below until the v5 endpoints exist.
export type MigrationHistory = {
  token_id: number
  edition: number
  steps: MigrationStep[]
}

// Build a single-step "history" from a token's present state. Used as a
// fallback before the v5 lineage endpoint exists, and for tokens that have
// never migrated (the common case): mint → current set.
const historyFromToken = (opepen: any): MigrationHistory => {
  const sub = opepen?.submission
  const steps: MigrationStep[] = []

  // Genesis: every Opepen starts blank/unrevealed.
  steps.push({
    set_id: null,
    set_name: 'Unrevealed',
    reveals_at: null,
    current: !opepen?.revealed_at,
  })

  // Its present set, if revealed.
  if (opepen?.revealed_at && sub?.set_id) {
    steps.push({
      set_id: sub.set_id,
      set_name: sub.name || `Set ${sub.set_id}`,
      reveals_at: sub.reveals_at || opepen.revealed_at,
      current: true,
    })
  }

  return { token_id: opepen?.token_id, edition: opepen?.data?.edition, steps }
}

// A fabricated multi-step lineage for previewing the migrated state. Demo only.
const demoHistory = (opepen: any): MigrationHistory => ({
  token_id: opepen?.token_id,
  edition: opepen?.data?.edition,
  steps: [
    { set_id: null, set_name: 'Unrevealed', reveals_at: null, current: false },
    { set_id: 11, set_name: 'Recurse', reveals_at: '2023-08-19', current: false },
    { set_id: 47, set_name: 'Deconstructed', reveals_at: '2024-05-02', current: false },
    { set_id: 81, set_name: 'Grail', reveals_at: '2025-11-14', current: true },
  ],
})

// Fetch a token's full set lineage. Tries the v5 endpoint; on any failure (or
// when v5 is off) falls back to the single-step history from current state, so
// the view always renders something coherent.
export const useMigrationHistory = (opepen: Ref<any>) => {
  const api = useApiBase()
  const history = ref<MigrationHistory | null>(null)
  const loading = ref(false)

  const load = async () => {
    const token = opepen.value
    if (!token?.token_id) return

    // Demo: `?demo-migration` fabricates a multi-set lineage so the migrated
    // "evolutionary history" visual can be previewed before the v5 API exists.
    // Obviously opt-in; never fires on normal page loads.
    if (import.meta.client && useRoute().query['demo-migration'] !== undefined) {
      history.value = demoHistory(token)
      return
    }

    if (!useV5Migration()) {
      history.value = historyFromToken(token)
      return
    }

    loading.value = true
    try {
      const res: any = await $fetch(`${api}/opepen/${token.token_id}/migrations`)
      history.value =
        res?.steps?.length ? (res as MigrationHistory) : historyFromToken(token)
    } catch (e) {
      history.value = historyFromToken(token)
    }
    loading.value = false
  }

  watch(opepen, load, { immediate: true })

  // Migrated === lived in more than one revealed set.
  const hasMigrated = computed(
    () => (history.value?.steps.filter((s) => s.set_id !== null).length || 0) > 1,
  )

  return { history, loading, hasMigrated, reload: load }
}
