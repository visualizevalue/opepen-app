<template>
  <img :src="img" alt="Default Opepen Avatar" />
</template>

<script setup>
import { createIcon } from 'opepen-standard'

const { size, address } = defineProps({
  size: {
    type: Number,
    default: 32,
  },
  address: String,
})

const canvas = ref(null)
const img = computed(() => canvas.value.toDataURL())

const setCanvas = () => {
  canvas.value = createIcon({
    seed: address?.toLowerCase() || Math.random().toString(),
    size,
  })
}

onMounted(() => setCanvas())
watch(address, () => setCanvas())
</script>

<style lang="postcss" scoped>
  img {
    border-radius: 50%;
    border: var(--border);
  }
</style>
