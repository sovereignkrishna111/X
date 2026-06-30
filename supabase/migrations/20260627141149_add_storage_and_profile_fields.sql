
/*
# Add Storage Buckets and Extended Profile Fields

## Changes

### Storage Buckets
- `avatars`: Public bucket for profile avatar images (max 10MB, images only)
- `media`: Public bucket for link thumbnails, images, and videos (max 200MB)

### Modified Tables

#### `profile`
- Added `font_family` (text) — chosen font (inter, playfair, space-grotesk, syne, outfit, dm-sans)
- Added `card_style` (text) — card visual variant: glass, solid, outline, shadow

#### `links`
- Added `media_url` (text) — direct uploaded file URL (replaces or supplements url for media types)

### Security
- Storage buckets: public read for both
- Anon upload allowed for both buckets (personal single-tenant site)
*/

-- Storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'avatars',
    'avatars',
    true,
    10485760,
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'media',
    'media',
    true,
    209715200,
    ARRAY[
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'
    ]
  )
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_anon_insert" ON storage.objects;
CREATE POLICY "avatars_anon_insert" ON storage.objects
  FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_anon_update" ON storage.objects;
CREATE POLICY "avatars_anon_update" ON storage.objects
  FOR UPDATE TO anon, authenticated USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_anon_delete" ON storage.objects;
CREATE POLICY "avatars_anon_delete" ON storage.objects
  FOR DELETE TO anon, authenticated USING (bucket_id = 'avatars');

-- Storage policies for media
DROP POLICY IF EXISTS "media_public_read" ON storage.objects;
CREATE POLICY "media_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "media_anon_insert" ON storage.objects;
CREATE POLICY "media_anon_insert" ON storage.objects
  FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "media_anon_update" ON storage.objects;
CREATE POLICY "media_anon_update" ON storage.objects
  FOR UPDATE TO anon, authenticated USING (bucket_id = 'media');

DROP POLICY IF EXISTS "media_anon_delete" ON storage.objects;
CREATE POLICY "media_anon_delete" ON storage.objects
  FOR DELETE TO anon, authenticated USING (bucket_id = 'media');

-- Add new profile columns
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profile' AND column_name = 'font_family') THEN
    ALTER TABLE profile ADD COLUMN font_family text NOT NULL DEFAULT 'inter';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profile' AND column_name = 'card_style') THEN
    ALTER TABLE profile ADD COLUMN card_style text NOT NULL DEFAULT 'glass';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profile' AND column_name = 'animation_style') THEN
    ALTER TABLE profile ADD COLUMN animation_style text NOT NULL DEFAULT 'smooth';
  END IF;
END $$;

-- Add media_url to links
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'links' AND column_name = 'media_url') THEN
    ALTER TABLE links ADD COLUMN media_url text DEFAULT '';
  END IF;
END $$;
