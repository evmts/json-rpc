/**
 * @fileoverview Shared types for Ethereum JSON-RPC
 */

// Re-export types
export * from './Hex.js'
export { Address } from './Address.js'
export { Hash } from './Hash.js'
export { Quantity } from './Quantity.js'
export { BlockTag } from './BlockTag.js'
export * from './BlockSpec.js'

/**
 * @typedef {import('./Hex.js').Hex} Hex
 * @typedef {import('./Address.js').Address} Address
 * @typedef {import('./Hash.js').Hash} Hash
 * @typedef {import('./Quantity.js').Quantity} Quantity
 * @typedef {import('./BlockTag.js').BlockTag} BlockTag
 * @typedef {import('./BlockSpec.js').BlockSpec} BlockSpec
 */
