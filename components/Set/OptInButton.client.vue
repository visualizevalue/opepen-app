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

<style lang="postcss" scoped>
  .opt-in {
    border: var(--border);
    border-radius: var(--size-5);
    border-top-left-radius: var(--size-1);
    background-color: var(--gray-z-0);
    container-type: inline-size;
    display: flex;
    flex-direction: column;

    > header,
    > section,
    > .selection,
    > footer {
      padding: var(--size-2) var(--size-2) var(--size-2) var(--size-4);
    }

    > header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--size-2) var(--size-4);
      border-bottom: var(--border);

      @media (--md) {
        height: 12.5%;
      }

      > h1 {
        font-size: var(--font-sm);
      }

      svg {
        width: var(--size-4);
        height: var(--size-4);
        margin: 0;
        color: var(--gray-z-6);
      }
    }

    > footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: var(--border);

      > .button:last-child {
        margin-left: auto;
      }

      @media (--md) {
        height: 12.5%;
      }
    }

    > section {
      &:last-of-type {
        margin-bottom: auto
      }

      > .vue-feather {
        flex-shrink: 0;
        margin-right: var(--size-4);
        color: var(--gray-z-6);
      }

      > div,
      h1 {
        font-weight: var(--font-weight-bold);
        font-size: var(--font-sm);
        text-transform: uppercase;
        letter-spacing: var(--letter-spacing-md);

        a {
          text-decoration: underline;
        }
      }

      > p:not(:first-child),
      :deep(> p:not(:first-child)) {
        margin-top: 1em;
      }

      > ul,
      :deep(> ul) {
        list-style: disc;
        padding-left: 2em;

        > li {
          .icon {
            width: 1.2em;
            height: 1.2em;
            display: inline-block;

            :deep(> .image) {
              border-radius: 1px;
            }
          }
        }
      }

      + section {
        padding-top: 0 !important;
      }

    }

    > section,
    > .selection {
      font-size: var(--font-sm);
      padding: var(--size-3) var(--size-2) var(--size-3) var(--size-4);

      .comment {
        margin: var(--size-4) 0 0;

        span {
          word-wrap: pre;
        }
      }
    }

    .countdown:not(.inline) {
      display: block;
      font-size: var(--font-xl);
      margin: var(--size-4) 0 var(--size-6);
    }
  }

  .curator-stats {
    margin-top: auto;
    margin-bottom: 0 !important;
  }
</style>
