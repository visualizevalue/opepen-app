<template>
  <section v-if="showOptIn">
    <Card class="static">
      <template v-if="! isConnected" class="connect">
        <SectionTitle>Opt-In <span v-if="isStagedSet">({{ optInCountDown.str }})</span></SectionTitle>
        <p>Please connect your wallet to opt in to this set.</p>
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
          <SectionTitle>Opt-In <span v-if="isStagedSet">({{ optInCountDown.str }})</span></SectionTitle>
          <p>Opt-In your unrevealed Opepen for potential reveal.</p>
        </template>

        <Actions>
          <Button @click="optInOpen = true">
            <Icon type="edit" />
            <span v-if="subscription?.opepen_ids?.length">Change Opt-Ins</span>
            <span v-else>Opt-In</span>
          </Button>
        </Actions>

        <SetOptInModal
          v-model:open="optInOpen"
          :address="address"
          :submission="submission"
          :subscribed="subscription?.opepen_ids || []"
          :max-reveals="subscription?.max_reveals"
          @update="update"
        />
      </template>
    </Card>
  </section>
</template>

<script setup>
import { useBlockNumber } from '@wagmi/vue'
import { useAccount } from '@wagmi/vue'

const props = defineProps({
  submission: Object,
})
const emit = defineEmits(['update'])

const { address, isConnected } = useAccount()

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

const showOptIn = computed(() => isStagedSet.value || isConnected.value)
const optInOpen = ref(false)
const base = useConfig('opepenApi')

const { data: subscription, refresh: fetchSubscription } =
  await useApi(`/accounts/${address.value}/set-submissions/${props.submission.uuid}/subscription`)

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
h1 {
  padding-bottom: var(--spacer);
  margin-bottom: var(--spacer);
  border-bottom: var(--border);
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

.summary {
  display: grid;
  gap: var(--spacer-sm);
  list-style: disc;
  padding-left: 1em;

  li {
    > span {
      display: grid;
      gap: var(--spacer-sm);
      grid-template-columns: 1.5rem 0.5em 1fr;
      white-space: nowrap;
    }
  }
  .amount {
    text-align: right;
    min-width: min-content;
  }
  .times {
    text-transform: lowercase;
    text-align: center;
  }
  .edition {
    color: var(--color);
  }
}
</style>
