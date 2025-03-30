<template>
  <div>
    <NuxtLayout>
      <PageFrameSm>
        <h1>{{ error?.statusCode || 'Something went wrong' }}</h1>
        <p>{{ error?.statusMessage || 'Unknown Error' }}</p>
        <Button to="/">Go back home</Button>
      </PageFrameSm>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError,
})
</script>

<style scoped>
.page-frame-sm {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
}
</style>
