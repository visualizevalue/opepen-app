<template>
  <section v-if="showOptIn">
    <Card class="static">
      <template v-if="! currentAddress" class="connect">
        <SectionTitle>Vote <span v-if="isStagedSet">({{ optInCountDown.str }})</span></SectionTitle>
        <p>Please connect your wallet to vote on this set.</p>
        <Actions>
          <Connect />
        </Actions>
      </template>

      <template v-else-if="!optInAvailable">
        <SectionTitle>Opt-Ins Closed</SectionTitle>
        <p>Set Submission didn't meet consensus to be included in the permanent collection. It was staged for community consensus on {{ formatDate(submission.starred_at) }}.</p>
      </template>

      <template v-else class="connect">
        <template v-if="subscription?.opepen_ids?.length">
          <SectionTitle>Your Opt-Ins <span v-if="isStagedSet">({{ optInCountDown.str }})</span></SectionTitle>
          <p>You opted in <strong>{{ subscription?.opepen_ids?.length }} Opepen</strong> for potential reveal.</p>
          <table>
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
                <td>{{ amount }}<span class="times">x</span></td>
                <td>{{ subscription.max_reveals[edition] }}<span class="times">x</span></td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-else>
          <SectionTitle>Vote <span v-if="isStagedSet">({{ optInCountDown.str }})</span></SectionTitle>
          <p v-if="subscription?.message === 'DISCARD'">You decided not to opt-in to this set, but you can always change your mind.</p>
          <p v-else>Opt-In your unrevealed Opepen for potential reveal.</p>
        </template>

        <Actions>
          <SetDiscardButton v-if="! subscription" :submission="submission" @update="update" />

          <Button @click="openOptInModal">
            <Icon type="edit" />
            <span v-if="subscription?.opepen_ids?.length">Change Opt-Ins</span>
            <span v-else>Opt-In</span>
          </Button>
        </Actions>

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
const {
  optInAvailable,
  optInCountDown,
} = await useOptIn(toRef(props.submission))
const {
  submission: stagedSubmission,
  reloadStagedSubmission,
} = await useStagedOptIn()

const isStagedSet = computed(() =>
  stagedSubmission.value && props.submission.uuid === stagedSubmission.value.uuid
)

const showOptIn = computed(() => isStagedSet.value || props.submission.published_at)
const optInOpen = ref(false)
const openOptInModal = () => {
  optInOpen.value = true
}

const fetchSubscriptionUrl = computed(() => `/accounts/${currentAddress.value}/set-submissions/${props.submission.uuid}/subscription`)
const { data: subscription, refresh: fetchSubscription } = await useApi(fetchSubscriptionUrl, {
    immediate: false,
  }
)
if (currentAddress.value) fetchSubscription()
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

h1 {
  border-bottom: var(--border);
  padding-bottom: calc(var(--spacer) - var(--spacer-xs));
}

p,
ul {
  @mixin ui-font;
  color: var(--muted);
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
  @mixin ui-font;
  color: var(--muted);
  margin: var(--spacer) 0;

  thead {
    color: var(--color);
  }

  tr:not(:last-child:not(:first-child)) {
    border-bottom: var(--border);
  }

  td {
    white-space: nowrap;

    padding: var(--spacer-xs) var(--spacer-sm);
    &:first-child {
      padding-left: 0;
    }
    &:last-child {
      padding-right: 0;
    }

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
