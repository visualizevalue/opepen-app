<template>
  <div
    v-if="submission.open_for_participation === true"
    :class="{ 'participation-complete': !canEdit }"
    class="participation"
  >
    <section v-if="canEdit" class="submit-participation">
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
          {{ canEdit ? '' : 'Based on ' }}
          {{ props.submission.contributions_count }}
          {{ props.submission.contributions_count > 1 ? 'Contributions' : 'Contribution' }}
          by
          {{ props.submission.contributors_count }}
          {{ props.submission.contributors_count > 1 ? 'Artists' : 'Artist' }}
        </SectionTitle>
        <div class="controls">
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
          <div class="sort-buttons">
            <Button
              :class="['filter-button', { active: sortBy === 'recent' }]"
              @click="sortBy = 'recent'"
            >
              Recent
            </Button>
            <Button
              :class="['filter-button', { active: sortBy === 'likes' }]"
              @click="sortBy = 'likes'"
            >
              Most Liked
            </Button>
          </div>
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
                v-if="canEdit"
                :participation="participation"
                :submission="props.submission"
                :is-set-creator="isSetCreator"
                :is-user-contribution="isUserContribution(participation)"
                @refresh="emit('refresh')"
                @click.stop
              />
            </div>

            <div class="like-container" @click.stop>
              <button
                class="like-button"
                :class="{ liked: isLiked(participation.image.uuid) }"
                :disabled="likingImages.has(participation.image.uuid)"
                @click="toggleLike(participation)"
              >
                <Icon type="heart" />
                <span v-if="getLikeCount(participation.image) > 0" class="like-count">
                  {{ getLikeCount(participation.image) }}
                </span>
              </button>
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
const sortBy = ref('recent')

const canEdit = computed(() => !props.submission.published_at)

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
  let participations = showUserContributions.value
    ? userContributions.value
    : props.submission.participationImages || []

  if (sortBy.value === 'likes') {
    return [...participations].sort((a, b) => {
      const likesA = a.image?.points || 0
      const likesB = b.image?.points || 0
      return likesB - likesA
    })
  }

  return participations
})

const openImage = (participation) => {
  selectedImage.value = participation.image
  selectedCreatorName.value = `By ${participation.creator?.display || participation.creator?.address}`
  imageModalOpen.value = true
}

const { session, signIn } = useSignIn()

const likedImages = ref(new Set())
const likingImages = ref(new Set())

onMounted(() => {
  const stored = localStorage.getItem('liked-participation-images')
  if (stored) {
    try {
      likedImages.value = new Set(JSON.parse(stored))
    } catch (e) {
      console.error('Failed to load liked images', e)
    }
  }
})

const isLiked = (imageUuid) => {
  return likedImages.value.has(imageUuid)
}

const getLikeCount = (image) => {
  return image?.points || 0
}

const toggleLike = async (participation) => {
  const imageUuid = participation.image.uuid

  if (likingImages.value.has(imageUuid)) return

  try {
    if (!session.value) await signIn()
    if (!session.value) return

    likingImages.value.add(imageUuid)

    const wasLiked = likedImages.value.has(imageUuid)

    if (wasLiked) {
      likedImages.value.delete(imageUuid)
    } else {
      likedImages.value.add(imageUuid)
    }

    localStorage.setItem('liked-participation-images', JSON.stringify(Array.from(likedImages.value)))

    await $fetch(`${config.public.opepenApi}/votes`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        image: imageUuid,
        approve: !wasLiked,
      }),
    })

    emit('refresh')
  } catch (error) {
    console.error('Failed to toggle like:', error)
    if (likedImages.value.has(imageUuid)) {
      likedImages.value.delete(imageUuid)
    } else {
      likedImages.value.add(imageUuid)
    }
    localStorage.setItem('liked-participation-images', JSON.stringify(Array.from(likedImages.value)))
  } finally {
    likingImages.value.delete(imageUuid)
  }
}

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
.participation-complete .participation-grid {
  @media (--md) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
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

.like-container {
  position: absolute;
  top: var(--spacer-sm);
  right: var(--spacer-sm);

  .menu-container ~ & {
    top: calc(var(--spacer-sm) + var(--size-6) + var(--size-1));
  }
}

.like-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-1);
  background-color: var(--semi-shade);
  width: var(--size-6);
  height: var(--size-6);
  padding: var(--size-1);
  color: var(--gray-z-7);
  border-radius: 50%;
  border: none;
  transition: all var(--speed);
  cursor: pointer;

  .icon {
    width: var(--size-3);
    height: var(--size-3);
    flex-shrink: 0;

    :deep(svg) {
      transition: fill var(--speed);
    }
  }

  .like-count {
    @mixin ui-font;
    font-size: var(--font-sm);
    line-height: 1;
  }

  &:has(.like-count) {
    width: auto;
    padding: var(--size-1) var(--size-2);
    border-radius: calc(var(--size-6) / 2);
  }

  &:hover:not(:disabled) {
    background-color: var(--gray-z-3);
    color: var(--color);
  }

  &.liked {
    background-color: var(--gray-z-3);
    color: var(--color);

    :deep(svg) {
      fill: currentColor;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

.controls {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-sm);
  margin-top: var(--spacer);

  @media (--md) {
    flex-direction: row;
    margin-top: 0;
    gap: var(--spacer);
  }
}

.filter-buttons,
.sort-buttons {
  display: flex;
  gap: var(--size-1);

  .filter-button {
    @mixin ui-font;
    font-size: var(--font-xs);
    font-family: var(--ui-font-family);
    background: var(--gray-z-2);
    border-radius: var(--border-radius);
    padding: var(--size-1) var(--size-2);
    cursor: pointer;

    &.active {
      background: var(--gray-z-4);
      color: var(--color);
    }
  }
}
</style>
