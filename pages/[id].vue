<template>
  <div class="holder">
    <header
      :style="{
        backgroundImage: `linear-gradient(to top, var(--opaque-black) 10%, var(--transparent-black) 150%), url(${coverImageURL})`
      }"
    >
      <div>
        <Avatar :account="account" :size="256" class="avatar" />
        <div class="text">
          <h1>
            <span>{{ account.display }}</span>
            <small v-if="account.tagline">{{ account.tagline }}</small>
          </h1>
          <NuxtLink :to="`https://etherscan.io/address/${account.address}`" target="_blank" class="meta-separated">
            <span v-if="account.ens">{{ account.ens }}</span>
            <span>{{ shortAddress(account.address, 6) }}</span>
          </NuxtLink>
          <SocialLinks :links="mainSocials" class="socials" always-show>
            <template #last>
              <li>
                <WithAccount #default="{ address }">
                  <Button v-if="address?.toLowerCase() === account.address" to="/settings" title="Account Settings" class="small">
                    <Icon type="settings" />
                  </Button>
                </WithAccount>
              </li>
            </template>
          </SocialLinks>

        </div>
      </div>
    </header>

    <SocialLinks :links="otherSocials" class="socials" />

    <!-- <SectionNav>
      <NuxtLink :to="`/${id(account)}`">About</NuxtLink>
      <NuxtLink :to="`/${id(account)}/activity`">Activity</NuxtLink>
    </SectionNav> -->

    <NuxtPage :account="account" />

    <AdminMenuFloating>
      <Button :to="`/settings/${account.address}`">
        <Icon type="settings" />
        <span>Settings</span>
      </Button>
    </AdminMenuFloating>
  </div>
</template>

<script setup>
import { imageURI } from '~/helpers/images'
import { id } from '~/helpers/accounts'
import shortAddress from '~/helpers/short-address'

const config = useRuntimeConfig()
const route = useRoute()
const url = `${config.public.opepenApi}/accounts/${route.params.id}`
const { data: account } = await useFetch(url)

const coverImageURL = imageURI(account.value?.coverImage, 'lg')

const socials = computed(() => {
  let socials = account.value?.socials || []

  if (account.value?.twitterHandle) {
    socials = [`https://x.com/${account.value.twitterHandle}`, ...socials]
      .filter((s, index) => !(index > 0 && (s.indexOf('twitter.com') > -1 || s.indexOf('x.com') > -1)))
  }

  return socials
})
const splitSocials = computed(() => socials.value?.length > 5)
const mainSocials = computed(() => splitSocials.value ? socials.value.slice(0, 3) : socials.value)
const otherSocials = computed(() => splitSocials.value ? socials.value.slice(3) : [])
</script>

<style lang="postcss" scoped>
.holder {
  --section-gap: var(--size-8);

  width: 100%;
  max-width: var(--content-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--section-gap);

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
  background-color: var(--gray-z-2);
  background-size: cover;
  background-position: center center;
  border: var(--border);
  border-radius: var(--size-5);
  border-top-left-radius: var(--size-1);

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

  .avatar {
    width: var(--size-9);
    height: var(--size-9);
    border-top-left-radius: var(--size-2);
    margin-top: -5cqh;
    border-color: var(--gray-300);

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
    color: var(--white);

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
    color: var(--gray-700);
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

  + .section-nav {
    margin-top: calc(var(--section-gap) * -1 + var(--size-4));
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
  display: grid;
  justify-content: center;
  container-type: inline-size;
  flex-wrap: wrap;
  max-width: var(--content-width);
  width: 100%;
  margin: 5vh auto;
  gap: var(--size-4);
  grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
}

.created-sets {
  display: grid;
  gap: var(--size-4);

  > * {
    width: 100%;
  }
}
</style>
