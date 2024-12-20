<template>
  <section v-if="revealed" class="set-opepen">
    <SectionTitle>Opepen</SectionTitle>

    <Loading v-if="pending" />
    <div v-else class="list">
      <div
        v-for="token in opepen"
        :key="token.token_id"
      >
        <OpepenCard
          :token="token"
          :set="token.data?.edition || 40"
        >
          <template #subline>
            <p><span>owned by </span><NuxtLink :to="`/holders/${token.owner}`" @click.stop="() => null"> {{ token.ownerAccount?.display }}</NuxtLink></p>
          </template>
        </OpepenCard>
      </div>
    </div>
  </section>
</template>

<script setup>
import { DateTime } from 'luxon'

const { data } = defineProps({
  data: Object,
})

const config = useRuntimeConfig()
const url = `${config.public.opepenApi}/opepen/sets/${data.set_id}/opepen`
const { data: opepen, pending } = await useLazyFetch(url, { key: 'revealed-opepen' })

const revealsAt = ref(DateTime.fromISO(data.reveals_at).toUnixInteger())
const revealed = ref(revealsAt.value <= DateTime.now().toUnixInteger() && data.set_id)
</script>

<style lang="postcss" scoped>
  .list {
    display: grid;

    display: grid;
    gap: var(--size-4);
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));

    flex-wrap: wrap;
    max-width: var(--content-width);
    width: 100%;
    margin: 0 auto;

    @media (--md) {
      gap: var(--size-5);
    }

    > div {
      width: 100%;

      p {
        justify-content: flex-start !important;
        gap: 0.5em;
      }
    }
  }
</style>
