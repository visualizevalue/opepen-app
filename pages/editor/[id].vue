<template>
  <div class="full">
    <div class="split-view">
      <div class="editor">
        <CodeEditor v-model="code" />
      </div>

      <P5Preview :id="data.id" />
    </div>
  </div>
</template>

<script setup>
import { watchDebounced } from '@vueuse/core'

const config = useRuntimeConfig()
const route = useRoute()
const url = computed(() => `${config.public.opepenApi}/generative/${route.params.id}`)
const { data } = await useFetch(url.value)

const code = ref(data.value.code)
const lastUpdated = ref(null)

watchDebounced(
  code,
  async () => {
    const updated = await $fetch(url.value, {
      method: 'PUT',
      credentials: 'include',
      body: {
        code: code.value,
      },
    })

    code.value = updated.code
    lastUpdated.value = Date.now()
  },
  { debounce: 500, maxWait: 5000 },
)
</script>

<style lang="postcss" scoped>
.full {
  --theme-bg: #0a0e14;

  display: grid;

  .split-view {
    display: grid;
    padding: var(--size-5);
    gap: var(--size-5);

    .editor {
      > .code-editor {
        border: var(--border-dark);
        border-radius: var(--size-1);
        overflow: hidden;
      }
    }

    @media (--md) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (--md) {
    padding-bottom: 0 !important;
  }
}
</style>
