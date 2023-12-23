<template>
  <Button :disabled="notifying" @click="open = true" type="button">
    <span v-if="notifying">Notifying...</span>
    <span v-else>Notify Holders</span>
  </Button>

  <Modal :open="open" title="Notify Set Publication" @close="open = false">
    <form @submit.stop.prevent="notify">
      <p>Are you sure you want to notify Opepen Set subscribers by email?</p>

      <div class="actions">
        <Button @click="open = false" type="button" :disabled="notifying">Cancel</Button>
        <Button type="submit" :disabled="notifying">Send Notifications</Button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { useSignIn } from '~/helpers/siwe'

const { submission } = defineProps({
  submission: Object
})
const emit = defineEmits(['notified'])

const config = useRuntimeConfig()
const { session, signIn } = useSignIn()
const router = useRouter()

const open = ref(false)

const notifying = ref(false)

const notify = async () => {
  try {
    if (! session.value) await signIn()

    notifying.value = true

    const url = `${config.public.opepenApi}/set-submissions/${submission.uuid}/notify`

    await $fetch(url, { method: 'POST', credentials: 'include' })

    notifying.value = false

    emit('notified')
    alert('Notifications sending!')

    router.replace(`/sets/${submission.set_id}`)
  } catch (e) {
    alert('Notificaitons not sent!')
    notifying.value = false
  }
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
    gap: var(--size-4) !important;

    :deep(button) {
      width: auto !important;
    }
  }
}
</style>
