<template>
  <div>
    <!-- <FeaturedSetSubmissionsCarousel /> -->

    <ExploreSetSubmissions
      :limit="24"
      :auto-load="true"
      title="Explore Submissions"
    >
      <template #after>
        <div class="explore-link">
          <Button>
            <Icon type="chevron-right" />
            <span>Explore</span>
          </Button>
        </div>
      </template>
    </ExploreSetSubmissions>
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: 'Explore Opepen Submissions',
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
:deep(section > h1) {
  /* max-width: var(--content-width);
  margin-left: auto;
  margin-right: auto; */
  margin-top: 0;
}
</style>
