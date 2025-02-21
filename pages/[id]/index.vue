<template>
  <PageFrameSm class="holder">
    <ProfileHeader :account="account" :links="mainSocials" />

    <SocialLinks :links="otherSocials" class="socials" size="" />

    <ProfileBio :account="account" />

    <section v-if="createdSets?.length">
      <SectionTitle>Artist For Sets</SectionTitle>
      <SetCardGrid :submissions="createdSets" :minimal="false"class="set-grid" />
    </section>

    <section v-if="account.richContentLinks?.length" class="known-for">
      <SectionTitle>Also Known For</SectionTitle>
      <RichContentLinks :links="account.richContentLinks" />
    </section>

    <section v-if="createdSubmissions?.length">
      <SectionTitle>Submissions</SectionTitle>
      <SetCardGrid :submissions="createdSubmissions" :minimal="false" class="set-grid" />
    </section>

    <section v-if="account.opepen_count">
      <SectionTitle>Owned Opepen <template v-if="account.opepen_count > 12">({{ account.opepen_count }})</template></SectionTitle>

      <OpepenGrid
        :url="`${url}/opepen`"
        :key="`${account.address}-opepen`"
        :limit="80"
      />
    </section>

    <section v-if="account.burned_opepen_count">
      <SectionTitle>Burned Opepen <template v-if="account.burned_opepen_count > 12">({{ account.burned_opepen_count }})</template></SectionTitle>

      <OpepenGrid
        :url="`${url}/burned`"
        :key="`${account.address}-burned-opepen`"
        :limit="80"
        :subline="token => `Burned Opepen #${token.opepen.token_id}`"
      />
    </section>

    <!-- <AdminMenuFloating> -->
    <!--   <Button :to="`/settings/${account.address}`"> -->
    <!--     <Icon type="settings" /> -->
    <!--     <span>Settings</span> -->
    <!--   </Button> -->
    <!-- </AdminMenuFloating> -->
  </PageFrameSm>

</template>

<script setup>
// TODO: Implement `@` prefix for user routes and the needed redirects
const { account } = defineProps({ account: Object })
const url = `${useApiBase()}/accounts/${account.address}`
const { mainSocials, otherSocials } = useSocials(account)

// =========================================
// SETS & SUBMISSIONS
// =========================================
const createdSets = computed(() => account.createdSets
  ? account.createdSets
    .filter(s => !! s.set_id)
    .sort((s1, s2) => s1.set_id > s2.set_id ? 1 : -1)
  : []
)
const createdSubmissions = computed(() => account.createdSets
  ? account.createdSets
    .filter(s => ! s.set_id)
    .sort((s1, s2) => s1.created_at > s2.created_at ? -1 : 1)
  : []
)

useMetaData({
  title: `${account.display} | Opepen`,
  og: `${useApiBase()}/render/accounts/${account.address}/image`,
})
</script>

<style scoped>
.holder {
  width: 100%;
  margin: 0 auto;
  display: grid;
  gap: var(--spacer-lg);
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

.set-grid {
  --gap: var(--spacer) !important;
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

section {
  display: grid;
  gap: var(--spacer);
}
</style>

