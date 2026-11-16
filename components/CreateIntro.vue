<template>
  <section class="create-intro">
    <header>
      <h1>Create a Set</h1>
      <p>Reinterpret the silhouette. If collectors vote it in, it becomes permanent.</p>
    </header>

    <ol class="list-group">
      <li>
        <span class="stack">
          <span>Make the art</span>
          <span>Six pieces, one per edition. Or eighty, one per token.</span>
        </span>
      </li>
      <li>
        <span class="stack">
          <span>Publish</span>
          <span>Free. No Opepen needed. Sign in with your wallet.</span>
        </span>
      </li>
      <li>
        <span class="stack">
          <span>Collect votes</span>
          <span>The set reveals when every edition fills.</span>
        </span>
      </li>
    </ol>

    <Button class="primary" @click="start">
      {{ currentAddress ? 'Sign In' : 'Connect Wallet' }}
    </Button>

    <nav class="list-group">
      <NuxtLink to="/schematics.svg" target="_blank">
        <span>Schematics</span>
        <Icon type="chevron-right" class="chevron" />
      </NuxtLink>
      <NuxtLink to="/agents">
        <span>Create with an agent</span>
        <Icon type="chevron-right" class="chevron" />
      </NuxtLink>
      <NuxtLink to="/about#voting">
        <span>How voting works</span>
        <Icon type="chevron-right" class="chevron" />
      </NuxtLink>
    </nav>
  </section>
</template>

<script setup>
// useSignIn() is resolved on click so this component can render on the server.
const start = () => {
  const { signIn } = useSignIn()
  signIn()
}
</script>

<style scoped>
.create-intro {
  display: grid;
  gap: var(--size-5);
  padding-top: var(--spacer);
}

header {
  display: grid;
  gap: var(--size-2);

  h1 {
    font-family: var(--font-family-brand);
    text-transform: uppercase;
    font-size: var(--font-xxl);
    font-weight: 400;
    letter-spacing: var(--brand-letter-spacing);
    line-height: 1.1;
  }

  p {
    color: var(--muted);
    font-size: var(--font-lg);
    letter-spacing: var(--letter-spacing-sm);
    line-height: 1.3;
  }
}

ol {
  counter-reset: step;

  li {
    justify-content: flex-start;

    /* A numbered badge leads each step. */
    &::after {
      counter-increment: step;
      content: counter(step);
      order: -1;
      flex-shrink: 0;
      display: grid;
      place-items: center;
      width: var(--size-6);
      height: var(--size-6);
      border-radius: 50%;
      background: var(--fill);
      color: var(--gray-z-7);
      font-size: var(--font-sm);
      font-weight: var(--font-weight-bold);
    }

    /* Start the hairline at the text, past the badge. */
    & + li::before {
      left: calc(var(--spacer) * 2 + var(--size-6));
    }
  }
}

.button.primary {
  width: 100%;
  min-height: 3.125rem;
  border-radius: var(--border-radius-lg);
  font-size: 1.0625rem;
}
</style>
