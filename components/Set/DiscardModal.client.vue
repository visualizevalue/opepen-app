<template>
  <Modal v-model:open="open">
    <h1>Opt-Out from Submission?</h1>
    <p>Are you sure you want to discard this set?</p>

    <Actions>
      <Button @click="open = false">Cancel</Button>
      <Button @click="discard" :disabled="loading">
        <span v-if="loading">Opting out...</span>
        <span v-else>Opt Out</span>
      </Button>
    </Actions>
  </Modal>
</template>

<script setup lang="ts">
interface Props {
  submission: SetSubmission,
}
const { submission } = defineProps<Props>()
const emit = defineEmits(['update'])
const open = defineModel('open', { required: true })

const { execute: discard, status } = await useApi(`/set-submissions/${submission.uuid}/discard`, {
  immediate: false,
  method: 'POST',
  credentials: 'include',
  onResponse: () => {
    open.value = false
    emit('update')
  },
})
const loading = computed(() => status.value === 'pending')
</script>

<style scoped>
p {
  color: var(--muted);
  font-size: var(--font-sm);
}
</style>

