<template>
  <div>
    <label>
      {{ title }}
      <template v-if="lastSaved">(Last saved {{ formatTime(lastSaved) }})</template>
    </label>

    <SortableList
      :items="links"
      @update="links = $event"
      class="rich-content"
      :disabled="disabled"
    >
      <template v-slot="{ item, index }">
        <div class="rich-content-link">
          <button
            v-if="!disabled"
            @click.stop.prevent="remove(index)"
            class="unstyled delete"
            type="button"
          >
            <Icon type="x" stroke-width="3" />
          </button>
          <div class="images">
            <label>Images</label>
            <div>
              <ImageUpload
                @stored="links[index].logo = $event"
                @reset="links[index].logo = null"
                name="Icon"
                :disabled="disabled"
                :image="links[index].logo"
                class="logo"
              />
              <ImageUpload
                @stored="links[index].cover = $event"
                @reset="links[index].cover = null"
                name="Cover"
                :disabled="disabled"
                :image="links[index].cover"
                class="cover"
              />
            </div>
          </div>
          <label class="url">
            <span class="label">URL</span>
            <input
              class="input"
              type="text"
              :disabled="disabled"
              :value="item.url"
              @input="links[index].url = $event.target.value"
              placeholder="URL"
            />
          </label>
          <label class="title">
            <span class="label">Title</span>
            <input
              class="input"
              type="text"
              :disabled="disabled"
              :value="item.title"
              @input="links[index].title = $event.target.value"
              placeholder="Title"
            />
          </label>
          <label class="description">
            <span class="label">Description</span>
            <Input
              class="input"
              type="text"
              :disabled="disabled"
              :model-value="item.description"
              @update:model-value="links[index].description = $event"
            />
          </label>
        </div>
      </template>
    </SortableList>
  </div>

  <Actions v-if="!disabled">
    <Button @click.stop.prevent="add" type="button">Add</Button>
  </Actions>
</template>

<script setup>
import { watchDebounced } from '@vueuse/core'

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
  disabled: Boolean,
})
const emit = defineEmits(['updated'])

const config = useRuntimeConfig()
const links = ref(props.loadedLinks)

const add = () => {
  links.value.push({ _id: links.value.length, ...props.newLinkData })
}
const remove = async (index) => {
  const item = links.value[index]

  if (!confirm(`Remove content?`)) return

  // Remove item locally
  links.value?.splice(index, 1)

  // If it's not stored yet, don't do anything...
  if (!item.id) return

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
      }),
    })
    links.value = data

    lastSaved.value = DateTime.now()
  } catch (e) {
    // ...
  }

  saving.value = false

  emit('updated', links.value)
}

watchDebounced(links, () => save(), {
  debounce: 500,
  maxWait: 2000,
  deep: true,
})
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
    background: var(--gray-z-0);
    border: var(--border);
    padding: var(--spacer);
    display: grid;
    gap: var(--spacer);
    border-radius: var(--border-radius);

    .delete {
      position: absolute;
      top: var(--spacer);
      right: var(--spacer);
      width: var(--size-4);
      padding: 0;
      outline: none;
      color: var(--muted);

      .icon {
        width: var(--size-3);
        height: var(--size-3);
        color: inherit;
      }

      &:--highlight {
        color: var(--color);
      }
    }

    .images {
      display: grid;
      gap: var(--spacer-sm);

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
