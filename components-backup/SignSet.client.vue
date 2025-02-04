<template>
  <Button
    type="button"
    @click="open = true"
  >
    <Icon type="feather" />
    <span v-if="signing">Signing...</span>
    <span v-else>Sign Set</span>
  </Button>

  <Modal
    :open="open"
    @close="open = false"
    title="Artist Signature"
    modal-classes="wide"
  >
    <section>
      <Alert class="inline">Signing will initiate a transaction (0 Eth) to visualizevalue.eth containing the below data as plain text in its body.</Alert>
      <label>
        <span class="label">Name</span>
        <input type="text" :value="data.name" disabled />
      </label>
      <label>
        <span class="label">Artist</span>
        <input type="text" :value="data.artist" disabled />
      </label>
      <label>
        <span class="label">Note</span>
        <Input type="text" v-model="note" placeholder="Personal note (optional)" />
      </label>
    </section>

    <footer>
      <div class="actions">
        <Button @click="sign">
          <Icon type="feather" />
          <span v-if="signing">Signing...</span>
          <span v-else>Sign Set</span>
        </Button>
      </div>
    </footer>
  </Modal>
</template>

<script setup>
import { sendTransaction, switchNetwork } from '@wagmi/core'
import { DateTime } from 'luxon'
import { stringToHex } from 'viem'
import { useSignIn } from '~/helpers/siwe'

const config = useRuntimeConfig()

const { data } = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
})
const emit = defineEmits(['signed'])

const { session, signIn } = useSignIn()

const open = ref(false)
const note = ref(data.artist_message?.note || '')

const signing = ref(false)
const lastSigned = ref(null)
const message = computed(() => {
  const elements = [
    `Name: ${data.name}`,
    `Artist: ${data.artist}`,
  ]

  if (note.value) elements.push(`Note: ${note.value}`)

  return elements.join(`\n\n`)
})
const sign = async () => {
  if (! session.value) await signIn()

  signing.value = true

  try {
    if (wagmi.lastUsedChainId !== 1) {
      await switchNetwork({ chainId: 1 })
    }
    const { hash } = await sendTransaction({
      to: 'visualizevalue.eth',
      value: 0,
      data: stringToHex(message.value),
      chainId: 1,
    })

    const url = `${config.public.opepenApi}/set-submissions/${data.uuid}/sign`

    const set = await $fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        signature: {
          name: data.name,
          artist: data.artist,
          note: note.value,
          tx: hash,
        },
      })
    })

    emit('signed', set)
    open.value = false
  } catch (e) {
    console.log(e)
  }

  signing.value = false
  lastSigned.value = DateTime.now()
}
</script>

<style scoped>
section {
  display: grid;
  gap: var(--size-4);
}

footer {
  margin-top: var(--size-5);

  .actions {
    margin: 0 !important;
    padding-top: var(--size-5);
  }
}
</style>
