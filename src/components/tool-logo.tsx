'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { LOGO_MANIFEST } from '@/lib/logo-manifest';

interface ToolLogoProps {
  /** Tool slug — used to look up a locally-hosted logo first (preferred). */
  slug?: string;
  /** Original logo URL from the data file (typically a getLogo placeholder). */
  src: string;
  /** Official website URL — used as a fallback to derive a favicon. */
  websiteUrl?: string;
  name: string;
  className?: string;
  /** If true, image will be loaded with eager and fetchpriority high */
  priority?: boolean;
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

function deriveCandidates(slug: string | undefined, src: string, websiteUrl?: string): string[] {
  const candidates: string[] = [];
  if (slug && LOGO_MANIFEST[slug]) {
    candidates.push(`/logos/${LOGO_MANIFEST[slug]}`);
  }
  if (src) candidates.push(src);
  if (websiteUrl) {
    try {
      const host = new URL(websiteUrl).hostname.replace(/^www\./, '');
      candidates.push(`https://icon.horse/icon/${host}`);
      candidates.push(`https://www.google.com/s2/favicons?domain=${host}&sz=128`);
      candidates.push(`https://logo.clearbit.com/${host}?size=200&format=png`);
    } catch {
      /* malformed URL — fall through to placeholder. */
    }
  }
  return candidates;
}

export function ToolLogo({ slug, src, websiteUrl, name, className, priority }: ToolLogoProps) {
  const candidates = useMemo(
    () => deriveCandidates(slug, src, websiteUrl),
    [slug, src, websiteUrl]
  );
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
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-xl',
        className
      )}
    >
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
        // Use <img> instead of next/image because the local logos are a mix of
        // .png/.svg/.ico/.jpg (next/image doesn't support .ico, and SVG needs
        // dangerouslyAllowSVG). All logos are small (4-180KB), and the
        // explicit width/height on the container plus loading="lazy" gives us
        // CLS=0 and on-demand loading. Remote images are optimized via Next.js config.
        <img
          ref={imgRef}
          key={current}
          src={current}
          alt={`${name} CAD software logo`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          width={96}
          height={96}
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
