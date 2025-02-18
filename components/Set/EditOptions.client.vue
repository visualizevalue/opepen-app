<template>
  <Dropdown
    :items="items"
    id="submission-edit-options"
    align="right"
  >
    <template #trigger>
      <Icon type="more-vertical" />
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
const { submission } = defineProps<{ submission: SetSubmission }>()

const { execute: executeDelete } = await useApi(`/set-submissions/${submission.uuid}`, {
  immediate: false,
  credentials: 'include',
  method: 'DELETE',
})

const destroy = async () => {
  if (! confirm(`Do you really want to delete this submission?`)) return

  await executeDelete()

  navigateTo('/create')
}

const items = [
  {
    onClick: () => destroy(),
    text: 'Delete',
    icon: 'trash',
  },
  {
    onClick: () => {
      navigateTo(`/submissions/${submission.uuid}`)
    },
    text: 'View',
    icon: 'eye',
  },
]
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

