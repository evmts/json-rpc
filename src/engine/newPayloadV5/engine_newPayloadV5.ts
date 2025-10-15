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
 * Expected blob versioned hashes: ...
 * Parent beacon block root: "0x169630f535b4a41330164c6e5c92b1224c0c407f582d407d0ac3d206cd32fd52"
 * Execution requests: ...
 * Result: ...
 *
 * Implements the `engine_newPayloadV5` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'engine_newPayloadV5' as const

/**
 * Parameters for `engine_newPayloadV5`
 */
export interface Params {
  /** Execution payload object V4 */
  execution payload: Quantity

  expected blob versioned hashes: Quantity

  /** 32 byte hex value */
  parent beacon block root: Hash

  execution requests: Quantity
}

/**
 * Result for `engine_newPayloadV5`
 *
 * Payload status object deprecating INVALID_BLOCK_HASH status
 */
export type Result = Quantity
