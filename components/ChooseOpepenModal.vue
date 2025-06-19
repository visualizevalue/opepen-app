<template>
  <Modal :open="open" @close="$emit('close')" scroll>
    <header class="select-opepen-header">
      <h1>Choose Opepen</h1>
    </header>
    <section>
      <PaginatedContent
        :url="uri"
        :query="query"
        v-slot="{ items, meta }"
        class="select-opepen"
        show-empty
      >
        <div
          v-if="filterOwner && address && items && items.length === 0 && meta?.total === 0"
          class="empty-state"
        >
          <p>You don't own any Opepen yet.</p>
          <Button to="https://opensea.io/collection/opepen-edition" target="_blank">
            <Icon type="opensea" />
            <span>Buy on OpenSea</span>
          </Button>
        </div>
        <OpepenCard
          v-for="token in items"
          :key="token.token_id"
          class="opepen-card"
          :token="token"
          :selectable="true"
          @click="() => select(token)"
        />
      </PaginatedContent>
    </section>
  </Modal>
</template>

<script setup>
import { useAccount } from '@wagmi/vue'

const props = defineProps({
  open: Boolean,
  owned: Boolean,
})
const emit = defineEmits(['close', 'select'])

const { address } = useAccount()
const config = useRuntimeConfig()
const filterOwner = ref(!!props.owned)
const uri = `${config.public.opepenApi}/opepen`
const query = computed(() => {
  let q = `sort=set_id,data.edition`
  if (filterOwner.value) q += `&filter[owner]=${address.value.toLowerCase()}`

  return q
})

const select = (opepen) => {
  emit('select', opepen)
}
</script>

<style scoped>
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--size-4);
  padding: var(--size-4);

  .opepen-card {
    cursor: pointer;
    padding-bottom: 100%;

    &:hover .content {
      background-color: var(--gray-z-1);
    }
  }

  :deep(.loader) {
    grid-column: span 4;
  }

  .empty-state {
    grid-column: span 3;
    text-align: center;
    padding: var(--size-8) var(--size-4);
    color: var(--gray-z-6);

    p {
      margin-bottom: var(--size-4);
      font-size: var(--font-base);
    }
  }
}
</style>
