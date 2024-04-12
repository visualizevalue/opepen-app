<template>
  <div class="home">
    <div class="schematics">
      <OpepenSchematics />
    </div>

    <section class="intro">
      <h1>
        <span ref="heading">An Open Canvas</span>
        <small>art that makes artists</small>
        <!-- <small>“Every block of stone has a statue inside it and it is the task of the sculptor to discover it.” <span class="muted">- Michelangelo</span></small> -->
      </h1>
      <div :style="{ width: width ? `${width}px` : 'auto' }">
        <p>Culture is the sum of shared values, traditions, and expressions. It offers a lens through which we interpret our experiences and shape our collective identity. In the digital age, culture and memes have transcended traditional boundaries.</p>
        <p>Opepen is an early manifestation of a digital museum - an open art protocol inviting participation from all over the world. Hundreds of artists contribute their interpretations of the Opepen shape.</p>
        <p>Holders of a collection of 16.000 cryptographic tokens have to form consensus on which of the submitted artworks get included in the "Permanent Collection". The "Permanent Collection" consists of 200 sets - {{ completeSets.length }} of which have already been decided on.</p>

        <div class="actions">
          <Button to="/sets">
            <span>Permanent Collection</span>
            <Icon type="chevron-right" />
          </Button>
          <Button to="/sets/explore">
            <span>Set Submissions</span>
            <Icon type="chevron-right" />
          </Button>
        </div>
      </div>
    </section>

    <FeaturedSetSubmissionsCarousel>
      <template #title>Curated Submissions</template>
    </FeaturedSetSubmissionsCarousel>

    <PermanentCollectionOverview />
  </div>
</template>

<script setup>
import { useElementSize } from '@vueuse/core'
import { useSets } from '~/helpers/sets'

const heading = ref(null)
const { width } = useElementSize(heading)

const { completeSets } = useSets()
</script>

<style lang="postcss" scoped>
  .schematics {
    width: 100%;
    max-width: min(24rem, 40vh);
    margin: calc(-1 * var(--navbar-height)) auto 0;
    position: relative;
    z-index: -1;

    svg {
      margin-bottom: -20%;
      width: 100%;
    }

    &:after {
      content: '';
      position: absolute;
      z-index: 1;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      box-shadow: inset 0 0 3rem 1rem var(--background);
      background: linear-gradient(to bottom, var(--transparent-background) 75%, var(--background));
    }
  }

  .intro {
    margin: 8vh auto var(--size-9);

    h1 {
      color: var(--gray-z-8);
      margin: 0 0 var(--size-8);
      text-align: center;

      > span,
      > small {
        line-height: var(--line-height-md);
        margin-left: auto;
        margin-right: auto;
        display: inline-block;
      }

      > span {
        font-family: var(--font-family-opepen);
        font-size: var(--font-display);
        letter-spacing: 0.05em;
      }

      > small {
        display: block;
        font-size: var(--font-lg);
        margin-top: 0.5em;
        max-width: 30rem;

        .muted {
          color: var(--gray-z-6);
        }
      }
    }

    h1 + div {
      margin: 0 auto;
      text-align: justify;
    }

    p {
      margin: 0 auto var(--size-4);
      line-height: var(--line-height-md);
      font-size: var(--font-lg);
      max-width: 34rem;
      max-width: min(calc(var(--size-7)*21 + 1vw * 2), calc(var(--size-9)*20))
    }

    .actions {
      margin: var(--size-9) 0;
      display: flex;
      gap: var(--size-4);
      justify-content: center;
      align-items: center;
    }
  }

  .permanent-collection,
  .gallery {
    max-width: var(--content-width);
    margin: var(--size-9) auto;
  }
</style>
