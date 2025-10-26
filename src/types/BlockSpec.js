/**
 * @fileoverview Block specification union type
 *
 * Uses @tevm/primitives for type compatibility across the ecosystem.
 */

/**
 * @typedef {import('./Quantity.js').Quantity} Quantity
 * @typedef {import('./BlockTag.js').BlockTag} BlockTag
 * @typedef {import('./Hash.js').Hash} Hash
 */

/**
 * Block specification - can be a block number, tag, or hash.
 *
 * - Block number: A hex-encoded unsigned integer (Quantity)
 * - Block tag: One of "earliest", "finalized", "safe", "latest", or "pending"
 * - Block hash: A 32-byte hex-encoded hash
 *
 * **Note**: Compatible with `@tevm/primitives/ethereum-types` BlockIdentifier type.
 *
 * @typedef {Quantity | BlockTag | Hash} BlockSpec
 * @see https://github.com/ethereum/execution-apis
 */

export {}
