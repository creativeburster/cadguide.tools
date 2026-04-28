'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ToolLogoProps {
  src: string;
  name: string;
  className?: string;
}

export function ToolLogo({ src, name, className }: ToolLogoProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const gradients = [
    'from-indigo-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-orange-600',
    'from-amber-500 to-yellow-600',
  ];
  
  const getGradient = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  };

  const showPlaceholder = error || !src || !loaded;

  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden rounded-xl", className)}>
      {/* Enhanced Placeholder - Always present as background if not loaded */}
      {showPlaceholder && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center text-white font-black text-xs uppercase tracking-widest bg-gradient-to-br shadow-inner z-10",
          getGradient(name)
        )}>
          <span className="drop-shadow-lg scale-125">{initials}</span>
        </div>
      )}

      {/* Actual Image - Only visible when fully loaded and no error */}
      {src && !error && (
        <img
          src={src}
          alt={name}
          className={cn(
            "max-w-full max-h-full object-contain p-2 transition-opacity duration-300 bg-white w-full h-full",
            loaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}

