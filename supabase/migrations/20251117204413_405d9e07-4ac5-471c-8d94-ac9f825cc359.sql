-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  preferred_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create plans table with profile and background image URLs
CREATE TABLE public.plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'My Plan',
  profile_picture_url TEXT,
  background_picture_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on plans
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Plans policies
CREATE POLICY "Users can view their own plans"
  ON public.plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own plans"
  ON public.plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plans"
  ON public.plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plans"
  ON public.plans FOR DELETE
  USING (auth.uid() = user_id);

-- Create plan_sections table
CREATE TABLE public.plan_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  category TEXT NOT NULL,
  fields JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(plan_id, section_key)
);

-- Enable RLS on plan_sections
ALTER TABLE public.plan_sections ENABLE ROW LEVEL SECURITY;

-- Plan sections policies
CREATE POLICY "Users can view their own plan sections"
  ON public.plan_sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.plans
      WHERE plans.id = plan_sections.plan_id
      AND plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own plan sections"
  ON public.plan_sections FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.plans
      WHERE plans.id = plan_sections.plan_id
      AND plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own plan sections"
  ON public.plan_sections FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.plans
      WHERE plans.id = plan_sections.plan_id
      AND plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own plan sections"
  ON public.plan_sections FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.plans
      WHERE plans.id = plan_sections.plan_id
      AND plans.user_id = auth.uid()
    )
  );

-- Create actions table
CREATE TABLE public.actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID NOT NULL REFERENCES public.plan_sections(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  responsible TEXT NOT NULL DEFAULT '',
  deadline DATE,
  support TEXT NOT NULL DEFAULT '',
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on actions
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;

-- Actions policies
CREATE POLICY "Users can view their own actions"
  ON public.actions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.plan_sections
      JOIN public.plans ON plans.id = plan_sections.plan_id
      WHERE plan_sections.id = actions.section_id
      AND plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own actions"
  ON public.actions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.plan_sections
      JOIN public.plans ON plans.id = plan_sections.plan_id
      WHERE plan_sections.id = actions.section_id
      AND plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own actions"
  ON public.actions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.plan_sections
      JOIN public.plans ON plans.id = plan_sections.plan_id
      WHERE plan_sections.id = actions.section_id
      AND plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own actions"
  ON public.actions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.plan_sections
      JOIN public.plans ON plans.id = plan_sections.plan_id
      WHERE plan_sections.id = actions.section_id
      AND plans.user_id = auth.uid()
    )
  );

-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for profile images
CREATE POLICY "Users can view all profile images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload their own profile images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own profile images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own profile images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plan_sections_updated_at
  BEFORE UPDATE ON public.plan_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_actions_updated_at
  BEFORE UPDATE ON public.actions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();