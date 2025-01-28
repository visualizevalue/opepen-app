<template>
  <div class="full">
    <SecondaryNav>
      <NuxtLink to="/curate/vote">
        <Icon type="check" />
        <span>Vote</span>
      </NuxtLink>
      <NuxtLink to="/curate/view">
        <Icon type="opepen-eye" />
        <span>View</span>
      </NuxtLink>
      <NuxtLink to="/curate/nodes">
        <Icon type="opepen" />
        <span>Nodes</span>
      </NuxtLink>
    </SecondaryNav>

    <NuxtPage />
  </div>
</template>

<style scoped>
</style>
