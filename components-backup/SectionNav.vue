<template>
  <nav class="section-nav">
    <div>
      <slot />
    </div>
  </nav>
</template>

<style scoped>
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
    position: relative;
    padding: 0 var(--size-2);

    &::after {
      content: '';
      position: absolute;
      background: transparent;
      border-radius: var(--size-2);
      width: 100%;
      height: var(--size-1);
      bottom: calc(-1 * var(--size-5) - var(--size-1)/2);
      left: 0;
      z-index: 40;
    }

    &.router-link-exact-active::after {
      background: var(--gray-z-8);
    }
  }
}
</style>

<style>
.section-nav {
  border-bottom: var(--border);
}

.full .section-nav {
  padding-left: var(--container-padding-x);
  padding-right: var(--container-padding-x);
}
</style>
