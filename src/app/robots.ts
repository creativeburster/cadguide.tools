import { MetadataRoute } from 'next';

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/cdn-cgi/'],
      },
      // 拦截常见的无用爬虫与消耗资源的分析工具
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'DotBot',
          'BLEXBot',
          'MJ12bot',
          'MegaIndex.ru',
          'DataForSeoBot',
          'Bytespider',
          'PetalBot',
          'Baiduspider'
        ],
        disallow: '/',
      },
      // 显式放行主流 AI 搜索引擎与 LLM 爬虫，增强在生成式搜索引擎 (GEO) 中的数据收录效率
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-Web',
          'PerplexityBot',
          'Google-Extended',
          'cohere-ai',
          'OMgili',
          'YouBot',
          'Applebot-Extended',
          'Meta-ExternalAgent',
          'Amazonbot'
        ],
        allow: '/',
      }
    ],
    sitemap: 'https://cadguide.tools/sitemap.xml',
    host: 'https://cadguide.tools',
  };
}
