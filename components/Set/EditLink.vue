<template>
  <IsMeOrAdmin :address="submission.creator">
    <Actions v-if="isAdmin || ! submission.set_id">
      <Button :to="`/create/${submission.uuid}`" class="small">
        <Icon type="settings" />
        <span>Set Editor</span>
      </Button>
    </Actions>
  </IsMeOrAdmin>
</template>

<script setup lang="ts">
const { submission } = defineProps<{ submission: SetSubmission }>()
</script>

<style scoped>
.actions {
  justify-content: flex-end;
}
</style>

