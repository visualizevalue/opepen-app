<template>
  <slot :start="start" name="start"></slot>

  <Modal
    :open="open"
    @close="cancel"
    :click-outside="false"
    :x-close="false"
    modal-classes="transaction-flow"
  >
    <div class="text">
      <CheckSpinner class="spinner" />
      <h1 v-if="text.title[step]">{{ text.title[step] }}</h1>
      <p>{{ text.lead[step] }}</p>
      <p v-if="error">{{ error }}</p>
    </div>

    <slot :name="step" :cancel="cancel"></slot>

    <div v-if="step === 'waiting'" class="text">
      <p><a :href="txLink" target="_blank" class="small">View Transaction on Etherscan</a></p>
    </div>

    <div v-if="step === 'confirm'" class="actions">
      <Button @click="cancel" class="secondary">Cancel</Button>
      <Button @click="() => initializeRequest()">{{ text.action[step] || 'Execute' }}</Button>
    </div>
  </Modal>
</template>

<script setup>
import { switchNetwork, getNetwork, waitForTransaction } from '@wagmi/core'
import { delay } from '~~/helpers/time'

const config = useRuntimeConfig()
const props = defineProps({
  text: {
    type: Object,
    default: {
      title: {
        confirm: '[[Really?]]',
      },
      lead: {
        confirm: '[[Do you really?]]'
      },
      action: {
        confirm: '[[Do!]]',
      }
    },
  },
  request: Function,
  delayAfter: {
    type: Number,
    default: 6_000,
  },
  skipConfirmation: Boolean,
})

const emit = defineEmits(['complete', 'cancel'])

const open = ref(false)

const requesting = ref(false)
const waiting = ref(false)
const complete = ref(false)
const error = ref('')
const tx = ref(null)
const receipt = ref(null)
const txLink = computed(() => `https://etherscan.io/tx/${tx.value}`)

const step = computed(() => {
  if (
    open.value &&
    !requesting.value &&
    !waiting.value &&
    !complete.value
  ) {
    return 'confirm'
  }

  if (requesting.value) {
    return 'requesting'
  }

  if (waiting.value) {
    return 'waiting'
  }

  if (complete.value) {
    return 'complete'
  }

  return 'error'
})

const initializeRequest = async () => {
  if (getNetwork().chain.id !== config.public.chainId) {
    await switchNetwork({ chainId: config.public.chainId })
  }

  error.value = ''
  tx.value = null
  receipt.value = null

  if (requesting.value) return

  try {
    requesting.value = true
    tx.value = await props.request()
    requesting.value = false
    waiting.value = true
    const [receipt] = await Promise.all([
      waitForTransaction({ hash: tx.value }),
      delay(6_000),
    ])
    await delay(props.delayAfter)
    receipt.value = receipt
    emit('complete', receipt)
    complete.value = true
  } catch (e) {
    if (e?.code === 'ACTION_REJECTED') {
      open.value = false
    } else {
      error.value = 'Error submitting transaction request.'
    }
    console.log(e)
  }

  requesting.value = false
  waiting.value = false
}

const start = () => {
  if (props.skipConfirmation && !open.value) {
    initializeRequest()
  }

  open.value = true
}

const cancel = () => {
  open.value = false

  emit('cancel')
}

defineExpose({
  open,
})
</script>

<style>
.transaction-flow > section {
  .spinner {
    margin: calc(-1 * var(--size-4)) 0 var(--size-3) 0;
  }

  > .text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  h1 {
    font-size: var(--font-lg);
    margin-bottom: var(--size-4);
  }

  p {
    white-space: pre-wrap;
    width: 100%;
    text-align: center;

    a {
      text-decoration: underline;
    }
  }

  .actions {
    display: flex;
    padding: var(--size-4) 0;
    border-top: 0 !important;
    gap: var(--size-4) !important;
  }
}
</style>
