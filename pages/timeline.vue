<template>
  <PageFrameSm class="news">
    <header>
      <h1>
        <span>Timeline</span>
        <small>Notable Opepen Activity</small>
      </h1>
    </header>

    <hr>

    <section v-if="isAdmin">
      <div class="add-tweet">
        <input
          type="text"
          v-model="tweetInput"
          placeholder="Add a new tweet URL or Id"
        />

        <Button class="input-button" @click="addTweet">Add</Button>
      </div>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </section>

    <section class="tweets">
      <Button @click="toggleSort" class="sort-button">
        <Icon :type="arrowType" />
      </Button>
      <CuratedTweets
        :key="refreshKey"
        :sort="sort"
      />
    </section>
  </PageFrameSm>
</template>


<script setup>
const tweetInput = ref('')
const refreshKey = ref(Date.now())
const successMessage = ref('')
const errorMessage = ref('')

const sort = ref('-tweet_created_at')
const arrowType = ref('arrow-down')

useMetaData({
  title: `Timeline | Opepen`,
  description: `A historical timeline of notable opepen events.`,
})

function extractTweetId(url) {
  const regex = /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/[^\/]+\/status(?:es)?\/(\d+)/i
  const match = url.match(regex)
  return match ? match[1] : null
}

const body = computed(() => {
  const rawId = tweetInput.value.trim()
  if (!rawId) {
    return JSON.stringify({ ids: [] })
  }

  if (rawId.includes('twitter.com') || rawId.includes('x.com')) {
    const extractedId = extractTweetId(rawId)
    if (!extractedId) {
      return JSON.stringify({ ids: [] })
    }
    return JSON.stringify({ ids: [extractedId] })
  }

  return JSON.stringify({ ids: [rawId] })
})


const { error, execute } = await useApiPost('/curated-tweets', {
  body,
  watch: false,
  immediate: false,
})

async function addTweet() {
  successMessage.value = ''
  errorMessage.value = ''

  if (!tweetInput.value.trim()) return
  await execute()

  if (error.value) {
    errorMessage.value = 'Error adding tweet. Please try again.'
    return
  }

  successMessage.value = 'Tweet added successfully!'
  tweetInput.value = ''
  refreshKey.value = Date.now()
}

function toggleSort() {
  if (sort.value === '-tweet_created_at') {
    sort.value = 'tweet_created_at'
    arrowType.value = 'arrow-up'
  } else {
    sort.value = '-tweet_created_at'
    arrowType.value = 'arrow-down'
  }
  refreshKey.value = Date.now()
}
</script>

<style scoped>
.news {
  > header,
  > .intro {
    h1,
    h2,
    p {
      @mixin ui-font;
      font-size: var(--font-lg);
      line-height: 1em;

      small {
        font-size: 1em;
        color: var(--muted);
      }
    }
  }

  > header h1 {
    display: grid;
    gap: var(--spacer-sm);
    justify-content: center;
    text-align: center;
    padding: var(--spacer-lg) 0 calc(var(--spacer-lg) + var(--spacer));
    padding: var(--spacer-lg) 0;

    @container (min-width: 30rem) {
      display: flex;
      justify-content: space-between;
      text-align: left;
    }
  }

  > section {
    padding: var(--spacer) 0;

    > header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  hr {
    width: calc(100% + var(--spacer)*2);
    margin-left: calc(-1*var(--spacer));

    @media (--md) {
      width: 100%;
      margin-left: 0;
    }
  }

  .add-tweet {
    display: flex;
    gap: var(--spacer-sm);
  }

  .input-button {
    width: auto;
  }

  .success-message, .error-message {
    margin-top: var(--spacer-sm);
    font-size: var(--font-sm);
  }

  .success-message {
    color: var(--success);
  }

  .error-message {
    color: var(--error);
  }

  .tweets {
    display: flex;
    flex-direction: column;
    gap: var(--spacer);
  }

  .sort-button {
    max-width: var(--size-2);
    margin-left: auto;
  }
}
</style>
