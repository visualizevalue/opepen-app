<template>
  <div class="create">
    <JourneyForm @submit="submit" />
  </div>
</template>

<script setup>
const submit = input => {
  console.log('submit', input)
}
</script>

<style lang="postcss" scoped>
  .create {
    display: flex;
    flex-direction: column;
  }

</style>
