<template>
  <MouseTooltip v-if="curator">
    <ApiAccount v-if="data" :account="data" hide-avatar />
    <span v-else>{{ shortAddress(address) }}</span>
    <p>{{ demand }} Opt-Ins</p>
  </MouseTooltip>
</template>

<script setup>
const props = defineProps({
  curator: Array,
})

const address = computed(() => props.curator && props.curator[0])
const demand = computed(() => props.curator && props.curator[1]?.demand)
const url = computed(() => `/accounts/${address.value}`)
const { data } = await useApi(url)
</script>

<style scoped>
* {
  @mixin ui-font;
}

p {
  font-size: var(--font-xs);
  color: var(--muted);
}
</style>

