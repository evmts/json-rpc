import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Creates a filter in the node, allowing for later polling. Registers client interest in new blocks, and returns an identifier.
 *
 * @example
 * Result: "0x01"
 *
 * Implements the `eth_newBlockFilter` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_newBlockFilter' as const

/**
 * Parameters for `eth_newBlockFilter`
 */
export interface Params {
}

/**
 * Result for `eth_newBlockFilter`
 *
 * hex encoded unsigned integer
 */
export type Result = Quantity
