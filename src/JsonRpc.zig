const std = @import("std");

/// Generic JSON-RPC 2.0 request/response types
///
/// Usage:
/// ```zig
/// const eth = @import("eth/getBalance/eth_getBalance.zig");
/// const rpc = JsonRpc(eth.method, eth.Params, eth.Result);
/// const request = rpc.Request{ .id = 1, .params = params };
/// ```
pub fn JsonRpc(comptime method_name: []const u8, comptime Params: type, comptime Result: type) type {
    return struct {
        /// JSON-RPC 2.0 Request
        pub const Request = struct {
            /// JSON-RPC version (always "2.0")
            jsonrpc: []const u8 = "2.0",
            /// The method name
            method: []const u8 = method_name,
            /// Request parameters
            params: Params,
            /// Request ID (can be string, number, or null)
            id: RequestId,

            pub const RequestId = union(enum) {
                string: []const u8,
                number: i64,
                null_id: void,

                pub fn jsonStringify(self: RequestId, jws: anytype) !void {
                    switch (self) {
                        .string => |s| try jws.write(s),
                        .number => |n| try jws.write(n),
                        .null_id => try jws.write(null),
                    }
                }

                pub fn jsonParseFromValue(allocator: std.mem.Allocator, source: std.json.Value, options: std.json.ParseOptions) !RequestId {
                    _ = allocator;
                    _ = options;
                    return switch (source) {
                        .string => |s| RequestId{ .string = s },
                        .integer => |i| RequestId{ .number = i },
                        .null => RequestId{ .null_id = {} },
                        else => error.UnexpectedToken,
                    };
                }
            };

            pub fn jsonStringify(self: Request, jws: anytype) !void {
                try jws.beginObject();
                try jws.objectField("jsonrpc");
                try jws.write(self.jsonrpc);
                try jws.objectField("method");
                try jws.write(self.method);
                try jws.objectField("params");
                try jws.write(self.params);
                try jws.objectField("id");
                try jws.write(self.id);
                try jws.endObject();
            }

            pub fn jsonParseFromValue(allocator: std.mem.Allocator, source: std.json.Value, options: std.json.ParseOptions) !Request {
                if (source != .object) return error.UnexpectedToken;

                const params_value = source.object.get("params") orelse return error.MissingField;
                const id_value = source.object.get("id") orelse return error.MissingField;

                return Request{
                    .params = try std.json.innerParseFromValue(Params, allocator, params_value, options),
                    .id = try std.json.innerParseFromValue(RequestId, allocator, id_value, options),
                };
            }
        };

        /// JSON-RPC 2.0 Success Response
        pub const Response = struct {
            /// JSON-RPC version (always "2.0")
            jsonrpc: []const u8 = "2.0",
            /// Result value
            result: Result,
            /// Request ID (matches the request)
            id: Request.RequestId,

            pub fn jsonStringify(self: Response, jws: anytype) !void {
                try jws.beginObject();
                try jws.objectField("jsonrpc");
                try jws.write(self.jsonrpc);
                try jws.objectField("result");
                try jws.write(self.result);
                try jws.objectField("id");
                try jws.write(self.id);
                try jws.endObject();
            }

            pub fn jsonParseFromValue(allocator: std.mem.Allocator, source: std.json.Value, options: std.json.ParseOptions) !Response {
                if (source != .object) return error.UnexpectedToken;

                const result_value = source.object.get("result") orelse return error.MissingField;
                const id_value = source.object.get("id") orelse return error.MissingField;

                return Response{
                    .result = try std.json.innerParseFromValue(Result, allocator, result_value, options),
                    .id = try std.json.innerParseFromValue(Request.RequestId, allocator, id_value, options),
                };
            }
        };

        /// JSON-RPC 2.0 Error Response
        pub const ErrorResponse = struct {
            /// JSON-RPC version (always "2.0")
            jsonrpc: []const u8 = "2.0",
            /// Error object
            @"error": ErrorObject,
            /// Request ID (matches the request, or null if request was invalid)
            id: Request.RequestId,

            pub const ErrorObject = struct {
                /// Error code
                code: i32,
                /// Error message
                message: []const u8,
                /// Additional error data (optional)
                data: ?std.json.Value = null,

                pub fn jsonStringify(self: ErrorObject, jws: anytype) !void {
                    try jws.beginObject();
                    try jws.objectField("code");
                    try jws.write(self.code);
                    try jws.objectField("message");
                    try jws.write(self.message);
                    if (self.data) |data| {
                        try jws.objectField("data");
                        try jws.write(data);
                    }
                    try jws.endObject();
                }

                pub fn jsonParseFromValue(allocator: std.mem.Allocator, source: std.json.Value, options: std.json.ParseOptions) !ErrorObject {
                    _ = allocator;
                    _ = options;
                    if (source != .object) return error.UnexpectedToken;

                    const code_value = source.object.get("code") orelse return error.MissingField;
                    const message_value = source.object.get("message") orelse return error.MissingField;
                    const data_value = source.object.get("data");

                    return ErrorObject{
                        .code = @intCast(code_value.integer),
                        .message = message_value.string,
                        .data = data_value,
                    };
                }
            };

            pub fn jsonStringify(self: ErrorResponse, jws: anytype) !void {
                try jws.beginObject();
                try jws.objectField("jsonrpc");
                try jws.write(self.jsonrpc);
                try jws.objectField("error");
                try jws.write(self.@"error");
                try jws.objectField("id");
                try jws.write(self.id);
                try jws.endObject();
            }

            pub fn jsonParseFromValue(allocator: std.mem.Allocator, source: std.json.Value, options: std.json.ParseOptions) !ErrorResponse {
                if (source != .object) return error.UnexpectedToken;

                const error_value = source.object.get("error") orelse return error.MissingField;
                const id_value = source.object.get("id") orelse return error.MissingField;

                return ErrorResponse{
                    .@"error" = try std.json.innerParseFromValue(ErrorObject, allocator, error_value, options),
                    .id = try std.json.innerParseFromValue(Request.RequestId, allocator, id_value, options),
                };
            }
        };
    };
}
