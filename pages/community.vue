<template>

  <div>
    <MainMobileTopNavItems
      :items="[
        {
          to: '/community/artists',
          text: 'Artists',
        },
        {
          to: '/community/collectors',
          text: 'Collectors',
        },
      ]"
    />

    <NuxtPage />
  </div>

</template>

