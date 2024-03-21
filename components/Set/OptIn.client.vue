<template>

  <section v-if="data" class="opt-in">
    <header>
      <h1 v-if="published">Your Opt-Ins</h1>
      <h1 v-else>Opt-In Not Open Yet</h1>
      <IconOpepen />
    </header>
    <section v-if="revealed">
      <p>Revealed on {{ revealDate }} at <NuxtLink :to="`https://etherscan.io/block/${data.reveal_block_number}`">Block {{ data.reveal_block_number }}</NuxtLink> using the <NuxtLink to="https://github.com/visualizevalue-dev/opepens-metadata-api/tree/main/drops/datas">Opepen Metadata Reveal Script</NuxtLink>.</p>

      <OptInOwnedRevealed v-if="subscription && data.set_id" :data="data" :subscription="subscription" />
    </section>
    <section v-if="subscription" class="selection">
      <template v-if="opepenCount">
        <p>You submitted {{ opepenCount }} Opepen for potential reveal: <br><span class="muted">
          {{ opepenIds }}<span v-if="opepenCount <= shownCount">.</span><span v-else>... (and {{ opepenCount - shownCount }} more).</span>
        </span></p>
        <p v-if="subscription.comment" class="comment">Comment: <span>{{ subscription.comment }}</span></p>
      </template>
      <template v-else>
        <p>You opted out all opepen submissions.</p>
      </template>
    </section>
    <section v-if="!revealed && !revealing && data.reveals_at">
      <CountDown @complete="onComplete" :until="revealsAt" class="nowrap" />
      <div>Opt-In window <span class="hidden-sm">for "{{ data.name }}"&nbsp;</span>closes on {{ revealDate }}.</div>
    </section>
    <section v-else-if="timeRemaining" class="centered">
      <span class="countdown">{{ timeRemaining }} remaining</span>
      <div>Countdown will resume when consensus is met again.</div>
    </section>
    <section>
      <ClientOnly>
        <SetOptInFlow
          :data="data"
          :subscribed="subscription?.opepen_ids || []"
          :max-reveals="subscription?.max_reveals"
          :stored-comment="subscription?.comment"
          :open="optInOpen"
          @close="optInOpen = false"
          :click-outside="false"
        />
      </ClientOnly>
    </section>

    <footer v-if="!revealed && !revealing && published">
      <Button @click="startOptIn">
        <Icon type="feather" />
        <span class="nowrap"><span v-if="subscription?.opepen_ids?.length">Change</span> Opt-In</span>
      </Button>
    </footer>
  </section>

</template>

<script setup>
import { DateTime } from 'luxon'
import { useAccount } from '~/helpers/use-wagmi'
import { timeRemainingFromSeconds, DEFAULT_TIME_TO_REVEAL } from '~/helpers/time'
import OptInOwnedRevealed from './OptInOwnedRevealed.vue'

const config = useRuntimeConfig()
const props = defineProps({ data: Object })
const emit = defineEmits(['update'])
const { address, isConnected } = useAccount()

const published = computed(() => !!props.data.published_at)
const revealDate = ref(DateTime.fromISO(props.data?.reveals_at).toFormat('LLL dd, yyyy'))
const revealsAt = ref(DateTime.fromISO(props.data?.reveals_at).toUnixInteger())
const timeRemaining = computed(() => props.data.remaining_reveal_time < DEFAULT_TIME_TO_REVEAL && timeRemainingFromSeconds(props.data.remaining_reveal_time))
const revealing = ref(revealsAt.value <= DateTime.now().toUnixInteger())
const revealed = computed(() => revealing.value && props.data?.reveal_block_number)
const onComplete = () => {
  revealing.value = true
}

const url = computed(() => `${config.public.opepenApi}/accounts/${address.value}/set-submissions/${props.data.uuid}/subscription`)
const subscription = ref(null)
const fetchSubscription = async () => {
  subscription.value = await $fetch(url.value)
}
const shownCount = 20
const opepenCount = computed(() => subscription.value?.opepen_ids?.length)
const opepenIds = computed(() => subscription.value
  ?.opepen_ids?.slice(0, shownCount)
  ?.map(id => `#${id}`)
  .join(', ')
)

if (isConnected.value) {
  try {
    await fetchSubscription()
  } catch (e) {
    // ...
  }
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
      margin-top: auto;

      > .button:last-child {
        margin-left: auto;
      }

      @media (--md) {
        height: 12.5%;
      }
    }

    > section {
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
</style>
