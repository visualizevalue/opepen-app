<template>
  <section v-if="isStagedSet && optInAvailable">
    <Card class="static">
      <WithAccount v-slot="{ address, isConnected }">
        <template v-if="! isConnected" class="connect">
          <p>Please connect your wallet to opt in to this set.</p>
          <Actions>
            <Connect />
          </Actions>
        </template>

        <template v-else class="connect">
          <Actions>
            <Button @click="optInOpen = true">Opt In</Button>
          </Actions>

          <SetOptInModal
            v-model:open="optInOpen"
            :address="address"
            :submission="stagedSubmission"
            :subscribed="subscription?.opepen_ids || []"
            :max-reveals="subscription?.max_reveals"
            @update="() => reloadStagedSubmission()"
          />
        </template>

      </WithAccount>
    </Card>
  </section>
</template>

<script setup>
import { useBlockNumber } from '@wagmi/vue'

const props = defineProps({
  submission: Object,
})

// SUBMISSION PROCESS
const {
  submission: stagedSubmission,
  reloadStagedSubmission,
  optInAvailable,
  optInCountDown,
} = await useOptIn()

const isStagedSet = computed(() =>
  stagedSubmission.value && props.submission.uuid === stagedSubmission.value.uuid
)

const optInOpen = ref(false)
const url = computed(() => `${useConfig('opepenApi')}/accounts/${address.value}/set-submissions/${props.data.uuid}/subscription`)
const subscription = ref(null)
const fetchSubscription = async () => {
  try {
    subscription.value = await $fetch(url.value)
  } catch (e) {
    console.info(`No subscription found`)
  }
}

// REVEAL PROCESS
const { data: currentBlock } = useBlockNumber({ chainId: 1 })
const {
  revealing,
  revealsAt,
  secondsUntilReveal,
  revealCountDown,
  blockConfirmations,
  blockConfirmationText,
  revealed,
} = await useReveal(currentBlock)
</script>

