import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns an object with data about the sync status or false.
 *
 * @example
 * Result: ...
 *
 * Implements the `eth_syncing` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_syncing' as const

/**
 * Parameters for `eth_syncing`
 */
export interface Params {
}

/**
 * Result for `eth_syncing`
 *
 * Syncing status
 */
export type Result = Quantity
