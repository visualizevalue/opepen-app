<template>
  <PageFrameMd>

    <PageHeader>
      <SectionTitle>Generate</SectionTitle>
    </PageHeader>

    <div class="preview-area">
      <div class="sidebar">
        <div v-for="i in 10" :key="i" class="thumbnail"
          @click="selectedImageIndex = i">
          <img :src="`editor/opepen-${i}.png`" :alt="`Opepen ${i}`" />
        </div>
      </div>
      <div class="preview">
        <img v-if="selectedHistoryIndex === 0" 
          :src="versions.find(v => v.id === 0)?.imageUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='" 
          alt="Selected Opepen" />
        <img v-else-if="selectedHistoryIndex && versions.length > 0" 
          :src="`data:image/png;base64,${versions.find(v => v.id === selectedHistoryIndex)?.imageData}`" 
          alt="Selected Opepen" />
        <img v-else 
          :src="`editor/opepen-${selectedImageIndex}.png`" 
          alt="Selected Opepen" />
      </div>
      <div class="history-sidebar">
        <div v-for="version in versions" 
          :key="version.id" 
          class="history-item" 
          :class="{ active: selectedHistoryIndex === version.id }"
          @click="selectedHistoryIndex = version.id">
          <Icon v-if="selectedHistoryIndex === version.id" type="check" />
          <p class="history-version">v{{ versions.length - versions.indexOf(version) - 1 }}</p>
          <p class="history-prompt">{{ version.prompt }}</p>
        </div>
      </div>
    </div>

    <div class="prompt-area">
      <Input ref="promptInput" v-model="prompt" placeholder="Write your opeprompt..." class="prompt-input" autofocus />
      <Button @click="generate" :disabled="isGenerating" class="prompt-button">
        <span>{{ isGenerating ? 'Generating opepen...' : 'Generate opepen' }}</span>
      </Button>
    </div>

  </PageFrameMd>
</template>

<script setup>
import useGemini from '~/composables/gemini'

useMetaData({
  title: `Generate | Opepen`,
})

const { generateImage } = useGemini()
const promptInput = ref(null)

const prompt = ref('')
const selectedImageIndex = ref(1)
const selectedHistoryIndex = ref(null)
const isGenerating = ref(false)
const versions = ref([])

const focusPrompt = () => {
  setTimeout(() => {
    promptInput.value?.focus()
  }, 100)
}

// Load versions from localStorage on mount
onMounted(() => {
  const savedVersions = localStorage.getItem('opepen-versions')
  if (savedVersions) {
    // Only load versions that aren't v0 (edited versions)
    versions.value = JSON.parse(savedVersions).filter(v => v.id !== 0)
  }
  
  // Always set first Opepen as fresh version 0
  versions.value.unshift({
    id: 0,
    prompt: 'Original opepen',
    imageUrl: '/editor/opepen-1.png',
    timestamp: new Date().toISOString()
  })
  selectedHistoryIndex.value = 0
  focusPrompt()
})

// Save versions to localStorage whenever they change
watch(versions, (newVersions) => {
  // Only save edited versions (not v0)
  const editedVersions = newVersions.filter(v => v.id !== 0)
  localStorage.setItem('opepen-versions', JSON.stringify(editedVersions))
}, { deep: true })

// Watch for thumbnail selection to update version 0
watch(selectedImageIndex, (newIndex) => {
  // Remove any existing version 0
  versions.value = versions.value.filter(v => v.id !== 0)
  
  // Add new version 0
  versions.value.unshift({
    id: 0,
    prompt: 'Original image',
    imageUrl: `/editor/opepen-${newIndex}.png`,
    timestamp: new Date().toISOString()
  })
  
  // Select version 0
  selectedHistoryIndex.value = 0
  focusPrompt()
})

// Watch for history selection
watch(selectedHistoryIndex, () => {
  focusPrompt()
})

const generate = async () => {
  if (!prompt.value) return

  try {
    isGenerating.value = true
    const imageUrl = `/editor/opepen-${selectedImageIndex.value}.png`
    const generatedImageData = await generateImage(prompt.value, imageUrl)
    
    // Add new version to history
    versions.value.unshift({
      id: Date.now(),
      prompt: prompt.value,
      imageData: generatedImageData,
      timestamp: new Date().toISOString()
    })

    // Select the new version
    selectedHistoryIndex.value = versions.value[0].id
    focusPrompt()
  } catch (error) {
    console.error('Generation failed:', error)
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
  width: fit-content;
  padding: var(--size-3);
  background: var(--background);
  border-right: var(--border);
  display: flex;
  flex-direction: column;
  gap: var(--size-3);
  overflow-y: auto;
  align-items: center;

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
  width: 200px;
  padding: var(--size-4);
  background: var(--background);
  border-left: var(--border);
  display: flex;
  flex-direction: column;
  gap: var(--size-4);
  overflow-y: auto;
  align-items: flex-start;
  flex-shrink: 0;
}

.history-item {
  border: var(--border);
  width: 100%;
  padding: var(--size-3);
  cursor: pointer;
  position: relative;
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
  background: var(--gray-z-1);
  gap: var(--size-1);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  .icon {
    right: 9px;
    position: absolute;
    height: 16px;
    width: 16px;
    top: 11px;
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
  &::placeholder {
    color: var(--gray-z-5) !important;
  }
}

.prompt-button {
  width: fit-content;
  height: 100%;
}
</style>
