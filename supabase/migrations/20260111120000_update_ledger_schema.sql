-- Migration: Update ledger schema for flexible entries
-- 1. Add price and category to ledger_record_items

ALTER TABLE ledger_record_items
ADD COLUMN IF NOT EXISTS price bigint DEFAULT 0,
ADD COLUMN IF NOT EXISTS category text DEFAULT 'item_sale';

-- Index for category for faster filtering
CREATE INDEX IF NOT EXISTS idx_ledger_record_items_category ON ledger_record_items(category);
