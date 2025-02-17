<template>
  <section v-if="set.description" class="about">
    <h1>Description</h1>
    <div class="description" v-html="set.description"></div>
  </section>
</template>

<script setup>
const { set } = defineProps({ set: Object })
</script>

<style scoped>
.about {
  font-size: var(--font-sm);
}

h1 {
  color: var(--gray-z-6);
}

.description {
  white-space: pre-wrap;
}
</style>
