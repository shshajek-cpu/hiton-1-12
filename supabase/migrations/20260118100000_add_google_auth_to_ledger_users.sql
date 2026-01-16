-- Add Google authentication fields to ledger_users
-- This enables linking device_id with Google account for cross-device sync

-- 1. Make device_id nullable (to support Google-only users in the future)
ALTER TABLE ledger_users
  ALTER COLUMN device_id DROP NOT NULL;

-- 2. Add Google authentication fields
ALTER TABLE ledger_users
  ADD COLUMN IF NOT EXISTS google_user_id text,
  ADD COLUMN IF NOT EXISTS google_email text;

-- 3. Create unique index for google_user_id (only if not null)
CREATE UNIQUE INDEX IF NOT EXISTS ledger_users_google_user_id_unique
  ON ledger_users (google_user_id)
  WHERE google_user_id IS NOT NULL;

-- 4. Update unique constraint for device_id (only if not null)
DROP INDEX IF EXISTS ledger_users_device_id_key;
CREATE UNIQUE INDEX IF NOT EXISTS ledger_users_device_id_unique
  ON ledger_users (device_id)
  WHERE device_id IS NOT NULL;

-- 5. Add check constraint: at least one of device_id or google_user_id must be set
ALTER TABLE ledger_users
  ADD CONSTRAINT ledger_users_auth_check
  CHECK (device_id IS NOT NULL OR google_user_id IS NOT NULL);

COMMENT ON COLUMN ledger_users.google_user_id IS 'Google OAuth user ID (from AuthContext)';
COMMENT ON COLUMN ledger_users.google_email IS 'Google account email for display';
