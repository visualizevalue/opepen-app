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
    --gap: var(--spacer);

    @media (--md) {
      --min-column-width: 12rem;
      --gap: var(--spacer-lg);
    }

    &.more-space {
      --min-column-width: 12rem;

      @media (--md) {
        --min-column-width: 16rem;
      }
    }

    display: grid;
    gap: var(--gap);
    grid-template-columns: repeat(auto-fill, minmax(var(--min-column-width), 1fr));

    article {
      width: 100%;
    }
  }
</style>

