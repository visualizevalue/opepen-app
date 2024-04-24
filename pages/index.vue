<template>
  <div class="home">
    <section class="about">
      <div class="intro">
        <h1>
          <IconsOpepenAiMedium />
          <span>An Open Canvas</span>
        </h1>

        <p>Opepen is an early manifestation of a digital museum - an open art protocol inviting participation from anyone.</p>
        <p>Collectors of 16.000 cryptographic tokens form consensus on the artwork for the Permanent Collection.</p>

        <StyledLink to="/sets/explore">View Submissions</StyledLink>
        <StyledLink to="/sets">View Permanent Collection</StyledLink>
        <StyledLink to="/create/sets">Submit a Set</StyledLink>
      </div>

      <div class="permanent">
        <h2>
          <span>Permanent Collection</span>
          <span>{{ pad(completeSets.length, 3) }}/200</span>
        </h2>

        <Progress :percent="parseInt(completeSets.length / 200 * 100)" />
      </div>

      <div class="stats">
        <Stats />
      </div>

      <div class="activity">
        <h2>Protocol Activity</h2>
        <OptInTimelineList
          :limit="5"
          :auto-load="false"
        />
      </div>
    </section>

    <div
      ref="gallery"
      class="gallery"
      @mouseleave="resume"
      @mouseenter="pause"
    >
      <h2>Explore Opepen</h2>
      <FeaturedGallery />
    </div>
  </div>
</template>

<script setup>
import { useSets } from '~/helpers/sets'
import pad from '~/helpers/pad'
import { useIntervalFn, useWindowSize, useWindowScroll } from '@vueuse/core'

const { completeSets } = useSets()

const gallery = ref()
const { width } = useWindowSize()

const up = ref(false)
const { pause, resume } = useIntervalFn(() => {
  console.debug('intervalFn')
  if (width.value < 1056) return

  const maxY = document.scrollingElement.scrollHeight - document.documentElement.clientHeight
  if (window.scrollY === maxY) {
    up.value = true
  } else if (window.scrollY === 0) {
    up.value = false
  }

  console.debug('scrollTo')
  window.scrollTo(0, window.scrollY + (up.value ? -0.5 : 0.5))
}, 16, { immediate: false })
onMounted(() => resume())

definePageMeta({
  layout: 'empty'
})
</script>

<style lang="postcss" scoped>
  .home {
    padding: 0;
    max-width: 120rem;
    margin: 0 auto;

    > * {
      padding: var(--size-7) var(--size-5);
    }

    h2 {
      display: flex;
      justify-content: space-between;
      font-size: var(--font-md);
      line-height: 1em;
    }

    @media (--lg) {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-items: start;

      > * {
        padding: var(--size-9) var(--size-8);
        gap: var(--size-8);

        &:first-child {
          padding-left: calc(2*var(--size-8));
        }
        &:last-child {
          padding-right: calc(2*var(--size-8));
        }
      }

      .about {
        position: sticky;
        top: 0;
        min-height: 100dvh;
        justify-content: center;
      }
    }
  }

  .about {
    --gap: var(--size-8);

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: var(--gap);
    grid-auto-rows: max-content;
    container-type: inline-size;

    > div {
      display: grid;
      gap: var(--size-6);
    }

    .intro {
      gap: var(--size-4);

      > h1 {
        font-size: var(--font-title);
        display: flex;
        align-items: center;
        gap: var(--size-2);
        border-bottom: var(--border);
        padding: 0 0 var(--size-7);
        margin-bottom: var(--size-4);

        .icon {
          height: var(--font-title);
          margin-left: -0.2em;
        }
      }

      > p {
        font-family: var(--font-family-body);
        line-height: var(--line-height-lg);
        text-transform: none;
        font-weight: 500;
        font-size: var(--font-md);
      }

      > a {
        width: fit-content;
      }

      @container (min-width: 35rem) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        column-gap: var(--size-8);

        > h1 {
          grid-column: span 2;
        }

        > p {
          padding: var(--size-3) 0;
        }
      }
    }

    .stats {
      container-type: inline-size;
    }

    :deep(.timeline) {
      &:after {
        content: '';
        position: absolute;
        background: linear-gradient(to top, var(--background), var(--transparent-background));
        width: 110%;
        height: 100%;
        left: -5%;
        pointer-events: none;
        z-index: 0;
      }
    }
  }

  .gallery {
    position: relative;
    display: grid;
    gap: var(--size-4);

    > aside {
      display: grid;
      gap: var(--size-4);
    }

    @media (--lg) {
      > aside {
        gap: var(--size-7);
      }

      &:before,
      &:after {
        content: '';
        position: fixed;
        background: linear-gradient(to top, var(--background), var(--transparent-background));
        width: 50vw;
        height: 10%;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 1;
      }
      &:before {
        background: linear-gradient(to bottom, var(--background), var(--transparent-background));
        top: 0;
      }

      > h2 {
        display: none;
      }
    }
  }
</style>
