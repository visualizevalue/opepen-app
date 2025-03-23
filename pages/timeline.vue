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

function extractTweetId(url) {
    const regex = /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/[^\/]+\/status(?:es)?\/(\d+)/i
    const match = url.match(regex)
    return match ? match[1] : null
}

async function addTweet() {
    successMessage.value = ''
    errorMessage.value = ''

    if (!tweetInput.value) {
        errorMessage.value = 'Tweet input is empty.'
        return
    }

    let tweetId = tweetInput.value.trim()
    if (tweetId.includes('twitter.com') || tweetId.includes('x.com')) {
        const extractedId = extractTweetId(tweetId)

        if (!extractedId) {
            errorMessage.value = 'Could not extract Tweet ID.'
            return
        }
        tweetId = extractedId
    }

    try {
        const { data, error, execute } = await useApiPost('/curated-tweets', {
            body: JSON.stringify({ ids: [tweetId] }),
        })

        await execute()

        if (error.value) {
            errorMessage.value = 'Error adding tweet.'
            return
        }

        const result = data.value
        if (!result) {
            errorMessage.value = 'Error adding tweet.'
            return
        }
        if (typeof result === 'object' && 'error' in result) {
            errorMessage.value = result.error
            return
        }
        if (Array.isArray(result) && !result.length) {
            errorMessage.value = 'No new tweets were added.'
            return
        }

        successMessage.value = 'Tweet added successfully.'
        tweetInput.value = ''
        refreshKey.value = Date.now()
    } catch (err) {
        errorMessage.value = 'An unexpected error occurred.'
        console.error(err)
    }
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