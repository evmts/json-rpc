import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Generates and returns an estimate of how much gas is necessary to allow the transaction to complete.
 *
 * @example
 * Transaction: ...
 * Result: "0x5208"
 *
 * Implements the `eth_estimateGas` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_estimateGas' as const

/**
 * Parameters for `eth_estimateGas`
 */
export interface Params {
  /** Transaction object generic to all types */
  transaction: Quantity

  /** Block number or tag */
  block: Quantity
}

/**
 * Result for `eth_estimateGas`
 *
 * hex encoded unsigned integer
 */
export type Result = Quantity
