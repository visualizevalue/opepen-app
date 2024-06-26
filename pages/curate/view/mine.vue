<template>
  <div>
    <SinglesGallery path="opepen/images/curated/mine" />
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: 'My Opepen Curations',
})
</script>
