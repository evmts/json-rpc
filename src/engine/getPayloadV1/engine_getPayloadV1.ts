import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Obtains execution payload from payload build process
 *
 * @example
 * Payload id: "0x0000000021f32cc1"
 * Result: ...
 *
 * Implements the `engine_getPayloadV1` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'engine_getPayloadV1' as const

/**
 * Parameters for `engine_getPayloadV1`
 */
export interface Params {
  /** 8 hex encoded bytes */
  payload id: Quantity
}

/**
 * Result for `engine_getPayloadV1`
 *
 * Execution payload object V1
 */
export type Result = Quantity
