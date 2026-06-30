import type { FontOption } from '../types';

export const fontOptions: FontOption[] = [
  // Modern Sans-Serif
  { id: 'inter', name: 'Inter', family: "'Inter', sans-serif", weight: '300;400;500;600;700;800' },
  { id: 'dm-sans', name: 'DM Sans', family: "'DM Sans', sans-serif", weight: '300;400;500;600;700' },
  { id: 'outfit', name: 'Outfit', family: "'Outfit', sans-serif", weight: '300;400;500;600;700;800' },
  { id: 'space-grotesk', name: 'Space Grotesk', family: "'Space Grotesk', sans-serif", weight: '300;400;500;600;700' },
  { id: 'plus-jakarta', name: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans', sans-serif", weight: '300;400;500;600;700;800' },
  { id: 'syne', name: 'Syne', family: "'Syne', sans-serif", weight: '400;500;600;700;800' },
  { id: 'poppins', name: 'Poppins', family: "'Poppins', sans-serif", weight: '300;400;500;600;700;800;900' },
  { id: 'raleway', name: 'Raleway', family: "'Raleway', sans-serif", weight: '300;400;500;600;700;800;900' },
  { id: 'nunito', name: 'Nunito', family: "'Nunito', sans-serif", weight: '300;400;500;600;700;800;900' },
  { id: 'josefin', name: 'Josefin Sans', family: "'Josefin Sans', sans-serif", weight: '100;200;300;400;500;600;700' },
  { id: 'rubik', name: 'Rubik', family: "'Rubik', sans-serif", weight: '300;400;500;600;700;800;900' },
  { id: 'lexend', name: 'Lexend', family: "'Lexend', sans-serif", weight: '300;400;500;600;700;800;900' },
  { id: 'source-sans', name: 'Source Sans Pro', family: "'Source Sans Pro', sans-serif", weight: '300;400;600;700;900' },
  { id: 'quicksand', name: 'Quicksand', family: "'Quicksand', sans-serif", weight: '300;400;500;600;700' },
  
  // Premium Serif
  { id: 'playfair', name: 'Playfair Display', family: "'Playfair Display', serif", weight: '400;500;600;700;800;900' },
  { id: 'cormorant', name: 'Cormorant Garamond', family: "'Cormorant Garamond', serif", weight: '300;400;500;600;700' },
  { id: 'lora', name: 'Lora', family: "'Lora', serif", weight: '400;500;600;700' },
  { id: 'merriweather', name: 'Merriweather', family: "'Merriweather', serif", weight: '300;400;700;900' },
  { id: 'crimson', name: 'Crimson Text', family: "'Crimson Text', serif", weight: '400;600;700' },
  { id: 'ebgaramond', name: 'EB Garamond', family: "'EB Garamond', serif", weight: '400;500;600;700;800' },
  { id: 'libre-baskerville', name: 'Libre Baskerville', family: "'Libre Baskerville', serif", weight: '400;700' },
  
  // Display / Modern Chic
  { id: 'abril', name: 'Abril Fatface', family: "'Abril Fatface', serif", weight: '400' },
  { id: 'fredoka', name: 'Fredoka', family: "'Fredoka', sans-serif", weight: '300;400;500;600;700' },
  { id: 'rochester', name: 'Rochester', family: "'Rochester', serif", weight: '400' },
  { id: 'bebas', name: 'Bebas Neue', family: "'Bebas Neue', sans-serif", weight: '400' },
  { id: 'oswald', name: 'Oswald', family: "'Oswald', sans-serif", weight: '200;300;400;500;600;700' },
  { id: 'anton', name: 'Anton', family: "'Anton', sans-serif", weight: '400' },
  { id: 'righteous', name: 'Righteous', family: "'Righteous', sans-serif", weight: '400' },
  { id: 'pacifico', name: 'Pacifico', family: "'Pacifico', serif", weight: '400' },
  
  // Elegant & Luxury
  { id: 'bodoni', name: 'Bodoni Moda', family: "'Bodoni Moda', serif", weight: '400;500;600;700;800;900' },
  { id: 'yeseva', name: 'Yeseva One', family: "'Yeseva One', serif", weight: '400' },
  { id: 'cinzel', name: 'Cinzel', family: "'Cinzel', serif", weight: '400;600;700;800;900' },
  { id: 'tangerine', name: 'Tangerine', family: "'Tangerine', serif", weight: '400;700' },
  { id: 'dancing', name: 'Dancing Script', family: "'Dancing Script', serif", weight: '400;500;600;700' },
  { id: 'great-vibes', name: 'Great Vibes', family: "'Great Vibes', serif", weight: '400' },
  
  // Geometric / Tech
  { id: 'montserrat', name: 'Montserrat', family: "'Montserrat', sans-serif", weight: '100;300;400;500;600;700;800;900' },
  { id: 'roboto', name: 'Roboto', family: "'Roboto', sans-serif", weight: '100;300;400;500;700;900' },
  { id: 'open-sans', name: 'Open Sans', family: "'Open Sans', sans-serif", weight: '300;400;600;700;800' },
  { id: 'work-sans', name: 'Work Sans', family: "'Work Sans', sans-serif", weight: '100;300;400;500;600;700;800;900' },
  { id: 'varela', name: 'Varela Round', family: "'Varela Round', sans-serif", weight: '400' },
  
  // Playful
  { id: 'baloo', name: 'Baloo 2', family: "'Baloo 2', sans-serif", weight: '400;500;600;700;800' },
  { id: 'mulish', name: 'Mulish', family: "'Mulish', sans-serif", weight: '300;400;500;600;700;800;900' },
  { id: 'ubuntu', name: 'Ubuntu', family: "'Ubuntu', sans-serif", weight: '300;400;500;700' },
  { id: 'comfortaa', name: 'Comfortaa', family: "'Comfortaa', sans-serif", weight: '300;400;700' },
];

export function getFont(id: string): FontOption {
  return fontOptions.find((f) => f.id === id) ?? fontOptions[0];
}

export function getFontGoogleUrl(ids: string[]): string {
  const selected = fontOptions.filter((f) => ids.includes(f.id));
  if (selected.length === 0) return '';
  const families = selected
    .map((f) => `family=${encodeURIComponent(f.name.replace(/ /g, '+'))}:wght@${f.weight}`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
