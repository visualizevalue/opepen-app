<template>
  <div class="submission-inline">
    <div class="inline-header">
      <SetSubmissionProgress
        :current-step="currentExpandedSection"
        :total-steps="totalSections"
        :completion-data="completionMetrics"
        :show-missing-fields="true"
      />

      <Button
        v-if="!completionMetrics.isComplete"
        @click="$emit('switch-to-wizard')"
        class="secondary small"
      >
        <Icon type="help-circle" />
        <span>Need Help? Try Guided Mode</span>
      </Button>
    </div>

    <div class="form-sections">
      <CollapsibleSection
        v-model:open="sections.editionType.open"
        :title="sections.editionType.title"
        :status="sections.editionType.status"
        :icon="sections.editionType.icon"
        @click="currentExpandedSection = 1"
      >
        <FormSectionEditionType
          v-model="formData.edition_type"
          :disabled="disabled"
        >
          <template #help>
            <p class="section-help">
              Choose between Print (6 images) or Dynamic (80+ images with variants).
            </p>
          </template>
        </FormSectionEditionType>
      </CollapsibleSection>

      <CollapsibleSection
        v-model:open="sections.identity.open"
        :title="sections.identity.title"
        :status="sections.identity.status"
        :icon="sections.identity.icon"
        @click="currentExpandedSection = 2"
      >
        <FormSectionIdentity
          :name="formData.name"
          @update:name="updateField('name', $event)"
          :description="formData.description"
          @update:description="updateField('description', $event)"
          :disabled="disabled"
          :show-char-count="true"
        />
      </CollapsibleSection>

      <CollapsibleSection
        v-model:open="sections.images.open"
        :title="sections.images.title"
        :status="sections.images.status"
        :icon="sections.images.icon"
        @click="currentExpandedSection = 3"
      >
        <Alert v-if="!hasPreviewImages">
          <p>Base your art on the opepen schematics...</p>
          <Actions>
            <Button
              to="https://raw.githubusercontent.com/visualizevalue/opepen-api/refs/heads/main/app/Services/OpepenSVG/opepen-schematics.svg"
              target="_blank"
              class="small"
            >
              <Icon type="external-link" />
              <span>Opepen Schematics</span>
            </Button>
          </Actions>
        </Alert>

        <FormSectionImages
          :images="{
            image1: formData.edition1Image,
            image4: formData.edition4Image,
            image5: formData.edition5Image,
            image10: formData.edition10Image,
            image20: formData.edition20Image,
            image40: formData.edition40Image,
          }"
          @update:images="updateImages"
          :disabled="disabled"
        />
      </CollapsibleSection>

      <CollapsibleSection
        v-model:open="sections.names.open"
        :title="sections.names.title"
        :status="sections.names.status"
        :icon="sections.names.icon"
        @click="currentExpandedSection = 4"
      >
        <FormSectionNames
          :names="{
            name1: formData.edition1Name,
            name4: formData.edition4Name,
            name5: formData.edition5Name,
            name10: formData.edition10Name,
            name20: formData.edition20Name,
            name40: formData.edition40Name,
          }"
          @update:names="updateNames"
          :images="{
            image1: formData.edition1Image,
            image4: formData.edition4Image,
            image5: formData.edition5Image,
            image10: formData.edition10Image,
            image20: formData.edition20Image,
            image40: formData.edition40Image,
          }"
          :disabled="disabled"
        />
      </CollapsibleSection>

      <CollapsibleSection
        v-if="isDynamic"
        v-model:open="sections.dynamicImages.open"
        :title="sections.dynamicImages.title"
        :status="sections.dynamicImages.status"
        :icon="sections.dynamicImages.icon"
        @click="currentExpandedSection = 5"
      >
        <DynamicImagesForm
          :set-submission-id="formData.uuid"
          :dynamic-set-images="formData.dynamicSetImages"
          :disabled="disabled"
        />
      </CollapsibleSection>

      <CollapsibleSection
        v-model:open="sections.artist.open"
        :title="sections.artist.title"
        :status="sections.artist.status"
        :icon="sections.artist.icon"
        @click="currentExpandedSection = isDynamic ? 6 : 5"
      >
        <FormSectionArtist
          :artist="formData.artist"
          @update:artist="updateField('artist', $event)"
          :creator="formData.creator"
          @update:creator="updateField('creator', $event)"
          :co-creators="formData.coCreators || []"
          @update:coCreators="updateField('coCreators', $event)"
          :creator-placeholder="formData.creator"
          :disabled="disabled"
          :show-creator-field="isAdmin"
        />
      </CollapsibleSection>

      <CollapsibleSection
        v-model:open="sections.advanced.open"
        :title="sections.advanced.title"
        :status="sections.advanced.status"
        :icon="sections.advanced.icon"
        @click="currentExpandedSection = isDynamic ? 7 : 6"
      >
        <Card class="static" :disabled="disabled" v-if="!formData.published_at">
          <label class="type">
            <span>Open For Participation</span>
            <select
              v-model="openForParticipation"
              @change="updateField('open_for_participation', openForParticipation)"
              class="select"
              :disabled="disabled"
            >
              <option :value="false" default>Closed</option>
              <option :value="true">Open</option>
            </select>
            <p class="help-text" v-if="openForParticipation">
              This allows other creators to contribute ideas to your set.
            </p>
          </label>
        </Card>

        <Card class="static">
          <RichContentLinksForm
            title="Deep Dive Links"
            :loaded-links="formData.richContentLinks"
            :new-link-data="{ address: formData.creator, set_submission_id: formData.id }"
          />
        </Card>
      </CollapsibleSection>
    </div>

    <SetSubmissionHelp v-model:open="helpDrawerOpen" />
    <button class="help-fab" @click="helpDrawerOpen = true" aria-label="Open help">
      <Icon type="help-circle" />
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:data', 'switch-to-wizard'])

const formData = computed(() => props.data)
const isDynamic = computed(() => formData.value.edition_type === 'DYNAMIC')

const openForParticipation = ref(!!props.data.open_for_participation)

// Setup walkthrough composable for completion tracking
const submissionData = toRef(props, 'data')
const { completionMetrics, hasAllImages, hasAllEditionNames, hasDynamicImages } =
  useSubmissionWalkthrough(submissionData)

const hasPreviewImages = computed(() => hasAllImages(formData.value))

const currentExpandedSection = ref(1)
const totalSections = computed(() => isDynamic.value ? 7 : 6)

const helpDrawerOpen = ref(false)

// Section states
const sections = reactive({
  editionType: {
    open: false,
    title: 'Edition Type',
    icon: 'layers',
    get status() {
      return formData.value.edition_type ? 'complete' : 'incomplete'
    },
  },
  identity: {
    open: false,
    title: 'Set Information',
    icon: 'file-text',
    get status() {
      return formData.value.name?.length >= 3 && formData.value.description?.length >= 10
        ? 'complete'
        : 'incomplete'
    },
  },
  images: {
    open: false,
    title: 'Base Images',
    icon: 'image',
    get status() {
      return hasAllImages(formData.value) ? 'complete' : 'incomplete'
    },
  },
  names: {
    open: false,
    title: 'Edition Names',
    icon: 'edit-3',
    get status() {
      return hasAllEditionNames(formData.value) ? 'complete' : 'incomplete'
    },
  },
  dynamicImages: {
    open: false,
    title: 'Dynamic Variants',
    icon: 'grid',
    get status() {
      return hasDynamicImages(formData.value) ? 'complete' : 'incomplete'
    },
  },
  artist: {
    open: false,
    title: 'Artist Information',
    icon: 'user',
    get status() {
      return formData.value.artist ? 'complete' : 'incomplete'
    },
  },
  advanced: {
    open: false,
    title: 'Advanced Options',
    icon: 'settings',
    status: 'optional',
  },
})

// Auto-expand first incomplete section on mount
onMounted(() => {
  const firstIncomplete = Object.entries(sections).find(
    ([key, section]) => section.status === 'incomplete'
  )
  if (firstIncomplete) {
    firstIncomplete[1].open = true
  } else {
    sections.editionType.open = true
  }
})

// Update handlers
const updateField = (field, value) => {
  emit('update:data', {
    ...formData.value,
    [field]: value,
  })
}

const updateImages = (images) => {
  emit('update:data', {
    ...formData.value,
    edition1Image: images.image1,
    edition4Image: images.image4,
    edition5Image: images.image5,
    edition10Image: images.image10,
    edition20Image: images.image20,
    edition40Image: images.image40,
  })
}

const updateNames = (names) => {
  emit('update:data', {
    ...formData.value,
    edition1Name: names.name1,
    edition4Name: names.name4,
    edition5Name: names.name5,
    edition10Name: names.name10,
    edition20Name: names.name20,
    edition40Name: names.name40,
  })
}
</script>

<style scoped>
.submission-inline {
  display: flex;
  flex-direction: column;
  gap: var(--spacer);
  position: relative;
}

.inline-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacer);
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--background);
  padding: var(--spacer) 0;
  border-bottom: var(--border);
}

.form-sections {
  display: flex;
  flex-direction: column;
  gap: var(--spacer);
}

.section-help {
  @mixin ui-font;
  font-size: var(--font-sm);
  color: var(--muted);
  margin: var(--spacer-sm) 0 0 0;
}

.help-fab {
  @mixin button-reset;
  position: fixed;
  bottom: var(--spacer-lg);
  right: var(--spacer-lg);
  width: var(--size-10);
  height: var(--size-10);
  border-radius: 50%;
  background: var(--success);
  color: white;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--speed);
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-xl);
  }

  :deep(svg) {
    width: var(--size-6);
    height: var(--size-6);
  }
}

.type {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-sm);

  span {
    @mixin ui-font;
    color: var(--gray-z-5);
  }

  .help-text {
    @mixin ui-font;
    color: var(--muted);
    font-size: var(--font-xs);
    margin-top: var(--spacer-xs);
  }
}
</style>
