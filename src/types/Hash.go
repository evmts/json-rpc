package types

import (
	"encoding/json"
	"errors"
	"fmt"
	"regexp"
)

// Hash represents a 32-byte hash.
// Pattern: ^0x[0-9a-f]{64}$
type Hash string

var hashPattern = regexp.MustCompile(`^0x[0-9a-f]{64}$`)

// NewHash creates a validated Hash from a hex string.
// Returns an error if the input is not a valid 32-byte hex-encoded hash.
func NewHash(s string) (Hash, error) {
	if !hashPattern.MatchString(s) {
		return "", fmt.Errorf("invalid 32-byte hash: expected lowercase hex string (0x followed by 64 hex characters), got %q", s)
	}
	return Hash(s), nil
}

// IsHash checks if a string is a valid 32-byte hash.
func IsHash(s string) bool {
	return hashPattern.MatchString(s)
}

// String returns the hash as a hex string.
func (h Hash) String() string {
	return string(h)
}

// MarshalJSON implements json.Marshaler.
func (h Hash) MarshalJSON() ([]byte, error) {
	return json.Marshal(string(h))
}

// UnmarshalJSON implements json.Unmarshaler.
func (h *Hash) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}

	if !hashPattern.MatchString(s) {
		return fmt.Errorf("invalid 32-byte hash: expected lowercase hex string (0x followed by 64 hex characters), got %q", s)
	}

	*h = Hash(s)
	return nil
}

// Validate checks if the Hash is valid.
func (h Hash) Validate() error {
	if !hashPattern.MatchString(string(h)) {
		return errors.New("invalid hash format")
	}
	return nil
}
