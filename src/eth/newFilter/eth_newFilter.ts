import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Install a log filter in the server, allowing for later polling. Registers client interest in logs matching the filter, and returns an identifier.
 *
 * @example
 * Filter: ...
 * Result: "0x01"
 *
 * Implements the `eth_newFilter` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_newFilter' as const

/**
 * Parameters for `eth_newFilter`
 */
export interface Params {
  /** filter */
  filter: Quantity
}

/**
 * Result for `eth_newFilter`
 *
 * hex encoded unsigned integer
 */
export type Result = Quantity
