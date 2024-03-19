<template>
  <div class="create">
    <Create />
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: 'Create Opepen',
})
</script>

<style lang="postcss" scoped>
  .create {
    display: flex;
    flex-direction: column;
  }
</style>
