<template>
  <section>
    <PageHeader>
      <h1 class="breadcrumb">
        <span>Set Submission Stats</span>
      </h1>
    </PageHeader>

    <div class="stats">
      <table>
        <thead>
          <tr>
            <td>Edition</td>
            <td>Demand</td>
            <td>Percent</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1/1</td>
            <td>{{ stats.demand['1'] }}</td>
            <td>{{ stats.demand['1']/1 * 100 }}%</td>
          </tr>
          <tr>
            <td>1/4</td>
            <td>{{ stats.demand['4'] }}</td>
            <td>{{ stats.demand['4']/4 * 100 }}%</td>
          </tr>
          <tr>
            <td>1/5</td>
            <td>{{ stats.demand['5'] }}</td>
            <td>{{ stats.demand['5']/5 * 100 }}%</td>
          </tr>
          <tr>
            <td>1/10</td>
            <td>{{ stats.demand['10'] }}</td>
            <td>{{ stats.demand['10']/10 * 100 }}%</td>
          </tr>
          <tr>
            <td>1/20</td>
            <td>{{ stats.demand['20'] }}</td>
            <td>{{ stats.demand['20']/20 * 100 }}%</td>
          </tr>
          <tr>
            <td>1/40</td>
            <td>{{ stats.demand['40'] }}</td>
            <td>{{ stats.demand['40']/40 * 100 }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
const config = useRuntimeConfig()
const { data, refresh } = await useFetch(`${config.public.opepenApi}/set-submissions/curated`)
const stats = computed(() => data.value?.submission?.submission_stats)

onMounted(() => {
  setInterval(() => {
    refresh()
  }, 30_000)
})
</script>

<style scoped>
.stats {
  margin: var(--size-4) 0;
  display: grid;
  gap: var(--size-5);

  table {
    width: 100%;

    td {
      padding: var(--size-2);
      border: 1px solid var(--gray-z-3);
    }
  }
}
</style>
