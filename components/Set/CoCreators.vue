<template>
  <Modal v-model:open="open" class="co-creator-modal extra-wide" compat>
    <h1>All {{ submission.name }} Co-Creators</h1>
    <ProfileCardGrid :accounts="coCreators" minimal />
  </Modal>
</template>

<script setup lang="ts">
const { submission, coCreators } = defineProps<{
  submission: SetSubmission
  coCreators: any[]
}>()

const open = defineModel('open', { required: true })
</script>

<style scoped>
.co-creator-modal {
  display: grid;
  gap: var(--spacer-sm);

  > h1 {
    margin-bottom: var(--spacer-lg);
  }
}

.co-creator-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-1);

  > .co-creator {
    white-space: nowrap;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    transition: all var(--speed);
    @mixin ui-font;
    color: var(--gray-z-6);

    &:--highlight {
      color: var(--color);
    }
  }
}
</style>
