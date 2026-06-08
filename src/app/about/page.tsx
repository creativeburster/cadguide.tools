import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import { RelatedTools } from '@/components/related-tools';

export const metadata: Metadata = pageMetadata({
  title: 'About CADGuide.tools — Independent CAD Software Reviews',
  description:
    'CADGuide.tools is an independent, vendor-neutral directory of CAD, BIM, CAE/CAM, and EDA software. Learn how we evaluate, score, and review tools.',
  path: '/about',
});

export default function AboutPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <AboutBody />
    </>
  );
}

function AboutBody() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="max-w-[1000px] mx-auto px-6 md:px-12 relative z-10 text-center">
          <h1 className="text-5xl font-black mb-6 tracking-tight">Independent. Objective. <span className="text-blue-400">Reliable.</span></h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            Our mission is to help every architect, engineer, and designer find the perfect software without the marketing noise.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 max-w-[1000px] mx-auto px-6 md:px-12">
        <div className="prose prose-slate lg:prose-xl max-w-none">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Why CADGuide.tools?</h2>
          <p>
            The CAD software market is fragmented, expensive, and often confusing. With hundreds of options ranging from free open-source tools to enterprise-level PLM suites, professionals often struggle to compare features, pricing, and real-world performance objectively.
          </p>
          <p>
            <strong>CADGuide.tools</strong> was founded to bridge this gap. We provide a structured, data-driven directory that allows you to filter software by operating system, industry, pricing model, and core features.
          </p>

          <div className="grid md:grid-cols-3 gap-8 my-16 not-prose">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center">
              <div className="text-3xl mb-4 text-blue-600">📊</div>
              <h3 className="font-bold text-slate-900 mb-2">Neutral Data</h3>
              <p className="text-sm text-slate-600">We don&apos;t accept paid rankings. Our scores are based on technical specs and community feedback.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center">
              <div className="text-3xl mb-4 text-blue-600">🔍</div>
              <h3 className="font-bold text-slate-900 mb-2">Deep Faceting</h3>
              <p className="text-sm text-slate-600">Filter by OS, licensing (perpetual vs sub), and specific industries like AEC or Aero.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center">
              <div className="text-3xl mb-4 text-blue-600">⚡</div>
              <h3 className="font-bold text-slate-900 mb-2">Fast Discovery</h3>
              <p className="text-sm text-slate-600">Find the right tool in 60 seconds using our Smart Matchmaker algorithm.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-8 mt-16">Our Scoring & Evaluation Methodology</h2>
          <p>
            To eliminate bias and avoid the pay-to-play rankings that plague many review platforms, CADGuide.tools utilizes a strict, multi-dimensional scoring rubric. Every software listed on our platform receives an <strong>Expert Score (from 1.0 to 5.0)</strong>, calculated based on the following weights:
          </p>
          
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 my-10 not-prose">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-2">
                  <span>🛠️ Feature Coverage & Ecosystem</span>
                  <span>40%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '40%' }}></div>
                </div>
                <span className="text-xs text-slate-500 block mt-1">Native format support (DWG, DXF, STEP, IFC), layout flexibility, and OS compatibility.</span>
              </div>
              
              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-2">
                  <span>💰 Pricing Transparency & Licensing Value</span>
                  <span>30%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '30%' }}></div>
                </div>
                <span className="text-xs text-slate-500 block mt-1">Availability of clear pricing, perpetual licensing options, free trials, and education versions.</span>
              </div>
              
              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-2">
                  <span>⚙️ Performance & Stability</span>
                  <span>20%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '20%' }}></div>
                </div>
                <span className="text-xs text-slate-500 block mt-1">GPU/hardware acceleration, post-processor stability, and memory efficiency under heavy models.</span>
              </div>
              
              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-2">
                  <span>💬 Professional User Sentiment</span>
                  <span>10%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '10%' }}></div>
                </div>
                <span className="text-xs text-slate-500 block mt-1">Aggregated verified reviews from engineering forums, CAD communities, and industry veterans.</span>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-4">Human Editorial Review</h3>
          <p>
            While our scoring system is backed by structured technical databases, all narrative reviews, pros &amp; cons, and 
            industry comparisons are curated, written, and double-checked by <strong>CAD specialists and engineers</strong>. 
            We actively monitor software updates and coordinate with developer communities to keep file format compatibilities, 
            API features, and licensing options perfectly up to date.
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mb-8 mt-16">Our Philosophy</h2>
          <p>
            We believe that software should be a tool that empowers your creativity, not a barrier. Whether you are a student looking for a free alternative to AutoCAD or a large enterprise coordinating a multi-billion dollar BIM project, we are here to provide the insights you need.
          </p>
          
          <RelatedTools />
        </div>
      </section>
    </main>
  );
}
