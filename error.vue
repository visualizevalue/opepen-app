<template>
  <div>
    <NuxtLayout>
      <PageFrameSm>
        <h1 v-if="notFound">Page not found</h1>
        <h1 v-else>{{ error?.statusCode || 'Something went wrong' }}</h1>

        <p v-if="notFound">
          There is nothing at this address. The link may be wrong, or the page may have moved.
        </p>
        <p v-else>{{ error?.statusMessage || 'Unknown Error' }}</p>

        <nav class="links">
          <Button to="/">Home</Button>
          <Button to="/sets">Collection</Button>
          <Button to="/submissions">Submissions</Button>
          <Button to="/artists">Artists</Button>
        </nav>
      </PageFrameSm>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError,
})

const notFound = computed(() => props.error?.statusCode === 404)

useHead({
  title: notFound.value ? 'Page not found | Opepen' : 'Something went wrong | Opepen',
})
</script>

<style scoped>
.page-frame-sm {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: var(--main-content-height);
}

h1,
p {
  @mixin ui-font;
  font-size: var(--font-xl);
}

p {
  font-size: var(--font-lg);
  color: var(--muted);
  max-width: 28rem;
}

.links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacer-sm);
  margin-top: var(--spacer);
}
</style>
