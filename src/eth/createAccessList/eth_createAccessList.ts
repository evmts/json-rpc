import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Generates an access list for a transaction.
 *
 * @example
 * Transaction: ...
 * Block: "latest"
 * Result: ...
 *
 * Implements the `eth_createAccessList` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_createAccessList' as const

/**
 * Parameters for `eth_createAccessList`
 */
export interface Params {
  /** Transaction object generic to all types */
  transaction: Quantity

  /** Block number or tag */
  block: Quantity
}

/**
 * Result for `eth_createAccessList`
 *
 * Access list result
 */
export type Result = Quantity
