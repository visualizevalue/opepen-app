<template>
  <PageFrameMd>
    <PageHeader>
      <SectionTitle>
        <span>Consensus Met</span>
      </SectionTitle>
    </PageHeader>
    <section class="about">
      <div class="illustration">
        <Image image="/wireframe.svg" />
        <Icon type="arrow-right" />
        <Image :image="currentBurnedOpepen.image" />
      </div>
      <div class="content">
        <p>Opt out from the Opepen consensus protocol.</p>
        <p>
          This process is irreversible, and opted out tokens will no longer be able participate
          in the consensus building process.
        </p>
        <p>
          These artifacts will be issued by a separate Ethereum contract, with a maximum supply
          of 16,000.
        </p>
        <BurnOpepenForm />
      </div>
    </section>
  </PageFrameMd>
</template>

<script setup>
const config = useRuntimeConfig()
const url = `${config.public.opepenApi}/opepen/burned`

const { data: burnedOpepen } = await useFetch(`${url}?limit=20&sort=-burned_at`)

const currentIndex = ref(0)
const currentBurnedOpepen = computed(() => {
  if (!burnedOpepen.value?.data?.length) return null
  return burnedOpepen.value.data[currentIndex.value]
})

let intervalId = null
onMounted(() => {
  if (burnedOpepen.value?.data?.length > 1) {
    intervalId = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % burnedOpepen.value.data.length
    }, 2000)
  }
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

useMetaData({
  title: 'Opt-Out: Consensus Met',
  description:
    'Opt out from the Opepen consensus protocol. This process is irreversible, and opted out tokens will no longer be able participate in the consensus building process.',
  og: '/og/burned.jpg',
})
</script>

<style>
.about {
  font-size: var(--font-base);

  @media (--md) {
    display: flex;
    flex-direction: row;
    gap: var(--size-6);
    padding-left: 0;
    padding-right: 0;
  }

  .content {
    @media (--md) {
      flex: 1;
      order: 1;
    }
  }

  .illustration {
    @media (--md) {
      flex: 1;
      order: 2;
    }
  }

  p {
    font-size: var(--font-base);
    line-height: var(--line-height-lg);
    margin-bottom: var(--spacer);

    @media (--md) {
      --font-lg: 1.1rem;
      font-size: var(--font-lg);
    }
  }
}

.illustration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacer);
  margin-bottom: var(--spacer-lg);

  @media (--md) {
    margin-bottom: var(--size-8);
  }

  .image {
    width: var(--size-10);
    height: var(--size-10);
    padding-bottom: 0 !important;

    @media (--md) {
      --size-11: 10rem;
      width: var(--size-11);
      height: var(--size-11);
    }
  }

  .icon {
    flex-shrink: 0;
    width: var(--size-6);
    height: var(--size-6);
    color: var(--gray-z-5);
  }
}
</style>
