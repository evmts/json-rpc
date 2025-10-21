package types

import (
	"encoding/json"
	"fmt"
)

// BlockTag represents a specific block reference.
//
// - Earliest: The lowest numbered block the client has available
// - Finalized: The most recent crypto-economically secure block
// - Safe: The most recent block that is safe from re-orgs
// - Latest: The most recent block in the canonical chain
// - Pending: A sample next block built on top of latest
type BlockTag string

const (
	// Earliest is the lowest numbered block the client has available
	BlockTagEarliest BlockTag = "earliest"

	// Finalized is the most recent crypto-economically secure block,
	// cannot be re-orged outside of manual intervention
	BlockTagFinalized BlockTag = "finalized"

	// Safe is the most recent block that is safe from re-orgs under
	// honest majority and certain synchronicity assumptions
	BlockTagSafe BlockTag = "safe"

	// Latest is the most recent block in the canonical chain observed
	// by the client, this block may be re-orged
	BlockTagLatest BlockTag = "latest"

	// Pending is a sample next block built by the client on top of
	// latest and containing the set of transactions from local mempool
	BlockTagPending BlockTag = "pending"
)

// IsBlockTag checks if a string is a valid block tag.
func IsBlockTag(s string) bool {
	switch BlockTag(s) {
	case BlockTagEarliest, BlockTagFinalized, BlockTagSafe, BlockTagLatest, BlockTagPending:
		return true
	default:
		return false
	}
}

// NewBlockTag creates a validated BlockTag from a string.
func NewBlockTag(s string) (BlockTag, error) {
	tag := BlockTag(s)
	if !IsBlockTag(s) {
		return "", fmt.Errorf("invalid block tag: expected one of [earliest, finalized, safe, latest, pending], got %q", s)
	}
	return tag, nil
}

// String returns the block tag as a string.
func (b BlockTag) String() string {
	return string(b)
}

// MarshalJSON implements json.Marshaler.
func (b BlockTag) MarshalJSON() ([]byte, error) {
	return json.Marshal(string(b))
}

// UnmarshalJSON implements json.Unmarshaler.
func (b *BlockTag) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}

	tag, err := NewBlockTag(s)
	if err != nil {
		return err
	}

	*b = tag
	return nil
}

// Validate checks if the BlockTag is valid.
func (b BlockTag) Validate() error {
	if !IsBlockTag(string(b)) {
		return fmt.Errorf("invalid block tag: %q", b)
	}
	return nil
}
