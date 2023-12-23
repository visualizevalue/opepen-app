<template>
<Modal
  :open="open"
  @close="$emit('close')"
  scroll
>
  <header class="select-opepen-header">
    <h1>Choose Opepen</h1>
    <div class="filter">
      <label>
        <div class="label">Set</div>
        <input type="number" v-model="filterSet" :min="1" :max="currentSet.id" :placeholder="`1 - ${currentSet.id}`">
      </label>
      <label class="checkbox" v-if="isConnected">
        <input type="checkbox" v-model="filterOwner">
        <span>Owned</span>
      </label>
    </div>
  </header>
  <section>
    <PaginatedContent
      :url="uri"
      :query="query"
      v-slot="{ items }"
      class="select-opepen"
    >
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

defineProps({
  open: Boolean,
})
const emit = defineEmits(['close', 'select'])

const { address, isConnected } = useAccount()
const config = useRuntimeConfig()
const filterOwner = ref(false)
const filterSet = ref(null)
const uri = `${config.public.opepenApi}/opepen`
const query = computed(() => {
  let q = `sort=set_id,data.edition&filter[revealed_at]=!null`
  if (filterOwner.value) q += `&filter[owner]=${address.value.toLowerCase()}`
  if (filterSet.value) q += `&filter[set_id]=${filterSet.value}`

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

.select-opepen {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;

  > * {
    border-bottom: 1px solid var(--gray-z-2);
    border-right: 1px solid var(--gray-z-2);
    overflow: hidden;

    > :deep(article) {
      border-radius: 0;
      border: 0;
    }
  }

  :deep(.loader) {
    grid-column: span 4;
  }
}
</style>
