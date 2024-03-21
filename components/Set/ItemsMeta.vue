<template>
  <section v-if="data" class="items-meta">
    <h1>
      <small v-if="data.set_id">Set {{ pad(data.set_id) }}</small>
      <small v-else>Set Submission <template v-if="! data.approved_at">(Private Preview)</template></small>
      <span :title="name">{{ name }}</span>
    </h1>

    <p v-if="data.description" v-html="data.description"></p>

    <Creators :data="data" />

    <ul class="overview">
      <li>
        <Icon type="layers" stroke-width="2.25" />
        <span v-if="published">{{ TYPES[data.edition_type] }} Editions</span>
        <span v-else>Unknown Editions</span>
      </li>
      <li v-if="data.dynamicPreviewImage">
        <Icon type="image" stroke-width="2.25" />
        <a href="#" @click.stop.prevent="openDynamicPreview = true">Preview Dynamic Colorway</a>

        <Modal :open="openDynamicPreview" @close="openDynamicPreview = false" modal-classes="wide">
          <img :src="imageURI(data.dynamicPreviewImage, 'lg')" />
        </Modal>
      </li>
      <li>
        <IconOpepen />
        <span>{{ formatNumber(data?.submission_stats?.opepens.total) }} Opt-Ins</span>
      </li>
      <li v-if="revealed || revealing">
        <IconCheck />
        <span>Consensus met on {{ consensusDate }}</span>
      </li>
      <li v-else>
        <IconCheck :class="{ published }" />
        <span v-if="published">
          <template v-if="consensusDate">
            Opt-In until {{ consensusDate }} (<CountDown @complete="onComplete" :until="revealsAt" class="inline nowrap" minimal />)
          </template>
          <template v-else-if="timeRemaining">
            Opt-In paused with {{ timeRemaining }} remaining
          </template>
          <template v-else>Opt-In Open</template>
        </span>
        <span v-else>Opt-In not open yet</span>
      </li>
      <li v-if="data.reveal_strategy">
        <Icon type="code" stroke-width="2.25" />
        <NuxtLink to="https://github.com/visualizevalue-dev/opepens-metadata-api/tree/main/drops/sets">
          <span>Reveal mechanism {{ data.reveal_strategy }}</span>
        </NuxtLink>
      </li>
      <li v-if="data.reveal_block_number">
        <Icon type="box" stroke-width="2.25" />
        <NuxtLink :to="`https://etherscan.io/block/${data.reveal_block_number}`">
          <span>Block {{ data.reveal_block_number }}</span>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { DateTime, Duration } from 'luxon'
import pad from '~/helpers/pad'
import { formatNumber } from '~/helpers/format'
import { formatDate } from '~/helpers/dates'
import { TYPES, RESERVED_UNTIL } from '~/helpers/sets'
import { imageURI } from '~/helpers/images'
import { timeRemainingFromSeconds } from '~/helpers/time'

const props = defineProps({
  data: Object,
})

const name = computed(() => props.data.name || (props.data.set_id < RESERVED_UNTIL ? 'Reserved' : 'Unrevealed'))

const published = computed(() => !!props.data.published_at)
const revealsAt = ref(DateTime.fromISO(props.data?.reveals_at).toUnixInteger())
const timeRemaining = computed(() => timeRemainingFromSeconds(props.data.remaining_reveal_time))
const revealing = ref(revealsAt.value <= DateTime.now().toUnixInteger())
const revealed = computed(() => revealing.value && props.data?.reveal_block_number)
const consensusDate = computed(() => props.data?.reveals_at && formatDate(props.data?.reveals_at))

const onComplete = () => {
  revealing.value = true
}

const openDynamicPreview = ref(false)
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
        line-height: var(--line-height-md);
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

          &.published {
            color: var(--success);
          }
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
