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
 * Implements the `engine_newPayloadV2` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'engine_newPayloadV2' as const

/**
 * Parameters for `engine_newPayloadV2`
 */
export interface Params {
  execution payload: Quantity
}

/**
 * Result for `engine_newPayloadV2`
 *
 * Payload status object deprecating INVALID_BLOCK_HASH status
 */
export type Result = Quantity
