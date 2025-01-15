<template>
  <aside v-if="isAdmin">
    <slot name=before />
    <slot :set-action="setAction" />
  </aside>
</template>

<script setup>
import { isAdmin } from '~/helpers/siwe'

const config = useRuntimeConfig()

const setAction = async (submission, action, data = {}) => {
  if (!confirm(`Really execute ${action}?`)) return

  const updated = await $fetch(`${config.public.opepenApi}/set-submissions/${submission.uuid}/${action}`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data)
  })

  return updated
}
</script>

<style scoped>
  aside {
    display: flex;
    gap: var(--size-4);
    align-items: center;
  }
</style>
