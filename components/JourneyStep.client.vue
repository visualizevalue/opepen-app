<template>
  <section>
    <header>
      <span class="step-input">
        <IconsOpepenAiBold />
      </span>
      <h1>{{ step.prompt }}</h1>
    </header>

    <div class="images">
      <AiImage
        v-for="(image, index) in images"
        :key="image.uuid || index"
        :step="step"
        :image="image"
      />
      <article @click="newImage" class="ai-image create">
        <div class="inner overlay semi active">
          <nav class="centered">
            <button><Icon type="plus" stroke-width="2" /></button>
          </nav>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
const { step } = defineProps({
  step: Object,
})

const images = ref(step.images || [])

const MINIMUM_TO_GENERATE = 3
if (images.value.length < MINIMUM_TO_GENERATE) {
  const toGenerate = MINIMUM_TO_GENERATE - images.value.length

  ;([...Array(toGenerate)]).forEach(() => images.value.push({}))
}

const newImage = () => images.value.push({})
</script>

<style lang="postcss" scoped>
  section {
    max-width: var(--content-width);
    margin: var(--size-6) auto var(--size-7);
    padding-left: calc(var(--size-4) + var(--size-6));
    position: relative;

    &:before {
      content: '';
      position: absolute;
      width: var(--size-3);
      height: var(--size-3);
      top: var(--size-3);
      left: calc(var(--size-3) - 1px);
      background: var(--gray-z-4);
      border-radius: var(--size-2);
      z-index: 1;
    }
  }

  header {
    display: flex;
    align-items: center;
    gap: var(--size-3);
    margin: 0 0 var(--size-4);

    .step-input {
      width: var(--size-7);
      height: var(--size-7);
      display: flex;
      align-self: flex-start;
      margin-top: var(--size-0);
      justify-content: center;
      align-items: center;
      background-color: var(--gray-z-3);
      border: 1px solid var(--gray-z-4);
      border-radius: var(--size-3);
      border-top-left-radius: var(--size-1);
      overflow: hidden;
      flex-shrink: 0;

      .icon {
        width: var(--size-4);
        height: var(--size-4);
        color: var(--gray-z-5);
      }
    }


    h1 {
      font-weight: var(--font-weight-medium);
      color: var(--gray-z-5);
    }
  }

  .images {
    --image-width: 9rem;

    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--image-width), 1fr));
    grid-auto-flow: dense;
    gap: var(--size-4);

    @media (--md) {
      --image-width: 15rem;
    }
  }

  .create {
    cursor: pointer;
  }
</style>
