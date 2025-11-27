-- Add show_in_timeline column to actions table
ALTER TABLE public.actions 
ADD COLUMN show_in_timeline boolean NOT NULL DEFAULT true;

-- Update existing records to show in timeline by default
UPDATE public.actions 
SET show_in_timeline = true 
WHERE show_in_timeline IS NULL;