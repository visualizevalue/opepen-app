<template>
  <article
    :style="{
      backgroundImage: `linear-gradient(to top, var(--opaque-black) 10%, var(--transparent-black) 150%), url(${coverImageURL})`
    }"
  >
    <div>
      <Avatar :account="account" :size="256" class="avatar" />
      <div class="text">
        <h1>
          <span>{{ account.display }}</span>
        </h1>
      </div>
    </div>

    <NuxtLink :to="id(account)"><span>View {{ account.display }}</span></NuxtLink>
  </article>
</template>

<script setup>
import { id } from '~/helpers/accounts'
import { imageURI } from '~/helpers/images'

const { account } = defineProps({
  account: Object,
})

const coverImageURL = imageURI(account?.coverImage, 'md')
</script>

<style scoped>
article {
  position: relative;
  container-type: inline-size;
  background-color: var(--gray-z-2);
  background-size: cover;
  background-position: center center;
  border: var(--border);
  border-radius: var(--size-5);
  border-top-left-radius: var(--size-1);

  > div {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: var(--size-2);
    padding: var(--size-4);
    width: 100cqw;
  }

  .avatar {
    width: 24cqw;
    height: 24cqw;
    border-top-left-radius: var(--size-2);
    border-color: var(--gray-300);
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: var(--size-1);
  }

  h1 {
    display: flex;
    align-items: baseline;
    gap: var(--size-4);
    color: var(--white);
    white-space: nowrap;
    overflow: hidden;

    span {
      font-family: var(--ui-font-family);
      font-size: var(--font-lg);
      height: 1em;
    }

    small {
      font-size: var(--font-base);
      text-overflow: ellipsis;
      width: 100%;
      flex-grow: 0;
    }
  }

  a {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    span {
      opacity: 0;
    }
  }
}
</style>
