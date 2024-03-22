<template>
  <aside v-if="isAdmin">
    <p class="label nowrap">Admin Tools</p>
    <slot :set-action="setAction" />
  </aside>
</template>

<script setup>
import { isAdmin } from '~/helpers/siwe'

const config = useRuntimeConfig()

const setAction = async (submission, action) => {
  if (!confirm(`Really execute ${action}?`)) return

  const updated = await $fetch(`${config.public.opepenApi}/set-submissions/${submission.uuid}/${action}`, {
    method: 'POST',
    credentials: 'include',
  })

  return updated
}
</script>

<style lang="postcss" scoped>
  aside {
    position: fixed;
    z-index: 1000;
    left: var(--size-7);
    bottom: 3rem;

    display: flex;
    gap: var(--size-4);
    align-items: center;
    justify-content: center;

    transform: rotate(-90deg);
    transform-origin: center left;

    p.label {
      margin: 0 !important;
      /* height: 1em; */
    }
  }
</style>
