<template>
  <section v-if="ownedSets.length">
    <SectionTitle>Collection Overview</SectionTitle>
    <Card class="static">
      <div class="set-grid">
        <div
          v-for="setNumber in 200"
          :key="`set-${setNumber}`"
          class="set"
          :class="{
            'is-owned': isSetOwned(setNumber),
            'not-revealed': !isSetRevealed(setNumber),
            'is-perfect': isPerfectSet(setNumber),
          }"
          :title="`Set ${pad(setNumber)}`"
        ></div>
      </div>
      <div class="stats">
        <div>Total Sets: {{ ownedSets.length }} / {{ revealedSets.length }}</div>
      </div>
    </Card>

    <Card v-if="setCompletionData.length" class="static set-completion-table">
      <h2 class="section-label">Full Sets  ({{ perfectSets.length }})</h2>
      <Table>
        <thead>
          <tr>
            <td></td>
            <td v-for="edition in EDITIONS" :key="`h-${edition}`" class="edition-column">{{ edition }}</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="set in displayedSets" :key="`set-${set.setId}`">
            <td class="set-column">
              <NuxtLink :to="`/sets/${set.setNumber}`" class="set-link">
                <span class="set-number">Set {{ set.setId }}</span>
                <span class="set-name">{{ getSetName(set.setNumber) }}</span>
              </NuxtLink>
            </td>
            <td
              v-for="edition in EDITIONS"
              :key="`${set.setId}-${edition}`"
              class="edition-column"
              :class="{ 'is-missing': getEditionCount(set, edition) === 0 && set.missingCount > 0 }"
            >
              {{ getEditionCount(set, edition) }}
            </td>
          </tr>
        </tbody>
      </Table>
      <Button
        v-if="almostCompleteSets.length && fullSets.length"
        @click="showAlmostComplete = !showAlmostComplete"
        class="toggle-button"
      >
        {{ showAlmostComplete ? 'Hide' : 'Almost Complete' }} ({{ almostCompleteSets.length }})
      </Button>
    </Card>
  </section>
</template>

<script setup>
const props = defineProps({
  address: {
    type: String,
    required: true,
  },
})

const EDITIONS = [1, 4, 5, 10, 20, 40]

const { data: opepen } = await useApi(`/accounts/${props.address}/opepen`)
const { data: sets } = await useApi(`/opepen/sets`)
const address = computed(() => props.address)
const { addresses: delegatedAddresses } = await useDelegation(address)
const { opepen: delegatedOpepen } = await useOpepen(delegatedAddresses.value)

const revealedSets = computed(() => sets.value?.map((set) => pad(set.id)) || [])

const collectionData = computed(() => {
  const tokens = [...opepen.value.data, ...delegatedOpepen.value]
  const setIds = new Set()
  const setMap = {}
  const perfectSets = []

  tokens.forEach((token) => {
    if (!token.set_id) return

    const setId = pad(token.set_id)
    setIds.add(setId)

    if (token.data?.edition) {
      if (!setMap[setId]) setMap[setId] = { editions: {} }
      if (!setMap[setId].editions[token.data.edition]) {
        setMap[setId].editions[token.data.edition] = []
      }

      setMap[setId].editions[token.data.edition].push(token)
    }
  })

  const ownedSetIds = Array.from(setIds)
  for (const setId of ownedSetIds) {
    if (
      setMap[setId] &&
      EDITIONS.every((edition) => setMap[setId].editions[edition]?.length)
    ) {
      perfectSets.push(setId)
    }
  }

  return { ownedSets: ownedSetIds, perfectSets }
})

const ownedSets = computed(() => collectionData.value.ownedSets)
const perfectSets = computed(() => collectionData.value.perfectSets)

const showAlmostComplete = ref(false)

const setCompletionData = computed(() => {
  const tokens = [...opepen.value.data, ...delegatedOpepen.value]
  const setMap = {}
  const allSets = []

  tokens.forEach((token) => {
    if (!token.set_id) return
    const setId = pad(token.set_id)

    if (!setMap[setId]) {
      setMap[setId] = {
        setId,
        setNumber: token.set_id,
        editions: {}
      }
    }

    if (token.data?.edition) {
      if (!setMap[setId].editions[token.data.edition]) {
        setMap[setId].editions[token.data.edition] = []
      }
      setMap[setId].editions[token.data.edition].push(token)
    }
  })

  Object.values(setMap).forEach((set) => {
    const ownedEditions = EDITIONS.filter(
      edition => set.editions[edition]?.length > 0
    )
    const missingCount = 6 - ownedEditions.length

    set.ownedEditions = ownedEditions
    set.missingCount = missingCount

    if (missingCount <= 2) {
      allSets.push(set)
    }
  })

  allSets.sort((a, b) => {
    if (a.missingCount !== b.missingCount) {
      return a.missingCount - b.missingCount
    }
    return a.setNumber - b.setNumber
  })

  return allSets
})

const fullSets = computed(() => {
  return setCompletionData.value.filter(set => set.missingCount === 0)
})

const almostCompleteSets = computed(() => {
  return setCompletionData.value.filter(set => set.missingCount > 0)
})

const displayedSets = computed(() => {
  if (showAlmostComplete.value) {
    return setCompletionData.value
  }
  // If no full sets, show almost complete by default
  if (fullSets.value.length === 0) {
    return almostCompleteSets.value
  }
  return fullSets.value
})

const isSetOwned = (setNumber) => ownedSets.value.includes(pad(setNumber))
const isSetRevealed = (setNumber) => revealedSets.value.includes(pad(setNumber))
const isPerfectSet = (setNumber) => perfectSets.value.includes(pad(setNumber))

const hasEdition = (setData, edition) => {
  return setData.editions[edition]?.length > 0
}

const getEditionCount = (setData, edition) => {
  return setData.editions[edition]?.length || 0
}

const getSetName = (setNumber) => {
  return sets.value?.find(s => s.id === setNumber)?.submission?.name || ''
}
</script>

<style scoped>
.set-grid {
  display: grid;
  grid-template-columns: repeat(25, 1fr);
  gap: var(--spacer-xs);
}

.set {
  aspect-ratio: 1/1;
  border: var(--border);
  border-radius: var(--border-radius-sm);
  border-color: var(--gray-z-4);
}

.set.is-owned {
  background-color: var(--green);
}

.set.is-perfect {
  background-color: var(--white);
}

.set.not-revealed {
  background-color: var(--gray-z-4);
}

.stats {
  margin-top: var(--spacer-sm);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacer-lg);
  font-family: var(--ui-font-family);
  font-weight: var(--ui-font-weight);
  font-size: var(--ui-font-size);
  color: var(--gray-z-6);
  text-transform: uppercase;
}

@media (--md) {
  .set-grid {
    grid-template-columns: repeat(40, 1fr);
  }
}

.set-completion-table {
  .section-label {
    @mixin ui-font;
    font-size: var(--ui-font-size);
    color: var(--gray-z-6);
    margin: 0 0 var(--spacer-sm) 0;
  }

  thead td {
    color: var(--white);
    padding-bottom: var(--size-2);
  }
}

.set-column {
  min-width: 80px;
  padding-right: var(--spacer);

  @media (--md) {
    min-width: 150px;
  }
}

.set-link {
  display: flex;
  flex-direction: column;
  gap: var(--size-1);
  text-decoration: none;
  color: var(--color);
  transition: color var(--speed);

  &:hover {
    color: var(--gray-z-6);
  }

  .set-number {
    font-weight: 600;
  }

  .set-name {
    font-size: var(--font-sm);
    color: var(--muted);
    display: none;

    @media (--md) {
      display: block;
    }
  }
}

.edition-column {
  width: 60px;
  text-align: right;
  padding: var(--size-1) 0;
  color: var(--muted);

  &.is-missing {
    color: var(--red);
  }
}

.toggle-button {
  width: 100%;

  @media (--md) {
    align-self: center;
  }
}
</style>
