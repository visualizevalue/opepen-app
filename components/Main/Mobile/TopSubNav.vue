<template>
  <nav id="top-sub-nav">
    <!-- A segmented control. The nav stays :empty when there is nothing to switch. -->
    <div v-if="items" class="segmented">
      <NuxtLink v-for="item in items" :key="item.to" :to="item.to">{{ item.text }}</NuxtLink>
    </div>
  </nav>
</template>

<script setup>
const route = useRoute()

const items = computed(() => {
  const path = route.path

  const match = Object.keys(SUB_NAV_ITEMS).find((k) => {
    const r = new RegExp(k, 'i')
    return r.test(path)
  })

  return SUB_NAV_ITEMS[match]
})
</script>

<style scoped>
.segmented {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  width: min(100% - var(--spacer) * 2, 22rem);
  padding: 2px;
  border-radius: 0.5625rem;
  background: var(--fill);
}

a {
  padding: 0.3125rem var(--size-3);
  border-radius: 0.4375rem;
  text-align: center;
  font-size: var(--font-sm);
  font-weight: var(--font-weight-medium);
  transition: background var(--speed-fast);

  &.router-link-active {
    background: var(--gray-z-4);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
}
</style>
