import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = request.nextUrl.pathname;

  // Root-level legacy pricing paths redirect to their modern canonicals
  if (pathname === '/forever') {
    url.pathname = '/pricing/perpetual';
    return NextResponse.redirect(url, 301);
  }
  if (pathname === '/mo' || pathname === '/3yr') {
    url.pathname = '/pricing/subscription';
    return NextResponse.redirect(url, 301);
  }

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
  matcher: [
    '/licensing',
    '/licensing/:path*',
    '/pricing/free',
    '/pricing/open-source',
    '/forever',
    '/mo',
    '/3yr',
  ],
};
