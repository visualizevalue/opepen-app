<template>
  <article v-if="data" class="set-preview" :class="{ minimal }" :style="style">
    <div class="wrapper">
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
        <p v-html="shortenedCleanText(data.description, 120)"></p>
        <Creators :data="data" :show-signature="false" />
        <ul class="overview">
          <li>
            <Icon type="layers" stroke-width="2.25" />
            <span>{{ TYPES[data.edition_type] }} Editions</span>
          </li>
          <li v-if="revealed || revealing">
            <IconCheck />
            <span>Consensus met on {{ consensusDate }}</span>
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
    </div>
  </article>
</template>

<script setup>
import { DateTime } from 'luxon'
import { formatDate } from '~/helpers/dates'
import pad from '~/helpers/pad'
import { TYPES } from '~/helpers/sets'
import { shortenedCleanText } from '~/helpers/strings'
import { DEFAULT_TIME_TO_REVEAL, timeRemainingFromSeconds } from '~/helpers/time'

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
const timeLeft = computed(() => data.remaining_reveal_time || (revealsAt.value - DateTime.now().toUnixInteger()))
const progress = computed(() => Math.max(1, parseInt((DEFAULT_TIME_TO_REVEAL - timeLeft.value) / DEFAULT_TIME_TO_REVEAL * 100)))
const isPaused = computed(() => data.remaining_reveal_time && data.remaining_reveal_time < DEFAULT_TIME_TO_REVEAL)
const showProgress = computed(() => !data.set_id && (data.reveals_at || isPaused.value))
const revealing = ref(revealsAt.value <= DateTime.now().toUnixInteger())
const revealed = computed(() => revealing.value && data?.reveal_block_number)
const consensusDate = computed(() => data?.reveals_at && formatDate(data?.reveals_at))
const published = computed(() => !! data.published_at)
const onComplete = () => {
  // FIXME: Refactor repetition
  revealing.value = true
}
</script>

<style scoped>
  .set-preview {
    container-type: inline-size;
    container-name: preview;
    max-width: var(--content-width);
    margin: 0;
    width: 100%;
    height: 100%;
  }

  .set-preview .wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: var(--size-4);
    margin: 0;
    padding: var(--size-2);
    border: var(--border);
    border-radius: var(--size-6);
    border-top-left-radius: var(--size-1);
    background-color: var(--gray-z-1);

    font-weight: var(--font-weight-bold);
    text-transform: uppercase;

    h1 {
      margin-bottom: var(--size-2);

      > span {
        font-family: var(--ui-font-family);
        letter-spacing: 0.06em;
        font-size: var(--font-xl);
      }

      small,
      + p {
        display: block;
        font-size: var(--font-sm);
        color: var(--gray-z-7);
      }

      small {
        line-height: 1;
        margin-bottom: var(--size-4);
      }
    }

    .creators {
      margin: var(--size-2) 0;
    }

    ul {
      margin: auto 0;
      padding: var(--size-4) 0;

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
      height: 100%;

      .actions {
        margin-top: auto;
        padding-top: var(--size-2);
        display: flex;

        a {
          width: auto;
        }
      }
    }

    .progress {
      margin: calc(-1 * var(--size-2)) calc(-1 * var(--size-1)) var(--size-3);
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
  }

  .set-preview.minimal {
    position: relative;

    .wrapper > a {
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

  @container preview (inline-size > 40rem) {
    .set-preview .wrapper {
      display: grid;
      grid-template-columns: 40% auto;
      row-gap: var(--size-7);

      &.minimal {
        grid-template-columns: auto;
      }

      .progress {
        margin: 0 0 var(--size-3) calc(-1 * var(--size-1));
      }
    }
  }
</style>
