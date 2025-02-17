<template>
  <div class="dynamic-set-images">
    <p class="label">Dynamic Images <template v-if="lastSaved">(last saved {{ lastSavedAt }})</template></p>

    <MultiImageUpload
      key="4"
      name="Edition of Four"
      :images="edition4Images"
      :disabled="disabled"
      :max-files="4"
      @stored="$event => {
        edition4Images = $event;
        store(4, edition4Images)
      }"
    />

    <MultiImageUpload
      key="5"
      name="Edition of Five"
      :images="edition5Images"
      :disabled="disabled"
      :max-files="5"
      @stored="$event => {
        edition5Images = $event;
        store(5, edition5Images)
      }"
    />

    <MultiImageUpload
      key="10"
      name="Edition of Ten"
      :images="edition10Images"
      :disabled="disabled"
      :max-files="10"
      @stored="$event => {
        edition10Images = $event;
        store(10, edition10Images)
      }"
    />

    <MultiImageUpload
      key="20"
      name="Edition of Twenty"
      :images="edition20Images"
      :disabled="disabled"
      :max-files="20"
      @stored="$event => {
        edition20Images = $event;
        store(20, edition20Images)
      }"
    />

    <MultiImageUpload
      key="40"
      name="Edition of Forty"
      :images="edition40Images"
      :disabled="disabled"
      :max-files="40"
      @stored="$event => {
        edition40Images = $event;
        store(40, edition40Images)
      }"
    />

  </div>
</template>

<script setup>
import { DateTime } from 'luxon'
import { formatTime } from '~/helpers/dates'
import { useSignIn } from '~/helpers/siwe'

const config = useRuntimeConfig()

const props = defineProps({
  setSubmissionId: String,
  dynamicSetImages: Object,
  disabled: Boolean,
})
const emit = defineEmits(['updated'])

const { session, signIn } = useSignIn()

// const image1_1 = ref(props.dynamicSetImages?.image1_1)
const edition4Images = ref([
  props.dynamicSetImages?.image4_1,
  props.dynamicSetImages?.image4_2,
  props.dynamicSetImages?.image4_3,
  props.dynamicSetImages?.image4_4,
])

const edition5Images = ref([
  props.dynamicSetImages?.image5_1,
  props.dynamicSetImages?.image5_2,
  props.dynamicSetImages?.image5_3,
  props.dynamicSetImages?.image5_4,
  props.dynamicSetImages?.image5_5,
])

const edition10Images = ref([
  props.dynamicSetImages?.image10_1,
  props.dynamicSetImages?.image10_2,
  props.dynamicSetImages?.image10_3,
  props.dynamicSetImages?.image10_4,
  props.dynamicSetImages?.image10_5,
  props.dynamicSetImages?.image10_6,
  props.dynamicSetImages?.image10_7,
  props.dynamicSetImages?.image10_8,
  props.dynamicSetImages?.image10_9,
  props.dynamicSetImages?.image10_10,
])

const edition20Images = ref([
  props.dynamicSetImages?.image20_1,
  props.dynamicSetImages?.image20_2,
  props.dynamicSetImages?.image20_3,
  props.dynamicSetImages?.image20_4,
  props.dynamicSetImages?.image20_5,
  props.dynamicSetImages?.image20_6,
  props.dynamicSetImages?.image20_7,
  props.dynamicSetImages?.image20_8,
  props.dynamicSetImages?.image20_9,
  props.dynamicSetImages?.image20_10,
  props.dynamicSetImages?.image20_11,
  props.dynamicSetImages?.image20_12,
  props.dynamicSetImages?.image20_13,
  props.dynamicSetImages?.image20_14,
  props.dynamicSetImages?.image20_15,
  props.dynamicSetImages?.image20_16,
  props.dynamicSetImages?.image20_17,
  props.dynamicSetImages?.image20_18,
  props.dynamicSetImages?.image20_19,
  props.dynamicSetImages?.image20_20,
])

const edition40Images = ref([
  props.dynamicSetImages?.image40_1,
  props.dynamicSetImages?.image40_2,
  props.dynamicSetImages?.image40_3,
  props.dynamicSetImages?.image40_4,
  props.dynamicSetImages?.image40_5,
  props.dynamicSetImages?.image40_6,
  props.dynamicSetImages?.image40_7,
  props.dynamicSetImages?.image40_8,
  props.dynamicSetImages?.image40_9,
  props.dynamicSetImages?.image40_10,
  props.dynamicSetImages?.image40_11,
  props.dynamicSetImages?.image40_12,
  props.dynamicSetImages?.image40_13,
  props.dynamicSetImages?.image40_14,
  props.dynamicSetImages?.image40_15,
  props.dynamicSetImages?.image40_16,
  props.dynamicSetImages?.image40_17,
  props.dynamicSetImages?.image40_18,
  props.dynamicSetImages?.image40_19,
  props.dynamicSetImages?.image40_20,
  props.dynamicSetImages?.image40_21,
  props.dynamicSetImages?.image40_22,
  props.dynamicSetImages?.image40_23,
  props.dynamicSetImages?.image40_24,
  props.dynamicSetImages?.image40_25,
  props.dynamicSetImages?.image40_26,
  props.dynamicSetImages?.image40_27,
  props.dynamicSetImages?.image40_28,
  props.dynamicSetImages?.image40_29,
  props.dynamicSetImages?.image40_30,
  props.dynamicSetImages?.image40_31,
  props.dynamicSetImages?.image40_32,
  props.dynamicSetImages?.image40_33,
  props.dynamicSetImages?.image40_34,
  props.dynamicSetImages?.image40_35,
  props.dynamicSetImages?.image40_36,
  props.dynamicSetImages?.image40_37,
  props.dynamicSetImages?.image40_38,
  props.dynamicSetImages?.image40_39,
  props.dynamicSetImages?.image40_40,
])

const saving = ref(false)
const lastSaved = ref(null)
const lastSavedAt = computed(() => lastSaved.value ? formatTime(lastSaved.value) : '')

const store = async (edition, images) => {
  if (! session.value) await signIn()
  if (! session.value) return

  saving.value = true

  const submission = await $fetch(`${config.public.opepenApi}/set-submissions/${props.setSubmissionId}/dynamic-images`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
      images: images.map((img, index) => ({ edition, index: index + 1, uuid: img.uuid }))
    })
  })

  saving.value = false
  lastSaved.value = DateTime.now()

  emit('updated', submission)
}
</script>

<style scoped>
.dynamic-set-images {

  .label {
    margin-bottom: var(--size-3);
  }

  .multi-image-upload {
    margin-bottom: var(--size-4);
  }
}
</style>
