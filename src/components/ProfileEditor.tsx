import { useState } from 'react';
import type { Profile } from '../types';
import { socialPlatforms } from '../data/icons';
import { FileUpload } from './FileUpload';

interface ProfileEditorProps {
  profile: Profile;
  onSave: (updates: Partial<Profile>) => void;
}

const gradientPresets = [
  'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
  'linear-gradient(135deg, #051937 0%, #004d7a 50%, #008793 100%)',
  'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  'linear-gradient(135deg, #1f4037 0%, #99f2c8 100%)',
  'linear-gradient(135deg, #c94b4b 0%, #4b134f 100%)',
  'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
  'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)',
  'linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)',
  'linear-gradient(135deg, #0f0c29 0%, #6a3093 50%, #a044ff 100%)',
  'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
  'linear-gradient(135deg, #16213e 0%, #0f3460 50%, #533483 100%)',
  'linear-gradient(135deg, #000000 0%, #434343 100%)',
  'linear-gradient(135deg, #360033 0%, #0b8793 100%)',
  'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
  'linear-gradient(135deg, #4568dc 0%, #b06ab3 100%)',
  'linear-gradient(135deg, #02aab0 0%, #00cdac 100%)',
];

export function ProfileEditor({ profile, onSave }: ProfileEditorProps) {
  const [form, setForm] = useState({ ...profile });
  const [section, setSection] = useState<'basic' | 'background' | 'social'>('basic');

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setSocial = (key: string, value: string) =>
    setForm((f) => ({ ...f, social_links: { ...f.social_links, [key]: value } }));

  const setSocialIconImage = (key: string, value: string) =>
    setForm((f) => ({ ...f, social_icon_images: { ...f.social_icon_images, [key]: value } }));

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all';
  const labelClass = 'block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide';

  const sectionBtnClass = (s: typeof section) =>
    `flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
      section === s ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'
    }`;

  return (
    <div className="space-y-4">
      {/* Section nav */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/8">
        <button className={sectionBtnClass('basic')} onClick={() => setSection('basic')}>Basic</button>
        <button className={sectionBtnClass('background')} onClick={() => setSection('background')}>Background</button>
        <button className={sectionBtnClass('social')} onClick={() => setSection('social')}>Social</button>
      </div>

      {/* BASIC */}
      {section === 'basic' && (
        <div className="space-y-4">
          {/* Avatar */}
          <div>
            <label className={labelClass}>Avatar</label>
            <FileUpload
              bucket="avatars"
              onUploaded={(url) => set('avatar_url', url)}
              currentUrl={form.avatar_url}
              label="Upload photo"
              hint="JPG, PNG, GIF, WebP — max 10MB"
              folder="profile"
            />
            <div className="mt-2">
              <input
                className={inputClass}
                placeholder="Or paste image URL"
                value={form.avatar_url}
                onChange={(e) => set('avatar_url', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Display Name</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className={labelClass}>Bio</label>
            <textarea
              className={`${inputClass} resize-none h-16`}
              value={form.bio}
              onChange={(e) => set('bio', e.target.value)}
              placeholder="Short bio or tagline..."
            />
          </div>

          {/* Bio Color */}
          <div>
            <label className={labelClass}>Bio Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.bio_color || '#ffffff'}
                onChange={(e) => set('bio_color', e.target.value)}
                className="w-10 h-10 rounded-xl border border-white/10 cursor-pointer bg-transparent flex-shrink-0"
              />
              <input
                className={`${inputClass} flex-1`}
                value={form.bio_color || '#ffffff'}
                onChange={(e) => set('bio_color', e.target.value)}
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* Accent color */}
          <div>
            <label className={labelClass}>Accent Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.accent_color}
                onChange={(e) => set('accent_color', e.target.value)}
                className="w-10 h-10 rounded-xl border border-white/10 cursor-pointer bg-transparent flex-shrink-0"
              />
              <input
                className={`${inputClass} flex-1`}
                value={form.accent_color}
                onChange={(e) => set('accent_color', e.target.value)}
                placeholder="#818cf8"
              />
            </div>
            <div
              className="mt-1.5 h-1.5 rounded-full opacity-70"
              style={{ background: `linear-gradient(to right, ${form.accent_color}00, ${form.accent_color}, ${form.accent_color}00)` }}
            />
          </div>

          {/* Analytics toggle */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm text-white/80 font-medium">Click analytics</p>
              <p className="text-xs text-white/40">Show click counts on links</p>
            </div>
            <button
              onClick={() => set('show_analytics', !form.show_analytics)}
              className={`w-11 h-6 rounded-full transition-all duration-200 relative ${form.show_analytics ? 'bg-green-500' : 'bg-white/15'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${form.show_analytics ? 'left-5.5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      )}

      {/* BACKGROUND */}
      {section === 'background' && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Type</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['color', 'gradient', 'image', 'video'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => set('background_type', t)}
                  className={`py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                    form.background_type === t
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {form.background_type === 'color' && (
            <div>
              <label className={labelClass}>Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.background_value.startsWith('#') ? form.background_value : '#000000'}
                  onChange={(e) => set('background_value', e.target.value)}
                  className="w-10 h-10 rounded-xl border border-white/10 cursor-pointer bg-transparent flex-shrink-0"
                />
                <input
                  className={`${inputClass} flex-1`}
                  value={form.background_value}
                  onChange={(e) => set('background_value', e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>
          )}

          {form.background_type === 'gradient' && (
            <div className="space-y-3">
              <div>
                <label className={labelClass}>Custom Gradient CSS</label>
                <input
                  className={inputClass}
                  value={form.background_value}
                  onChange={(e) => set('background_value', e.target.value)}
                  placeholder="linear-gradient(...)"
                />
              </div>
              <div>
                <label className={labelClass}>Presets</label>
                <div className="grid grid-cols-6 gap-1.5">
                  {gradientPresets.map((g, i) => (
                    <button
                      key={i}
                      onClick={() => set('background_value', g)}
                      className="h-10 rounded-xl border-2 transition-all hover:scale-110"
                      style={{
                        background: g,
                        borderColor: form.background_value === g ? 'white' : 'transparent',
                      }}
                      title={`Gradient ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {form.background_type === 'image' && (
            <div className="space-y-2">
              <label className={labelClass}>Background Image</label>
              <FileUpload
                bucket="media"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onUploaded={(url) => set('background_value', url)}
                currentUrl={form.background_value.startsWith('http') ? form.background_value : ''}
                label="Upload background image"
                hint="Large, high-quality image recommended"
                folder="backgrounds"
              />
              <input
                className={inputClass}
                placeholder="Or paste image URL"
                value={form.background_value}
                onChange={(e) => set('background_value', e.target.value)}
              />
            </div>
          )}

          {form.background_type === 'video' && (
            <div className="space-y-2">
              <label className={labelClass}>Background Video</label>
              <FileUpload
                bucket="media"
                accept="video/mp4,video/webm,video/ogg"
                onUploaded={(url) => set('background_value', url)}
                currentUrl={form.background_value.startsWith('http') ? form.background_value : ''}
                label="Upload background video"
                hint="MP4, WebM — loops automatically"
                folder="backgrounds"
              />
              <input
                className={inputClass}
                placeholder="Or paste video URL"
                value={form.background_value}
                onChange={(e) => set('background_value', e.target.value)}
              />
            </div>
          )}

          {/* Preview */}
          <div className="mt-1">
            <label className={labelClass}>Preview</label>
            <div
              className="w-full h-24 rounded-xl border border-white/10 overflow-hidden"
              style={
                form.background_type === 'color'
                  ? { backgroundColor: form.background_value }
                  : form.background_type === 'gradient'
                  ? { background: form.background_value }
                  : form.background_type === 'image'
                  ? { backgroundImage: `url(${form.background_value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : { backgroundColor: '#0f172a' }
              }
            />
          </div>
        </div>
      )}

      {/* SOCIAL */}
      {section === 'social' && (
        <div className="space-y-4">
          {/* Social Links Color */}
          <div>
            <label className={labelClass}>Social Links Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.social_links_color || '#ffffff'}
                onChange={(e) => set('social_links_color', e.target.value)}
                className="w-10 h-10 rounded-xl border border-white/10 cursor-pointer bg-transparent flex-shrink-0"
              />
              <input
                className={`${inputClass} flex-1`}
                value={form.social_links_color || '#ffffff'}
                onChange={(e) => set('social_links_color', e.target.value)}
                placeholder="#ffffff"
              />
            </div>
            <p className="text-[10px] text-white/35 mt-1">Changes color of all social media links and icons</p>
          </div>
          
          <div className="h-px bg-white/5" />

          {socialPlatforms.map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-2 p-3 bg-white/3 rounded-xl border border-white/6">
              <label className={labelClass}>{label}</label>
              <input
                className={inputClass}
                placeholder={placeholder}
                value={form.social_links[key] ?? ''}
                onChange={(e) => setSocial(key, e.target.value)}
              />
              <div className="flex items-center gap-2 mt-2">
                {form.social_icon_images?.[key] && (
                  <img
                    src={form.social_icon_images[key]}
                    alt={`${label} icon`}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
                  />
                )}
                <FileUpload
                  bucket="media"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onUploaded={(url) => setSocialIconImage(key, url)}
                  currentUrl={form.social_icon_images?.[key] || ''}
                  label={form.social_icon_images?.[key] ? 'Replace icon' : 'Custom icon'}
                  hint="Upload custom icon (optional)"
                  folder="social-icons"
                />
                {form.social_icon_images?.[key] && (
                  <button
                    onClick={() => setSocialIconImage(key, '')}
                    className="text-xs text-red-400 hover:text-red-300 underline underline-offset-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save */}
      <button
        onClick={() => onSave(form)}
        className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] shadow-lg mt-2"
        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
      >
        Save Changes
      </button>
    </div>
  );
}
