<template>
  <PageFrameSm class="about">
    <header class="intro">
      <h1>How Opepen Works</h1>
      <p>
        16,000 tokens share one silhouette. Artists reinterpret it. Collectors vote on what
        becomes permanent.
      </p>
    </header>

    <div class="video">
      <iframe
        src="https://www.youtube-nocookie.com/embed/2RF6cQCE1bA?rel=0&modestbranding=1&iv_load_policy=3&playsinline=1"
        title="Opepen, explained"
        frameborder="0"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>

    <section id="token">
      <h2>Tokens</h2>
      <p>
        Every Opepen starts blank. It reveals when its owner opts it into a set that reaches
        consensus. Reveals are permanent.
      </p>
    </section>

    <section id="sets">
      <h2>Sets</h2>
      <p>
        A set is 80 tokens in six editions: 1, 4, 5, 10, 20 and 40. A print set has one artwork
        per edition. A dynamic set has one per token.
      </p>
      <p>There are 200 slots. {{ completeSets.length }} are filled.</p>
    </section>

    <section id="voting">
      <h2>Voting</h2>
      <p>
        Anyone can submit a set. Collectors vote by opting in unrevealed tokens. The leading
        submission is staged for 72 hours. If every edition fills, the set reveals. If not, the
        tokens stay blank.
      </p>
    </section>

    <section id="roles">
      <h2>Take Part</h2>
      <nav class="list-group">
        <NuxtLink to="/submissions">
          <span class="stack">
            <span>Vote</span>
            <span>Opt in your unrevealed Opepen</span>
          </span>
          <Icon type="chevron-right" class="chevron" />
        </NuxtLink>
        <NuxtLink to="/create">
          <span class="stack">
            <span>Create</span>
            <span>Submit a set. No token needed</span>
          </span>
          <Icon type="chevron-right" class="chevron" />
        </NuxtLink>
        <NuxtLink to="/contribute">
          <span class="stack">
            <span>Contribute</span>
            <span>Add art to an open set</span>
          </span>
          <Icon type="chevron-right" class="chevron" />
        </NuxtLink>
      </nav>
    </section>

    <section id="opt-out">
      <h2>Opting Out</h2>
      <p>
        Burn a token to leave the process for good.
        {{ formatNumber(stats?.optOuts.total || 0) }} burned so far.
      </p>
      <nav class="list-group">
        <NuxtLink to="/opepen/burned">
          <span>Burned Opepen</span>
          <Icon type="chevron-right" class="chevron" />
        </NuxtLink>
      </nav>
    </section>

    <section id="glossary">
      <h2>Glossary</h2>
      <dl class="list-group">
        <div v-for="[term, meaning] in GLOSSARY" :key="term" class="stack">
          <dt>{{ term }}</dt>
          <dd>{{ meaning }}</dd>
        </div>
      </dl>
    </section>

    <section id="stats">
      <h2>Numbers</h2>
      <Stats />
    </section>
  </PageFrameSm>
</template>

<script setup lang="ts">
const GLOSSARY = [
  ['Opepen', 'One of 16,000 tokens. Blank until revealed.'],
  ['Set', '80 tokens revealed as one body of work.'],
  ['Edition', 'A token’s group within a set: 1, 4, 5, 10, 20 or 40.'],
  ['Print', 'One artwork per edition. Six in total.'],
  ['Dynamic', 'One artwork per token. Eighty in total.'],
  ['Submission', 'A published set awaiting votes.'],
  ['Opt-in', 'A vote: pledging an unrevealed token to a submission.'],
  ['Demand', 'Tokens opted into a submission, counted per edition.'],
  ['Staged', 'In its 72-hour voting window.'],
  ['Consensus', 'Every edition filled.'],
  ['Reveal', 'A set’s tokens take on its artwork.'],
  ['Contribution', 'A piece offered to another creator’s set.'],
  ['Opt-out', 'Burning a token to leave for good.'],
]

const { completeSets } = await useSets()
const { stats } = await useStats()

useMetaData({
  title: `How Opepen Works | Opepen`,
  description: `What an Opepen is, how sets and editions work, how collectors vote, and how to take part.`,
})
</script>

<style scoped>
.about {
  gap: var(--size-7);
  padding-bottom: var(--spacer-lg);

  @media (--md) {
    gap: var(--size-8);
  }

  section {
    display: grid;
    gap: var(--size-3);
    scroll-margin-top: calc(var(--top-nav-height) + var(--spacer));
  }

  h2 {
    font-family: var(--font-family-brand);
    text-transform: uppercase;
    font-size: 1.375rem;
    font-weight: 400;
    letter-spacing: var(--brand-letter-spacing);
  }

  p {
    font-size: 1.0625rem;
    line-height: 1.45;
    color: var(--gray-z-7);
  }
}

.intro {
  display: grid;
  gap: var(--size-3);
  padding-top: var(--spacer);

  h1 {
    font-family: var(--font-family-brand);
    text-transform: uppercase;
    font-size: clamp(var(--font-xl), 7cqw, 2.75rem);
    font-weight: 400;
    letter-spacing: var(--brand-letter-spacing);
    line-height: 1.05;
  }

  p {
    color: var(--muted);
    font-size: var(--font-lg);
    letter-spacing: var(--letter-spacing-sm);
    line-height: 1.3;
  }
}

.video {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: var(--border-radius-lg);
  background: var(--gray-z-1);

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
}

dl {
  /* Each row is the stack itself: dt and dd must sit directly in the div. */
  .stack {
    align-content: center;
  }

  dt {
    font-weight: var(--font-weight-medium);
  }

  dd {
    margin: 0;
  }
}
</style>
