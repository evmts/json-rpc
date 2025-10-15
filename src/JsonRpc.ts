/**
 * Ethereum JSON-RPC Type System
 *
 * This module provides the root JSON-RPC namespace that combines all method namespaces.
 * Imports are kept tree-shakable - only import what you use.
 */

import type { EngineMethod, EngineParams, EngineResult, EngineMethodMap } from './engine/methods.js'
export * from './engine/methods.js'
import type { EthMethod, EthParams, EthResult, EthMethodMap } from './eth/methods.js'
export * from './eth/methods.js'
import type { DebugMethod, DebugParams, DebugResult, DebugMethodMap } from './debug/methods.js'
export * from './debug/methods.js'

// Export primitive types separately
export * as types from './types/index.js'

/**
 * Union of all JSON-RPC method names
 */
export type JsonRpcMethod = EngineMethod | EthMethod | DebugMethod

/**
 * Extract parameters type for any JSON-RPC method
 */
export type JsonRpcParams<M extends JsonRpcMethod> =
  M extends EngineMethod ? EngineParams<M> :
  M extends EthMethod ? EthParams<M> :
  M extends DebugMethod ? DebugParams<M> :
  never

/**
 * Extract result type for any JSON-RPC method
 */
export type JsonRpcResult<M extends JsonRpcMethod> =
  M extends EngineMethod ? EngineResult<M> :
  M extends EthMethod ? EthResult<M> :
  M extends DebugMethod ? DebugResult<M> :
  never
