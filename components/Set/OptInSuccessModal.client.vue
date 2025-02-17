<template>
  <Modal v-model:open="open">
    <h1>Successful Opt-In</h1>
    <template v-if="!selected.length">
      <p>You removed all your Opepen submissions from "{{ submission.name }}"!</p>
    </template>
    <template v-else>
      <p>
        You submitted {{ selected.length }} Opepen to be included in "{{ submission.name }}"!
        If your Opepen {{ selected.length > 1 ? 'are' : 'is' }} selected as part of this set,
        your tokens will update after the opt-in window closes.
      </p>
    </template>

    <Actions>
      <Button @click="() => open = false">Ok</Button>
    </Actions>
  </Modal>
</template>

<script setup>
defineProps({
  selected: Array,
  submission: Object,
})
const open = defineModel({ required: true })
</script>

<style scoped>
p {
  color: var(--muted);
  font-size: var(--font-sm);
}
</style>
