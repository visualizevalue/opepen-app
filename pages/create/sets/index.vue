<template>
  <div>
    <PageHeader>
      <h1 class="breadcrumb">
        <!-- <NuxtLink to="/create">Create</NuxtLink> -->
        <span>Create</span>
        <span class="separator">/</span>
        <span>My Submissions</span>
      </h1>

      <div class="actions">
        <AdminLink class="secondary" />

        <Button to="/create/sets/submit">
          <Icon type="plus" />
          <span>New Set</span>
        </Button>
      </div>
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

<style lang="postcss" scoped>
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
