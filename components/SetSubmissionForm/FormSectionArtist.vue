<template>
  <Card class="static" :disabled="disabled">
    <label class="artist">
      <span>Artist Name</span>
      <input
        class="input"
        type="text"
        v-model="artistName"
        :disabled="disabled"
        placeholder="Your artist name"
      />
    </label>

    <label v-if="isAdmin && showCreatorField" class="creator">
      <span>Creator Address (Ethereum Public Key)</span>
      <input
        class="input"
        v-model="creatorAddress"
        :disabled="disabled"
        :placeholder="creatorPlaceholder"
      />
    </label>

    <label>
      <span>Co-Creator Addresses</span>
      <SortableList
        :items="coCreatorsList"
        @update="updateCoCreators"
        class="co-creators"
        :disabled="disabled"
      >
        <template v-slot="{ item, index }">
          <input
            type="text"
            :value="item.address"
            @input="handleCoCreatorInput(index, $event.target.value)"
            placeholder="0x000...000"
            :disabled="disabled"
            class="input"
          />
        </template>
      </SortableList>
    </label>

    <slot></slot>
  </Card>
</template>

<script setup>
const props = defineProps({
  artist: {
    type: String,
    default: '',
  },
  creator: {
    type: String,
    default: '',
  },
  coCreators: {
    type: Array,
    default: () => [],
  },
  creatorPlaceholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showCreatorField: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:artist', 'update:creator', 'update:coCreators'])

const artistName = computed({
  get: () => props.artist,
  set: (value) => emit('update:artist', value),
})

const creatorAddress = computed({
  get: () => props.creator,
  set: (value) => emit('update:creator', value),
})

const withEmptyCoCreators = (list) => {
  if (!list.length || list[list.length - 1].address !== '') {
    list.push({ id: list.length, address: '' })
  }
  return list
}

const sortableCoCreators = (list) => {
  const array = Array.isArray(list)
    ? list.filter((address) => !!address).map((address) => ({ id: address, address }))
    : [{ id: 0, address: '' }]

  return withEmptyCoCreators(array)
}

const coCreatorsList = ref(sortableCoCreators(props.coCreators))

watch(() => props.coCreators, (newCreators) => {
  coCreatorsList.value = sortableCoCreators(newCreators)
}, { deep: true })

watch(coCreatorsList, () => {
  coCreatorsList.value = withEmptyCoCreators(coCreatorsList.value)
}, { deep: true })

const handleCoCreatorInput = (index, value) => {
  coCreatorsList.value[index].address = value
  updateCoCreators(coCreatorsList.value)
}

const updateCoCreators = (list) => {
  coCreatorsList.value = list
  const addresses = list
    .map((c) => c.address?.trim().toLowerCase())
    .filter((address) => address)
  emit('update:coCreators', addresses)
}
</script>

<style scoped>
.card {
  display: grid;
  gap: var(--spacer);
}

label {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-sm);

  span {
    @mixin ui-font;
    color: var(--gray-z-5);
  }
}

.co-creators {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-sm);
}
</style>
