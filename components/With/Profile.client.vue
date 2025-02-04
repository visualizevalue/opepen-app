<template>

  <slot
    v-bind="$attrs"
    :account="account"
  />

</template>

<script setup>
const props = defineProps({
  id: String, // Could be an address, or an ENS key or an opepen API id
})

const id = computed(() => props.id)

const account = await useProfile(id)
</script>
