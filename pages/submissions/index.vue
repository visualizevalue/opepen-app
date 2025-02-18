<template>
  <PageFrameMd>
    <!-- <Alert type="muted" dismiss="explain-set-submissions"> -->
    <!--   <h1>Set Submissions</h1> -->
    <!--   <p> -->
    <!--     Artists submit sets of 6 distinct editions for consideration of the community. -->
    <!--     Anyone can create an Opepen set. If sets are highly rated by curators, -->
    <!--     it will be staged for potential inclusion in the "Permanent Collection". -->
    <!--   </p> -->
    <!--   <Actions> -->
    <!--     <Button to="/about/intro" class="">Learn more</Button> -->
    <!--   </Actions> -->
    <!-- </Alert> -->

    <Actions>
      <span>Sort:</span>
      <select v-model="sort" class="select">
        <option value="-submission_stats.demand.total">Demand</option>
        <option value="-published_at">Latest</option>
        <option value="created_at">Earliest</option>
        <option value="dailyRandom">Random</option>
      </select>
    </Actions>

    <PaginatedContent
      :url="url"
      :query="query"
      v-slot="{ items }"
    >
      <SetCardGrid :submissions="items" minimal />
    </PaginatedContent>
  </PageFrameMd>
</template>

<script setup lang="ts">

const url = `${useConfig('opepenApi')}/set-submissions`
const sort = ref('-submission_stats.demand.total')
const query = computed(() => {
  const q = new URLSearchParams(`limig=40`)

  q.set('sort', sort.value)

  return q.toString()
})

useMetaData({
  title: `Set Submissions | Opepen`,
  description: ``,
  og: 'https://opepen.nyc3.cdn.digitaloceanspaces.com/OG/sets.png',
})
</script>

<style scoped>
menu {
  @mixin ui-font;
  font-size: var(--font-sm);
  align-items: center;
  justify-content: flex-end;

  span {
    color: var(--muted);
  }

  select {
    width: min-content;
    font-size: var(--font-sm);
  }
}
</style>

