import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Polling method for the filter with the given ID (created using `eth_newFilter`). Returns an array of logs, block hashes, or transaction hashes since last poll, depending on the installed filter.
 *
 * @example
 * Filter identifier: "0x01"
 * Result: ...
 *
 * Implements the `eth_getFilterChanges` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_getFilterChanges' as const

/**
 * Parameters for `eth_getFilterChanges`
 */
export interface Params {
  /** hex encoded unsigned integer */
  filter identifier: Quantity
}

/**
 * Result for `eth_getFilterChanges`
 *
 * Filter results
 */
export type Result = Quantity
