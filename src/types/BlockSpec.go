package types

import (
	"encoding/json"
	"fmt"
)

// BlockSpec represents a block identifier that can be either:
// - A block number (Quantity)
// - A block tag (BlockTag)
// - A block hash (Hash)
type BlockSpec interface {
	isBlockSpec()
	MarshalJSON() ([]byte, error)
}

// BlockSpecNumber represents a block specification by number.
type BlockSpecNumber struct {
	Number Quantity
}

func (BlockSpecNumber) isBlockSpec() {}

func (b BlockSpecNumber) MarshalJSON() ([]byte, error) {
	return b.Number.MarshalJSON()
}

// BlockSpecTag represents a block specification by tag.
type BlockSpecTag struct {
	Tag BlockTag
}

func (BlockSpecTag) isBlockSpec() {}

func (b BlockSpecTag) MarshalJSON() ([]byte, error) {
	return b.Tag.MarshalJSON()
}

// BlockSpecHash represents a block specification by hash.
type BlockSpecHash struct {
	Hash Hash
}

func (BlockSpecHash) isBlockSpec() {}

func (b BlockSpecHash) MarshalJSON() ([]byte, error) {
	return b.Hash.MarshalJSON()
}

// NewBlockSpec creates a BlockSpec from a string by attempting to parse it
// as a block tag first, then as a hash or quantity based on length.
func NewBlockSpec(s string) (BlockSpec, error) {
	// Try block tag first
	if IsBlockTag(s) {
		tag, err := NewBlockTag(s)
		if err != nil {
			return nil, err
		}
		return BlockSpecTag{Tag: tag}, nil
	}

	// Try hash (66 characters: "0x" + 64 hex chars)
	if len(s) == 66 && s[0] == '0' && s[1] == 'x' {
		hash, err := NewHash(s)
		if err != nil {
			return nil, err
		}
		return BlockSpecHash{Hash: hash}, nil
	}

	// Try quantity (variable length hex)
	if len(s) >= 3 {
		qty, err := NewQuantity(s)
		if err != nil {
			return nil, err
		}
		return BlockSpecNumber{Number: qty}, nil
	}

	return nil, fmt.Errorf("invalid block spec: %q", s)
}

// UnmarshalBlockSpec unmarshals a JSON value into a BlockSpec.
func UnmarshalBlockSpec(data []byte) (BlockSpec, error) {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return nil, err
	}

	return NewBlockSpec(s)
}

// MarshalBlockSpec marshals a BlockSpec to JSON.
func MarshalBlockSpec(spec BlockSpec) ([]byte, error) {
	if spec == nil {
		return nil, fmt.Errorf("cannot marshal nil BlockSpec")
	}
	return spec.MarshalJSON()
}
