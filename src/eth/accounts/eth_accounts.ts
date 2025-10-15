import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns a list of addresses owned by client.
 *
 * @example
 * Result: ...
 *
 * Implements the `eth_accounts` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_accounts' as const

/**
 * Parameters for `eth_accounts`
 */
export interface Params {
}

/**
 * Result for `eth_accounts`
 *
 * Accounts
 */
export type Result = Quantity
