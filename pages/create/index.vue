<template>
  <PageFrameMd>
    <PageHeader>
      <SectionTitle>My Sets</SectionTitle>

      <Button to="/create/new" class="small">
        <Icon type="plus" />
        <span>New</span>
      </Button>
    </PageHeader>

    <MySetSubmissions />
  </PageFrameMd>
</template>

<script setup>
useMetaData({
  title: `My Set Submissions | Opepen`,
})
</script>

