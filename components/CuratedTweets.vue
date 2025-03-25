<template>
  <div v-if="curatedTweets.length" class="feed">
    <TweetCard
      v-for="tweet in curatedTweets"
      :key="tweet.id"
      :tweet="tweet"
      @deleted="removeTweet"
    />
  </div>
</template>

<script setup lang="ts">
const { sort } = defineProps<{ sort: String }>()

const config = useRuntimeConfig()

const url = computed(() => 
  sort
    ? `${config.public.opepenApi}/curated-tweets?sort=${sort}`
    : `${config.public.opepenApi}/curated-tweets`
)

const curatedTweets = ref<any[]>([])

const { data, error } = await useFetch(url)

if (error.value) {
  console.error('Failed to fetch curated tweets:', error.value)
} else if (data.value && Array.isArray(data.value)) {
  curatedTweets.value = data.value
}

function removeTweet(deletedId: number) {
  curatedTweets.value = curatedTweets.value.filter(t => t.id !== deletedId)
}
</script>

<style scoped>
.feed {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-lg);
}
</style>