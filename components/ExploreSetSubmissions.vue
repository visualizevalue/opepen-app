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
        <slot :items="items">
          <SetPreview
            v-for="submission in items"
            :key="submission.id"
            :data="submission"
            minimal
          />
        </slot>
      </div>
    </template>

    <template #after>
      <slot name="after" />
    </template>
  </PaginatedContent>
</template>

<script setup>
const { limit, autoLoad, status, sort } = defineProps({
  limit: {
    type: Number,
    default: 24,
  },
  sort: {
    type: String,
    default: '-createdAt',
  },
  autoLoad: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: 'Submissions'
  },
  status: String,
})

const config = useRuntimeConfig()

const submissionsUrl = `${config.public.opepenApi}/set-submissions`
const submissionsQuery = new URLSearchParams({
  status,
  limit,
  sort,
}).toString()
</script>

<style lang="postcss" scoped>
section {
  position: relative;

  .grid {
    display: grid;
    gap: var(--size-5);
    grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));

    article {
      width: 100%;
    }
  }

  &.wide .grid {
    grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
  }
}
</style>
