<template>
  <div>
    <OpepenGallery
      query="filter%5Bprice%5D=!null&filter%5Brevealed_at%5D=!null&sort=dailyRandom"
    />
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: 'Buy Revealed Opepen',
})
</script>

<style lang="postcss" scoped>
</style>
