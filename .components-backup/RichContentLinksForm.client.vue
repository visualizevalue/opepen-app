<template>
  <div>
    <span class="label rich-content-label">{{ title }}</span>
    <SortableList :items="links" @update="links = $event" class="rich-content">
      <template v-slot="{ item, index }">
        <div class="rich-content-link">
          <button @click.stop.prevent="remove(index)" class="delete" type="button"><Icon type="x" stroke-width="3" /></button>
          <div class="images">
            <span class="label">Images</span>
            <div>
              <ImageUpload @stored="links[index].logo = $event" @reset="links[index].logo = null" name="Icon" :image="links[index].logo" class="logo" />
              <ImageUpload @stored="links[index].cover = $event" @reset="links[index].cover = null" name="Cover" :image="links[index].cover" class="cover" />
            </div>
          </div>
          <label class="url">
            <span class="label">URL</span>
            <input type="text" :value="item.url" @input="links[index].url = $event.target.value" placeholder="URL">
          </label>
          <label class="title">
            <span class="label">Title</span>
            <input type="text" :value="item.title" @input="links[index].title = $event.target.value" placeholder="Title">
          </label>
          <label class="description">
            <span class="label">Description</span>
            <Input type="text" :model-value="item.description" @update:model-value="links[index].description = $event" />
          </label>
        </div>
      </template>
    </SortableList>
  </div>

  <div class="actions">
    <Button @click.stop.prevent="add" type="button">Add</Button>
    <small class="muted" v-if="lastSaved">Last saved {{ formatTime(lastSaved) }}</small>
    <Button @click.stop.prevent="save" type="button" :disabled="saving">
      <span v-if="saving">Saving...</span>
      <span v-else>Save</span>
    </Button>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  loadedLinks: {
    type: Array,
    default: () => [],
  },
  newLinkData: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['updated'])

const config = useRuntimeConfig()
const links = ref(props.loadedLinks)
const add = () => {
  links.value.push({ _id: links.value.length, ...props.newLinkData, })
}
const remove = async (index) => {
  const item = links.value[index]

  if (! confirm(`Remove content?`)) return

  // Remove item locally
  links.value?.splice(index, 1)

  // If it's not stored yet, don't do anything...
  if (! item.id) return

  try {
    await $fetch(`${config.public.opepenApi}/rich-links/${item.id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
  } catch (e) {
    links.value?.splice(index, 0, item)
  }
}
const saving = ref(false)
const lastSaved = ref(null)
const save = async () => {
  saving.value = true

  try {
    const data = await $fetch(`${config.public.opepenApi}/rich-links`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        links: links.value?.map((link, index) => ({
          ...link,
          logo_image_id: link.logo?.uuid,
          cover_image_id: link.cover?.uuid,
          sort_index: index,
        })),
      })
    })
    links.value = data

    lastSaved.value = DateTime.now()
  } catch (e) {
    // ...
  }

  saving.value = false

  emit('updated', links.value)
}
</script>

<style scoped>

  .rich-content {
    margin: var(--size-5) 0 0;
    display: grid;
    gap: var(--size-4);

    .rich-content-link {
      margin: 0;
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

  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--size-4);
  }


</style>
