<template>
  <Button :disabled="publishing" @click="open = true" type="button">
    <span v-if="publishing">Publishing...</span>
    <span v-else>Publish</span>
  </Button>

  <Modal :open="open" title="Publish Set" @close="open = false">
    <form @submit.stop.prevent="publish">
      <label>
        <span class="label">Set ID</span>
        <input type="number" min="1" max="200" v-model="setId" placeholder="Set ID" required />
      </label>

      <label>
        <span class="label">Opt In Duration (Hours)</span>
        <input type="number" min="0" max="144" v-model="hours" placeholder="72" />
      </label>

      <div class="actions">
        <Button type="submit" :disabled="publishing">Publish</Button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { useSets } from '~/helpers/sets'
import { useSignIn } from '~/helpers/siwe'

const { submission } = defineProps({
  submission: Object
})
const emit = defineEmits(['published'])

const config = useRuntimeConfig()
const { session, signIn } = useSignIn()
const router = useRouter()

const open = ref(false)
const { currentSet } = useSets()

const setId = ref(submission.set_id || currentSet.value?.id + 1)
const hours = ref(72)
const publishing = ref(false)

const publish = async () => {
  if (! session.value) await signIn()

  publishing.value = true

  const url = `${config.public.opepenApi}/set-submissions/${submission.uuid}/publish`

  const set = await $fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
      set_id: setId.value,
      hours: hours.value,
    })
  })

  publishing.value = false

  emit('published')

  router.replace(`/sets/${setId.value}`)
}
</script>

<style lang="postcss" scoped>
form {
  display: grid;
  gap: var(--size-4);

  .actions {
    margin: 0 !important;
    border: none !important;
    padding: var(--size-4) 0 0;
    display: flex;
    justify-content: flex-end;

    :deep(button) {
      width: auto !important;
    }
  }
}
</style>
