<template>
  <section class="create-intro">
    <PageHeader>
      <SectionTitle>Create an Opepen Set</SectionTitle>
    </PageHeader>

    <p class="lead">
      Submit your interpretation of the silhouette. If collectors vote it in, it becomes one of
      the 200 permanent sets.
    </p>

    <ol class="steps">
      <li>
        <strong>Make the art.</strong>
        <span>
          A set has six edition sizes: 1, 4, 5, 10, 20 and 40. A print set needs six artworks,
          one per size. A dynamic set needs a unique artwork for each of its 80 tokens. Start
          from the
          <NuxtLink to="/schematics.svg" target="_blank">schematics.</NuxtLink>
        </span>
      </li>
      <li>
        <strong>Fill in the draft.</strong>
        <span>
          Name the set and each edition, add a description and your artist name, and upload the
          files. Drafts autosave and stay unpublished until you publish them.
        </span>
      </li>
      <li>
        <strong>Publish and gather votes.</strong>
        <span>
          Collectors opt in their unrevealed Opepen. Once the set reaches consensus it reveals.
          <NuxtLink to="/about#voting">How voting works</NuxtLink>
        </span>
      </li>
    </ol>

    <p class="note">
      Creating a set is free and does not require owning an Opepen. You sign a message with
      your wallet to prove the set is yours; no transaction is needed.
    </p>

    <Actions>
      <Button to="/agents" class="secondary">
        <Icon type="cpu" />
        <span>Create with an agent</span>
      </Button>
      <Button @click="start">
        <Icon type="user" />
        <span>{{ currentAddress ? 'Sign in to start' : 'Connect wallet to start' }}</span>
      </Button>
    </Actions>
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
  gap: var(--spacer);
}

.lead,
.note,
.steps {
  @mixin ui-font;
  color: var(--muted);
  line-height: var(--line-height-md);
}

.lead {
  color: var(--color);
  font-size: var(--font-lg);
}

.steps {
  display: grid;
  gap: var(--spacer);
  padding: 0;
  list-style: none;
  counter-reset: step;

  li {
    display: grid;
    grid-template-columns: var(--size-6) 1fr;
    gap: var(--spacer-sm);
    padding: var(--spacer);
    border: var(--border);
    border-radius: var(--border-radius);
    background: var(--gray-z-1);

    &::before {
      counter-increment: step;
      content: counter(step, decimal-leading-zero);
      color: var(--gray-z-5);
    }

    strong {
      grid-column: 2;
      color: var(--color);
    }

    span {
      grid-column: 2;
    }
  }
}

a {
  color: var(--color);
  border-bottom: 1px solid var(--border-color);

  &:--highlight {
    border-color: var(--color);
  }
}

.actions {
  justify-content: flex-end;
}
</style>
