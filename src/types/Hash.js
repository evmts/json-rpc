/**
 * @fileoverview 32-byte hash type definition with validation
 */

/**
 * @typedef {import('./Hex.js').Hex} Hex
 */

/**
 * Hex-encoded 32-byte hash.
 *
 * Pattern: `^0x[0-9a-f]{64}$`
 *
 * @typedef {Hex & { readonly __brand: 'Hash' }} Hash
 * @see https://github.com/ethereum/execution-apis
 */

/**
 * Creates a validated Hash from a hex string.
 *
 * @param {`0x${string}`} hash - Hex string (must be exactly 32 bytes / 66 characters including 0x)
 * @returns {Hash} Validated Hash
 * @throws {Error} If not a valid hash
 *
 * @example
 * ```js
 * const hash = Hash('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef')
 * ```
 */
export const Hash = (hash) => {
  if (!/^0x[0-9a-f]{64}$/.test(hash)) {
    throw new Error(`Invalid hash: ${hash}`)
  }
  return /** @type {Hash} */ (hash)
}
