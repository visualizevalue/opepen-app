<template>
  <div v-if="curatedTweets.length" class="feed">
    <Card
      v-for="tweet in curatedTweets"
      :key="tweet.id"
      class="static tweet-card"
    >
      <a 
        :href="getAuthorUrl(tweet)" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="tweet-header"
      >
        <img
          v-if="tweet.profile_image_url"
          :src="tweet.profile_image_url"
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

      <p class="tweet-text">{{ stripUrls(tweet.text) }}</p>

      <img
        v-if="tweet.media_url"
        :src="tweet.media_url"
        alt="Tweet Media"
        class="tweet-media"
      />

      <div class="tweet-footer">
        <span class="date">{{ formatDate(tweet.tweet_created_at) }}</span>

        <div class="tweet-actions">
          <Button
            :to="getTweetUrl(tweet)"
            target="_blank"
            rel="noopener noreferrer"
          >
          View on X
          </Button>
          <Button v-if="isAdmin" @click="deleteTweet(tweet.id)">
            Delete
          </Button>
        </div>
      </div>

    </Card>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  sort: String,
})

const config = useRuntimeConfig()

const url = computed(() => {
  if (props.sort) {
    return `${config.public.opepenApi}/curated-tweets?sort=${props.sort}`
  }
  return `${config.public.opepenApi}/curated-tweets`
})

const curatedTweets = ref<any[]>([])

const { data: fetchedData, error: fetchError } = await useFetch(url)

if (fetchError.value) {
  console.error('Failed to fetch curated tweets:', fetchError.value)
} else if (fetchedData.value && Array.isArray(fetchedData.value)) {
  curatedTweets.value = fetchedData.value
}

function getTweetUrl(tweet: any) {
  if (tweet.username && tweet.tweet_id) {
    return `https://twitter.com/${tweet.username}/status/${tweet.tweet_id}`
  }
  return '#'
}

function getAuthorUrl(tweet: any) {
  if (tweet.username) {
    return `https://x.com/${tweet.username}`
  }
  return '#'
}

// stripping links from tweet text
function stripUrls(text: string) {
  if (!text) return ''
  return text.replace(/https?:\/\/\S+/g, '')
}

async function deleteTweet(id: number) {
  console.log('Deleting tweet:', id)
  
  const { data: deleteResponse, error, execute } = await useApiDelete(`/curated-tweets/${id}`)
  await execute()

  if (error.value) {
    console.error('Error deleting tweet:', error.value)
    return
  }
  console.log('Delete response:', deleteResponse.value)

  curatedTweets.value = curatedTweets.value.filter((t) => t.id !== id)
}
</script>

<style scoped>
.feed {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-lg);
}

.tweet-card {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: var(--spacer);
  width: 100%;
}

.tweet-header {
  display: flex;
  gap: var(--spacer);
  align-items: center;
}

.author {
  font-size: var(--font-base);
  display: flex;
  flex-direction: column;
  gap: var(--size-1);
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

  .icon {
    width: var(--size-5);
  }
}

.author-handle {
  font-size: var(--font-sm);
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
  font-size: var(--font-sm);
}

.tweet-text {
  white-space: pre-line;
  line-height: 1.4;
}

.tweet-media {
  max-width: 100%;
  display: block;
  border-radius: var(--border-radius);
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
