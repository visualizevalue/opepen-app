<template>
  <form
    ref="form"
    @submit.stop.prevent="submit"
    :class="{ expanded }"
  >

    <div class="row">
      <div class="group base-input" title="coming soon">
        <label>
          <span>Base</span>
          <Button type="button">
            <IconsOpepenAiMedium />
          </Button>
        </label>
      </div>

      <div class="group">
        <label>
          <span>Prompt</span>
          <PromptInput v-model="prompt" :expanded="expanded" @submit="submit" />
          <span v-if="promptError" class="error">{{ promptError }}</span>
        </label>
        <button type="button" class="expand muted" @click="() => toggleForceExpanded()">
          <span>{{ expanded ? 'Advanced' : 'Expand' }}</span>
          <Icon type="chevron-right" :class="{ active: forceExpanded }" />
        </button>
      </div>
    </div>

    <div v-if="! expanded" class="create-pack">
      <span>OR</span>
      <!-- /create/submit -->
      <Button to="/create">
        <Icon type="upload" />
        <span>Upload Pack</span>
      </Button>
      <small class="muted">(coming soon)</small>
    </div>
  </form>
</template>

<script setup>
import { useElementBounding, useToggle } from '@vueuse/core'

const props = defineProps({
  journey: Object,
  journeyId: String,
})
const emit = defineEmits(['submit'])

// Our form element
const form = ref(null)
const { height: formHeight } = useElementBounding(form)
watch(formHeight, () => {
  form.value?.style.setProperty('--height', `${formHeight.value}px`)
})

// Whether the form is expanded
// TODO: extract expanded up
const forceExpanded = ref(!! props.journeyId)
const toggleForceExpanded = useToggle(forceExpanded)
const expanded = computed(() => props.journey || forceExpanded.value)

// Prompt data
const prompt = ref(props.journey?.lastStep.prompt || '')
const opepen = ref({})

// Error handling
const promptError = ref('')

const submit = () => {
  promptError.value = ``

  if (! prompt.value) {
    promptError.value = `Please write a prompt to create a new version.`
    return
  }

  if (prompt.value === props.journey?.lastStep.prompt) {
    promptError.value = `Edit the prompt before adding a new version.`
    return
  }

  emit('submit', {
    prompt: prompt.value,
    config: {
      opepen: opepen.value,
    },
  })
}

// Clear prompt the journey
watch([props], () => {
  prompt.value = props.journey?.lastStep.prompt || ''
})
</script>v

<style lang="postcss" scoped>
  form {
    --height: 0rem; /* will be overridden by JS */
    --minmax-width: 40rem;

    width: 100%;
    max-width: min(calc(100vw - 2 * var(--size-4)), var(--minmax-width));
    margin: calc(var(--page-height)/2 - var(--height)/2 - var(--size-8)) auto var(--size-5);
    transition: all var(--speed-fast) ease-out;
    animation: var(--speed-fast) ease-out 0s 1 appear;

    .row {
      display: flex;
      flex-direction: column;
      gap: var(--size-9);

      @media (--md) {
        flex-direction: row;
        justify-content: space-between;
      }
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

      label {
        pointer-events: none;
      }

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
    --minmax-width: var(--content-width);

    margin-top: var(--size-7);

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

    .vue-feather {
      &.active {
        transform: rotate(90deg);
      }
    }
  }

  .create-pack {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    user-select: none;

    pointer-events: none;
    opacity: 0.5;

    > span {
      position: relative;
      width: 100%;
      max-width: 24rem;
      text-align: center;
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: var(--letter-spacing-md);
      margin: var(--size-5) 0 var(--size-8);
      color: var(--gray-z-5);
      font-size: var(--font-sm);

      &:before,
      &:after {
        content: '';
        position: absolute;
        top: 50%;
        height: 1px;
        z-index: -1;
      }

      &:before {
        left: 0;
        width: 100%;
        background-color: var(--gray-z-2);
      }

      &:after {
        left: calc(50% - 1.5rem);
        width: 3rem;
        background-color: var(--background);
      }
    }

    > small {
      margin-top: var(--size-3);
    }

  }
</style>
