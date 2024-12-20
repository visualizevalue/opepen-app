<template>
  <Modal
    :open="!!image" @close="$emit('close')"
    modal-classes="extra-wide image-detail-modal"
  >
    <ImageDetail :image="image" />
  </Modal>
</template>

<script setup>
const props = defineProps({
  image: Object,
})

const emit = defineEmits(['close'])
</script>

<style lang="postcss">
.modal.image-detail-modal {
  > section {
    padding: 0;
  }
}
</style>
