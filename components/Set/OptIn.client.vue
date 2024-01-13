<template>

  <section v-if="set" class="opt-in">
    <header>
      <h1>Your Opt-Ins</h1>
      <IconOpepen />
    </header>
    <section v-if="revealed">
      <p>Revealed on {{ revealDate }} at <NuxtLink :to="`https://etherscan.io/block/${set.reveal_block_number}`">Block {{ set.reveal_block_number }}</NuxtLink> using the <NuxtLink to="https://github.com/visualizevalue-dev/opepens-metadata-api/tree/main/drops/sets">Opepen Metadata Reveal Script</NuxtLink>.</p>

      <template v-if="subscription">
        <p>You revealed {{ ownedRevealed.length }} Opepen<span v-if="ownedRevealed.length"> 🎉</span><span v-else>.</span></p>
        <ul v-if="ownedRevealed.length">
          <li v-for="o in ownedRevealed" :key="o.token_id"><NuxtLink :to="`/opepen/${o.token_id}`">#{{ o.token_id }}</NuxtLink></li>
        </ul>
      </template>
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
    <section v-if="!revealed && !revealing && set.reveals_at">
      <CountDown @complete="onComplete" :until="revealsAt" class="nowrap" />
      <div>Opt-In window <span class="hidden-sm">for "{{ set.name }}"&nbsp;</span>closes on {{ revealDate }}.</div>
      <ClientOnly>
        <SetOptInFlow
          :set="set"
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

const config = useRuntimeConfig()
const props = defineProps({ set: Object })
const emit = defineEmits(['update'])
const { address, isConnected } = useAccount()

const published = computed(() => !!props.set.name)
const revealDate = ref(DateTime.fromISO(props.set?.reveals_at).toFormat('LLL dd, yyyy'))
const revealsAt = ref(DateTime.fromISO(props.set?.reveals_at).toUnixInteger())
const revealing = ref(revealsAt.value <= DateTime.now().toUnixInteger())
const revealed = computed(() => revealing.value && props.set?.reveal_block_number)
const onComplete = () => {
  revealing.value = true
}

const url = computed(() => `${config.public.opepenApi}/accounts/${address.value}/sets/${props.set.id}`)
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

// Revealed
const opepenUrl = `${config.public.opepenApi}/opepen/sets/${props.set.id}/opepen`
const { data: revealedOpepen } = await useLazyFetch(opepenUrl, { key: 'revealed-opepen' })
const ownedRevealed = computed(() => {
  const optedIn = subscription.value?.opepen_ids || []

  if (Array.isArray(revealedOpepen.value) && optedIn.length) {
    return revealedOpepen.value.filter(o =>  optedIn.includes(o.token_id))
  }

  return []
})
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

      > p:not(:first-child) {
        margin-top: 1em;
      }

      > ul {
        list-style: disc;
        padding-left: 2em;
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
      font-size: var(--font-xl);
      margin: var(--size-4) 0 var(--size-6);
    }
  }
</style>
