<template>
  <img :src="img" alt="Default Opepen Avatar" />
</template>

<script setup>
import { useAccount } from '~/helpers/use-wagmi'
import { createIcon } from 'opepen-standard'

const { address } = useAccount()

const canvas = ref(null)
const img = computed(() => canvas.value.toDataURL())

const setCanvas = () => {
  canvas.value = createIcon({
    seed: address.value || Math.random().toString(),
    size: 32,
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
