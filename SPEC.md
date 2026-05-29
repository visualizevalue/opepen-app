# Opepen v5 — Forward-Only Migration

> Status: **Draft / proposal.**
> - Frontend (Layer 3): prototyped behind the `v5Migration` flag (off by default).
> - API (Layer 2): implemented behind the `V5_MIGRATION` flag on branch
>   `v5-forward-migration` in `opepen-api` (builds clean; not run against a DB).
> - Contracts (Layer 1): **no change required** — see §4. This was the surprise.

## 1. Summary

v5 introduces a single mechanic:

> **A revealed Opepen can opt into future sets. If it is selected, it migrates
> forward into the new set and permanently vacates its prior set.**

Nothing else changes: still 16,000 Opepen, same edition structure (1 / 4 / 5 /
10 / 20 / 40), no new supply, no new token layer. Only *participation logic*
changes — from terminal to iterative.

### Why

The current system makes participation **terminal**: once an unrevealed Opepen
enters a set, the decision is permanent. As iconic sets accumulate, holders
(especially the 200 Edition 1s, the coordination keystone) rationally **preserve
optionality** by *not* opting in — waiting for a hypothetical future grail. The
result is coordination paralysis well before the 200-set curve completes. The
slowdown is an emergent property of successful scarcity, not weak demand.

Forward migration lowers perceived commitment cost without weakening scarcity:
you can opt into a set you like now, and still move forward later if a bigger
set appears. No loss of optionality, so no reason to hoard.

## 2. Core invariant (the vacate model)

**Migration is atomic: a token leaves its old set if and only if it is selected
in a new set (leave ⟺ join).**

- A revealed Opepen opts into a new set. If **not** selected: nothing changes,
  it stays in its current set.
- If **selected**: it migrates into the new set and is removed from its prior
  set in the same operation.

**Old sets monotonically shrink.** Once a token leaves a set, that membership is
gone forever. There are **no opt-ins back** into an old set; vacated slots never
refill. A set born at 80 members can only go 80 → 79 → 78 … over time.

**Zero-sum.** Total supply is always 16,000. Per-set membership only decreases.
No duplication, no synthetic scarcity. The shrinking of an old set is itself a
provenance signal (its members were pulled forward into more-wanted sets).

### Consequences to design around

- A "complete" set is no longer a fixed 80-member object. Set size becomes a
  function of time: `members(set, t)`. UI and metadata must treat set
  composition as time-indexed, not static.
- Provenance becomes a **path**, not a point: a token has an *evolutionary
  history* across sets. This is intended to be culturally meaningful (an
  Edition 1 migrating from an obscure early set into a future grail).
- Edge cases requiring an explicit decision (see §7): can a set reach 0? Does an
  Edition-1 departure invalidate the old set's "completeness"? Are there
  cooldowns or per-token migration caps?

## 3. Architecture: where each rule lives

The rule "only unrevealed Opepen can opt in" is currently enforced in three
layers. v5 must change all three; the frontend alone is cosmetic.

| Layer | Repo | Current behavior | v5 change |
|---|---|---|---|
| **Contracts** | `opepen-contracts` | `TheOpepenArchive.tokenSets[tokenId]` is an `onlyManager`-writable mapping with **no immutability guard**; the on-chain renderer reads it live. | **No change needed.** A revealed token's set is reassigned with the existing `batchSaveTokenSets()` admin call. See §4. |
| **API + indexer** | `opepen-api` | Gates opt-in to unrevealed; runs the lottery; assigns `set_id` on reveal. | Accept revealed tokens; record migration lineage; decrement old-set membership; expose lineage + time-indexed set composition. |
| **Frontend** | `opepen-app` (this repo) | Shows only unrevealed Opepen in the opt-in modal. | Show revealed Opepen as migratable; warn on vacate; render evolutionary history. **Prototyped, flagged off.** |

### Current flow (traced from code)

1. `OptInModal.client.vue` lists the holder's Opepen (`useOpepen`,
   `owned-opepen.ts`) — today filtered to `unrevealedOpepen`.
2. Holder selects tokens + per-edition `max_reveals`, signs an **off-chain
   message** (`signMessage`, gasless), and POSTs to
   `POST {opepenApi}/set-submissions/{uuid}/subscribe`.
3. Allocation runs later against an on-chain `reveal_block_number` (the lottery).
   The API assigns `set_id`; `reveal.ts` treats `revealed = !!submission.set_id`.

The opt-in *intent* is off-chain; the *reveal* is on-chain and (today) terminal.

## 4. Contracts (Layer 1 — NOT a blocker)

The original assumption was that on-chain reveal is terminal and migration would
need a new/upgraded contract. **Reading the code, that's false.**

In `opepen-contracts`, `TheOpepenArchive` stores set membership as:

```solidity
mapping(uint256 => uint256) private tokenSets;          // tokenId → setId
mapping(uint256 => uint256) private tokenSetEditionIds; // tokenId → edition index
```

written by `batchSaveTokenSets(...)` — an `onlyManager` function with **no
"already set" guard**. The only immutability is `setLocked[set]`, which freezes a
set's *artwork* (`updateSetData`), **not** token membership. The on-chain
`OpepenMetadataRenderer` calls `getTokenSet(tokenId)` *live* on every
`tokenURI()`, so rewriting the mapping rewrites the metadata.

So forward migration on-chain is just: during the migration reveal, the manager
calls `batchSaveTokenSets()` with the migrating tokens' new set IDs. The token
leaves the old set (the reverse mapping is overwritten) and joins the new one. No
new contract, no upgrade, no proxy.

Caveats / decisions:
- **Lock policy — none (§7).** No set is locked against losing members. Note
  this is independent of `setLocked` anyway: that freezes a set's *artwork*, not
  its membership, so even art-locked sets can shrink as tokens migrate out.
- **Provenance source of truth.** `batchSaveTokenSets` overwrites; it does not
  emit a from→to event. On-chain lineage is therefore *not* reconstructable from
  this call alone. Either (a) treat the API `token_migrations` table as the
  lineage source of truth (current implementation), or (b) add a thin event/log
  for fully trustless provenance. Recommend (a) now, (b) later if desired.

## 5. API (Layer 2 — implemented on branch `v5-forward-migration`)

Built behind env flag `V5_MIGRATION` + a per-submission `allow_forward_migration`
column (default false), so production behaviour is unchanged until both are on.
The build typechecks; it has not been run against a database. Changes:

- **Migration** `database/migrations/*_add_token_migrations_table.ts` — new
  `token_migrations` table (token_id, from/to set + submission, migrated_at) and
  `set_submissions.allow_forward_migration` boolean.
- **Model** `app/Models/TokenMigration.ts` — lineage model + `record()` helper.
- **`app/Services/Metadata/Reveal/Reveal.ts`** — in `generateMetadataFor`, when a
  revealed token is reassigned to a different set, write a `TokenMigration` row
  *before* overwriting `setId` (the vacate is implicit: `setId` only ever points
  at one set). Old set shrinks; supply constant.
- **`app/Models/SetSubmission.ts`** — `cleanSubscriptionsAndStats` no longer
  filters out revealed Opepen when the set accepts migration and the token comes
  from a *different* set.
- **`app/Controllers/Http/OpepenController.ts` + `start/routes.ts`** — new
  `GET /v1/opepen/:id/migrations` returning the lineage (§5.2).

### 5.1 Opt-in: accept revealed tokens

`POST /set-submissions/{uuid}/subscribe` must accept revealed token IDs (not
just unrevealed). Validation additions:

- A revealed token's opt-in is a *migration intent*; if selected it triggers the
  vacate of its current set.
- Reject opting a token into the set it already belongs to (no-op migration).
- Honor any cooldown / per-token migration cap decided in §7.

### 5.2 Migration lineage endpoint (consumed by this frontend)

```
GET /opepen/{token_id}/migrations
```

Response (matches `MigrationHistory` in `composables/v5.ts`):

```jsonc
{
  "token_id": 4269,
  "edition": 1,
  "steps": [
    { "set_id": null, "set_name": "Unrevealed",    "reveals_at": null,          "current": false },
    { "set_id": 11,   "set_name": "Recurse",        "reveals_at": "2023-08-19",  "current": false },
    { "set_id": 81,   "set_name": "Grail",          "reveals_at": "2025-11-14",  "current": true  }
  ]
}
```

- `steps` ordered oldest → newest. First step is always genesis (`set_id: null`,
  unrevealed). Exactly one step has `current: true`.
- A never-migrated revealed token returns two steps (genesis + current). The
  frontend already derives this as a fallback (`historyFromToken`), so the
  endpoint is additive, not blocking for the migrated-count of 1.

### 5.3 Time-indexed set composition

Set detail (`GET /opepen/sets` / set submission) should expose **current**
member count and ideally a "members lost to migration" figure, since sets now
shrink. Suggested additions to the set/submission payload:

- `members_current: number` — live membership (≤ original 80).
- `members_migrated_out: number` — count vacated over time.
- Optionally, the list of tokens that migrated out and where they went (feeds a
  "this set fed into …" view).

## 6. Frontend (Layer 3 — prototyped in this repo)

All gated by `useV5Migration()` (`composables/v5.ts`); no-ops when the flag is
off. Enable with `NUXT_PUBLIC_V5_MIGRATION=true`.

- **`composables/v5.ts`** — flag, `MigrationHistory` types, `useMigrationHistory`
  (fetches `/migrations`, falls back to single-step history; `?demo-migration`
  query fabricates a multi-set path for preview).
- **`composables/owned-opepen.ts`** — adds `migratableOpepen` (revealed tokens),
  `optInableOpepen` / `optInableByEdition` (blank + revealed, grouped).
- **`components/Set/OptInModal.client.vue`** — uses the v5 pool; revealed tokens
  show a "⤳ migrates from Set N" badge and a vacate warning before confirm.
- **`components/Opepen/MigrationHistory.client.vue`** — the "Evolution" lineage
  timeline on `pages/opepen/[id].vue`.

### Still to build on the frontend

- Set detail: surface `members_current` / "shrank from 80 → N" and a
  "migrated into …" cross-link (`components/Set/Collectors.vue`,
  `ConsensusBreakdown.vue`).
- Opt-in history: distinguish a *migration* opt-in from a first opt-in
  (`OptInHistory.client.vue`, `Opepen/OptInStats.client.vue`).
- Success modal copy for the migrated case (`OptInSuccessModal`).

## 7. Design decisions (resolved): fully liquid, nothing blocks migration

The model is **fully liquid** — no rule ever prevents a revealed Opepen from
migrating forward. Each question below is settled as "no block":

1. **Floor on set size — none.** A set can shrink all the way down. There is no
   minimum membership and no protected floor. Sets only ever get smaller.
2. **Edition-1 keystone — not a constraint on *departure*.** Edition 1 is only
   special for *forming* a new set (the lottery still places exactly one). An
   Edition 1 *leaving* an old set is allowed and unremarkable — the old set just
   shrinks; "completeness" is historical, not refilled. This is in fact the core
   benefit: v5 returns all 200 Edition 1s to circulation for new-set formation
   instead of freezing them in place, which is precisely the bottleneck v5 exists
   to dissolve.
3. **Migration friction — none.** No cooldown, no per-token lifetime cap.
4. **Eligibility window — unrestricted.** A token may migrate out of *any* set,
   including the earliest. No set is locked against losing members.
5. **Rollout** (the only remaining lever, and it's operational not structural):
   v5 is enabled per set via `allow_forward_migration`, so it can ship on a
   bounded set of future sets first or globally — that's a switch, not a design
   question.

Implication for the implementation: the only guard the API enforces is "a token
can't migrate into the set it already belongs to" (a no-op). Nothing else blocks.

## 8. Sequencing

Contracts are no longer a blocker (§4), so this collapses to mostly off-chain
work plus one admin call:

1. §7 decisions resolved (fully liquid). No further design gating.
2. API (done, flagged): review the branch; add time-indexed set-composition
   counts (§5.3) and per-submission flag wiring in the admin/curate path.
3. Frontend (done, flagged): finish §6 remainder; it already consumes the real
   `/migrations` endpoint with a fallback, so no change needed to light up.
4. Migration reveal: during the reveal that performs a migration, the manager
   calls `batchSaveTokenSets()` to sync on-chain set assignment.
5. Staging end-to-end with both flags on: opt-in revealed → lottery → migrate →
   `token_migrations` row + on-chain `tokenSets` update → lineage + shrunk
   old-set membership reflected in UI.
