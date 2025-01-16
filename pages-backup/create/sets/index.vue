<template>
  <div>
    <PageHeader>
      <SectionTitle>My Sets</SectionTitle>

      <Button to="/create/sets/submit">
        <Icon type="plus" />
        <span>New</span>
      </Button>
    </PageHeader>

    <div class="submissions">
      <MySetSubmissions />
    </div>
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: 'My set submissions',
})
</script>

<style scoped>
div {
  display: grid;
  gap: var(--size-4);
  grid-auto-rows: min-content;
}
</style>
