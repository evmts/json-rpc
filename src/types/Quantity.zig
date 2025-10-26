const std = @import("std");

/// Hex-encoded unsigned integer quantity
///
/// Follows @tevm/primitives conventions for Uint types (Uint, Uint64, Uint256).
/// Represents unsigned integers with minimal hex encoding (no leading zeros except "0x0").
pub const Quantity = @This();

/// Pattern for validating hex-encoded quantity: ^0x(0|[1-9a-f][0-9a-f]*)$
pub const pattern = "^0x(0|[1-9a-f][0-9a-f]*)$";

/// Raw u256 value
value: u256,

/// Convert quantity to 0x-prefixed hex string
pub fn toString(self: Quantity, allocator: std.mem.Allocator) ![]u8 {
    if (self.value == 0) {
        return try allocator.dupe(u8, "0x0");
    }

    // Count hex digits needed
    var temp = self.value;
    var digit_count: usize = 0;
    while (temp > 0) : (temp /= 16) {
        digit_count += 1;
    }

    var result = try allocator.alloc(u8, 2 + digit_count);
    result[0] = '0';
    result[1] = 'x';

    const hex_chars = "0123456789abcdef";
    temp = self.value;
    var i = digit_count;
    while (i > 0) : (i -= 1) {
        result[1 + i] = hex_chars[@intCast(temp % 16)];
        temp /= 16;
    }

    return result;
}

/// Parse quantity from 0x-prefixed hex string
pub fn fromString(str: []const u8) !Quantity {
    if (str.len < 3) return error.InvalidQuantityLength;
    if (str[0] != '0' or str[1] != 'x') return error.MissingHexPrefix;

    var value: u256 = 0;
    for (str[2..]) |c| {
        const nibble = try hexCharToNibble(c);
        value = value * 16 + nibble;
    }

    return Quantity{ .value = value };
}

fn hexCharToNibble(c: u8) !u8 {
    return switch (c) {
        '0'...'9' => c - '0',
        'a'...'f' => c - 'a' + 10,
        'A'...'F' => c - 'A' + 10,
        else => error.InvalidHexCharacter,
    };
}

/// Serialize to JSON using Zig 0.15 API
pub fn jsonStringify(self: Quantity, jws: *std.json.Stringify) !void {
    if (self.value == 0) {
        try jws.write("0x0");
        return;
    }

    var temp = self.value;
    var digit_count: usize = 0;
    while (temp > 0) : (temp /= 16) {
        digit_count += 1;
    }

    const hex_chars = "0123456789abcdef";
    var buf: [66]u8 = undefined; // "0x" + max 64 hex digits for u256
    buf[0] = '0';
    buf[1] = 'x';

    temp = self.value;
    var i = digit_count;
    while (i > 0) : (i -= 1) {
        buf[1 + i] = hex_chars[@intCast(temp % 16)];
        temp /= 16;
    }

    try jws.write(buf[0 .. 2 + digit_count]);
}

/// Deserialize from JSON using Zig 0.15 API
pub fn jsonParseFromValue(allocator: std.mem.Allocator, source: std.json.Value, options: std.json.ParseOptions) !Quantity {
    _ = allocator;
    _ = options;
    if (source != .string) return error.UnexpectedToken;
    return try fromString(source.string);
}
