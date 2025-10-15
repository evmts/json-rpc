import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns an array of all logs matching the specified filter.
 *
 * @example
 * Filter: ...
 * Result: ...
 *
 * Implements the `eth_getLogs` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_getLogs' as const

/**
 * Parameters for `eth_getLogs`
 */
export interface Params {
  /** filter */
  filter: Quantity
}

/**
 * Result for `eth_getLogs`
 *
 * Filter results
 */
export type Result = Quantity
