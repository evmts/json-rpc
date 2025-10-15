/**
 * Generic JSON-RPC 2.0 request/response types
 *
 * @example
 * ```ts
 * import { method, type Params, type Result } from './eth/getBalance/eth_getBalance.js'
 * import { JsonRpc } from './JsonRpc.js'
 *
 * type GetBalanceRpc = JsonRpc<typeof method, Params, Result>
 * const request: GetBalanceRpc['Request'] = {
 *   jsonrpc: '2.0',
 *   method: 'eth_getBalance',
 *   params: { address: Address('0x...'), block: 'latest' },
 *   id: 1
 * }
 * ```
 */
export interface JsonRpc<
  Method extends string,
  Params,
  Result
> {
  /**
   * JSON-RPC 2.0 Request
   */
  Request: {
    /** JSON-RPC version (always "2.0") */
    jsonrpc: '2.0'
    /** The method name */
    method: Method
    /** Request parameters */
    params: Params
    /** Request ID (can be string, number, or null) */
    id: string | number | null
  }

  /**
   * JSON-RPC 2.0 Success Response
   */
  Response: {
    /** JSON-RPC version (always "2.0") */
    jsonrpc: '2.0'
    /** Result value */
    result: Result
    /** Request ID (matches the request) */
    id: string | number | null
  }

  /**
   * JSON-RPC 2.0 Error Response
   */
  ErrorResponse: {
    /** JSON-RPC version (always "2.0") */
    jsonrpc: '2.0'
    /** Error object */
    error: {
      /** Error code */
      code: number
      /** Error message */
      message: string
      /** Additional error data (optional) */
      data?: unknown
    }
    /** Request ID (matches the request, or null if request was invalid) */
    id: string | number | null
  }
}

/**
 * Helper type to extract Request type from a JsonRpc interface
 */
export type JsonRpcRequest<T extends JsonRpc<string, any, any>> = T['Request']

/**
 * Helper type to extract Response type from a JsonRpc interface
 */
export type JsonRpcResponse<T extends JsonRpc<string, any, any>> = T['Response']

/**
 * Helper type to extract ErrorResponse type from a JsonRpc interface
 */
export type JsonRpcErrorResponse<T extends JsonRpc<string, any, any>> = T['ErrorResponse']
