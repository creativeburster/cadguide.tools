import { ImageResponse } from 'next/og';
import { tools, categories } from '@/lib/data';
import { pricingSummary } from '@/lib/seo';

// Image metadata
export const alt = 'CADTools.cc Tool Review';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Pre-generate one OG image per tool at build time.
export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);

  // Fallback: minimal branded card so unknown slugs don't crash the build.
  if (!tool) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: 'white',
            fontSize: 72,
            fontWeight: 900,
          }}
        >
          CADTools.cc
        </div>
      ),
      { ...size },
    );
  }

  const category = categories.find((c) => c.id === tool.category_id);
  const categoryName = category?.name ?? 'CAD';
  const price = pricingSummary(tool);
  const score = tool.score?.toFixed(1) ?? '—';
  const platforms = tool.platforms.join(' / ');

  // Long tool names overflow the hero, so shrink the font in steps. Using
  // discrete tiers (instead of an `auto-fit` approach) keeps layout stable
  // and avoids edge cases where `next/og`'s flexbox isn't 100% spec-faithful.
  const nameFontSize =
    tool.name.length <= 12 ? 124 : tool.name.length <= 20 ? 96 : tool.name.length <= 28 ? 80 : 64;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0a192f 0%, #0f172a 50%, #1e293b 100%)',
          padding: '64px 80px',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Header — CADTools.cc wordmark + category chip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 900,
                color: 'white',
              }}
            >
              CT
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px' }}>
              CADTools.cc
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 24px',
              borderRadius: 999,
              background: 'rgba(59, 130, 246, 0.18)',
              border: '2px solid rgba(96, 165, 250, 0.45)',
              color: '#93c5fd',
              fontSize: 22,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {categoryName}
          </div>
        </div>

        {/* Hero — tool name + tagline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            marginTop: 48,
          }}
        >
          <div
            style={{
              fontSize: nameFontSize,
              fontWeight: 900,
              letterSpacing: '-2px',
              lineHeight: 1.05,
              color: 'white',
              maxWidth: '95%',
            }}
          >
            {tool.name}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 28,
              color: '#cbd5e1',
              maxWidth: '95%',
              lineHeight: 1.3,
            }}
          >
            {(tool.short_desc || tool.description || '').slice(0, 140)}
          </div>
        </div>

        {/* Footer — score / pricing / platforms */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginTop: 24,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 26px',
              borderRadius: 16,
              background: '#fbbf24',
              color: '#1f2937',
              fontSize: 28,
              fontWeight: 900,
            }}
          >
            {/* Stylised star — built from a rotated/translated square so we
                don't depend on Unicode glyphs that `next/og` can't fetch
                from the dynamic-font CDN inside sandboxed CI environments. */}
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '14px solid transparent',
                borderRight: '14px solid transparent',
                borderBottom: '20px solid #1f2937',
              }}
            />
            {score} / 5
          </div>
          <div
            style={{
              padding: '14px 26px',
              borderRadius: 16,
              background: 'rgba(255,255,255,0.10)',
              border: '2px solid rgba(255,255,255,0.18)',
              fontSize: 24,
              fontWeight: 700,
              color: 'white',
            }}
          >
            {price}
          </div>
          <div
            style={{
              padding: '14px 26px',
              borderRadius: 16,
              background: 'rgba(255,255,255,0.10)',
              border: '2px solid rgba(255,255,255,0.18)',
              fontSize: 24,
              fontWeight: 700,
              color: 'white',
            }}
          >
            {platforms}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
