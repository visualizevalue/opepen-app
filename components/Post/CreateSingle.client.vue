<template>
  <Authenticated #default="{ isConnected }">
    <form
      v-if="isConnected"
      class="create"
      @submit.stop.prevent="submitPost"
    >
      <ImageUpload @stored="image = $event" name="Media" :image="image" :disabled="saving" />

      <input type="text" v-model="text"  :disabled="saving" placeholder="Name" />

      <div class="actions">
        <Button type="submit" :disabled="saving">
          <Icon type="save" />
          <span v-if="saving">Saving...</span>
          <span v-else>Save</span>
        </Button>
      </div>
    </form>
    <span v-else></span>
  </Authenticated>
</template>

<script setup>
import { useAccount, address } from '~/helpers/use-wagmi'
import { isAuthenticated, session, useSignIn } from '~/helpers/siwe'

const router = useRouter()

const text = ref('')
const imageUpload = ref()
const image = ref(null)

const { signIn } = useSignIn()
const { profile } = useAccount()
const config = useRuntimeConfig()
const emit = defineEmits(['created'])
const saving = ref(false)
const submitPost = async () => {
  if (saving.value) return

  if (! isAuthenticated.value) {
    await signIn()

    if (! isAuthenticated.value) return

    return submitPost()
  }

  saving.value = true
  try {
    const newPost = await $fetch(`${config.public.opepenApi}/posts`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        body: text.value,
        image_ids: [image.value.uuid],
      })
    })

    text.value = ''
    image.value = null

    emit('created', {
      account: profile.value,
      ...newPost
    })

    router.replace('/create/singles')
  } catch (e) {
    alert('Error saving')
  }
  saving.value = false
}
</script>

<style lang="postcss" scoped>
.create {
  --spacer-left: calc(var(--spacer)*2 + var(--size-7));
  --bottom-bar-height: var(--size-8);

  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--size-5);

  .actions {
    display: flex;
    gap: var(--size-4);
    justify-content: flex-end;
  }
}
</style>
