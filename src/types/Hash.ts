import type { Hex } from './Hex.js'

/**
 * Hex-encoded 32-byte hash.
 *
 * Pattern: `^0x[0-9a-f]{64}$`
 *
 * @see https://github.com/ethereum/execution-apis
 */
export type Hash = Hex & { readonly __brand: 'Hash' }

/**
 * Creates a validated Hash from a hex string.
 *
 * @param hash - Hex string (must be exactly 32 bytes / 66 characters including 0x)
 * @returns Validated Hash
 * @throws Error if not a valid hash
 *
 * @example
 * ```ts
 * const hash = Hash('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef')
 * ```
 */
export const Hash = (hash: `0x${string}`): Hash => {
  if (!/^0x[0-9a-f]{64}$/.test(hash)) {
    throw new Error(`Invalid hash: ${hash}`)
  }
  return hash as Hash
}
