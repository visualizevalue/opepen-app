<template>

    <div class="grid">
      <SetCard
        v-for="submission in submissions"
        :data="submission"
        :key="submission.uuid"
        :minimal="minimal"
      />
    </div>

</template>

<script setup>
defineProps({
  submissions: Array,
  minimal: Boolean,
})
</script>

<style scoped>
  .grid {
    --min-column-width: 10rem;

    @media (--md) {
      --min-column-width: 12rem;
    }

    display: grid;
    gap: var(--size-5);
    grid-template-columns: repeat(auto-fill, minmax(var(--min-column-width), 1fr));

    article {
      width: 100%;
    }
  }
</style>

