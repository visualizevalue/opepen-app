<template>
<Modal
  :open="open"
  @close="$emit('close')"
  scroll
>
  <header class="select-opepen-header">
    <h1>Choose Opepen</h1>
    <div v-if="filter" class="filter">
      <!-- <label>
        <div class="label">Set</div>
        <input type="number" v-model="filterSet" :min="1" :max="currentSet.id" :placeholder="`1 - ${currentSet.id}`">
      </label> -->
      <select v-model="statusFilter" class="input">
        <option value="all">All</option>
        <option value="revealed" default>Revealed</option>
        <option value="unrevealed">Unrevealed</option>
      </select>
      <select v-model="editionFilter" class="input">
        <option value="all" default>All Edition Sizes</option>
        <option value="40">1/40</option>
        <option value="20">1/20</option>
        <option value="10">1/10</option>
        <option value="5">1/5</option>
        <option value="4">1/4</option>
        <option value="1">1/1</option>
      </select>
      <!-- <label>
        <input type="checkbox" v-model="filterRevealed">
        <span>Revealed</span>
      </label> -->
      <!-- <label class="checkbox" v-if="isConnected">
        <input type="checkbox" v-model="filterOwner">
        <span>Owned</span>
      </label> -->
    </div>
  </header>
  <section>
    <PaginatedContent
      :url="uri"
      :query="query"
      v-slot="{ items }"
      :show-empty="true"
      class="select-opepen"
    >
      <div v-if="! items.length" class="empty">
        <p>No Opepen found...</p>
      </div>
      <div
        v-for="token in items"
        :key="token.token_id"
        @click="() => select(token)"
      >
        <OpepenImage :token="token" />
      </div>
    </PaginatedContent>
  </section>
</Modal>
</template>

<script setup>
import { useAccount } from '~/helpers/use-wagmi'
import { useSets } from '~/helpers/sets'

const props = defineProps({
  open: Boolean,
  owned: Boolean,
  filter: {
    type: Boolean,
    default: true,
  }
})
const emit = defineEmits(['close', 'select'])

const { address } = useAccount()
const config = useRuntimeConfig()
const filterOwner = ref(!! props.owned)
const filterSet = ref(null)
const statusFilter = ref('revealed')
const editionFilter = ref('40')
const filterRevealed = ref(null)
const uri = `${config.public.opepenApi}/opepen`
const query = computed(() => {
  let q = `sort=-data.edition,set_id`
  if (filterOwner.value) q += `&filter[owner]=${address.value.toLowerCase()}`
  if (statusFilter.value !== 'all') q += `&filter[set_id]=${statusFilter.value === 'revealed' ? `!null` : `null`}`
  if (editionFilter.value !== 'all') q += `&filter[data.edition]=${editionFilter.value}`

  return q
})
const { currentSet } = useSets()

const select = (opepen) => {
  emit('select', opepen)
}
</script>

<style lang="postcss" scoped>
.select-opepen-header {
  padding: var(--size-4);
  border-bottom: 1px solid var(--gray-z-2);
  display: grid;
  gap: var(--size-3);

  .filter {
    display: grid;
    gap: var(--size-4);
    grid-template-columns: 1fr 1fr;

    label:not(.checkbox) {
      display: flex;
      align-items: center;
      gap: var(--size-2);
    }
  }
}

:deep(.select-opepen) {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;

  .empty {
    grid-column: 1 / -1;
    padding: var(--size-4) var(--size-5);
    color: var(--gray-z-5);
  }

  > * {
    border-bottom: 1px solid var(--gray-z-2);
    border-right: 1px solid var(--gray-z-2);
    overflow: hidden;

    .inner {
      border-radius: 0 !important;
      border: 0 !important;
    }
  }

  :deep(.loader) {
    grid-column: span 4;
  }
}
</style>
