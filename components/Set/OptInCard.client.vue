<template>
  <section v-if="showOptIn">
    <Card class="static">
      <template v-if="!currentAddress" class="connect">
        <header>
          <SectionTitle>Vote</SectionTitle>
          <span v-if="optInAvailable && isStagedSet">
            {{ optInCountDown.str }}
          </span>
        </header>
        <p>
          Connect a wallet to vote with your unrevealed Opepen.
          <NuxtLink to="/about#voting">How voting works</NuxtLink>
        </p>
        <Actions>
          <Connect class-name="primary">Connect Wallet</Connect>
        </Actions>
      </template>

      <template v-else-if="revealing && isStagedSet">
        <SectionTitle>Reveal Pending</SectionTitle>
        <p>The reveal is in progress.</p>
        <p v-if="blockConfirmations === null">Waiting for reveal block...</p>
        <p v-else>
          <span>
            Reveal block
            <NuxtLink
              :to="`https://etherscan.io/block/${submission.reveal_block_number}`"
              target="_blank"
            >
              {{ submission.reveal_block_number }}
            </NuxtLink>
          </span>
          <span v-if="blockConfirmations < 0n">({{ blockConfirmationText }} remaining).</span>
          <span v-else>({{ blockConfirmationText }}; 5 block confirmations required).</span>
        </p>
      </template>

      <template v-else-if="!optInAvailable && !revealing && !submission.set_id">
        <SectionTitle>Voting Closed</SectionTitle>
        <p>
          Staged {{ formatDate(submission.starred_at) }}. It did not reach consensus.
          <NuxtLink to="/about#voting">How voting works</NuxtLink>
        </p>
      </template>

      <template v-else class="connect">
        <template v-if="subscriptionLoaded && subscription?.opepen_ids?.length">
          <header>
            <SectionTitle>Your Opt-Ins</SectionTitle>
            <span v-if="optInAvailable && isStagedSet">
              {{ optInCountDown.str }}
            </span>
          </header>
          <p>
            You opted in
            <strong>{{ subscription?.opepen_ids?.length }} Opepen</strong>
          </p>
          <Table>
            <thead>
              <tr>
                <td>Edition</td>
                <td>Opt-Ins</td>
                <td>Max Reveals</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(amount, edition) in subscription?.per_edition">
                <td>{{ getEditionName(edition) }}</td>
                <td>
                  {{ amount }}
                  <span class="times">x</span>
                </td>
                <td>
                  {{ subscription.max_reveals[edition] }}
                  <span class="times">x</span>
                </td>
              </tr>
            </tbody>
          </Table>
        </template>

        <template v-else>
          <header>
            <SectionTitle>Vote</SectionTitle>
            <span v-if="optInAvailable && isStagedSet">
              {{ optInCountDown.str }}
            </span>
          </header>
          <p v-if="subscription?.message === 'DISCARD'">
            You passed on this set. You can still opt in.
          </p>
          <p v-else>Opt in your unrevealed Opepen to vote for this set.</p>
        </template>

        <IsAuthenticated>
          <Actions>
            <SetDiscardButton v-if="!subscription" :submission="submission" @update="update" />

            <Button class="primary" @click="openOptInModal">
              <Icon type="edit" />
              <span v-if="subscription?.opepen_ids?.length">Change Opt-Ins</span>
              <span v-else>Opt-In</span>
            </Button>
          </Actions>
        </IsAuthenticated>

        <LazySetOptInModal
          v-model:open="optInOpen"
          :address="currentAddress"
          :submission="submission"
          :subscribed="subscription?.opepen_ids || []"
          :max-reveals="subscription?.max_reveals || {}"
          @update="update"
        />
      </template>
    </Card>
  </section>
</template>

<script setup>
import { useBlockNumber } from '@wagmi/vue'

const props = defineProps({
  submission: Object,
})
const emit = defineEmits(['update'])

// SUBMISSION PROCESS
const { optInAvailable, optInCountDown } = await useOptIn(toRef(props.submission))
const { submission: stagedSubmission } = await useStagedOptIn()

const isStagedSet = computed(
  () => stagedSubmission.value && props.submission.uuid === stagedSubmission.value.uuid,
)

const showOptIn = computed(() => isStagedSet.value || props.submission.published_at)
const optInOpen = ref(false)
const openOptInModal = () => {
  optInOpen.value = true
}

const subscription = ref()
const subscriptionLoaded = ref(false)
const fetchSubscription = async () => {
  if (!currentAddress.value) return
  const uri = `${useApiBase()}/accounts/${currentAddress.value}/set-submissions/${props.submission.uuid}/subscription`
  subscription.value = await $fetch(uri)
  subscriptionLoaded.value = true
}
watch(currentAddress, () => fetchSubscription())

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

watchEffect(() => {
  if (isStagedSet.value && (revealed.value || stagedSubmission.value?.set_id)) {
    navigateTo(`/sets/${pad(stagedSubmission.value?.set_id)}`)
  }
})

// EVENTS
const update = async () => {
  emit('update')
  fetchSubscription()
}
onMounted(() => fetchSubscription())
</script>

<style scoped>
.card {
  gap: var(--spacer);
}

p,
ul {
  @mixin ui-font;
  color: var(--muted);

  a {
    color: var(--color);
    white-space: nowrap;
  }
}

strong,
.edition,
.amount {
  color: var(--color);
}

.actions {
  justify-content: flex-end;
}

table {
  td {
    &:nth-child(2),
    &:nth-child(3) {
      text-align: right;
    }
  }

  .times {
    text-transform: lowercase;
    color: var(--gray-z-4);
  }
}
</style>
