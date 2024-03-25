<template>
  <article>
    <h1>User Settings</h1>
    <hr>
    <form @submit.prevent="save" v-if="session">
      <ImageUpload @stored="pfp = $event" @reset="pfp = null" name="PFP" :image="pfp" class="pfp" />
      <ImageUpload @stored="cover = $event" @reset="cover = null" name="Cover Photo" :image="cover" class="cover" />

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
      <label class="checkbox">
        <input type="checkbox" v-model="notificationNewSet">
        <span>New Set Revealed</span>
      </label>
      <label class="checkbox">
        <input type="checkbox" v-model="notificationNewSubmission">
        <span>New Set Submission Published</span>
      </label>
      <label class="checkbox">
        <input type="checkbox" v-model="notificationNewCuratedSubmission">
        <span>New Curated Submission Published</span>
      </label>
      <label class="checkbox">
        <input type="checkbox" v-model="notificationRevealStarted">
        <span>Consensus met</span>
      </label>
      <label class="checkbox">
        <input type="checkbox" v-model="notificationRevealPaused">
        <span>Consensus paused</span>
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

      <div>
        <span class="label known-for-label">"Known For" Links</span>
        <SortableList :items="knownForLinks" @update="knownForLinks = $event" class="known-for">
          <template v-slot="{ item, index }">
            <div class="known-for-link">
              <button @click.stop.prevent="removeKnownForLink(index)" class="delete" type="button"><Icon type="x" stroke-width="3" /></button>
              <div class="images">
                <span class="label">Images</span>
                <div>
                  <ImageUpload @stored="knownForLinks[index].logo = $event" @reset="knownForLinks[index].logo = null" name="PFP" :image="knownForLinks[index].logo" class="logo" />
                  <ImageUpload @stored="knownForLinks[index].cover = $event" @reset="knownForLinks[index].cover = null" name="Cover" :image="knownForLinks[index].cover" class="cover" />
                </div>
              </div>
              <label class="url">
                <span class="label">URL</span>
                <input type="text" :value="item.url" @input="knownForLinks[index].url = $event.target.value" placeholder="URL">
              </label>
              <label class="title">
                <span class="label">Title</span>
                <input type="text" :value="item.title" @input="knownForLinks[index].title = $event.target.value" placeholder="Title">
              </label>
              <label class="description">
                <span class="label">Description</span>
                <Input type="text" :model-value="item.description" @update:model-value="knownForLinks[index].description = $event" />
              </label>
            </div>
          </template>
        </SortableList>
      </div>


      <div class="actions">
        <Button @click.stop.prevent="addKnownForLink" type="button">Add</Button>
        <small class="muted" v-if="lastSavedKnownForLinks">Last saved {{ formatTime(lastSavedKnownForLinks) }}</small>
        <Button @click.stop.prevent="saveKnownForLinks" type="button" :disabled="savingKnownFor">
          <span v-if="savingKnownFor">Saving...</span>
          <span v-else>Save</span>
        </Button>
      </div>
    </form>
  </article>
</template>

<script setup>
import { DateTime } from 'luxon'
import { formatTime } from '~/helpers/dates'
import { useEnsName } from '~/helpers/use-wagmi'
import { useSignIn, isAdmin } from '~/helpers/siwe'
import { validateURI } from '~/helpers/urls'

const config = useRuntimeConfig()
const router = useRouter()
const route = useRoute()

const props = defineProps({ address: String })
const address = computed(() => props.address)

const { session } = useSignIn()
const ens = useEnsName(address)

onMounted(() => {
  if (! session.value) return router.replace(route.params.id ? `/holders/${route.params.id}` : '/')
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

const knownForLinks = ref(settings.value?.richContentLinks)
const addKnownForLink = () => {
  knownForLinks.value.push({ _id: knownForLinks.value.length, address: address.value })
}
const removeKnownForLink = async (index) => {
  const item = knownForLinks.value[index]

  if (item?.id && ! confirm(`Remove content?`)) return

  knownForLinks.value?.splice(index, 1)

  try {
    await $fetch(`${config.public.opepenApi}/rich-links/${item.id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
  } catch (e) {
    knownForLinks.value?.splice(index, 0, item)
  }
}
const savingKnownFor = ref(false)
const lastSavedKnownForLinks = ref(null)
const saveKnownForLinks = async () => {
  savingKnownFor.value = true

  try {
    const data = await $fetch(`${config.public.opepenApi}/rich-links`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        links: knownForLinks.value?.map((link, index) => ({
          ...link,
          logo_image_id: link.logo?.uuid,
          cover_image_id: link.cover?.uuid,
          sort_index: index,
        })),
      })
    })
    knownForLinks.value = data

    lastSavedKnownForLinks.value = DateTime.now()
  } catch (e) {
    // ...
  }

  savingKnownFor.value = false
}

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
  knownForLinks.value = data?.richContentLinks
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
  article, article form {
    display: grid;
    gap: var(--size-5)
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

  .cover {
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

  .known-for {
    margin: var(--size-5) 0;

    .known-for-link {
      position: relative;
      width: 100%;
      background: var(--gray-z-1);
      border: var(--border);
      padding: var(--size-4) var(--size-5) var(--size-5);
      display: grid;
      gap: var(--size-4);
      border-radius: var(--size-4);
      border-top-left-radius: var(--size-0);

      .delete {
        position: absolute;
        top: var(--size-4);
        right: var(--size-4);
      }

      .images {

        > div {
          display: flex;
          gap: var(--size-4);
        }

        .logo,
        .cover {
          width: 6rem;
          height: 6rem;

          :deep(label) {
            height: 100%;
          }

          :deep(.image) {
            padding-bottom: 0;
            height: 6rem;

            img {
              min-height: 100%;
              min-width: 100%;
              object-fit: cover;
            }
          }
        }

        .cover {
          width: 12rem;
        }
      }

    }
  }

  p.label {
    margin: 0;
  }
</style>
