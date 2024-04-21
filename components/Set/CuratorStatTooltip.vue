<template>
  <MouseTooltip v-if="curator">
    <Account v-if="address" :address="address"/>
    <p>{{ demand }} Opt-Ins</p>
  </MouseTooltip>
</template>

<script setup>
const props = defineProps({
  curator: Array,
})

const address = computed(() => props.curator && props.curator[0])
const demand = computed(() => props.curator && props.curator[1]?.demand)
</script>

<style lang="postcss" scoped>
* {
  font-size: var(--font-sm);
}
</style>
