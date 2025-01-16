<template>
  <nav>

    <WithAccount v-slot="{ address }">
      <MainSideProfile :address="address" />
    </WithAccount>

    <section>
      <h1>About</h1>

      <MainSideNavLink
        to="/"
        title="The Opepen Protocol"
        subline="Learn how Opepen works"
      />
      <MainSideNavLink
        to="/stats"
        title="Stats"
        subline="Marketplace, Sales, Recent Transactions"
      />
    </section>

    <section>
      <h1>Browse</h1>

      <MainSideNavLink
        to="/permanent"
        title="Permanent Collection"
        subline="Browse Opepen Sets and Tokens"
      />
      <MainSideNavLink
        title="Submissions"
        to="/submissions"
        subline="View submitted Opepen"
      />
      <MainSideNavLink
        to="/listings"
        title="Listings"
        subline="Aggregated Marketplace Listings"
      />
      <MainSideNavLink
        to="/burned"
        title="Burned Opepen"
        subline="All Opepen that have been destroyed"
      />
    </section>

    <section>
      <h1>Submit</h1>

      <MainSideNavLink
        to="/create/set"
        title="Create Set"
        subline="Submit an Opepen Set of 6 editions"
      />
      <MainSideNavLink
        to="/create/single"
        title="Post Single"
        subline="Post a single Opepen artifact"
      />
    </section>

    <section>
      <h1>Community</h1>

      <MainSideNavLink
        to="/artists"
        title="Artists"
        subline="Browse Opepen Contributors"
      />
      <MainSideNavLink
        to="/collectors"
        title="Collectors"
        subline="View the network of Opepen Collectors"
      />
      <MainSideNavLink
        to="/curate"
        title="Curate"
        subline="Vote on Submissions"
      />
    </section>

  </nav>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()
const aspectRatio = computed(() => width.value / height.value)

const isDesktop = computed(() => width.value >= 1024)
</script>

<style scoped>
nav {
  background: var(--gray-z-0);
  overscroll-behavior: auto;
}

section {
  padding: var(--spacer-lg);
  border-bottom: var(--border);

  > h1 {
    @mixin ui-font;
    color: var(--gray-z-5);
    margin-bottom: var(--spacer);
  }
}
</style>

