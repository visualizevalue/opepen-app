<template>
  <article v-if="set" class="set-preview">
    <section class="items">
      <Image :image="set?.edition1Image" version="sm" class="appear" />
      <Image :image="set?.edition4Image" version="sm" class="appear" />
      <Image :image="set?.edition5Image" version="sm" class="appear" />
      <Image :image="set?.edition10Image" version="sm" class="appear" />
      <Image :image="set?.edition20Image" version="sm" class="appear" />
      <Image :image="set?.edition40Image" version="sm" class="appear" />
    </section>
    <header>
      <h1>
        <small>Set {{ pad(set.id, 3) }}</small>
        <span>{{ set.name }}</span>
      </h1>
      <div>
        Revealing in <CountDown :until="SET_TIMESTAMPS[set.id]" class="inline" minimal />.
      </div>
      <div class="actions">
        <Button :to="`/sets/${pad(set.id, 3)}`">
          <Icon type="feather" />
          <span>View Set</span>
        </Button>
      </div>
    </header>
  </article>
</template>

<script setup>
import pad from '~/helpers/pad'
import { SET_TIMESTAMPS } from '~/helpers/sets'

const { id } = defineProps({
  id: Number,
})

const config = useRuntimeConfig()
const url = `${config.public.opepenApi}/opepen/sets/${id}`
const { data: set } = await useFetch(url)
</script>

<style lang="postcss" scoped>
  .set-preview {
    display: grid;
    grid-template-columns: 40% auto;
    gap: var(--size-4);
    row-gap: var(--size-7);
    max-width: var(--content-width);
    margin: 0 auto;
    padding: var(--size-2);
    border: var(--border);
    border-radius: var(--size-6);
    border-top-left-radius: var(--size-1);
    background-color: var(--gray-z-1);

    font-family: var(--font-display);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;

    h1 {
      margin-bottom: var(--size-2);

      > span {
        text-transform: none;
      }

      small,
      + div {
        display: block;
        font-size: var(--font-sm);
        color: var(--gray-z-7);
      }

      small {
        line-height: 1;
      }
    }

    header {
      display: flex;
      flex-direction: column;
      padding: var(--size-2);

      .actions {
        margin-top: auto;
        padding-top: var(--size-2);
        display: flex;

        a {
          width: auto;
        }
      }
    }
  }

  .items {
    display: grid;
    aspect-ratio: 1;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: repeat(3, minmax(0, 1fr));
    gap: var(--size-2);
    grid-auto-flow: dense;

    > :first-child {
      grid-column: span 2;
      grid-row: span 2;
    }
  }
</style>
