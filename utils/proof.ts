import { toHex, keccak256, ripemd160 } from 'viem'

export const proof = (input: string) => ripemd160(keccak256(toHex(input)))

