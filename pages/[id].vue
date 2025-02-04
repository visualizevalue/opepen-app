<template>
  <div class="holder">
    <ProfileHeader :account="account" :links="mainSocials" />

    <SocialLinks :links="otherSocials" class="socials" size="" />

    <NuxtPage :account="account" />

    <!-- <AdminMenuFloating> -->
    <!--   <Button :to="`/settings/${account.address}`"> -->
    <!--     <Icon type="settings" /> -->
    <!--     <span>Settings</span> -->
    <!--   </Button> -->
    <!-- </AdminMenuFloating> -->
  </div>
</template>

<script setup>
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
const splitSocials = computed(() => socials.value?.length > 3)
const mainSocials = computed(() => splitSocials.value ? socials.value.slice(0, 2) : socials.value)
const otherSocials = computed(() => splitSocials.value ? socials.value.slice(2) : [])
</script>

<style scoped>
.holder {
  width: 100%;
  margin: 0 auto;
  display: grid;
  gap: var(--spacer-lg);

  @media (--md) {
    max-width: var(--content-width-sm);
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
