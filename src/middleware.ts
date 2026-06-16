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

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const lowerUserAgent = userAgent.toLowerCase();

  // 检查是否包含被拦截的 UA 关键字
  const isBlocked = BLOCKED_USER_AGENTS.some(ua => lowerUserAgent.includes(ua));

  if (isBlocked) {
    // 拦截垃圾爬虫，直接返回 403 Forbidden，阻断请求进入后端引擎，节省算力和流量
    return new NextResponse('Access Denied: Your bot is blocked to conserve server resources.', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  return NextResponse.next();
}

// 仅对实际的页面路由和 API 执行拦截，跳过静态资源以节省 Middleware 的调用次数
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (SEO files)
     * - \.(svg|png|jpg|jpeg|gif|webp)$ (images)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
