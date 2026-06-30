import {
  type LucideIcon,
  Instagram, Twitter, Youtube, Github, Linkedin, Twitch,
  Music, MessageCircle, AtSign, Rss, Send, Facebook,
} from 'lucide-react';
import type { Theme } from '../types';

const socialIconMap: Record<string, LucideIcon> = {
  instagram: Instagram,
  twitter: Twitter,
  x: Twitter,
  youtube: Youtube,
  github: Github,
  linkedin: Linkedin,
  twitch: Twitch,
  tiktok: Music,
  discord: MessageCircle,
  threads: AtSign,
  spotify: Rss,
  telegram: Send,
  facebook: Facebook,
};

interface SocialIconBarProps {
  socialLinks: Record<string, string>;
  socialIconImages: Record<string, string>;
  theme: Theme;
  accentColor: string;
}

export function SocialIconBar({ socialLinks, socialIconImages, theme, accentColor }: SocialIconBarProps) {
  const active = Object.entries(socialLinks).filter(([, url]) => url && url.trim() !== '');
  if (active.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-6 mt-7 flex-wrap">
      {active.map(([key, url]) => {
        const Icon = socialIconMap[key.toLowerCase()];
        const customImage = socialIconImages?.[key];

        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative transition-all duration-200 hover:scale-[1.18] active:scale-90"
            onClick={(e) => e.stopPropagation()}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
          >
            {customImage ? (
              <div
                className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/15 group-hover:ring-white/40 transition-all duration-200"
                style={{ boxShadow: `0 2px 14px ${accentColor}28` }}
              >
                <img src={customImage} alt={key} className="w-full h-full object-cover" />
              </div>
            ) : Icon ? (
              <Icon
                size={30}
                className={`transition-all duration-200 ${theme.textClass}`}
                style={{
                  filter: `drop-shadow(0 2px 10px ${accentColor}35)`,
                  opacity: 0.88,
                }}
              />
            ) : null}
          </a>
        );
      })}
    </div>
  );
}
