<template>
  <div v-if="isOpen" class="help-drawer-overlay" @click="close">
    <div class="help-drawer" @click.stop>
      <div class="drawer-header">
        <h3>Submission Help</h3>
        <button type="button" @click="close" class="close-button" aria-label="Close help">
          <Icon type="x" />
        </button>
      </div>

      <div class="drawer-content">
        <div class="help-section">
          <h4><Icon type="image" /> Opepen Schematics</h4>
          <p>
            All Opepen artworks must be based on the official schematics. These define the iconic
            shapes for each edition size (1/1, 1/4, 1/5, 1/10, 1/20, 1/40).
          </p>
          <Button
            to="https://raw.githubusercontent.com/visualizevalue/opepen-api/refs/heads/main/app/Services/OpepenSVG/opepen-schematics.svg"
            target="_blank"
            class="small"
          >
            <Icon type="external-link" />
            <span>View Schematics</span>
          </Button>
        </div>

        <div class="help-section">
          <h4><Icon type="layers" /> Print vs Dynamic</h4>
          <p><strong>Print Sets:</strong></p>
          <ul>
            <li>Upload 6 base images (one per edition)</li>
            <li>Same image used for all Opepen in that edition</li>
            <li>Simpler and faster to create</li>
            <li>Perfect for unified aesthetics</li>
          </ul>

          <p><strong>Dynamic Sets:</strong></p>
          <ul>
            <li>Upload 80+ total images (6 base + 74 variants)</li>
            <li>Each Opepen gets a unique variant</li>
            <li>More work but maximum creative expression</li>
            <li>Each edition size needs variants: 4 for 1/4, 5 for 1/5, etc.</li>
          </ul>
        </div>

        <div class="help-section">
          <h4><Icon type="help-circle" /> Common Questions</h4>

          <details>
            <summary>What image formats are supported?</summary>
            <p>PNG, JPG, GIF, and SVG files are accepted. We recommend PNG for best quality.</p>
          </details>

          <details>
            <summary>What's the recommended image size?</summary>
            <p>
              Minimum 1000x1000px, but 2000x2000px or higher is recommended for optimal display
              across all platforms.
            </p>
          </details>

          <details>
            <summary>Can I edit my submission after publishing?</summary>
            <p>
              Yes, but only certain fields. Images and edition type cannot be changed once
              published. Name, description, and artist info can be updated.
            </p>
          </details>

          <details>
            <summary>How do co-creators work?</summary>
            <p>
              Co-creators are other artists who collaborated on your set. Add their Ethereum
              addresses to give them shared attribution. They'll appear on the set's page.
            </p>
          </details>

          <details>
            <summary>What does "Open for Participation" mean?</summary>
            <p>
              When enabled, other community members can submit ideas or variations for your set.
              You maintain control over what gets included.
            </p>
          </details>

          <details>
            <summary>How long does approval take?</summary>
            <p>
              Submissions are reviewed by the community and admins. This can take anywhere from a
              few days to a few weeks depending on volume and quality.
            </p>
          </details>
        </div>

        <div class="help-section">
          <h4><Icon type="book-open" /> Best Practices</h4>
          <ul>
            <li>
              <strong>Follow the schematics:</strong> Your artwork must respect the opepen shapes
            </li>
            <li>
              <strong>High quality images:</strong> Use high-resolution images (2000x2000px+)
            </li>
            <li><strong>Consistent style:</strong> Maintain a cohesive aesthetic across editions</li>
            <li>
              <strong>Unique names:</strong> Choose edition names that reflect rarity and theme
            </li>
            <li>
              <strong>Descriptive text:</strong> Write a compelling description that tells your
              story
            </li>
            <li>
              <strong>Test previews:</strong> Check the generated previews before publishing
            </li>
          </ul>
        </div>

        <div class="help-section">
          <h4><Icon type="users" /> Community Resources</h4>
          <ul>
            <li>
              <a href="https://discord.gg/opepen" target="_blank">Join the Discord</a> - Get help
              from other artists
            </li>
            <li>
              <a href="https://twitter.com/opepen" target="_blank">Follow on Twitter</a> - See
              featured sets
            </li>
            <li>
              <a href="https://opepen.art" target="_blank">Browse Gallery</a> - Get inspired by
              existing sets
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:open'])

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

const close = () => {
  isOpen.value = false
}

// Close on escape key
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && isOpen.value) {
      close()
    }
  }
  window.addEventListener('keydown', handleEscape)
  onUnmounted(() => window.removeEventListener('keydown', handleEscape))
})
</script>

<style scoped>
.help-drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  display: flex;
  justify-content: flex-end;
  animation: fadeIn var(--speed) ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.help-drawer {
  width: 100%;
  max-width: 32rem;
  background: var(--background);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  animation: slideIn var(--speed) ease;
  overflow: hidden;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacer);
  border-bottom: var(--border);
  background: var(--gray-z-1);

  h3 {
    @mixin h3;
    margin: 0;
  }
}

.close-button {
  @mixin button-reset;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--size-8);
  height: var(--size-8);
  border-radius: var(--border-radius);
  color: var(--muted);
  transition: all var(--speed);
  cursor: pointer;

  &:hover {
    background: var(--gray-z-2);
    color: var(--color);
  }

  :deep(svg) {
    width: var(--size-5);
    height: var(--size-5);
  }
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacer);
  display: flex;
  flex-direction: column;
  gap: var(--spacer-lg);
}

.help-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacer);

  h4 {
    @mixin h4;
    margin: 0;
    display: flex;
    align-items: center;
    gap: var(--spacer-sm);

    :deep(svg) {
      width: var(--size-5);
      height: var(--size-5);
      color: var(--success);
    }
  }

  p {
    margin: 0;
    line-height: 1.6;
    color: var(--gray-z-6);
  }

  ul {
    margin: 0;
    padding-left: var(--spacer);
    display: flex;
    flex-direction: column;
    gap: var(--spacer-xs);

    li {
      line-height: 1.6;
      color: var(--gray-z-6);

      strong {
        color: var(--color);
      }

      a {
        color: var(--success);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  details {
    border: var(--border);
    border-radius: var(--border-radius);
    padding: var(--spacer-sm);
    background: var(--gray-z-0);

    summary {
      cursor: pointer;
      font-weight: 600;
      color: var(--color);
      list-style: none;
      display: flex;
      align-items: center;

      &::-webkit-details-marker {
        display: none;
      }

      &::before {
        content: '▶';
        margin-right: var(--spacer-sm);
        transition: transform var(--speed);
        font-size: var(--font-xs);
        color: var(--muted);
      }
    }

    &[open] summary::before {
      transform: rotate(90deg);
    }

    p {
      margin-top: var(--spacer-sm);
      padding-left: var(--spacer);
    }
  }
}
</style>
