<template>
  <div class="holder">
    <PageHeader class="centered">
      <Avatar :account="account" :size="64" class="avatar" />
      <h1>{{ account.display }}</h1>
    </PageHeader>

    <!-- TODO: Improve performance for long lists! -->
    <PaginatedContent
      :url="tokensUrl"
      query="limit=24"
      v-slot="{ items }"
    >
      <div v-if="items.length" class="opepens">
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
      <section v-else>
        <p class="centered muted">No Opepen found for this account.</p>
      </section>
    </PaginatedContent>
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

const config = useRuntimeConfig()
const route = useRoute()
const url = `${config.public.opepenApi}/accounts/${route.params.id}`
const tokensUrl = `${url}/opepen`
const { data: account } = await useFetch(url)

useMetaData({
  title: `${ account.value?.display } | Opepen`,
  description: `Opepen owned by ${account.value?.display}.`,
  og: 'https://opepen.art/og/rare.png',
})
</script>

<style lang="postcss" scoped>
header h1 {
  font-family: var(--font-family-opepen);
}
.holder {
  width: 100%;
  max-width: var(--content-width);
  margin: 0 auto;

  .avatar {
    margin: 0 auto var(--size-5);
    width: var(--size-9);
    height: var(--size-9);
    border-top-left-radius: var(--size-2);
  }

  .opepens {
    display: flex;
    justify-content: center;
    container-type: inline-size;
    flex-wrap: wrap;
    max-width: var(--content-width);
    width: 100%;
    margin: 5vh auto;
    gap: var(--size-4);

    > div {
      width: 100%;
      max-width: min(50vw, calc(50vh / 1.5));
    }

    > div {
      @container (width > 20rem) {
        max-width: min(50cqw, calc(50cqh / 1.5));
      }
      @container (width > 30rem) {
        max-width: min(33.33cqw, calc(33.33cqh / 1.5));
      }
    }
  }
}
</style>
