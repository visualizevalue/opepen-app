<template>
  <article v-if="data" class="set-preview" :class="{ minimal }" :style="style">
    <section class="items">
      <Image :image="data?.edition1Image" version="sm" class="appear" />
      <Image :image="data?.edition4Image" version="sm" class="appear" />
      <Image :image="data?.edition5Image" version="sm" class="appear" />
      <Image :image="data?.edition10Image" version="sm" class="appear" />
      <Image :image="data?.edition20Image" version="sm" class="appear" />
      <Image :image="data?.edition40Image" version="sm" class="appear" />
    </section>
    <header v-if="! minimal">
      <h1>
        <small v-if="data.set_id">Set {{ pad(data.set_id, 3) }}</small>
        <small v-else>Set Submission</small>
        <span>{{ data.name }}</span>
      </h1>
      <p v-html="shortenedCleanText(data.description, 161)"></p>
      <ul class="overview">
        <li>
          <Icon type="layers" stroke-width="2.25" />
          <span>{{ TYPES[data.edition_type] }} Editions</span>
        </li>
        <li v-if="revealed || revealing">
          <IconCheck />
          <span>Consensus met on {{ consensusDate }}</span>
        </li>
        <li v-else>
          <IconCheck class="check" :class="{ published }" />
          <span v-if="published">
            <template v-if="consensusDate">Opt-In until {{ consensusDate }} (<CountDown @complete="onComplete" :until="revealsAt" class="inline nowrap" minimal />)</template>
            <template v-else>Opt-In open</template>
          </span>
          <span v-else>Opt-In not open yet</span>
        </li>
      </ul>

      <div class="actions">
        <Button :to="`/sets/${id}`">
          <Icon type="chevron-right" />
          <span>View Set</span>
        </Button>
      </div>
    </header>
    <Button v-else :to="`/sets/${id}`" :title="data.name">
      <Icon type="chevron-right" />
      <span>View Set</span>
    </Button>
  </article>
</template>

<script setup>
import { DateTime } from 'luxon'
import { formatDate } from '~/helpers/dates'
import pad from '~/helpers/pad'
import { TYPES } from '~/helpers/sets'
import { shortenedCleanText } from '~/helpers/strings'

const { data, minimal, style } = defineProps({
  data: Object,
  minimal: Boolean,
  style: {
    type: Object,
    default: () => ({})
  }
})

const id = computed(() => data?.set_id ? pad(data.set_id, 3) : data?.uuid)
const revealsAt = ref(DateTime.fromISO(data?.reveals_at).toUnixInteger())
const revealing = ref(revealsAt.value <= DateTime.now().toUnixInteger())
const revealed = computed(() => revealing.value && data?.reveal_block_number)
const consensusDate = computed(() => data?.reveals_at && formatDate(data?.reveals_at))
const published = computed(() => !! data.published_at)
const onComplete = () => {
  // FIXME: Refactor repetition
  revealing.value = true
}
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

    &.minimal {
      position: relative;

      > a {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0.0001;
        cursor: pointer;
        height: 100%;
        width: 100%;
      }
    }

    @media (--md) {
      grid-template-columns: 40% auto;
      row-gap: var(--size-7);

      &.minimal {
        grid-template-columns: auto;
      }
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

        > .check.published {
          color: var(--success);
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
