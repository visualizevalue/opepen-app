<template>
  <div
    class="multi-image-upload"
  >
    <p class="label">{{ name }}</p>
    <Button type="button" @click="reset" class="small clear"><Icon type="trash" /><span>Clear</span></Button>

    <label
      class="upload"
      :class="{ dragging, loading }"
      @dragover="dragging = true"
      @dragleave="dragging = false"
      v-if="! disabled"
    >
      <Icon type="image" :stroke-width="2" />
      <span>Drag / Click here to upload</span>
      <input
        type="file"
        name="image"
        accept="image/png, image/jpeg, image/gif, image/svg+xml, image/webp, video/mp4, video/webm"
        @change.prevent="addFilesEvent"
        :disabled="loading"
        multiple
      >
    </label>

    <Progress v-if="loading" :percent="progress" />

    <div class="grid">
      <Image
        v-for="(image, idx) of images"
        :key="image.uuid"
        :image="image"
      >
        <button @click="() => deleteFile(idx)"><Icon type="x" :stroke-width="3" /></button>
      </Image>

      <Loading v-if="loading" txt="" />
    </div>

    <!-- <img v-if="preview && !image" :src="previewURL" :alt="preview.name" :title="preview.name"> -->
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const props = defineProps({
  name: String,
  images: Array,
  maxFiles: Number,
  disabled: Boolean,
})
const emit = defineEmits(['stored', 'reset'])

const images = ref(props.images?.filter(i => !! i) || [])
const disabled = computed(() => props.disabled || (props.maxFiles && images.value.length >= props.maxFiles))
const loading = ref(false)
const dragging = ref(false)
const previews = ref([])
const errors = ref([])
const currentUpload = ref(0)
const progress = computed(() => {
  return (currentUpload.value) / (previews.value.length) * 100 + 1
})

const storeFiles = async () => {
  loading.value = true
  currentUpload.value = 0

  try {
    for (const preview of previews.value) {
      images.value.push(await storeFile(preview))
      currentUpload.value += 1
    }

    emit('stored', images.value)
  } catch (e) {
    console.error(e)
    let message = e.message || `Something went wrong...`

    if (Array.isArray(e.data) && e.data[0]?.message) {
      message = e.data[0]?.message
    }

    errors.push(message)
  }

  loading.value = false
}

const storeFile = async (obj) => {
  const formData = new FormData()
  formData.append('image', obj)

  return await $fetch(`${config.public.opepenApi}/opepen/images`, {
    credentials: 'include',
    method: 'POST',
    body: formData,
  })
}

const addFiles = files => {
  previews.value = Array.from(files)

  if (props.maxFiles) {
    previews.value = previews.value.slice(0, props.maxFiles)
  }

  storeFiles()
}
const addFilesEvent = (event) => addFiles(event.target.files)

const deleteFile = (idx) => {
  images.value.splice(idx, 1)
}

const reset = () => {
  images.value = []
  previews.value = []
}

defineExpose({
  addFiles,
  loading,
  progress,
})
</script>

<style lang="postcss" scoped>
  .multi-image-upload {
    position: relative;
    background: var(--gray-z-2);
    border: var(--border);
    border-radius: var(--size-5);
    border-top-left-radius: var(--size-1);
    overflow: hidden;
    padding: var(--size-4) var(--size-5);

    .clear {
      position: absolute;
      top: var(--size-3);
      right: var(--size-5);
    }

    p.label {
      margin: 0 0 var(--size-4);
    }

    .upload {
      position: relative;
      width: 100%;
      height: 7rem;
      border: var(--border);
      border-radius: var(--size-4);
      padding: var(--size-5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--size-2);
      transition: all var(--speed);
      margin: var(--size-4) 0;

      .vue-feather {
        width: var(--size-5);
        color: var(--gray-z-6);
      }

      span {
        font-size: var(--font-xs);
        color: var(--gray-z-7);
        text-align: center;
      }

      input {
        opacity: 0.00001;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }

      &.loading {
        img {
          opacity: 0.5;
        }

        label {
          opacity: 0;
        }
      }

      &.dragging,
      &:--highlight {
        background: var(--gray-z-3);
        border-color: var(--gray-z-5);
      }
    }

    .progress {
      margin: var(--size-5) 0;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(10, minmax(0, 1fr));
      gap: var(--size-4);
      display: relative;

      button {
        position: absolute;
        z-index: 100;
        top: var(--size-2);
        right: var(--size-2);
      }
    }

    .reset {
      position: absolute;
      top: var(--size-3);
      right: var(--size-3);
      width: var(--size-5);
      height: var(--size-5);
    }
  }
</style>
