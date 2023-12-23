<template>
  <div class="attributes">
    <Attribute
      v-for="attribute in attributes"
      :key="attribute.trait_type"
      :attribute="attribute"
    />
  </div>
</template>

<script setup>
import { EDITION_NAMES } from '~/helpers/editions'
import pad from '~/helpers/pad'

const { token, set } = defineProps({
  token: Object,
  set: Object,
})

const attributes = computed(() => {
  if (! token.set_id) return [
    {
      trait_type: 'Revealed',
      value: 'No',
    },
    {
      trait_type: 'Edition',
      value: EDITION_NAMES[token.data.edition],
    },
  ]

  return [
    {
      trait_type: 'Artist',
      value: set.artist,
      link: `/holders/${set.creator}`
    },
    {
      trait_type: 'Release',
      value: pad(set.id, 3),
      link: `/sets/${set.id}`,
    },
    {
      trait_type: 'Set',
      value: set.name,
      link: `/sets/${set.id}`,
    },
    {
      trait_type: 'Opepen',
      value: set[`edition${token.data.edition}Name`],
    },
    {
      trait_type: 'Edition Size',
      value: EDITION_NAMES[token.data.edition],
    },
  ]
})
</script>

<style lang="postcss" scoped>
.attributes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: var(--size-2);
}
</style>
