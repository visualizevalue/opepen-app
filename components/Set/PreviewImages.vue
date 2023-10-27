<template>

  <section class="items">
    <SetPreviewImage :set="set" :edition="1" />
    <SetPreviewImage :set="set" :edition="4" />
    <SetPreviewImage :set="set" :edition="5" />
    <SetPreviewImage :set="set" :edition="10" />
    <SetPreviewImage :set="set" :edition="20" />
    <SetPreviewImage :set="set" :edition="40" />
  </section>

</template>

<script setup>
const { set } = defineProps({ set: Object })
</script>

<style lang="postcss" scoped>
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
