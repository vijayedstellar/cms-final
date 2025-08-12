/*
  # Create CMS Users Table

  1. New Tables
    - `cms_users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique, not null)
      - `name` (text, not null)
      - `role` (text, not null, check constraint)
      - `status` (text, not null, default 'pending')
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `last_login` (timestamptz, nullable)

  2. Security
    - Enable RLS on `cms_users` table
    - Add policies for authenticated users to read their own data
    - Add policies for administrators to manage all users
*/

-- Create cms_users table
CREATE TABLE IF NOT EXISTS cms_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('administrator', 'editor', 'author')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Enable RLS
ALTER TABLE cms_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own profile"
  ON cms_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON cms_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Administrators can manage all users"
  ON cms_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cms_users 
      WHERE id = auth.uid() 
      AND role = 'administrator' 
      AND status = 'active'
    )
  );

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_cms_users_updated_at
  BEFORE UPDATE ON cms_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();