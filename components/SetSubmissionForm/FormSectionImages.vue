<template>
  <Card class="static grid meta" :disabled="disabled">
    <div class="images">
      <ImageUpload
        @stored="updateImage('image1', $event)"
        name="1/1 Media"
        :image="images.image1"
        :disabled="disabled"
      />
      <ImageUpload
        @stored="updateImage('image4', $event)"
        name="1/4 Media"
        :image="images.image4"
        :disabled="disabled"
      />
      <ImageUpload
        @stored="updateImage('image5', $event)"
        name="1/5 Media"
        :image="images.image5"
        :disabled="disabled"
      />
      <ImageUpload
        @stored="updateImage('image10', $event)"
        name="1/10 Media"
        :image="images.image10"
        :disabled="disabled"
      />
      <ImageUpload
        @stored="updateImage('image20', $event)"
        name="1/20 Media"
        :image="images.image20"
        :disabled="disabled"
      />
      <ImageUpload
        @stored="updateImage('image40', $event)"
        name="1/40 Media"
        :image="images.image40"
        :disabled="disabled"
      />
    </div>

    <slot></slot>
  </Card>
</template>

<script setup>
const props = defineProps({
  images: {
    type: Object,
    default: () => ({
      image1: null,
      image4: null,
      image5: null,
      image10: null,
      image20: null,
      image40: null,
    }),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:images'])

const updateImage = (key, value) => {
  emit('update:images', {
    ...props.images,
    [key]: value,
  })
}
</script>

<style scoped>
.grid {
  display: grid;
  gap: var(--spacer);

  @container page (min-width: 36rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    .span-2 {
      grid-column: span 2;
    }
  }
}

.meta {
  container-type: inline-size;

  @container page (min-width: 36rem) {
    grid-template-columns: max(20.8rem, 50cqw) 1fr;
  }
}

.images {
  height: min-content;
  align-self: center;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacer-sm);

  :first-child {
    grid-column: span 2;
    grid-row: span 2;
  }

  > * {
    object-fit: contain;
    aspect-ratio: 1;
  }
}
</style>
