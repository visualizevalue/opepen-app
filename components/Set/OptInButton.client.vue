<template>

  <button v-if="data" @click="startOptIn">
    <Icon type="check" />
    <span>
      <span>Opt In</span>
    </span>

    <SetOptInFlow
      :data="data"
      :subscribed="subscription?.opepen_ids || []"
      :max-reveals="subscription?.max_reveals"
      :stored-comment="subscription?.comment"
      :open="optInOpen"
      @close="optInOpen = false"
      @update="$emit('update')"
      :click-outside="false"
    />
  </button>

</template>

<script setup>
import { DateTime } from 'luxon'
import { useAccount, useBlockHeight } from '~/helpers/use-wagmi'
import { timeRemainingFromSeconds, DEFAULT_TIME_TO_REVEAL, delay } from '~/helpers/time'

const config = useRuntimeConfig()
const props = defineProps({ data: Object })
const emit = defineEmits(['update'])
const { address, isConnected } = useAccount()

const published = computed(() => !!props.data.published_at)
const revealDate = ref(DateTime.fromISO(props.data?.reveals_at).toFormat('LLL dd, yyyy'))
const revealsAt = ref(props.data?.reveals_at
  ? DateTime.fromISO(props.data?.reveals_at).toUnixInteger()
  : DateTime.now().plus({ seconds: props.data?.remaining_reveal_time }).toUnixInteger()
)
const timeRemaining = computed(() => props.data.remaining_reveal_time < DEFAULT_TIME_TO_REVEAL && timeRemainingFromSeconds(props.data.remaining_reveal_time))
const revealing = ref(revealsAt.value <= DateTime.now().toUnixInteger() && props.data.remaining_reveal_time)
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
const onComplete = () => {
  revealing.value = true
  pollReveal()
}

const url = computed(() => `${config.public.opepenApi}/accounts/${address.value}/set-submissions/${props.data.uuid}/subscription`)
const subscription = ref(null)
const fetchSubscription = async () => {
  try {
    subscription.value = await $fetch(url.value)
  } catch (e) {
    console.info(`No subscription found`)
  }
}
const shownCount = 20
const opepenCount = computed(() => subscription.value?.opepen_ids?.length)
const opepenIds = computed(() => subscription.value
  ?.opepen_ids?.slice(0, shownCount)
  ?.map(id => `#${id}`)
  .join(', ')
)

if (isConnected.value) {
  await fetchSubscription()
}

const optInOpen = ref(false)
watch(optInOpen, () => {
  if (optInOpen.value === false) {
    emit('update')
    fetchSubscription()
  }
})

watch(address, async () => {
  if (! address.value) {
    subscription.value = null
    return
  }

  emit('update')
  await fetchSubscription()
})

const startOptIn = () => {
  if (! isConnected.value) {
    document.querySelector('#main-connect').click()
  }

  optInOpen.value = true
}
</script>
