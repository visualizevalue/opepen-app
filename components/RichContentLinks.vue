<template>
  <div v-if="links" class="links">
    <RichContentLink v-for="link of shownLinks" :link="link" />
  </div>
</template>

<script setup>
const { links } = defineProps({
  links: Array,
})

const shownLinks = computed(() => links.filter((l) => validateURI(l.url)))
</script>

<style scoped>
.links {
  position: relative;
  display: grid;
  gap: var(--spacer);

  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
}
</style>
