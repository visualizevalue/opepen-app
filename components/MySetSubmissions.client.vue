<template>
  <section>
    <IsAuthenticated>
      <PaginatedContent
        :url="url"
        :query="query"
      >
        <template #after-block="{ items }">
          <div v-if="! items?.length" class="empty">
            <p class="muted">No set submissions</p>
            <Button to="/create/new">
              <Icon type="plus" />
              <span>Create set</span>
            </Button>
          </div>
        </template>

        <template #default="{ items }">
          <article
            v-for="set in items"
            :key="set.uuid"
            class="item"
          >
            <div class="preview">
              <Image :image="set.edition1Image" version="sm" />
            </div>

            <div class="details">
              <h1>{{ set.name || 'Unnamed' }}</h1>
              <p>{{ set.description }}</p>
              <p>
                <span v-if="set.published_at">Published {{ formatDate(set.published_at) }}</span>
                <span v-else>Created {{ formatDate(set.created_at) }}</span>
              </p>

              <NuxtLink :to="`/create/${set.uuid}`"><span>Go to {{ set.name }}</span></NuxtLink>
            </div>
          </article>
        </template>
      </PaginatedContent>
    </IsAuthenticated>
  </section>
</template>

<script setup>
const props = defineProps({
  query: String,
})

const { session } = useSignIn()

const url = computed(() => `${useApiBase()}/accounts/${session.value?.address}/set-submissions`)
const query = computed(() => `sort=-created_at`)
</script>

<style scoped>
section {
  :deep(> div) {
    display: grid;
    gap: var(--spacer);
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
  }
}

article.item {
  width: 100%;
  height: var(--size-9);
  background: var(--gray-z-1);
  border: var(--border);
  border-radius: var(--border-radius);
  position: relative;
  display: grid;
  grid-template-columns: var(--size-9) 1fr;
  overflow: hidden;

  .preview {
    width: var(--size-9);
    height: var(--size-9);
    flex-shrink: 0;

    .image,
    :deep(.image .inner) {
      border-radius: 0 !important;
    }
  }

  .details {
    width: 100%;
    overflow: hidden;
    padding: 0 var(--spacer);
    display: flex;
    gap: var(--spacer-xs);
    flex-direction: column;
    justify-content: center;
  }

  h1,
  p {
    @mixin ui-font;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    height: 1em;
  }
  p {
    color: var(--muted);
  }

  a {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    span {
      opacity: 0.0001;
    }
  }

  &:--highlight {
    background: var(--gray-z-4);
  }
}

.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--size-5);
  width: 100%;

  @media (--md) {
    grid-column: span 2;
  }
}
</style>
