<template>
  <div>
    <SinglesGallery path="opepen/images/curated" />
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: 'Administrate set submissions',
})
</script>

<style lang="postcss" scoped>
</style>
