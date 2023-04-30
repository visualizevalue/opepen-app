<template>
  <Modal :open="open" modal-classes="wide" scroll @close="$emit('close')">
    <div class="opt-in-flow">
      <header>
        <h1>{{ title }}</h1>
      </header>
      <section>
        <div v-if="! isConnected" class="connect">
          <p>Please connect your wallet in order to select the Opepen tokens you'd like to submit.</p>
          <ChooseWallet />
        </div>
        <div v-else>
          <Loading v-if="opepenLoading" />

          <div v-else class="opepens">
            <div v-for="(opepens, g) in grouped" class="group">
              <div v-if="opepens.length">
                <h1>Editions of {{ g }}:</h1>

                <button v-if="hasCompleteGroupSelection(g)" @click="() => deselectAll(g)" class="sm">Deselect All</button>
                <button v-else @click="() => selectAll(g)" class="sm">Select All</button>
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
          <template v-for="(_, g) in grouped">
            <div v-if="selectedInGroup(g).length" class="group">
              <span>{{selectedInGroup(g).length}}<span class="times">x</span><span class="edition">{{ g }}</span></span>
            </div>
          </template>
        </div>
        <Button @click="$emit('close')">Cancel</Button>
        <Button :disabled="signing" @click="sign">
          <span v-if="signing">Confirming</span>
          <span v-else>Confirm</span>
        </Button>
      </footer>
    </div>
  </Modal>
</template>

<script setup>
import { fetchSigner } from '@wagmi/core'
import { useAccount } from 'vagmi'
import pad from '~/helpers/pad'

const { open, set } = defineProps({
  open: Boolean,
  set: Object,
})

const emit = defineEmits(['close'])

const title = computed(() => `Opt-In to Set "${set.name}"`)

const config = useRuntimeConfig()
const { address, isConnected } = useAccount()

const opepen = ref([])
const opepenLoading = ref(false)
const fetchOpepen = async () => {
  opepenLoading.value = true
  const opepenUrl = `${config.public.opepenApi}/accounts/${address.value}/opepen`
  opepen.value = await $fetch(opepenUrl)
  opepenLoading.value = false
}
watch(isConnected, () => fetchOpepen())
onMounted(() => fetchOpepen())

const grouped = computed(() => {
  const items = opepen.value?.data || []

  return items.reduce((groups, o) => {
    groups[o.data.edition].push(o)

    return groups
  }, { 1: [], 4: [], 5: [], 10: [], 20: [], 40: [] })
})

const selected = ref([])
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
  return grouped.value[group].filter(o => selected.value.includes(o.token_id))
}
const hasCompleteGroupSelection = group => {
  return selectedInGroup(group).length === grouped.value[group].length
}

const signing = ref(false)
const sign = async () => {
  if (! selected.value?.length) {
    alert(`Please select at least one Opepen to submit to the drop first!`)
    return
  }

  try {
    signing.value = true
    const signer = await fetchSigner()
    const message = `I want to submit my opepen for possible artwork reveal in the following set:\n\nOPT-IN: Set ${pad(set.id, 3)}\n\nSET NAME: ${set.name}\n\nOPEPEN: ${selected.value.map(id => `#${id}`).join(', ')}`

    const signature = await signer.signMessage(message)

    const { data } = await $fetch(`${config.public.opepenApi}/opepen/sets/${set.id}/subscribe`, {
      method: 'POST',
      body: JSON.stringify({
        address: address.value,
        opepen: selected.value,
        message,
        signature,
      })
    })

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

  font-family: var(--font-family-display);
}

header {
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

.opepens {
  > div {
    > div {
      text-transform: uppercase;
      font-weight: var(--font-weight-bold);
      font-size: var(--font-sm);
      padding: var(--size-1) var(--size-4);
      letter-spacing: var(--letter-spacing-md);
      position: sticky;
      top: var(--header-height);
      z-index: 2;

      display: flex;
      justify-content: space-between;
      align-items: center;

      background-color: var(--gray-z-2);

      .button {
        padding: var(--size-0) var(--size-2);
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
    gap: var(--size-2);
    font-size: var(--font-sm);
    align-items: center;
    font-weight: var(--font-weight-bold);

    .times {
      color: var(--gray-z-6);
    }

    .edition {
      color: var(--gray-z-7);
    }
  }
}
</style>
