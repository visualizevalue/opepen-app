<template>
  <section v-if="account.quote || account.bio" class="bio" :class="{ 'col-2': account.quote && account.bio }">
    <blockquote v-if="account.quote">
      <span>{{ account.quote }}</span>
      <cite>{{ account.display }}</cite>
    </blockquote>
    <p v-if="account.bio">{{ account.bio }}</p>
  </section>
</template>

<script setup>
defineProps({
  account: Object,
})
</script>

<style scoped>
.bio {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--spacer-lg);

  > * {
    width: 100%;
  }

  @container (min-width: 40rem) {
    flex-direction: row;

    > * {
      max-width: 50%;
    }

    &.col-2 {
      > * {
        width: 50%;
      }
    }
  }

  blockquote,
  p {
    white-space: pre-line;
  }

  blockquote {
    position: relative;

    &:before {
      content: '"';
      position: absolute;
      left: -0.5em;
      opacity: 0.5;
    }

    &:before,
    span {
      font-family: var(--font-family-display);
      font-style: italic;
      font-size: var(--font-xl);
      line-height: var(--line-height-md);
    }

    cite {
      display: block;
      @mixin ui-font;
      color: var(--gray-z-5);
      margin-top: var(--size-3);

      &:before {
        content: "- ";
      }
    }

    @container (min-width: 40rem) {
      padding-left: 1em;

      &:before {
        left: 0;
      }
    }
  }
}
</style>
