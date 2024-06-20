<template>
  <div class="has-secondary">
    <PaginatedContent
      :url="url"
      query="filter%5Bprice%5D=!null&filter%5Brevealed_at%5D=!null&sort=price"
      v-slot="{ items }"
    >
      <div v-if="items.length">
        <div class="opepens">
          <div
            v-for="token in items"
            :key="token.token_id"
          >
            <OpepenCard
              :token="token"
              :set="token.data?.edition || 40"
            />
          </div>
        </div>
      </div>
    </PaginatedContent>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const url = `${config.public.opepenApi}/opepen`
</script>

<style lang="postcss" scoped>
</style>
