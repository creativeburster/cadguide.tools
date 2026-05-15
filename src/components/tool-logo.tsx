'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ToolLogoProps {
  /** Original logo URL from the data file (typically a ui-avatars placeholder). */
  src: string;
  /** Official website URL. Used to fetch a real favicon/logo when available. */
  websiteUrl?: string;
  name: string;
  className?: string;
}

const gradients = [
  'from-indigo-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-orange-600',
  'from-amber-500 to-yellow-600',
];

function pickGradient(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

function deriveCandidates(src: string, websiteUrl?: string): string[] {
  const candidates: string[] = [];
  if (websiteUrl) {
    try {
      const host = new URL(websiteUrl).hostname.replace(/^www\./, '');
      // icon.horse returns high-res favicons/logos when available (free, no key).
      candidates.push(`https://icon.horse/icon/${host}`);
      // Google's s2 service is a rock-solid fallback that always returns a 200.
      candidates.push(`https://www.google.com/s2/favicons?domain=${host}&sz=128`);
    } catch {
      /* malformed URL — fall through to placeholder. */
    }
  }
  if (src) candidates.push(src);
  return candidates;
}

export function ToolLogo({ src, websiteUrl, name, className }: ToolLogoProps) {
  const candidates = useMemo(() => deriveCandidates(src, websiteUrl), [src, websiteUrl]);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // React's onLoad does NOT fire if the image was already in cache by the time
  // the element mounts. Check `complete` once after each src change so the
  // placeholder doesn't get stuck on top of an already-rendered image.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [index, candidates]);

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const current = candidates[index];
  const exhausted = !current;
  const showPlaceholder = exhausted || !loaded;

  return (
    <div className={cn('relative flex items-center justify-center overflow-hidden rounded-xl', className)}>
      {showPlaceholder && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center text-white font-black text-xs uppercase tracking-widest bg-gradient-to-br shadow-inner z-10',
            pickGradient(name)
          )}
        >
          <span className="drop-shadow-lg scale-125">{initials}</span>
        </div>
      )}

      {current && (
        <img
          ref={imgRef}
          key={current}
          src={current}
          alt={name}
          className={cn(
            'max-w-full max-h-full object-contain p-2 transition-opacity duration-300 bg-white w-full h-full',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setIndex((i) => i + 1);
          }}
        />
      )}
    </div>
  );
}
