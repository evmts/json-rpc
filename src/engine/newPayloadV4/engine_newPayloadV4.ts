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
 * Root of the parent beacon block: "0x169630f535b4a41330164c6e5c92b1224c0c407f582d407d0ac3d206cd32fd52"
 * Execution requests: ...
 * Result: ...
 *
 * Implements the `engine_newPayloadV4` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'engine_newPayloadV4' as const

/**
 * Parameters for `engine_newPayloadV4`
 */
export interface Params {
  /** Execution payload object V3 */
  execution payload: Quantity

  expected blob versioned hashes: Quantity

  /** 32 byte hex value */
  root of the parent beacon block: Hash

  execution requests: Quantity
}

/**
 * Result for `engine_newPayloadV4`
 *
 * Payload status object deprecating INVALID_BLOCK_HASH status
 */
export type Result = Quantity
