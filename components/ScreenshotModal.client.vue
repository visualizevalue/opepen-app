<template>
<Modal :open="open" @close="open = false">
  <img :src="url">
</Modal>
</template>

<script setup>
import html2canvas from 'html2canvas'
import { image2Blob } from '~/helpers/download-image'

const open = ref(false)
const url = ref(null)

const renderElement = async (el) => {
  open.value = true
  const canvas = await html2canvas(el)
  const URLObj = window.URL || window.webkitURL
  url.value = URLObj.createObjectURL(await image2Blob(canvas, 'image/png'))
}

defineExpose({
  renderElement
})
</script>
