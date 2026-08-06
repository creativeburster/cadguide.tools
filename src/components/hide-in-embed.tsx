'use client';

import { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function HideInEmbedInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inEmbed = pathname?.startsWith('/embed') || searchParams?.get('embed') === '1';
  if (inEmbed) return null;
  return <>{children}</>;
}

/** Hides site chrome (navbar/footer/notices) when the page is served inside an embed iframe. */
export function HideInEmbed({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <HideInEmbedInner>{children}</HideInEmbedInner>
    </Suspense>
  );
}
