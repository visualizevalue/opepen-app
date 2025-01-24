<template>

  <div>
    <MainMobileTopNavItems
      :items="[
        {
          to: '/about/intro',
          text: 'About',
        },
        {
          to: '/about/stats',
          text: 'Stats',
        },
      ]"
    />

    <NuxtPage />
  </div>

</template>

