<template>
  <div>
    <h1>View</h1>

    <TertiaryNav>
      <NuxtLink to="/curate/view/mine">
        <Icon type="infinity" />
        <span>Mine</span>
      </NuxtLink>
      <NuxtLink to="/curate/view/all">
        <Icon type="infinity-flower" />
        <span>All</span>
      </NuxtLink>
    </TertiaryNav>

    <NuxtPage />
  </div>
</template>

