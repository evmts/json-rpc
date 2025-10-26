const std = @import("std");
const Quantity = @import("Quantity.zig");
const Hash = @import("Hash.zig");
const BlockTag = @import("BlockTag.zig").BlockTag;

/// Block specification - can be a block number, tag, or hash
///
/// Follows @tevm/primitives conventions for BlockIdentifier type.
///
/// This union type allows Ethereum JSON-RPC methods to accept flexible block references.
pub const BlockSpec = union(enum) {
    /// Block number (hex-encoded)
    number: Quantity,
    /// Block tag (earliest, finalized, safe, latest, pending)
    tag: BlockTag,
    /// Block hash (32 bytes)
    hash: Hash,

    pub fn toString(self: BlockSpec, allocator: std.mem.Allocator) ![]u8 {
        return switch (self) {
            .number => |qty| try qty.toString(allocator),
            .tag => |t| try allocator.dupe(u8, t.toString()),
            .hash => |h| try h.toString(allocator),
        };
    }

    pub fn fromString(str: []const u8) !BlockSpec {
        // Try block tag first
        if (BlockTag.fromString(str)) |tag| {
            return BlockSpec{ .tag = tag };
        } else |_| {}

        // Check length to determine if hash or number
        if (str.len == 66 and str[0] == '0' and str[1] == 'x') {
            // Likely a hash (0x + 64 hex chars)
            return BlockSpec{ .hash = try Hash.fromString(str) };
        } else if (str.len >= 3 and str[0] == '0' and str[1] == 'x') {
            // Likely a number
            return BlockSpec{ .number = try Quantity.fromString(str) };
        }

        return error.InvalidBlockSpec;
    }

    /// Serialize to JSON using Zig 0.15 API
    pub fn jsonStringify(self: BlockSpec, jws: *std.json.Stringify) !void {
        switch (self) {
            .number => |qty| try qty.jsonStringify(jws),
            .tag => |t| try t.jsonStringify(jws),
            .hash => |h| try h.jsonStringify(jws),
        }
    }

    /// Deserialize from JSON using Zig 0.15 API
    pub fn jsonParseFromValue(allocator: std.mem.Allocator, source: std.json.Value, options: std.json.ParseOptions) !BlockSpec {
        _ = allocator;
        _ = options;
        if (source != .string) return error.UnexpectedToken;
        return try fromString(source.string);
    }
};
