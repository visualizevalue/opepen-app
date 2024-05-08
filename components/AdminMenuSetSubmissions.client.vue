<template>
  <AdminMenuFloating v-slot="{ setAction }">
    <slot name="before"></slot>
    <Button v-if="! submission.set_id && submission.published_at" @click="() => setAction(submission, 'unpublish').then(() => navigateTo(`/create/sets/${submission.uuid}`))">
      <Icon type="globe" stroke="var(--green)" />
      <span>Published</span>
    </Button>
    <Button
      v-if="! submission.approved_at"
      @click="() => setAction(submission, 'approve', { notify: false }).then(() => $emit('refresh'))"
    >
      <Icon type="bell-off" />
      <span>Silent Approve</span>
    </Button>
    <Button @click="() => setAction(submission, submission.approved_at ? 'unapprove' : 'approve').then(() => $emit('refresh'))">
      <Icon type="check" :stroke="submission.approved_at ? 'var(--green)' : 'currentcolor'" />
      <span v-if="submission.approved_at">Approved</span>
      <span v-else>Approve</span>
    </Button>
    <Button @click="() => setAction(submission, 'star').then(() => $emit('refresh'))">
      <Icon type="star" :fill="submission.starred_at ? 'var(--yellow)' : 'transparent'" :stroke="submission.starred_at ? 'var(--yellow)' : 'currentcolor'" />
      <span v-if="submission.starred_at">Starred</span>
      <span v-else>Star</span>
    </Button>
  </AdminMenuFloating>
</template>

<script setup>
defineProps({
  submission: Object,
})

defineEmits(['refresh'])
</script>

<style lang="postcss" scoped>
</style>
