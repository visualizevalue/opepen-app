<template>
  <PageFrameSm>
    <IsAuthenticated>
      <AccountSettingsForm :id="session?.address" />
    </IsAuthenticated>
  </PageFrameSm>
</template>

<script setup>
useMetaData({
  title: `Your Settings | Opepen`,
})
</script>
