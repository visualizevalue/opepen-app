<template>
  <div class="home">
    <div class="inner">
      <div class="illustration">
        <div class="schematics">
          <OpepenSchematics />
        </div>
      </div>

      <div>
        <section class="intro">
          <h1>
            <span>An Open Canvas</span>
            <small>art that makes artists</small>
            <!-- <small>“Every block of stone has a statue inside it and it is the task of the sculptor to discover it.” <span class="muted">- Michelangelo</span></small> -->
          </h1>
          <div :style="{ width: width ? `${width}px` : 'auto' }" class="space-mono">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSets } from '~/helpers/sets'

const { completeSets } = useSets()
</script>

<style lang="postcss" scoped>
  .home {
    padding: var(--navbar-height) 0 0;

    .inner {
      border-top: var(--border-dark);

      @media (--md) {
        display: grid;
        grid-template-columns: auto 1fr;
      }
    }
  }

  .illustration {
    display: flex;
    justify-content: center;
    align-items: center;

    @media (--md) {
      width: 50vw;
      height: calc(100dvh - var(--navbar-height));
      padding-bottom: var(--size-6);
      border-right: var(--border-dark);
      position: sticky;
      top: var(--navbar-height);
    }
  }

  .schematics {
    position: relative;
    width: 80%;

    svg {
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
    padding: var(--size-5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;

    @media (--lg) {
      padding: var(--size-9);
    }

    h1 {
      color: var(--gray-z-8);
      margin: 0 0 var(--size-8);

      > span,
      > small {
        line-height: var(--line-height-md);
        display: inline-block;
      }

      > span {
        font-family: var(--font-family-opepen);
        font-size: var(--font-display);
        letter-spacing: 0.05em;
        line-height: 1;
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
    }

    p {
      margin: 0 auto var(--size-4);
      line-height: var(--line-height-md);
      font-size: calc(var(--font-lg) * 0.9);
      max-width: 34rem;
      max-width: min(calc(var(--size-7)*21 + 1vw * 2), calc(var(--size-9)*20));
      font-family: 'Space Mono';
      text-transform: none;
    }

    .actions {
      margin: var(--size-9) 0;
      display: flex;
      gap: var(--size-4);
      align-items: center;

      @media (--md) {
        margin: var(--size-9) 0 0;
      }
    }
  }
</style>
