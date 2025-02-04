<template>

    <div class="grid">
      <SetPreview
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
    display: grid;
    gap: var(--size-5);

    article {
      width: 100%;
    }

    /* grid-template-columns: repeat(2, minmax(0, 1fr)); */
    grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));

    /* @media (--md) { */
    /*   grid-template-columns: repeat(2, minmax(0, 1fr)); */
    /* } */
    /**/
    /* @media (--lg) { */
    /*   grid-template-columns: repeat(4, minmax(0, 1fr)); */
    /* } */
    /**/
    /* @media (min-width: 88rem) { */
    /*   grid-template-columns: repeat(5, minmax(0, 1fr)); */
    /* } */
  }
</style>

