/**
 * @fileoverview Ethereum address type definition with validation
 */

/**
 * @typedef {import('./Hex.js').Hex} Hex
 */

/**
 * Hex-encoded Ethereum address (20 bytes).
 *
 * Pattern: `^0x[0-9a-fA-F]{40}$`
 *
 * @typedef {Hex & { readonly __brand: 'Address' }} Address
 * @see https://github.com/ethereum/execution-apis
 */

/**
 * Creates a validated Address from a hex string.
 *
 * @param {`0x${string}`} address - Hex string (must be exactly 20 bytes / 42 characters including 0x)
 * @returns {Address} Validated Address
 * @throws {Error} If not a valid Ethereum address
 *
 * @example
 * ```js
 * const addr = Address('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')
 * ```
 */
export const Address = (address) => {
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
    throw new Error(`Invalid address: ${address}`)
  }
  return /** @type {Address} */ (address)
}
