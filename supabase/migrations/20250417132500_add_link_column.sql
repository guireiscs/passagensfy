-- Add link column to promotions table
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS link TEXT;
