/**
 * @fileoverview Shared types for Ethereum JSON-RPC
 */

// Re-export types and utilities
export * from './Hex.js'
export { Address, isAddress } from './Address.js'
export { Hash, isHash } from './Hash.js'
export { Quantity, isQuantity } from './Quantity.js'
export { BlockTag } from './BlockTag.js'
export * from './BlockSpec.js'
export { JsonRpcError, JsonRpcErrorCode } from './JsonRpcError.js'

/**
 * @typedef {import('./Hex.js').Hex} Hex
 * @typedef {import('./Address.js').Address} Address
 * @typedef {import('./Hash.js').Hash} Hash
 * @typedef {import('./Quantity.js').Quantity} Quantity
 * @typedef {import('./BlockTag.js').BlockTag} BlockTag
 * @typedef {import('./BlockSpec.js').BlockSpec} BlockSpec
 * @typedef {import('./JsonRpcError.js').JsonRpcErrorCode} JsonRpcErrorCode
 */
