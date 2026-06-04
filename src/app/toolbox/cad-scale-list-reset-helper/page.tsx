import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import CadScaleListResetClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'CAD Plotting Scale List Reset LISP Automation Helper | CADGuide.tools',
  description:
    '在线编写重置 CAD 图纸自定义比例尺别名臃肿 (Scale List) 的 AutoLISP 宏脚本。清除无效视口参照比例字典，解决保存图纸卡顿、无法写外块和开图假死问题。',
  path: '/toolbox/cad-scale-list-reset-helper',
});

export default function CadScaleListResetPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'CAD Scale List Reset Helper', path: '/toolbox/cad-scale-list-reset-helper' },
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
              CAD Performance & Annotation Optimizer
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              CAD <span className="text-blue-400">视口比例尺重置与清理器</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              解决由于外部参照 (Xref) 循环嵌套导入的上千个垃圾比例尺导致的复制卡顿。一键生成重置默认值并按需重建常用标准比例的 LISP 清理程序。
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <CadScaleListResetClient />
        </section>
      </main>
    </>
  );
}
