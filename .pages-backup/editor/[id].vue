<template>
  <div class="full">
    <div class="split-view">
      <nav>
        <div>
          <input type="text" v-model="name" class="input simple" placeholder="Title">
        </div>
        <p class="muted right">Last saved <TimeAgo :timestamp="lastUpdated || data.updated_at" /></p>
        <Button @click="save"><Icon type="refresh-cw" /></Button>
      </nav>

      <div class="editor">
        <CodeEditor v-model="code" />
      </div>

      <P5Preview ref="preview" :id="data.id" />
    </div>
  </div>
</template>

<script setup>
import { DateTime } from 'luxon'
import { watchDebounced } from '@vueuse/core'

const config = useRuntimeConfig()
const route = useRoute()
const url = computed(() => `${config.public.opepenApi}/generative/${route.params.id}`)
const { data } = await useFetch(url.value)

const preview = ref()

const name = ref(data.value.name || 'P5 Opepen')
const code = ref(data.value.code)

const lastUpdated = ref(null)

const save = async () => {
  const now = DateTime.now().toISO()

  await $fetch(url.value, {
    method: 'PUT',
    credentials: 'include',
    body: {
      name: name.value,
      code: code.value,
    },
  })

  lastUpdated.value = now

  preview.value.reload()
}

watchDebounced(
  [code, name],
  () => save(),
  { debounce: 1000, maxWait: 10000 },
)
</script>

<style scoped>
.full {
  --theme-bg: #0a0e14;

  display: grid;

  .split-view {
    display: grid;
    padding: var(--size-5);
    gap: var(--size-5);

    nav {
      background: var(--theme-bg);
      border: var(--border-dark);
      border-radius: var(--size-1);
      padding: 0 var(--size-4) 0 0;

      display: flex;
      align-items: center;
      gap: var(--size-4);

      position: sticky;
      top: calc(var(--navbar-height) - 2px);
      z-index: 10;
      box-shadow: var(--shadow-lg);

      input {
        border-top: 0;
        border-bottom: 0;
        border-radius: 0;

        &:first-child {
          border-left: 0;
          border-top-left-radius: var(--size-1);
          border-bottom-left-radius: var(--size-1);
        }
      }

      :stuck {
        background: red !important;
      }

      p {
        font-size: var(--font-sm);
      }

      .right {
        margin-left: auto;
      }

      .button {
        border-radius: var(--size-5);
      }
    }

    .editor {
      > .code-editor {
        border: var(--border-dark);
        border-radius: var(--size-1);
        overflow: hidden;
      }
    }

    .preview {
      :deep(> .inner) {
        background: var(--theme-bg);
      }
    }

    @media (--md) {
      --p5-nav-height: var(--size-8);

      grid-template-rows: var(--p5-nav-height) auto;
      grid-template-columns: 1fr min(40%, 40rem);

      nav {
        grid-column: 1/-1;
        height: var(--p5-nav-height);
      }

      .preview {
        :deep(> .inner) {
          position: sticky;
          top: calc(var(--navbar-height) + var(--p5-nav-height) + var(--size-5));
        }
      }
    }
  }

  @media (--md) {
    padding-bottom: 0 !important;
  }
}
</style>
