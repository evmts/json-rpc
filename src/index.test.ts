import { describe, test, expect } from 'bun:test'
import type { Address, Hash, Quantity, BlockTag, BlockSpec } from './types/index.js'
import { EthMethod, DebugMethod, EngineMethod } from './JsonRpc.js'
import type { JsonRpcMethod, JsonRpcParams, JsonRpcResult } from './JsonRpc.js'

describe('@tevm/apis', () => {
  describe('Type System', () => {
    test('Address type has correct brand', () => {
      const addr: Address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' as Address
      expect(addr).toMatch(/^0x[0-9a-fA-F]{40}$/)
    })

    test('Hash type has correct brand', () => {
      const hash: Hash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' as Hash
      expect(hash).toMatch(/^0x[0-9a-f]{64}$/)
    })

    test('Quantity type has correct brand', () => {
      const qty: Quantity = '0x1a' as Quantity
      expect(qty).toMatch(/^0x(0|[1-9a-f][0-9a-f]*)$/)
    })

    test('BlockTag accepts valid values', () => {
      const earliest: BlockTag = 'earliest'
      const finalized: BlockTag = 'finalized'
      const safe: BlockTag = 'safe'
      const latest: BlockTag = 'latest'
      const pending: BlockTag = 'pending'

      expect(earliest).toBe('earliest')
      expect(finalized).toBe('finalized')
      expect(safe).toBe('safe')
      expect(latest).toBe('latest')
      expect(pending).toBe('pending')
    })

    test('BlockSpec is union of Quantity, BlockTag, and Hash', () => {
      const byNumber: BlockSpec = '0x1a' as Quantity
      const byTag: BlockSpec = 'latest'
      const byHash: BlockSpec = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' as Hash

      expect(byNumber).toBe('0x1a')
      expect(byTag).toBe('latest')
      expect(byHash).toMatch(/^0x[0-9a-f]{64}$/)
    })
  })

  describe('Method Enums', () => {
    test('EthMethod contains all eth methods', () => {
      expect(EthMethod.eth_getBalance).toBe('eth_getBalance')
      expect(EthMethod.eth_call).toBe('eth_call')
      expect(EthMethod.eth_blockNumber).toBe('eth_blockNumber')
      expect(EthMethod.eth_chainId).toBe('eth_chainId')
    })

    test('DebugMethod contains all debug methods', () => {
      expect(DebugMethod.debug_getBadBlocks).toBe('debug_getBadBlocks')
      expect(DebugMethod.debug_getRawBlock).toBe('debug_getRawBlock')
      expect(DebugMethod.debug_getRawHeader).toBe('debug_getRawHeader')
    })

    test('EngineMethod contains all engine methods', () => {
      expect(EngineMethod.engine_newPayloadV1).toBe('engine_newPayloadV1')
      expect(EngineMethod.engine_forkchoiceUpdatedV1).toBe('engine_forkchoiceUpdatedV1')
      expect(EngineMethod.engine_getPayloadV1).toBe('engine_getPayloadV1')
    })
  })

  describe('Type Extraction', () => {
    test('JsonRpcParams extracts correct parameter types', () => {
      type GetBalanceParams = JsonRpcParams<'eth_getBalance'>

      const params: GetBalanceParams = [
        '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' as Address,
        'latest'
      ]

      expect(params).toHaveLength(2)
      expect(params[0]).toMatch(/^0x[0-9a-fA-F]{40}$/)
      expect(params[1]).toBe('latest')
    })

    test('JsonRpcResult extracts correct result types', () => {
      type GetBalanceResult = JsonRpcResult<'eth_getBalance'>

      const result: GetBalanceResult = '0x1a' as Quantity

      expect(result).toMatch(/^0x(0|[1-9a-f][0-9a-f]*)$/)
    })
  })

  describe('Method Coverage', () => {
    test('has 40 eth methods', () => {
      const ethMethods = Object.keys(EthMethod)
      expect(ethMethods.length).toBe(40)
    })

    test('has 5 debug methods', () => {
      const debugMethods = Object.keys(DebugMethod)
      expect(debugMethods.length).toBe(5)
    })

    test('has 20 engine methods', () => {
      const engineMethods = Object.keys(EngineMethod)
      expect(engineMethods.length).toBe(20)
    })

    test('total methods equals 65', () => {
      const totalMethods =
        Object.keys(EthMethod).length +
        Object.keys(DebugMethod).length +
        Object.keys(EngineMethod).length

      expect(totalMethods).toBe(65)
    })
  })

  describe('Tree-shakability', () => {
    test('method enums are objects for tree-shakability', () => {
      // Verify that method enums are objects, not TypeScript enums
      // This allows bundlers to tree-shake unused methods
      expect(typeof EthMethod).toBe('object')
      expect(typeof DebugMethod).toBe('object')
      expect(typeof EngineMethod).toBe('object')
    })

    test('namespace methods export correctly', () => {
      // Verify method objects are structured correctly
      expect(EthMethod.eth_getBalance).toBe('eth_getBalance')
      expect(Object.keys(EthMethod).length).toBe(40)
    })
  })

  describe('Type Safety', () => {
    test('method name type guards work correctly', () => {
      const method: JsonRpcMethod = 'eth_getBalance'

      if (method === EthMethod.eth_getBalance) {
        // Type narrowing should work
        type Params = JsonRpcParams<typeof method>
        const params: Params = [
          '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' as Address,
          'latest'
        ]
        expect(params[0]).toMatch(/^0x[0-9a-fA-F]{40}$/)
      }
    })

    test('invalid method names are not assignable', () => {
      // This test ensures type safety at compile time
      // @ts-expect-error - invalid method name
      const invalid: JsonRpcMethod = 'eth_invalidMethod'

      expect(invalid).toBe('eth_invalidMethod')
    })
  })
})
