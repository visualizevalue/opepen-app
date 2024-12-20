<template>
  <Button v-if="! submission.set_id && submission.published_at" :disabled="unpublishing" @click="open = true" type="button">
    <Icon type="eye-off" />
    <span v-if="unpublishing">Unpublishing...</span>
    <span v-else>Unpublish</span>
  </Button>

  <Modal :open="open" title="Unpublish Set?" @close="open = false">
    <form @submit.stop.prevent="unpublish">
      <p>Are you sure you want to unpublish the set?</p>
      <p>This will clear all opt ins and remove it from the public set explorer.</p>
      <div class="actions">
        <Button type="button" :disabled="unpublishing" @click.stop.prevent="open = false">Cancel</Button>
        <Button type="submit" :disabled="unpublishing">
          <Icon type="eye-off" />
          <span v-if="unpublishing">Unpublishing...</span>
          <span v-else>Unpublish</span>
        </Button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { useSignIn } from '~/helpers/siwe'

const { submission } = defineProps({
  submission: Object,
})
const emit = defineEmits(['unpublished'])

const config = useRuntimeConfig()
const { session, signIn } = useSignIn()
const router = useRouter()

const open = ref(false)
const unpublishing = ref(false)

const unpublish = async () => {
  if (! session.value) await signIn()

  unpublishing.value = true

  const data = await $fetch(`${config.public.opepenApi}/set-submissions/${submission.uuid}/unpublish`, {
    method: 'POST',
    credentials: 'include',
  })

  unpublishing.value = false
  open.value = false

  emit('unpublished', data)
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
