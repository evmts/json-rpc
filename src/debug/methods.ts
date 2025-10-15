/**
 * Debug JSON-RPC Methods
 *
 * This module provides a type-safe mapping of debug namespace methods to their types.
 * All imports are kept separate to maintain tree-shakability.
 */

// Method imports - each import is separate for tree-shaking
import * as debug_getBadBlocks from './getBadBlocks/debug_getBadBlocks.js'
import * as debug_getRawBlock from './getRawBlock/debug_getRawBlock.js'
import * as debug_getRawHeader from './getRawHeader/debug_getRawHeader.js'
import * as debug_getRawReceipts from './getRawReceipts/debug_getRawReceipts.js'
import * as debug_getRawTransaction from './getRawTransaction/debug_getRawTransaction.js'

/**
 * Method name enum - provides string literals for each method
 */
export const DebugMethod = {
  debug_getBadBlocks: 'debug_getBadBlocks',
  debug_getRawBlock: 'debug_getRawBlock',
  debug_getRawHeader: 'debug_getRawHeader',
  debug_getRawReceipts: 'debug_getRawReceipts',
  debug_getRawTransaction: 'debug_getRawTransaction',
} as const

/**
 * Type-safe method name union
 */
export type DebugMethod = typeof DebugMethod[keyof typeof DebugMethod]

/**
 * Type mapping from method name to method module
 */
export interface DebugMethodMap {
  'debug_getBadBlocks': typeof debug_getBadBlocks
  'debug_getRawBlock': typeof debug_getRawBlock
  'debug_getRawHeader': typeof debug_getRawHeader
  'debug_getRawReceipts': typeof debug_getRawReceipts
  'debug_getRawTransaction': typeof debug_getRawTransaction
}

/**
 * Helper type to extract Params type from method name
 */
export type DebugParams<M extends DebugMethod> = DebugMethodMap[M]['Params']

/**
 * Helper type to extract Result type from method name
 */
export type DebugResult<M extends DebugMethod> = DebugMethodMap[M]['Result']

// Re-export individual method modules for direct access (tree-shakable)
export {
  debug_getBadBlocks,
  debug_getRawBlock,
  debug_getRawHeader,
  debug_getRawReceipts,
  debug_getRawTransaction,
}
