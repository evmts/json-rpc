import type { Hex } from './Hex.js'

/**
 * Hex-encoded Ethereum address (20 bytes).
 *
 * Pattern: `^0x[0-9a-fA-F]{40}$`
 *
 * @see https://github.com/ethereum/execution-apis
 */
export type Address = Hex & { readonly __brand: 'Address' }

/**
 * Creates a validated Address from a hex string.
 *
 * @param address - Hex string (must be exactly 20 bytes / 42 characters including 0x)
 * @returns Validated Address
 * @throws Error if not a valid Ethereum address
 *
 * @example
 * ```ts
 * const addr = Address('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')
 * ```
 */
export const Address = (address: `0x${string}`): Address => {
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
    throw new Error(`Invalid address: ${address}`)
  }
  return address as Address
}
