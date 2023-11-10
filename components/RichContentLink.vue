<template>
  <article>
    <NuxtLink :to="link.url" :title="link.title" target="_blank"><span>Open</span></NuxtLink>
    <div :style="{ backgroundImage: `url(${coverURL})` }">
      <Image :image="link.logo" v-if="link.logo" class="logo" />

      <div class="text">
        <div>
          <h1>{{ link.title }}</h1>
          <p v-if="link.description">{{ link.description }}</p>
        </div>
        <div>
          <Button :to="link.url" class="small">Read more</Button>
        </div>
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
</script>

<style lang="postcss" scoped>
article {
  container-type: inline-size;
  position: relative;
  width: 100%;
  min-width: calc(100cqw - var(--size-4) * 2);

  @media (--md) {
    min-width: 28rem;
  }

  --height: min(67cqw, 15rem);

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

    &:--highlight {
      + div {
        transform: translateY(-0.5rem);

        .button {
          background-color: var(--gray-z-4);
        }
      }
    }
  }

  > div {
    transform: translateY(0);
    transition: all var(--speed);
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--size-4);
    justify-content: flex-end;
    align-items: flex-start;
    min-height: var(--height);
    border-radius: var(--size-4);
    border-top-left-radius: var(--size-1);
    border: var(--border);
    overflow: hidden;
    padding: var(--size-4);
    background: var(--gray-z-1);
    background-size: cover;
    background-position: center center;
    z-index: 2;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      background: linear-gradient(to top, var(--background) 10%, var(--transparent-background) 150%);
      opacity: 0.9;
    }

    .text {
      display: grid;
      width: 100%;
      gap: var(--size-4);

      > div {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: var(--size-2);

      }

      @media (--md) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        justify-content: space-between;
        align-items: flex-end;

        > div {
          &:last-child {
            align-items: flex-end;
          }
        }
      }
    }

    > * {
      position: relative;
      z-index: 2;
    }

    h1 {
      font-size: var(--font-lg);
      line-height: 1em;
    }

    p {
      /* white-space: nowrap;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis; */
      font-size: var(--font-sm);
      line-height: 1em;
    }
  }

  .logo {
    width: var(--size-9);
    height: var(--size-9);
    min-width: 0;
    border-radius: var(--size-1);
    padding-bottom: calc(var(--size-9) - 2px);
  }
}
</style>
