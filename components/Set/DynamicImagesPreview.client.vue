<template>
  <section v-if="data?.dynamicSetImages" class="set-opepen">
    <SectionTitle>Dynamic Images Preview</SectionTitle>
    <div class="list">
      <div
        v-for="image in images"
        :key="image.uuid"
      >
        <Image :image="image" :version="'sm'" :key="image.uuid">
          <template #subline>
            <p>Edition</p>
          </template>
        </Image>
      </div>
    </div>
  </section>
</template>

<script setup>
const { data } = defineProps({
  data: Object,
})

const EDITIONS = [4, 5, 10, 20, 40]
const images = computed(() => {
  const array = [data.edition1Image]

  for (const edition of EDITIONS) {
    let index = 1
    while (index <= edition) {
      const image = data.dynamicSetImages[`image${edition}_${index}`]
      if (image) array.push(image)
      index ++
    }
  }

  return array
})
</script>

<style lang="postcss" scoped>
  .set-opepen {

    @media (--md) {
      :deep(h1) {
        margin-top: -2rem;
      }
    }
  }

  .list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    container-type: inline-size;
    flex-wrap: wrap;
    max-width: var(--content-width);
    width: 100%;
    margin: 0 auto;
    gap: var(--size-4);

    > div {
      width: 100%;
    }
  }
</style>
