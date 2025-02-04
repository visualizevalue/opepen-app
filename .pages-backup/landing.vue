<template>
  <div class="home">
    <section class="about">
      <div class="intro">
        <p>Opepen is an early manifestation of a digital museum - an open art protocol inviting participation from anyone.</p>
        <p>Collectors of 16.000 cryptographic tokens form consensus on the artwork for the Permanent Collection.</p>

        <StyledLink to="/curate/view/all">View Submissions</StyledLink>
        <StyledLink to="/curate/view/permanent">View Permanent Collection</StyledLink>
        <StyledLink to="/curate/vote">Curate Opepen</StyledLink>
        <StyledLink to="/create/singles">Submit an Opepen</StyledLink>
      </div>

      <div class="permanent">
        <h2>
          <span>Permanent Collection</span>
          <span>{{ pad(completeSets.length, 3) }}/200</span>
        </h2>

        <Progress :percent="parseInt(completeSets.length / 200 * 100)" />
      </div>

      <div class="stats">
        <StatsOverview />
      </div>
    </section>

    <div class="gallery">
      <h2>Explore Opepen</h2>
      <FeaturedGallery />
    </div>
  </div>
</template>

<script setup>
import { useSets } from '~/helpers/sets'
import pad from '~/helpers/pad'

const { completeSets } = useSets()
</script>

<style scoped>
  .home {
    padding: var(--navbar-height) 0 0;
    max-width: 120rem;
    margin: 0 auto;

    .logo {
      position: absolute;
      top: calc(-1 * var(--navbar-height) + var(--size-5));

      @media (--lg) {
        position: static;
        top: 0;
      }
    }

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
      padding: 0;

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
        padding-top: calc(var(--navbar-height) + var(--size-9));
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
        font-family: var(--font-family);
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

    :deep(.opt-in-timeline) {
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
