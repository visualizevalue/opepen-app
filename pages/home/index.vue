<template>
  <main>
    <div class="inner">
      <PostCreate @created="extra.push($event)" />
      <PostTimeline :extra-items="extra" />
    </div>
  </main>
</template>

<script setup>
const extra = ref([])
</script>

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
  /* padding-top: 0; */

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
