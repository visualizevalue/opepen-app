<template>
  <!--
    Renders as a row of the set's attribute list so the creator finds the editor
    alongside the other set facts. IsMeOrAdmin and WithAccount are both
    renderless, so this <li> lands directly in the DescriptionList's <ul>.
  -->
  <IsMeOrAdmin :address="submission.creator">
    <li v-if="isAdmin || !submission.set_id" class="set-edit-link">
      <Icon type="settings" stroke-width="2.25" />
      <NuxtLink :to="`/create/${submission.uuid}`">
        <span>Set Editor</span>
      </NuxtLink>
    </li>
  </IsMeOrAdmin>
</template>

<script setup lang="ts">
const { submission } = defineProps<{ submission: SetSubmission }>()
</script>

<style scoped>
.set-edit-link :deep(a) {
  color: var(--color);
}
</style>
