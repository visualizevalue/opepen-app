<template>
  <div class="has-tertiary">
    <div>
      <TertiaryNav>
        <NuxtLink to="/create/sets" class="exact">
          <Icon type="opepen" />
          <span>Created</span>
        </NuxtLink>
        <NuxtLink to="/create/sets/submit">
          <Icon type="opepen-outline" />
          <span>New</span>
        </NuxtLink>
      </TertiaryNav>

      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
</script>
