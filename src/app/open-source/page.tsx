import Link from 'next/link';
import type { Metadata } from 'next';
import { openSourceTools } from '@/lib/seo-content';
import type { Tool } from '@/lib/data';
import { pageMetadata, siteBreadcrumbLd, SITE_URL } from '@/lib/seo';
import { ToolLogo } from '@/components/tool-logo';
import { FoldingList } from '@/components/folding-list';
import React from 'react';

const YEAR = 2026;

const TITLE = `Best Open-Source CAD Software in ${YEAR}`;
const DESCRIPTION =
  'The complete list of open-source CAD, BIM, CAE, and EDA software. Forever free, source-available, community-supported — ranked by score.';

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/open-source',
  ogType: 'article',
});

function pricingLabel(t: Tool): string {
  if (t.pricing_type === 'Open Source') return 'Open Source';
  return t.pricing_type;
}

const FAQ = [
  {
    q: 'What counts as open-source CAD?',
    a: 'The full source code is publicly available under an OSI-approved licence (GPL, MPL, MIT, BSD, etc.), with no commercial-use restriction. Source-available but not OSI-approved tools are excluded.',
  },
  {
    q: 'Best open-source CAD for mechanical design?',
    a: 'FreeCAD is the production-grade choice for parametric mechanical CAD. SolveSpace is a lighter alternative for small constraint-based assemblies.',
  },
  {
    q: 'Best open-source PCB / EDA?',
    a: 'KiCad is the gold standard — a serious production tool used by professional hardware companies. Far more capable than its older "hobbyist" reputation.',
  },
  {
    q: 'Best open-source BIM?',
    a: 'BlenderBIM (Blender + the BlenderBIM add-on) is the closest thing to open-source BIM in 2026. Native authoring is still dominated by commercial tools but BlenderBIM is rapidly closing the gap.',
  },
];

const TCO_FAQ = [
  {
    q: "How do you calculate the TCO of open-source CAD?",
    a: "True Total Cost of Ownership (TCO) shifts from recurring licensing software fees (OpEx) to engineering personnel capabilities (CapEx). You save 100% on retail seat costs, but should budget for in-house C++/Python developers to maintain custom script wrappers and compile stable internal releases."
  },
  {
    q: "Can I use open-source CAD tools in commercial environments for free?",
    a: "Yes. Top open-source licenses (like GPL or MIT) grant unrestricted rights to use the software for commercial, proprietary design and production engineering without paying any fees or licensing royalties."
  },
  {
    q: "Are there professional support SLAs for open-source engineering software?",
    a: "Yes. While community forums provide volunteer support, global engineering consultancies offer professional, SLA-backed commercial support contracts, custom CAD feature development, and enterprise training paths."
  }
];

const LICENSING_FAQ = [
  {
    q: "What is the difference between copyleft (GPL) and permissive (MIT/BSD) licenses?",
    a: "Copyleft licenses (like the GNU GPL) require that if you modify the CAD software's source code and distribute the modified version, you must also release your modifications under the same open-source license. Permissive licenses (like MIT or BSD) allow you to modify the software and incorporate it into proprietary, closed-source commercial applications with minimal restrictions."
  },
  {
    q: "Does using a GPL-licensed CAD program force me to open-source my proprietary drawing designs?",
    a: "No. The GPL copyleft rules strictly apply to the CAD program's source code compilation and software execution pathways, not to the assets or engineering geometries you design with it. Your private 2D drawings, 3D CAD files, and BIM models remain 100% your proprietary intellectual property."
  },
  {
    q: "Are corporate developers protected against software patent lawsuits under open licenses?",
    a: "Yes. Major modern open-source licenses (including Apache 2.0 and GPL v3) include built-in reciprocal patent grant clauses. Any developer contributing code automatically grants a royalty-free, perpetual patent license to all downstream users, safeguarding enterprises from patent litigation."
  }
];

function itemListLd(list: Tool[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: TITLE,
    description: DESCRIPTION,
    numberOfItems: list.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: list.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/tools/${t.slug}`,
      name: t.name,
    })),
  };
}

function articleLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITLE,
    description: DESCRIPTION,
    mainEntityOfPage: `${SITE_URL}/open-source`,
    publisher: { '@type': 'Organization', name: 'CADGuide.tools', url: SITE_URL },
    datePublished: '2026-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
  };
}

function faqLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

// --- WIDGETS ---

function OpenSourceTcoWidget() {
  return (
    <div className="my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-teal-955 to-indigo-950 text-white border border-teal-900/40 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.08),transparent)] pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-teal-500/20 text-teal-300 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border border-teal-500/30">
            Financial Analysis
          </span>
          <span className="text-xs text-slate-400 font-medium">TCO & Cost-Saving Audit</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-3">
          Zero-License CAD: Financial Benefits & Enterprise TCO Analysis
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl mb-6">
          Open-source CAD represents the ultimate strategy for corporate cost reduction: complete elimination of licensing audits, zero recurring seat rental fees, and permanent ownership of your software assets. In an era where proprietary CAD subscriptions rise by 8-15% annually, switching to open-source modeling bypasses commercial licensing tables entirely.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-6">
          <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold flex items-center justify-center">1</span>
              <h4 className="font-extrabold text-white">OpEx to CapEx Shift</h4>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              You save 100% on retail seat costs, but should budget for in-house C++/Python developers to maintain custom script wrappers, compile stable internal releases, and build localized pipelines.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center">2</span>
              <h4 className="font-extrabold text-white">Compliance Audit Zero</h4>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Open-source platforms eliminate any legal exposure to retroactive software audits, serial registration compliance issues, or user identity logging violations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">3</span>
              <h4 className="font-extrabold text-white">Commercial Support SLAs</h4>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              While community forums provide volunteer support, global engineering consultancies offer professional, SLA-backed commercial support contracts, custom CAD feature development, and enterprise training paths.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OpenSourceLicensingWidget() {
  return (
    <div className="my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white border border-teal-900/40 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.08),transparent)] pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-teal-500/20 text-teal-300 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border border-teal-500/30">
            Legal Compliance
          </span>
          <span className="text-xs text-slate-400 font-medium">GPL & Copyleft Advisory</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-3">
          Solid Modeling Geometry Kernels & Compiler Independence
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl mb-6">
          Unlike proprietary platforms running on closed commercial geometry kernels (such as Siemens Parasolid or Dassault ACIS), most open-source 3D CAD platforms rely on the Open CASCADE Technology (OCCT) engine. Utilizing open kernels secures long-term developer access and protects design offices against proprietary licensing changes:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4 text-slate-300">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <span className="font-bold text-teal-300 block mb-1">GPL Copyleft Rules & Drawing Safety</span>
            Under the GNU General Public License (GPL), any modifications to the CAD system&apos;s core source code must be shared with the community when distributed. However, your local engineering drawings, DWG vectors, and 3D geometric models remain 100% your private property.
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <span className="font-bold text-teal-300 block mb-1">Permissive vs Reciprocal Grants</span>
            While copyleft licenses require sharing core code updates, modern open-source licenses include built-in reciprocal patent grant clauses. Any developer contributing code automatically grants a royalty-free, perpetual patent license to all downstream users, safeguarding enterprises from patent litigation.
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---

export default function OpenSourceCadPage() {
  const list = openSourceTools();
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Open-Source CAD', path: '/open-source' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd(list)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd()) }} />

      <main className="min-h-screen bg-slate-50 pb-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <nav className="text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:underline">Home</Link>{' / '}
            <span className="text-slate-700 font-semibold">Open-Source CAD</span>
          </nav>

          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {TITLE}
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Open-source CAD has matured well beyond the &quot;research project&quot; stigma
              of the 2010s. FreeCAD, KiCad, Blender, LibreCAD, and SolveSpace are all
              production-grade tools running real commercial work in 2026. Below are
              every open-source CAD, BIM, and EDA tool in our catalog (all under
              OSI-approved licences), ranked by expert score.
            </p>
            <p className="mt-3 text-sm text-slate-500">
              Looking at free-as-in-cost (incl. proprietary freemium)?{' '}
              <Link href="/free" className="text-blue-600 hover:underline">Free CAD software</Link>{' '}
              covers the wider list.
            </p>

            {/* Semantic Open-Source Dimension Hub Cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="#tco-economics" className="block p-5 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all">
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-200">
                  Financial Analysis
                </span>
                <h3 className="mt-2 text-base font-bold text-slate-900">Open-Source TCO & Economics →</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Evaluate the total cost of ownership (TCO) of open-source CAD. Compare zero-license seat savings with in-house developer customization and SLA support.
                </p>
              </Link>
              <Link href="#licensing-compliance" className="block p-5 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all">
                <span className="bg-teal-100 text-teal-800 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border border-teal-200">
                  Legal Compliance
                </span>
                <h3 className="mt-2 text-base font-bold text-slate-900">GPL Copyleft & EULA Guide →</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Navigate legal frameworks for copyleft GPL vs permissive MIT licenses. Review commercial usage rights and drawing file privacy compliance rules.
                </p>
              </Link>
            </div>
          </header>

          <FoldingList
            itemType="ol"
            className="space-y-5"
          >
            {list.map((t, i) => (
              <li key={t.slug} className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="flex-shrink-0 text-2xl font-extrabold text-blue-600 w-8 sm:w-10 text-center">{i + 1}.</div>
                  <ToolLogo slug={t.slug} src={t.logo_url} websiteUrl={t.official_url} name={t.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <Link href={`/tools/${t.slug}`} className="text-lg sm:text-xl font-bold text-slate-900 hover:text-blue-600">{t.name}</Link>
                      <span className="text-sm text-slate-500">{pricingLabel(t)} · {t.platforms.join(' / ')}</span>
                    </div>
                    <div className="mt-1 text-sm text-amber-600 font-semibold">★ {t.score.toFixed(1)}/5</div>
                    <p className="mt-3 text-slate-700 leading-relaxed">{t.short_desc}</p>
                  </div>
                </div>
              </li>
            ))}
          </FoldingList>

          {/* TCO & Economics Hub Section */}
          <section id="tco-economics" className="mt-16 pt-10 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
              Open-Source TCO & Economics
            </h2>
            <OpenSourceTcoWidget />
            <div className="mt-8 rounded-2xl bg-white border border-slate-200 p-6">
              <h3 className="font-extrabold text-slate-900 mb-4">Financial & Economic FAQs</h3>
              <dl className="space-y-4">
                {TCO_FAQ.map((f) => (
                  <div key={f.q} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                    <dt className="font-semibold text-slate-900 text-sm sm:text-base">{f.q}</dt>
                    <dd className="mt-2 text-slate-600 text-sm leading-relaxed">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* Licensing & Compliance Hub Section */}
          <section id="licensing-compliance" className="mt-16 pt-10 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-teal-500 to-indigo-600" />
              GPL Copyleft & EULA Compliance
            </h2>
            <OpenSourceLicensingWidget />
            <div className="mt-8 rounded-2xl bg-white border border-slate-200 p-6">
              <h3 className="font-extrabold text-slate-900 mb-4">Legal & Licensing Compliance FAQs</h3>
              <dl className="space-y-4">
                {LICENSING_FAQ.map((f) => (
                  <div key={f.q} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                    <dt className="font-semibold text-slate-900 text-sm sm:text-base">{f.q}</dt>
                    <dd className="mt-2 text-slate-600 text-sm leading-relaxed">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* General FAQ Section */}
          <section className="mt-16 pt-10 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-blue-600" />
              General Frequently Asked Questions
            </h2>
            <div className="rounded-2xl bg-white border border-slate-200 p-6">
              <dl className="space-y-4">
                {FAQ.map((f) => (
                  <div key={f.q} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                    <dt className="font-semibold text-slate-900 text-sm sm:text-base">{f.q}</dt>
                    <dd className="mt-2 text-slate-600 text-sm leading-relaxed">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
