<template>
  <Dropdown :items="items" id="participation-menu" align="right">
    <template #trigger>
      <div class="menu-trigger">
        <Icon type="more-vertical" />
      </div>
    </template>
  </Dropdown>

  <Confirm
    v-model:open="confirmDelete"
    title="Delete Contribution?"
    text="Do you really want to delete this contribution? This action cannot be undone."
    action="Delete"
    icon="trash"
    :callback="deleteContribution"
  />

  <Confirm
    v-if="isSetCreator || isAdmin"
    v-model:open="confirmSetAsEdition"
    :title="`Set as ${editionTypeLabel}?`"
    :text="confirmationText"
    action="Confirm"
    icon="check"
    :callback="setAsEdition"
  />

  <div v-if="confirmation" class="confirmation">
    <Icon type="check" />
    <span>Image set as {{ successMessage }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  submission: {
    type: Object,
    required: true,
  },
  participation: {
    type: Object,
    required: true,
  },
  isSetCreator: {
    type: Boolean,
    default: false,
  },
  isUserContribution: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['refresh'])
const config = useRuntimeConfig()

const confirmDelete = ref(false)
const confirmSetAsEdition = ref(false)
const editionType = ref('')
const confirmation = ref(false)
const successMessage = ref('')

const editionTypeLabel = computed(() => {
  const edition = getEdition(editionType.value)
  return edition ? `1/${edition}` : editionType.value
})

const isDynamicSet = computed(() => props.submission.edition_type === 'DYNAMIC')

const editionOptions = computed(() => {
  if (!(props.isSetCreator || isAdmin.value)) return []

  const createOption = (edition, icon = 'layers') => {
    const name = `1/${edition}`

    // for dynamic sets, disable if all slots are taken
    if (isDynamicSet.value && edition !== EditionType.One) {
      const slotsFilled = countUsedSlots(props.submission.dynamicSetImages, edition)
      const available = edition - slotsFilled

      return {
        icon,
        text: `Set as ${name}`,
        onClick: () => selectEdition(edition),
        disabled: available === 0,
      }
    }

    // for 1/1s and print sets never disable
    return {
      icon,
      text: `Set as ${name}`,
      onClick: () => selectEdition(edition),
      disabled: false,
    }
  }

  return EDITION_KEYS.map((edition) => createOption(edition))
})

const items = computed(() => {
  const menuItems = []

  if (props.isSetCreator || isAdmin.value) {
    menuItems.push(...editionOptions.value)
  }

  if (props.isUserContribution || props.isSetCreator || isAdmin.value) {
    menuItems.push({
      text: 'Delete',
      icon: 'trash',
      onClick: () => {
        confirmDelete.value = true
      },
    })
  }

  return menuItems
})

function getEdition(editionTypeStr) {
  if (!editionTypeStr) return null
  return parseInt(editionTypeStr.split('_')[1])
}

function selectEdition(edition) {
  editionType.value = `edition_${edition}`
  confirmSetAsEdition.value = true
}

function isAlreadySet(edition) {
  const property = `edition${edition === EditionType.One ? '1' : edition}Image`
  return !!props.submission[property]
}

function countUsedSlots(dynamicSetImages, edition) {
  if (edition === EditionType.One) {
    return isAlreadySet(edition) ? 1 : 0
  }

  if (!dynamicSetImages) return 0

  // count indexes
  let count = 0

  for (let i = 1; i <= edition; i++) {
    const key = `image${edition}_${i}`
    if (dynamicSetImages[key]) {
      count++
    }
  }

  return count
}

function findNextAvailableIndex(dynamicSetImages, edition) {
  if (edition === EditionType.One) return 1

  const takenIndexes = new Set()

  if (dynamicSetImages) {
    for (let i = 1; i <= edition; i++) {
      const key = `image${edition}_${i}`
      if (dynamicSetImages[key]) {
        takenIndexes.add(i)
      }
    }
  }

  for (let i = 1; i <= edition; i++) {
    if (!takenIndexes.has(i)) {
      return i
    }
  }
  return null
}

const confirmationText = computed(() => {
  const edition = getEdition(editionType.value)

  // for 1/1
  if (edition === EditionType.One) {
    return isAlreadySet(edition)
      ? `Warning: This will replace the existing 1/1 image. Do you want to continue?`
      : `Do you want to use this contribution as the 1/1?`
  }

  if (isDynamicSet.value) {
    return `Do you want to set this contribution as a ${editionTypeLabel.value}?`
  } else {
    return isAlreadySet(edition)
      ? `Warning: This will replace the existing ${editionTypeLabel.value} image. Do you want to continue?`
      : `Do you want to set this contribution as the ${editionTypeLabel.value}?`
  }
})

function showConfirmation(message) {
  successMessage.value = message
  confirmation.value = true
  setTimeout(() => {
    confirmation.value = false
  }, 3000)
}

const deleteContribution = async () => {
  try {
    await $fetch(`${config.public.opepenApi}/participation/${props.participation.id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    emit('refresh')
  } catch (error) {
    alert('Failed to delete contribution. Please try again.')
  }
}

const setAsEdition = async () => {
  try {
    const edition = getEdition(editionType.value)
    if (!edition) {
      throw new Error('Invalid edition type')
    }
    const uuid = props.participation.image.uuid
    const submissionId = props.submission.uuid
    const baseUrl = `${config.public.opepenApi}/set-submissions/${submissionId}/images`

    await updateImages({ edition, uuid, baseUrl })
    emit('refresh')
    showConfirmation(editionTypeLabel.value)
  } catch (err) {
    alert(`Failed to set as ${editionTypeLabel.value}. Please try again.`)
  }
}

async function updateImages({ edition, uuid, baseUrl }) {
  // dynamic sets
  if (isDynamicSet.value) {
    const index = findNextAvailableIndex(props.submission.dynamicSetImages, edition)
    if (index == null) throw new Error('No available slot')
    await $fetch(baseUrl, {
      method: 'POST',
      credentials: 'include',
      body: { images: [{ edition, index, uuid }] },
    })
    return
  }

  // print sets
  const field = `edition_${edition}ImageId`
  await $fetch(baseUrl, {
    method: 'POST',
    credentials: 'include',
    body: { [field]: uuid },
  })
}
</script>

<style scoped>
#participation-menu {
  transition: color var(--speed);
  z-index: 1;

  &:hover {
    opacity: 1;
  }

  .icon {
    width: var(--size-4);
    height: var(--size-4);
    color: var(--gray-z-7);
  }
}

.menu-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--semi-shade);
  width: var(--size-6);
  height: var(--size-6);
  padding: var(--size-1);
  color: var(--gray-z-7);
  border-radius: 50%;
  transition: background-color var(--speed);
  cursor: pointer;

  &:hover {
    background-color: var(--gray-z-3);
  }
}

.confirmation {
  position: fixed;
  bottom: var(--spacer);
  right: var(--spacer);
  background-color: var(--gray-z-2);
  padding: var(--spacer-sm);
  border-radius: var(--border-radius);
  z-index: 1000;
  animation: slideIn 0.3s ease-out forwards;
  display: flex;
  align-items: center;
  font-size: var(--ui-font-size);
  font-family: var(--ui-font-family);
  font-weight: var(--ui-font-weight);
  letter-spacing: var(--ui-letter-spacing);
  text-transform: var(--ui-text-transform);
  border: var(--border);

  > .icon {
    width: var(--size-4);
    height: var(--size-4);
    margin-right: var(--spacer-sm);
    color: var(--success);
  }
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

:global(#participation-menu .trigger) {
  color: var(--muted);
  padding: 0;
  display: flex;
  align-items: center;

  &:--highlight {
    .icon {
      color: var(--color);
    }
  }
}
</style>
