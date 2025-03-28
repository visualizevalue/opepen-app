<template>
  <PageFrameMd>

    <PageHeader>
      <SectionTitle>Generate</SectionTitle>
      <div class="generate-buttons">
        <Button
          class="small centered"
          @click="download"
        >
          <Icon :type="isDownloading ? 'check' : 'download'" />
          <span>{{ isDownloading ? 'Downloaded!' : 'Download' }}</span>
        </Button>
        <Button
          class="small centered"
          @click="copy"
        >
          <Icon :type="isCopying ? 'check' : 'copy'" />
          <span>{{ isCopying ? 'Copied image' : 'Copy image' }}</span>
        </Button>
      </div>
    </PageHeader>

    <div class="preview-area">
      <div class="sidebar">
        <div v-for="i in 10" :key="i" class="thumbnail"
          @click="() => {
            selectedImageIndex = i;
            selectedHistoryIndex = null;
          }">
          <img :src="`editor/opepen-${i}.png`" :alt="`Opepen ${i}`" />
        </div>
      </div>
      <div class="preview">
        <img v-if="selectedHistoryIndex && versions.length > 0" 
          :src="`data:image/png;base64,${versions.find(v => v.id === selectedHistoryIndex)?.imageData}`" 
          alt="Selected Opepen" />
        <img v-else-if="selectedHistoryIndex === 0" 
          :src="versions.find(v => v.id === 0)?.imageUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='" 
          alt="Selected Opepen" />
        <img v-else-if="selectedImageIndex" 
          :src="`/editor/opepen-${selectedImageIndex}.png`" 
          alt="Selected Opepen" />
        <img v-else
          :src="`/editor/opepen-1.png`"
          alt="Selected Opepen" />
      </div>
      <div class="history-sidebar">
        <div v-for="version in versions" 
          :key="version.id" 
          class="history-item" 
          :class="{ active: selectedHistoryIndex === version.id }"
          @click="() => {
            selectedHistoryIndex = version.id;
            selectedImageIndex = null;
          }">
          <Icon v-if="selectedHistoryIndex === version.id" type="check" />
          <p class="history-version">v{{ versions.length - versions.indexOf(version) - 1 }}</p>
          <p class="history-prompt">{{ version.prompt }}</p>
        </div>
        <div class="history-sidebar-footer">
          <Button v-if="versions.length > 1" @click="clearHistory" class="small">Clear history</Button>
        </div>
      </div>
    </div>

    <div class="prompt-area">
      <input ref="promptInput" v-model="prompt" placeholder="Write your opeprompt..." class="input prompt-input" autofocus @keyup.enter="generate" :disabled="isGenerating" />
      <Button @click="generate" :disabled="isGenerating" class="prompt-button">
        <span>{{ isGenerating ? 'Generating opepen...' : 'Generate opepen' }}</span>
      </Button>
    </div>

  </PageFrameMd>
</template>

<script setup>
import useGemini from '~/composables/gemini'
import useStorage from '~/composables/storage'
import downloadImage from '~/utils/download-image'

useMetaData({
  title: `Generate | Opepen`,
})

const { generateImage } = useGemini()
const { saveVersions, loadVersions, saveSelectedHistory, loadSelectedHistory } = useStorage()
const promptInput = ref(null)
const previewImage = ref(null)

const prompt = ref('')
const selectedImageIndex = ref(1)
const selectedHistoryIndex = ref(null)
const isGenerating = ref(false)
const versions = ref([])
const isDownloading = ref(false)
const isCopying = ref(false)

const getCurrentImageUrl = () => {
  if (selectedHistoryIndex.value !== null) {
    const selectedVersion = versions.value.find(v => v.id === selectedHistoryIndex.value)
    if (selectedVersion?.imageData) {
      return `data:image/png;base64,${selectedVersion.imageData}`
    }
    return selectedVersion?.imageUrl || '/editor/opepen-1.png'
  } else if (selectedImageIndex.value) {
    return `/editor/opepen-${selectedImageIndex.value}.png`
  }
  return '/editor/opepen-1.png'
}

const download = async () => {
  isDownloading.value = true
  const imageUrl = getCurrentImageUrl()
  await downloadImage(imageUrl, { name: 'opepen' })
  setTimeout(() => {
    isDownloading.value = false
  }, 2000)
}

const copy = async () => {
  isCopying.value = true
  const imageUrl = getCurrentImageUrl()
  const response = await fetch(imageUrl)
  const blob = await response.blob()
  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob
    })
  ])
  setTimeout(() => {
    isCopying.value = false
  }, 2000)
}

const focusPrompt = () => {
  setTimeout(() => {
    promptInput.value?.focus()
  }, 100)
}

// Load versions from localStorage on mount
onMounted(async () => {
  try {
    console.log('Loading versions...')
    const [savedVersions, savedHistory] = await Promise.all([
      loadVersions(),
      loadSelectedHistory()
    ])
    console.log('Loaded versions:', savedVersions)
    
    if (savedVersions && savedVersions.length > 0) {
      // Sort versions by timestamp, keeping v0 at the end
      const v0 = savedVersions.find(v => v.id === 0)
      const otherVersions = savedVersions
        .filter(v => v.id !== 0)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      
      versions.value = [...otherVersions]
      if (v0) {
        versions.value.push(v0)
      }

      // Always select the latest version (first in the array)
      if (otherVersions.length > 0) {
        selectedHistoryIndex.value = otherVersions[0].id
      } else {
        selectedHistoryIndex.value = 0
      }
    } else {
      // If no versions exist, create fresh v0
      versions.value = [{
        id: 0,
        prompt: 'Original opepen',
        imageUrl: '/editor/opepen-1.png',
        timestamp: new Date().toISOString()
      }]
      selectedHistoryIndex.value = 0
      await saveVersions(versions.value)
    }
    
    // Reset thumbnail selection to default
    selectedImageIndex.value = 1
    focusPrompt()
  } catch (error) {
    console.error('Failed to load versions:', error)
  }
})

// Save versions to storage whenever they change
watch(versions, async (newVersions) => {
  try {
    console.log('Saving versions:', newVersions)
    await saveVersions(newVersions)
    console.log('Successfully saved versions')
  } catch (error) {
    console.error('Failed to save versions:', error)
  }
}, { deep: true })

// Watch for thumbnail selection
watch(selectedImageIndex, async (newIndex) => {
  // Clear selectedHistoryIndex to show the thumbnail
  selectedHistoryIndex.value = null
  focusPrompt()
})

// Watch for history selection and save state
watch(selectedHistoryIndex, async (newIndex) => {
  if (newIndex !== null) {
    try {
      await saveSelectedHistory(newIndex)
    } catch (error) {
      console.error('Failed to save selected history:', error)
    }
  }
  focusPrompt()
})

const clearHistory = async () => {
  // Keep only v0
  const v0 = versions.value.find(v => v.id === 0)
  
  // Clear all image data from localStorage except v0
  versions.value.forEach(version => {
    if (version.id !== 0) {
      localStorage.removeItem(`opepen-image-${version.id}`)
    }
  })
  
  versions.value = v0 ? [v0] : []
  selectedHistoryIndex.value = 0
  await saveVersions(versions.value)
}

const generate = async () => {
  if (!prompt.value) return

  try {
    isGenerating.value = true
    
    // Get the current image to edit based on what's shown in the preview
    let imageUrl
    
    if (selectedHistoryIndex.value !== null) {
      // If a version is selected, use that version's image
      const selectedVersion = versions.value.find(v => v.id === selectedHistoryIndex.value)
      if (selectedVersion?.imageData) {
        imageUrl = `data:image/png;base64,${selectedVersion.imageData}`
      } else {
        imageUrl = selectedVersion?.imageUrl || '/editor/opepen-1.png'
      }
    } else if (selectedImageIndex.value) {
      // If a thumbnail is selected, use that thumbnail
      imageUrl = `/editor/opepen-${selectedImageIndex.value}.png`
    } else {
      // Fallback to first thumbnail if nothing is selected
      imageUrl = '/editor/opepen-1.png'
    }

    // Add prompt modifiers to ensure proper output
    const squarePrompt = `${prompt.value} (maintain square 1:1 aspect ratio)`
    const generatedImageData = await generateImage(squarePrompt, imageUrl)
    
    // Create new version with the generated image
    const newVersion = {
      id: Date.now(),
      prompt: prompt.value,
      imageData: generatedImageData,
      timestamp: new Date().toISOString()
    }

    // If this is the first edit, store the current image as v0
    if (versions.value.length === 1 && versions.value[0].id === 0) {
      // Store the current thumbnail as v0
      const v0 = {
        id: 0,
        prompt: 'Original opepen',
        imageUrl: selectedImageIndex ? `/editor/opepen-${selectedImageIndex.value}.png` : '/editor/opepen-1.png',
        timestamp: new Date().toISOString()
      }
      versions.value = [newVersion, v0]
    } else {
      // For subsequent edits, add new version at the beginning and keep v0 at the bottom
      const v0 = versions.value.find(v => v.id === 0)
      versions.value = [newVersion, ...versions.value.filter(v => v.id !== 0)]
      if (v0) {
        versions.value.push(v0)
      }
    }

    // Select the new version immediately
    selectedHistoryIndex.value = newVersion.id

    // Save to storage after any edit
    await saveVersions(versions.value)

    // Clear the input and focus
    prompt.value = ''
    focusPrompt()
  } catch (error) {
    console.error('Generation failed:', error)
    // Clear input even on error
    prompt.value = ''
    focusPrompt()
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped>

.page-frame-md {
  height: calc(100vh - var(--spacer-lg) * 2);
  justify-content: space-between;
  padding: 0 var(--spacer-lg);
  flex-direction: column;
  overflow: visible;
  display: flex;
  gap: 0;
}

.generate-buttons {
  gap: var(--size-2);
  display: flex;
  .button {
    padding: var(--size-1) var(--size-2) !important;
    width: 140px;
  }
}

.preview-area {
  margin: var(--spacer) 0 var(--spacer-lg);
  border-radius: var(--border-radius);
  background: var(--gray-z-1);
  aspect-ratio: 1.5 / 1;
  border: var(--border);
  position: relative;
  overflow: hidden;
  display: flex;
  width: 100%;
  top: -10px;
}

.preview {
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--size-4);
  background: var(--gray-z-1);
  position: relative;
  min-height: 400px;
  img {
    object-fit: contain;
    aspect-ratio: 1 / 1;
    height: 100%;
    width: 100%;
    opacity: 0;
    top: 0;
    left: 0;
    &[src] {
      opacity: 1;
    }
  }
}

.sidebar {
  background: var(--background);
  border-right: var(--border);
  flex-direction: column;
  padding: var(--size-3);
  align-items: center;
  width: fit-content;
  gap: var(--size-2);
  overflow-y: auto;
  display: flex;

  &::-webkit-scrollbar {
    display: none;
  }
}

.thumbnail {
  width: 60px;
  height: 60px;
  cursor: pointer;
  position: relative;
  border: 1px solid transparent;
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
  overflow: hidden;
  background: var(--gray-z-1);
  flex-shrink: 0;

  &:hover {
    border-color: var(--border-color-light);
  }
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.history-sidebar {
  padding: var(--size-4) var(--size-4) 0 var(--size-4);
  background: var(--background);
  border-left: var(--border);
  align-items: flex-start;
  flex-direction: column;
  position: relative;
  gap: var(--size-3);
  overflow-y: auto;
  flex-shrink: 0;
  display: flex;
  width: 200px;
}

.history-item {
  border-radius: var(--border-radius);
  background: var(--gray-z-1);
  transition: all 0.2s ease;
  padding: var(--size-2);
  flex-direction: column;
  border: var(--border);
  position: relative;
  gap: var(--size-1);
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  width: 100%;

  .icon {
    right: var(--size-2);
    top: var(--size-2);
    position: absolute;
    height: 14px;
    width: 14px;
  }
  &:hover {
    border-color: var(--border-color-light);
  }
}

.history-item.active {
  border-color: var(--border-color-light);
}

.history-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.history-version {
  margin-bottom: var(--size-1);
  color: var(--gray-z-6);
  font-size: var(--font-xs);
}

.history-prompt {
  font-size: var(--font-xs);
  line-height: 1.4;
  color: var(--text);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.history-sidebar-footer {
  background: linear-gradient(to bottom, transparent, var(--background));
  padding: 80px 0 var(--size-4);
  margin-top: auto;
  position: sticky;
  width: 100%;
  bottom: 0;
  left: 0;
  .button {
    width: 100%;
  }
}

.prompt-area {
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  margin-bottom: calc(-1 * var(--main-padding-top));
  max-width: var(--content-width);
  background: var(--gray-z-1);
  padding: var(--size-2);
  border: var(--border);
  align-items: center;
  gap: var(--size-2);
  display: flex;
  width: 100%;
  left: 0;
}

.prompt-input {
  resize: none;
  flex: 1;
  &:disabled {
    cursor: wait;
  }
  &::placeholder {
    color: var(--gray-z-5) !important;
  }
}

.prompt-button {
  width: fit-content;
  height: 100%;
}
</style>
