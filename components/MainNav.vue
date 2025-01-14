<template>
  <nav>

    <section>
      <MainNavProfile />
    </section>

    <section>
      <h1>About</h1>

      <MainNavLink
        to="/"
        title="The Opepen Protocol"
        subline="Learn how Opepen works"
      />
      <MainNavLink
        to="/stats"
        title="Stats"
        subline="Marketplace, Sales, Recent Transactions"
      />
    </section>

    <section>
      <h1>Browse</h1>

      <MainNavLink
        to="/stats"
        title="Permanent Collection"
        subline="Browse Opepen Sets and Tokens"
      />
      <MainNavLink
        to="/stats"
        title="Submissions"
        subline="View submitted Opepen"
      />
      <MainNavLink
        to="/stats"
        title="Listings"
        subline="Aggregated Marketplace Listings"
      />
      <MainNavLink
        to="/stats"
        title="Burned Opepen"
        subline="All Opepen that have been destroyed"
      />
    </section>

    <section>
      <h1>Submit</h1>

      <MainNavLink
        to="/stats"
        title="Create Set"
        subline="Submit an Opepen Set of 6 editions"
      />
      <MainNavLink
        to="/stats"
        title="Post Single"
        subline="Post a single Opepen artifact"
      />
    </section>

    <section>
      <h1>Community</h1>

      <MainNavLink
        to="/stats"
        title="Artists"
        subline="Browse Opepen Contributors"
      />
      <MainNavLink
        to="/stats"
        title="Collectors"
        subline="View the network of Opepen Collectors"
      />
      <MainNavLink
        to="/stats"
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

