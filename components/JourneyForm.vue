<template>
  <form
    ref="form"
    @submit.stop.prevent="submit"
    :class="{ expanded }"
  >

    <div class="row">
      <div class="group base-input">
        <label>
          <span>Base</span>
          <Button>
            <IconsOpepenAiMedium />
          </Button>
        </label>
      </div>

      <div class="group">
        <label>
          <span>Prompt</span>
          <PromptInput v-model="prompt" :expanded="expanded" @submit="submit" />
        </label>
        <button v-if="! expanded" class="expand muted" @click="expand">
          <span>Expand</span>
          <Icon type="chevron-right" />
        </button>
      </div>
    </div>

  </form>
</template>

<script setup>
import { useElementBounding } from '@vueuse/core'
import { useToggle } from '@vueuse/shared'

const emit = defineEmits(['submit'])

// Our form element
const form = ref(null)
const { height: formHeight } = useElementBounding(form)
onMounted(() => form.value.style.setProperty('--height', `${formHeight.value}px`))

// Whether the form is expanded
const expanded = ref(false)
const expand = useToggle(expanded)

// Prompt data
const prompt = ref('')
const opepen = ref({})

const submit = () => {
  if (! prompt.value) return

  emit('submit', {
    prompt: prompt.value,
    opepen: opepen.value,
    foo: 'bar',
  })
}
</script>

<style lang="postcss" scoped>
  form {
    --height: 0rem; /* will be overridden by JS */
    --minmax-width: 40rem;

    width: 100%;
    max-width: min(calc(100vw - 2 * var(--size-4)), var(--minmax-width));
    margin: calc(var(--page-height)/2 - var(--height)/2 - var(--size-5)) auto var(--size-7);
    transition: margin var(--speed-fast) ease-out;
    animation: var(--speed-fast) ease-out 0s 1 appear;

    .row {
      display: flex;
      justify-content: space-between;
      gap: var(--size-9);
    }

    .group {
      width: 100%;

      label {
        > span:first-child {
          display: none;
          text-transform: uppercase;
          letter-spacing: var(--letter-spacing-md);
          font-size: var(--font-sm);
          color: var(--gray-z-5);
          font-weight: var(--font-weight-bold);
          margin-bottom: var(--size-2);
        }
      }
    }

    .base-input {
      display: none;
      width: var(--size-9);
      height: var(--size-9);

      button {
        width: var(--size-9);
        height: var(--size-9);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;

        .icon {
          width: var(--size-6);
          height: var(--size-6);
          margin: 0;
        }
      }
    }
  }

  form.expanded {
    --minmax-width: 60rem;

    margin-top: var(--size-8);

    .base-input {
      display: block;
    }

    .group {
      label {
        > span:first-child {
          display: block;
        }
      }
    }

    :deep(.prompt-input textarea) {
      min-height: var(--size-9);
    }
  }

  .expand {
    margin: var(--size-3) var(--size-3) var(--size-3) auto;
  }
</style>
