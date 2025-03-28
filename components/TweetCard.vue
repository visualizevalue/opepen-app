<template>
    <Card class="static tweet-card">
      <a
        :href="authorUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="tweet-header"
      >
        <img
          v-if="tweet.profile_image_url"
          :src="avatarURL"
          alt="Profile"
          class="avatar"
        />

        <div class="author">
          <div class="author-name">
            <span>{{ tweet.name }}</span>
            <Icon type="check" style="color: #1d9bf0" />
          </div>
          <span class="author-handle" v-if="tweet.username">@{{ tweet.username }}</span>
        </div>
      </a>

      <p class="tweet-text">{{ strippedText }}</p>

      <div v-if="tweet.media_urls && tweet.media_urls.length" class="tweet-media">
        <div v-for="(media, index) in tweet.media_urls" :key="index" class="media-item">
          <template v-if="media.type === 'photo'">
            <img :src="media.url" alt="Tweet media" />
          </template>
          <template v-else-if="media.type === 'video'">
            <video muted autoplay loop controls playsinline class="video-media" :poster="media.url">
              <source :src="selectBestVariant(media.variants)" type="video/mp4" />
            </video>
          </template>
          <template v-else-if="media.type === 'animated_gif'">
            <video muted autoplay loop playsinline class="video-media">
              <source :src="selectBestVariant(media.variants)" type="video/mp4" />
            </video>
          </template>
          <template v-else>
            <img :src="media.url" alt="Tweet media" />
          </template>
        </div>
      </div>

      <div class="tweet-footer">
        <span class="date">{{ formatDate(tweet.tweet_created_at) }}</span>

        <div class="tweet-actions">
          <Button :to="tweetUrl" target="_blank" rel="noopener noreferrer">
            View on X
          </Button>
          <Button v-if="isAdmin" @click="deleteTweet">
            Delete
          </Button>
        </div>
      </div>
    </Card>
</template>

<script setup lang="ts">
const { tweet } = defineProps<{ tweet: any }>()

const emit = defineEmits(['deleted'])

const avatarURL = computed(() => {
  if (tweet.profile_image_url) {
    return tweet.profile_image_url.replace('_normal', '')
  }
  return tweet.profile_image_url
})

const tweetUrl = computed(() => tweet.username && tweet.tweet_id
  ? `https://twitter.com/${tweet.username}/status/${tweet.tweet_id}`
  : '#')

const authorUrl = computed(() => tweet.username
  ? `https://x.com/${tweet.username}`
  : '#')

const strippedText = computed(() =>
  tweet.text.replace(/https?:\/\/\S+/g, '')
)

const deleteUrl = computed(() => `/curated-tweets/${tweet.id}`)

const { execute } = await useApiDelete(deleteUrl, { immediate: false })

async function deleteTweet() {
  await execute()

  emit('deleted', tweet.id)
}

function selectBestVariant(variants: any[]): string {
  return variants?.sort((a, b) => (b.bit_rate || 0) - (a.bit_rate || 0))[0]?.url || ''
}
</script>

<style scoped>
.tweet-card {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: var(--spacer);
  width: 100%;
  max-width: 100cqw;
}

.tweet-header {
  display: flex;
  gap: var(--spacer-sm);
  align-items: center;
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-size);
  text-transform: uppercase;
}

.author {
  font-size: var(--font-base);
  display: flex;
  flex-direction: column;
  line-height: 1em;
  overflow: hidden;

  > * {
    white-space: nowrap;
  }

  > a {
    &:--highlight {
      color: var(--gray-z-8);
    }
  }
}

.author-name {
  display: flex;
  gap: var(--size-1);
  align-items: center;

  > span {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icon {
    width: var(--size-4);
    margin-top: -2px;
  }
}

.author-handle {
  color: var(--muted);
}

.avatar {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 50%;
}

.date {
  color: var(--muted);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-size);
  text-transform: uppercase;
}

.tweet-text {
  white-space: pre-line;
  line-height: 1.4;
}

.tweet-media {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacer-sm);
  border-radius: var(--border-radius);
  max-width: 100%;
}

.media-item {
  flex: 1 1 200px;
}

.video-media {
  max-width: 100%;
}

.tweet-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: var(--border);
  padding-top: var(--spacer);
}

.tweet-actions {
  display: flex;
  gap: var(--spacer-sm);
}
</style>
