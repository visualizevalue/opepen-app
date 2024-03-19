<template>
  <PaginatedContent
    :url="submissionsUrl"
    :query="submissionsQuery"
    :auto-load="autoLoad"
    tag="section"
  >
    <template #before>
      <SectionTitle>{{ title }}</SectionTitle>
    </template>

    <template #default="{ items }">
      <div class="grid">
        <SetPreview
          v-for="submission in items"
          :key="submission.id"
          :data="submission"
          minimal
        />
      </div>
    </template>

    <template #after>
      <slot name="after" />
    </template>
  </PaginatedContent>
</template>

<script setup>
const { limit, autoLoad } = defineProps({
  limit: {
    type: Number,
    default: 24,
  },
  autoLoad: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: 'Submissions'
  }
})

const config = useRuntimeConfig()

const submissionsUrl = `${config.public.opepenApi}/set-submissions`
const submissionsQuery = new URLSearchParams({
  status: 'unstarred',
  limit,
}).toString()
</script>

<style lang="postcss" scoped>
section {
  position: relative;

  .grid {
    display: grid;
    gap: var(--size-5);

    article {
      width: 100%;
    }

    @media (--md) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (--lg) {
      grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
    }
  }
}
</style>
