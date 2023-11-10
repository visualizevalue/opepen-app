<template>
  <div v-if="links" class="links">
    <div>
      <div>
        <RichContentLink v-for="link of shownLinks" :link="link" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { validateURI } from '~/helpers/urls'

const { links } = defineProps({
  links: Array,
})

const shownLinks = computed(() => links.filter(l => validateURI(l.url)))
</script>

<style lang="postcss" scoped>
.links {
  --padding-x: var(--size-4);

  @media (--content) {
    --padding-x: calc((100vw - var(--content-width)) / 2 + var(--size-4));
  }

  position: relative;

  > div {
    position: relative;
    width: 100vw;
    overflow: auto;
    left: calc(-1 * var(--padding-x));
    padding: var(--size-4) var(--padding-x);
    -webkit-overflow-scrolling: auto;

    > div {
      display: flex;
      gap: var(--size-4);
      width: max-content;
    }
  }

  &:before,
  &:after {
    content: '';
    position: absolute;
    height: 100%;
    top: 0;
    z-index: 2;
    pointer-events: none;
    width: var(--size-6);

    @media (--content) {
      width: var(--padding-x);
    }
  }

  &:before {
    background: linear-gradient(to right, var(--background), var(--transparent-background));
    left: calc(-1 * var(--padding-x));
  }
  &:after {
    background: linear-gradient(to right, var(--transparent-background), var(--background));
    right: calc(-1 * var(--padding-x));
  }
}
</style>
