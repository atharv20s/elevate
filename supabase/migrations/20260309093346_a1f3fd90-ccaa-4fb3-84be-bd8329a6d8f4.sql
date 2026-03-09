-- Create table for consultation requests
CREATE TABLE public.consultation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit consultation request"
  ON public.consultation_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can read consultation requests"
  ON public.consultation_requests FOR SELECT
  USING (false);

-- Create table for internship applications
CREATE TABLE public.internship_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  college TEXT NOT NULL,
  year_of_study TEXT NOT NULL,
  area_of_interest TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit internship application"
  ON public.internship_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can read internship applications"
  ON public.internship_applications FOR SELECT
  USING (false);

-- Create table for chat queries
CREATE TABLE public.chat_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert chat queries"
  ON public.chat_queries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can read chat queries"
  ON public.chat_queries FOR SELECT
  USING (false);