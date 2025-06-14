/*
  # Create habit entries table

  1. New Tables
    - `habit_entries`
      - `id` (uuid, primary key)
      - `habit_id` (uuid, references habits.id)
      - `user_id` (uuid, references profiles.id)
      - `completed_at` (date, not null)
      - `count` (integer, default 1)
      - `notes` (text, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `habit_entries` table
    - Add policies for users to manage their own habit entries

  3. Constraints
    - Unique constraint on habit_id + completed_at (one entry per habit per day)
*/

CREATE TABLE IF NOT EXISTS habit_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  completed_at date NOT NULL DEFAULT CURRENT_DATE,
  count integer DEFAULT 1,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE habit_entries ENABLE ROW LEVEL SECURITY;

-- Users can read their own habit entries
CREATE POLICY "Users can read own habit entries"
  ON habit_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own habit entries
CREATE POLICY "Users can insert own habit entries"
  ON habit_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own habit entries
CREATE POLICY "Users can update own habit entries"
  ON habit_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own habit entries
CREATE POLICY "Users can delete own habit entries"
  ON habit_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create unique constraint to prevent duplicate entries for same habit on same day
CREATE UNIQUE INDEX IF NOT EXISTS habit_entries_habit_date_unique 
  ON habit_entries(habit_id, completed_at);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS habit_entries_user_id_idx ON habit_entries(user_id);
CREATE INDEX IF NOT EXISTS habit_entries_habit_id_idx ON habit_entries(habit_id);
CREATE INDEX IF NOT EXISTS habit_entries_completed_at_idx ON habit_entries(completed_at);
CREATE INDEX IF NOT EXISTS habit_entries_user_date_idx ON habit_entries(user_id, completed_at);