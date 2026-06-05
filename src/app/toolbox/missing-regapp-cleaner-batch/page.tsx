import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import MissingRegappCleanerClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'AutoCAD Massive Regapp Bloat LISP Cleaner Batch Generator | CADGuide.tools',
  description:
    '在线生成批量清理 CAD 注册应用 (Regapp) 臃肿残留的 AutoLISP 宏代码与 .scr 批量开图控制脚本. 帮助图纸体积缩水 80%, 彻底解决视口卡顿和图纸打开慢的问题. ',
  path: '/toolbox/missing-regapp-cleaner-batch',
});

export default function MissingRegappCleanerPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Regapp Cleaner Batch Generator', path: '/toolbox/missing-regapp-cleaner-batch' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden print:hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              CAD Performance Tuning Wizard
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Regapp <span className="text-blue-400">图纸注册应用瘦身脚本生成器</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              解决 CAD 图纸莫名增大, 视口平移卡死克星. 自定义生成静默清理 Regapp 垃圾的 AutoLISP 插件, 并获取一键全自动扫描多图批量清理脚本. 
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <MissingRegappCleanerClient />
        </section>
      </main>
    </>
);
}
