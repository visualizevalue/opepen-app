<template>
  <section v-if="set.name" class="items-meta">
    <h1>
      <small>Set {{ pad(set.id) }}</small>
      <span :title="set.name">{{ set.name }}</span>
    </h1>

    <p v-html="set.description"></p>

    <div>
      <CreatorSignature :set="set" />
    </div>

    <ul class="overview">
      <li>
        <Icon type="layers" stroke-width="2.25" />
        <span>{{ TYPES[set.edition_type] }} Editions</span>
      </li>
      <li>
        <IconOpepen />
        <span>{{ formatNumber(set?.submission_stats.opepens.total) }} Opt-Ins</span>
      </li>
      <li v-if="revealed || revealing">
        <IconCheck />
        <span>Consensus met on {{ consensusDate }}</span>
      </li>
      <li v-else>
        <IconCheck />
        <span>Opt-In until {{ consensusDate }}</span>
      </li>
      <li>
        <Icon type="code" stroke-width="2.25" />
        <NuxtLink to="https://github.com/visualizevalue-dev/opepens-metadata-api/tree/main/drops/sets">
          <span>Reveal mechanism {{ set.reveal_strategy }}</span>
        </NuxtLink>
      </li>
      <li v-if="set.reveal_block_number">
        <Icon type="box" stroke-width="2.25" />
        <NuxtLink :to="`https://etherscan.io/block/${set.reveal_block_number}`">
          <span>Block {{ set.reveal_block_number }}</span>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { DateTime } from 'luxon'
import pad from '~/helpers/pad'
import { formatNumber } from '~/helpers/format'
import { formatDate } from '~/helpers/dates'

const TYPES = {
  PRINT: 'Print',
  NUMBERED_PRINT: 'Numbered Print',
  DYNAMIC: 'Dynamic'
}

const props = defineProps({
  set: Object,
})

const revealsAt = ref(DateTime.fromISO(props.set?.reveals_at).toUnixInteger())
const revealing = ref(revealsAt.value <= DateTime.now().toUnixInteger())
const revealed = computed(() => revealing.value && props.set?.reveal_block_number)
const consensusDate = computed(() => props.set?.reveals_at && formatDate(props.set?.reveals_at))
</script>

<style lang="postcss" scoped>
  .items-meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--size-3);

    > h1 {
      small, span {
        display: block;
      }

      small {
        color: var(--gray-z-6);
        text-transform: uppercase;
        margin-bottom: var(--size-2);
        font-size: var(--font-md);
      }

      span {
        font-family: var(--font-family-opepen);
        font-size: var(--font-title);
        line-height: 1;
        letter-spacing: 0.05em;

        @media (--md) {
          font-size: var(--font-display);
        }
      }
    }

    > p {
      color: var(--gray-z-6);
      font-size: var(--font-md);
      line-height: var(--line-height-md);
      margin: var(--size-1) 0;
    }


    .overview {
      display: grid;
      gap: var(--size-1);
      color: var(--gray-z-6);

      li,
      li > a {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: var(--size-2);
        transition: all var(--speed);

        > svg, i, .vue-feathers {
          width: var(--size-4);
          height: var(--size-4);
          margin: 0;
          color: var(--gray-z-5);
          transition: all var(--speed);
        }
      }

      li > a {
        &:hover {
          color: var(--gray-z-7);

          > svg, i, .vue-feathers {
            color: var(--gray-z-6);
          }
        }
      }
    }

    /* article {
      font-weight: var(--font-weight-bold);
      font-size: var(--font-sm);

      h1 {
        color: var(--gray-z-6);
      }

      h1,
      p {
        text-transform: uppercase;
        line-height: 1.25;
        margin-bottom: var(--size-3);
      }

      @media (--md) {
        display: grid;
        grid-template-columns: 35% 65%;
        gap: var(--size-2);
      }
    } */

    /* @media (--md) {
      margin-top: calc(-1 * var(--size-6));
    } */
  }
</style>
