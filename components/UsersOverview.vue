<template>
  <section class="users">
    <nav>
      <StyledLink to="/artists">Artists</StyledLink>
      <StyledLink to="/curators">Curators</StyledLink>
    </nav>

    <PaginatedContent
      :url="url"
      :query="query"
      :refresh-key="path"
      class="grid"
    >
      <template v-slot:default="{ items }">
        <div
          v-for="user in items"
          :key="user.id"
        >
          <AccountPreview :account="user" />
        </div>
      </template>
    </PaginatedContent>
  </section>
</template>

<script setup>
const {
  path,
  title,
  defaultSort,
} = defineProps({
  path: String,
  title: String,
  defaultSort: String,
})

const config = useRuntimeConfig()
const url = `${config.public.opepenApi}/accounts/${path}`
const query = computed(() => {
  const q = new URLSearchParams({
    limit: 24,
    sort: defaultSort || `-profileCompletion,id`,
  })

  return q.toString()
})
</script>

<style lang="postcss" scoped>
.users {
  max-width: var(--content-width);
  margin: 0 auto;
}

nav {
  font-size: var(--font-lg);
  display: flex;
  gap: var(--size-5);
  padding: 0 0 var(--size-7);
}

:deep(.grid) {
  display: grid;
  gap: var(--size-5);

  article {
    width: 100%;
  }

  @media (--md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (--lg) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .loader {
    grid-column: 1 / -1;
  }
}
</style>
