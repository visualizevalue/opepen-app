<template>
  <article
    :style="
      {
        backgroundImage: `linear-gradient(to top, var(--opaque-black) 10%, var(--transparent-black) 150%), url(${coverURL})`
      }
    "
    class="content-link"
  >
    <NuxtLink :to="link.url" :title="link.title" target="_blank"><span>Open</span></NuxtLink>
    <Image :image="link.logo" v-if="link.logo" class="logo" />
    <div class="text">
      <div>
        <h1>{{ link.title }}</h1>
        <p v-if="link.description">
          {{ description }}
          <button v-if="false" @click.stop.prevent="shortenDescription = !shortenDescription">
            <Icon v-if="shortenDescription" type="chevron-right" />
            <Icon v-else type="chevron-up" />
          </button>
        </p>
      </div>
      <div>
        <Button :to="link.url" class="small">View</Button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { imageURI } from '~/helpers/images'

const { link } = defineProps({
  link: Object,
})

const coverURL = computed(() => imageURI(link.cover, 'lg'))
const shortenDescription = ref(link.description?.length >= 100)
const description = computed(() => shortenDescription.value
  ? link.description.substring(0, 80) + '...'
  : link.description
)
</script>

<style scoped>
article.content-link {
  container-type: inline-size;
  position: relative;
  width: 100%;
  transform: translateY(0);
  transition: all var(--speed);
  min-width: calc(80cqw);
  border-radius: var(--size-4);
  border-top-left-radius: var(--size-1);
  border: var(--border);
  overflow: hidden;
  background: var(--gray-z-1);
  background-size: cover;
  background-position: center center;
  min-height: 15rem;
  padding: var(--size-4);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: var(--size-4);

  &:--highlight {
    transform: translateY(-0.5rem);
    .button {
      background-color: var(--gray-z-4);
    }
  }

  @media (--md) {
    min-width: 28rem;
  }

  > a {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;

    > * {
      opacity: 0;
    }
  }

  .logo {
    width: var(--size-9);
    height: var(--size-9);
    padding-bottom: 0 !important;
    border-radius: var(--size-1);
  }

  .text {
    width: 100%;
    display: flex;
    gap: var(--size-4);
    color: var(--white) !important;

    > div {
      /* width: 100%; */
      display: flex;
      flex-direction: column;
      gap: var(--size-2);
    }

    @media (--md) {
      justify-content: space-between;
      align-items: flex-end;

      > div {
        &:last-child {
          align-items: flex-end;
        }
      }
    }
  }

  h1 {
    font-size: var(--font-lg);
    line-height: 1em;
  }

  p {
    font-size: var(--font-sm);
    line-height: 1em;

    button {
      display: inline;
    }

    .icon {
      width: 1em;
      height: 1em;
      position: relative;
      top: 0.2em;
      color: var(--gray-500);
    }
  }

  button {
    position: relative;
  }
}
</style>
