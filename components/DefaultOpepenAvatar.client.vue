<template>
  <img :src="img" alt="Default Opepen Avatar" />
</template>

<script setup>
import { createIcon } from 'opepen-standard'

const props = defineProps({
  size: {
    type: Number,
    default: 68,
  },
  address: String,
})
const size = computed(() => props.size)
const address = computed(() => props.address)

const canvas = ref(null)
const img = computed(() => (props.address ? canvas.value?.toDataURL() : `/solid.svg`))

const setCanvas = () => {
  canvas.value = createIcon({
    seed: address.value?.toLowerCase(),
    size: size.value,
  })
}

onMounted(() => setCanvas())
watch(address, () => setCanvas())
</script>

<style scoped>
img {
  border-radius: 50%;
  border: var(--border);
  width: 100%;
}
</style>
