<template>
  <main>
    <div class="inner">
      <PostCreate />
    </div>
  </main>
</template>

<style lang="postcss" scoped>
main {
  padding: 0;
  min-height: var(--100vh);
}

.inner {
  width: 100%;
  max-width: var(--content-width-sm);
  min-height: var(--100vh);
  padding-top: var(--navbar-height);

  @media (--content-sm) {
    border-left: var(--border);
    border-right: var(--border);
    margin: 0 auto;
  }
}

.create {
  min-height: 10rem;
  border-bottom: var(--border);
}
</style>
