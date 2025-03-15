<template>
  <PageFrameSm class="landing">
    <header>
      <h1>
        <span>Opepen Edition</span>
        <small>Public Art On Ethereum</small>
      </h1>
    </header>

    <hr>

    <section class="intro">
      <div>
        <h2>
          <span>One Symbol</span>
          <small>By Visualize Value</small>
        </h2>
        <Image image="/wireframe.svg" />
        <Button
          to="https://raw.githubusercontent.com/visualizevalue/opepen-api/refs/heads/main/app/Services/OpepenSVG/opepen-schematics.svg"
          target="_blank"
          class="small centered"
        >
          <Icon type="external-link" />
          <span>Download</span>
        </Button>
      </div>
      <div>
        <h2>
          <span>Infinite Remixes</span>
          <small>By Anyone</small>
        </h2>
        <Image image="/submissions.png" />
        <Button
          to="/submissions"
          class="small centered"
        >
          <Icon type="external-link" />
          <span>Explore</span>
        </Button>
      </div>
      <div>
        <h2>
          <span>200 Final Sets</span>
          <small>By Collector Vote</small>
        </h2>
        <Image image="/sets.png" />
        <Button
          to="/sets"
          class="small centered"
        >
          <Icon type="external-link" />
          <span>Browse</span>
        </Button>
      </div>
    </section>

    <hr>

    <section class="prose">
      <h2>Where constraint meets creativity.</h2>

      <p>
        Opepen Edition is a public art protocol on Ethereum <span class="no-wrap">by <NuxtLink to="https://visualizevalue.com">Visualize Value</NuxtLink></span>.
      </p>

      <p>
        Creators submit their interpretations of the Opepen silhouette. <br />
      </p>
      <p>
        Collectors vote on the artwork to include in the permanent collection.
      </p>

      <p>
        There are 200 spots. {{ completeSets.length }} have been filled. <br>
        {{ formatNumber(stats?.submissions.sets) }} sets have been submitted.
      </p>

      <!-- <Button to="/about/intro" class="link-button"> -->
      <!--   <span>Learn more</span> -->
      <!--   <Icon type="chevron-right" /> -->
      <!-- </Button> -->
    </section>

    <hr>

    <section class="sets">
      <header>
        <SectionTitle>Featured Sets</SectionTitle>
        <Button to="/sets" class="small">
          <span>Browse more</span>
        </Button>
      </header>
      <SetCardGrid :submissions="featuredSubmissions" minimal />
    </section>

    <section class="artists">
      <header>
        <SectionTitle>Featured Artists</SectionTitle>
        <Button to="/artists" class="small">
          <span>Browse more</span>
        </Button>
      </header>
      <ProfileCardGrid :accounts="artistsResponse.data" />
    </section>

    <hr>

    <section class="stats">
      <SectionTitle>Stats</SectionTitle>

      <Stats />
    </section>

  </PageFrameSm>
</template>

<script setup>
const { data: artistsResponse } = await useApi(`/accounts/artists?limit=8&sort=-featured`)

const { featuredSets, completeSets } = await useSets()
const featuredSubmissions = computed(() => featuredSets.value.map(s => s.submission))

const { stats } = await useStats()

useMetaData({
  title: `Opepen Edition | Public Art On Ethereum`,
})
</script>

<style scoped>
.landing {
  > header,
  > .intro {
    h1,
    h2,
    p {
      @mixin ui-font;
      font-size: var(--font-lg);
      line-height: 1em;

      small {
        font-size: 1em;
        color: var(--muted);
      }
    }
  }

  > header h1 {
    display: grid;
    gap: var(--spacer-sm);
    justify-content: center;
    text-align: center;
    padding: var(--spacer-lg) 0 calc(var(--spacer-lg) + var(--spacer));
    padding: var(--spacer-lg) 0;

    @container (min-width: 30rem) {
      display: flex;
      justify-content: space-between;
      text-align: left;
    }
  }

  > section {
    padding: var(--spacer-xl) 0;

    > header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .intro {
    display: grid;
    gap: var(--spacer-xl);

    > div {
      display: grid;
      gap: var(--spacer);
      justify-content: center;
      align-items: flex-start;
      text-align: center;

      h2 {
        display: grid;
        font-size: var(--font-base);
        gap: var(--spacer-xs);
      }

      > * {
        width: min(69cqw, 20rem);
      }
    }

    @container (min-width: 38rem) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--spacer-lg);
      /* padding: var(--spacer-lg) 0; */

      > div {
        > * {
          width: calc(33cqw - var(--spacer));
        }
      }
    }
  }

  .prose {
    font-size: var(--font-base);
    text-align: center;
    padding-left: var(--spacer-lg);
    padding-right: var(--spacer-lg);

    @media (--md) {
      padding-left: 0;
      padding-right: 0;
    }

    h2 {
      font-size: var(--ui-font-size);
      margin-bottom: var(--spacer-lg);
    }

    p {
      font-size: var(--font-base);
      line-height: var(--line-height-lg);
      margin-bottom: var(--spacer);

      @media (--md) {
        --font-lg: 1.1rem;
        font-size: var(--font-lg);
      }
    }
  }

  .sets,
  .artists,
  .stats {
    display: grid;
    gap: var(--spacer);
  }

  hr {
    width: calc(100% + var(--spacer)*2);
    margin-left: calc(-1*var(--spacer));

    @media (--md) {
      width: 100%;
      margin-left: 0;
    }
  }
}
</style>

