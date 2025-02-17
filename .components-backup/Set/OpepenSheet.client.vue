<template>
  <section v-if="revealed" class="set-opepen">
    <Loading v-if="pending" />
    <div v-else class="groups">
      <div
        v-for="[key, group] in Object.entries(groupedOpepen)"
        :key="key"
        class="list"
        :class="[getEditionNameLower(key)]"
      >
        <div
          v-for="token in group"
          :key="token.token_id"
        >
          <NuxtLink :to="`/holders/${token.owner}`" @click.stop="() => null">
            <Image :image="token.image" version="sm" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { DateTime } from 'luxon'
import { getEditionNameLower } from '~/helpers/editions'

const { set } = defineProps({
  set: Object,
})

const config = useRuntimeConfig()
const url = `${config.public.opepenApi}/opepen/sets/${set.id}/opepen`
const { data: opepen, pending } = await useLazyFetch(url)

const groupedOpepen = computed(() => {
  return opepen.value.reduce((groups, opepen) => {
    groups[opepen.data.edition].push(opepen)
    return groups
  }, {
    1: [],
    4: [],
    5: [],
    10: [],
    20: [],
    40: [],
  })
})

const revealsAt = ref(DateTime.fromISO(set.reveals_at).toUnixInteger())
const revealed = ref(revealsAt.value <= DateTime.now().toUnixInteger())
</script>

<style scoped>
  .groups {
    display: grid;
    container-type: inline-size;
    gap: 0;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-template-rows: repeat(20, minmax(0, 1fr));
    border-radius: var(--size-5);
    border-top-left-radius: var(--size-1);
    overflow: hidden;
    border: var(--border);

    grid-template-areas:
      "one  five ten ten"
      "four five ten ten"
      "four five ten ten"
      "four five ten ten"
      "four five ten ten"
      "twenty twenty twenty twenty"
      "twenty twenty twenty twenty"
      "twenty twenty twenty twenty"
      "twenty twenty twenty twenty"
      "twenty twenty twenty twenty"
      "forty forty forty forty"
      "forty forty forty forty"
      "forty forty forty forty"
      "forty forty forty forty"
      "forty forty forty forty"
      "forty forty forty forty"
      "forty forty forty forty"
      "forty forty forty forty"
      "forty forty forty forty"
      "forty forty forty forty";

    .list {
      background: var(--background);
      box-shadow: var(--border-shadow);
      padding: var(--size-4);
    }

    .one {
      grid-area: one;
      grid-template-columns: 1fr;
      background: var(--gray-z-2);
    }
    .four {
      grid-area: four;
      grid-template-columns: 1fr;
      background: var(--gray-z-1);
    }
    .five {
      grid-area: five;
      grid-template-columns: 1fr;
      background: var(--gray-z-3);
    }
    .ten {
      grid-area: ten;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      background: var(--gray-z-1);
    }
    .twenty {
      grid-area: twenty;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      background: var(--gray-z-2);
    }
    .forty {
      grid-area: forty;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      background: var(--gray-z-2);
    }

    @media (--md) {
      grid-template-columns: repeat(8, minmax(0, 1fr));
      grid-template-rows: repeat(10, minmax(0, 1fr));

      grid-template-areas:
        "one  five ten ten twenty twenty twenty twenty"
        "four five ten ten twenty twenty twenty twenty"
        "four five ten ten twenty twenty twenty twenty"
        "four five ten ten twenty twenty twenty twenty"
        "four five ten ten twenty twenty twenty twenty"
        "forty forty forty forty forty forty forty forty"
        "forty forty forty forty forty forty forty forty"
        "forty forty forty forty forty forty forty forty"
        "forty forty forty forty forty forty forty forty"
        "forty forty forty forty forty forty forty forty";

      .forty {
        grid-template-columns: repeat(8, minmax(0, 1fr));
      }

      .four,
      .five,
      .ten,
      .twenty,
      .forty {
        padding-bottom: var(--size-2);
      }
    }
  }

  .list {
    display: grid;
    flex-wrap: wrap;
    max-width: var(--content-width);
    width: 100%;
    margin: 0 auto;
    gap: var(--size-4);

    > div {
      width: 100%;
      justify-self: center;
    }

    > div {
      max-width: calc(25cqw - 2*var(--size-4));

      @media (--md) {
        max-width: calc(12.5cqw - 2*var(--size-4));
      }
    }

  }
</style>
