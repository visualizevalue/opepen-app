<template>
  <Button :disabled="deleting" @click="open = true" type="button">
    <Icon type="trash" />
    <span v-if="deleting">Deleteing...</span>
    <span v-else>Delete</span>
  </Button>

  <Modal :open="open" title="Delete Set" @close="open = false">
    <form @submit.stop.prevent="destroy">
      <p>Are you sure you want to delete the set?</p>
      <div class="actions">
        <Button type="button" :disabled="deleting" @click.stop.prevent="open = false">Cancel</Button>
        <Button type="submit" :disabled="deleting">
          <Icon type="trash" />
          <span>Delete</span>
        </Button>
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
const emit = defineEmits(['deleted'])

const config = useRuntimeConfig()
const { session, signIn } = useSignIn()
const router = useRouter()

const open = ref(false)
const { currentSet } = useSets()
const deleting = ref(false)

const destroy = async () => {
  if (! session.value) await signIn()

  deleting.value = true

  const url = `${config.public.opepenApi}/set-submissions/${submission.uuid}`

  const set = await $fetch(url, {
    method: 'DELETE',
    credentials: 'include',
  })

  deleting.value = false

  emit('deleted')

  router.replace(`/create/sets`)
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
