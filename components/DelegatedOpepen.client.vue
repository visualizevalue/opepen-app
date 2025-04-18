<template>
  <section v-if="opepen?.length">
    <SectionTitle>
      Delegated Opepen
      <template v-if="opepen.length > 12">({{ opepen.length }})</template>
    </SectionTitle>

    <div class="opepen-grid">
      <OpepenCard
        v-for="token in opepen"
        :key="token.token_id"
        :token="token"
        :set="token.data?.edition || 40"
        :minimal="false"
      />
    </div>
  </section>
</template>

<script setup>
const props = defineProps({ address: String })

const address = computed(() => props.address)
const { addresses: delegatedAddresses } = await useDelegation(address)

const { opepen, fetchOpepen } = await useOpepen(delegatedAddresses.value)
watch(delegatedAddresses, () => fetchOpepen(delegatedAddresses.value))
</script>
