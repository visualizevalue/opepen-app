<template>
  <div>
    <section class="submit-participation">
      <SectionTitle>Participate in this set</SectionTitle>

      <p class="description">
        The creator has opened this set for co-creation. You can contribute your own renditions
        for consideration.
      </p>

      <div class="upload-section">
        <MultiImageUpload
          name="Contribute"
          :key="refreshKey"
          :images="participationImages"
          :disabled="disabled"
          :max-files="10"
          @stored="
            ($event) => {
              participationImages = $event
            }
          "
        />

        <div class="submission-actions" v-if="participationImages?.length">
          <Button @click="store" :disabled="disabled" :loading="saving">
            <span>Submit Contribution</span>
          </Button>
        </div>
      </div>
    </section>

    <section v-if="props.submission.contributions_count" class="contributions">
      <div class="contributions-header">
        <SectionTitle>
          {{ props.submission.contributions_count }}
          {{ props.submission.contributions_count > 1 ? 'Contributions' : 'Contribution' }}
          by
          {{ props.submission.contributors_count }}
          {{ props.submission.contributors_count > 1 ? 'Artists' : 'Artist' }}
        </SectionTitle>
        <div class="filter-buttons" v-if="userContributions.length">
          <Button
            :class="['filter-button', { active: showUserContributions }]"
            @click="showUserContributions = true"
          >
            Mine ({{ userContributions.length }})
          </Button>
          <Button
            :class="['filter-button', { active: !showUserContributions }]"
            @click="showUserContributions = false"
          >
            All
          </Button>
        </div>
      </div>

      <div class="participation-grid">
        <div
          v-for="participation in displayedParticipations"
          :key="participation.id"
          class="participation-item"
          @click="openImage(participation)"
        >
          <div
            class="participation-image"
            :style="{ aspectRatio: props.submission.aspect_ratio || '1' }"
          >
            <Image :image="participation.image" version="sm" />

            <div
              v-if="isSetCreator || isUserContribution(participation) || isAdmin"
              class="menu-container"
            >
              <SetParticipationMenu
                :participation="participation"
                :submission="props.submission"
                :is-set-creator="isSetCreator"
                :is-user-contribution="isUserContribution(participation)"
                @refresh="emit('refresh')"
                @click.stop
              />
            </div>

            <div class="creator-overlay">
              <div class="creator-info">
                <Avatar :account="participation.creator" :size="24" />
                <span class="creator-name">
                  {{ participation.creator?.display || participation.creator?.address }}
                </span>
              </div>

              <CardLink :to="`/${participation.creator?.address}`" @click.stop>
                View {{ participation.creator?.display }}
              </CardLink>
            </div>
          </div>
        </div>
      </div>

      <ImageModal
        v-model:open="imageModalOpen"
        :image="selectedImage"
        :name="selectedImageName"
        :tagline="selectedCreatorName"
      />
    </section>
  </div>
</template>

<script setup>
const props = defineProps({
  submission: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['refresh'])
const config = useRuntimeConfig()
const isSetCreator = computed(
  () => currentAddress.value?.toLowerCase() === props.submission.creator?.toLowerCase(),
)
const refreshKey = ref(1)
const participationImages = ref([])
const saving = ref(false)
const errorMessage = ref(null)
const imageModalOpen = ref(false)
const selectedImage = ref(null)
const selectedCreatorName = ref('')
const selectedImageName = `${props.submission.name} Contribution`

const showUserContributions = ref(false)

const userContributions = computed(() => {
  if (!currentAddress.value || !props.submission.participationImages) return []

  return props.submission.participationImages.filter(
    (participation) =>
      participation.creator?.address?.toLowerCase() === currentAddress.value?.toLowerCase(),
  )
})
const isUserContribution = (participation) => {
  return participation.creator?.address?.toLowerCase() === currentAddress.value?.toLowerCase()
}

const displayedParticipations = computed(() => {
  if (showUserContributions.value) {
    return userContributions.value
  }
  return props.submission.participationImages || []
})

const openImage = (participation) => {
  selectedImage.value = participation.image
  selectedCreatorName.value = `By ${participation.creator?.display || participation.creator?.address}`
  imageModalOpen.value = true
}

const { session, signIn } = useSignIn()

const store = async () => {
  if (!participationImages.value.length) return
  errorMessage.value = null

  try {
    if (!session.value) await signIn()
    if (!session.value) return

    saving.value = true

    await $fetch(`${config.public.opepenApi}/participation`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        submissionId: props.submission.uuid,
        imageIds: participationImages.value.map((i) => i.uuid),
      }),
    })

    participationImages.value = []
    refreshKey.value++
    emit('refresh')
  } catch (error) {
    console.error('Failed to submit participation:', error)
    errorMessage.value = 'Failed to submit. Please try again.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.submit-participation,
.contributions {
  display: flex;
  flex-direction: column;
  gap: var(--spacer);
  border: var(--border);
  border-radius: var(--border-radius);
  padding: var(--spacer);
  background-color: var(--gray-z-1);
  margin-bottom: var(--spacer);
}

.description {
  color: var(--muted);
  font-size: var(--font-sm);
  margin-bottom: var(--spacer-sm);
}

.submission-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-sm);
  margin-top: var(--spacer);
}

.contributions-header {
  @mixin ui-font;
  display: flex;
  flex-wrap: wrap;
  color: var(--gray-z-6);
  font-size: var(--ui-font-size);
  text-transform: var(--ui-text-transform);
  letter-spacing: var(--ui-letter-spacing);
  font-weight: var(--ui-font-weight);

  @media (--md) {
    flex-direction: row;
    justify-content: space-between;
  }

  .contributor-count {
    margin-top: var(--spacer-sm);

    @media (--md) {
      margin-top: 0;
    }
  }
}

.participation-grid {
  display: grid;
  gap: var(--spacer);
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (--md) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.participation-item {
  transition: transform var(--speed);
  cursor: pointer;

  &:--highlight {
    transform: translateY(-2px);
  }
}

.participation-image {
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius);
  aspect-ratio: 1;
  border: var(--border);

  :deep(.image) {
    height: 100%;

    img {
      transition: transform var(--speed);
    }
  }

  &:--highlight :deep(img) {
    transform: scale(1.05);
  }

  .menu-container {
    position: absolute;
    top: var(--spacer-sm);
    right: var(--spacer-sm);
  }
}

.creator-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--spacer-sm);
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  opacity: 0;
  transition: opacity var(--speed);

  .creator-info {
    display: flex;
    align-items: center;
    gap: var(--spacer-sm);
    flex: 1;
    min-width: 0;

    :deep(.avatar) {
      width: var(--size-6);
      height: var(--size-6);
      flex-shrink: 0;
    }

    .creator-name {
      @mixin ui-font;
      color: var(--white);
      font-size: var(--font-xs);
    }
  }

  .creator-actions {
    display: flex;
    align-items: center;
    gap: var(--spacer-sm);
  }

  .participation-image:--highlight & {
    opacity: 1;
  }
}

:deep(.multi-image-upload > label) {
  @mixin ui-font;
  color: var(--muted) !important;
  font-size: var(--ui-font-size);
}

.filter-buttons {
  display: flex;
  gap: var(--size-1);
  margin-top: var(--spacer);

  @media (--md) {
    margin-top: 0;
  }

  .filter-button {
    @mixin ui-font;
    font-size: var(--font-xs);
    font-family: var(--ui-font-family);
    background: var(--gray-z-2);
    border-radius: var(--border-radius);
    padding: var(--size-1) var(--size-2);
    cursor: pointer;
  }
}
</style>
