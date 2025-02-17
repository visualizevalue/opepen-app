<template>
  <Modal
    v-model:open="open"
    :class="{ signing }"
    :x-close="false"
    class="opt-in-flow"
  >
    <header>
      <h1>
        <template v-if="subscribed?.length && !selected.length">Opt-Out of Set "{{ submission.name }}"</template>
        <template v-else>Opt-In to Set "{{ submission.name }}"</template>
      </h1>
      <button
        class="close unstyled"
        @touchdown="open = false"
        @click="open = false"
      >
        <Icon type="close" />
      </button>
    </header>
    <section>
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

            <label v-if="selectedInGroup(g).length > 1 && g !== '1'" class="setting">
              <span>Max Reveal:</span>
              <input
                type="number"
                min="1"
                :max="maxInGroup(g)"
                :value="maxRevealSetting[g] || maxInGroup(g)"
                @input="$event => {
                  maxRevealSetting[g] = parseInt($event.target.value);
                  validateMaxReveal(g)
                }"
                :placeholder="maxInGroup(g)"
              >
            </label>
          </div>

          <FormCheckbox
            v-for="o in opepens"
            :value="o.token_id"
            v-model="selected"
          >
            <span>#{{ o.token_id }}</span>
            <abbr :title="`Edition of ${o.data.edition}`" class="edition">({{ o.data.edition }} Ed.)</abbr>
          </FormCheckbox>
        </div>
      </div>
    </section>
    <footer>
      <div v-if="selected.length" class="summary">
        <span>Submitting {{ selected.length }} Opepen</span>
        <template v-for="(_, g) in grouped">
          <div v-if="selectedInGroup(g).length" class="group">
            <span>
              {{selectedInGroup(g).length}}<span class="times">x</span><span class="edition">{{ getEditionName(g) }}</span>
            </span>
          </div>
        </template>
      </div>
      <Actions>
        <Button @click="open = false">
          <span v-if="hasChange || (!selected.length && opepen.length)">Cancel</span>
          <span v-else>Ok</span>
        </Button>
        <Button v-if="hasChange" :disabled="signing || !hasChange" @click="sign">
          <span v-if="signing">Confirming...</span>
          <span v-else>
            <template v-if="subscribed?.length && !selected.length">Opt-Out</template>
            <template v-else>Confirm</template>
          </span>
        </Button>
      </Actions>
    </footer>
  </Modal>

  <SetOptInSuccessModal v-model="signed" :selected="selected" :submission="submission" />
</template>

<script setup>
import { signMessage } from '@wagmi/core'

const config = useRuntimeConfig()
const props = defineProps({
  address: String,
  submission: Object,
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
const emit = defineEmits(['update'])
const open = defineModel('open', { required: true })

// FIXME: filter to delegated tokenIDs for token specific delegations
const address = computed(() => props.address)
const { addresses: delegatedAddresses } = await useDelegation(address)

const {
  unrevealedOpepen: opepen, opepenByEdition: grouped, opepenLoading, fetchOpepen
} = await useOpepen([address.value, ...delegatedAddresses.value])
watch(delegatedAddresses, () => fetchOpepen([address.value, ...delegatedAddresses.value]))

const validSubscribed = computed(() => [...props.subscribed]
  // All opt ins that are still owned by the owner
  .filter(i => opepen.value.map(o => o.token_id).includes(i))
)

const selected = ref(validSubscribed.value?.length ? [...validSubscribed.value] : [])
watch(validSubscribed, () => {
  selected.value = [...validSubscribed.value] || []
})
const selectedPerGroup = computed(() => Object.keys(grouped.value)
  .map(g => [g, selected.value.filter(id => grouped.value[g].map(g => g.token_id).includes(id))])
  .reduce((groups, [g, ids]) => {
    groups[g] = ids
    return groups
  }, {})
)
const hasChange = computed(() =>
  JSON.stringify(selected.value.sort()) !== JSON.stringify(props.subscribed.sort()) ||
  JSON.stringify(maxRevealValues.value) !== JSON.stringify(props.maxReveals)
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
const maxInGroup = group => {
  const count = selectedInGroup(group).length
  const edition = parseInt(group)
  return count > edition ? edition : count
}
const hasCompleteGroupSelection = group => {
  return selectedInGroup(group).length === grouped.value[group].length
}

const maxRevealSetting = reactive({ ...props.maxReveals })
watch(() => props.maxReveals, () => {
  maxRevealSetting['1'] = props.maxReveals['1']
  maxRevealSetting['4'] = props.maxReveals['4']
  maxRevealSetting['5'] = props.maxReveals['5']
  maxRevealSetting['10'] = props.maxReveals['10']
  maxRevealSetting['20'] = props.maxReveals['20']
  maxRevealSetting['40'] = props.maxReveals['40']
})
const maxRevealValues = computed(() => ({
  '1':  maxRevealSetting['1']  ? maxRevealSetting['1']  : maxInGroup('1') || null,
  '4':  maxRevealSetting['4']  ? maxRevealSetting['4']  : maxInGroup('4') || null,
  '5':  maxRevealSetting['5']  ? maxRevealSetting['5']  : maxInGroup('5') || null,
  '10': maxRevealSetting['10'] ? maxRevealSetting['10'] : maxInGroup('10') || null,
  '20': maxRevealSetting['20'] ? maxRevealSetting['20'] : maxInGroup('20') || null,
  '40': maxRevealSetting['40'] ? maxRevealSetting['40'] : maxInGroup('40') || null,
}))
const validateMaxReveal = g => {
  if (maxRevealSetting[g] > parseInt(g)) {
    maxRevealSetting[g] = parseInt(g)
  }
  if (maxRevealSetting[g] < 1) {
    maxRevealSetting[g] = 1
  }
}

const message = computed(() => {
  return `I want to submit ${selected.value.length} Opepen for possible artwork reveal in the following set:

SET NAME: ${props.submission.name}

MAX REVEALS:
${Object.keys(maxRevealValues.value)
  .filter(g => maxRevealValues.value[g])
  .map(g => [g, maxRevealValues.value[g]])
  .map(([g, max]) => `- Edition of ${g}: ${max} Reveal${max > 1 ? 's' : ''}`)
  .join('\n')
}

OPEPEN PROOF: ${ proof(selected.value.map(id => `#${id}`).join(', ')) }`
})
const { $wagmi } = useNuxtApp()
const signing = ref(false)
const signed = ref(false)
const sign = async () => {
  if (! selected.value?.length && ! props.subscribed.length) {
    alert(`Please select at least one Opepen to submit to the drop first!`)
    return
  }

  try {
    signing.value = true

    const signature = await signMessage($wagmi, {
      message: message.value,
    })

    await $fetch(`${config.public.opepenApi}/set-submissions/${props.submission.uuid}/subscribe`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        address: address.value,
        opepen: selected.value,
        max_reveals: maxRevealValues.value,
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
  open.value = false
  emit('update')
}
</script>

<style>
.opt-in-flow {
  --header-height: calc(var(--spacer)*2 + var(--size-6));
  --dialog-width: 40rem;

  padding: 0;

  &.signing {
    > section {
      pointer-events: none;
      user-select: none;
      opacity: 0.5;
    }
  }
}
</style>

<style scoped>
.opt-in-flow > header {
  padding: var(--spacer);
  border-bottom: var(--border-dark);

  position: sticky;
  z-index: 4;
  top: 0;
  width: 100%;
  height: var(--header-height);

  background-color: var(--semi);
  backdrop-filter: var(--blur);

  display: grid;
  grid-template-columns: 1fr var(--spacer);
  align-items: center;

  h1 {
    @mixin ui-font;
    height: var(--size-6);
    display: flex;
    align-items: center;
  }

  > .close {
    width: var(--spacer);
    height: var(--spacer);
    padding: 0;
    z-index: var(--z-index-dialog);

    &:--highlight {
      outline: none;
    }
  }
}

.empty {
  padding: var(--size-8) var(--size-4);
  text-align: center;
  @mixin ui-font;
  color: var(--muted);
}

.opepens {
  > .group {
    &:not(:first-child) {
      border-top: var(--border);
      margin-top: var(--spacer);
    }

    > div {
      @mixin ui-font;
      padding: var(--size-2) var(--size-4);
      position: sticky;
      top: var(--header-height);
      z-index: 2;
      background-color: var(--semi);
      border-bottom: var(--border);
      backdrop-filter: var(--blur);
      margin: 0 0 var(--spacer) 0;
      color: var(--gray-z-6);

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
          min-width: 5.7rem;
          width: auto;

          &:--highlight {
            color: var(--color);
          }
        }
      }

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
      white-space: nowrap;

      .edition {
        color: var(--muted);
        font-size: var(--font-xs);
        text-align: right;
        margin-left: auto;
      }

      &:--highlight {
        background-color: var(--gray-z-1);
      }
    }
  }
}

footer {
  position: sticky;
  bottom: 0;
  width: 100%;
  z-index: 6;
  padding: var(--spacer);
  background-color: var(--semi);
  backdrop-filter: var(--blur);
  border-top: var(--border);
  margin-top: var(--spacer);

  display: grid;
  gap: var(--spacer);
  align-items: center;

  @container (min-width: 30rem) {
    &:has(:nth-child(2)) {
      grid-template-columns: auto 1fr;
    }
  }

  .summary {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacer-sm);
    @mixin ui-font;
    font-size: var(--font-xs);
    align-items: center;
    font-size: var(--font-xs);

    span:first-child {
      width: 100%;
      color: var(--gray-z-6);
    }

    .times {
      color: var(--gray-z-6);
      text-transform: lowercase;
    }

    .edition {
      color: var(--gray-z-9);
    }
  }

  .actions {
    width: 100%;
    justify-content: flex-end;
    flex-wrap: nowrap;
  }
}
</style>
