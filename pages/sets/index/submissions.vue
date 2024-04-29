<template>
  <div class="submissions">
    <ExploreSetSubmissions
      title="Active Countdown"
      status="prereveal"
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
      :limit="24"
      :auto-load="true"
      status="live"
      :sort="sort"
    >
      <template #before>
        <PageHeader class="full">
          <SectionTitle>Explore</SectionTitle>

          <div class="actions">

            <label>
              <span class="label">Sort</span>
              <select v-model="sort" class="input sm">
                <option value="-demand">Demand</option>
                <option value="-createdAt">Newest</option>
                <option value="createdAt">Oldest</option>
              </select>
            </label>
          </div>
        </PageHeader>
      </template>

      <template #loading="{ loading }">
        <div v-if="loading" class="loading-space">
          <Loading />
        </div>
      </template>

    </ExploreSetSubmissions>
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

const sort = ref('-demand')

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
.submissions {
  padding: 0 var(--container-padding-x);

  :deep(> section) {
    max-width: var(--content-width);
    margin-left: auto;
    margin-right: auto;
    margin-bottom: var(--size-8);
  }
}


header {
  padding: 0 0 var(--size-5);

  @media (--md) {
    padding: 0;
  }
}

label {
  display: flex;
  align-items: baseline;
  gap: var(--size-4);
}

.loading-space {
  padding: 10vh 2rem 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
