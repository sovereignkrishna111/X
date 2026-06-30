export interface Profile {
  id: string;
  name: string;
  bio: string;
  avatar_url: string;
  background_type: 'color' | 'gradient' | 'image' | 'video';
  background_value: string;
  bg_overlay: string;
  theme: string;
  accent_color: string;
  social_links: Record<string, string>;
  social_icon_images: Record<string, string>;
  show_analytics: boolean;
  font_family: string;
  card_style: string;
  card_radius: string;
  avatar_shape: string;
  animation_style: string;
  bio_color: string;
  social_links_color: string;
  updated_at: string;
}

export interface Link {
  id: string;
  title: string;
  url: string;
  description: string;
  type: 'link' | 'image' | 'video' | 'youtube' | 'embed';
  icon_type: 'lucide' | 'image' | 'emoji';
  icon_value: string;
  thumbnail_url: string;
  media_url: string;
  color_from: string;
  color_to: string;
  sort_order: number;
  active: boolean;
  click_count: number;
  created_at: string;
  updated_at: string;
}

export interface Theme {
  id: string;
  name: string;
  emoji: string;
  preview: string;
  cardClass: string;
  cardHoverClass: string;
  cardTextPrimary: string;
  cardTextSecondary: string;
  cardMuted: string;
  lightCard: boolean;
  textClass: string;
  subtextClass: string;
  bgOverlay: string;
  effectClass: string;
  defaultFont: string;
}

export interface FontOption {
  id: string;
  name: string;
  family: string;
  weight: string;
}

export type AdminView = 'links' | 'profile' | 'theme' | 'design';

export type CardRadius = 'pill' | 'xl' | 'lg' | 'sm' | 'none';
export type AvatarShape = 'circle' | 'rounded' | 'square';
export type BgOverlay = 'none' | 'dark' | 'blur' | 'vignette' | 'fade' | 'gradient-dark' | 'grain';
