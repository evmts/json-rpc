import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns the current price per gas in wei.
 *
 * @example
 * Result: "0x3e8"
 *
 * Implements the `eth_gasPrice` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_gasPrice' as const

/**
 * Parameters for `eth_gasPrice`
 */
export interface Params {
}

/**
 * Result for `eth_gasPrice`
 *
 * Gas price
 */
export type Result = Quantity
