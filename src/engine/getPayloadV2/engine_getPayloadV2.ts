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
 * Payload id: "0x0000000038fa5dd"
 * Result: ...
 *
 * Implements the `engine_getPayloadV2` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'engine_getPayloadV2' as const

/**
 * Parameters for `engine_getPayloadV2`
 */
export interface Params {
  /** 8 hex encoded bytes */
  payload id: Quantity
}

/**
 * Result for `engine_getPayloadV2`
 */
export type Result = Quantity
