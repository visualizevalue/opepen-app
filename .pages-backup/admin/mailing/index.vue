<template>
  <section>
    <div>
      <PageHeader class="full">General Mailing</PageHeader>

      <div class="help muted">
        <p>Create an Email Template below. Use the <a href="https://mjml.io" target="_blank">MJML-Documentation</a> for reference.</p>
      </div>

      <div class="mail-editor">
        <div class="editor">
          <input type="text" v-model="subject" placeholder="Email Subject">

          <CodeEditor
            v-model="templateString"
            mode="htmlmixed"
          />
        </div>

        <div class="preview">
          <header>
            <p><span class="muted">Subject:</span> <span>{{ subject }}</span></p>
            <p><span class="muted">From:</span> <span>Opepen &lt;opepen@vv.xyz&gt;</span></p>
          </header>
          <iframe
            v-if="preview?.rendered"
            ref="frame"
            frameborder="0"
          ></iframe>
        </div>
      </div>

      <footer>
        <Button @click="sendTest" :disabled="sending">
          <Icon type="inbox" />
          <span>Test Mailing</span>
        </Button>
        <Button @click="send" :disabled="sending">
          <Icon type="mail" />
          <span>Send to {{ preview?.userCount }} Users</span>
        </Button>
      </footer>
    </div>
  </section>
</template>

<script setup>
const config = useRuntimeConfig()

const subject = ref('GM')
const templateString = ref(`<mj-text font-size="24px" color="#242424" font-family="helvetica">
	<p>GM {{ name }}</p>
</mj-text>

<mj-image src="https://opepen.art/og/og.png"></mj-image>

<mj-text font-size="20px" color="#242424" font-family="helvetica">
  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui laboriosam corporis quidem voluptas ea quod, unde ipsa pariatur.</p>
  <p>Incidunt reprehenderit pariatur corrupti est necessitatibus consequuntur blanditiis dolorum nisi repellendus ratione! Porro.</p>
</mj-text>

<mj-button
  href="https://opepen.art"
  background-color="black"
  border-radius="24px"
  text-transform="uppercase"
  font-family="helvetica"
  font-size="16px"
>Browse Opepen.art</mj-button>

<mj-text font-size="20px" color="#242424" font-family="helvetica">
  <p>VV</p>
  <p><small><a href="{{ unsubscribeUrl }}" style="color: #9b9b9b;">Unsubscribe</a></small></p>
</mj-text>`)

const { data: preview } = await useFetch(`${config.public.opepenApi}/notifications/preview`, {
  method: 'POST',
  credentials: 'include',
  body: {
    template: templateString,
  },
})

const src = computed(() => {
  return preview.value && 'data:text/html;charset=utf-8,' + encodeURIComponent(preview.value.rendered)
})
const frame = ref(null)
const reload = () => {
  if (frame.value) {
    frame.value.src = src.value
  }
}

watch([src], () => reload())
onMounted(() => reload())

const sending = ref(false)
const sendMail = async (test = true) => {
  sending.value = true
  await $fetch(`${config.public.opepenApi}/notifications/general`, {
    method: 'POST',
    credentials: 'include',
    body: {
      template: templateString.value,
      subject: subject.value,
      test: test,
    }
  })
  sending.value = false
}

const sendTest = async () => {
  await sendMail()
}

const send = async () => {
  if (! confirm(`Really send email to ${preview.value.userCount} users?`)) return

  await sendMail(false)
}
</script>

<style scoped>
section {
  > div {
    padding: var(--size-4);

    @media (--lg) {
      padding: 0;
    }
  }
}

.help {
  margin: 0 0 var(--size-4) 0;

  a {
    text-decoration: underline;
  }
}

.mail-editor {
  display: grid;
  gap: var(--size-2);
  min-height: calc(100vh - var(--navbar-height) * 3.5);

  @media (--lg) {
    &:has(iframe) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  > .editor {
    display: grid;
    gap: var(--size-2);
    grid-template-rows: min-content;

    input {
      background: var(--ayu-dark-bg);
    }
  }

  .preview {
    height: 100%;
    min-height: calc(100vh - var(--navbar-height) * 4);
    display: grid;
    grid-template-rows: min-content;

    header {
      padding: var(--size-3) var(--size-4);
      background: var(--gray-z-8);
      border-bottom: 1px solid var(--gray-z-7);
      color: var(--gray-z-2);
      display: grid;
      gap: var(--size-2);

      p {
        font-size: var(--font-xs);
        margin: 0;
        padding: 0;
        line-height: 1;
        white-space: nowrap;
        display: grid;
        grid-template-columns: 6em 1fr;
      }
    }
  }

  > .editor > *,
  > .preview {
    border: var(--border);
    border-radius: var(--size-2);
    overflow: hidden;
  }

  iframe {
    width: 100%;
    height: 100%;
  }

}

footer {
  margin: var(--size-5) 0;
  display: flex;
  justify-content: flex-end;
  gap: var(--size-5);
}
</style>
