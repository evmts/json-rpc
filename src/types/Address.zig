const std = @import("std");

/// Ethereum address (20 bytes, hex-encoded with 0x prefix)
///
/// Compatible with @tevm/primitives Address type.
/// When primitives native dependencies are available, this can be upgraded to use
/// primitives.Address directly for access to additional utilities (checksum, CREATE2, etc.)
pub const Address = @This();

/// Pattern for validating hex-encoded address: ^0x[0-9a-fA-F]{40}$
pub const pattern = "^0x[0-9a-fA-F]{40}$";

/// Raw 20-byte address
bytes: [20]u8,

/// Convert address to 0x-prefixed hex string
pub fn toString(self: Address, allocator: std.mem.Allocator) ![]u8 {
    var result = try allocator.alloc(u8, 42); // "0x" + 40 hex chars
    result[0] = '0';
    result[1] = 'x';

    const hex_chars = "0123456789abcdef";
    for (self.bytes, 0..) |byte, i| {
        result[2 + i * 2] = hex_chars[byte >> 4];
        result[2 + i * 2 + 1] = hex_chars[byte & 0x0F];
    }

    return result;
}

/// Parse address from 0x-prefixed hex string
pub fn fromString(str: []const u8) !Address {
    if (str.len != 42) return error.InvalidAddressLength;
    if (str[0] != '0' or str[1] != 'x') return error.MissingHexPrefix;

    var addr: Address = undefined;
    for (0..20) |i| {
        const hi = try hexCharToNibble(str[2 + i * 2]);
        const lo = try hexCharToNibble(str[2 + i * 2 + 1]);
        addr.bytes[i] = (@as(u8, hi) << 4) | lo;
    }

    return addr;
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
pub fn jsonStringify(self: Address, jws: anytype) !void {
    var buf: [42]u8 = undefined;
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
pub fn jsonParseFromValue(allocator: std.mem.Allocator, source: std.json.Value, options: std.json.ParseOptions) !Address {
    _ = allocator;
    _ = options;
    if (source != .string) return error.UnexpectedToken;
    return try fromString(source.string);
}
