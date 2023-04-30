<template>
  <div class="holder">
    <PageHeader class="centered">
      <h1>{{ account.display }}</h1>
    </PageHeader>

    <section v-if="opepens?.data?.length" class="opepens">
      <div
        v-for="token in opepens.data"
        :key="token.token_id"
      >
        <OpepenCard
          :id="token.token_id"
          :set="token.data?.edition || 40"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const route = useRoute()
const url = `${config.public.opepenApi}/accounts/${route.params.id}`
const { data: account } = await useFetch(url)
const { data: opepens } = await useFetch(`${url}/opepen`)
</script>

<style lang="postcss" scoped>
.holder {
  width: 100%;
  max-width: var(--content-width);
  margin: 0 auto;

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
