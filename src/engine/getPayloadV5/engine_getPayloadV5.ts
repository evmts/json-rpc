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
 * Implements the `engine_getPayloadV5` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'engine_getPayloadV5' as const

/**
 * Parameters for `engine_getPayloadV5`
 */
export interface Params {
  /** 8 hex encoded bytes */
  payload id: Quantity
}

/**
 * Result for `engine_getPayloadV5`
 */
export type Result = Quantity
