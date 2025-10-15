import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Updates the forkchoice state
 *
 * @example
 * Forkchoice state: ...
 * Payload attributes: ...
 * Result: ...
 *
 * Implements the `engine_forkchoiceUpdatedV3` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'engine_forkchoiceUpdatedV3' as const

/**
 * Parameters for `engine_forkchoiceUpdatedV3`
 */
export interface Params {
  /** Forkchoice state object V1 */
  forkchoice state: Quantity

  /** Payload attributes object V3 */
  payload attributes: Quantity
}

/**
 * Result for `engine_forkchoiceUpdatedV3`
 *
 * Forkchoice updated response
 */
export type Result = Quantity
