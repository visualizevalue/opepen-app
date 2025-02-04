<template>
  <AdminMenu>
    <template #before>
      <p class="label nowrap">Admin Tools</p>
    </template>

    <template #default="{ setAction }">
      <slot :set-action="setAction" />
    </template>
  </AdminMenu>
</template>

<script setup>
</script>

<style scoped>
  aside {
    position: fixed;
    z-index: 1000;
    left: var(--size-7);
    bottom: calc(3rem + env(safe-area-inset-bottom));
    justify-content: center;

    &:not(.horizontal) {
      transform: rotate(-90deg);
      transform-origin: center left;
    }

    p.label {
      margin: 0 !important;
      /* height: 1em; */
    }
  }
</style>
