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
      </div>
      <div>
        <h2>
          <span>Infinite Remixes</span>
          <small>By Anyone</small>
        </h2>
        <Image image="/submissions.png" />
      </div>
      <div>
        <h2>
          <span>200 Final Sets</span>
          <small>By Collector Vote</small>
        </h2>
        <Image image="/sets.png" />
      </div>
    </section>

    <hr>

    <section class="prose">
      <p>
        Opepen is an early manifestation of a digital museum - an open art protocol inviting participation from anyone.
        A network of curators form consensus on which artworks to add to the Permanent Collection.
      </p>
      <Button to="/about/intro" class="link-button">
        <span>Learn more</span>
        <Icon type="chevron-right" />
      </Button>
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
        <Button to="/community/artists" class="small">
          <span>Browse more</span>
        </Button>
      </header>
      <ProfileCardGrid :accounts="artistsResponse.data" />
    </section>

  </PageFrameSm>
</template>

<script setup>
const { data: artistsResponse } = await useApi(`/accounts/artists?limit=8&sort=-featured`)


const { featuredSets, fetchSets, loaded } = useSets()
if (! loaded.value) await fetchSets()
const featuredSubmissions = computed(() => featuredSets.value.map(s => s.submission))
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
        font-size: var(--font-md);
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

  .sets,
  .artists {
    display: grid;
    gap: var(--spacer);
  }
}
</style>

