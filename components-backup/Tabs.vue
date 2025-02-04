<template>
  <nav>
    <button
      v-for="tab in tabs"
      :key="tab.key"
      @click="$emit('select', tab.key)"
      :class="{
        active: tab.key === active,
      }"
    >{{ tab.txt }}</button>
  </nav>
</template>

<script setup>
const props = defineProps({
  tabs: Array,
  active: String,
  queryParamKey: {
    type: String,
    default: 'filter',
  },
})

const emit = defineEmits(['select'])

const route = useRoute()
const router = useRouter()
watch(props, () => {
  router.replace({
    path: route.path,
    query: {
      ...route.query,
      [props.queryParamKey]: props.active,
    },
  })
})
</script>

<style scoped>
nav {
  display: flex;
  gap: var(--size-2);
  margin: var(--size-4) 0;

  @media (--md) {
    margin: calc(var(--size-4) + var(--size-5)) 0;
  }

  &:first-child {
    margin-top: 0;
  }
}

button {
  padding: var(--size-4);
  background: var(--gray-z-1);
  border-radius: var(--size-2);
  transition: all var(--speed);

  &:--highlight,
  &.active {
    color: var(--color);
    background: var(--gray-z-2);
  }
}
</style>
