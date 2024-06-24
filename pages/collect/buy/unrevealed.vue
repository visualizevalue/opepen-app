<template>
  <div class="has-secondary">
    <OpepenGallery
      query="filter%5Bprice%5D=!null&filter%5Brevealed_at%5D=null&sort=price"
    />
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: 'Buy Unrevealed Opepen',
})
</script>

<style lang="postcss" scoped>
</style>
