<template>
  <PageFrameSm class="news">
    <header>
      <h1>
        <span>Timeline</span>
        <small>The Opepen activity feed</small>
      </h1>
    </header>

    <hr />

    <section v-if="isAdmin" class="admin">
      <div class="add-tweet">
        <input type="text" v-model="tweetInput" placeholder="Add a notable tweet URL or Id" />
        <Button class="input-button" @click="addTweet">Add</Button>
      </div>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </section>

    <nav class="filters">
      <button
        v-for="f in filters"
        :key="f.key"
        :class="{ active: filter === f.key }"
        @click="filter = f.key"
      >
        {{ f.label }}
      </button>
    </nav>

    <section class="feed">
      <template v-for="entry in filtered" :key="entry.id">
        <!-- Notable tweet — keep the rich embed -->
        <TweetCard v-if="entry.type === 'tweet'" :tweet="entry.data" @deleted="reloadTweets" />

        <!-- Set reveal -->
        <NuxtLink
          v-else-if="entry.type === 'reveal'"
          :to="`/sets/${pad(entry.data.id, 3)}`"
          class="entry"
        >
          <span class="icon"><Icon type="opepen-grid" /></span>
          <Image
            v-if="entry.data.submission.edition1Image"
            :image="entry.data.submission.edition1Image"
            :aspect-ratio="1"
            class="thumb"
          />
          <span v-else class="thumb placeholder"><Icon type="opepen" /></span>
          <span class="body">
            <span class="title">
              Set {{ pad(entry.data.id, 3) }} · {{ entry.data.submission.name }}
            </span>
            <span class="sub">Revealed · by {{ entry.data.submission.artist }}</span>
          </span>
          <time>{{ timeAgo(entry.timestamp) }}</time>
        </NuxtLink>

        <!-- Newly submitted set -->
        <NuxtLink
          v-else-if="entry.type === 'submission'"
          :to="`/submissions/${entry.data.uuid}`"
          class="entry"
        >
          <span class="icon"><Icon type="plus" /></span>
          <Image
            v-if="entry.data.edition1Image"
            :image="entry.data.edition1Image"
            :aspect-ratio="1"
            class="thumb"
          />
          <span v-else class="thumb placeholder"><Icon type="opepen" /></span>
          <span class="body">
            <span class="title">{{ entry.data.name }}</span>
            <span class="sub">Submitted · by {{ entry.data.artist }}</span>
          </span>
          <time>{{ timeAgo(entry.timestamp) }}</time>
        </NuxtLink>

        <!-- Opt-in / opt-out (macro coordination activity) -->
        <NuxtLink
          v-else-if="entry.type === 'optin'"
          :to="`/submissions/${entry.data.submission.uuid}`"
          class="entry"
        >
          <span class="icon"><Icon type="check" /></span>
          <Image
            v-if="entry.data.submission.edition1Image"
            :image="entry.data.submission.edition1Image"
            :aspect-ratio="1"
            class="thumb"
          />
          <span v-else class="thumb placeholder"><Icon type="opepen" /></span>
          <span class="body">
            <span class="title">
              {{ shortAddr(entry.data.address) }} {{ optInVerb(entry.data) }}
              {{ optInCount(entry.data) }} Opepen
            </span>
            <span class="sub">{{ entry.data.submission.name }}</span>
          </span>
          <time>{{ timeAgo(entry.timestamp) }}</time>
        </NuxtLink>

        <!-- Secondary sale -->
        <NuxtLink
          v-else-if="entry.type === 'sale'"
          :to="`/opepen/${entry.data.token_id}`"
          class="entry"
        >
          <span class="icon"><Icon type="trending-up" /></span>
          <Image
            v-if="entry.data.opepen?.image"
            :image="entry.data.opepen.image"
            :aspect-ratio="1"
            class="thumb"
          />
          <span v-else class="thumb placeholder"><Icon type="opepen" /></span>
          <span class="body">
            <span class="title">
              #{{ entry.data.token_id }} sold for {{ priceEth(entry.data) }} Ξ
            </span>
            <span class="sub" v-if="entry.data.opepen?.set?.submission?.name">
              {{ entry.data.opepen.set.submission.name }}
            </span>
          </span>
          <time>{{ timeAgo(entry.timestamp) }}</time>
        </NuxtLink>
      </template>

      <p v-if="!filtered.length" class="empty">No activity yet.</p>
    </section>
  </PageFrameSm>
</template>

<script setup>
const { filtered, filter, reloadTweets } = await useActivity()

const filters = [
  { key: 'all', label: 'All' },
  { key: 'reveals', label: 'Reveals' },
  { key: 'submissions', label: 'Submissions' },
  { key: 'optins', label: 'Opt-ins' },
  { key: 'sales', label: 'Sales' },
  { key: 'notable', label: 'Notable' },
]

// Opt-in history rows: opt-in when the count grew (or first time), else opt-out.
const optInCount = (h) => h.opepen_count ?? 0
const optInVerb = (h) =>
  (h.opepen_count ?? 0) >= (h.previous_opepen_count ?? 0) && (h.opepen_count ?? 0) > 0
    ? 'opted in'
    : 'opted out'
const shortAddr = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '')

const priceEth = (sale) => {
  const eth = sale?.data?.price?.eth
  if (eth) return Number(eth).toFixed(2)
  return sale?.value ? (Number(sale.value) / 1e18).toFixed(2) : '0'
}
const timeAgo = (iso) => {
  try {
    const days = Math.floor(Math.abs(DateTime.fromISO(iso).diffNow('days').days))
    if (days === 0) return 'today'
    if (days === 1) return '1 day ago'
    return `${formatNumber(days)} days ago`
  } catch (e) {
    return ''
  }
}

// Admin: add a notable tweet to the feed.
const tweetInput = ref('')
const successMessage = ref('')
const errorMessage = ref('')

function extractTweetId(url) {
  const regex = /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/[^\/]+\/status(?:es)?\/(\d+)/i
  const match = url.match(regex)
  return match ? match[1] : null
}

const body = computed(() => {
  const rawId = tweetInput.value.trim()
  if (!rawId) return JSON.stringify({ ids: [] })
  if (rawId.includes('twitter.com') || rawId.includes('x.com')) {
    const extractedId = extractTweetId(rawId)
    return JSON.stringify({ ids: extractedId ? [extractedId] : [] })
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
  await reloadTweets()
}

useMetaData({
  title: `Timeline | Opepen`,
  description: `A live feed of notable Opepen activity — reveals, sales, and highlights.`,
})
</script>

<style scoped>
.news {
  > header {
    h1 {
      @mixin ui-font;
      font-size: var(--font-lg);
      line-height: 1em;
      display: grid;
      gap: var(--spacer-sm);
      justify-content: center;
      text-align: center;
      padding: var(--spacer-lg) 0;

      small {
        font-size: 1em;
        color: var(--muted);
      }

      @container (min-width: 30rem) {
        display: flex;
        justify-content: space-between;
        text-align: left;
      }
    }
  }

  hr {
    width: calc(100% + var(--spacer) * 2);
    margin-left: calc(-1 * var(--spacer));

    @media (--md) {
      width: 100%;
      margin-left: 0;
    }
  }
}

.admin {
  padding: var(--spacer) 0;

  .add-tweet {
    display: flex;
    gap: var(--spacer-sm);
  }
  .input-button {
    width: auto;
  }
  .success-message,
  .error-message {
    margin-top: var(--spacer-sm);
    font-size: var(--font-sm);
  }
  .success-message {
    color: var(--success);
  }
  .error-message {
    color: var(--error);
  }
}

.filters {
  display: flex;
  gap: var(--size-2);
  padding: var(--spacer) 0;
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--background);

  button {
    @mixin ui-font;
    font-size: var(--font-xs);
    padding: var(--size-1) var(--size-3);
    border: var(--border);
    border-radius: 999px;
    background: transparent;
    color: var(--gray-z-6);
    cursor: pointer;
    transition: all var(--speed);

    &:hover {
      color: var(--color);
    }
    &.active {
      background: var(--color);
      color: var(--background);
      border-color: var(--color);
    }
  }
}

.feed {
  display: flex;
  flex-direction: column;
  gap: var(--spacer);
  padding-bottom: var(--spacer-lg);
}

.entry {
  display: grid;
  grid-template-columns: var(--size-6) var(--size-8) 1fr auto;
  align-items: center;
  gap: var(--spacer);
  padding: var(--size-2);
  border: 0;
  border-radius: var(--size-2);
  text-decoration: none;
  transition: background var(--speed);

  &:hover {
    background: var(--gray-z-1);
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gray-z-6);
  }

  .thumb {
    width: var(--size-8);
    height: var(--size-8);
    border-radius: var(--size-1);
    overflow: hidden;
  }

  .thumb.placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gray-z-1);
    color: var(--gray-z-4);
  }

  .body {
    display: grid;
    gap: 2px;
    min-width: 0;

    .title {
      @mixin ui-font;
      color: var(--color);
    }
    .sub {
      font-size: var(--font-xs);
      color: var(--gray-z-6);
    }
  }

  time {
    font-size: var(--font-xs);
    color: var(--gray-z-6);
    white-space: nowrap;
  }
}

.empty {
  @mixin ui-font;
  color: var(--muted);
  text-align: center;
  padding: var(--spacer-xl) 0;
}
</style>
