<template>
  <div>
    <SinglesGallery
      path="opepen/images/curated"
      @click="activate"
    >
      <template #item="{ item }">
        <ImageDetailSm @click="() => activate(item)" :image="item" />
      </template>
    </SinglesGallery>

    <ImageDetailModal :image="active" @close="deactivate" />
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

const active = ref(null)

const activate = item => {
  active.value = item
}
const deactivate = () => {
  active.value = null
}

useMetaData({
  title: 'Curated Opepen',
})
</script>
