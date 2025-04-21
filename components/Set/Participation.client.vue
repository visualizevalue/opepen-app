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

    <section v-if="props.submission.participationImages?.length" class="participations">
      <SectionTitle>Contributions</SectionTitle>

      <div class="participation-grid">
        <div
          v-for="(participation, index) in props.submission.participationImages"
          :key="index"
          class="participation-item"
          @click="openImage(participation)"
        >
          <div class="participation-image">
            <Image :image="participation.image" />

            <button
              v-if="isAdmin || isSetCreator"
              class="delete-button"
              @click.stop="deleteParticipation(participation)"
            >
              <Icon type="x" :stroke-width="3" />
            </button>

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
const deleting = ref(null)
const errorMessage = ref(null)
const imageModalOpen = ref(false)
const selectedImage = ref(null)
const selectedCreatorName = ref('')
const selectedImageName = `${props.submission.name} Contribution`

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

const deleteParticipation = async (participation) => {
  if (!isAdmin.value && !isSetCreator.value) return

  try {
    deleting.value = participation.id

    await $fetch(`${config.public.opepenApi}/participation/${participation.id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    emit('refresh')
  } catch (error) {
    console.error('Failed to delete participation:', error)
    alert('Failed to delete participation. Please try again.')
  } finally {
    deleting.value = null
  }
}
</script>

<style scoped>
.submit-participation,
.participations {
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

  .delete-button {
    position: absolute;
    z-index: 100;
    width: var(--size-5);
    height: var(--size-5);
    padding: var(--size-1);
    top: var(--spacer-sm);
    right: var(--spacer-sm);
    background: var(--semi-shade);
    color: var(--color);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color var(--speed);

    &:hover {
      background: var(--gray-z-3);
    }

    .icon {
      display: block;
      width: var(--size-3);
    }
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
</style>
