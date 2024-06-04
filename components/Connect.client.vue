<template>
  <div>
    <Button v-if="! isConnected" @click="open = true" id="main-connect">
      <slot>
        <DefaultOpepenAvatar class="avatar" />

        <span>Check-In</span>
      </slot>
    </Button>
    <div v-else>
      <ButtonGroup>
        <Button :to="`/${ id }`" id="main-connect">
          <Account :address="address" />
        </Button>
        <Button to="/settings" title="User Settings"><Icon type="settings" /></Button>
      </ButtonGroup>
    </div>

    <Modal
      :open="open"
      @close="open = false"
      title="Connect Wallet"
    >
      <ChooseWallet />
    </Modal>

    <Modal
      :open="signingIn"
      title="Signing In"
      :click-outside="false"
      :x-close="false"
    >
      <p>Requesting "Sign In With Ethereum" confirmation...</p>
    </Modal>
  </div>
</template>

<script setup>
import { useSignIn, isAuthenticated } from '~/helpers/siwe'
import { useAccount, id } from '~/helpers/use-wagmi'

const { address, isConnected } = useAccount()
const { signingIn, fetchMe } = useSignIn()

const open = ref(false)
watch(isConnected, async () => {
  open.value = false

  await fetchMe()
})
onMounted(() => fetchMe())
</script>
