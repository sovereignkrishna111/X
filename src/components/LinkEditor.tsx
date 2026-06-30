import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import type { Link } from '../types';
import { popularIcons, linkTypeLabels } from '../data/icons';
import { DynamicIcon } from './DynamicIcon';
import { FileUpload } from './FileUpload';

interface LinkEditorProps {
  link?: Partial<Link>;
  onSave: (data: Partial<Link>) => void;
  onCancel: () => void;
  isNew?: boolean;
}

const defaultLink: Partial<Link> = {
  title: '',
  url: '',
  description: '',
  type: 'link',
  icon_type: 'lucide',
  icon_value: 'Link',
  thumbnail_url: '',
  media_url: '',
  color_from: '#6366f1',
  color_to: '#8b5cf6',
  active: true,
};

const colorPairs = [
  ['#6366f1', '#8b5cf6'],
  ['#ec4899', '#f43f5e'],
  ['#f59e0b', '#ef4444'],
  ['#10b981', '#06b6d4'],
  ['#3b82f6', '#6366f1'],
  ['#f97316', '#fb923c'],
  ['#8b5cf6', '#d946ef'],
  ['#14b8a6', '#10b981'],
  ['#e11d48', '#9f1239'],
  ['#1d4ed8', '#2563eb'],
  ['#0ea5e9', '#38bdf8'],
  ['#64748b', '#94a3b8'],
];

export function LinkEditor({ link, onSave, onCancel, isNew = false }: LinkEditorProps) {
  const [form, setForm] = useState<Partial<Link>>({ ...defaultLink, ...link });
  const [showIcons, setShowIcons] = useState(false);

  const set = (key: keyof Link, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all';
  const labelClass = 'block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide';

  const isMediaType = ['image', 'video', 'youtube'].includes(form.type ?? '');
  const needsUpload = form.type === 'image' || form.type === 'video';

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-sm">{isNew ? 'Add New Link' : 'Edit Link'}</h3>
        <button onClick={onCancel} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/80 transition-all">
          <X size={14} />
        </button>
      </div>

      {/* Type selector */}
      <div>
        <label className={labelClass}>Type</label>
        <div className="grid grid-cols-3 gap-1.5">
          {Object.entries(linkTypeLabels).map(([type, label]) => (
            <button
              key={type}
              onClick={() => set('type', type)}
              className={`py-2 px-1 rounded-xl text-[11px] font-medium transition-all leading-tight ${
                form.type === type
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10 hover:text-white/70'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Title</label>
        <input className={inputClass} placeholder="Link title" value={form.title ?? ''} onChange={(e) => set('title', e.target.value)} />
      </div>

      {/* URL — hidden for pure image/video upload */}
      {(form.type === 'link' || form.type === 'youtube' || form.type === 'embed') && (
        <div>
          <label className={labelClass}>{form.type === 'youtube' ? 'YouTube URL' : 'URL'}</label>
          <input
            className={inputClass}
            placeholder={form.type === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://'}
            value={form.url ?? ''}
            onChange={(e) => set('url', e.target.value)}
          />
        </div>
      )}

      {/* Media upload */}
      {needsUpload && (
        <div>
          <label className={labelClass}>{form.type === 'video' ? 'Video File' : 'Image File'}</label>
          <FileUpload
            bucket="media"
            accept={form.type === 'video' ? 'video/mp4,video/webm,video/ogg' : 'image/jpeg,image/png,image/gif,image/webp'}
            onUploaded={(url) => {
              set('media_url', url);
              set('url', url);
            }}
            currentUrl={form.media_url || form.url}
            label={`Upload ${form.type}`}
            hint={form.type === 'video' ? 'MP4, WebM — max 200MB' : 'JPG, PNG, GIF, WebP — max 10MB'}
            folder="links"
          />
          <div className="mt-2">
            <input
              className={inputClass}
              placeholder="Or paste URL"
              value={form.url ?? ''}
              onChange={(e) => { set('url', e.target.value); set('media_url', e.target.value); }}
            />
          </div>
        </div>
      )}

      {/* Thumbnail */}
      {isMediaType && (
        <div>
          <label className={labelClass}>Thumbnail (preview image)</label>
          <FileUpload
            bucket="media"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onUploaded={(url) => set('thumbnail_url', url)}
            currentUrl={form.thumbnail_url}
            label="Upload thumbnail"
            compact
            folder="thumbnails"
          />
          <div className="mt-1.5">
            <input
              className={inputClass}
              placeholder="Or paste thumbnail URL"
              value={form.thumbnail_url ?? ''}
              onChange={(e) => set('thumbnail_url', e.target.value)}
            />
          </div>
        </div>
      )}

      <div>
        <label className={labelClass}>Description (optional)</label>
        <input className={inputClass} placeholder="Short description" value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} />
      </div>

      {/* Icon */}
      <div>
        <label className={labelClass}>Icon</label>
        <div className="grid grid-cols-3 gap-1.5 mb-2">
          {(['lucide', 'emoji', 'image'] as const).map((t) => (
            <button
              key={t}
              onClick={() => set('icon_type', t)}
              className={`py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                form.icon_type === t
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {form.icon_type === 'lucide' && (
          <>
            <button
              onClick={() => setShowIcons((p) => !p)}
              className={`${inputClass} flex items-center justify-between`}
            >
              <div className="flex items-center gap-2">
                <DynamicIcon name={form.icon_value ?? 'Link'} size={15} className="text-white/60" />
                <span className="text-white/70 text-sm">{form.icon_value || 'Select icon'}</span>
              </div>
              <ChevronDown size={14} className={`text-white/40 transition-transform ${showIcons ? 'rotate-180' : ''}`} />
            </button>
            {showIcons && (
              <div className="mt-1.5 grid grid-cols-6 gap-1.5 max-h-44 overflow-y-auto p-2 bg-white/5 rounded-xl border border-white/10">
                {popularIcons.map((icon) => (
                  <button
                    key={icon}
                    title={icon}
                    onClick={() => { set('icon_value', icon); setShowIcons(false); }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/15 ${form.icon_value === icon ? 'bg-white/20 ring-1 ring-white/30' : ''}`}
                  >
                    <DynamicIcon name={icon} size={15} className="text-white/70" />
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {form.icon_type === 'emoji' && (
          <input className={inputClass} placeholder="Paste emoji e.g. 🚀" value={form.icon_value ?? ''} onChange={(e) => set('icon_value', e.target.value)} maxLength={4} />
        )}

        {form.icon_type === 'image' && (
          <div className="space-y-2">
            <FileUpload
              bucket="media"
              accept="image/jpeg,image/png,image/webp"
              onUploaded={(url) => set('icon_value', url)}
              currentUrl={form.icon_value?.startsWith('http') ? form.icon_value : ''}
              label="Upload icon"
              compact
              folder="icons"
            />
            <input className={inputClass} placeholder="Or paste icon image URL" value={form.icon_value ?? ''} onChange={(e) => set('icon_value', e.target.value)} />
          </div>
        )}
      </div>

      {/* Colors */}
      <div>
        <label className={labelClass}>Gradient Color</label>
        <div className="grid grid-cols-6 gap-1.5 mb-2">
          {colorPairs.map(([from, to], i) => (
            <button
              key={i}
              onClick={() => { set('color_from', from); set('color_to', to); }}
              className="h-8 rounded-lg border-2 transition-all hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${from}, ${to})`,
                borderColor: form.color_from === from && form.color_to === to ? 'white' : 'transparent',
              }}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 flex-1">
            <input type="color" value={form.color_from ?? '#6366f1'} onChange={(e) => set('color_from', e.target.value)} className="w-8 h-8 rounded-lg border border-white/10 cursor-pointer bg-transparent flex-shrink-0" />
            <input className={`${inputClass} flex-1`} value={form.color_from ?? ''} onChange={(e) => set('color_from', e.target.value)} placeholder="#6366f1" />
          </div>
          <div className="flex items-center gap-1.5 flex-1">
            <input type="color" value={form.color_to ?? '#8b5cf6'} onChange={(e) => set('color_to', e.target.value)} className="w-8 h-8 rounded-lg border border-white/10 cursor-pointer bg-transparent flex-shrink-0" />
            <input className={`${inputClass} flex-1`} value={form.color_to ?? ''} onChange={(e) => set('color_to', e.target.value)} placeholder="#8b5cf6" />
          </div>
        </div>
        <div className="mt-1.5 h-2 rounded-full" style={{ background: `linear-gradient(to right, ${form.color_from}, ${form.color_to})` }} />
      </div>

      {/* Active toggle */}
      <div className="flex items-center justify-between py-0.5">
        <span className="text-sm text-white/70">Visible on page</span>
        <button
          onClick={() => set('active', !form.active)}
          className={`w-11 h-6 rounded-full transition-all duration-200 relative ${form.active ? 'bg-green-500' : 'bg-white/15'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${form.active ? 'left-[22px]' : 'left-0.5'}`} />
        </button>
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/50 bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] shadow-md"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          {isNew ? 'Add Link' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
