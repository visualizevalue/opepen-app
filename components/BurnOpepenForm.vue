<template>
  <div v-if="!isConnected">
    <Connect>Check In</Connect>
  </div>
  <div v-else>
    <form submit.prevent="burn">
      <div v-if="opepen || true" class="opt-out">
        <TransactionFlow
          :request="burn"
          :delay-after="12_000"
          :text="{
            title: {
              confirm: '1. Confirm Burn',
              requesting: '1. Confirm Burn',
              waiting: '2. Transaction Submitted',
              complete: '3. Success!',
            },
            lead: {
              confirm: `Do you really want to burn Opepen #${opepen?.token_id}? This is an irreversible action.`,
              requesting: 'Requesting Burn Signature...',
              waiting: 'Checking Burn Transaction...',
              complete: `You burned Opepen #${burnedEvent?.args?.opepenId}, and received Burned Opepen #${burnedEvent?.args?.burnedId}.`,
            },
            action: {
              confirm: 'Opt Out',
              complete: 'OK',
            },
          }"
          @complete="burned"
          @cancel="() => (opepen = null)"
        >
          <template #start="{ start }">
            <ChooseOpepenModal
              :owned="true"
              :open="modalOpen"
              @close="modalOpen = false"
              @select="
                ($event) => {
                  select($event)
                  start()
                }
              "
            />
            <Button v-if="!opepen" @click="modalOpen = true" type="button">
              <Icon type="opepen" />
              <span>Choose Opepen</span>
            </Button>
          </template>
          <template #confirm>
            <div class="secondary-content">
              <Image :image="opepen.image" class="square" />
            </div>
          </template>
          <template #complete="{ cancel }">
            <div class="secondary-content">
              <Image v-if="burnedImageURI" :image="burnedImageURI" class="square" />
              <p>{{ burnedMetadata?.name }}</p>
            </div>

            <div class="actions">
              <Button @click="cancel">Close</Button>
            </div>
          </template>
        </TransactionFlow>
      </div>
    </form>
  </div>
</template>

<script setup>
import { parseAbi, decodeEventLog } from 'viem'
import { writeContract, readContract } from '@wagmi/core'
import { useAccount } from '@wagmi/vue'

const { address, isConnected } = useAccount()
const { $wagmi } = useNuxtApp()
const config = useRuntimeConfig()

const modalOpen = ref(false)
const opepen = ref(null)
const select = (token) => {
  opepen.value = token
  modalOpen.value = false
}

const burn = computed(() => async () => {
  const { hash } = await writeContract($wagmi, {
    address: config.public.opepenContract,
    abi: parseAbi([
      'function safeTransferFrom(address from, address to, uint256 tokenId) public',
    ]),
    functionName: 'safeTransferFrom',
    args: [
      address.value,
      config.public.burnedOpepenContract,
      // `0xc8f8e2F59Dd95fF67c3d39109ecA2e2A017D4c8a`,
      BigInt(opepen.value?.token_id),
    ],
  })

  return hash
})

const burnedEvent = ref()
const burnedMetadata = ref()
const burnedImageURI = computed(() =>
  burnedMetadata.value?.image?.replace('ipfs://', 'https://ipfs.vv.xyz/ipfs/'),
)
const burned = async (event) => {
  const logs = event.logs.map((log) =>
    decodeEventLog({
      abi: parseAbi([
        'event Burn(uint256 indexed opepenId, uint256 indexed burnedId, address burner)',
        'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
        'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
      ]),
      data: log.data,
      topics: log.topics,
      strict: false,
    }),
  )

  burnedEvent.value = logs.find((log) => log.eventName === 'Burn')

  const metadataURI = await readContract($wagmi, {
    address: config.public.burnedOpepenContract,
    abi: parseAbi(['function tokenURI(uint256 tokenId) public view returns (string memory)']),
    functionName: 'tokenURI',
    args: [burnedEvent.value.args.burnedId],
  })

  const json = Buffer.from(metadataURI.substring(29), `base64`).toString()
  burnedMetadata.value = JSON.parse(json)
}
</script>

<style scoped>
.opepen {
  width: 14.5rem;
  height: 18.125rem;
  display: flex;
  justify-content: center;
  align-items: center;

  > .button {
    height: 100%;
    width: 100%;
    flex-direction: column;

    :deep(.icon) {
      width: var(--size-6) !important;
      height: var(--size-6) !important;
    }
  }
}

.secondary-content {
  margin: var(--size-5) 0 0;
  padding: 0 20%;

  :deep(.inner) {
    border-color: var(--gray-z-2) !important;
  }

  :deep(article.image) {
    margin: var(--size-5) 0;
  }
}
</style>
