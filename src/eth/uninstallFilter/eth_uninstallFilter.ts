import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Uninstalls a filter with given id.
 *
 * @example
 * Filter identifier: "0x01"
 * Result: true
 *
 * Implements the `eth_uninstallFilter` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_uninstallFilter' as const

/**
 * Parameters for `eth_uninstallFilter`
 */
export interface Params {
  /** hex encoded unsigned integer */
  filter identifier: Quantity
}

/**
 * Result for `eth_uninstallFilter`
 */
export type Result = Quantity
