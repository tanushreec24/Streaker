/*
  # Setup Cron Job for Daily Habit Reminders

  1. Enable pg_cron extension
  2. Create cron job to trigger habit reminders daily at 9 AM UTC
  3. Add function to manually trigger reminders for testing

  Note: This requires superuser privileges and may need to be run manually
  in your Supabase dashboard SQL editor.
*/

-- Enable the pg_cron extension (requires superuser)
-- This may need to be enabled manually in your Supabase project
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a function to call the Edge Function
CREATE OR REPLACE FUNCTION trigger_habit_reminders()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  function_url text;
  response_status int;
BEGIN
  -- Get the Supabase project URL
  function_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-habit-reminders';
  
  -- If the setting doesn't exist, use a placeholder
  IF function_url IS NULL OR function_url = '/functions/v1/send-habit-reminders' THEN
    function_url := 'https://your-project.supabase.co/functions/v1/send-habit-reminders';
  END IF;

  -- Call the Edge Function using HTTP
  -- Note: This is a simplified version. In production, you might want to use
  -- a more robust HTTP client or handle this differently
  
  -- Log the attempt
  INSERT INTO public.cron_logs (function_name, executed_at, status)
  VALUES ('send-habit-reminders', NOW(), 'triggered');
  
  -- In a real implementation, you would make an HTTP request here
  -- For now, we'll just log that the function was called
  RAISE NOTICE 'Habit reminders function triggered at %', NOW();
END;
$$;

-- Create a simple logging table for cron jobs
CREATE TABLE IF NOT EXISTS public.cron_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  function_name text NOT NULL,
  executed_at timestamptz DEFAULT now(),
  status text NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on cron_logs
ALTER TABLE public.cron_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for cron_logs (only service role can access)
CREATE POLICY "Service role can manage cron logs"
  ON public.cron_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Schedule the cron job to run daily at 9 AM UTC
-- Note: This requires the pg_cron extension and superuser privileges
-- You may need to run this manually in your Supabase dashboard:

/*
SELECT cron.schedule(
  'daily-habit-reminders',
  '0 9 * * *',
  'SELECT trigger_habit_reminders();'
);
*/

-- Create a manual trigger function for testing
CREATE OR REPLACE FUNCTION manual_trigger_habit_reminders()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  -- Call the trigger function
  PERFORM trigger_habit_reminders();
  
  -- Return success response
  result := json_build_object(
    'success', true,
    'message', 'Habit reminders triggered manually',
    'timestamp', NOW()
  );
  
  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users for manual testing
GRANT EXECUTE ON FUNCTION manual_trigger_habit_reminders() TO authenticated;