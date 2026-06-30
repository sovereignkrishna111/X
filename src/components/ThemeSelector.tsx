import { Check } from 'lucide-react';
import { themes } from '../data/themes';
import { fontOptions } from '../data/fonts';
import { cardRadiusOptions, avatarShapeOptions, bgOverlayOptions } from '../data/shapes';

interface ThemeSelectorProps {
  currentTheme: string;
  currentFont: string;
  currentCardRadius?: string;
  currentAvatarShape?: string;
  currentBgOverlay?: string;
  onThemeChange: (id: string) => void;
  onFontChange: (id: string) => void;
  onCardRadiusChange?: (id: string) => void;
  onAvatarShapeChange?: (id: string) => void;
  onBgOverlayChange?: (id: string) => void;
}

export function ThemeSelector({
  currentTheme, currentFont,
  currentCardRadius = 'pill',
  currentAvatarShape = 'circle',
  currentBgOverlay = 'none',
  onThemeChange, onFontChange,
  onCardRadiusChange, onAvatarShapeChange, onBgOverlayChange,
}: ThemeSelectorProps) {
  return (
    <div className="space-y-5">
      {/* Theme grid */}
      <div>
        <p className="text-xs font-medium text-white/50 mb-2.5 uppercase tracking-wider">Theme</p>
        <div className="grid grid-cols-3 gap-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all duration-200 hover:scale-[1.04] ${
                currentTheme === theme.id
                  ? 'border-white/80 shadow-lg shadow-white/10 scale-[1.02]'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div className={`absolute inset-0 ${theme.preview}`} />
              <div className="absolute inset-0 flex flex-col items-end justify-end p-1.5">
                <span className="text-white/90 text-[9px] font-semibold drop-shadow-md bg-black/30 px-1.5 py-0.5 rounded-md">
                  {theme.name}
                </span>
              </div>
              <div className="absolute top-1.5 left-1.5 text-sm">{theme.emoji}</div>
              {currentTheme === theme.id && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow">
                  <Check size={10} className="text-black" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Font selector */}
      <div>
        <p className="text-xs font-medium text-white/50 mb-2.5 uppercase tracking-wider">Font</p>
        <div className="grid grid-cols-2 gap-1.5">
          {fontOptions.map((font) => (
            <button
              key={font.id}
              onClick={() => onFontChange(font.id)}
              className={`relative px-3 py-2.5 rounded-xl text-left border transition-all duration-200 ${
                currentFont === font.id
                  ? 'bg-white/20 border-white/40 shadow'
                  : 'bg-white/5 border-white/8 hover:bg-white/10 hover:border-white/20'
              }`}
              style={{ fontFamily: font.family }}
            >
              <p className="text-white text-xs font-medium">{font.name}</p>
              <p className="text-white/40 text-[10px] mt-0.5" style={{ fontFamily: font.family }}>
                Aa Bb Cc
              </p>
              {currentFont === font.id && (
                <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
                  <Check size={8} className="text-black" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Card Radius */}
      {onCardRadiusChange && (
        <div>
          <p className="text-xs font-medium text-white/50 mb-2.5 uppercase tracking-wider">Card Shape</p>
          <div className="grid grid-cols-5 gap-1.5">
            {cardRadiusOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onCardRadiusChange(opt.id)}
                className={`relative py-3 rounded-xl border transition-all duration-200 flex flex-col items-center gap-1 ${
                  currentCardRadius === opt.id
                    ? 'bg-white/15 border-white/40 shadow'
                    : 'bg-white/5 border-white/8 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <span className="text-lg">{opt.icon}</span>
                <span className="text-white/70 text-[9px] font-medium">{opt.label}</span>
                {currentCardRadius === opt.id && (
                  <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                    <Check size={7} className="text-black" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Avatar Shape */}
      {onAvatarShapeChange && (
        <div>
          <p className="text-xs font-medium text-white/50 mb-2.5 uppercase tracking-wider">Avatar Shape</p>
          <div className="grid grid-cols-3 gap-2">
            {avatarShapeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onAvatarShapeChange(opt.id)}
                className={`relative py-3 rounded-xl border transition-all duration-200 flex flex-col items-center gap-1 ${
                  currentAvatarShape === opt.id
                    ? 'bg-white/15 border-white/40 shadow'
                    : 'bg-white/5 border-white/8 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div
                  className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold"
                  style={{
                    borderRadius: opt.id === 'circle' ? '50%' : opt.id === 'rounded' ? '22px' : '8px'
                  }}
                >
                  A
                </div>
                <span className="text-white/70 text-[10px] font-medium">{opt.label}</span>
                {currentAvatarShape === opt.id && (
                  <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                    <Check size={7} className="text-black" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Background Overlay */}
      {onBgOverlayChange && (
        <div>
          <p className="text-xs font-medium text-white/50 mb-2.5 uppercase tracking-wider">Background Effect</p>
          <div className="grid grid-cols-3 gap-1.5">
            {bgOverlayOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onBgOverlayChange(opt.id)}
                className={`relative py-2.5 rounded-xl border transition-all duration-200 ${
                  currentBgOverlay === opt.id
                    ? 'bg-white/15 border-white/40 shadow'
                    : 'bg-white/5 border-white/8 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <span className="text-white/80 text-xs font-medium">{opt.label}</span>
                {currentBgOverlay === opt.id && (
                  <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                    <Check size={7} className="text-black" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
