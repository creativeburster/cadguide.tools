import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import AcadPgpEditorClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'AutoCAD PGP Command Alias Editor & Compiler Online | CADGuide.tools',
  description:
    '在线编辑, 修改和编译 AutoCAD acad.pgp 或浩辰/中望 CAD 别名文件. 提供本地解析, 重复快捷键冲突校验以及一键打包下载. 所有数据均在浏览器本地安全运行, 不上传服务器. ',
  path: '/toolbox/acad-pgp-alias-editor',
});

export default function AcadPgpEditorPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'ACAD PGP Alias Editor', path: '/toolbox/acad-pgp-alias-editor' },
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
              CAD Configuration & Deployment Helper
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              AutoCAD <span className="text-blue-400">PGP 快捷键别名编辑器</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              在线上传并解析本地 acad.pgp / gcad.pgp 配置文件. 实时冲突红字警告, 轻松增删改, 并一键编译下载纯净的 PGP 文本. 
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <AcadPgpEditorClient />
        </section>
      </main>
    </>
);
}
