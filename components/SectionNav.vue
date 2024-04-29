<template>
  <nav class="section-nav">
    <div>
      <slot />
    </div>
  </nav>
</template>

<style lang="postcss" scoped>
nav {
  position: sticky;
  top: var(--navbar-height);
  z-index: 40;
  background: var(--semi);
  backdrop-filter: var(--blur);

  /* SCROLLING */
  overflow-x: auto;
  -webkit-overflow-scrolling: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

nav > div {
  max-width: var(--content-width);
  margin-left: auto;
  margin-right: auto;

  font-size: var(--font-md);
  display: flex;
  gap: var(--size-7);
  padding: var(--size-5) 0;
  margin: 0 auto;
  width: 100%;
  line-height: 1;
  white-space: nowrap;

  :deep(a) {
    &::after {
      display: none;
    }
  }
}
</style>

<style lang="postcss">
.full .section-nav {
  padding-left: var(--container-padding-x);
  padding-right: var(--container-padding-x);
  border-bottom: var(--border);
}
</style>
