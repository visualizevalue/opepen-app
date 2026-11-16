<template>
  <div>
    <NuxtLayout>
      <PageFrameSm>
        <h1>{{ notFound ? 'Page Not Found' : 'Something Went Wrong' }}</h1>
        <p v-if="notFound">Nothing lives at this address.</p>
        <p v-else>{{ error?.statusMessage || 'Try again in a moment.' }}</p>

        <nav>
          <Button to="/" class="primary">Home</Button>
          <Button to="/sets">Collection</Button>
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
  gap: var(--size-2);
  text-align: center;
  min-height: var(--main-content-height);
}

h1 {
  font-family: var(--font-family-brand);
  text-transform: uppercase;
  font-size: var(--font-xl);
  font-weight: 400;
  letter-spacing: var(--brand-letter-spacing);
}

p {
  color: var(--muted);
  font-size: 1.0625rem;
}

nav {
  display: flex;
  gap: var(--size-2);
  margin-top: var(--spacer);
}
</style>
