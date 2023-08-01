<template>
  <section>
    <PaginatedContent
      v-if="session"
      :url="url"
      :refresh-key="address"
      v-slot="{ items }"
    >
      <div v-if="! items?.length" class="empty">
        <p class="muted">No set submissions</p>
        <Button to="/create/sets/submit">
          <Icon type="plus" />
          <span>Create set</span>
        </Button>
      </div>

      <article
        v-for="set in items"
        :key="set.uuid"
      >
        <div class="preview">
          <Image :image="set.edition1Image" />
        </div>

        <div class="details">
          <h1>{{ set.name }}</h1>
          <p>{{ set.description }}</p>
          <NuxtLink :to="`/create/sets/${set.uuid}`"><span>Go to {{ set.name }}</span></NuxtLink>
        </div>
      </article>
    </PaginatedContent>
  </section>
</template>

<script setup>
import { useAccount } from '~/helpers/use-wagmi'
import { useSignIn } from '~/helpers/siwe'

const config = useRuntimeConfig()
const { session } = useSignIn()
const { address } = useAccount()

const url = computed(() => `${config.public.opepenApi}/accounts/${session.value?.address}/set-submissions`)
</script>

<style lang="postcss" scoped>
section {
  margin: var(--size-7) 0;

  > div {
    display: grid;
    gap: var(--size-5);

    @media (--md) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
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
  padding: var(--size-8) 0;

  @media (--md) {
    grid-column: span 2;
  }
}
</style>
