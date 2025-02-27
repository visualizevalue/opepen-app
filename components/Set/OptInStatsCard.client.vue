<template>
  <section v-if="demand > 0">
    <Card class="static">
      <SectionTitle>Demand Stats</SectionTitle>

      <Progress :percent="demand" :class="{ muted: demand < 50 }" />

      <Table>
        <thead>
          <tr>
            <td>Edition</td>
            <td>Holders</td>
            <td>Opt-Ins</td>
            <td>Demand</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(edition, key) in EDITIONS">
            <td>{{ edition.name }}</td>
            <td>{{ submission.submission_stats?.holders[key] }}</td>
            <td>{{ submission.submission_stats?.demand[key] }}</td>
            <td>
              <span>{{ asPercentageOf(submission.submission_stats?.demand[key], key) }}%</span>
              <Icon
                type="check"
                :style="{ color: demandColor(key) }"
              />
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>Overall</td>
            <td>{{ submission.submission_stats?.holders.total }}</td>
            <td>{{ submission.submission_stats?.demand.total }}</td>
            <td>
              <span>{{ formatNumber((submission.submission_stats?.demand.total || 0) / 80 * 100) }}%</span>
              <Icon
                type="check"
                :style="{ color: demand >= 100 ? 'var(--success)' : demand >= 50 ? 'var(--yellow)' : 'var(--error' }"
              />
            </td>
          </tr>
        </tfoot>
      </Table>

      <SetOptInPieChart
        v-if="submission.submission_stats?.holders.total"
        :submission="submission"
      />
    </Card>
  </section>
</template>

<script setup lang="ts">

const { submission } = defineProps<{ submission: SetSubmission}>()

const demand = computed(() => getDemandPercentage(submission))

const demandColor = (edition: EditionType) => {
  const demand = getEditionDemandPercentage(submission, edition)

  return demand >= 100
    ? 'var(--success)'
    : demand >= 50
      ? 'var(--yellow)'
      : 'var(--error)'
}
</script>

<style scoped>
.card {
  gap: var(--spacer);
  overflow: hidden;
  padding-top: calc(var(--spacer) + var(--size-1));
}

.progress {
  position: absolute;
  top: 0;
  left: 0;
}

.icon {
  display: block;
  width: var(--size-4);
}

td:not(:first-child) {
  text-align: right;
}

td:last-child {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacer-sm);
}
</style>
