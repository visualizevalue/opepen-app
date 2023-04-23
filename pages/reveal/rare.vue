<template>
  <div class="reveal scroll">
    <header>
      <h1>
        <small>Reveal</small>
        <span>Rare Opepen</span>
      </h1>
      <ClientOnly>
        <div v-if="! isConnected" class="actions">
          <Connect />
        </div>
      </ClientOnly>
    </header>

    <section v-if="! revealed">
      <div>
        <OpepenPack
          :reveal-time="revealTime"
          :reveal="reveal"
          @reveal="onReveal"
        />
      </div>
    </section>
    <section v-if="revealData?.tokens?.length" class="opepens">
      <div
        v-for="({ token, set }) in revealData.tokens"
        :key="token"
      >
        <OpepenCard
          :id="token"
          :set="set"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { useAccount } from 'vagmi'
import { useMetaData } from '~/helpers/head'
import { nowInSeconds } from '~/helpers/time'

const config = useRuntimeConfig()
const { address, isConnected } = useAccount()

const reveal = 'rare'
// const revealTime = nowInSeconds() + 10
const revealTime = 1682121600
const revealData = ref(null)
const revealed = ref(false)
const fetchRevealData = async () => {
  if (! isConnected.value) return
  revealData.value = await $fetch(`${config.public.opepenApi}/reveals/${reveal}/${address.value}`)
  revealed.value = true
}
const onReveal = async () => {
  await fetchRevealData()
}

useMetaData({
  title: 'Rare Opepen',
  description: 'Reveal your Rare Opepen Cards.',
  og: 'https://opepen.art/og/rare.png',
})
</script>

<style lang="postcss" scoped>
.reveal {
  padding: var(--size-4);
  user-select: none;
}

header {
  text-align: center;
  padding: var(--size-6) 0;

  h1 {
    font-size: var(--font-title);
    text-transform: uppercase;
    font-weight: var(--font-weight-bold);
    letter-spacing: var(--letter-spacing-md);
    line-height: var(--line-height-md);

    small {
      display: block;
      color: var(--gray-z-6);
      margin: 0 0 var(--size-2);
    }
  }

  .actions {
    display: flex;
    justify-content: center;
    margin: var(--size-4) 0;
  }
}

section {
  padding: 0 var(--size-4);
  margin: 5vh 0;
  display: flex;
  justify-content: center;

  > div {
    width: 100%;
    max-width: min(50vw, calc(50vh / 1.5));
  }
}

.opepens {
  container-type: inline-size;
  flex-wrap: wrap;
  max-width: var(--content-width);
  width: 100%;
  margin: 5vh auto;
  gap: var(--size-4);

  > div {
    @container (width > 20rem) {
      max-width: min(50cqw, calc(50cqh / 1.5));
    }
    @container (width > 30rem) {
      max-width: min(33.33cqw, calc(33.33cqh / 1.5));
    }
  }
}
</style>
