<template>
  <PageFrameMd>
    <!-- TODO: Add Curation -->

    <Alert type="muted" dismiss="explain-set-submissions">
      <h1>Set Submissions</h1>
      <p>
        Artists submit sets of 6 distinct editions for consideration of the community.
        Anyone can create an Opepen set. If sets are highly rated by curators,
        it will be staged for potential inclusion in the "Permanent Collection".
      </p>
      <Actions>
        <Button to="/about/intro" class="">Learn more</Button>
      </Actions>
    </Alert>

    <PaginatedContent
      :url="url"
      v-slot="{ items }"
    >
      <SetCardGrid :submissions="items" minimal />
    </PaginatedContent>
  </PageFrameMd>
</template>

<script setup>
const config = useRuntimeConfig()
const url = `${config.public.opepenApi}/set-submissions?limit=40`

useMetaData({
  title: `Set Submissions | Opepen`,
  description: ``,
  og: 'https://opepen.nyc3.cdn.digitaloceanspaces.com/OG/sets.png',
})
</script>

