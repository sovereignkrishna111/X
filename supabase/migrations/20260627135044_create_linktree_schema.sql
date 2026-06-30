
/*
# Linktree Schema - Single Tenant Personal Profile

## Purpose
Creates the complete data model for a personal, single-tenant Linktree-style site.
No auth is required since this is a private personal site managed by the owner.

## Tables

### `profile`
Stores the single profile record:
- `id` (uuid, primary key)
- `name` (text) - display name
- `bio` (text) - short bio/tagline
- `avatar_url` (text) - URL to avatar image
- `background_type` (text) - 'color', 'gradient', 'image', or 'video'
- `background_value` (text) - CSS color/gradient string or URL
- `theme` (text) - active theme name
- `accent_color` (text) - primary accent color
- `social_links` (jsonb) - map of platform -> URL for quick social icons
- `show_analytics` (boolean) - whether to show click counts
- `updated_at` (timestamptz)

### `links`
Stores each card/button on the page:
- `id` (uuid, primary key)
- `title` (text) - display label
- `url` (text) - destination URL
- `description` (text) - optional subtitle
- `type` (text) - 'link' | 'image' | 'video' | 'youtube' | 'embed'
- `icon_type` (text) - 'lucide' | 'image' | 'emoji'
- `icon_value` (text) - icon name, image URL, or emoji char
- `thumbnail_url` (text) - preview image URL
- `color_from` (text) - gradient start color
- `color_to` (text) - gradient end color
- `sort_order` (integer) - display order
- `active` (boolean) - visible on the page
- `click_count` (integer) - analytics counter
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## Security
RLS enabled on both tables with anon + authenticated full access
(single-tenant personal site — no user isolation needed).
*/

CREATE TABLE IF NOT EXISTS profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Your Name',
  bio text DEFAULT 'Your bio goes here',
  avatar_url text DEFAULT '',
  background_type text NOT NULL DEFAULT 'gradient',
  background_value text NOT NULL DEFAULT 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
  theme text NOT NULL DEFAULT 'dark',
  accent_color text NOT NULL DEFAULT '#6366f1',
  social_links jsonb NOT NULL DEFAULT '{}',
  show_analytics boolean NOT NULL DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'New Link',
  url text NOT NULL DEFAULT '#',
  description text DEFAULT '',
  type text NOT NULL DEFAULT 'link',
  icon_type text NOT NULL DEFAULT 'lucide',
  icon_value text NOT NULL DEFAULT 'Link',
  thumbnail_url text DEFAULT '',
  color_from text NOT NULL DEFAULT '#6366f1',
  color_to text NOT NULL DEFAULT '#8b5cf6',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  click_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Profile policies (anon + authenticated full access for single-tenant personal site)
DROP POLICY IF EXISTS "anon_select_profile" ON profile;
CREATE POLICY "anon_select_profile" ON profile FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_profile" ON profile;
CREATE POLICY "anon_insert_profile" ON profile FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_profile" ON profile;
CREATE POLICY "anon_update_profile" ON profile FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_profile" ON profile;
CREATE POLICY "anon_delete_profile" ON profile FOR DELETE
  TO anon, authenticated USING (true);

-- Links policies
DROP POLICY IF EXISTS "anon_select_links" ON links;
CREATE POLICY "anon_select_links" ON links FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_links" ON links;
CREATE POLICY "anon_insert_links" ON links FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_links" ON links;
CREATE POLICY "anon_update_links" ON links FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_links" ON links;
CREATE POLICY "anon_delete_links" ON links FOR DELETE
  TO anon, authenticated USING (true);

-- Seed default profile if none exists
INSERT INTO profile (name, bio, avatar_url, background_type, background_value, theme, accent_color, social_links)
SELECT
  'Your Name',
  'Creator • Developer • Dreamer',
  '',
  'gradient',
  'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  'dark',
  '#818cf8',
  '{"instagram":"","twitter":"","youtube":"","tiktok":"","github":"","linkedin":""}'
WHERE NOT EXISTS (SELECT 1 FROM profile);

-- Seed some example links
INSERT INTO links (title, url, description, type, icon_type, icon_value, color_from, color_to, sort_order)
SELECT 'Instagram', 'https://instagram.com', 'Follow me on Instagram', 'link', 'lucide', 'Instagram', '#833ab4', '#fd1d1d', 1
WHERE NOT EXISTS (SELECT 1 FROM links WHERE title = 'Instagram');

INSERT INTO links (title, url, description, type, icon_type, icon_value, color_from, color_to, sort_order)
SELECT 'YouTube', 'https://youtube.com', 'Watch my latest videos', 'link', 'lucide', 'Youtube', '#ff0000', '#cc0000', 2
WHERE NOT EXISTS (SELECT 1 FROM links WHERE title = 'YouTube');

INSERT INTO links (title, url, description, type, icon_type, icon_value, color_from, color_to, sort_order)
SELECT 'GitHub', 'https://github.com', 'Check out my projects', 'link', 'lucide', 'Github', '#24292e', '#57606a', 3
WHERE NOT EXISTS (SELECT 1 FROM links WHERE title = 'GitHub');
