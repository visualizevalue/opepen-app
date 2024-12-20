<template>
  <main>
    <h1>Hello World</h1>
    <p>
      <ExpandableText text="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?" />
    </p>

    <Loading />

    <Connect />
    <Disconnect />

    <Alert>
      <p>Test Alert</p>
    </Alert>
    <Alert dismiss="test-alert">
      <p>Test Alert</p>
    </Alert>

    <Actions>
      <Button>Foo</Button>
      <Button>Bar</Button>
      <Button @click="dialogOpen = true">Open Modal</Button>
      <Button @click="popoverOpen = true">Open Popover</Button>
    </Actions>

    <Modal v-model:open="dialogOpen">
      <p>Hellooooo</p>

      <Actions>
        <Button @click="dialogOpen = false">Close</Button>
      </Actions>
    </Modal>

    <Popover v-model:open="popoverOpen" mode="auto">
      <h1>Foo</h1>
    </Popover>

    <Card>
      <h1>Card title</h1>
      <p>Card text</p>
      <CardLink :to="`https://vv.xyz`" title="Foo" />
    </Card>

    <Image src="https://ipfs.vv.xyz/ipfs/QmPCkh5Tq7jropNj9TuW2CWieHgD9F3kz2udtUN1i7THNa?filename=vv.png" />

    <Embed src="https://ipfs.vv.xyz/ipfs/QmXX3zc7xfS5rCdpXySRy1YcQdhsnUEWFszq66CUDYyvSh?filename=bunney-square.mp4" />
  </main>
</template>

<script setup>
const dialogOpen = ref(false)
const popoverOpen = ref(false)
</script>

<style scoped>
main {
  display: grid;
  gap: var(--spacer);
  padding: var(--spacer);
}
</style>

