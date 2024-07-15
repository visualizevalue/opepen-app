<template>
  <section>
    <div v-if="! session" class="empty">
      <p class="muted">Please Sign in with your Ethereum account to submit art.</p>

      <Button @click="signIn">Sign in with Ethereum</Button>
    </div>
    <PaginatedContent
      v-else-if="session?.address"
      :url="url"
      :query="query"
      :refresh-key="`${address}.${nonce}`"
    >
      <template #after-block="{ items }">
        <div v-if="! items?.length" class="empty">
          <p class="muted">No set submissions</p>
          <Button to="/create/sets/submit">
            <Icon type="plus" />
            <span>Create set</span>
          </Button>
        </div>
      </template>
      <template #default="{ items }">
        <article
          v-for="set in items"
          :key="set.uuid"
        >
          <div class="preview">
            <Image :image="set.edition1Image" version="sm" />
          </div>

          <div class="details">
            <h1>{{ set.name }}</h1>
            <p>{{ set.description }}</p>

            <div v-if="set.votes_count" class="votes">
              <span><Icon type="award" /> {{ parseInt((1 + set.vote_score)/2 * 100) }}% positive</span>
              <span><Icon type="check" style="color: var(--error)" /> <span class="muted">x</span> {{ (set.votes_count - set.points) / 2 }}</span>
              <span><Icon type="check" style="color: var(--success)" /> <span class="muted">x</span> {{ (set.votes_count + set.points) / 2  }}</span>
            </div>

            <NuxtLink :to="`/create/sets/${set.uuid}`"><span>Go to {{ set.name }}</span></NuxtLink>
          </div>
        </article>
      </template>
    </PaginatedContent>
  </section>
</template>

<script setup>
import { useAccount } from '~/helpers/use-wagmi'
import { useSignIn } from '~/helpers/siwe'

const props = defineProps({
  query: String,
})

const config = useRuntimeConfig()
const { session, signIn, nonce } = useSignIn()
const { address } = useAccount()

onMounted(async () => {
  if (! session.value) {
    await signIn()
  }
})

const url = computed(() => `${config.public.opepenApi}/accounts/${session.value?.address}/set-submissions`)
</script>

<style lang="postcss" scoped>
section {
  margin: var(--size-5) 0;

  :deep(> div) {
    display: grid;
    gap: var(--size-5);
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
  }
}

article {
  width: 100%;
  padding: var(--size-4);
  background: var(--gray-z-1);
  border: var(--border);
  border-radius: var(--size-5);
  border-top-left-radius: var(--size-1);
  position: relative;
  display: flex;
  gap: var(--size-5);

  .preview {
    width: var(--size-9);
    height: var(--size-9);
    flex-shrink: 0;

    .image {
      margin: 0;
      height: 100%;
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

  @media (--md) {
    grid-column: span 2;
  }
}

.votes {
  display: flex;
  gap: var(--size-4);
  margin: var(--size-2) 0;
  font-size: var(--font-sm);
  color: var(--gray-z-6);

  > span {
    display: flex;
    gap: var(--size-0);
  }

  .icon {
    width: var(--size-4);
    display: block;
  }
}
</style>
