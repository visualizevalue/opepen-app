<template>
  <form @submit.stop.prevent="() => null">

    <PageHeader>
      <SectionTitle>
        Account Settings
      </SectionTitle>

      <Actions>
        <small class="muted" v-if="lastSaved">Last saved {{ formatTime(lastSaved) }}</small>
      </Actions>
    </PageHeader>

    <Card class="static">
      <div class="images">
        <ImageUpload @stored="pfp = $event" @reset="pfp = null" name="PFP" :image="pfp" class="pfp" />
        <ImageUpload @stored="cover = $event" @reset="cover = null" name="Cover Photo" :image="cover" class="pfp-cover" />
      </div>
      <label>
        <span>Name</span>
        <input v-model="name" class="input" placeholder="Your display name" />
      </label>
      <label>
        <span>Tagline</span>
        <input v-model="tagline" class="input" placeholder="You in 1-5 words" />
      </label>
    </Card>

    <Card class="static">
      <label>
        <span>Quote</span>
        <Input v-model="quote" placeholder="A quote from you" />
      </label>
      <label>
        <span>Bio</span>
        <Input v-model="bio" placeholder="A short bio" />
      </label>

      <ConnectTwitterSettings :user="settings?.x_user" />

      <label>Profile Links</label>
      <SortableList :items="socials" @update="socials = $event" class="socials">
        <template v-slot="{ item, index }">
          <input
            type="text"
            class="input"
            :value="item.url"
            placeholder="https://warpcast.com/opepenedition"
            @input="socials[index].url = $event.target.value"
          >
        </template>
      </SortableList>
    </Card>

    <Card class="static">
      <label>
        <span>
          <span>Email </span>
          <small class="muted">
            <template v-if="settings?.email_verified">(Verified)</template>
            <template v-else>(Verification pending. Please check your inbox.)</template>
          </small>
        </span>
        <input type="email" class="input" v-model="email" placeholder="you@domain.com" />
      </label>
      <label>Notifications</label>
      <FormCheckbox v-model="notificationGeneral">General Information</FormCheckbox>
      <FormCheckbox v-model="notificationNewCuratedSubmission">New Set on Consensus Countdown</FormCheckbox>
    </Card>

    <Card class="static">
      <RichContentLinksForm
        :loaded-links="settings?.richContentLinks"
        :new-link-data="{ address: settings?.address }"
        title="Known For Links"
      />
    </Card>

  </form>
</template>

<script setup>
import { watchDebounced } from '@vueuse/core'

const props = defineProps({
  id: String,
})

const { refreshAccount } = await useProfile()

const { data: settings, refresh } = await useApi(`/accounts/settings/${props.id}`, {
  credentials: 'include',
})

if (session.value.address?.toLowerCase() !== settings.value?.address?.toLowerCase() && !isAdmin.value) {
  await navigateTo('/settings', { replace: true })
}

const pfp = ref(settings.value?.pfp || null)
const cover = ref(settings.value?.coverImage || null)
const name = ref(settings.value?.name)
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
watchEffect(() => socials.value = withEmptySocialsItem(socials.value))
const cleanSocials = computed(() => socials.value?.map(s => s.url).filter(s => validateURI(s)))

const saving = ref(false)
const lastSaved = ref(null)
const body = computed(() => JSON.stringify({
  pfp_image_id: pfp.value?.uuid || null,
  cover_image_id: cover.value?.uuid || null,
  name: name.value,
  tagline: tagline.value,
  bio: bio.value,
  quote: quote.value,
  email: email.value,
  socials: cleanSocials.value,
  notification_general: notificationGeneral.value,
  notification_new_set: notificationNewSet.value,
  notification_new_submission: notificationNewSubmission.value,
  notification_new_curated_submission: notificationNewCuratedSubmission.value,
  notification_reveal_started: notificationRevealStarted.value,
  notification_reveal_paused: notificationRevealPaused.value,
}))
const { execute } = await useApiPost(`/accounts/settings/${props.id}`, { body, watch: false })
const save = async () => {
  saving.value = true
  await execute()
  await refresh()
  await refreshAccount() // Update global cache
  lastSaved.value = DateTime.now()
  saving.value = false
}
watchDebounced(
  body,
  () => save(),
  { debounce: 800, maxWait: 2500 },
)
</script>

<style scoped>
.actions {
  align-items: center;

  > small {
    @mixin ui-font;
    color: var(--muted);
    font-size: var(--font-xs);
  }
}

form,
.card,
.grid {
  display: grid;
  gap: var(--spacer);
}

.grid {
  @container page (min-width: 36rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    .span-2 {
      grid-column: span 2;
    }
  }
}

.card {
  container-type: inline-size;

  hr {
    margin: var(--spacer) 0;
  }
}

.images {
  display: grid;
  grid-template-columns: 1fr 73cqw;
  gap: var(--spacer);

  &:deep(.image-upload:last-child label) {
    height: 100%;
  }
}
</style>
