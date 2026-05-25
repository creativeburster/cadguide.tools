import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = request.nextUrl.pathname;

  // Direct redirects for free and open-source models (highest priority canonicals)
  if (pathname === '/pricing/free' || pathname === '/licensing/free') {
    url.pathname = '/free';
    return NextResponse.redirect(url, 301);
  }
  if (pathname === '/pricing/open-source' || pathname === '/licensing/open-source') {
    url.pathname = '/open-source';
    return NextResponse.redirect(url, 301);
  }

  // 301 redirect remaining /licensing/* to /pricing/* to fix SEO cannibalization
  if (pathname.startsWith('/licensing')) {
    if (pathname === '/licensing') {
      url.pathname = '/pricing';
      return NextResponse.redirect(url, 301);
    }
    if (pathname.startsWith('/licensing/')) {
      url.pathname = pathname.replace('/licensing', '/pricing');
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/licensing', '/licensing/:path*', '/pricing/free', '/pricing/open-source'],
};
