<template>
  <PageFrameMd>
    <!-- TODO: Add Curation -->

    <Alert type="muted" dismiss="explain-set-submissions">
      <h1>Set Submissions</h1>
      <p>
        The Opepen collection consists of 16.000 unique tokens on the Ethereum blockchain
        that are revealed in "sets" (batches of 80 tokens) as more and more artists
        contribute to the protocol and curators vote on the inclusion of art
        in the permanent collection.
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

