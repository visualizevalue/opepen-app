<template>
  <div>
    <FeaturedSetSubmissionsCarousel />

    <ExploreSetSubmissions
      title="Active"
      status="prereveal"
      sort="-approvedAt"
      :limit="200"
      :auto-load="false"
      class="wide"
    >
      <template #default="{ items }">
        <SetPreview
          v-for="submission in items"
          :key="submission.id"
          :data="submission"
        />
      </template>
    </ExploreSetSubmissions>

    <ExploreSetSubmissions
      :limit="6"
      :auto-load="false"
      sort="-demand"
    >
      <template #after>
        <div class="explore-link">
          <Button to="/sets/explore">
            <Icon type="chevron-right" />
            <span>Explore All</span>
          </Button>
        </div>
      </template>
    </ExploreSetSubmissions>

    <section>
      <SectionTitle>Permanent Collection</SectionTitle>
      <Progress :percent="parseInt(completeSets.length / 200 * 100)">
        {{ completeSets.length }} / 200
      </Progress>
      <div class="grid">
        <SetPreview v-for="set in completeSets" :data="set.submission" :key="set.id" minimal />
      </div>
    </section>
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'
import { useSets } from '~/helpers/sets'

const { completeSets } = useSets()

useMetaData({
  title: 'Opepen Sets',
  og: 'https://opepen.nyc3.cdn.digitaloceanspaces.com/OG/sets.png',
  meta: [
    // TODO: Fix and reenable these frames
    // { property: 'fc:frame', content: 'vNext' },
    // { property: 'fc:frame:image', content: 'https://opepen.nyc3.cdn.digitaloceanspaces.com/OG/sets@frame.png' },
    // { property: 'fc:frame:button:1', content: 'View Website' },
    // { property: 'fc:frame:button:1:action', content: 'post_redirect' },
    // { property: 'fc:frame:button:2', content: 'Browse Sets' },
    // { property: 'fc:frame:post_url', content: 'https://api.opepen.art/v1/frames/sets' },
  ]
})
</script>

<style lang="postcss" scoped>
section:not(.featured),
:deep(section.featured > h1) {
  max-width: var(--content-width);
  margin-left: auto;
  margin-right: auto;
}

section {
  margin: var(--size-8) auto 0;

  &:first-child {
    margin-top: var(--size-5);

    .set-preview:not(:last-child) {
      margin-bottom: var(--size-5);
    }
  }

  h1 {
    margin: var(--size-5) 0;
  }

  .progress {
    margin: var(--size-7) 0 var(--size-8);
  }

  .grid {
    display: grid;
    gap: var(--size-5);

    article {
      width: 100%;
    }

    @media (--md) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (--lg) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
}

.explore-link {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to top, var(--background), var(--transparent-background));
  position: absolute;
  bottom: 0;
  z-index: 10;
  width: 100%;
  padding: 20rem var(--size-4) 4rem;

  .button {
    padding: var(--size-5);
  }
}
</style>
