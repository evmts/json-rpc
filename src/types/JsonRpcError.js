/**
 * @fileoverview JSON-RPC error codes and strongly-typed error class
 */

/**
 * Standard and non-standard JSON-RPC error codes
 *
 * @typedef {-32700 | -32600 | -32601 | -32602 | -32603 | -32000 | -32001 | -32002 | -32003 | -32004 | -32005 | -32006} JsonRpcErrorCode
 */

/**
 * JSON-RPC error code constants
 */
export const JsonRpcErrorCode = {
  /** Invalid JSON */
  PARSE_ERROR: /** @type {-32700} */ (-32700),
  /** JSON is not a valid request object */
  INVALID_REQUEST: /** @type {-32600} */ (-32600),
  /** Method does not exist */
  METHOD_NOT_FOUND: /** @type {-32601} */ (-32601),
  /** Invalid method parameters */
  INVALID_PARAMS: /** @type {-32602} */ (-32602),
  /** Internal JSON-RPC error */
  INTERNAL_ERROR: /** @type {-32603} */ (-32603),
  /** Missing or invalid parameters */
  INVALID_INPUT: /** @type {-32000} */ (-32000),
  /** Requested resource not found */
  RESOURCE_NOT_FOUND: /** @type {-32001} */ (-32001),
  /** Requested resource not available */
  RESOURCE_UNAVAILABLE: /** @type {-32002} */ (-32002),
  /** Transaction creation failed */
  TRANSACTION_REJECTED: /** @type {-32003} */ (-32003),
  /** Method is not implemented */
  METHOD_NOT_SUPPORTED: /** @type {-32004} */ (-32004),
  /** Request exceeds defined limit */
  LIMIT_EXCEEDED: /** @type {-32005} */ (-32005),
  /** Version of JSON-RPC protocol is not supported */
  VERSION_NOT_SUPPORTED: /** @type {-32006} */ (-32006),
}

/**
 * Strongly-typed JSON-RPC error with generic error name and code
 *
 * @template {string} TName - Error name type
 * @template {JsonRpcErrorCode} TCode - Error code type
 * @extends Error
 */
export class JsonRpcError extends Error {
  /**
   * @param {TName} name - Strongly-typed error name
   * @param {string} message - Human-readable error message
   * @param {TCode} code - Strongly-typed JSON-RPC error code
   */
  constructor(name, message, code) {
    super(message)
    /** @type {TName} */
    this.name = name
    /** @type {TCode} */
    this.code = code

    // Maintains proper stack trace for where error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, JsonRpcError)
    }
  }
}

/**
 * Parse error - Invalid JSON
 * @typedef {JsonRpcError<'ParseError', -32700>} ParseError
 */

/**
 * Invalid request - JSON is not a valid request object
 * @typedef {JsonRpcError<'InvalidRequestError', -32600>} InvalidRequestError
 */

/**
 * Method not found - Method does not exist
 * @typedef {JsonRpcError<'MethodNotFoundError', -32601>} MethodNotFoundError
 */

/**
 * Invalid params - Invalid method parameters
 * @typedef {JsonRpcError<'InvalidParamsError', -32602>} InvalidParamsError
 */

/**
 * Internal error - Internal JSON-RPC error
 * @typedef {JsonRpcError<'InternalError', -32603>} InternalError
 */

/**
 * Invalid input - Missing or invalid parameters
 * @typedef {JsonRpcError<'InvalidInputError', -32000>} InvalidInputError
 */

/**
 * Resource not found - Requested resource not found
 * @typedef {JsonRpcError<'ResourceNotFoundError', -32001>} ResourceNotFoundError
 */

/**
 * Resource unavailable - Requested resource not available
 * @typedef {JsonRpcError<'ResourceUnavailableError', -32002>} ResourceUnavailableError
 */

/**
 * Transaction rejected - Transaction creation failed
 * @typedef {JsonRpcError<'TransactionRejectedError', -32003>} TransactionRejectedError
 */

/**
 * Method not supported - Method is not implemented
 * @typedef {JsonRpcError<'MethodNotSupportedError', -32004>} MethodNotSupportedError
 */

/**
 * Limit exceeded - Request exceeds defined limit
 * @typedef {JsonRpcError<'LimitExceededError', -32005>} LimitExceededError
 */

/**
 * Version not supported - Version of JSON-RPC protocol is not supported
 * @typedef {JsonRpcError<'VersionNotSupportedError', -32006>} VersionNotSupportedError
 */

/**
 * Helper functions to create strongly-typed errors
 */

/**
 * @param {string} message
 * @returns {ParseError}
 */
export const ParseError = (message) =>
  new JsonRpcError('ParseError', message, JsonRpcErrorCode.PARSE_ERROR)

/**
 * @param {string} message
 * @returns {InvalidRequestError}
 */
export const InvalidRequestError = (message) =>
  new JsonRpcError('InvalidRequestError', message, JsonRpcErrorCode.INVALID_REQUEST)

/**
 * @param {string} message
 * @returns {MethodNotFoundError}
 */
export const MethodNotFoundError = (message) =>
  new JsonRpcError('MethodNotFoundError', message, JsonRpcErrorCode.METHOD_NOT_FOUND)

/**
 * @param {string} message
 * @returns {InvalidParamsError}
 */
export const InvalidParamsError = (message) =>
  new JsonRpcError('InvalidParamsError', message, JsonRpcErrorCode.INVALID_PARAMS)

/**
 * @param {string} message
 * @returns {InternalError}
 */
export const InternalError = (message) =>
  new JsonRpcError('InternalError', message, JsonRpcErrorCode.INTERNAL_ERROR)

/**
 * @param {string} message
 * @returns {InvalidInputError}
 */
export const InvalidInputError = (message) =>
  new JsonRpcError('InvalidInputError', message, JsonRpcErrorCode.INVALID_INPUT)

/**
 * @param {string} message
 * @returns {ResourceNotFoundError}
 */
export const ResourceNotFoundError = (message) =>
  new JsonRpcError('ResourceNotFoundError', message, JsonRpcErrorCode.RESOURCE_NOT_FOUND)

/**
 * @param {string} message
 * @returns {ResourceUnavailableError}
 */
export const ResourceUnavailableError = (message) =>
  new JsonRpcError('ResourceUnavailableError', message, JsonRpcErrorCode.RESOURCE_UNAVAILABLE)

/**
 * @param {string} message
 * @returns {TransactionRejectedError}
 */
export const TransactionRejectedError = (message) =>
  new JsonRpcError('TransactionRejectedError', message, JsonRpcErrorCode.TRANSACTION_REJECTED)

/**
 * @param {string} message
 * @returns {MethodNotSupportedError}
 */
export const MethodNotSupportedError = (message) =>
  new JsonRpcError('MethodNotSupportedError', message, JsonRpcErrorCode.METHOD_NOT_SUPPORTED)

/**
 * @param {string} message
 * @returns {LimitExceededError}
 */
export const LimitExceededError = (message) =>
  new JsonRpcError('LimitExceededError', message, JsonRpcErrorCode.LIMIT_EXCEEDED)

/**
 * @param {string} message
 * @returns {VersionNotSupportedError}
 */
export const VersionNotSupportedError = (message) =>
  new JsonRpcError('VersionNotSupportedError', message, JsonRpcErrorCode.VERSION_NOT_SUPPORTED)
