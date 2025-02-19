<template>
  <Dropdown
    v-if="! submission.set_id"
    :items="items"
    id="submission-edit-options"
    align="right"
  >
    <template #trigger>
      <Icon type="more-vertical" />
    </template>
  </Dropdown>

  <Confirm
    v-model:open="confirmPublish"
    title="Publish Submission"
    text="Do you really want to publish this submission?"
    action="Publish"
    :callback="async () => {
      await executePublish()
      await navigateTo(`/submissions/${submission.uuid}`)
    }"
  />

  <Confirm
    v-model:open="confirmUnpublish"
    title="Unpublish Submission"
    text="Do you really want to unpublish this submission? This will clear all opt ins and remove it from the public set submissions."
    action="Unpublish"
    :callback="executeUnpublish"
  />

  <Confirm
    v-model:open="confirmDelete"
    title="Delete Submission"
    text="Do you really want to delete this submission?"
    action="Delete"
    :callback="async () => {
      await executeDelete()
      await navigateTo('/create')
    }"
  />
</template>

<script setup lang="ts">
const { submission } = defineProps<{ submission: SetSubmission }>()
const emit = defineEmits(['save'])

const confirmDelete = ref(false)
const { execute: executeDelete } = await useApiDelete(`/set-submissions/${submission.uuid}`)

const confirmPublish = ref(false)
const { execute: executePublish } = await useApiPost(`/set-submissions/${submission.uuid}/publish`)

const confirmUnpublish = ref(false)
const { execute: executeUnpublish } = await useApiPost(`/set-submissions/${submission.uuid}/unpublish`)

const items = computed(() => {
  if (submission.set_id) {
    return []
  }

  return [
    ...(
      submission.published_at
        ? [
          {
            onClick: () => confirmUnpublish.value = true,
            text: 'Unpublish',
            icon: 'eye-off',
          }
        ]
        : [
          {
            onClick: () => emit('save'),
            text: 'Save',
            icon: 'save',
          },
          {
            onClick: () => confirmPublish.value = true,
            text: 'Publish',
            icon: 'globe',
          },
        ]
    ),
    {
      onClick: () => {
        navigateTo(`/submissions/${submission.uuid}`)
      },
      text: 'View',
      icon: 'eye',
    },
    {
      onClick: () => confirmDelete.value = true,
      text: 'Delete',
      icon: 'trash',
    },
  ]
})
</script>

<style scoped>
#submission-edit-options {
  transition: color var(--speed);
  z-index: 1;

  .icon {
    width: var(--size-4);
    height: var(--size-4);
    color: var(--muted);
  }

}

:global(#submission-edit-options .trigger) {
  color: var(--muted);
  padding: 0;
  display: flex;
  align-items: center;

  &:--highlight {
    .icon {
      color: var(--color);
    }
  }
}
</style>

