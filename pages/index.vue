<template>
  <PageFrameMd class="home">
    <header class="hero">
      <h1>Opepen</h1>
      <p>One symbol. Infinite remixes. 200 final sets.</p>
      <nav aria-label="Start here">
        <Button to="/about" class="primary">How It Works</Button>
        <Button to="/sets">Browse Collection</Button>
      </nav>
    </header>

    <section class="duo">
      <figure>
        <Image image="/wireframe.svg" />
        <figcaption>One symbol</figcaption>
      </figure>
      <figure>
        <Image image="/remixes.webp" />
        <figcaption>Infinite remixes</figcaption>
      </figure>
    </section>

    <section class="figures">
      <NuxtLink to="/sets">
        <strong>
          {{ completeSets.length }}
          <small>/ 200</small>
        </strong>
        <span>Sets</span>
      </NuxtLink>
      <NuxtLink to="/submissions">
        <strong>{{ formatNumber(stats?.submissions.sets) }}</strong>
        <span>Submissions</span>
      </NuxtLink>
      <NuxtLink to="/artists">
        <strong>{{ formatNumber(stats?.users.artists) }}</strong>
        <span>Artists</span>
      </NuxtLink>
      <div>
        <strong>{{ formatNumber(stats?.users.holders) }}</strong>
        <span>Collectors</span>
      </div>
    </section>

    <section>
      <header class="section-header">
        <h2>Featured Sets</h2>
        <NuxtLink to="/sets">See All</NuxtLink>
      </header>
      <SetCardGrid :submissions="featuredSubmissions" />
    </section>

    <section>
      <header class="section-header">
        <h2>Featured Artists</h2>
        <NuxtLink to="/artists">See All</NuxtLink>
      </header>
      <ProfileCardGrid :accounts="featuredArtists" />
    </section>
  </PageFrameMd>
</template>

<script setup>
const { data: artistsResponse } = await useApi(`/accounts/artists?limit=8&sort=-featured`)
const { data: additionalArtistResponse } = await useApi(
  `/accounts/artists?limit=1&filter[address]=0xc8404bdf586b617298c06b8acd398baf5a407377`,
)
const featuredArtists = computed(() => [
  ...(artistsResponse.value?.data || []),
  ...(additionalArtistResponse.value?.data || []),
])

const PINNED_SET_IDS = [83, 71]

const { featuredSets, completeSets, setsById } = await useSets()
const featuredSubmissions = computed(() => {
  // 11x11 and Zoopepen lead. Both come from the sets list: fetching 11x11 on
  // its own pulled every contribution with it and put megabytes in the page.
  const pinned = PINNED_SET_IDS.map((id) => setsById.value[id]?.submission).filter(Boolean)
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
.home {
  gap: var(--size-8);

  > section {
    display: grid;
    gap: var(--spacer);
  }
}

.hero {
  display: grid;
  gap: var(--size-3);
  padding-top: clamp(var(--spacer), 6cqw, var(--size-9));

  h1 {
    font-family: var(--font-family-brand);
    text-transform: uppercase;
    font-size: clamp(2.5rem, 9cqw, 4.5rem);
    font-weight: 400;
    letter-spacing: var(--brand-letter-spacing);
    line-height: 1;
  }

  p {
    color: var(--muted);
    font-size: clamp(var(--font-lg), 3cqw, 1.5rem);
    letter-spacing: var(--letter-spacing-sm);
    line-height: 1.25;
  }

  nav {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-2);
    margin-top: var(--size-3);
  }

  .button {
    min-height: 2.75rem;
    padding-inline: var(--size-5);
  }
}

.home > .duo {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacer);

  figure {
    display: grid;
    gap: var(--size-2);
    margin: 0;
  }

  :deep(.image .inner) {
    border-radius: var(--border-radius-lg);
  }

  figcaption {
    color: var(--muted);
    font-family: var(--font-family-brand);
    font-size: var(--label-font-size);
    font-weight: 400;
    letter-spacing: var(--label-letter-spacing);
    text-transform: uppercase;
  }
}

.home > .figures {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--size-3);

  @container page (min-width: 40rem) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  > * {
    display: grid;
    gap: 2px;
    padding: var(--spacer);
    border-radius: var(--border-radius-lg);
    background: var(--gray-z-1);
    transition: background var(--speed);
  }

  > a:hover {
    background: var(--gray-z-2);
  }

  strong {
    font-family: var(--font-family-brand);
    text-transform: uppercase;
    font-size: var(--font-xl);
    font-weight: 400;
    letter-spacing: var(--brand-letter-spacing);
    font-variant-numeric: tabular-nums;
    line-height: 1.15;

    small {
      color: var(--gray-z-5);
      font-size: 0.6em;
      font-weight: var(--font-weight-medium);
    }
  }

  span {
    color: var(--muted);
    font-family: var(--font-family-brand);
    font-size: var(--label-font-size);
    font-weight: 400;
    letter-spacing: var(--label-letter-spacing);
    text-transform: uppercase;
  }
}
</style>
