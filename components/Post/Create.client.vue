<template>
  <form class="create" @submit.stop.prevent="submitPost">
    <Authenticated #default="{ isConnected, profile }">
      <template v-if="isConnected">
        <Avatar :account="profile" class="lg" :size="68" />
        <Input
          v-model="text"
          @dragover="dragging = true"
          @dragleave="dragging = false"
          @drop="drop"
          :class="{ dragging }"
          name="Create Post"
          placeholder="What's hopepening?!"
        />

        <Progress v-if="imageUpload?.loading" :percent="Math.min(imageUpload.progress, 5)" />

        <div class="images" v-if="images.length">
          <Image
            v-for="(image, idx) of images"
            :key="image.uuid"
            :image="image"
          >
            <button @click="() => deleteFile(idx)"><Icon type="x" :stroke-width="3" /></button>
          </Image>
        </div>

        <div class="bottom-bar">
          <MultiImageUpload
            ref="imageUpload"
            key="4"
            name="Images"
            :images="images"
            :max-files="4"
            @stored="imagesChanged"
          />

          <Button>
            <Icon type="send" />
            <span>Post</span>
          </Button>
        </div>
      </template>
      <template v-else>
        <div class="sign-in">
          <h1>Sign in</h1>
          <p>To participate, please sign in with your <span>Ethereum Account</span>.</p>
          <Connect>
            <span>Connect Ethereum Account</span>
          </Connect>
        </div>
      </template>
    </Authenticated>
  </form>
</template>

<script setup>
import { useAccount } from '~/helpers/use-wagmi'

const text = ref('')
const imageUpload = ref()
const images = ref([])
const dragging = ref(false)

const drop = ($event) => {
  $event.preventDefault()
  $event.stopPropagation()

  dragging.value = false

  const files = $event.dataTransfer.files
  if (files.length) imageUpload.value.addFiles(files)
}

const imagesChanged = $event => {
  images.value = $event
}

const deleteFile = (idx) => {
  images.value.splice(idx, 1)
}

const { profile } = useAccount()
const config = useRuntimeConfig()
const emit = defineEmits(['created'])
const saving = ref(false)
const submitPost = async () => {
  saving.value = true
  try {
    const newPost = await $fetch(`${config.public.opepenApi}/posts`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        body: text.value,
        image_ids: images.value.map(i => i.uuid),
      })
    })

    text.value = ''
    images.value = []

    emit('created', {
      account: profile.value,
      ...newPost
    })
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

  /* position: sticky;
  z-index: 1;
  top: var(--navbar-height);
  background-color: var(--semi);
  backdrop-filter: var(--blur); */
  position: relative;
  border-bottom: var(--border);

  .avatar {
    position: absolute;
    width: var(--size-7);
    height: var(--size-7);
    left: var(--spacer);
    top: var(--spacer);
    z-index: 2;
  }

  .input,
  :deep(.input textarea) {
    z-index: 1;
  }
  :deep(.input textarea) {
    min-height: 9rem;
    border: var(--border);
    border-color: transparent;
    border-radius: 0;
    background: transparent;
    padding-left: var(--spacer-left);
    padding-top: var(--size-5);
    padding-bottom: 8.75rem;

    &:--highlight {
      background: var(--gray-z-1);
    }
  }
  .input {
    &.dragging {
      :deep(textarea) {
        border-color: var(--color);
        background: var(--gray-z-1);
      }
    }
  }

  .images {
    position: absolute;
    pointer-events: none;
    bottom: var(--bottom-bar-height);
    height: 8.75rem;
    width: 100%;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(4, 6.5rem);
    gap: var(--spacer);
    padding: var(--spacer) var(--spacer) var(--spacer) var(--spacer-left);
    overflow-x: auto;
    -webkit-overflow-scrolling: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }

    .image {
      pointer-events: all;
      border-radius: 0;
      position: relative;

      button {
        position: absolute;
        top: var(--size-2);
        right: var(--size-2);
      }
    }
  }

  .bottom-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--bottom-bar-height);
    padding: 0 var(--size-1) 0 0;
    border-top: var(--border);

    .multi-image-upload {
      z-index: 1;
      border: none;
      border-radius: 0;
      background: transparent;
      padding: 0;
      height: var(--bottom-bar-height);
      width: var(--bottom-bar-height);
      bottom: 0;

      :deep(.label),
      :deep(.clear),
      :deep(.grid),
      :deep(.progress) {
        display: none;
        margin: 0;
      }
      :deep(.upload) {
        margin: 0;
        padding: var(--size-0);
        height: var(--bottom-bar-height);
        border-radius: 0;
        border: 0;
        border-right: var(--border);
        cursor: pointer;

        .icon {
          cursor: pointer;
        }

        span {
          display: none;
        }
      }

      :deep(.grid) {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }
  }

}

.sign-in {
  padding: var(--spacer) 0;
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--size-2);

  h1 {
    text-align: center;
    font-size: var(--font-lg);
    margin: 0;
  }

  p {
    font-size: var(--font-base);
    font-family: var(--font-family-body);
    text-transform: none;
    font-weight: 500;
    text-align: center;
    margin: 0 0 var(--spacer);
    color: var(--gray-z-6);

    span {
      font-weight: 500;
      white-space: nowrap;
    }
  }
}
</style>
