// Ethereum JSON-RPC types and methods

pub const types = @import("types.zig");

// Example methods
pub const eth = struct {
    pub const GetBalance = @import("eth/getBalance/eth_getBalance.zig");
    pub const BlockNumber = @import("eth/blockNumber/eth_blockNumber.zig");
    pub const ChainId = @import("eth/chainId/eth_chainId.zig");
};

test "basic types" {
    const std = @import("std");
    const testing = std.testing;

    // Test Address
    const addr = try types.Address.fromString("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0");
    const addr_str = try addr.toString(testing.allocator);
    defer testing.allocator.free(addr_str);
    try testing.expectEqualStrings("0x742d35cc6634c0532925a3b844bc9e7595f0beb0", addr_str);

    // Test Quantity
    const qty = try types.Quantity.fromString("0x1a");
    try testing.expectEqual(@as(u256, 26), qty.value);
    const qty_str = try qty.toString(testing.allocator);
    defer testing.allocator.free(qty_str);
    try testing.expectEqualStrings("0x1a", qty_str);

    // Test BlockTag
    const tag = try types.BlockTag.fromString("latest");
    try testing.expectEqual(types.BlockTag.latest, tag);
}
