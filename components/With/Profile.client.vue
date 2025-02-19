<template>

  <WithAccount v-slot="{ isConnected }">
    <slot
      v-bind="$attrs"
      :account="account"
      :is-connected="isConnected"
    />
  </WithAccount>

</template>

<script setup>
const { account } = await useProfile()
</script>

