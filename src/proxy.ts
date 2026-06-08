import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Cheatsheet/shortcut pages were consolidated under /toolbox. The legacy
// /guides/* twins are 301'd to their /toolbox/* canonicals to retain link
// equity and eliminate duplicate content.
const GUIDES_TO_TOOLBOX_SLUGS = new Set([
  'shortcuts',
  'archicad-shortcuts-sheet',
  'autocad-vs-gstarcad-shortcuts',
  'autocad-vs-zwcad-shortcuts',
  'bricscad-shortcuts-sheet',
  'catia-shortcuts-sheet',
  'creo-shortcuts-sheet',
  'draftsight-shortcuts-sheet',
  'freecad-shortcuts-sheet',
  'fusion360-shortcuts-sheet',
  'inventor-shortcuts-sheet',
  'microstation-shortcuts-sheet',
  'revit-shortcuts-sheet',
  'rhino-shortcuts-sheet',
  'sketchup-shortcuts-sheet',
  'solidworks-shortcuts-sheet',
  'vectorworks-shortcuts-sheet',
]);

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = request.nextUrl.pathname;

  // Legacy /guides cheatsheet pages → /toolbox canonicals (301)
  if (pathname.startsWith('/guides/')) {
    const slug = pathname.slice('/guides/'.length);
    if (GUIDES_TO_TOOLBOX_SLUGS.has(slug)) {
      url.pathname = `/toolbox/${slug}`;
      return NextResponse.redirect(url, 301);
    }
  }

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
    '/guides/:path*',
    '/licensing',
    '/licensing/:path*',
    '/pricing/free',
    '/pricing/open-source',
    '/forever',
    '/mo',
    '/3yr',
  ],
};
