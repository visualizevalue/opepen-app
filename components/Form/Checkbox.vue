<template>
  <label class="custom-checkbox">
    <input type="checkbox" :value="value" v-model="checked" />
    <span class="checkmark"></span>
    <slot />
  </label>
</template>

<script setup>
defineProps({
  value: String,
})
const checked = defineModel({ required: true })
</script>

<style scoped>
.custom-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  position: relative;
  padding-left: 30px;
  @mixin ui-font;
  color: var(--gray-z-7);
  padding: var(--spacer-xs) var(--spacer);
  gap: var(--spacer-sm);

  input {
    position: absolute;
    cursor: pointer;
    opacity: 0;
    height: 0;
    width: 0;
  }

  .checkmark {
    position: relative;
    height: var(--size-5);
    width: var(--size-5);
    background-color: var(--gray-z-4);
    border: var(--border);
    border-radius: var(--border-radius);
    transition: all var(--speed);

    &:after {
      content: "";
      position: absolute;
      display: none;
    }
  }

  &:hover input ~ .checkmark {
    background-color: var(--gray-z-5);
    border-color: var(--gray-z-3);
  }

  input:checked ~ .checkmark {
    background-color: var(--blue-dark);
    border-color: var(--border-color);

    &:after {
      display: block;
      left: 0.5em;
      top: 0.2em;
      width: 0.33em;
      height: 0.69em;
      border: solid var(--blue-light);
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }
}
</style>
