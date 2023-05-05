<template>
  <section v-if="revealed" class="set-opepen">
    <Loading v-if="pending" />
    <div v-else class="list">
      <div
        v-for="token in opepen"
        :key="token.token_id"
      >
        <OpepenCard
          :token="token"
          :set="token.data?.edition || 40"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { DateTime } from 'luxon'

const { set } = defineProps({
  set: Object,
})

const config = useRuntimeConfig()
const url = `${config.public.opepenApi}/opepen/sets/${set.id}/opepen`
const { data: opepen, pending } = await useLazyFetch(url)

const revealsAt = ref(DateTime.fromISO(set.reveals_at).toUnixInteger())
const revealed = ref(revealsAt.value <= DateTime.now().toUnixInteger())
</script>

<style lang="postcss" scoped>
  .list {
    display: flex;
    justify-content: center;
    container-type: inline-size;
    flex-wrap: wrap;
    max-width: var(--content-width);
    width: 100%;
    margin: 0 auto;
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
        max-width: calc(25cqw - var(--size-4));
      }
    }
  }
</style>
