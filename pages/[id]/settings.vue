<template>
  <PageFrameSm>
    <IsAuthenticated>
      <AccountSettingsForm :id="$route.params.id" />
    </IsAuthenticated>
  </PageFrameSm>
</template>

<script setup>
useMetaData({
  title: `Account Settings | Opepen`,
})
</script>
