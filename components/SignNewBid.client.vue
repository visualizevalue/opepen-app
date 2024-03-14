<template>
  <Button v-if="! address" @click="connect">Sign new Bid</Button>
  <Button v-else @click="open = true">Sign new Bid</Button>

  <Modal :open="open" @close="open = false">
    <form @submit.stop.prevent="sign">
      <p v-if="min > opepenCount">You don't own enough unrevealed Opepen 40 Editions to join this auction.</p>
      <label v-else>
        <span>
          How many opepen do you want to bid?
          <span class="muted"><br>You own {{ opepenCount }} unrevealed Opepen 40 Editions
          <span v-if="delegatedAddresses.length"> across {{delegatedAddresses.length + 1}} delegated accounts</span>.</span>
        </span>
        <input v-if="opepenCount" type="number" v-model="bidCount" :min="min" :max="opepenCount" :disabled="! opepenCount" required />
      </label>
      <footer>
        <Button v-if="min < opepenCount" :disabled="signing || ! opepenCount" @click="sign">
          <span v-if="signing">Confirming</span>
          <span v-else>
            Sign Bid
          </span>
        </Button>
        <Button v-else @click.stop.prevent="open = false">Close</Button>
      </footer>
    </form>
  </Modal>
</template>

<script setup>
import { signTypedData } from '@wagmi/core'
import { ACTION, bidDefinition } from '~/helpers/signatures'
import { fetchAddresses } from '~/helpers/delegate-cash'
import { useAccount } from '~/helpers/use-wagmi'

const config = useRuntimeConfig()
const props = defineProps({
  auction: Object,
  min: Number,
})
const emit = defineEmits(['signed'])

const { address } = useAccount()
const open = ref(false)
const bidCount = ref(props.min)
watch(() => props.min, () => bidCount.value = props.min)

const delegatedAddresses = ref([])
const opepen = ref([])
const opepenCount = ref(0)
const fetchOpepen = async () => {
  if (! address.value) return

  // Delegations
  delegatedAddresses.value = await fetchAddresses(address.value)

  const url = addr => `${config.public.opepenApi}/accounts/${addr}/opepen?limit%3D1000&filter%5Bedition%5D=40&filter%5Bset_id%5D=null`
  const responses = await Promise.all([address.value, ...delegatedAddresses.value].map(addr => $fetch(url(addr))))

  opepen.value = responses.reduce((all, curr) => all.concat(curr.data), [])
  opepenCount.value = responses.reduce((count, curr) => count + curr.meta.total, 0)
}

onMounted(address, () => fetchOpepen())
watch(address, () => fetchOpepen())

const signing = ref(false)
const requesting = ref(false)
const publishing = ref(false)
const sign = async () => {
  signing.value = true
  requesting.value = true

  try {
    const object = { Auction: `vv-rare/${props.auction.id}`, Opepen: `${bidCount.value} × 40-Editions` }
    const definition = bidDefinition(object)
    const signature = await signTypedData(definition)
    requesting.value = false

    publishing.value = true
    await $fetch(`${config.public.signatureApi}/signatures`, {
      method: 'POST',
      body: JSON.stringify({
        subjects: [address.value],
        action: ACTION,
        object,
        signer: address.value,
        signature: signature,
        schema: {
          name: definition.domain.name,
          version: definition.domain.version,
          types: definition.types,
        },
      }),
    })

    open.value = false
    emit('signed')
  } catch (e) {}

  requesting.value = false
  publishing.value = false
  signing.value = false
}

const connect = () => document.querySelector('#main-connect').click()
</script>

<style lang="postcss" scoped>
form {
  display: grid;
  gap: var(--size-4);

  p {
    padding-right: var(--size-5);
  }

  label {
    display: grid;
    gap: var(--size-2);
  }

  .muted {
    margin: 0;
  }

  footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
