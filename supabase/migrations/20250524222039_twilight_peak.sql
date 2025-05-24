/*
  # Create recommendations table with RLS policies

  1. New Tables
    - `recommendations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `image_features` (jsonb)
      - `song_id` (text)
      - `explanation` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on recommendations table
    - Add policies for authenticated users to manage their recommendations
*/

CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  image_features jsonb NOT NULL,
  song_id text NOT NULL,
  explanation text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to insert their own recommendations
CREATE POLICY "Users can create their own recommendations"
  ON recommendations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to read their own recommendations
CREATE POLICY "Users can read their own recommendations"
  ON recommendations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Update storage policies to include user ID in path
CREATE POLICY "Authenticated users can upload images with user ID"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;