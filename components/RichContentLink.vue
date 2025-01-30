<template>
  <article
    :style="
      {
        backgroundImage: `linear-gradient(to top, var(--opaque-black) 0%, var(--transparent-black) 150%), url(${coverURL})`
      }
    "
    class="content-link"
  >
    <NuxtLink :to="link.url" :title="link.title" target="_blank"><span>Open</span></NuxtLink>
    <Image :image="link.logo" v-if="link.logo" class="logo" />
    <div class="text">
      <h1>{{ link.title }}</h1>
      <p v-if="link.description">
        {{ description }}
      </p>
    </div>
  </article>
</template>

<script setup>
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
  border-radius: var(--border-radius);
  border: var(--border);
  overflow: hidden;
  background: var(--gray-z-1);
  background-size: cover;
  background-position: center center;
  min-height: 9rem;
  padding: var(--size-4);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: var(--size-4);

  &:--highlight {
    transform: translateY(-0.5rem);
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
    color: var(--gray-z-6) !important;
    display: grid;
    gap: var(--size-1);

    @mixin ui-font;
  }

  h1 {
    color: var(--color);
  }
}
</style>
