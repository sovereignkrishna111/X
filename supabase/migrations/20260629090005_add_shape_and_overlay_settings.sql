
/*
# Add Shape, Overlay, and Social Icon Image Settings

## Changes

### Modified Tables

#### `profile`
- `card_radius` (text, default 'pill') — card corner radius style: pill | xl | lg | sm | none
- `avatar_shape` (text, default 'circle') — avatar shape: circle | rounded | square
- `social_icon_images` (jsonb, default '{}') — custom image URL per social platform
- `bg_overlay` (text, default 'none') — background overlay/cut effect

These fields allow fully customizing the visual presentation without code changes.
*/

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profile' AND column_name = 'card_radius') THEN
    ALTER TABLE profile ADD COLUMN card_radius text NOT NULL DEFAULT 'pill';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profile' AND column_name = 'avatar_shape') THEN
    ALTER TABLE profile ADD COLUMN avatar_shape text NOT NULL DEFAULT 'circle';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profile' AND column_name = 'social_icon_images') THEN
    ALTER TABLE profile ADD COLUMN social_icon_images jsonb NOT NULL DEFAULT '{}';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profile' AND column_name = 'bg_overlay') THEN
    ALTER TABLE profile ADD COLUMN bg_overlay text NOT NULL DEFAULT 'none';
  END IF;
END $$;
