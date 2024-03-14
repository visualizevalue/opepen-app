import { type SignTypedDataArgs } from '@wagmi/core'

export const ACTION = 'bid'

export const bidDefinition = (object: { Auction: string, Opepen: string }): SignTypedDataArgs => {
  const name = 'Opepen Handshake Bid'
  const domain = {
    name,
    version: '1',
  }

  const types = {
    Object: [
      { name: 'Auction', type: 'string' },
      { name: 'Opepen', type: 'string' },
    ],
    [name]: [
      { name: 'Action', type: 'string' },
      { name: 'Object', type: 'Object' },
    ],
  }

  return {
    primaryType: name,
    message: {
      Action: ACTION,
      Object: object,
    },
    domain,
    types,
  }
}

export const signaturesLoading = ref(true)
export const signatures = ref([])
export const totalSignaturesCount = ref(0)
export const activeSignature = ref(null)

export const useSignatures = () => {
  const config = useRuntimeConfig()

  const pageSize = 1
  const query = `filters%5Bschema%5D=2&limit=${pageSize}`

  const load = async () => {
    signaturesLoading.value = true
    try {
      const response: any = await $fetch(`${config.public.signatureApi}/signatures?${query}`)
      signatures.value = response.data
      totalSignaturesCount.value = response.meta.total

      if (! activeSignature.value) {
        activeSignature.value = signatures.value[0]
      }
    } catch (e) {
      //
    }
    signaturesLoading.value = false
  }

  return {
    signatures,
    totalSignaturesCount,
    signaturesLoading,
    load,
  }
}
