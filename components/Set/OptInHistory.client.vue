<template>
  <section v-if="optInHistory && optInHistory.length > 0">
    <div class="header">
      <SectionTitle>Opt-In History</SectionTitle>
      <Button @click="refresh" :disabled="loading" class="refresh-button">
        <Icon type="refresh-cw" :class="{ spinning: loading }" />
        <span>Refresh</span>
      </Button>
    </div>

    <div class="history-container" @scroll="handleScroll">
      <div v-for="event in optInHistory" :key="event.id" class="event">
        <span>
          <NuxtLink :to="`/${id(event.account)}`" class="account-link">
            <Avatar :account="event.account" />
            <span class="account-name">{{ event.account.display }}</span>
          </NuxtLink>
        </span>
        <span>
          <span class="count-container">
            <span
              :class="{
                'count opt-in': event.is_opt_in,
                'count opt-out': !event.is_opt_in,
              }"
            >
              {{ event.is_opt_in ? '+' : '-' }}{{ event.optedInCount }}
            </span>
            <span>Opepen</span>
          </span>
        </span>
        <span>{{ timeAgo(DateTime.fromISO(event.created_at)) }}</span>
      </div>

      <div v-if="isLoadingMore" class="loading-more">Loading...</div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  submission: {
    type: String,
    required: true,
  },
})

const config = useRuntimeConfig()
const allHistory = ref([])
const loading = ref(false)
const hasMorePages = ref(true)
const currentPage = ref(3)
const isLoadingMore = ref(false)

const loadInitialHistory = async () => {
  const allData = []
  let page = 1
  let totalPages = 1

  while (page <= 3) {
    try {
      const response = await $fetch(
        `${config.public.opepenApi}/set-submissions/${props.submission.uuid}/history?page=${page}`,
      )

      if (response?.data?.length) {
        allData.push(...response.data)
        totalPages = response.meta?.last_page || 1
        page++
      } else {
        break
      }
    } catch (error) {
      console.error('Failed to load history page:', page, error)
      break
    }
  }

  hasMorePages.value = currentPage.value < totalPages
  return allData
}

const loadMoreHistory = async () => {
  if (!hasMorePages.value || isLoadingMore.value) return

  isLoadingMore.value = true
  const nextPage = currentPage.value + 1

  try {
    const response = await $fetch(
      `${config.public.opepenApi}/set-submissions/${props.submission.uuid}/history?page=${nextPage}`,
    )

    if (response?.data?.length) {
      allHistory.value.push(...response.data)
      currentPage.value = nextPage
      hasMorePages.value = nextPage < (response.meta?.last_page || 1)
    } else {
      hasMorePages.value = false
    }
  } catch (error) {
    console.error('Failed to load more history:', error)
    hasMorePages.value = false
  } finally {
    isLoadingMore.value = false
  }
}

const handleScroll = (event) => {
  const { scrollTop, scrollHeight, clientHeight } = event.target
  const threshold = 50

  if (scrollHeight - scrollTop - clientHeight < threshold) {
    loadMoreHistory()
  }
}

onMounted(async () => {
  allHistory.value = await loadInitialHistory()
})

const refresh = async () => {
  loading.value = true
  try {
    currentPage.value = 3
    hasMorePages.value = true
    allHistory.value = await loadInitialHistory()
  } catch (error) {
    console.error('Failed to refresh opt-in history:', error)
  } finally {
    loading.value = false
  }
}

const optInHistory = computed(() => {
  const history = allHistory.value || []

  return history
    .map((event) => ({
      id: event.id,
      account: event.account || {
        address: event.address,
        display: shortAddress(event.address),
        ens: null,
        image: null,
      },
      is_opt_in: event.is_opt_in,
      optedInCount: event.is_opt_in ? event.optedInCount : Math.abs(event.optedOutCount),
      created_at: event.created_at,
    }))
    .filter((event) => event.optedInCount > 0) // filter out 0 opt-ins -> max reveal adjustments
    .sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
})
</script>

<style scoped>
.event {
  @mixin ui-font;
  background: var(--gray-z-1);
  display: grid;
  padding: var(--size-1) var(--size-2);
  font-size: var(--font-xs);
  border-bottom: 1px solid var(--border-color);
  margin: 0;
  grid-template-columns: 50% 25% 25%;

  &:first-child {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }

  &:last-child {
    border-bottom: none;
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
  }

  &:hover {
    background: var(--gray-z-2);
  }

  .account-link {
    display: flex;
    align-items: center;
    gap: var(--size-2);
    text-decoration: none;
    color: inherit;
    transition: color var(--speed);

    &:hover {
      color: var(--color);

      .account-name {
        color: var(--color);
      }
    }

    .avatar {
      width: var(--size-4);
      height: var(--size-4);
      flex-shrink: 0;
    }

    .account-name {
      color: var(--gray-z-6);
      transition: color var(--speed);
    }
  }

  > * {
    color: var(--gray-z-6);
    display: flex;
    align-items: center;
    gap: var(--size-2);

    &:first-child {
      margin-bottom: 0;
    }

    &:last-child {
      text-align: right;
      justify-content: flex-end;
    }

    :deep(.vue-feather) {
      width: var(--size-3);
      opacity: 0.5;
    }
  }
}

.count-container {
  display: flex;
  align-items: center;
  gap: var(--size-2);
}

.count {
  min-width: var(--size-7);
  text-align: right;

  &.opt-in {
    color: var(--green-light);
  }

  &.opt-out {
    color: var(--red);
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacer);
}

.refresh-button {
  width: fit-content;
  gap: var(--size-2);

  .spinning {
    animation: spin 1s linear infinite;
  }

  > .icon {
    width: var(--size-4);
    height: var(--size-4);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.history-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--background);

  @media (--md) {
    max-height: 500px;
  }
}

.loading-more {
  padding: var(--size-2);
  text-align: center;
  color: var(--muted);
  font-size: var(--font-xs);
  background: var(--gray-z-0);
}
</style>
