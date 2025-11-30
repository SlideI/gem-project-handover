-- Remove the unique constraint on user_id to allow multiple plans per user
ALTER TABLE public.plans DROP CONSTRAINT IF EXISTS plans_user_id_key;