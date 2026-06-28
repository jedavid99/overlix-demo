/*
 * Migration: Activation Codes Table
 * Description: Add activation_codes table for admin registration
 */

export const activationCodesMigration = `
-- Activation codes table for admin registration
CREATE TABLE IF NOT EXISTS activation_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'used', 'expired')),
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_activation_codes_code ON activation_codes(code);
CREATE INDEX IF NOT EXISTS idx_activation_codes_status ON activation_codes(status);
CREATE INDEX IF NOT EXISTS idx_activation_codes_email ON activation_codes(email);

-- Trigger to update updated_at
CREATE TRIGGER update_activation_codes_updated_at
    BEFORE UPDATE ON activation_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
`;
