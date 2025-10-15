/**
 * Engine JSON-RPC Methods
 *
 * This module provides a type-safe mapping of engine namespace methods to their types.
 * All imports are kept separate to maintain tree-shakability.
 */

// Method imports - each import is separate for tree-shaking
import * as engine_exchangeCapabilities from './exchangeCapabilities/engine_exchangeCapabilities.js'
import * as engine_exchangeTransitionConfigurationV1 from './exchangeTransitionConfigurationV1/engine_exchangeTransitionConfigurationV1.js'
import * as engine_forkchoiceUpdatedV1 from './forkchoiceUpdatedV1/engine_forkchoiceUpdatedV1.js'
import * as engine_forkchoiceUpdatedV2 from './forkchoiceUpdatedV2/engine_forkchoiceUpdatedV2.js'
import * as engine_forkchoiceUpdatedV3 from './forkchoiceUpdatedV3/engine_forkchoiceUpdatedV3.js'
import * as engine_getBlobsV1 from './getBlobsV1/engine_getBlobsV1.js'
import * as engine_getBlobsV2 from './getBlobsV2/engine_getBlobsV2.js'
import * as engine_getPayloadBodiesByHashV1 from './getPayloadBodiesByHashV1/engine_getPayloadBodiesByHashV1.js'
import * as engine_getPayloadBodiesByRangeV1 from './getPayloadBodiesByRangeV1/engine_getPayloadBodiesByRangeV1.js'
import * as engine_getPayloadV1 from './getPayloadV1/engine_getPayloadV1.js'
import * as engine_getPayloadV2 from './getPayloadV2/engine_getPayloadV2.js'
import * as engine_getPayloadV3 from './getPayloadV3/engine_getPayloadV3.js'
import * as engine_getPayloadV4 from './getPayloadV4/engine_getPayloadV4.js'
import * as engine_getPayloadV5 from './getPayloadV5/engine_getPayloadV5.js'
import * as engine_getPayloadV6 from './getPayloadV6/engine_getPayloadV6.js'
import * as engine_newPayloadV1 from './newPayloadV1/engine_newPayloadV1.js'
import * as engine_newPayloadV2 from './newPayloadV2/engine_newPayloadV2.js'
import * as engine_newPayloadV3 from './newPayloadV3/engine_newPayloadV3.js'
import * as engine_newPayloadV4 from './newPayloadV4/engine_newPayloadV4.js'
import * as engine_newPayloadV5 from './newPayloadV5/engine_newPayloadV5.js'

/**
 * Method name enum - provides string literals for each method
 */
export const EngineMethod = {
  engine_exchangeCapabilities: 'engine_exchangeCapabilities',
  engine_exchangeTransitionConfigurationV1: 'engine_exchangeTransitionConfigurationV1',
  engine_forkchoiceUpdatedV1: 'engine_forkchoiceUpdatedV1',
  engine_forkchoiceUpdatedV2: 'engine_forkchoiceUpdatedV2',
  engine_forkchoiceUpdatedV3: 'engine_forkchoiceUpdatedV3',
  engine_getBlobsV1: 'engine_getBlobsV1',
  engine_getBlobsV2: 'engine_getBlobsV2',
  engine_getPayloadBodiesByHashV1: 'engine_getPayloadBodiesByHashV1',
  engine_getPayloadBodiesByRangeV1: 'engine_getPayloadBodiesByRangeV1',
  engine_getPayloadV1: 'engine_getPayloadV1',
  engine_getPayloadV2: 'engine_getPayloadV2',
  engine_getPayloadV3: 'engine_getPayloadV3',
  engine_getPayloadV4: 'engine_getPayloadV4',
  engine_getPayloadV5: 'engine_getPayloadV5',
  engine_getPayloadV6: 'engine_getPayloadV6',
  engine_newPayloadV1: 'engine_newPayloadV1',
  engine_newPayloadV2: 'engine_newPayloadV2',
  engine_newPayloadV3: 'engine_newPayloadV3',
  engine_newPayloadV4: 'engine_newPayloadV4',
  engine_newPayloadV5: 'engine_newPayloadV5',
} as const

/**
 * Type-safe method name union
 */
export type EngineMethod = typeof EngineMethod[keyof typeof EngineMethod]

/**
 * Type mapping from method name to method module
 */
export interface EngineMethodMap {
  'engine_exchangeCapabilities': typeof engine_exchangeCapabilities
  'engine_exchangeTransitionConfigurationV1': typeof engine_exchangeTransitionConfigurationV1
  'engine_forkchoiceUpdatedV1': typeof engine_forkchoiceUpdatedV1
  'engine_forkchoiceUpdatedV2': typeof engine_forkchoiceUpdatedV2
  'engine_forkchoiceUpdatedV3': typeof engine_forkchoiceUpdatedV3
  'engine_getBlobsV1': typeof engine_getBlobsV1
  'engine_getBlobsV2': typeof engine_getBlobsV2
  'engine_getPayloadBodiesByHashV1': typeof engine_getPayloadBodiesByHashV1
  'engine_getPayloadBodiesByRangeV1': typeof engine_getPayloadBodiesByRangeV1
  'engine_getPayloadV1': typeof engine_getPayloadV1
  'engine_getPayloadV2': typeof engine_getPayloadV2
  'engine_getPayloadV3': typeof engine_getPayloadV3
  'engine_getPayloadV4': typeof engine_getPayloadV4
  'engine_getPayloadV5': typeof engine_getPayloadV5
  'engine_getPayloadV6': typeof engine_getPayloadV6
  'engine_newPayloadV1': typeof engine_newPayloadV1
  'engine_newPayloadV2': typeof engine_newPayloadV2
  'engine_newPayloadV3': typeof engine_newPayloadV3
  'engine_newPayloadV4': typeof engine_newPayloadV4
  'engine_newPayloadV5': typeof engine_newPayloadV5
}

/**
 * Helper type to extract Params type from method name
 */
export type EngineParams<M extends EngineMethod> = EngineMethodMap[M]['Params']

/**
 * Helper type to extract Result type from method name
 */
export type EngineResult<M extends EngineMethod> = EngineMethodMap[M]['Result']

// Re-export individual method modules for direct access (tree-shakable)
export {
  engine_exchangeCapabilities,
  engine_exchangeTransitionConfigurationV1,
  engine_forkchoiceUpdatedV1,
  engine_forkchoiceUpdatedV2,
  engine_forkchoiceUpdatedV3,
  engine_getBlobsV1,
  engine_getBlobsV2,
  engine_getPayloadBodiesByHashV1,
  engine_getPayloadBodiesByRangeV1,
  engine_getPayloadV1,
  engine_getPayloadV2,
  engine_getPayloadV3,
  engine_getPayloadV4,
  engine_getPayloadV5,
  engine_getPayloadV6,
  engine_newPayloadV1,
  engine_newPayloadV2,
  engine_newPayloadV3,
  engine_newPayloadV4,
  engine_newPayloadV5,
}
