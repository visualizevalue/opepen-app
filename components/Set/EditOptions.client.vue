<template>
  <Dropdown
    v-if="!submission.set_id"
    :items="items"
    id="submission-edit-options"
    align="right"
  >
    <template #trigger>
      <Icon type="more-vertical" />
    </template>
  </Dropdown>

  <div v-if="showConfirmation" class="confirmation">
    <Icon type="check" />
    <span>Link copied to clipboard</span>
  </div>

  <Confirm
    key="publish"
    v-model:open="confirmPublish"
    title="Publish Submission?"
    text="Do you really want to publish this submission?"
    action="Publish"
    :callback="
      async () => {
        await executePublish()
        await refresh()
        if (submission.published_at) {
          await navigateTo(`/submissions/${submission.uuid}`)
        }
      }
    "
  />

  <Confirm
    key="unpublish"
    v-model:open="confirmUnpublish"
    title="Unpublish Submission?"
    text="Do you really want to unpublish this submission? This will clear all opt ins and remove it from the public set submissions."
    action="Unpublish"
    :callback="
      async () => {
        await executeUnpublish()
        await refresh()
      }
    "
  />

  <Confirm
    key="shadow"
    v-model:open="confirmShadow"
    title="Shadow Submission?"
    text="Do you really want to shadow (hide) this submission?"
    action="Shadow"
    :callback="
      async () => {
        await executeShadow()
        await refresh()
      }
    "
  />

  <Confirm
    key="delete"
    v-model:open="confirmDelete"
    title="Delete Submission?"
    text="Do you really want to delete this submission?"
    action="Delete"
    :callback="confirmDeletion"
  />
</template>

<script setup lang="ts">
const { submission, dataComplete, refresh } = defineProps<{
  submission: SetSubmission
  dataComplete: boolean
  refresh(): Promise<void>
}>()
const emit = defineEmits(['save'])

const confirmDelete = ref(false)
const showConfirmation = ref(false)
const { execute: executeDelete } = await useApiDelete(`/set-submissions/${submission.uuid}`)
const confirmDeletion = async () => {
  if (prompt(`Are you absolutely sure? Type "DELETE" to confirm`) !== 'DELETE') return

  await executeDelete()
  await navigateTo('/create')
}

const confirmShadow = ref(false)
const { execute: executeShadow } = await useApiPost(
  `/set-submissions/${submission.uuid}/shadow`,
)

const confirmPublish = ref(false)
const { execute: executePublish } = await useApiPost(
  `/set-submissions/${submission.uuid}/publish`,
  {
    onResponseError() {
      alert(`Publishing failed. Required data is missing.`)
    },
  },
)

const confirmUnpublish = ref(false)
const { execute: executeUnpublish } = await useApiPost(
  `/set-submissions/${submission.uuid}/unpublish`,
)

const items = computed(() => {
  if (submission.set_id) {
    return []
  }

  return [
    submission.published_at
      ? {
          onClick: () => (confirmUnpublish.value = true),
          text: 'Unpublish',
          icon: 'eye-off',
        }
      : {
          onClick: () => emit('save'),
          text: 'Save',
          icon: 'save',
        },
    dataComplete && !submission.published_at
      ? {
          onClick: () => (confirmPublish.value = true),
          text: 'Publish',
          icon: 'globe',
        }
      : null,
    {
      onClick: () => {
        navigateTo(`/submissions/${submission.uuid}`)
      },
      text: 'View',
      icon: 'eye',
    },
    {
      onClick: () => {
        const url = `${window.location.origin}/submissions/${submission.uuid}`
        navigator.clipboard.writeText(url)
        showConfirmation.value = true
        setTimeout(() => {
          showConfirmation.value = false
        }, 3000)
      },
      text: 'Share Preview',
      icon: 'clipboard',
    },
    isAdmin.value
      ? {
          onClick: () => (confirmShadow.value = true),
          text: submission.shadowed_at ? 'Unshadow' : 'Shadow',
          icon: 'x-octagon',
        }
      : null,
    {
      onClick: () => (confirmDelete.value = true),
      text: 'Delete',
      icon: 'trash',
    },
  ].filter((i) => !!i)
})

const showAlert = (msg: string) => alert(msg)
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

.confirmation {
  position: fixed;
  bottom: var(--spacer);
  right: var(--spacer);
  background-color: var(--gray-z-2);
  padding: var(--spacer-sm);
  border-radius: var(--border-radius);
  z-index: 1000;
  animation: slideIn 0.3s ease-out forwards;
  display: flex;
  align-items: center;
  font-size: var(--ui-font-size);
  font-family: var(--ui-font-family);
  font-weight: var(--ui-font-weight);
  letter-spacing: var(--ui-letter-spacing);
  text-transform: var(--ui-text-transform);
  border: var(--border);

  > .icon {
    width: var(--size-4);
    height: var(--size-4);
    margin-right: var(--spacer-sm);
  }
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
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
