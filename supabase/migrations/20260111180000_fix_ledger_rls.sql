-- Migration: Fix RLS policies and trigger permissions for ledger
-- 1. Update trigger function to use SECURITY DEFINER to bypass RLS issues during internal updates
CREATE OR REPLACE FUNCTION ensure_single_main_character()
RETURNS TRIGGER AS $$
BEGIN
    -- If setting is_main to true, unset all other characters for this user
    IF NEW.is_main = true THEN
        UPDATE ledger_characters
        SET is_main = false
        WHERE user_id = NEW.user_id
          AND id != NEW.id
          AND is_main = true;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Force drop and recreate policies to ensure they are correct
DROP POLICY IF EXISTS "Public access" ON ledger_characters;
DROP POLICY IF EXISTS "Enable insert for all" ON ledger_characters;
DROP POLICY IF EXISTS "Enable select for all" ON ledger_characters;
DROP POLICY IF EXISTS "Enable update for all" ON ledger_characters;
DROP POLICY IF EXISTS "Enable delete for all" ON ledger_characters;

-- Create explicit policies
CREATE POLICY "Enable read access for all" ON ledger_characters
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all" ON ledger_characters
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all" ON ledger_characters
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all" ON ledger_characters
    FOR DELETE USING (true);
