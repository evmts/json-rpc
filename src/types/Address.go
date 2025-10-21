package types

import (
	"encoding/json"
	"errors"
	"fmt"
	"regexp"
)

// Address represents a 20-byte Ethereum address.
// Pattern: ^0x[0-9a-fA-F]{40}$
type Address string

var addressPattern = regexp.MustCompile(`^0x[0-9a-fA-F]{40}$`)

// NewAddress creates a validated Address from a hex string.
// Returns an error if the input is not a valid 20-byte hex-encoded address.
func NewAddress(s string) (Address, error) {
	if !addressPattern.MatchString(s) {
		return "", fmt.Errorf("invalid Ethereum address: expected 20-byte hex string (0x followed by 40 hex characters), got %q", s)
	}
	return Address(s), nil
}

// IsAddress checks if a string is a valid Ethereum address.
func IsAddress(s string) bool {
	return addressPattern.MatchString(s)
}

// String returns the address as a hex string.
func (a Address) String() string {
	return string(a)
}

// MarshalJSON implements json.Marshaler.
func (a Address) MarshalJSON() ([]byte, error) {
	return json.Marshal(string(a))
}

// UnmarshalJSON implements json.Unmarshaler.
func (a *Address) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}

	if !addressPattern.MatchString(s) {
		return fmt.Errorf("invalid Ethereum address: expected 20-byte hex string (0x followed by 40 hex characters), got %q", s)
	}

	*a = Address(s)
	return nil
}

// Validate checks if the Address is valid.
func (a Address) Validate() error {
	if !addressPattern.MatchString(string(a)) {
		return errors.New("invalid Ethereum address format")
	}
	return nil
}
