<template>
  <div class="burned full">
    <section class="about">
      <header>
        <h1>Consensus Met</h1>
        <p>Opt out from the Opepen consensus protocol.</p>
        <p>This process is irreversible, and opted out tokens will no longer be able participate in the consensus building process.</p>
        <p>These artifacts will be issued by a separate Ethereum contract, with a maximum supply of 16,000.</p>
      </header>

      <BurnOpepenForm />
    </section>

    <section class="burn-timeline">
      <BurnedOpepenTimeline />
    </section>
  </div>
</template>

<script setup>
useMetaData({
  title: 'Opt-Out: Consensus Met',
  description: 'Opt out from the Opepen consensus protocol. This process is irreversible, and opted out tokens will no longer be able participate in the consensus building process.',
  og: '/og/burned.jpg',
})
</script>

<style scoped>
.burned {
  display: grid;
  gap: var(--size-9);

  .about {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--size-5);
    padding: var(--size-4);

    h1 {
      margin: 0 0 0.5em;
      font-size: var(--font-title);
    }

    p {
      margin-bottom: 0.5em;
      color: var(--gray-z-7);
    }

    @media (--md) {
      padding-left: 10vw;
    }
    @media (--xl) {
      padding-left: 20vw;
    }
  }

  .burn-timeline {
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media (--md) {
      overflow: auto;

      :deep(> section) {
        padding-right: 10vw;
      }
    }
    @media (--xl) {
      :deep(> section) {
        padding-right: 20vw;
      }
    }
  }

  @media (--md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    height: calc(100dvh - var(--navbar-height));
    overflow: hidden;
  }
}
</style>
