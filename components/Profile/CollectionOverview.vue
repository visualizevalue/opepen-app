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
        <div>Perfect Sets: {{ perfectSets.length }}</div>
        <div>Total Sets: {{ ownedSets.length }} / {{ revealedSets.length }}</div>
      </div>
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

const revealedSets = computed(() => sets.value?.map(set => pad(set.id)) || [])

const collectionData = computed(() => {
  const tokens = [...opepen.value.data, ...delegatedOpepen.value]
  const setIds = new Set()
  const setMap = {}
  const perfectSets = []

  tokens.forEach(token => {
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
    if (setMap[setId] && EDITIONS.every(edition => setMap[setId].editions[edition]?.length)) {
      perfectSets.push(setId)
    }
  }

  return { ownedSets: ownedSetIds, perfectSets }
})

const ownedSets = computed(() => collectionData.value.ownedSets)
const perfectSets = computed(() => collectionData.value.perfectSets)

const isSetOwned = setNumber => ownedSets.value.includes(pad(setNumber))
const isSetRevealed = setNumber => revealedSets.value.includes(pad(setNumber))
const isPerfectSet = setNumber => perfectSets.value.includes(pad(setNumber))
</script>

<style scoped>
.set-grid {
  display: grid;
  grid-template-columns: repeat(40, 1fr);
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
</style>
