import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Exchanges transition configuration
 *
 * @example
 * Consensus client configuration: ...
 * Result: ...
 *
 * Implements the `engine_exchangeTransitionConfigurationV1` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'engine_exchangeTransitionConfigurationV1' as const

/**
 * Parameters for `engine_exchangeTransitionConfigurationV1`
 */
export interface Params {
  /** Transition configuration object */
  consensus client configuration: Quantity
}

/**
 * Result for `engine_exchangeTransitionConfigurationV1`
 *
 * Transition configuration object
 */
export type Result = Quantity
