import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import FlexlmDebuggerClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Network License Connection & TCP Port Diagnostic Script Generator',
  description: 'Generate pure-ASCII Windows PowerShell DNS, environment variable, and TCP port connectivity scripts to diagnose network license server connection timeouts.',
  path: '/toolbox/flexlm-error-15-debugger',
});

export default function FlexlmDebuggerPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'License Connection Troubleshooter', path: '/toolbox/flexlm-error-15-debugger' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              TCP Connectivity Diagnostics
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Network License <span className="text-blue-400">Connection</span> Troubleshooter
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Generate pure-ASCII PowerShell DNS, port reachability, and firewall check scripts for your network license server.
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12">
          <FlexlmDebuggerClient />
          <ToolboxEngineeringGuide slug="flexlm-error-15-debugger" />
        </section>
      </main>
    </>
  );
}
