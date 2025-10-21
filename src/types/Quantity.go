package types

import (
	"encoding/json"
	"errors"
	"fmt"
	"regexp"
)

// Quantity represents a hex-encoded unsigned integer.
// Pattern: ^0x(0|[1-9a-f][0-9a-f]*)$
//
// Note: Quantities are encoded as hex strings with no leading zeros,
// except for zero itself which is "0x0".
type Quantity string

var quantityPattern = regexp.MustCompile(`^0x(0|[1-9a-f][0-9a-f]*)$`)

// NewQuantity creates a validated Quantity from a hex string.
// Returns an error if the input is not a valid quantity (contains leading zeros).
func NewQuantity(s string) (Quantity, error) {
	if !quantityPattern.MatchString(s) {
		return "", fmt.Errorf("invalid quantity: expected lowercase hex string with no leading zeros (0x0 or 0x[1-9a-f][0-9a-f]*), got %q", s)
	}
	return Quantity(s), nil
}

// IsQuantity checks if a string is a valid quantity.
func IsQuantity(s string) bool {
	return quantityPattern.MatchString(s)
}

// String returns the quantity as a hex string.
func (q Quantity) String() string {
	return string(q)
}

// MarshalJSON implements json.Marshaler.
func (q Quantity) MarshalJSON() ([]byte, error) {
	return json.Marshal(string(q))
}

// UnmarshalJSON implements json.Unmarshaler.
func (q *Quantity) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}

	if !quantityPattern.MatchString(s) {
		return fmt.Errorf("invalid quantity: expected lowercase hex string with no leading zeros (0x0 or 0x[1-9a-f][0-9a-f]*), got %q", s)
	}

	*q = Quantity(s)
	return nil
}

// Validate checks if the Quantity is valid.
func (q Quantity) Validate() error {
	if !quantityPattern.MatchString(string(q)) {
		return errors.New("invalid quantity format")
	}
	return nil
}
