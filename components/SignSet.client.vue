<template>
  <Button type="button" @click="open = true">
    <Icon type="feather" />
    <span v-if="signing">Signing...</span>
    <span v-else>Sign Set</span>
  </Button>

  <Modal v-model:open="open">
    <h1>Artist Signature</h1>

    <form @submit.stop.prevent="sign">
      <Alert type="muted">
        <p>
          Signing will initiate a transaction (0 Eth) to visualizevalue.eth containing the
          below data as plain text in its body.
        </p>
      </Alert>
      <label>
        <span class="label">Name</span>
        <input class="input" type="text" :value="data.name" disabled />
      </label>
      <label>
        <span class="label">Artist</span>
        <input class="input" type="text" :value="data.artist" disabled />
      </label>
      <label>
        <span class="label">Note</span>
        <Input
          class="input"
          type="text"
          v-model="note"
          placeholder="Personal note (optional)"
        />
      </label>

      <Actions>
        <Button>
          <Icon type="feather" />
          <span v-if="signing">Signing...</span>
          <span v-else>Sign Set</span>
        </Button>
      </Actions>
    </form>
  </Modal>
</template>

<script setup>
import { useSendTransaction } from '@wagmi/vue'
import { stringToHex } from 'viem'

const config = useRuntimeConfig()

const { data } = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['signed'])

const { session, signIn } = useSignIn()

const open = ref(false)
const note = ref(data.artist_message?.note || '')

const signing = ref(false)
const lastSigned = ref(null)
const message = computed(() => {
  const elements = [`Name: ${data.name}`, `Artist: ${data.artist}`]

  if (note.value) elements.push(`Note: ${note.value}`)

  return elements.join(`\n\n`)
})
const { sendTransactionAsync } = useSendTransaction()
const sign = async () => {
  if (!session.value) await signIn()

  signing.value = true

  try {
    const hash = await sendTransactionAsync({
      to: '0xc8f8e2F59Dd95fF67c3d39109ecA2e2A017D4c8a',
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
      }),
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
form {
  display: grid;
  gap: var(--spacer);
}
</style>
