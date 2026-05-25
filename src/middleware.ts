import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = request.nextUrl.pathname;

  // 301 redirect /licensing/* to /pricing/* to fix SEO cannibalization
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
  matcher: ['/licensing', '/licensing/:path*'],
};
