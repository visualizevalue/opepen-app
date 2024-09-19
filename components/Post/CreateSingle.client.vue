<template>
  <Authenticated #default="{ isConnected }">
    <form
      v-if="isConnected"
      class="create"
      @submit.stop.prevent="submitPosts"
    >
      <MultiImageUpload
        name="Post Images"
        :images="images"
        @stored="$event => {
          images = $event
        }"
      />

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
import { useAccount } from '~/helpers/use-wagmi'
import { isAuthenticated, useSignIn } from '~/helpers/siwe'

const router = useRouter()

const images = ref([])

const { signIn } = useSignIn()
const { profile } = useAccount()
const config = useRuntimeConfig()
const emit = defineEmits(['created'])
const saving = ref(false)
const submitPosts = async () => {
  if (saving.value) return

  if (! isAuthenticated.value) {
    await signIn()

    if (! isAuthenticated.value) return

    return submitPosts()
  }

  saving.value = true
  try {
    const newPosts = await Promise.all(
      images.value.map(i => $fetch(`${config.public.opepenApi}/posts`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          image_ids: [i.uuid],
        })
      }))
    )

    images.value = []

    emit('created', {
      account: profile.value,
      posts: newPosts,
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

  :deep(.multi-image-upload) {
    padding-bottom: var(--size-5);
    border-bottom-left-radius: var(--size-7);
    border-bottom-right-radius: var(--size-7);

    .grid {
      grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    }
  }
}
</style>
