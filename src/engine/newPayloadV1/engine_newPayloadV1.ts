import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Runs execution payload validation
 *
 * @example
 * Execution payload: ...
 * Result: ...
 *
 * Implements the `engine_newPayloadV1` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'engine_newPayloadV1' as const

/**
 * Parameters for `engine_newPayloadV1`
 */
export interface Params {
  /** Execution payload object V1 */
  execution payload: Quantity
}

/**
 * Result for `engine_newPayloadV1`
 *
 * Payload status object V1
 */
export type Result = Quantity
