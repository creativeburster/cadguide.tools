import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Award, CheckCircle2, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';
import {
  comparisonPairs,
  parseComparisonPair,
} from '@/lib/seo-content';
import { pageMetadata, siteBreadcrumbLd, SITE_URL } from '@/lib/seo';
import type { Tool } from '@/lib/data';
import { categories } from '@/lib/data';
import { ToolLogo } from '@/components/tool-logo';
import { CompareWidget } from '@/components/compare-widget';

export const dynamicParams = false;

export function generateStaticParams() {
  return comparisonPairs().map(({ pairSlug }) => ({ pair: pairSlug }));
}

const YEAR = 2026;

function pairTitle(a: Tool, b: Tool): string {
  return `${a.name} vs ${b.name}: ${YEAR} Comparison`;
}

function pairDescription(a: Tool, b: Tool): string {
  const aPrice =
    a.starting_price > 0
      ? `from $${a.starting_price}`
      : a.pricing_type.toLowerCase();
  const bPrice =
    b.starting_price > 0
      ? `from $${b.starting_price}`
      : b.pricing_type.toLowerCase();
  return `${a.name} (${aPrice}) vs ${b.name} (${bPrice}). Side-by-side comparison of pricing, platforms, file formats, ratings, and use cases. Pick the right CAD tool for your team in ${YEAR}.`;
}

export async function generateMetadata(
  { params }: { params: Promise<{ pair: string }> },
): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parseComparisonPair(pair);
  if (!parsed) return {};
  const { a, b } = parsed;
  return pageMetadata({
    title: pairTitle(a, b),
    description: pairDescription(a, b),
    path: `/compare/${pair}`,
    ogType: 'article',
  });
}

function pricingCell(t: Tool): string {
  if (t.pricing_type === 'Free') return 'Free';
  if (t.pricing_type === 'Open Source') return 'Open Source';
  if (t.pricing_type === 'Freemium') return 'Freemium';
  if (t.starting_price > 0) return `$${t.starting_price} (${t.pricing_type})`;
  return t.pricing_type;
}

function externalReviewLine(t: Tool): string {
  if (!t.external_ratings || t.external_ratings.length === 0) return '—';
  const total = t.external_ratings.reduce(
    (acc, r) => acc + (r.count ?? 0),
    0,
  );
  const sources = t.external_ratings.map((r) => r.source).join(' / ');
  return `${total.toLocaleString()} reviews on ${sources}`;
}

const CONTRAST_NOTES: Record<string, string> = {
  'autocad-vs-bricscad': "AutoCAD remains the undisputed industry standard with unmatched legacy enterprise adoption. However, BricsCAD is the superior value alternative, offering native LISP in its base package, perpetual licensing, and advanced AI-driven features like 'BIMify' and 'Propagate' that run directly on standard DWG files. For teams transitioning away from Autodesk's subscription lock-in, BricsCAD provides a practically seamless interface with near-zero retraining costs.",
  'fusion-360-vs-solidworks': "SolidWorks is the premium engineering standard for complex machinery and robust parametric design, excelling in large assembly performance and drawings, but comes with high licensing and local hardware requirements. Fusion 360 is the ultimate unified cloud-first platform, combining CAD, CAM, CAE, and PCB design in an affordable subscription. Fusion 360 is ideal for agile startups, prototype machinists, and cloud-first teams, whereas SolidWorks remains the default choice for heavy industrial manufacturing.",
  'archicad-vs-revit': "Revit dominates the US market and enterprise BIM workflows due to its deep integration with Autodesk's ecosystem, robust structural/MEP tools, and widespread multi-disciplinary collaboration. ArchiCAD, on the other hand, is the pioneer of architectural BIM, preferred by European designers for its superior performance on macOS, elegant UI, and ultra-smooth 'BIMcloud' team coordination. ArchiCAD is built specifically for architects, whereas Revit is an all-in-one building engineering suite.",
  'blender-vs-maya': "Maya is the gold standard for Hollywood character animation, complex rigging pipelines, and large VFX studio deployments, backed by robust industry support and custom pipeline tools. Blender is the ultimate open-source marvel, excelling in polygon modeling, rapid sculpting, and independent game dev creation. With its powerful Cycles render engine and active community, Blender is the absolute choice for freelancers, while Maya remains entrenched in high-end studio pipelines.",
  'altium-designer-vs-kicad': "Altium Designer is the undisputed enterprise EDA standard, featuring state-of-the-art multi-board routing, active bill of materials (ActiveBOM) management, and professional high-speed simulation. KiCad has evolved into an incredibly capable open-source powerhouse, perfect for independent designers, startups, and academic researchers. It has zero licensing fees and a massive community, making it highly competitive for all but the most complex multi-layer high-speed RF designs.",
  'lumion-vs-twinmotion': "Lumion is renowned for its speed, simplicity, and massive high-quality asset library, making it the choice for fast-paced commercial architectural renderings. Twinmotion, powered by Unreal Engine, offers superior real-time lighting physics, VR interactivity, and direct synchronization with architectural CAD models. Twinmotion is extremely cost-effective and integrates deeply with Epic Games' ecosystem, while Lumion excels in immediate, presentation-ready deliverables.",
  'bambu-studio-vs-prusaslicer': "PrusaSlicer is the ultimate open-source slicer, offering highly granular print controls, robust G-code scripting, and deep compatibility with almost all custom 3D printers. Bambu Studio, built on top of PrusaSlicer, is tailor-made for Bambu's high-speed ecosystem, providing seamless multi-color printing integration, cloud remote control, and a sleek modern dashboard. For standard multi-vendor tuning, PrusaSlicer is unmatched, whereas Bambu Studio is the default for plug-and-play high-speed printers.",
  'ansys-fluent-vs-comsol-multiphysics': "Ansys Fluent is the world-class industry benchmark for high-speed aerodynamics, complex multi-phase CFD, and advanced combustion simulation, boasting unparalleled parallel solving speed on massive compute clusters. COMSOL Multiphysics excels in coupled multiphysics solving (e.g., electromagnetics with thermal expansion and microfluidics), allowing users to define arbitrary mathematical couplings. Use Fluent for pure aerodynamics and fluid flow; use COMSOL for complex coupled multiphysics research.",
};

function getDynamicEditorialVerdict(a: Tool, b: Tool): string {
  const higherScoreTool = a.score >= b.score ? a : b;
  const lowerScoreTool = a.score >= b.score ? b : a;
  
  const aPriceInfo = a.pricing_type === 'Free' || a.pricing_type === 'Open Source' ? 'free of charge' : `starting at $${a.starting_price}`;
  const bPriceInfo = b.pricing_type === 'Free' || b.pricing_type === 'Open Source' ? 'free of charge' : `starting at $${b.starting_price}`;
  
  return `Comparing ${a.name} and ${b.name} reveals clear strategic tradeoffs. ${higherScoreTool.name} holds the edge in overall design maturity with an expert score of ${higherScoreTool.score.toFixed(1)}/5, compared to ${lowerScoreTool.score.toFixed(1)}/5 for ${lowerScoreTool.name}. Financially, ${a.name} is positioned ${aPriceInfo} while ${b.name} is available ${bPriceInfo}. When deciding between them, teams should prioritize ${higherScoreTool.name} if they require its class-leading industry performance and specialized ${higherScoreTool.pros?.slice(0,2).join(' or ') || 'capabilities'}. Conversely, ${lowerScoreTool.name} remains an excellent selection for users heavily invested in ${lowerScoreTool.platforms.join(' and ')} environments who value its strength in ${lowerScoreTool.pros?.[0] || 'streamlined design workflows'}.`;
}

function getCompareLayoutStyle(a: Tool, b: Tool): {
  archetype: 'drafting' | 'mcad' | 'bim' | 'simulation' | 'creative';
  bodyBg: string;
  accentText: string;
  borderHighlight: string;
  badgeBg: string;
  badgeText: string;
  gradientHeader: string;
  ctaBg: string;
  ctaHoverBg: string;
} {
  const isC1 = a.category_id === 'c1' || b.category_id === 'c1';
  const isBim = a.category_id === 'c3' || b.category_id === 'c3';
  const isCaeEda = a.category_id === 'c5' || b.category_id === 'c5' || a.category_id === 'c6' || b.category_id === 'c6';
  
  const mcadTools = ["solidworks", "fusion-360", "onshape", "autodesk-inventor", "ptc-creo", "siemens-nx", "catia", "freecad", "shapr3d", "solid-edge"];
  const isMcad = mcadTools.includes(a.slug) || mcadTools.includes(b.slug) || a.category_id === 'c2' || b.category_id === 'c2';

  if (isC1) {
    return {
      archetype: 'drafting',
      bodyBg: 'bg-slate-50/70',
      accentText: 'text-slate-700',
      borderHighlight: 'border-slate-200 hover:border-slate-400 focus:border-slate-400',
      badgeBg: 'bg-slate-100 border-slate-200 text-slate-800',
      badgeText: 'text-slate-800',
      gradientHeader: 'from-slate-700 via-slate-800 to-zinc-900',
      ctaBg: 'bg-slate-700 hover:bg-slate-800',
      ctaHoverBg: 'hover:bg-slate-800'
    };
  }
  
  if (isBim) {
    return {
      archetype: 'bim',
      bodyBg: 'bg-zinc-50/70',
      accentText: 'text-emerald-700',
      borderHighlight: 'border-emerald-200 hover:border-emerald-400 focus:border-emerald-400',
      badgeBg: 'bg-emerald-100 border-emerald-200 text-emerald-950',
      badgeText: 'text-emerald-900',
      gradientHeader: 'from-emerald-700 via-emerald-800 to-zinc-900',
      ctaBg: 'bg-emerald-700 hover:bg-emerald-800',
      ctaHoverBg: 'hover:bg-emerald-800'
    };
  }

  if (isMcad) {
    return {
      archetype: 'mcad',
      bodyBg: 'bg-stone-50/70',
      accentText: 'text-amber-700',
      borderHighlight: 'border-amber-200 hover:border-amber-400 focus:border-amber-400',
      badgeBg: 'bg-amber-100 border-amber-200 text-amber-950',
      badgeText: 'text-amber-900',
      gradientHeader: 'from-amber-600 via-amber-700 to-stone-900',
      ctaBg: 'bg-amber-600 hover:bg-amber-700',
      ctaHoverBg: 'hover:bg-amber-700'
    };
  }

  if (isCaeEda) {
    return {
      archetype: 'simulation',
      bodyBg: 'bg-indigo-50/10',
      accentText: 'text-indigo-700',
      borderHighlight: 'border-indigo-200 hover:border-indigo-400 focus:border-indigo-400',
      badgeBg: 'bg-indigo-100 border-indigo-200 text-indigo-950',
      badgeText: 'text-indigo-900',
      gradientHeader: 'from-indigo-700 via-indigo-800 to-violet-900',
      ctaBg: 'bg-indigo-600 hover:bg-indigo-700',
      ctaHoverBg: 'hover:bg-indigo-700'
    };
  }

  return {
    archetype: 'creative',
    bodyBg: 'bg-slate-50/70',
    accentText: 'text-blue-700',
    borderHighlight: 'border-blue-200 hover:border-blue-400 focus:border-blue-400',
    badgeBg: 'bg-blue-100 border-blue-200 text-blue-950',
    badgeText: 'text-blue-900',
    gradientHeader: 'from-blue-600 via-blue-700 to-slate-900',
    ctaBg: 'bg-blue-600 hover:bg-blue-700',
    ctaHoverBg: 'hover:bg-blue-700'
  };
}

function decisionText(a: Tool, b: Tool): { pickA: string; pickB: string } {
  const aFree =
    a.pricing_type === 'Free' || a.pricing_type === 'Open Source';
  const bFree =
    b.pricing_type === 'Free' || b.pricing_type === 'Open Source';
  const aIsCloud = a.deployment_options?.includes('Cloud') ?? false;
  const bIsCloud = b.deployment_options?.includes('Cloud') ?? false;
  const aPriceDelta = a.starting_price - b.starting_price;

  const pickAReasons: string[] = [];
  const pickBReasons: string[] = [];

  if (a.score > b.score)
    pickAReasons.push(`higher expert score (${a.score.toFixed(1)}/5 vs ${b.score.toFixed(1)}/5)`);
  else if (b.score > a.score)
    pickBReasons.push(`higher expert score (${b.score.toFixed(1)}/5 vs ${a.score.toFixed(1)}/5)`);

  if (aFree && !bFree) pickAReasons.push('free / open-source');
  if (bFree && !aFree) pickBReasons.push('free / open-source');

  if (!aFree && !bFree) {
    if (aPriceDelta < 0)
      pickAReasons.push(`cheaper starting price ($${a.starting_price} vs $${b.starting_price})`);
    else if (aPriceDelta > 0)
      pickBReasons.push(`cheaper starting price ($${b.starting_price} vs $${a.starting_price})`);
  }

  if (aIsCloud && !bIsCloud) pickAReasons.push('runs in the cloud');
  if (bIsCloud && !aIsCloud) pickBReasons.push('runs in the cloud');

  if (
    a.platforms.length > b.platforms.length &&
    a.platforms.includes('macOS') &&
    !b.platforms.includes('macOS')
  )
    pickAReasons.push('macOS support');
  if (
    b.platforms.length > a.platforms.length &&
    b.platforms.includes('macOS') &&
    !a.platforms.includes('macOS')
  )
    pickBReasons.push('macOS support');

  if (
    a.industries &&
    b.industries &&
    a.industries.length > b.industries.length
  )
    pickAReasons.push('broader industry coverage');
  else if (
    a.industries &&
    b.industries &&
    b.industries.length > a.industries.length
  )
    pickBReasons.push('broader industry coverage');

  if (a.api_sdk?.has_api && !b.api_sdk?.has_api)
    pickAReasons.push('public API for automation');
  if (b.api_sdk?.has_api && !a.api_sdk?.has_api)
    pickBReasons.push('public API for automation');

  if (pickAReasons.length === 0)
    pickAReasons.push('established workflow familiarity');
  if (pickBReasons.length === 0)
    pickBReasons.push('established workflow familiarity');

  return {
    pickA: pickAReasons.slice(0, 3).join('; '),
    pickB: pickBReasons.slice(0, 3).join('; '),
  };
}

function articleLd(a: Tool, b: Tool, pairSlug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pairTitle(a, b),
    description: pairDescription(a, b),
    mainEntityOfPage: `${SITE_URL}/compare/${pairSlug}`,
    publisher: {
      '@type': 'Organization',
      name: 'CADGuide.tools',
      url: SITE_URL,
    },
    about: [
      {
        '@type': 'SoftwareApplication',
        name: a.name,
        url: `${SITE_URL}/tools/${a.slug}`,
      },
      {
        '@type': 'SoftwareApplication',
        name: b.name,
        url: `${SITE_URL}/tools/${b.slug}`,
      },
    ],
    datePublished: '2026-01-01',
    dateModified: '2026-05-22',
  };
}

function productCompareLd(a: Tool, b: Tool, pairSlug: string) {
  const images: string[] = [];
  if (a.logo_url) images.push(a.logo_url);
  if (b.logo_url) images.push(b.logo_url);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${a.name} vs ${b.name} Comparison`,
    image: images,
    description: `Side-by-side comparison of ${a.name} and ${b.name} CAD/BIM software properties: pricing, platforms, features, and expert score ratings.`,
    brand: {
      '@type': 'Brand',
      name: 'CADGuide.tools'
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      highPrice: Math.max(a.starting_price, b.starting_price).toString(),
      lowPrice: Math.min(a.starting_price, b.starting_price).toString(),
      offerCount: '2'
    }
  };
}

function faqCompareLd(a: Tool, b: Tool) {
  const decision = decisionText(a, b);
  const aPrice = a.starting_price > 0 ? `from $${a.starting_price}` : a.pricing_type;
  const bPrice = b.starting_price > 0 ? `from $${b.starting_price}` : b.pricing_type;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Is ${a.name} or ${b.name} better?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${a.name} has an expert score of ${a.score.toFixed(1)}/5, while ${b.name} is rated ${b.score.toFixed(1)}/5. Pick ${a.name} if you need: ${decision.pickA}. Pick ${b.name} if you need: ${decision.pickB}.`
        }
      },
      {
        '@type': 'Question',
        name: `How does the pricing of ${a.name} compare to ${b.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${a.name} is available ${aPrice}, while ${b.name} is priced ${bPrice}.`
        }
      },
      {
        '@type': 'Question',
        name: `What operating systems do ${a.name} and ${b.name} support?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${a.name} is compatible with ${a.platforms.join(' / ')}, while ${b.name} supports ${b.platforms.join(' / ')}.`
        }
      }
    ]
  };
}

interface RowSpec {
  label: string;
  render: (t: Tool) => string;
}

const ROWS: RowSpec[] = [
  { label: 'Expert score', render: (t) => `★ ${t.score.toFixed(1)}/5` },
  { label: 'Pricing', render: pricingCell },
  { label: 'Platforms', render: (t) => t.platforms.join(', ') || '—' },
  {
    label: 'External reviews',
    render: externalReviewLine,
  },
  {
    label: 'Free trial',
    render: (t) =>
      t.free_trial_days && t.free_trial_days > 0
        ? `${t.free_trial_days} days`
        : t.pricing_type === 'Free' || t.pricing_type === 'Open Source'
          ? 'Always free'
          : '—',
  },
  {
    label: 'File formats',
    render: (t) => {
      const ins = t.file_formats_in?.slice(0, 6).join(', ');
      if (!ins) return '—';
      return ins + (t.file_formats_in!.length > 6 ? ', …' : '');
    },
  },
  {
    label: 'Deployment',
    render: (t) =>
      t.deployment_options?.length ? t.deployment_options.join(', ') : '—',
  },
  {
    label: 'API / SDK',
    render: (t) =>
      t.api_sdk?.has_api
        ? `Yes${t.api_sdk.api_type ? ` (${t.api_sdk.api_type})` : ''}`
        : 'No',
  },
  {
    label: 'Industries',
    render: (t) => t.industries?.slice(0, 4).join(', ') || '—',
  },
  {
    label: 'Strengths',
    render: (t) => t.pros?.slice(0, 3).join(' · ') || '—',
  },
  {
    label: 'Limitations',
    render: (t) => t.cons?.slice(0, 3).join(' · ') || '—',
  },
];

export default async function ComparePairPage(
  { params }: { params: Promise<{ pair: string }> },
) {
  const { pair } = await params;
  const parsed = parseComparisonPair(pair);
  if (!parsed) notFound();
  const { a, b } = parsed;
  const decision = decisionText(a, b);
  const catA = categories.find((c) => c.id === a.category_id);
  const catB = categories.find((c) => c.id === b.category_id);

  const layout = getCompareLayoutStyle(a, b);
  const expertVerdict = CONTRAST_NOTES[pair] || getDynamicEditorialVerdict(a, b);

  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Compare', path: '/compare' },
    { name: `${a.name} vs ${b.name}`, path: `/compare/${pair}` },
  ]);

  // Structural Blocks for Asymmetric DOM flows
  const headerBlock = (
    <div key="header-block">
      <nav className="text-sm text-slate-500 mb-6 flex items-center gap-1.5 font-medium">
        <Link href="/" className="hover:text-slate-800 transition-colors">
          Home
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/compare" className="hover:text-slate-800 transition-colors">
          Compare
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-semibold truncate max-w-[200px]">
          {a.name} vs {b.name}
        </span>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${layout.badgeBg}`}>
            Category: {catA?.name || 'CAD Analysis'}
          </span>
          {CONTRAST_NOTES[pair] && (
            <span className="flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Expert Reviewed
            </span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-none">
          {pairTitle(a, b)}
        </h1>
        <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed font-normal">
          Side-by-side comparison of <strong>{a.name}</strong>{' '}
          {catA?.name ? `(${catA.name})` : ''} and{' '}
          <strong>{b.name}</strong>{' '}
          {catB?.name ? `(${catB.name})` : ''}: pricing, platforms,
          ratings, supported file formats, deployment options, and the
          specific strengths each tool brings to a CAD team in {YEAR}.
        </p>
      </header>

      {/* EEAT Editorial Expert Verdict Box */}
      <section className={`mb-8 p-5 md:p-6 rounded-2xl border bg-white shadow-xs transition-all duration-300 ${layout.borderHighlight}`}>
        <div className="flex items-center gap-2 mb-3">
          <Award className={`w-5 h-5 ${layout.accentText}`} />
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Expert Editorial Verdict</h2>
        </div>
        <p className="text-sm md:text-base text-slate-700 leading-relaxed font-medium">
          {expertVerdict}
        </p>
      </section>
    </div>
  );

  const quickSpecsBlock = (
    <section
      key="quick-specs-block"
      aria-labelledby="hero-cards"
      id="hero-cards"
      className="grid sm:grid-cols-2 gap-4 mb-8"
    >
      {[a, b].map((t) => (
        <Link
          key={t.slug}
          href={`/tools/${t.slug}`}
          className={`rounded-2xl bg-white border p-6 transition-all duration-300 hover:shadow-sm ${layout.borderHighlight}`}
        >
          <div className="flex items-center gap-4 mb-4">
            <ToolLogo
              slug={t.slug}
              src={t.logo_url}
              websiteUrl={t.official_url}
              name={t.name}
              className="w-12 h-12 rounded-xl flex-shrink-0 bg-slate-50 border border-slate-100"
            />
            <div>
              <div className="text-lg font-extrabold text-slate-900 tracking-tight">
                {t.name}
              </div>
              <div className="text-xs font-bold text-slate-400 mt-0.5">
                {pricingCell(t)}
              </div>
            </div>
          </div>
          <div className={`text-sm font-bold flex items-center gap-1 ${layout.accentText}`}>
            ★ {t.score.toFixed(1)}/5 expert score
          </div>
          <p className="mt-3 text-xs md:text-sm text-slate-600 leading-relaxed font-medium">{t.short_desc}</p>
        </Link>
      ))}
    </section>
  );

  const interactiveWidgetBlock = (
    <CompareWidget
      key="interactive-widget-block"
      a={a}
      b={b}
      archetype={layout.archetype}
    />
  );

  const tableBlock = (
    <section key="table-block" className="mb-10 overflow-x-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <table className="w-full border-collapse">
        <caption className="caption-top text-left text-xs font-bold uppercase tracking-wider text-slate-400 pb-4">
          Feature-by-feature comparison specsheet
        </caption>
        <thead>
          <tr className="text-left border-b border-slate-100">
            <th
              scope="col"
              className="py-3.5 pr-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-1/4"
            >
              Metric
            </th>
            <th
              scope="col"
              className="py-3.5 px-4 text-sm font-extrabold text-slate-900"
            >
              {a.name}
            </th>
            <th
              scope="col"
              className="py-3.5 px-4 text-sm font-extrabold text-slate-900"
            >
              {b.name}
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr
              key={row.label}
              className="border-b border-slate-50 last:border-b-0 align-top hover:bg-slate-50/20 transition-colors"
            >
              <th
                scope="row"
                className="py-3.5 pr-4 text-sm font-semibold text-slate-600 text-left"
              >
                {row.label}
              </th>
              <td className="py-3.5 px-4 text-sm text-slate-700 align-top font-medium leading-relaxed">
                {row.render(a)}
              </td>
              <td className="py-3.5 px-4 text-sm text-slate-700 align-top font-medium leading-relaxed">
                {row.render(b)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );

  const picksBlock = (
    <section
      key="picks-block"
      aria-labelledby="decision-heading"
      className="mb-8 grid sm:grid-cols-2 gap-4"
    >
      <h2 id="decision-heading" className="sr-only">
        Which one to pick
      </h2>
      <div className={`rounded-2xl bg-white border p-6 shadow-xs transition-all duration-300 ${layout.borderHighlight}`}>
        <div className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${layout.accentText}`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Pick {a.name} if you need
        </div>
        <p className="text-sm md:text-base text-slate-700 leading-relaxed font-semibold">{decision.pickA}.</p>
        <Link
          href={`/tools/${a.slug}`}
          className={`mt-4 inline-flex items-center text-xs md:text-sm font-bold transition-colors ${layout.accentText}`}
        >
          Read the full {a.name} review →
        </Link>
      </div>
      <div className={`rounded-2xl bg-white border p-6 shadow-xs transition-all duration-300 ${layout.borderHighlight}`}>
        <div className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${layout.accentText}`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Pick {b.name} if you need
        </div>
        <p className="text-sm md:text-base text-slate-700 leading-relaxed font-semibold">{decision.pickB}.</p>
        <Link
          href={`/tools/${b.slug}`}
          className={`mt-4 inline-flex items-center text-xs md:text-sm font-bold transition-colors ${layout.accentText}`}
        >
          Read the full {b.name} review →
        </Link>
      </div>
    </section>
  );

  const shortlistCtaBlock = (
    <section key="shortlist-cta-block" className="rounded-2xl bg-slate-900 border border-slate-800 p-6 md:p-8 text-white relative overflow-hidden shadow-md">
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800/10 rounded-full blur-2xl pointer-events-none" />
      <h2 className="text-xl md:text-2xl font-black tracking-tight mb-2">
        Want a personalised shortlist?
      </h2>
      <p className="text-slate-400 text-sm md:text-base mb-6 max-w-xl font-medium leading-relaxed">
        Compare more than two tools side-by-side, or answer a short
        quiz and let our matchmaker filter our extensive tool catalog for
        your team.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/compare"
          className="inline-flex items-center px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-950 text-xs md:text-sm font-bold rounded-xl transition-all shadow-xs"
        >
          Custom side-by-side →
        </Link>
        <Link
          href="/matchmaker"
          className="inline-flex items-center px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm font-bold rounded-xl transition-all border border-slate-700"
        >
          Try the Matchmaker →
        </Link>
      </div>
    </section>
  );

  // Dynamic layout sorting based on category archetype
  const renderSortedBlocks = () => {
    switch (layout.archetype) {
      case 'drafting':
        return (
          <>
            {headerBlock}
            {quickSpecsBlock}
            {interactiveWidgetBlock}
            <div className="mt-8">{tableBlock}</div>
            <div className="mt-8">{picksBlock}</div>
            <div className="mt-8">{shortlistCtaBlock}</div>
          </>
        );
      case 'mcad':
        return (
          <>
            {headerBlock}
            {interactiveWidgetBlock}
            <div className="mt-8">{quickSpecsBlock}</div>
            <div className="mt-8">{picksBlock}</div>
            <div className="mt-8">{tableBlock}</div>
            <div className="mt-8">{shortlistCtaBlock}</div>
          </>
        );
      case 'bim':
        return (
          <>
            {headerBlock}
            {picksBlock}
            {interactiveWidgetBlock}
            <div className="mt-8">{tableBlock}</div>
            <div className="mt-8">{quickSpecsBlock}</div>
            <div className="mt-8">{shortlistCtaBlock}</div>
          </>
        );
      case 'simulation':
        return (
          <>
            {headerBlock}
            {interactiveWidgetBlock}
            <div className="mt-8">{tableBlock}</div>
            <div className="mt-8">{picksBlock}</div>
            <div className="mt-8">{quickSpecsBlock}</div>
            <div className="mt-8">{shortlistCtaBlock}</div>
          </>
        );
      default:
        return (
          <>
            {headerBlock}
            {quickSpecsBlock}
            {tableBlock}
            {interactiveWidgetBlock}
            <div className="mt-8">{picksBlock}</div>
            <div className="mt-8">{shortlistCtaBlock}</div>
          </>
        );
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleLd(a, b, pair)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productCompareLd(a, b, pair)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqCompareLd(a, b)),
        }}
      />

      <main className={`min-h-screen pb-16 md:pb-24 transition-colors duration-300 ${layout.bodyBg}`}>
        <article className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16">
          {renderSortedBlocks()}
        </article>
      </main>
    </>
  );
}
