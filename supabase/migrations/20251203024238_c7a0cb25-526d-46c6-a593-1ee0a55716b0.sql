-- Add enabled_sections column to plans table
-- Stores array of section IDs that are enabled for this plan
-- NULL means all sections are enabled (backward compatibility)
ALTER TABLE public.plans 
ADD COLUMN enabled_sections text[] DEFAULT NULL;

-- Add comment explaining the column
COMMENT ON COLUMN public.plans.enabled_sections IS 'Array of section IDs enabled for this plan. NULL means all sections enabled.';