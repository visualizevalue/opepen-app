<template>
  <Button @click="discard" :disabled="loading">
    <Icon type="x-circle" />
    <span v-if="loading">Opting out...</span>
    <span v-else>Not for me</span>
  </Button>
</template>

<script setup lang="ts">
interface Props {
  submission: SetSubmission
}
const { submission } = defineProps<Props>()
const emit = defineEmits(['update'])
const { refreshAccount } = await useProfile()

const loading = ref(false)
const { execute: discard, status } = await useApi(
  `/set-submissions/${submission.uuid}/discard`,
  {
    immediate: false,
    method: 'POST',
    credentials: 'include',
    onResponse: () => {
      refreshAccount()
      emit('update')
    },
  },
)
watchEffect(() => {
  if (status.value === 'pending') {
    loading.value = true
  }
})
</script>

<style scoped>
p {
  color: var(--muted);
  font-size: var(--font-sm);
}
</style>
