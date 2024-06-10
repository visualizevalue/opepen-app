<template>
  <div class="home">
    <aside>
      <Connect :show-settings="false" />
    </aside>

    <main>
      <header>
        <h1>Consensus is temporary</h1>
      </header>
      <Connect class="lg-connect">
        <template #default>
          Check-In
        </template>
        <template #connected>
          <Authenticated>
            <EmailForm>
              <!-- <template #verified>
                <p>Email Verified!</p>
              </template> -->
            </EmailForm>
          </Authenticated>
        </template>
      </Connect>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'simple',
})
</script>

<style lang="postcss" scoped>
  .home {
    padding: var(--size-8) var(--size-5);
    max-width: 120rem;
    margin: 0 auto;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  aside {
    position: fixed;
    top: var(--size-5);
    right: var(--size-5);
  }

  header {
    h1 {
      font-size: var(--font-display);
      margin: 0 0 1em 0;
      line-height: 1;
      text-align: center;
    }
  }

  main {
    width: 100%;
    max-width: 50rem;
    padding: var(--size-8) 0;

    .lg-connect {
      display: flex;
      justify-content: center;

      :deep(.button) {
        font-size: var(--font-xl);
        padding: var(--size-6);
      }
    }
  }
</style>
