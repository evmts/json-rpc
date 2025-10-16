/**
 * @fileoverview JSON-RPC error codes and error class
 */

/**
 * Standard and non-standard JSON-RPC error codes
 *
 * @typedef {-32700 | -32600 | -32601 | -32602 | -32603 | -32000 | -32001 | -32002 | -32003 | -32004 | -32005 | -32006} JsonRpcErrorCode
 */

/**
 * JSON-RPC error code meanings
 */
export const JsonRpcErrorCode = {
  /** Invalid JSON */
  PARSE_ERROR: -32700,
  /** JSON is not a valid request object */
  INVALID_REQUEST: -32600,
  /** Method does not exist */
  METHOD_NOT_FOUND: -32601,
  /** Invalid method parameters */
  INVALID_PARAMS: -32602,
  /** Internal JSON-RPC error */
  INTERNAL_ERROR: -32603,
  /** Missing or invalid parameters */
  INVALID_INPUT: -32000,
  /** Requested resource not found */
  RESOURCE_NOT_FOUND: -32001,
  /** Requested resource not available */
  RESOURCE_UNAVAILABLE: -32002,
  /** Transaction creation failed */
  TRANSACTION_REJECTED: -32003,
  /** Method is not implemented */
  METHOD_NOT_SUPPORTED: -32004,
  /** Request exceeds defined limit */
  LIMIT_EXCEEDED: -32005,
  /** Version of JSON-RPC protocol is not supported */
  VERSION_NOT_SUPPORTED: -32006,
}

/**
 * Strongly-typed JSON-RPC error
 *
 * @extends Error
 */
export class JsonRpcError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {JsonRpcErrorCode} code - JSON-RPC error code
   */
  constructor(message, code) {
    super(message)
    this.name = 'JsonRpcError'
    /** @type {JsonRpcErrorCode} */
    this.code = code

    // Maintains proper stack trace for where error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, JsonRpcError)
    }
  }
}
