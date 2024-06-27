<template>
  <div class="image-detail">

    <Image :image="image" />

    <div v-if="account" class="details">
      <h1>
        <NuxtLink :to="`/${computeId(account)}`">
          <ApiAccount :account="account" />
        </NuxtLink>
      </h1>
      <p v-if="opepen" class="muted">
        <NuxtLink :to="`/opepen/${opepen.token_id}`">{{ opepen.name }}</NuxtLink>
      </p>
      <p v-if="submission" class="muted">
        <NuxtLink :to="`/sets/${submission.uuid}`">
          <span v-if="submission.set_id">Set {{pad(submission.set_id)}}: </span>{{ submission.name }}
        </NuxtLink>
      </p>
      <p v-if="post" class="muted">
        {{ post.body }}
      </p>
    </div>

  </div>
</template>

<script setup>
import { id as computeId } from '~/helpers/accounts'
import pad from '~/helpers/pad'

const props = defineProps({
  image: Object,
  account: {
    type: Object,
    default: props => props.image.creatorAccount,
  },
  opepen: {
    type: Object,
    default: props => props.image.cachedOpepen,
  },
  submission: {
    type: Object,
    default: props => props.image.cachedSetSubmission,
  },
  post: {
    type: Object,
    default: props => props.image.cachedPost,
  },
})
</script>

<style lang="postcss" scoped>
.image-detail {
  position: relative;
  container-type: inline-size;
  display: grid;

  @media (--md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  :deep(.image) {
    border: none;
    border-radius: 0 !important;
  }

  :deep(> .image) {
    border-bottom: var(--border-dark);

    @media (--md) {
      border-bottom: none;
      border-right: var(--border-dark);
    }
  }

  .details {
    padding: var(--size-4);
    display: grid;
    grid-auto-rows: min-content;
    gap: var(--size-2);
    align-items: center;
  }
}
</style>
