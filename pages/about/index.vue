<template>
  <PageFrameSm class="prose about">
    <h1>How Opepen works</h1>

    <p class="lead">
      A public art protocol on Ethereum by
      <NuxtLink to="https://visualizevalue.com">Visualize Value.</NuxtLink>
      One silhouette, reinterpreted by anyone, curated by its collectors.
    </p>

    <section id="token">
      <h2><NuxtLink to="#token">The token</NuxtLink></h2>
      <p>
        Opepen Edition is a collection of 16,000 tokens that all start as the same blank
        silhouette. A token stays blank until its collector opts it into a set that reaches
        consensus. Then it reveals as that set's artwork, permanently.
      </p>
      <div class="images">
        <Image image="/wireframe-light.png" />
        <Image image="/interpretations.jpg" />
      </div>
    </section>

    <section id="sets">
      <h2><NuxtLink to="#sets">Sets and editions</NuxtLink></h2>
      <p>
        Artwork enters the collection in sets. A set is 80 tokens revealed as one body of work,
        split into six edition sizes: one 1/1, four 1/4s, five 1/5s, ten 1/10s, twenty 1/20s
        and forty 1/40s.
      </p>
      <p>
        A
        <strong>print</strong>
        set uses one artwork per edition size, six in total. A
        <strong>dynamic</strong>
        set gives every one of the 80 tokens its own artwork.
      </p>
      <p>
        There is room for 200 sets. {{ completeSets.length }} are complete so far.
        <NuxtLink to="/sets">Browse the collection</NuxtLink>
      </p>
    </section>

    <section id="voting">
      <h2><NuxtLink to="#voting">Voting</NuxtLink></h2>
      <p>
        Anyone can publish a set as a
        <strong>submission</strong>
        for collectors to vote on. Collectors vote by
        <strong>opting in</strong>
        unrevealed tokens they own: the token is pledged to that submission and, if the set
        reveals, becomes one of its 80 pieces. The number of pledged tokens is the submission's
        <strong>demand</strong>
        and is counted per edition size.
      </p>
      <p>
        Submissions with enough demand are
        <strong>staged</strong>
        one at a time, at most one every three days, for a 72-hour consensus window. To reveal,
        a staged submission needs at least 1, 4, 5, 10, 20 and 40 opted-in tokens in the
        matching edition sizes. Demand in one size cannot fill another. If the window closes
        short, the submission is not revealed and the pledged tokens stay blank, free to vote
        again.
      </p>
      <p>
        Which token receives which piece is seeded by a future Ethereum block, so nobody
        chooses.
        <NuxtLink to="/submissions">See the current candidates</NuxtLink>
      </p>
    </section>

    <section id="roles" class="roles">
      <h2><NuxtLink to="#roles">Three ways in</NuxtLink></h2>
      <div class="role-grid">
        <article>
          <h3>Collect and vote</h3>
          <p>
            Hold an unrevealed Opepen and opt it into the submissions you want to see revealed.
          </p>
          <Button to="/submissions" class="small">
            <span>Browse submissions</span>
          </Button>
        </article>
        <article>
          <h3>Create a set</h3>
          <p>
            Make six or eighty artworks on the silhouette and publish them for collectors to
            vote on. No token needed.
          </p>
          <Button to="/create" class="small">
            <span>Create a set</span>
          </Button>
        </article>
        <article>
          <h3>Contribute to a set</h3>
          <p>
            Some creators open their set to co-creation. Submit pieces and the creator picks
            which to include.
          </p>
          <Button to="/contribute" class="small">
            <span>Open sets</span>
          </Button>
        </article>
      </div>
    </section>

    <section id="opt-out">
      <h2><NuxtLink to="#opt-out">Opting out</NuxtLink></h2>
      <p>
        Collectors who want no part in consensus can burn a token. Burned tokens leave the
        voting process for good and are reissued by a separate contract. So far
        {{ formatNumber(stats?.optOuts.total || 0) }} tokens have been burned.
        <NuxtLink to="/opepen/burned">See them</NuxtLink>
      </p>
    </section>

    <section id="glossary">
      <h2><NuxtLink to="#glossary">Glossary</NuxtLink></h2>
      <dl>
        <dt>Opepen</dt>
        <dd>One of the 16,000 tokens. Blank until revealed.</dd>
        <dt>Set</dt>
        <dd>80 tokens revealed as one artwork across six edition sizes. 200 sets in total.</dd>
        <dt>Edition</dt>
        <dd>
          The size group a token belongs to: 1/1, 1/4, 1/5, 1/10, 1/20 or 1/40. The 1/1 is
          unique; forty tokens share the 1/40.
        </dd>
        <dt>Print and dynamic</dt>
        <dd>
          A print set has one artwork per edition size. A dynamic set has one artwork per
          token.
        </dd>
        <dt>Submission</dt>
        <dd>A published set that is a candidate for the collection.</dd>
        <dt>Opt-in</dt>
        <dd>A collector's vote: pledging an unrevealed token to a submission.</dd>
        <dt>Demand</dt>
        <dd>How many tokens are opted into a submission, per edition size.</dd>
        <dt>Staged</dt>
        <dd>A submission in its 72-hour consensus window.</dd>
        <dt>Consensus</dt>
        <dd>Enough demand in every edition size: 1, 4, 5, 10, 20 and 40.</dd>
        <dt>Reveal</dt>
        <dd>The moment a set's 80 tokens take on its artwork.</dd>
        <dt>Contribution</dt>
        <dd>A piece submitted to another creator's open set, included at their discretion.</dd>
        <dt>Artist signature</dt>
        <dd>An optional onchain transaction a creator can make to sign their set.</dd>
        <dt>Opt-out</dt>
        <dd>Burning a token to leave the consensus process permanently.</dd>
      </dl>
    </section>

    <section id="artists">
      <h2><NuxtLink to="#artists">Artists</NuxtLink></h2>
      <p>
        Permanent Opepen artists include
        <!-- inline-flex drops the whitespace prettier puts before the generated comma. -->
        <span v-for="artist in artistsResponse?.data" :key="artist.address" class="artist">
          <NuxtLink :to="`/${id(artist)}`">{{ artist.display }}</NuxtLink>
        </span>
        and
        <NuxtLink to="/artists">many more</NuxtLink>
      </p>
    </section>

    <section id="stats">
      <h2><NuxtLink to="#stats">Statistics</NuxtLink></h2>
      <Stats />
    </section>
  </PageFrameSm>
</template>

<script setup lang="ts">
const { completeSets } = await useSets()
const { stats } = await useStats()
const { data: artistsResponse } = await useApi(`/accounts/artists?limit=8&sort=-featured`)

useMetaData({
  title: `How Opepen Works | Opepen`,
  description: `What an Opepen is, how sets and editions work, how collectors vote, and how to take part.`,
})
</script>

<style scoped>
.about {
  section {
    display: grid;
    gap: var(--spacer);
    padding: var(--spacer-lg) 0;
    border-bottom: var(--border);

    &:last-child {
      border-bottom: 0;
    }
  }

  p {
    line-height: var(--line-height-md);
  }

  strong {
    color: var(--color);
  }

  .artist {
    display: inline-flex;

    &::after {
      content: ',';
      margin-right: 0.3em;
    }
  }
}

.images {
  display: grid;
  gap: var(--spacer);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.role-grid {
  display: grid;
  gap: var(--spacer);

  @container page (min-width: 36rem) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  article {
    display: grid;
    gap: var(--spacer-sm);
    align-content: start;
    padding: var(--spacer);
    border: var(--border);
    border-radius: var(--border-radius);
    background: var(--gray-z-1);

    h3 {
      @mixin ui-font;
    }

    p {
      font-size: var(--font-base);
      color: var(--muted);
    }

    .button {
      margin-top: auto;
    }
  }
}

dl {
  display: grid;
  gap: var(--spacer-sm) var(--spacer);
  font-size: var(--font-base);

  @container page (min-width: 36rem) {
    grid-template-columns: max-content 1fr;
  }

  dt {
    @mixin ui-font;
  }

  dd {
    color: var(--muted);
    margin: 0 0 var(--spacer-sm);

    @container page (min-width: 36rem) {
      margin: 0;
    }
  }
}
</style>
