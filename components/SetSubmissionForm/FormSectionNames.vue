<template>
  <Card class="static grid meta" :disabled="disabled">
    <div class="names">
      <div>
        <div><Image :image="images.image1" /></div>
        <input
          type="text"
          v-model="editionNames.name1"
          :disabled="disabled"
          placeholder="1/1 Name"
          @input="updateNames"
        />
      </div>
      <div>
        <div><Image :image="images.image4" /></div>
        <input
          type="text"
          v-model="editionNames.name4"
          :disabled="disabled"
          placeholder="1/4 Name"
          @input="updateNames"
        />
      </div>
      <div>
        <div><Image :image="images.image5" /></div>
        <input
          type="text"
          v-model="editionNames.name5"
          :disabled="disabled"
          placeholder="1/5 Name"
          @input="updateNames"
        />
      </div>
      <div>
        <div><Image :image="images.image10" /></div>
        <input
          type="text"
          v-model="editionNames.name10"
          :disabled="disabled"
          placeholder="1/10 Name"
          @input="updateNames"
        />
      </div>
      <div>
        <div><Image :image="images.image20" /></div>
        <input
          type="text"
          v-model="editionNames.name20"
          :disabled="disabled"
          placeholder="1/20 Name"
          @input="updateNames"
        />
      </div>
      <div>
        <div><Image :image="images.image40" /></div>
        <input
          type="text"
          v-model="editionNames.name40"
          :disabled="disabled"
          placeholder="1/40 Name"
          @input="updateNames"
        />
      </div>
    </div>

    <slot></slot>
  </Card>
</template>

<script setup>
const props = defineProps({
  names: {
    type: Object,
    default: () => ({
      name1: '',
      name4: '',
      name5: '',
      name10: '',
      name20: '',
      name40: '',
    }),
  },
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

const emit = defineEmits(['update:names'])

const editionNames = reactive({ ...props.names })

watch(() => props.names, (newNames) => {
  Object.assign(editionNames, newNames)
}, { deep: true })

const updateNames = () => {
  emit('update:names', { ...editionNames })
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

.names {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacer);

  label {
    margin: 0;
  }

  > div {
    display: flex;
    border: var(--border);
    border-radius: var(--border-radius);

    :deep(.image) {
      width: calc(var(--size-7) + var(--size-2));
      height: calc(var(--size-7) + var(--size-2));
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    input {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>
