const std = @import("std");

/// 32-byte hash (hex-encoded with 0x prefix)
pub const Hash = @This();

/// Pattern for validating hex-encoded hash: ^0x[0-9a-f]{64}$
pub const pattern = "^0x[0-9a-f]{64}$";

/// Raw 32-byte hash
bytes: [32]u8,

/// Convert hash to 0x-prefixed hex string
pub fn toString(self: Hash, allocator: std.mem.Allocator) ![]u8 {
    var result = try allocator.alloc(u8, 66); // "0x" + 64 hex chars
    result[0] = '0';
    result[1] = 'x';

    const hex_chars = "0123456789abcdef";
    for (self.bytes, 0..) |byte, i| {
        result[2 + i * 2] = hex_chars[byte >> 4];
        result[2 + i * 2 + 1] = hex_chars[byte & 0x0F];
    }

    return result;
}

/// Parse hash from 0x-prefixed hex string
pub fn fromString(str: []const u8) !Hash {
    if (str.len != 66) return error.InvalidHashLength;
    if (str[0] != '0' or str[1] != 'x') return error.MissingHexPrefix;

    var hash: Hash = undefined;
    for (0..32) |i| {
        const hi = try hexCharToNibble(str[2 + i * 2]);
        const lo = try hexCharToNibble(str[2 + i * 2 + 1]);
        hash.bytes[i] = (@as(u8, hi) << 4) | lo;
    }

    return hash;
}

fn hexCharToNibble(c: u8) !u4 {
    return switch (c) {
        '0'...'9' => @intCast(c - '0'),
        'a'...'f' => @intCast(c - 'a' + 10),
        'A'...'F' => @intCast(c - 'A' + 10),
        else => error.InvalidHexCharacter,
    };
}

/// Serialize to JSON using Zig 0.15 API
pub fn jsonStringify(self: Hash, jws: anytype) !void {
    var buf: [66]u8 = undefined;
    buf[0] = '0';
    buf[1] = 'x';

    const hex_chars = "0123456789abcdef";
    for (self.bytes, 0..) |byte, i| {
        buf[2 + i * 2] = hex_chars[byte >> 4];
        buf[2 + i * 2 + 1] = hex_chars[byte & 0x0F];
    }

    try jws.write(&buf);
}

/// Deserialize from JSON using Zig 0.15 API
pub fn jsonParseFromValue(allocator: std.mem.Allocator, source: std.json.Value, options: std.json.ParseOptions) !Hash {
    _ = allocator;
    _ = options;
    if (source != .string) return error.UnexpectedToken;
    return try fromString(source.string);
}
