<template>
  <PageFrameSm>
    <Card class="static">
      <h2>Simple Test Page</h2>
      <p>If you can see this, the basic setup works.</p>

      <Button @click="showModal = true">Open Test Modal</Button>

      <Modal v-if="showModal" :open="showModal" @close="showModal = false">
        <h3>Test Modal</h3>
        <p>Modal component works!</p>
        <Button @click="showModal = false">Close</Button>
      </Modal>
    </Card>
  </PageFrameSm>
</template>

<script setup>
const showModal = ref(false)

useMetaData({
  title: 'Simple Test | Opepen',
})
</script>
