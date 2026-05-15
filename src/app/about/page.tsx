import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = pageMetadata({
  title: 'About CADTools.cc — Independent CAD Software Reviews',
  description:
    'CADTools.cc is an independent, vendor-neutral directory of CAD, BIM, CAE/CAM, and EDA software. Learn how we evaluate, score, and review tools.',
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
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Why CADTools.cc?</h2>
          <p>
            The CAD software market is fragmented, expensive, and often confusing. With hundreds of options ranging from free open-source tools to enterprise-level PLM suites, professionals often struggle to compare features, pricing, and real-world performance objectively.
          </p>
          <p>
            <strong>CADTools.cc</strong> was founded to bridge this gap. We provide a structured, data-driven directory that allows you to filter software by operating system, industry, pricing model, and core features.
          </p>

          <div className="grid md:grid-cols-3 gap-8 my-16 not-prose">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center">
              <div className="text-3xl mb-4 text-blue-600">📊</div>
              <h3 className="font-bold text-slate-900 mb-2">Neutral Data</h3>
              <p className="text-sm text-slate-600">We don't accept paid rankings. Our scores are based on technical specs and community feedback.</p>
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

          <h2 className="text-3xl font-bold text-slate-900 mb-8 mt-16">Our Philosophy</h2>
          <p>
            We believe that software should be a tool that empowers your creativity, not a barrier. Whether you are a student looking for a free alternative to AutoCAD or a large enterprise coordinating a multi-billion dollar BIM project, we are here to provide the insights you need.
          </p>
          
          <div className="bg-blue-600 text-white p-12 rounded-3xl mt-16 shadow-2xl shadow-blue-200">
            <h3 className="text-2xl font-bold mb-4 text-white">Join Our Community</h3>
            <p className="text-blue-100 mb-0 leading-relaxed">
              CADTools.cc is a growing community. We invite vendors and users to contribute to our database to ensure the information remains the most accurate in the industry.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
