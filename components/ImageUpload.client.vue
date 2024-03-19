<template>
  <div
    class="image-upload"
    :class="{ dragging, loading }"
    @dragover="dragging = true"
    @dragleave="dragging = false"
  >
    <img v-if="preview && !image" :src="previewURL" :alt="preview.name" :title="preview.name">
    <Loading v-if="loading" txt="" />
    <Image v-else-if="image" :image="image" />
    <label>
      <Icon type="image" :stroke-width="2" />
      <span>{{ name }}</span>
      <input
        v-if="! disabled"
        type="file"
        name="image"
        accept="image/png, image/jpeg, image/gif, image/svg+xml, image/webp, video/mp4, video/webm"
        @change.prevent="addFile"
      >
    </label>
    <button v-if="image && ! disabled" @click="reset" class="reset"><Icon type="x" :stroke-width="3" /></button>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const props = defineProps({
  name: String,
  image: Object,
  disabled: Boolean,
})
const emit = defineEmits(['stored', 'reset'])

const loading = ref(false)
const dragging = ref(false)
const preview = ref(null)
const previewURL = computed(() => URL.createObjectURL(preview.value))
const image = ref(props.image)

const store = async () => {
  if (! preview.value) return

  const formData = new FormData()
  formData.append('image', preview.value)

  try {
    loading.value = true

    image.value = await $fetch(`${config.public.opepenApi}/opepen/images`, {
      credentials: 'include',
      method: 'POST',
      body: formData,
    })

    emit('stored', image.value)
  } catch (e) {
    console.error(e)
    let message = e.message || `Something went wrong...`

    if (Array.isArray(e.data) && e.data[0]?.message) {
      message = e.data[0]?.message
    }

    alert(message)
  }

  preview.value = null
  loading.value = false
}

const addFile = (event) => {
  const [file] = event.target.files
  preview.value = file

  store()
}

const reset = () => {
  image.value = null
  emit('reset')
}
</script>

<style lang="postcss" scoped>
  .image-upload {
    container-type: inline-size;
    position: relative;
    min-height: 5rem;
    width: 100%;
    height: 100%;
    background: var(--gray-z-2);
    border: var(--border);
    border-radius: var(--size-5);
    border-top-left-radius: var(--size-1);
    transition: all var(--speed);
    overflow: hidden;
    cursor: pointer;

    label {
      display: block;
      width: 100cqw;
      height: 100cqw;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--size-2);
      transition: all var(--speed);

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
    }

    .loader,
    .image,
    img {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
    }

    img {
      transition: all var(--speed);
      width: 100%;
      aspect-ratio: initial;
      opacity: 0.5;
    }

    .reset {
      position: absolute;
      top: var(--size-3);
      right: var(--size-3);
      width: var(--size-5);
      height: var(--size-5);
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
</style>
