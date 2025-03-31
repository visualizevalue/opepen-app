<template>
  <Modal v-model:open="open">
    <h1>{{ title }}</h1>
    <p v-if="text">{{ text }}</p>

    <Actions>
      <Button @click="open = false">Cancel</Button>
      <Button @click="execute" :disabled="executing">
        <Icon v-if="icon" :type="executing ? 'loader' : icon" />
        <span>{{ action }}</span>
      </Button>
    </Actions>
  </Modal>
</template>

<script setup lang="ts">
interface Props {
  title: string
  text: string
  action: string
  icon?: string
  callback(): Promise<void>
}

const { title, text, action = 'Ok', callback } = defineProps<Props>()

const open = defineModel('open', { required: true })

const executing = ref(false)
const execute = async () => {
  executing.value = true
  await callback()
  executing.value = false
  open.value = false
}
</script>
