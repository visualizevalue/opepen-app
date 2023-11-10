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
      <p v-html="set.description"></p>
      <ul class="overview">
        <li>
          <Icon type="layers" stroke-width="2.25" />
          <span>{{ TYPES[set.edition_type] }} Editions</span>
        </li>
        <li v-if="revealed || revealing">
          <IconCheck />
          <span>Consensus met on {{ consensusDate }}</span>
        </li>
        <li v-else>
          <IconCheck />
          <span v-if="published">Opt-In until {{ consensusDate }}</span>
          <span v-else>Opt-In not opepen yet</span>
        </li>
      </ul>

      <div class="actions">
        <Button :to="`/sets/${pad(set.id, 3)}`">
          <Icon type="chevron-right" />
          <span>View Set</span>
        </Button>
      </div>
    </header>
  </article>
</template>

<script setup>
import { DateTime } from 'luxon'
import { formatDate } from '~/helpers/dates'
import pad from '~/helpers/pad'
import { TYPES } from '~/helpers/sets'

const { set } = defineProps({
  set: Object,
})

const revealsAt = ref(DateTime.fromISO(set?.reveals_at).toUnixInteger())
const revealing = ref(revealsAt.value <= DateTime.now().toUnixInteger())
const revealed = computed(() => revealing.value && set?.reveal_block_number)
const consensusDate = computed(() => set?.reveals_at && formatDate(set?.reveals_at))
</script>

<style lang="postcss" scoped>
  .set-preview {
    display: grid;
    gap: var(--size-4);
    max-width: var(--content-width);
    margin: 0 auto;
    padding: var(--size-2);
    border: var(--border);
    border-radius: var(--size-6);
    border-top-left-radius: var(--size-1);
    background-color: var(--gray-z-1);

    font-weight: var(--font-weight-bold);
    text-transform: uppercase;

    @media (--md) {
      grid-template-columns: 40% auto;
      row-gap: var(--size-7);
    }

    h1 {
      margin-bottom: var(--size-2);

      > span {
        text-transform: none;
        font-family: var(--font-family-opepen);
        letter-spacing: 0.06em;
        font-size: var(--font-xl);
      }

      small,
      + div {
        display: block;
        font-size: var(--font-sm);
        color: var(--gray-z-7);
      }

      small {
        line-height: 1;
        margin-bottom: var(--size-4);
      }
    }

    ul {
      margin: auto 0;
      padding: var(--size-5) 0;

      li {
        margin-bottom: var(--size-3);
      }

      li,
      li > a {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: var(--size-2);
        transition: all var(--speed);
        line-height: 1;

        > svg, i, .vue-feathers {
          width: var(--size-4);
          height: var(--size-4);
          margin: 0;
          color: var(--gray-z-5);
          transition: all var(--speed);
        }
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
