<template>
  <section class="items-meta">

    <div class="intro">
      <h1>
        <small v-if="!data">Set {{ pad($route.params.id) }}</small>
        <small v-else-if="data.set_id">Set {{ pad(data.set_id) }}</small>
        <small v-else>Set Submission <template v-if="! data.approved_at">(Private Preview)</template></small>
        <span :title="name">{{ name }}</span>
      </h1>

      <p v-if="data?.description"><ExpandableText :text="data.description" /></p>
    </div>

    <ul v-if="data" class="overview">
      <li>
        <Icon type="user" stroke-width="2.25" />
        <span>
          Created by
          <NuxtLink :to="`/${id(data.creatorAccount)}`">
            <ApiAccount :account="data.creatorAccount" hide-avatar hide-address />
          </NuxtLink>
          <template v-if="coCreators.length">, </template>
          <template v-for="creator in coCreators">
            <NuxtLink :to="`/${id(creator)}`">
              <ApiAccount :account="creator" hide-avatar hide-address />
            </NuxtLink>
          </template>
        </span>
      </li>
      <li>
        <Icon type="layers" stroke-width="2.25" />
        <span v-if="published">{{ SET_TYPES[data.edition_type] }} Editions</span>
        <span v-else>Unknown Editions</span>
      </li>
      <li v-if="data.dynamicPreviewImage">
        <Icon type="image" stroke-width="2.25" />
        <a href="#" @click.stop.prevent="openDynamicPreview = true">Preview Dynamic Colorway</a>

        <Modal :open="openDynamicPreview" @close="openDynamicPreview = false" modal-classes="wide">
          <img :src="imageURI(data.dynamicPreviewImage, 'lg')" />
        </Modal>
      </li>
      <li v-if="revealed || revealing">
        <Icon type="opepen" />
        <span>{{ formatNumber(data?.submission_stats?.opepens.total) }} Opt-Ins</span>
      </li>
      <li v-if="revealed || revealing">
        <Icon type="check"/>
        <span>Consensus met on {{ consensusDate }}</span>
      </li>
      <li v-if="data.reveal_strategy">
        <Icon type="code" stroke-width="2.25" />
        <NuxtLink to="https://github.com/visualizevalue/opepens-metadata-api/tree/main/drops/sets">
          <span>Reveal mechanism {{ data.reveal_strategy }}</span>
        </NuxtLink>
      </li>
      <li v-if="data.reveal_block_number">
        <Icon type="box" stroke-width="2.25" />
        <NuxtLink :to="`https://etherscan.io/block/${data.reveal_block_number}`">
          <span>Block {{ data.reveal_block_number }}</span>
        </NuxtLink>
      </li>
      <li v-if="data.artist_signature">
        <Icon type="feather" />
        <NuxtLink
          :to="`https://etherscan.io/tx/${data.artist_signature.tx}`"
          target="_blank"
        >Set Signature</NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup>
const props = defineProps({
  data: Object,
})

const name = computed(() => props.data?.name || 'Unrevealed')
const published = computed(() => !!props.data.published_at)
const revealsAt = ref(DateTime.fromISO(props.data?.reveals_at).toUnixInteger())
const revealing = ref(revealsAt.value <= DateTime.now().toUnixInteger())
const revealed = computed(() => revealing.value && props.data?.reveal_block_number)
const consensusDate = computed(() => props.data?.reveals_at && formatDate(props.data?.reveals_at))
const coCreators = useCoCreators(props.data)

const openDynamicPreview = ref(false)
</script>

<style scoped>
  .items-meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--spacer-lg);

    .intro {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: var(--size-2);

      > h1 {
        small, span {
          @mixin ui-font;
          display: block;
        }

        small {
          color: var(--gray-z-6);
          margin-bottom: var(--size-2);
        }

        span {
          font-size: var(--font-xl);
          line-height: 0.8;
          margin-left: -0.05em;

          @media (--md) {
            font-size: var(--font-xxl);
          }
        }
      }

      > p {
        @mixin ui-font;
        color: var(--gray-z-6);
        line-height: var(--line-height-md);
      }
    }

    .overview {
      display: grid;
      gap: var(--size-2);

      @container (min-width: 30rem) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      li,
      li > a {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: var(--size-2);
        transition: all var(--speed);
        @mixin ui-font;
        color: var(--gray-z-6);

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

      li a {
        &:--highlight {
          color: var(--color);

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
