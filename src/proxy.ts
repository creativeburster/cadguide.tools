import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 拦截常见的无用爬虫与消耗资源的商业分析工具
const BLOCKED_USER_AGENTS = [
  'ahrefsbot',
  'semrushbot',
  'dotbot',
  'blexbot',
  'mj12bot',
  'megaindex',
  'dataforseobot',
  'bytespider',
  'petalbot',
  'baiduspider'
];

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
  // 1. 拦截垃圾爬虫
  const userAgent = request.headers.get('user-agent') || '';
  const lowerUserAgent = userAgent.toLowerCase();
  const isBlocked = BLOCKED_USER_AGENTS.some(ua => lowerUserAgent.includes(ua));

  if (isBlocked) {
    return new NextResponse('Access Denied: Your bot is blocked to conserve server resources.', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  const url = request.nextUrl.clone();
  const pathname = request.nextUrl.pathname;

  // 2. 路由重定向逻辑
  // Redirect /guides/articles/* to /guides/* (route simplification, 301)
  if (pathname.startsWith('/guides/articles/')) {
    const slug = pathname.slice('/guides/articles/'.length);
    url.pathname = `/guides/${slug}`;
    return NextResponse.redirect(url, 301);
  }

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

// 合并 matcher：覆盖所有路径（除了静态资源），以便触发爬虫拦截，同时也能触发重定向
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
