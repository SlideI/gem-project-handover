-- Add new columns to the actions table for goal plan updates
ALTER TABLE public.actions 
ADD COLUMN IF NOT EXISTS needs_goals text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS achievement_indicator text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT '';

-- Remove support column is not possible without data loss, so we'll keep it but stop using it