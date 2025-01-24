<template>

  <section class="items">
    <SetPreviewImage :data="data" :edition="1" version="" />
    <SetPreviewImage :data="data" :edition="4" version="" />
    <SetPreviewImage :data="data" :edition="5" version="" />
    <SetPreviewImage :data="data" :edition="10" version="" />
    <SetPreviewImage :data="data" :edition="20" version="" />
    <SetPreviewImage :data="data" :edition="40" version="" />
  </section>

</template>

<script setup>
const { data } = defineProps({ data: Object })
</script>

<style scoped>
.items {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(0, 1fr));
  gap: var(--size-2);
  grid-auto-flow: dense;

  > :first-child {
    grid-column: span 2;
    grid-row: span 2;
  }

  @media (--md) {
    gap: var(--size-5);
  }
}
</style>
