<template>
  <div class="actions">
    <small class="muted" v-if="lastSaved">Last saved {{ lastSavedAt }}</small>
    <Button type="submit" :disabled="saving">
      <span v-if="saving">Saving...</span>
      <span v-else>Save</span>
    </Button>
  </div>
</template>

<script setup>
import { formatTime } from '~/helpers/dates'

const props = defineProps({
  saving: Boolean,
  lastSaved: Object,
})

const lastSavedAt = computed(() => props.lastSaved ? formatTime(props.lastSaved) : '')
</script>
