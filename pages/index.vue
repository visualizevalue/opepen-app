<template>
  <PageFrameMd class="landing">
    <header class="hero">
      <p class="eyebrow">Public Art On Ethereum</p>
      <h1>Opepen Edition</h1>
      <p class="hero-summary">One symbol. Infinite remixes. 200 final sets.</p>
    </header>

    <section class="hero-video video-embed">
      <iframe
        src="https://www.youtube-nocookie.com/embed/2RF6cQCE1bA?controls=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1"
        title="Opepen"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </section>

    <section class="intro">
      <article class="intro-card">
        <header>
          <span>01</span>
          <h2>
            One Symbol
            <small>By Visualize Value</small>
          </h2>
        </header>
        <Image image="/wireframe.svg" />
        <Button
          @click="() => downloadImage('/wireframe.png', { name: 'opepen' })"
          target="_blank"
          class="small"
        >
          <Icon type="download" />
          <span>Download</span>
        </Button>
      </article>
      <article class="intro-card">
        <header>
          <span>02</span>
          <h2>
            Infinite Remixes
            <small>By Anyone</small>
          </h2>
        </header>
        <Image image="/remixes.gif" />
        <Button to="/submissions" class="small">
          <Icon type="external-link" />
          <span>Explore</span>
        </Button>
      </article>
    </section>

    <section class="prose">
      <p class="eyebrow prose-label">The protocol</p>
      <h2>Where constraint meets creativity.</h2>

      <div class="prose-copy">
        <p class="lead-copy">
          Opepen is a public art protocol by
          <span class="no-wrap">
            <NuxtLink to="https://visualizevalue.com">Visualize Value</NuxtLink>,
          </span>
          built on Ethereum. Anyone can reinterpret the silhouette; collectors vote to shape a
          permanent collection of 200 sets.
        </p>
      </div>

      <div class="protocol-status">
        <p>
          <strong>{{ completeSets.length }}</strong>
          <span>of 200 spots filled</span>
        </p>
        <p>
          <strong>{{ formatNumber(stats?.submissions.sets) }}</strong>
          <span>sets submitted</span>
        </p>
      </div>

    </section>

    <section class="sets collection-section">
      <header>
        <SectionTitle>Featured Sets</SectionTitle>
        <Button to="/sets" class="small">
          <span>Browse more</span>
        </Button>
      </header>
      <SetCardGrid :submissions="featuredSubmissions" />
    </section>

    <section class="artists collection-section">
      <header>
        <SectionTitle>Featured Artists</SectionTitle>
        <Button to="/artists" class="small">
          <span>Browse more</span>
        </Button>
      </header>
      <ProfileCardGrid :accounts="artistsResponse?.data || []" />
    </section>

    <section class="stats">
      <SectionTitle>Stats</SectionTitle>

      <Stats />
    </section>
  </PageFrameMd>
</template>

<script setup>
const { data: artistsResponse } = await useApi(`/accounts/artists?limit=8&sort=-featured`)

const { data: elevenByEleven } = await useApi(
  `/set-submissions/1ac33bf4-3afe-4c74-8963-c60646c2accc`,
)

const { featuredSets, completeSets, setsById } = await useSets()
const featuredSubmissions = computed(() => {
  const pinned = [elevenByEleven.value, setsById.value[71]?.submission].filter(Boolean)
  const pinnedIds = new Set(pinned.map((submission) => submission.uuid))

  return [
    ...pinned,
    ...featuredSets.value
      .map((set) => set.submission)
      .filter((submission) => !pinnedIds.has(submission.uuid)),
  ]
})

const { stats } = await useStats()

useMetaData({
  title: `Opepen Edition | Public Art On Ethereum`,
})
</script>

<style scoped>
.landing {
  gap: 0;

  .eyebrow {
    @mixin ui-font;
    color: var(--muted);
    font-size: var(--ui-font-size);
  }

  > .hero {
    display: grid;
    align-content: center;
    gap: var(--spacer-lg);
    min-height: clamp(18rem, 45cqw, 28rem);
    padding: clamp(var(--spacer-lg), 5cqw, 4rem) 0;
    border-bottom: var(--border);

    h1 {
      @mixin ui-font;
      font-size: clamp(2.4rem, 6cqw, 4rem);
      font-weight: var(--font-weight-medium);
      letter-spacing: var(--letter-spacing-sm);
      line-height: 1;
    }

    .hero-summary {
      max-width: 32rem;
      font-size: clamp(var(--font-lg), 2.3cqw, var(--font-xl));
      line-height: var(--line-height-md);
    }
  }

  > section {
    padding: clamp(var(--spacer-xl), 7cqw, 5rem) 0;
    border-bottom: var(--border);

    > header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  > .hero-video {
    padding: 0;
  }

  .intro {
    display: grid;
    gap: var(--spacer-xl);

    .intro-card {
      display: grid;
      gap: var(--spacer-lg);
      align-content: start;

      > header {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--spacer);
        align-items: start;
        min-height: 3rem;
        @mixin ui-font;

        > span {
          color: var(--gray-z-5);
        }
      }

      h2 {
        display: grid;
        gap: var(--spacer-xs);
        font-size: var(--font-base);

        small {
          color: var(--muted);
          font-size: 1em;
        }
      }

      > .button {
        justify-self: center;
        justify-content: center;
        width: 7.5rem;
      }
    }

    @container page (min-width: 44rem) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--spacer-lg);
    }
  }

  .prose {
    display: grid;
    gap: var(--spacer-lg);

    h2 {
      max-width: 18ch;
      font-size: clamp(var(--font-lg), 2.4cqw, 1.75rem);
      font-weight: var(--font-weight-medium);
      letter-spacing: var(--letter-spacing-sm);
      line-height: 1.05;
    }

    .prose-copy {
      display: grid;
      align-content: start;
      gap: var(--spacer-lg);

      p {
        max-width: 34rem;
        font-size: clamp(var(--font-lg), 2.2cqw, 1.5rem);
        letter-spacing: var(--letter-spacing-sm);
        line-height: 1.45;
      }
    }

    .protocol-status {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      border-top: var(--border);
      border-bottom: var(--border);

      p {
        display: grid;
        gap: var(--spacer-sm);
        padding: var(--spacer-lg) 0;
      }

      p + p {
        padding-left: var(--spacer-lg);
        border-left: var(--border);
      }

      strong {
        font-size: clamp(var(--font-xl), 5cqw, var(--font-xxl));
        font-weight: var(--font-weight-medium);
        letter-spacing: var(--letter-spacing-sm);
      }

      span {
        @mixin ui-font;
        color: var(--muted);
      }
    }

    @container page (min-width: 44rem) {
      grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
      column-gap: clamp(var(--spacer-xl), 7cqw, 5rem);

      .prose-label {
        grid-column: 1 / -1;
        margin-bottom: var(--spacer);
      }

      .protocol-status {
        grid-column: 1 / -1;
      }
    }
  }

  .video-embed {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;

    iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
  }

  .collection-section,
  .stats {
    display: grid;
    gap: var(--spacer-lg);
  }

  .stats {
    border-bottom: 0;
  }

  @container page (max-width: 32rem) {
    > .hero {
      min-height: 18rem;
    }

    .prose .prose-copy p {
      font-size: var(--font-base);
      line-height: var(--line-height-lg);
    }
  }
}
</style>
