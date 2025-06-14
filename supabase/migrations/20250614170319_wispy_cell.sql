/*
  # Create habits table

  1. New Tables
    - `habits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `name` (text, not null)
      - `description` (text, nullable)
      - `emoji` (text, default 🎯)
      - `color` (text, default #d4af37)
      - `reminder_time` (text, nullable)
      - `reminder_enabled` (boolean, default false)
      - `active_days` (text array, default all days)
      - `target_count` (integer, default 1)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `habits` table
    - Add policies for users to manage their own habits
*/

CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  emoji text DEFAULT '🎯',
  color text DEFAULT '#d4af37',
  reminder_time text,
  reminder_enabled boolean DEFAULT false,
  active_days text[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  target_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

-- Users can read their own habits
CREATE POLICY "Users can read own habits"
  ON habits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own habits
CREATE POLICY "Users can insert own habits"
  ON habits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own habits
CREATE POLICY "Users can update own habits"
  ON habits
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own habits
CREATE POLICY "Users can delete own habits"
  ON habits
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS habits_user_id_idx ON habits(user_id);
CREATE INDEX IF NOT EXISTS habits_created_at_idx ON habits(created_at);