<template>
  <PaginatedContent :url="url" :query="query" :tag="PageFrameMd" show-empty>
    <template #default="{ items, meta }">
      <PageHeader>
        <SectionTitle>
          <span>Consensus Met ({{ meta.total || 0 }})</span>
        </SectionTitle>
        <Actions>
          <Button class="stats-button" to="/opepen/burned/stats">Stats</Button>
          <Button to="/opt-out">Opt out</Button>
        </Actions>
      </PageHeader>

      <div class="opepen-grid">
        <OpepenCard
          v-for="token in items"
          :key="token.id"
          :uri="`/opepen/burned/${token.token_id}`"
          :token="token"
          :subline="`Burned Opepen #${token.opepen.token_id}`"
          :burned="true"
        />
      </div>
    </template>
  </PaginatedContent>
</template>

<script setup>
import PageFrameMd from '~/components/Page/FrameMd.vue'

const url = `${useConfig('opepenApi')}/opepen/burned`
const query = `sort=-burned_at`
</script>

<style scoped>
.stats-button {
  display: none;
}

@media (--lg) {
  .stats-button {
    display: inline-block;
  }
}
</style>
