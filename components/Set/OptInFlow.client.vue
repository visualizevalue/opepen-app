<template>
<div>
  <Modal :open="open" scroll @close="$emit('close')" :click-outside="clickOutside">
    <div class="opt-in-flow" :class="{ signing }">
      <header>
        <h1>
          <template v-if="subscribed?.length && !selected.length">Opt-Out of Set "{{ set.name }}"</template>
          <template v-else>Opt-In to Set "{{ set.name }}"</template>
        </h1>
      </header>
      <section>
        <div v-if="! isConnected" class="connect">
          <p>Please connect your wallet in order to select the Opepen tokens you'd like to submit.</p>
          <ChooseWallet />
        </div>
        <div v-else>
          <Loading v-if="opepenLoading" />

          <div v-else-if="! opepen.length" class="empty">
            <p>No Opepen to opt-in found.</p>
          </div>

          <div v-else class="opepens">
            <div v-for="(opepens, g) in grouped" class="group">
              <div v-if="opepens.length">
                <header>
                  <h1>Editions of {{ g }}:</h1>

                  <Button v-if="hasCompleteGroupSelection(g)" @click="() => deselectAll(g)" class="sm">Deselect All</Button>
                  <Button v-else @click="() => selectAll(g)" class="sm">Select All</Button>
                </header>

                <label v-if="selectedInGroup(g).length > 1" class="setting">
                  <span>Max Reveal:</span>
                  <input
                    type="number"
                    min="1"
                    :max="selectedInGroup(g).length"
                    v-model="maxRevealSetting[g]"
                    :placeholder="selectedInGroup(g).length"
                  >
                </label>
              </div>

              <label
                v-for="o in opepens"
              >
                <input type="checkbox" :value="o.token_id" v-model="selected">
                <span>Opepen #{{ o.token_id }}</span>
                <span class="edition">(Edition of {{ o.data.edition }})</span>
              </label>
            </div>
          </div>
        </div>
      </section>
      <footer v-if="isConnected">
        <div v-if="selected.length" class="left">
          <span>Submitting {{ selected.length }} Opepen</span>
          <template v-for="(_, g) in grouped">
            <div v-if="selectedInGroup(g).length" class="group">
              <span>
                {{maxRevealSetting[g] || selectedInGroup(g).length}}<span class="times">x</span><span class="edition">{{ getEditionName(g) }}</span>
              </span>
            </div>
          </template>
        </div>
        <Button @click="$emit('close')">Cancel</Button>
        <Button :disabled="signing" @click="sign">
          <span v-if="signing">Confirming</span>
          <span v-else>
            <template v-if="subscribed?.length && !selected.length">Opt-Out</template>
            <template v-else>Confirm</template>
          </span>
        </Button>
      </footer>
    </div>
  </Modal>

  <Modal v-if="signed" :open="true" title="Success" @close="() => signed = false">
    <div class="success-modal">
      <template v-if="!selected.length">
        <p>You removed all your Opepen submissions from <span class="nowrap">set #{{ pad(set.id, 3) }}!</span></p>
      </template>
      <template v-else>
        <p>You submitted {{ selected.length }} Opepen to be included in <span class="nowrap">set #{{ pad(set.id, 3) }}!</span></p>
        <p>If your Opepen {{ selected.length > 1 ? 'are' : 'is' }} selected as part of this set, your metadata will update after the opt-in window closes.</p>
      </template>

      <div class="action">
        <Button @click="() => signed = false">Ok</Button>
      </div>
    </div>
  </Modal>
</div>
</template>

<script setup>
import { signMessage } from '@wagmi/core'
import { useAccount } from '~/helpers/use-wagmi'
import pad from '~/helpers/pad'
import { fetchAddresses } from '~/helpers/delegate-cash'
import { getEditionName } from '~/helpers/editions'

const props = defineProps({
  open: Boolean,
  set: Object,
  clickOutside: Boolean,
  subscribed: Array,
  maxReveals: {
    type: Object,
    default: () => ({
      '1': null,
      '4': null,
      '5': null,
      '10': null,
      '20': null,
      '40': null,
    })
  },
})

const emit = defineEmits(['close'])

const config = useRuntimeConfig()
const { address, isConnected } = useAccount()

const opepen = ref([])
const opepenLoading = ref(false)

const delegatedAddresses = ref(await fetchAddresses(config.public.rpc, address.value))
watch(address, async () => {
  delegatedAddresses.value = await fetchAddresses(config.public.rpc, address.value)
})

const fetchOpepen = async () => {
  opepenLoading.value = true
  const addresses = [ address.value, ...delegatedAddresses.value ]
  const responses = await Promise.all(addresses.map(a =>
    $fetch(`${config.public.opepenApi}/accounts/${a}/opepen`)
  ))
  opepen.value = responses.reduce((opepen, response) => {
    return opepen.concat(response.data)
  }, [])
  opepenLoading.value = false
}
watch([isConnected, delegatedAddresses], () => fetchOpepen())
onMounted(() => fetchOpepen())

const grouped = computed(() => {
  const items = opepen.value || []

  return items
    .filter(o => ! o.revealed_at)
    .reduce((groups, o) => {
      groups[o.data.edition].push(o)

      return groups
    }, { 1: [], 4: [], 5: [], 10: [], 20: [], 40: [] })
})

const selected = ref(props.subscribed ? [...props.subscribed] : [])
watch(() => props.subscribed, () => {
  selected.value = [...props.subscribed] || []
})
const selectedPerGroup = computed(() => Object.keys(grouped.value)
  .map(g => [g, selected.value.filter(id => grouped.value[g].map(g => g.token_id).includes(id))])
  .reduce((groups, [g, ids]) => {
    groups[g] = ids
    return groups
  }, {})
)

const selectAll = (group) => {
  grouped.value[group].forEach(o => {
    if (! selected.value.includes(o.token_id)) {
      selected.value.push(o.token_id)
    }
  })
}
const deselectAll = (group) => {
  grouped.value[group].forEach(o => {
    const i = selected.value.findIndex(s => s == o.token_id)
    selected.value.splice(i, 1)
  })
}
const selectedInGroup = group => {
  return selectedPerGroup.value[group]
}
const hasCompleteGroupSelection = group => {
  return selectedInGroup(group).length === grouped.value[group].length
}

const maxRevealSetting = ref({ ...props.maxReveals })
watch(() => props.maxReveals, () => {
  maxRevealSetting.value = {...props.maxReveals}
})

const message = computed(() => {
  return `I want to submit my Opepen for possible artwork reveal in the following set:

OPT-IN: Set ${pad(props.set.id, 3)}

SET NAME: ${props.set.name}

MAX REVEALS:
${Object.keys(maxRevealSetting.value)
.filter(g => selectedInGroup(g).length)
.map(g => `- Edition of ${g}: ${maxRevealSetting.value[g] || selectedInGroup(g).length} Reveals`)
.join('\n')
}

OPEPEN: ${selected.value.map(id => `#${id}`).join(', ')}`
})

const signing = ref(false)
const signed = ref(false)
const sign = async () => {
  if (! selected.value?.length && ! props.subscribed.length) {
    alert(`Please select at least one Opepen to submit to the drop first!`)
    return
  }

  try {
    const set = props.set
    signing.value = true

    const signature = await signMessage({
      message: message.value,
    })

    await $fetch(`${config.public.opepenApi}/opepen/sets/${set.id}/subscribe`, {
      method: 'POST',
      body: JSON.stringify({
        address: address.value,
        opepen: selected.value,
        max_reveals: maxRevealSetting.value,
        message: message.value,
        signature,
        delegated_by: delegatedAddresses.value.join(',')
      })
    })

    signed.value = true
  } catch (e) {
    // ...
  }

  signing.value = false
  emit('close')
}
</script>

<style lang="postcss" scoped>
.opt-in-flow {
  --header-height: calc(var(--size-8) + var(--size-2));

  &.signing {
    > section {
      pointer-events: none;
      user-select: none;
      opacity: 0.5;
    }
  }
}

.opt-in-flow > header {
  padding: var(--size-4);
  border-bottom: var(--border-dark);

  position: absolute;
  z-index: 4;
  top: 0;
  width: 100%;
  height: var(--header-height);

  background-color: var(--semi);
  backdrop-filter: var(--blur);

  h1 {
    text-align: center;
    text-transform: uppercase;
    font-weight: var(--font-weight-bold);
  }
}

.connect {
  padding: var(--size-9) var(--size-4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  p {
    margin: var(--size-7) 0;
    text-transform: uppercase;
    font-weight: var(--font-weight-bold);
    font-size: var(--font-sm);
  }
}

section {
  padding: var(--header-height) 0 var(--size-9);
}

.empty {
  padding: var(--size-8) var(--size-4);
  text-align: center;
  color: var(--gray-z-5);
}

.opepens {
  > .group {
    > div {
      text-transform: uppercase;
      font-weight: var(--font-weight-bold);
      font-size: var(--font-sm);
      padding: var(--size-2) var(--size-4);
      letter-spacing: var(--letter-spacing-md);
      position: sticky;
      top: var(--header-height);
      z-index: 2;

      > * {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      > label {
        border-top: var(--border);
        margin: var(--size-2) 0 0;
        padding: var(--size-2) 0 0;
        color: var(--gray-z-5);
        font-size: var(--font-xs);

        span {
          white-space: nowrap;
        }

        input {
          font-size: var(--font-xs);
          padding-top: var(--size-1);
          padding-bottom: var(--size-1);
          min-height: 0;
          height: calc(var(--size-6) + var(--size-1));
          margin-left: auto;
          width: auto;

          &:--highlight {
            color: var(--color);
          }
        }
      }

      background-color: var(--gray-z-2);

      .button {
        padding: var(--size-0) var(--size-2);
        font-size: var(--font-xs);
        padding-top: var(--size-1);
        padding-bottom: var(--size-1);
        min-height: 0;
        height: calc(var(--size-6) + var(--size-1));
      }
    }

    > label {
      display: grid;
      grid-template-columns: var(--size-5) 40% 1fr;
      align-items: center;
      gap: var(--size-4);
      text-transform: uppercase;
      font-weight: var(--font-weight-bold);
      padding: var(--size-1) var(--size-4);
      white-space: nowrap;

      input {
        width: var(--size-4);
        height: var(--size-4);
      }

      .edition {
        color: var(--gray-z-6);
        font-size: var(--font-sm);
        text-align: right;
      }

      &:--highlight {
        background-color: var(--gray-z-1);
      }
    }
  }
}

footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 6;

  padding: var(--size-4);

  background-color: var(--semi);
  backdrop-filter: var(--blur);
  border-top: var(--border);

  display: flex;
  justify-content: flex-end;
  gap: var(--size-4);

  .left {
    margin-right: auto;
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-2);
    font-size: var(--font-sm);
    align-items: center;
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    line-height: 0.75;
    font-size: var(--font-xs);

    span:first-child {
      width: 100%;
      color: var(--gray-z-6);
      margin-bottom: -0.25em;
    }

    .times {
      color: var(--gray-z-6);
      text-transform: lowercase;
    }

    .edition {
      color: var(--gray-z-9);
    }
  }
}

.success-modal {
  p {
    font-weight: var(--font-weight-bold);
    margin: var(--size-2) 0;
  }

  .action {
    margin-top: var(--size-5);
    display: flex;
    justify-content: flex-end;
  }
}
</style>
