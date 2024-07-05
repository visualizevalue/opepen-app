<template>
  <div>
    <PageHeader>
      <SectionTitle>My Single Posts</SectionTitle>

      <Button to="/create/singles/submit">
        <Icon type="plus" />
        <span>New</span>
      </Button>
    </PageHeader>
    <MySinglePosts />
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: 'Single Opepen Posts',
})
</script>

<style lang="postcss" scoped>
div {
  display: grid;
  gap: var(--size-4);
  grid-auto-rows: min-content;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.submissions {
  max-width: var(--content-width);
  margin: 0 auto;
}
</style>
