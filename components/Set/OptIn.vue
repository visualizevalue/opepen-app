<template>

  <section v-if="set.name" class="opt-in">
    <header v-if="! revealed">
      <div>Opt-In window <span class="hidden-sm">for "{{ set.name }}"&nbsp;</span>closes in <CountDown @complete="onComplete" :until="revealsAt" class="inline nowrap" />.</div>
      <ClientOnly>
        <SetOptInFlow
          :set="set"
          :open="optInOpen"
          @close="optInOpen = false"
          :click-outside="false"
        />
      </ClientOnly>
      <Button @click="optInOpen = true">
        <Icon type="feather" />
        <span class="nowrap"><span v-if="subscription?.opepen_ids?.length">Change</span> Opt-In</span>
      </Button>
    </header>
    <div v-if="subscription" class="selection">
      <p>You submitted {{ subscription.opepen_ids.length }} Opepen for potential reveal:</p>
      <p class="muted">{{ subscription.opepen_ids.map(id => `#${id}`).join(', ') }}.</p>
    </div>
  </section>

</template>

<script setup>
import { DateTime } from 'luxon'
import { useAccount } from 'vagmi'

const config = useRuntimeConfig()
const props = defineProps({ set: Object })
const emit = defineEmits(['update'])
const { address } = useAccount()

const revealsAt = ref(DateTime.fromISO(props.set?.reveals_at).toUnixInteger())
const revealed = ref(revealsAt.value <= DateTime.now().toUnixInteger())
const onComplete = () => {
  revealed.value = true
}

const url = `${config.public.opepenApi}/accounts/${address.value}/sets/${props.set.id}`
const { data: subscription, refresh } = await useLazyFetch(url)

const optInOpen = ref(false)
watch(optInOpen, () => {
  if (optInOpen.value === false) {
    emit('update')
    refresh()
  }
})

</script>

<style lang="postcss" scoped>
  .opt-in {
    border: var(--border);
    border-radius: var(--size-5);
    border-top-left-radius: var(--size-1);
    background-color: var(--gray-z-0);

    header,
    .selection {
      padding: var(--size-2) var(--size-2) var(--size-2) var(--size-4);
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--size-2) var(--size-2) var(--size-2) var(--size-4);

      > div {
        font-weight: var(--font-weight-bold);
        font-size: var(--font-sm);
        text-transform: uppercase;
        letter-spacing: var(--letter-spacing-md);
      }

      + .selection {
        border-top: var(--border);
      }
    }

    .selection {
      font-size: var(--font-sm);
      padding: var(--size-3) var(--size-2) var(--size-3) var(--size-4);

      .muted {
        color: var(--gray-z-6);
      }
    }
  }
</style>
