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
 * Implements the `engine_forkchoiceUpdatedV2` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'engine_forkchoiceUpdatedV2' as const

/**
 * Parameters for `engine_forkchoiceUpdatedV2`
 */
export interface Params {
  /** Forkchoice state object V1 */
  forkchoice state: Quantity

  /** Payload attributes object V2 */
  payload attributes: Quantity
}

/**
 * Result for `engine_forkchoiceUpdatedV2`
 *
 * Forkchoice updated response
 */
export type Result = Quantity
