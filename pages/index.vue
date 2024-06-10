<template>
  <div class="home">
    <aside>
      <Connect :show-settings="false" />
    </aside>

    <main>
      <header>
        <img src="/dead-sm.svg" alt="Eeee">
        <h1>
          Consensus is temporary
          <small>
            <CountDown :until="until" />
          </small>
        </h1>
      </header>
      <Connect class="lg-connect">
        <template #default>
          Check-In
        </template>
        <template #connected>
          <Authenticated>
            <EmailForm>
              <template #unverified>
                <p class="info">Please check your email to verify!</p>
              </template>
            </EmailForm>
          </Authenticated>
        </template>
      </Connect>
    </main>
  </div>
</template>

<script setup>
import { useIntervalFn } from '@vueuse/core'
import { DateTime } from 'luxon'
import { getRandomInt } from '~/helpers/random'

definePageMeta({
  layout: 'simple',
})

const until = ref(null)
const randomTimer = () => {
  const seconds = Math.random() < 0.1  // short
    ? getRandomInt(80, 500)
    : Math.random() < 0.3 // medium
      ? getRandomInt(60 * 60 * 24 * 10, 60 * 60 * 24 * 40)
      : getRandomInt(60 * 60 * 24 * 365 * 1, 60 * 60 * 24 * 365 * 80)

  until.value = DateTime.now().plus({ seconds }).toUnixInteger()
}
randomTimer()

useIntervalFn(() => randomTimer(), 9000)
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

      small {
        display: block;
        margin-top: 0.1em;
        color: var(--gray-z-5);
      }
    }

    img {
      height: 8rem;
      margin: -2em auto 1.5rem;
      opacity: 0.1;

      @media (--md) {
        margin: -8em auto 3rem;
      }
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

    .info {
      text-align: center;
      color: var(--gray-z-5);
      margin: var(--size-3) 0;
    }
  }
</style>
