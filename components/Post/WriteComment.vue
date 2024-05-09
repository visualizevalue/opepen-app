<template>
  <form @submit.stop.prevent="sendComment" ref="form">
    <Input v-model="text" />
    <button title="Save Comment" :disabled="saving"><Icon type="send" /></button>
  </form>
</template>

<script setup>
const config = useRuntimeConfig()
const { parent } = defineProps({
  parent: Object,
})
const emit = defineEmits(['created'])

const form = ref(null)
const text = ref('')
const saving = ref(false)

const sendComment = async () => {
  if (saving.value) return

  saving.value = true

  try {
    const comment = await $fetch(`${config.public.opepenApi}/posts`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        body: text.value,
        parent_post_id: parent.id,
      })
    })

    text.value = ''
    emit('created', comment)
  } catch (e) {
    // ...
  }

  saving.value = false
}

onMounted(() => {
  form.value.querySelector('textarea').focus()
})
</script>

<style lang="postcss" scoped>
form {
  position: relative;
  margin: var(--size-2) 0;
  font-size: var(--font-sm);

  .input :deep(textarea) {
    padding-right: var(--size-8);
  }

  button {
    padding: var(--size-4);
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
