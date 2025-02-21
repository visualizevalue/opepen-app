<template>

    <div class="grid">
      <SetCard
        v-for="submission in submissions"
        :data="submission"
        :key="submission.uuid"
        :minimal="minimal"
        :show-demand="showDemand"
      />
    </div>

</template>

<script setup>
defineProps({
  submissions: Array,
  minimal: Boolean,
  showDemand: Boolean,
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

