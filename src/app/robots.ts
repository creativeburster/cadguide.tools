import { MetadataRoute } from 'next';

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      // 显式放行主流 AI 搜索引擎与 LLM 爬虫，增强在生成式搜索引擎 (GEO) 中的数据收录效率
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web', 'PerplexityBot', 'Google-Extended', 'cohere-ai', 'OMgili'],
        allow: '/',
      }
    ],
    sitemap: 'https://cadguide.tools/sitemap.xml',
    host: 'https://cadguide.tools',
  };
}
