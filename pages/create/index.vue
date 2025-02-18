<template>
  <PageFrameSm>
    <PageHeader>
      <SectionTitle>My Sets</SectionTitle>

      <Button to="/create/new">
        <Icon type="plus" />
        <span>New</span>
      </Button>
    </PageHeader>

    <MySetSubmissions />
  </PageFrameSm>
</template>

<script setup>
useMetaData({
  title: `My Set Submissions | Opepen`,
})
</script>

