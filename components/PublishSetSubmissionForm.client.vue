<template>
  <Button :disabled="publishing" @click="open = true" type="button">
    <Icon type="send" />
    <span v-if="publishing">Publishing...</span>
    <span v-else>Publish</span>
  </Button>

  <Modal :open="open" title="Publish Set" @close="open = false">
    <form @submit.stop.prevent="publish">
      <p>Are you sure you want to publish the set?</p>
      <p>Before it's publicly visible, it will be reviewed by the Opepen team.</p>
      <div class="actions">
        <Button type="button" :disabled="publishing" @click.stop.prevent="open = false">Cancel</Button>
        <Button type="submit" :disabled="publishing">
          <Icon type="send" />
          <span>Publish</span>
        </Button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { useSignIn } from '~/helpers/siwe'

const { submission, save } = defineProps({
  submission: Object,
  save: {
    type: Function,
    default: () => null,
  }
})
const emit = defineEmits(['published'])

const config = useRuntimeConfig()
const { session, signIn } = useSignIn()
const router = useRouter()

const open = ref(false)
const publishing = ref(false)

const publish = async () => {
  if (! session.value) await signIn()

  await save()

  publishing.value = true

  const url = `${config.public.opepenApi}/set-submissions/${submission.uuid}/publish`

  await $fetch(url, {
    method: 'POST',
    credentials: 'include',
  })

  publishing.value = false

  emit('published')

  router.replace(`/sets/${submission.uuid}`)
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
