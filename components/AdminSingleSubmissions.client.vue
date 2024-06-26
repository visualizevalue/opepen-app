<template>
  <section v-if="isConnected">
    <PageHeader>
      <h1 class="breadcrumb">
        <span>Manage Single Posts</span>
      </h1>

      <div class="actions">
        <select v-model="status" class="input sm">
          <option value="all">All</option>
          <option value="unapproved">To Approve</option>
          <option value="published">Approved</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>
    </PageHeader>

    <SinglesGallery path="posts/images" :query="query" :image-accessor="post => post.images[0]" />
  </section>
</template>

<script setup>
import { useSignIn, isAdmin } from '~/helpers/siwe'
import { formatDateTime } from '~/helpers/dates'
import { useAccount } from '~/helpers/use-wagmi'

const config = useRuntimeConfig()
const { session } = useSignIn()
const { address, isConnected } = useAccount()

const url = computed(() => `${config.public.opepenApi}/set-submissions`)

const router = useRouter()
const route = useRoute()
const status = ref(route.query.status || 'unapproved')
watch(status, () => {
  if (route.query.status !== status.value) {
    router.replace({ query: { ...route.query, status: status.value }})
  }
})

watch(session, () => {
  if (! isAdmin.value) navigateTo('/create/sets')
})

const query = computed(() => {
  const q = new URLSearchParams()

  console.log('status', status.value)

  switch (status.value) {
    case 'unapproved':
      q.append('filter[approved_at]', 'null')
      break
    case 'published':
      q.append('filter[approved_at]', '!null')
      break
    case 'deleted':
      q.append('filter[deleted_at]', '!null')
      break
  }

  return q.toString()
})

// Actions
const list = ref(null)
// const star = async (submission, index) => {
//   const saved = await $fetch(`${config.public.opepenApi}/set-submissions/${submission.uuid}/star`, {
//     method: 'POST',
//     credentials: 'include',
//   })

//   list.value.items[index] = saved
// }
const destroy = async (submission, index) => {
  await $fetch(`${config.public.opepenApi}/set-submissions/${submission.uuid}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  list.value.items.splice(index, 1)
}
const approve = async (submission, index) => {
  const action = submission.approved_at ? `unapprove` : `approve`
  const saved = await $fetch(`${config.public.opepenApi}/set-submissions/${submission.uuid}/${action}`, {
    method: 'POST',
    credentials: 'include',
  })

  list.value.items[index] = saved
}
</script>

<style lang="postcss" scoped>
section {
  width: 100%;
  max-width: var(--content-width);
  margin: var(--size-7) auto;

  > header {
    margin-bottom: var(--size-7) !important;
    display: flex;
    gap: var(--size-4);

    @media (--md) {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  :deep(> div) {
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
    top: var(--size-3);
    right: var(--size-3);
    z-index: 2;

    display: flex;
    gap: var(--size-4);
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
