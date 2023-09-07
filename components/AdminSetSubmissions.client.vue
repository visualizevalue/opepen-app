<template>
  <section v-if="isConnected">
    <PageHeader>
      <h1 class="breadcrumb">
        <span>Manage Submissions</span>
      </h1>

      <div class="actions">
        <select v-model="status" class="input sm">
          <option value="all">All</option>
          <option value="complete">Complete</option>
          <option value="starred">Starred</option>
          <option value="published">Published</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>
    </PageHeader>

    <PaginatedContent
      v-if="session"
      ref="list"
      :url="url"
      :query="query"
      :refresh-key="address"
      v-slot="{ items }"
    >
      <article
        v-for="(set, index) in items"
        :key="set.uuid"
        class="submission"
      >
        <div class="preview">
          <Image :image="set.edition1Image" version="sm" />
          <Image :image="set.edition4Image" version="sm" />
          <Image :image="set.edition5Image" version="sm" />
          <Image :image="set.edition10Image" version="sm" />
          <Image :image="set.edition20Image" version="sm" />
          <Image :image="set.edition40Image" version="sm" />
        </div>

        <div class="details">
          <div class="meta">
            <span>
              <Account :address="set.creator" />,
            </span>
            <span>
              {{ formatDate(set.created_at) }}
            </span>
          </div>
          <h1>{{ set.name }}</h1>
          <p>{{ set.description }}</p>
          <NuxtLink :to="`/create/sets/admin/${set.uuid}`"><span>Go to {{ set.name }}</span></NuxtLink>

          <div class="actions">
            <button @click.stop="() => star(set, index)">
              <Icon
                type="star"
                :fill="set.starred_at ? 'var(--yellow)' : 'transparent'"
                :stroke="set.starred_at ? 'var(--yellow)' : 'currentColor'"
              />
            </button>
            <button @click.stop="() => destroy(set, index)"><Icon type="trash" /></button>
          </div>
        </div>
      </article>
    </PaginatedContent>
  </section>
</template>

<script setup>
import { useSignIn } from '~/helpers/siwe'
import { formatDate } from '~/helpers/dates'
import { useAccount } from '~/helpers/use-wagmi'

const config = useRuntimeConfig()
const { session } = useSignIn()
const { address, isConnected } = useAccount()

const url = computed(() => `${config.public.opepenApi}/set-submissions`)

const router = useRouter()
const route = useRoute()
const status = ref(route.query.status || 'complete')
watch(status, () => {
  if (route.query.status !== status.value) {
    router.replace({ query: { ...route.query, status: status.value }})
  }
})

const query = computed(() => {
  const q = new URLSearchParams({
    status: status.value,
  })

  return q.toString()
})

// Actions
const list = ref(null)
const star = async (set, index) => {
  const saved = await $fetch(`${config.public.opepenApi}/set-submissions/${set.uuid}/star`, {
    method: 'POST',
    credentials: 'include',
  })

  list.value.items[index] = saved
}
const destroy = async (set, index) => {
  await $fetch(`${config.public.opepenApi}/set-submissions/${set.uuid}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  list.value.items.splice(index, 1)
}
</script>

<style lang="postcss" scoped>
section {
  max-width: var(--content-width);
  margin: var(--size-7) auto;

  > header {
    margin-bottom: var(--size-7);
    display: flex;
    gap: var(--size-4);

    @media (--md) {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  > div {
    display: grid;
    gap: var(--size-5);
  }
}

article.submission {
  width: 100%;
  padding: var(--size-4);
  background: var(--gray-z-1);
  border: var(--border);
  border-radius: var(--size-5);
  border-top-left-radius: var(--size-1);
  position: relative;
  display: flex;
  gap: var(--size-5);

  .meta {
    color: var(--gray-z-5);
    display: flex;
    align-items: center;
    gap: var(--size-2);
    margin-bottom: var(--size-2);

    > * {
      display: flex;
      align-items: center;
      font-size: var(--size-sm);
    }
  }

  .preview {
    width: 6rem;
    height: 6rem;
    flex-shrink: 0;

    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: repeat(3, minmax(0, 1fr));
    gap: var(--size-2);
    grid-auto-flow: dense;

    > :first-child {
      grid-column: span 2;
      grid-row: span 2;
    }

    .image {
      margin: 0;
      height: 100%;
      border-radius: var(--size-0);
    }
  }

  p {
    font-size: var(--font-sm);
    color: var(--gray-z-5);
  }

  a {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    span {
      opacity: 0.0001;
    }
  }

  .actions {
    position: absolute;
    top: var(--size-2);
    right: var(--size-2);
    z-index: 2;

    display: flex;
    gap: var(--size-3);
  }

  &:--highlight {
    background: var(--gray-z-4);
  }
}

.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--size-5);
  width: 100%;
  padding: var(--size-8) 0;

  @media (--md) {
    grid-column: span 2;
  }
}
</style>
