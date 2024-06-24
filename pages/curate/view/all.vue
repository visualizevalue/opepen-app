<template>
  <div>
    <CuratedGallery path="opepen/images/curated" />
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: 'Curated Opepen',
})
</script>
