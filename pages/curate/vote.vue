<template>
  <div class="vote">
    <CurateOpepen />

    <TertiaryNav class="hidden-sm">
      <p>183 curated</p>
      <p>13,556 to curate</p>
    </TertiaryNav>
  </div>
</template>

<style lang="postcss" scoped>
.vote {
  height: 100%;
  padding-top: var(--navbar-height);

  @media (--md) {
    padding-top: 0;
  }
}
</style>
