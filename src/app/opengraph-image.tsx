import { ImageResponse } from 'next/og';

// `opengraph-image` route handlers are statically optimized by default —
// see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#good-to-know.
// The previous combination of `dynamic = 'force-static'` + `runtime = 'edge'`
// was logged at build time as "currently incompatible". Removing both leaves
// the default static optimization in place and silences that warning.

export const alt = 'CADTools.cc - The Ultimate CAD Software Directory';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              background: '#2563eb',
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '40px',
              fontWeight: '900',
            }}
          >
            CT
          </div>
          <div
            style={{
              color: 'white',
              fontSize: '64px',
              fontWeight: '900',
              letterSpacing: '-2px',
            }}
          >
            CADTools.cc
          </div>
        </div>
        
        <div
          style={{
            color: '#94a3b8',
            fontSize: '36px',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: '1.4',
          }}
        >
          Compare 175+ CAD, BIM & Engineering Tools. 
          Unbiased Reviews, Real Pricing & Technical Data.
        </div>

        <div
          style={{
            display: 'flex',
            gap: '30px',
            marginTop: '60px',
          }}
        >
          {['2D Drafting', '3D Modeling', 'BIM', 'CAE/CAM'].map((label) => (
            <div
              key={label}
              style={{
                background: '#1e293b',
                border: '2px solid #334155',
                color: '#3b82f6',
                padding: '12px 24px',
                borderRadius: '50px',
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
