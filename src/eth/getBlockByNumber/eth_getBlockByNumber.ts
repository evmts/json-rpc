import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns information about a block by number.
 *
 * @example
 * block: "0x68b3"
 * Hydrated transactions: false
 * Result: ...
 *
 * Implements the `eth_getBlockByNumber` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_getBlockByNumber' as const

/**
 * Parameters for `eth_getBlockByNumber`
 */
export interface Params {
  /** Block number or tag */
  block: Quantity

  /** hydrated */
  hydrated transactions: Quantity
}

/**
 * Result for `eth_getBlockByNumber`
 */
export type Result = Quantity
