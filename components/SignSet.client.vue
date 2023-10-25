<template>
  <Button
    type="button"
    @click="open = true"
  >
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
      <label>
        <span class="label">Set</span>
        <input type="text" :value="pad(data.set_id)" disabled />
      </label>
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
      <label>
        <span class="label">Date</span>
        <input type="text" :value="date" disabled />
      </label>
    </section>

    <footer>
      <div class="actions">
        <Button @click="sign">
          <span v-if="signing">Signing...</span>
          <span v-else>Sign Set</span>
        </Button>
      </div>
    </footer>
  </Modal>
</template>

<script setup>
import { signMessage } from '@wagmi/core'
import { DateTime } from 'luxon'
import { useAccount } from '~/helpers/use-wagmi'
import { formatTime, formatDate } from '~/helpers/dates'
import pad from '~/helpers/pad'
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
const { address } = useAccount()

const open = ref(false)
const note = ref(data.artist_message?.note || '')
const date = formatDate(DateTime.utc().toISO())

const signing = ref(false)
const lastSigned = ref(null)
const lastSignedAt = computed(() => lastSaved.value ? formatTime(lastSaved.value) : '')
const message = computed(() => {
  const elements = [
    `Set: ${data.name} (${pad(data.set_id)})`,
    `Artist: ${data.artist}`,
  ]

  if (note.value) elements.push(`Note: ${note.value}`)
  elements.push(`Date: ${date}`)

  return elements.join(`\n\n`)
})
const sign = async () => {
  if (! session.value) await signIn()

  signing.value = true

  try {
    const signature = await signMessage({
      message: message.value,
    })

    const url = `${config.public.opepenApi}/set-submissions/${data.uuid}/sign`

    const set = await $fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        message: {
          set: data.set_id,
          name: data.name,
          artist: data.artist,
          date: date,
          note: note.value,
        },
        signature,
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

<style lang="postcss" scoped>
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
