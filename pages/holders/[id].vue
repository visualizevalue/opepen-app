<template>
  <div class="holder">
    <header>
      <div>
        <div class="cover" :style="{ backgroundImage: `url(${coverImageURL})` }"></div>
        <Avatar :account="account" :size="64" class="avatar" />
        <div class="text">
          <h1>
            <span>{{ account.display }}</span>
            <small v-if="account.tagline">{{ account.tagline }}</small>
          </h1>
          <NuxtLink :to="`https://etherscan.io/address/${account.address}`" target="_blank" class="meta-separated">
            <span v-if="account.ens">{{ account.ens }}</span>
            <span>{{ shortAddress(account.address, 6) }}</span>
          </NuxtLink>
          <SocialLinks :links="mainSocials" class="socials" />
        </div>
      </div>
    </header>

    <SocialLinks :links="otherSocials" class="socials" />

    <section v-if="account.quote || account.bio" class="bio" :class="{ 'col-2': account.quote && account.bio }">
      <blockquote v-if="account.quote">
        <span>{{ account.quote }}</span>
        <cite>{{ account.display }}</cite>
      </blockquote>
      <p v-if="account.bio">{{ account.bio }}</p>
    </section>

    <section v-if="account.richContentLinks?.length" class="known-for">
      <SectionTitle>Known For</SectionTitle>
      <RichContentLinks :links="account.richContentLinks" />
    </section>

    <section v-if="account.createdSets?.length">
      <SectionTitle>Artist For Set<template v-if="account.createdSets.length > 1">s</template></SectionTitle>
      <div class="created-sets">
        <SetPreview v-for="set in account.createdSets" :set="set" />
      </div>
    </section>

    <!-- TODO: Improve performance for long lists! -->
    <PaginatedContent
      :url="tokensUrl"
      query="limit=24"
      v-slot="{ items }"
    >
      <div v-if="items.length">
        <SectionTitle>Owned Opepen</SectionTitle>
        <div class="opepens">
          <div
            v-for="token in items"
            :key="token.token_id"
          >
            <OpepenCard
              :token="token"
              :set="token.data?.edition || 40"
            />
          </div>
        </div>
      </div>
    </PaginatedContent>
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'
import { imageURI } from '~/helpers/images'
import shortAddress from '~/helpers/short-address'

const config = useRuntimeConfig()
const route = useRoute()
const url = `${config.public.opepenApi}/accounts/${route.params.id}`
const tokensUrl = `${url}/opepen`
const { data: account } = await useFetch(url)

const coverImageURL = imageURI(account.value?.coverImage, 'lg')

const splitSocials = computed(() => account.value?.socials?.length > 5)
const mainSocials = computed(() => splitSocials.value ? account.value?.socials.slice(0, 3) : account.value?.socials)
const otherSocials = computed(() => splitSocials.value ? account.value?.socials.slice(3) : [])

useMetaData({
  title: `${ account.value?.display } | Opepen`,
  description: `Opepen owned by ${account.value?.display}.`,
  og: 'https://opepen.art/og/rare.png',
})
</script>

<style lang="postcss" scoped>
.holder {
  width: 100%;
  max-width: var(--content-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--size-8);

  @media (--md) {
    gap: var(--size-9);
  }

  > .socials {
    margin-top: calc(-1 * var(--size-8) + var(--size-4));
    padding: 0 var(--size-4);

    @media (--md) {
      margin-top: calc(-1 * var(--size-9) + var(--size-4));
    }
  }
}

header {
  position: relative;
  container-type: inline-size;
  margin-top: 5cqh;

  > div {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: var(--size-4);
    padding: var(--size-4);
    min-height: 23cqw;
    width: 100cqw;

    @media (--md) {
      max-height: 33.33cqw;
    }
  }

  .cover {
    background-color: var(--gray-z-2);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background-size: cover;
    background-position: center center;
    border: var(--border);
    border-radius: var(--size-5);
    border-top-left-radius: var(--size-1);
    overflow: hidden;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      background: linear-gradient(to right, var(--background), var(--transparent-background));
      opacity: 0.9;
    }
  }

  .avatar {
    width: var(--size-9);
    height: var(--size-9);
    border-top-left-radius: var(--size-2);
    margin-top: -5cqh;

    @media (--md) {
      width: calc(var(--size-9) * 2);
      height: calc(var(--size-9) * 2);
    }
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: var(--size-1);
  }

  h1 {
    margin-top: var(--size-2);
    display: flex;
    align-items: baseline;
    gap: var(--size-4);
    flex-wrap: wrap;

    span {
      font-family: var(--font-family-opepen);
      font-size: var(--font-title);
      height: 1em;
    }

    small {
      font-size: var(--font-base);
    }
  }

  .meta-separated {
    color: var(--gray-z-7);
  }

  .socials {
    @media (--md) {
      position: absolute;
      top: var(--size-4);
      right: var(--size-4);
      max-width: 70%;
      justify-content: flex-end;
    }
  }
}

.bio {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--size-8);
  padding: var(--size-4);

  > * {
    width: 100%;
  }

  @media (--md) {
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
      left: -0.7em;
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
      font-size: var(--font-base);
      color: var(--gray-z-5);
      margin-top: var(--size-3);

      &:before {
        content: "- ";
      }
    }
  }
}

.known-for {
  h1 {
    margin-bottom: var(--size-2);
  }
}

.opepens {
  display: flex;
  justify-content: center;
  container-type: inline-size;
  flex-wrap: wrap;
  max-width: var(--content-width);
  width: 100%;
  margin: 5vh auto;
  gap: var(--size-4);

  > div {
    width: 100%;
    max-width: min(50vw, calc(50vh / 1.5));
  }

  > div {
    @container (width > 20rem) {
      max-width: min(50cqw, calc(50cqh / 1.5));
    }
    @container (width > 30rem) {
      max-width: min(33.33cqw, calc(33.33cqh / 1.5));
    }
  }
}

.created-sets {
  display: grid;
  gap: var(--size-4);

  > * {
    width: 100%;
  }
}
</style>
