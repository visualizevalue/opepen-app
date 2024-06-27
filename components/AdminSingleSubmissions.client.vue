<template>
  <section v-if="isConnected">
    <PageHeader>
      <h1 class="breadcrumb">
        <span>Manage Single Posts</span>
      </h1>

      <div class="actions">
        <select v-model="status" class="input sm">
          <option value="unapproved">To Approve</option>
          <option value="published">Approved</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>
    </PageHeader>

    <div class="posts">
      <SinglesGallery path="posts/images" :query="query" :image-accessor="post => post.images[0]">
        <template #item="{ item: post, image }">
          <div v-if="(!post.deleted_at) || status === 'deleted'" class="post">
            <Image
              :image="image"
              version="sm"
              :aspect-ratio="1"
            />
            <menu v-if="! post.deleted_at">
              <button @click="post.approved_at ? unapprove(post) : approve(post)">
                <Icon type="check" :style="{ color: post.approved_at ? 'var(--green)' : 'var(--gray-z-5)' }" />
              </button>
              <button @click="destroy(post)">
                <Icon type="trash" :style="{ color: post.deleted_at ? 'var(--red)' : 'var(--gray-z-5)' }" />
              </button>
            </menu>
            <aside>
              <NuxtLink :to="`/${post.account.address}`">
                <ApiAccount :account="post.account" />
              </NuxtLink>
            </aside>
          </div>
          <div v-else></div>
        </template>
      </SinglesGallery>
    </div>
  </section>
</template>

<script setup>
import { DateTime } from 'luxon'
import { useSignIn, isAdmin } from '~/helpers/siwe'
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

  switch (status.value) {
    case 'unapproved':
      q.append('filter[approved_at]', 'null')
      q.append('filter[deleted_at]', 'null')
      break
    case 'published':
      q.append('filter[approved_at]', '!null')
      q.append('filter[deleted_at]', 'null')
      break
    case 'deleted':
      q.append('filter[deleted_at]', '!null')
      break
  }

  return q.toString()
})

// Actions
const action = async (post, action, type = 'posts', method = 'POST') => {
  await $fetch(`${config.public.opepenApi}/${type}/${post.uuid}/${action}`, {
    method,
    credentials: 'include',
  })
}
const approve = async (post, type) => {
  await action(post, 'approve', type)
  post.approved_at = DateTime.now().toISO()
}
const unapprove = async (post) => {
  await action(post, 'unapprove')
  post.approved_at = null
}
const deleted = ref([])
const destroy = async (post, type = 'posts') => {
  await action(post, '', type, 'DELETE')
  post.deleted_at = DateTime.now().toISO()
}
</script>

<style lang="postcss" scoped>
section {
  width: 100%;
  max-width: var(--content-width);
  margin: 0 auto;
  padding: var(--size-5);

  @media (--md) {
    padding: 0;
  }

  > header {
    margin-bottom: var(--size-4) !important;
    display: flex;
    gap: var(--size-4);

    @media (--md) {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}

.post {
  position: relative;

  > menu {
    position: absolute;
    top: 1px;
    right: 1px;
    border-top-right-radius: calc(var(--size-5) - 1px);
    border-bottom-left-radius: var(--size-2);
    padding: var(--size-4);
    display: flex;
    justify-content: flex-end;
    gap: var(--size-4);
    margin: 0;
    transition: all var(--speed);

    button {
      &:--highlight {
        .icon {
          color: var(--color) !important;
        }
      }
    }
  }

  > aside {
    position: absolute;
    bottom: 1px;
    left: 1px;
    right: 1px;
    border-bottom-left-radius: calc(var(--size-5) - 1px);
    border-bottom-right-radius: calc(var(--size-5) - 1px);
    background: var(--semi);
    display: flex;
    padding: var(--size-2);
    opacity: 0;
    transition: all var(--speed);

    a {
      display: flex;
      align-items: center;
    }
  }

  &:--highlight {
    > aside {
      opacity: 1;
    }
    > menu {
      background: var(--semi);
    }
  }
}
</style>
