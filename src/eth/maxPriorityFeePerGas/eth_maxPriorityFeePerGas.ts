import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns the current maxPriorityFeePerGas per gas in wei.
 *
 * @example
 * Result: "0x773c23ba"
 *
 * Implements the `eth_maxPriorityFeePerGas` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_maxPriorityFeePerGas' as const

/**
 * Parameters for `eth_maxPriorityFeePerGas`
 */
export interface Params {
}

/**
 * Result for `eth_maxPriorityFeePerGas`
 *
 * Max priority fee per gas
 */
export type Result = Quantity
