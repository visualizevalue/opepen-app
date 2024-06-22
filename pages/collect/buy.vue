<template>
  <div class="has-secondary">
    <TertiaryNav>
      <NuxtLink to="/collect/buy/unrevealed">
        <Icon type="opepen-outline" />
        <span>Unrevealed</span>
      </NuxtLink>
      <NuxtLink to="/collect/buy/revealed">
        <Icon type="opepen" />
        <span>Revealed</span>
      </NuxtLink>
    </TertiaryNav>

    <NuxtPage />
  </div>
</template>

<script setup>
</script>

<style lang="postcss" scoped>
</style>
