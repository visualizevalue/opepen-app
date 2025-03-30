<template>
  <AdminMenuFloating v-if="submission" v-slot="{ setAction }">
    <slot name="before"></slot>
    <Button
      v-if="!submission.set_id && submission.published_at"
      @click="() => setAction(submission, 'unpublish').then(() => $emit('refresh'))"
    >
      <Icon type="globe" stroke="var(--green)" />
      <span>Published</span>
    </Button>
    <Button
      @click="
        () =>
          setAction(submission, submission.approved_at ? 'unapprove' : 'approve').then(() =>
            $emit('refresh'),
          )
      "
    >
      <Icon type="check" :stroke="submission.approved_at ? 'var(--green)' : 'currentcolor'" />
      <span v-if="submission.approved_at">Approved</span>
      <span v-else>Approve</span>
    </Button>
    <Button @click="() => setAction(submission, 'star').then(() => $emit('refresh'))">
      <Icon
        type="star"
        :fill="submission.starred_at ? 'var(--yellow)' : 'transparent'"
        :stroke="submission.starred_at ? 'var(--yellow)' : 'currentcolor'"
      />
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

<style scoped></style>
