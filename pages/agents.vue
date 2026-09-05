<template>
  <div class="agents-page">
    <div class="agents-content">
      <header class="page-header">
        <NuxtLink to="/sets" class="wordmark" aria-label="Opepen permanent collection">
          <img src="/icon.svg" width="32" height="32" alt="" />
          <span>Opepen</span>
        </NuxtLink>
        <a href="/agents.md" class="text-link">
          Read the directive
          <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main id="main-content">
        <section class="intro" aria-labelledby="page-title">
          <div>
            <p class="eyebrow">For creators & agents</p>
            <h1 id="page-title">
              Create Opepen
              <br />
              with your agent.
            </h1>
            <p class="lead">
              One silhouette. Your interpretation. Give your agent the context to make a set
              that collectors want in the permanent collection.
            </p>
          </div>
          <a href="/schematics.svg" class="schematic" aria-label="View the Opepen schematics">
            <img
              src="/wireframe-light.png"
              width="1400"
              height="1400"
              alt="The Opepen silhouette, drawn as a geometric wireframe"
            />
            <span>
              The constraint
              <span aria-hidden="true">↗</span>
            </span>
          </a>
        </section>

        <section class="prompt-section" aria-labelledby="prompt-title">
          <div class="section-heading">
            <div>
              <h2 id="prompt-title">Give this to your agent</h2>
              <p>Use any agent that can read the web and create artwork.</p>
            </div>
            <button type="button" class="copy-button unstyled" @click="copyPrompt">
              <Icon :type="copyState === 'copied' ? 'check' : 'copy'" />
              <span>{{ copyState === 'copied' ? 'Copied' : 'Copy prompt' }}</span>
            </button>
          </div>
          <textarea
            id="agent-prompt"
            ref="promptField"
            :value="agentPrompt"
            aria-labelledby="prompt-title"
            aria-describedby="copy-status"
            readonly
            spellcheck="false"
          />
          <div class="prompt-footer">
            <p id="copy-status" role="status" aria-live="polite">
              {{ copyMessage }}
            </p>
            <a href="/agents.md" class="text-link">
              opepen.art/agents.md
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section class="process" aria-labelledby="process-title">
          <h2 id="process-title" class="eyebrow">From context to collection</h2>
          <ol>
            <li>
              <span class="step-number" aria-hidden="true">01</span>
              <h3>Study the work.</h3>
              <p>
                Your agent reads the directive, explores existing sets through the public API,
                and inspects the artwork. No wallet is needed to research.
              </p>
            </li>
            <li>
              <span class="step-number" aria-hidden="true">02</span>
              <h3>Make it your own.</h3>
              <p>
                Develop an original idea within the Opepen silhouette. A print set uses six
                artworks; a dynamic set has 80 final artworks. The guide covers every slot.
              </p>
            </li>
            <li>
              <span class="step-number" aria-hidden="true">03</span>
              <h3>Review, then submit.</h3>
              <p>
                Get finished files, names, a description, and previews. Review the package,
                then use your wallet to submit a set or contribute to an open one.
              </p>
            </li>
          </ol>
        </section>

        <section class="selection" aria-labelledby="selection-title">
          <h2 id="selection-title">The collectors decide.</h2>
          <div>
            <p>
              Publishing makes your set a candidate. Collectors opt eligible unrevealed Opepen
              into the artwork they want. A staged set needs enough demand in every edition
              group to reach consensus and reveal.
            </p>
            <p>
              Likes alone don’t select a set. When you contribute to someone else’s set, its
              creator chooses which pieces to include.
            </p>
          </div>
        </section>

        <nav class="next-steps" aria-label="Explore and create Opepen">
          <NuxtLink to="/sets">
            Explore sets
            <span aria-hidden="true">↗</span>
          </NuxtLink>
          <NuxtLink to="/create">
            Create a set
            <span aria-hidden="true">↗</span>
          </NuxtLink>
          <NuxtLink to="/contribute">
            Contribute
            <span aria-hidden="true">↗</span>
          </NuxtLink>
        </nav>
      </main>

      <footer class="page-footer">
        <span>Opepen Edition · Visualize Value</span>
        <a href="/agents.md">
          Full agent directive
          <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

useMetaData({
  title: 'Create Opepen with your agent | Opepen',
  description:
    'Give your agent the Opepen creator directive. Study existing artwork, develop an original set, and prepare a complete submission.',
})

const agentPrompt =
  'Read https://opepen.art/agents.md and help me create an original Opepen set that can compete for the permanent collection. Study existing submissions and revealed sets through the public API, inspect their artwork, and develop a distinct concept. Produce the finished artwork, names, description, source files, and preview contact sheets. Prepare a complete submission package for my review before publishing.'

const promptField = ref<HTMLTextAreaElement | null>(null)
const copyState = ref<'idle' | 'copied' | 'manual'>('idle')
const copyMessage = computed(() => {
  if (copyState.value === 'copied') return 'Copied. Paste it into your agent to begin.'
  if (copyState.value === 'manual') return 'Select and copy the prompt above to continue.'
  return 'No repository setup needed.'
})

async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(agentPrompt)
    copyState.value = 'copied'
  } catch {
    promptField.value?.focus()
    promptField.value?.select()
    copyState.value = 'manual'
  }
}
</script>

<style scoped>
.agents-page {
  min-height: 100dvh;
  background: var(--background);
  color: var(--color);
  font-size: 1rem;
  line-height: 1.6;
}

.agents-content {
  width: min(100% - 3rem, 64rem);
  margin-inline: auto;
}

.page-header,
.page-footer,
.wordmark,
.section-heading,
.prompt-footer,
.copy-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.page-header {
  padding-block: 1.75rem;
  border-bottom: 1px solid var(--gray-z-3);
}

.wordmark,
.eyebrow,
.step-number,
.copy-button,
.page-footer {
  font-family: var(--ui-font-family);
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.035em;
}

.wordmark {
  justify-content: flex-start;
  gap: 0.75rem;
  color: var(--color);
}

a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  color: var(--color);
  text-decoration: underline;
  text-underline-offset: 0.3em;
}

a:focus-visible,
button:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--color);
  outline-offset: 5px;
}

.text-link {
  font-size: 0.875rem;
  color: var(--gray-z-6);
}

.intro {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 13rem;
  align-items: center;
  gap: 3rem;
  padding-block: 4rem 3rem;
}

.eyebrow {
  color: var(--gray-z-6);
  margin: 0 0 1.25rem;
}

h1 {
  margin: 0;
  font-size: clamp(2.4rem, 5vw, 3.75rem);
  font-weight: 500;
  letter-spacing: -0.055em;
  line-height: 1.06;
}

.lead {
  max-width: 34rem;
  margin: 1.5rem 0 0;
  font-size: 1.125rem;
  color: var(--gray-z-6);
}

.schematic {
  display: block;
  overflow: hidden;
  border: 1px solid var(--gray-z-3);
}

.schematic img {
  display: block;
  width: 100%;
  height: auto;
  filter: invert(1);
}

.schematic > span {
  display: flex;
  justify-content: space-between;
  padding: 0.65rem 0.85rem;
  font-size: 0.875rem;
  border-top: 1px solid var(--gray-z-3);
  color: var(--gray-z-6);
}

h2,
h3 {
  margin: 0;
  font-size: 1.125rem;
  line-height: 1.35;
  font-weight: 500;
  letter-spacing: -0.02em;
}

.prompt-section {
  padding: 1.5rem;
  border: 1px solid var(--gray-z-4);
  background: var(--gray-z-0);
}

.section-heading p {
  margin: 0.4rem 0 0;
  font-size: 0.875rem;
  color: var(--gray-z-6);
}

.copy-button {
  flex-shrink: 0;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0.65rem 1rem;
  border: 1px solid var(--color);
  border-radius: 0;
  background: var(--color);
  color: var(--background);
  cursor: pointer;
}

.copy-button:hover {
  background: var(--gray-z-7);
  border-color: var(--gray-z-7);
}

.copy-button :deep(svg) {
  width: 1rem;
  height: 1rem;
}

textarea {
  display: block;
  width: 100%;
  min-height: 10rem;
  margin-block: 1.25rem 1rem;
  padding: 1rem;
  resize: vertical;
  border: 1px solid var(--gray-z-3);
  border-radius: 0;
  background: var(--background);
  color: var(--gray-z-7);
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.65;
}

.prompt-footer {
  align-items: baseline;
  flex-wrap: wrap;
  font-size: 0.875rem;
  color: var(--gray-z-6);
}

.prompt-footer p {
  margin: 0;
}

.process {
  padding-block: 3.5rem;
}

.process ol {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2.5rem;
  margin: 1.75rem 0 0;
  padding: 0;
  list-style: none;
}

.step-number {
  display: block;
  margin-bottom: 0.85rem;
  color: var(--gray-z-6);
}

.process p,
.selection p {
  margin: 0.75rem 0 0;
  color: var(--gray-z-6);
}

.selection {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2.5rem;
  padding-block: 2rem;
  border-block: 1px solid var(--gray-z-3);
}

.selection p:first-child {
  margin-top: 0;
}

.next-steps {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2rem;
  padding-block: 1.75rem;
}

.next-steps a {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 2.75rem;
}

.page-footer {
  flex-wrap: wrap;
  padding-block: 1.5rem 2.5rem;
  border-top: 1px solid var(--gray-z-3);
  color: var(--gray-z-6);
  font-size: 0.75rem;
}

@media (max-width: 45rem) {
  .intro {
    grid-template-columns: minmax(0, 1fr) 8rem;
    gap: 1.5rem;
    padding-top: 2.5rem;
  }

  .process ol {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }

  .selection {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  textarea {
    min-height: 15rem;
  }
}

@media (max-width: 30rem) {
  .agents-content {
    width: calc(100% - 2rem);
  }

  .intro {
    grid-template-columns: 1fr;
  }

  .schematic {
    display: none;
  }

  .prompt-section {
    padding: 1rem;
  }

  .page-header {
    gap: 0.5rem;
  }
}
</style>
