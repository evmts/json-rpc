// Ethereum JSON-RPC types and methods

pub const types = @import("types.zig");

// Example methods
pub const eth = struct {
    pub const GetBalance = @import("eth/getBalance/eth_getBalance.zig");
    pub const BlockNumber = @import("eth/blockNumber/eth_blockNumber.zig");
    pub const ChainId = @import("eth/chainId/eth_chainId.zig");
};

const std = @import("std");
const testing = std.testing;

test "Address - fromString and toString" {
    const addr = try types.Address.fromString("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0");
    const addr_str = try addr.toString(testing.allocator);
    defer testing.allocator.free(addr_str);
    try testing.expectEqualStrings("0x742d35cc6634c0532925a3b844bc9e7595f0beb0", addr_str);
}

test "Address - invalid length" {
    const result = types.Address.fromString("0x742d35Cc");
    try testing.expectError(error.InvalidAddressLength, result);
}

test "Address - invalid hex" {
    const result = types.Address.fromString("0xZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ");
    try testing.expectError(error.InvalidHexCharacter, result);
}

test "Address - JSON serialization" {
    var out: std.io.Writer.Allocating = .init(testing.allocator);
    defer out.deinit();
    const writer = &out.writer;

    const addr = try types.Address.fromString("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0");
    var stringify: std.json.Stringify = .{ .writer = writer };
    try addr.jsonStringify(&stringify);

    try testing.expectEqualStrings("\"0x742d35cc6634c0532925a3b844bc9e7595f0beb0\"", out.written());
}

test "Hash - fromString and toString" {
    const hash = try types.Hash.fromString("0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef");
    const hash_str = try hash.toString(testing.allocator);
    defer testing.allocator.free(hash_str);
    try testing.expectEqualStrings("0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", hash_str);
}

test "Hash - invalid length" {
    const result = types.Hash.fromString("0x1234");
    try testing.expectError(error.InvalidHashLength, result);
}

test "Hash - JSON serialization" {
    var out: std.io.Writer.Allocating = .init(testing.allocator);
    defer out.deinit();
    const writer = &out.writer;

    const hash = try types.Hash.fromString("0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef");
    var stringify: std.json.Stringify = .{ .writer = writer };
    try hash.jsonStringify(&stringify);

    try testing.expectEqualStrings("\"0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef\"", out.written());
}

test "Quantity - fromString and toString" {
    const qty = try types.Quantity.fromString("0x1a");
    try testing.expectEqual(@as(u256, 26), qty.value);
    const qty_str = try qty.toString(testing.allocator);
    defer testing.allocator.free(qty_str);
    try testing.expectEqualStrings("0x1a", qty_str);
}

test "Quantity - zero value" {
    const qty = try types.Quantity.fromString("0x0");
    try testing.expectEqual(@as(u256, 0), qty.value);
    const qty_str = try qty.toString(testing.allocator);
    defer testing.allocator.free(qty_str);
    try testing.expectEqualStrings("0x0", qty_str);
}

test "Quantity - large value" {
    const qty = try types.Quantity.fromString("0xfffffffffffffff");
    try testing.expectEqual(@as(u256, 0xfffffffffffffff), qty.value);
}

test "Quantity - no leading zeros" {
    const qty = types.Quantity{ .value = 26 };
    const qty_str = try qty.toString(testing.allocator);
    defer testing.allocator.free(qty_str);
    try testing.expectEqualStrings("0x1a", qty_str);
}

test "Quantity - JSON serialization" {
    var out: std.io.Writer.Allocating = .init(testing.allocator);
    defer out.deinit();
    const writer = &out.writer;

    const qty = try types.Quantity.fromString("0x1a");
    var stringify: std.json.Stringify = .{ .writer = writer };
    try qty.jsonStringify(&stringify);

    try testing.expectEqualStrings("\"0x1a\"", out.written());
}

test "BlockTag - all variants" {
    try testing.expectEqual(types.BlockTag.earliest, try types.BlockTag.fromString("earliest"));
    try testing.expectEqual(types.BlockTag.finalized, try types.BlockTag.fromString("finalized"));
    try testing.expectEqual(types.BlockTag.safe, try types.BlockTag.fromString("safe"));
    try testing.expectEqual(types.BlockTag.latest, try types.BlockTag.fromString("latest"));
    try testing.expectEqual(types.BlockTag.pending, try types.BlockTag.fromString("pending"));
}

test "BlockTag - invalid tag" {
    const result = types.BlockTag.fromString("invalid");
    try testing.expectError(error.InvalidBlockTag, result);
}

test "BlockTag - JSON serialization" {
    var out: std.io.Writer.Allocating = .init(testing.allocator);
    defer out.deinit();
    const writer = &out.writer;

    const tag = types.BlockTag.latest;
    var stringify: std.json.Stringify = .{ .writer = writer };
    try tag.jsonStringify(&stringify);

    try testing.expectEqualStrings("\"latest\"", out.written());
}

test "BlockSpec - number variant" {
    const spec = types.BlockSpec{ .number = .{ .value = 42 } };
    var out: std.io.Writer.Allocating = .init(testing.allocator);
    defer out.deinit();
    const writer = &out.writer;

    var stringify: std.json.Stringify = .{ .writer = writer };
    try spec.jsonStringify(&stringify);

    try testing.expectEqualStrings("\"0x2a\"", out.written());
}

test "BlockSpec - tag variant" {
    const spec = types.BlockSpec{ .tag = .latest };
    var out: std.io.Writer.Allocating = .init(testing.allocator);
    defer out.deinit();
    const writer = &out.writer;

    var stringify: std.json.Stringify = .{ .writer = writer };
    try spec.jsonStringify(&stringify);

    try testing.expectEqualStrings("\"latest\"", out.written());
}

test "BlockSpec - hash variant" {
    const hash = try types.Hash.fromString("0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef");
    const spec = types.BlockSpec{ .hash = hash };
    var out: std.io.Writer.Allocating = .init(testing.allocator);
    defer out.deinit();
    const writer = &out.writer;

    var stringify: std.json.Stringify = .{ .writer = writer };
    try spec.jsonStringify(&stringify);

    try testing.expectEqualStrings("\"0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef\"", out.written());
}

test "eth_getBalance - Params JSON serialization" {
    const addr = try types.Address.fromString("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0");
    const params = eth.GetBalance.Params{
        .address = addr,
        .block = .{ .tag = .latest },
    };

    var out: std.io.Writer.Allocating = .init(testing.allocator);
    defer out.deinit();
    const writer = &out.writer;

    var stringify: std.json.Stringify = .{ .writer = writer };
    try params.jsonStringify(&stringify);

    try testing.expectEqualStrings("[\"0x742d35cc6634c0532925a3b844bc9e7595f0beb0\",\"latest\"]", out.written());
}

test "eth_getBalance - Result JSON serialization" {
    const result = eth.GetBalance.Result{ .value = .{ .value = 1000000000000000000 } };

    var out: std.io.Writer.Allocating = .init(testing.allocator);
    defer out.deinit();
    const writer = &out.writer;

    var stringify: std.json.Stringify = .{ .writer = writer };
    try result.jsonStringify(&stringify);

    try testing.expectEqualStrings("\"0xde0b6b3a7640000\"", out.written());
}

test "eth_blockNumber - empty Params JSON serialization" {
    const params = eth.BlockNumber.Params{};

    var out: std.io.Writer.Allocating = .init(testing.allocator);
    defer out.deinit();
    const writer = &out.writer;

    var stringify: std.json.Stringify = .{ .writer = writer };
    try params.jsonStringify(&stringify);

    // Empty params serialize as empty object (JSON-RPC 2.0 standard)
    try testing.expectEqualStrings("[]", out.written());
}

test "JSON roundtrip - Address" {
    const original = try types.Address.fromString("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0");

    // Serialize
    const json_str = try std.json.Stringify.valueAlloc(testing.allocator, original, .{});
    defer testing.allocator.free(json_str);

    try testing.expectEqualStrings("\"0x742d35cc6634c0532925a3b844bc9e7595f0beb0\"", json_str);

    // Manual deserialization (custom types don't work with parseFromSlice)
    const addr = try types.Address.fromString(json_str[1 .. json_str.len - 1]); // Remove quotes
    const addr_str = try addr.toString(testing.allocator);
    defer testing.allocator.free(addr_str);
    try testing.expectEqualStrings("0x742d35cc6634c0532925a3b844bc9e7595f0beb0", addr_str);
}

test "JSON roundtrip - Quantity" {
    const original = types.Quantity{ .value = 42 };

    // Serialize
    const json_str = try std.json.Stringify.valueAlloc(testing.allocator, original, .{});
    defer testing.allocator.free(json_str);

    try testing.expectEqualStrings("\"0x2a\"", json_str);

    // Manual deserialization (Zig's JSON parser has issues with u256)
    const value = try types.Quantity.fromString(json_str[1 .. json_str.len - 1]); // Remove quotes
    try testing.expectEqual(@as(u256, 42), value.value);
}
