<template>
  <div class="full">
    <SectionNav>
      <h1>User Settings</h1>
    </SectionNav>

    <form @submit.prevent="save" v-if="session">
      <ImageUpload @stored="pfp = $event" @reset="pfp = null" name="PFP" :image="pfp" class="pfp" />
      <ImageUpload @stored="cover = $event" @reset="cover = null" name="Cover Photo" :image="cover" class="pfp-cover" />

      <label class="name">
        <span class="label">Name</span>
        <input v-model="name" placeholder="Your display name" />
      </label>
      <label class="tagline">
        <span class="label">Tagline</span>
        <input v-model="tagline" placeholder="You in 1-5 words" />
      </label>
      <label class="quote">
        <span class="label">Quote</span>
        <Input v-model="quote" placeholder="A quote from you" />
      </label>
      <label class="bio">
        <span class="label">Bio</span>
        <Input v-model="bio" placeholder="A short bio" />
      </label>

      <SaveSettings :lastSaved="lastSaved" :saving="saving" />

      <hr>

      <label class="email">
        <span class="label">E-Mail (not shared on profile)</span>
        <input v-model="email" placeholder="Your Email" type="email" />
      </label>

      <p class="label">Notifications</p>
      <label class="checkbox">
        <input type="checkbox" v-model="notificationGeneral">
        <span>General Information</span>
      </label>
      <!-- <label class="checkbox">
        <input type="checkbox" v-model="notificationNewSubmission">
        <span>New Set Submission Published</span>
      </label> -->
      <label class="checkbox">
        <input type="checkbox" v-model="notificationNewCuratedSubmission">
        <span>New Set Available For Opt In</span>
      </label>
      <label class="checkbox">
        <input type="checkbox" v-model="notificationRevealStarted">
        <span>Consensus met</span>
      </label>
      <label class="checkbox">
        <input type="checkbox" v-model="notificationRevealPaused">
        <span>Consensus paused</span>
      </label>
      <label class="checkbox">
        <input type="checkbox" v-model="notificationNewSet">
        <span>New Set Revealed</span>
      </label>

      <SaveSettings :lastSaved="lastSaved" :saving="saving" />

      <hr>

      <ConnectTwitterSettings :user="settings.x_user" />

      <hr>

      <div>
        <span class="label">Social Links</span>
        <SortableList :items="socials" @update="socials = $event" class="socials">
          <template v-slot="{ item, index }">
            <input type="text" :value="item.url" @input="socials[index].url = $event.target.value">
          </template>
        </SortableList>
      </div>

      <SaveSettings :lastSaved="lastSaved" :saving="saving" />

      <hr>

      <RichContentLinksForm
        :loaded-links="settings.richContentLinks"
        :new-link-data="{ address }"
        title="Known For Links"
      />

    </form>
  </div>
</template>

<script setup>
import { DateTime } from 'luxon'
import { useAccount, useEnsName } from '~/helpers/use-wagmi'
import { useSignIn, isAdmin, isAuthenticated } from '~/helpers/siwe'
import { validateURI } from '~/helpers/urls'

const config = useRuntimeConfig()
const router = useRouter()
const route = useRoute()

const props = defineProps({ address: String })

const { address: myAddress } = useAccount()
const address = computed(() => route.params?.id?.length ? route.params.id[0] : myAddress.value)

const { session, signIn } = useSignIn()
const ens = useEnsName(address)

onMounted(async () => {
  if (! isAuthenticated.value) {
    await signIn()

    if (! isAuthenticated.value) {
      return router.replace(route.params.id ? `/${route.params.id}` : '/')
    }
  }
})

const url = computed(() => `${config.public.opepenApi}/accounts/settings/${isAdmin.value ? address.value : ''}`)
const { data: settings, status } = await useFetch(url, { credentials: 'include' })

const pfp = ref(settings.value?.pfp || null)
const cover = ref(settings.value?.coverImage || null)
const name = ref(settings.value?.name || ens.value)
const email = ref(settings.value?.email)
const notificationGeneral = ref(settings.value?.notification_general)
const notificationNewSet = ref(settings.value?.notification_new_set)
const notificationNewSubmission = ref(settings.value?.notification_new_submission)
const notificationNewCuratedSubmission = ref(settings.value?.notification_new_curated_submission)
const notificationRevealStarted = ref(settings.value?.notification_reveal_started)
const notificationRevealPaused = ref(settings.value?.notification_reveal_paused)

const tagline = ref(settings.value?.tagline || '')
const quote = ref(settings.value?.quote || '')
const bio = ref(settings.value?.bio || '')

const withEmptySocialsItem = list => {
  if (! list.length || list[list.length - 1].url !== '') {
    list.push({ id: list.length, url: '' })
  }

  return list
}
const sortableSocials = list => {
  const array = Array.isArray(list)
    ? list.map((url, id) => ({ id, url }))
    : [{ id: 0, url: '' }]

  return withEmptySocialsItem(array)
}
const socials = ref(sortableSocials(settings.value?.socials))
watch(() => JSON.stringify(socials.value), () => socials.value = withEmptySocialsItem(socials.value))

const updateData = (data = {}) => {
  pfp.value = data?.pfp
  cover.value = data?.coverImage
  name.value = data?.name || ens.value
  email.value = data?.email
  notificationGeneral.value = data?.notification_general
  notificationNewSet.value = data?.notification_new_set
  notificationNewSubmission.value = data?.notification_new_submission
  notificationNewCuratedSubmission.value = data?.notification_new_curated_submission
  notificationRevealStarted.value = data?.notification_reveal_started
  notificationRevealPaused.value = data?.notification_reveal_paused

  tagline.value = data?.tagline
  quote.value = data?.quote
  bio.value = data?.bio
  socials.value = sortableSocials(data?.socials)
  // knownForLinks.value = data?.richContentLinks
}

watch([status, settings, ens], () => updateData(settings.value))

const saving = ref(false)
const lastSaved = ref(null)

const save = async () => {
  saving.value = true
  try {
    const data = await $fetch(url.value, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        notification_general: notificationGeneral.value,
        notification_new_set: notificationNewSet.value,
        notification_new_submission: notificationNewSubmission.value,
        notification_new_curated_submission: notificationNewCuratedSubmission.value,
        notification_reveal_started: notificationRevealStarted.value,
        notification_reveal_paused: notificationRevealPaused.value,
        pfp_image_id: pfp.value?.uuid || null,
        cover_image_id: cover.value?.uuid || null,
        tagline: tagline.value,
        quote: quote.value,
        bio: bio.value,
        socials: socials.value?.map(s => s.url).filter(s => validateURI(s)),
      })
    })
    updateData(data)

    lastSaved.value = DateTime.now()
  } catch (e) {
    // ...
  }

  saving.value = false
}
</script>

<style lang="postcss" scoped>
  div, div form {
    display: grid;
    gap: var(--size-5)
  }

  form {
    width: 100%;
    max-width: var(--content-width);
    margin: 0 auto;
    padding: var(--size-4) var(--container-padding-x) var(--size-8);

    @media (--md) {
      padding-left: 0;
      padding-right: 0;
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--size-4);
  }

  h1 {
    font-size: var(--font-lg);
  }

  .pfp {
    max-width: 10rem;

    :deep(.reset) {
      top: 0;
      right: 0;
    }
  }

  .pfp,
  .pfp :deep(.image) {
    border-top-right-radius: 50% !important;
    border-bottom-right-radius: 50% !important;
    border-bottom-left-radius: 50% !important;
  }

  .pfp {
    max-width: 8rem;
  }

  .pfp-cover {
    display: block;
    max-width: 24rem;

    :deep(label) {
      height: 33cqw !important;
    }

    + .name {
      margin-top: var(--size-6);
    }
  }

  hr {
    margin: var(--size-7) 0;
  }

  .socials {
    margin-top: var(--size-2);
  }

  p.label {
    margin: 0;
  }
</style>
