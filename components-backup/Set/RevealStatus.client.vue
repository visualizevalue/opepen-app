<template>

  <div v-if="data" class="reveal-status">
    <template v-if="revealing && ! revealed">
      <p>Waiting for <NuxtLink v-if="data.reveal_block_number" :to="`https://etherscan.io/block/${data.reveal_block_number}`">Block {{ data.reveal_block_number }}</NuxtLink><span v-else>Reveal Block</span> to confirm.</p>
      <p>Current Block: {{ currentBlock }}<template
        v-if="data.reveal_block_number && blockConfirmations >= 0"> ({{ blockConfirmations }} confirmation<template v-if="blockConfirmations < 1n || blockConfirmations > 1n">s</template>)</template><template
        v-else-if="blockConfirmations"> ({{ blockConfirmations * -1n }} block<template v-if="blockConfirmations < -1n || blockConfirmations > -1n">s</template> to go)</template>.
      </p>
    </template>
    <template v-else-if="revealed">
      <Button :to="`/sets/${pad(data.set_id)}`">View Revealed</Button>
    </template>
  </div>

</template>

<script setup>
import { DateTime } from 'luxon'
import { useBlockHeight } from '~/helpers/use-wagmi'
import { delay } from '~/helpers/time'
import pad from '~/helpers/pad'

const props = defineProps({ data: Object })
const emit = defineEmits(['update'])

const revealDate = ref(DateTime.fromISO(props.data?.reveals_at).toFormat('LLL dd, yyyy'))
const revealsAt = ref(DateTime.fromISO(props.data?.reveals_at))
const revealing = ref(revealsAt.value <= DateTime.now())
const currentBlock = useBlockHeight()
const blockConfirmations = computed(() =>
  currentBlock.value &&
  props.data.reveal_block_number &&
  currentBlock.value - BigInt(props.data.reveal_block_number)
)
const revealed = computed(() =>
  revealing.value &&
  props.data?.reveal_block_number &&
  currentBlock.value &&
  props.data?.set_id &&
  BigInt(props.data?.reveal_block_number) < (BigInt(currentBlock.value) - 5n)
)
const pollReveal = async () => {
  while (! props.data.reveal_block_number || ! props.data.set_id) {
    await delay(6_000)
    emit('update')
  }
}
onMounted(() => pollReveal())
</script>

<style scoped>
</style>
