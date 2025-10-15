import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns an array of all logs matching the filter with the given ID (created using `eth_newFilter`).
 *
 * @example
 * Filter identifier: "0x01"
 * Result: ...
 *
 * Implements the `eth_getFilterLogs` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_getFilterLogs' as const

/**
 * Parameters for `eth_getFilterLogs`
 */
export interface Params {
  /** hex encoded unsigned integer */
  filter identifier: Quantity
}

/**
 * Result for `eth_getFilterLogs`
 *
 * Filter results
 */
export type Result = Quantity
