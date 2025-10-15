import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Exchanges list of supported Engine API methods
 *
 * @example
 * Consensus client methods: ...
 * Result: ...
 *
 * Implements the `engine_exchangeCapabilities` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'engine_exchangeCapabilities' as const

/**
 * Parameters for `engine_exchangeCapabilities`
 */
export interface Params {
  consensus client methods: Quantity
}

/**
 * Result for `engine_exchangeCapabilities`
 */
export type Result = Quantity
