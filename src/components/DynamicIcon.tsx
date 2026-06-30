import * as LucideIcons from 'lucide-react';
import { Link as LinkIcon, type LucideIcon } from 'lucide-react';

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function DynamicIcon({ name, size = 20, className }: DynamicIconProps) {
  const IconComponent = (LucideIcons as unknown as Record<string, LucideIcon>)[name] as LucideIcon | undefined;
  if (!IconComponent) return <LinkIcon size={size} className={className} />;
  return <IconComponent size={size} className={className} />;
}
