<template>

  <div>
    <NuxtLayout name="default">
      <MainMobileTopNavItems
        :items="[
          {
            to: '/sets',
            text: 'Sets',
          },
          {
            to: '/submissions',
            text: 'Submissions',
          },
        ]"
      />

      <NuxtPage />
    </NuxtLayout>
  </div>


</template>
