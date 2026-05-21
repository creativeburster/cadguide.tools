import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { filterToolsByFeature, BEST_OF_LIMIT } from '@/lib/seo-content';
import { featureCategories } from '@/lib/data/featureCategories';
import { pageMetadata, siteBreadcrumbLd, SITE_URL } from '@/lib/seo';
import type { Tool } from '@/lib/data';
import { ToolLogo } from '@/components/tool-logo';

export const dynamicParams = false;

export function generateStaticParams() {
  return featureCategories.map((f) => ({ slug: f.slug }));
}

const YEAR = 2026;

// Localized mapping for feature articles (English for target global audience, or matching user preferences)
interface FeatureContent {
  title: string;
  description: string;
  intro: string;
  technologiesHeading: string;
  technologiesIntro: string;
  techTable: { tech: string; app: string; benefit: string }[];
  selectionGuideTitle: string;
  selectionGuideIntro: string;
  selectionItems: string[];
  faqs: { q: string; a: string }[];
}

const FEATURE_CONTENTS: Record<string, FeatureContent> = {
  'ai-assisted': {
    title: `Best AI-Assisted CAD Software in ${YEAR}: Top Tools Compared`,
    description: `Explore the top highly-rated AI-assisted CAD tools for ${YEAR}. Discover key generative design, error validation, and smart-mate technologies.`,
    intro: `Artificial Intelligence has matured from experimental plugins to the core foundation of product design. Explore the top AI-assisted CAD tools ranked by expert review scores, verified public review volume, and robust feature depth.`,
    technologiesHeading: 'Key Technologies Driving AI-Assisted CAD',
    technologiesIntro: 'AI integrations are no longer merely marketing buzzwords. In 2026, standard design automation leverages four primary pillars of artificial intelligence:',
    techTable: [
      {
        tech: 'Natural Language Modeling',
        app: 'Type "Create a flange with a 50mm bore and 6 bolt holes" to generate geometric features instantly.',
        benefit: 'Lowers training thresholds and dramatically cuts initial layout times.'
      },
      {
        tech: 'Generative Design',
        app: 'Automated iterations mapping optimal topologies against structural loads and materials.',
        benefit: 'Uncovers lighter, stronger, and more organic shapes that are impossible to model manually.'
      },
      {
        tech: 'Intelligent Error Validation',
        app: 'Live checking mechanisms suggesting optimal wall thicknesses and tooling tolerances.',
        benefit: 'Virtually eliminates late-stage engineering changes and manufacturing defects.'
      },
      {
        tech: 'Predictive Simulation',
        app: 'Real-time finite element analysis (FEA) projecting material fatigue and heat spots under loads.',
        benefit: 'Enables rapid product stress-testing inside the CAD workspace without server lag.'
      }
    ],
    selectionGuideTitle: 'Selection Guide: Finding Your Ideal AI-Assisted CAD',
    selectionGuideIntro: 'Every engineering pipeline is unique. Use this high-level selection template based on your organization structure:',
    selectionItems: [
      'For Distributed Teams: Choose cloud-native environments like Onshape or Fusion 360 to run zero-install workspaces, keeping large engineering teams completely synchronized.',
      'For High-Stakes Prototyping: Rely on Fusion 360. Autodesk\'s generative design engine calculates stress factors and optimizes structural components natively.',
      'For Budget Constraints & Non-Commercial Projects: Choose the fully open-source FreeCAD platform or leverage Fusion 360\'s highly accessible personal tier.',
      'For Legacy Technical Environments: Integrate AI add-ons directly into the industry-standard SolidWorks or Creo configurations to maintain workflow parity.'
    ],
    faqs: [
      {
        q: 'Will AI tools eventually replace mechanical designers and architects?',
        a: 'No. Artificial intelligence in CAD acts as a high-powered assistant, carrying out tedious parametric modifications, optimization math, and compliance checks. The ultimate creative direction, complex assembly constraints, and final engineering decisions still require expert human intervention.'
      },
      {
        q: 'What CAD fields see the highest immediate benefits from AI integrations?',
        a: 'Mechanical design (specifically bracket design, topology optimization, and auto-routing), high-volume architectural layouts (space optimization), and PCB layout design (intelligent routing of signals) experience immediate and immense efficiency gains from current AI workflows.'
      },
      {
        q: 'Do AI modeling features require powerful local workstation hardware?',
        a: 'It depends on the architecture. Cloud-first tools like Onshape and Fusion 360 compute intensive generative design layouts and predictive simulations on high-performance cloud clusters. Desktop tools like SolidWorks rely heavily on local GPU cores and processor threads to render and optimize on the fly.'
      }
    ]
  },
  'cloud-collaboration': {
    title: `Best Cloud Collaboration CAD Software in ${YEAR}: Top Web & SaaS Tools`,
    description: `Compare the best cloud-collaborative CAD tools in ${YEAR}. Real-time multi-user editing, cloud versioning, and zero-install browser access.`,
    intro: `In 2026, web-first and cloud-based environments have redefined engineering collaboration. Distributed teams can draft, model, and sign off assemblies simultaneously without complex server networks or versioning lockouts.`,
    technologiesHeading: 'Essential Pillars of Cloud CAD Collaboration',
    technologiesIntro: 'True cloud-based CAD platforms offer robust, multi-user infrastructure beyond mere storage sync. Here are the core technologies:',
    techTable: [
      {
        tech: 'Real-Time Multi-User Editing',
        app: 'Simultaneous modeling and drafting on the same assembly with dynamic visual cues, similar to Google Docs.',
        benefit: 'Completely eliminates file-locking conflicts and assembly synchronization delays.'
      },
      {
        tech: 'Infinite Revision History',
        app: 'Automated logging of every feature change, sketch adjustment, and assembly mate with instant rollbacks.',
        benefit: 'Ensures absolute intellectual property security and easy trial branches.'
      },
      {
        tech: 'Zero-Install Web Clients',
        app: 'Rendering complex CAD assemblies directly in standard browsers (Chrome, Safari) using WebGPU.',
        benefit: 'Removes local hardware restrictions; works on Chromebooks, tablets, and lightweight laptops.'
      },
      {
        tech: 'Secure Enterprise Sharing',
        app: 'Granular permissions, link sharing with expiry dates, and real-time viewing options for suppliers.',
        benefit: 'Secures proprietary IP while facilitating seamless manufacturing sign-offs.'
      }
    ],
    selectionGuideTitle: 'Choosing Your Collaborative CAD Environment',
    selectionGuideIntro: 'Use this reference guide to match your collaborative requirements against the top tools:',
    selectionItems: [
      'For Pure SaaS & Multi-User Co-Authoring: Onshape is the unmatched gold standard for simultaneous mechanical modeling directly in the browser.',
      'For Flexible Design-to-Manufacturing pipelines: Autodesk Fusion 360 offers cloud data storage and collaborative reviews alongside powerful desktop CAD/CAM solvers.',
      'For Architectural Collaboration: ArchiCAD (via BIMcloud) and Revit (via Autodesk Construction Cloud) offer dedicated multi-user architectural workflows.',
      'For Secure Local Teams with Cloud backups: Standard desktop tools like SolidWorks with 3DEXPERIENCE provide secure cloud vaulting.'
    ],
    faqs: [
      {
        q: 'Is cloud-based CAD secure for highly sensitive IP?',
        a: 'Yes. Enterprise cloud CAD platforms leverage end-to-end encryption at rest and in transit, multi-factor authentication (MFA), SSO/SAML integration, and independent SOC 2 audits to safeguard proprietary design data.'
      },
      {
        q: 'Can cloud CAD tools function in offline environments?',
        a: 'Some hybrid tools (such as Fusion 360) support local offline caching, allowing you to model without an internet connection and sync later. Pure SaaS systems (like Onshape) require active internet connectivity.'
      }
    ]
  },
  'parametric-modeling': {
    title: `Best Parametric Modeling CAD Software in ${YEAR}: Dimension-Driven Design`,
    description: `Discover the top parametric CAD software for ${YEAR}. Compare dimension-driven, history-based design systems for mechanical and product engineering.`,
    intro: `Parametric modeling remains the bedrock of mechanical engineering and product design. By establishing strict geometric relationships and dimensions, engineers can modify complex assemblies with absolute mathematical control.`,
    technologiesHeading: 'Core Concepts of Modern Parametric CAD',
    technologiesIntro: 'Dimension-driven modeling relies on structured rules and parent-child dependencies to drive flexible layouts:',
    techTable: [
      {
        tech: 'History-Based Feature Trees',
        app: 'A sequential log of sketches, extrusions, fillets, and cuts that can be edited at any historical step.',
        benefit: 'Provides absolute control over the design intent, making iterations highly predictable.'
      },
      {
        tech: 'Global Equations & Variables',
        app: 'Using mathematical formulas (e.g., width = height * 1.5) to drive multiple model dimensions.',
        benefit: 'Enables rapid configuration scaling and automatic family-of-parts adjustments.'
      },
      {
        tech: 'Parametric Constraints',
        app: 'Enforcing geometric relationships such as tangency, concentricity, and parallelism in 2D sketches.',
        benefit: 'Ensures sketches remain fully defined and do not break during later edits.'
      },
      {
        tech: 'Dynamic Assembly Mates',
        app: 'Defining physical interactions and limits between separate components (gears, sliders, hinges).',
        benefit: 'Permits kinematic motion testing and tolerance audits before physical prototyping.'
      }
    ],
    selectionGuideTitle: 'Selecting Your Parametric Modeling Engine',
    selectionGuideIntro: 'Select a parametric platform based on your industry and assembly complexity:',
    selectionItems: [
      'For Mid-Market Manufacturing & Product Design: SolidWorks remains the global industry standard, supported by a massive ecosystem and talent pool.',
      'For Aerospace, Automotive & High-End Assembly: PTC Creo and Siemens NX offer unmatched stability for complex assemblies with millions of parts.',
      'For Integrated CAD/CAM/CAE workflows: Fusion 360 represents an exceptionally cohesive, modern, and value-driven workspace.',
      'For Open-Source & Scripted Modeling: FreeCAD is highly extensible via Python, offering completely free parametric modeling.'
    ],
    faqs: [
      {
        q: 'What is the main difference between parametric and direct modeling?',
        a: 'Parametric modeling relies on a structured history tree and strict geometric relationships, meaning edits cascade down to update the whole model. Direct modeling (e.g., in Rhino or SketchUp) allows you to push/pull faces directly without history, offering higher organic freedom but less dimensional control.'
      },
      {
        q: 'Does parametric modeling require a steep learning curve?',
        a: 'Yes. Designing with parametric CAD requires understanding "design intent" to prevent the model from breaking when earlier parameters are modified. It takes more upfront planning than direct modeling.'
      }
    ]
  },
  'rendering': {
    title: `Best CAD Software with High-End Rendering in ${YEAR}: Real-Time Visualisation`,
    description: `Explore the top CAD software with advanced rendering capabilities in ${YEAR}. Real-time ray tracing, physical materials, and photo-real presentation.`,
    intro: `In 2026, real-time rendering has successfully bridged the gap between CAD modeling and final architectural visualization. Designers can now present highly accurate, physically-based materials and lighting directly from their modeling workspace.`,
    technologiesHeading: 'Advanced Rendering Technologies in CAD',
    technologiesIntro: 'Photorealistic presentation inside modeling suites relies on advanced GPU algorithms and physically-accurate material parameters:',
    techTable: [
      {
        tech: 'Real-Time GPU Ray Tracing',
        app: 'Simulating complex light bounces, refraction, and soft shadows instantaneously using hardware-accelerated cores.',
        benefit: 'Provides immediate visual feedback during modeling, drastically reducing final render wait times.'
      },
      {
        tech: 'Physically Based Rendering (PBR)',
        app: 'Utilizing accurate material parameters (metallic, roughness, height maps) that react realistically to light sources.',
        benefit: 'Produces stunningly photorealistic textures, making CAD concepts look like physical prototypes.'
      },
      {
        tech: 'Built-in Asset Libraries',
        app: 'Providing rich, cloud-synced databases of physical materials, lighting environments (HDRIs), and organic props.',
        benefit: 'Saves countless hours of material setup, enabling quick architectural stage setups.'
      },
      {
        tech: 'Virtual Reality Integration',
        app: 'One-click exporting to VR headsets for immersive virtual walk-throughs and client inspections.',
        benefit: 'Enhances design approvals and facilitates spatial perception auditing before building.'
      }
    ],
    selectionGuideTitle: 'Selecting Your Visualisation & Rendering Workflow',
    selectionGuideIntro: 'Choose a rendering setup tailored to your specific presentation needs:',
    selectionItems: [
      'For Real-Time Architectural Walkthroughs: Specialist renderers like Lumion and Twinmotion deliver incredibly rich environment simulations.',
      'For Product Design & Studio Shots: Fusion 360 (built-in Ray Tracing) and SolidWorks (via PhotoView 360 / Visualize) offer excellent studio environments.',
      'For Creative & VFX Visualisation: Blender (Eeevee/Cycles engines) is an unmatched, free open-source powerhouse for visual styling.',
      'For Architectural Design with Native Render: ArchiCAD (integrating CineRender) and Vectorworks provide excellent rendering pipelines.'
    ],
    faqs: [
      {
        q: 'Do I need a dedicated graphic card for CAD rendering in 2026?',
        a: 'Yes. Modern real-time rendering suites leverage WebGPU, DirectX 12 Raytracing (DXR), or Vulkan to offload calculation to physical graphics hardware. Dedicated NVIDIA RTX or AMD Radeon GPUs are highly recommended.'
      },
      {
        q: 'What is physically based rendering (PBR)?',
        a: 'PBR is a rendering model that simulates the real-world physical behavior of light interacting with surface materials (reflectivity, roughness, refraction), ensuring predictable and photorealistic results under any lighting condition.'
      }
    ]
  }
};

function pricingLabel(t: Tool): string {
  if (t.pricing_type === 'Free') return 'Free';
  if (t.pricing_type === 'Open Source') return 'Open Source';
  if (t.pricing_type === 'Freemium') return 'Freemium';
  if (t.starting_price > 0) return `from $${t.starting_price}`;
  return t.pricing_type;
}

function bestForLine(t: Tool): string {
  const industries = (t.industries ?? []).slice(0, 2);
  const scales = (t.user_scales ?? []).slice(0, 1);
  const parts: string[] = [];
  if (industries.length > 0) parts.push(industries.join(' & ') + ' teams');
  if (scales.length > 0) parts.push(scales[0] + ' organisations');
  if (parts.length === 0) return 'Generalist CAD users';
  return parts.join(', ');
}

function whyPickedLine(t: Tool): string {
  const bits: string[] = [];
  if (t.external_ratings && t.external_ratings.length > 0) {
    const totalReviews = t.external_ratings.reduce(
      (acc, r) => acc + (r.count ?? 0),
      0,
    );
    const sources = t.external_ratings.map((r) => r.source).join(' / ');
    bits.push(`${totalReviews.toLocaleString()} verified reviews on ${sources}`);
  }
  if (t.score >= 4.7) bits.push('top-tier expert score');
  else if (t.score >= 4.5) bits.push('strong expert score');
  if (t.api_sdk?.has_api) bits.push('robust API & SDK');
  if (t.integrations && t.integrations.length >= 4) bits.push('deep ecosystem');
  if (t.deployment_options && t.deployment_options.includes('Cloud'))
    bits.push('cloud-ready');
  if (bits.length === 0) {
    if (t.platforms.length >= 2) bits.push('multi-platform availability');
    if (t.pros && t.pros.length > 0) bits.push(t.pros[0].toLowerCase());
  }
  return bits.slice(0, 3).join(', ');
}

function itemListLd(slug: string, title: string, description: string, ranked: Tool[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    description: description,
    numberOfItems: ranked.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: ranked.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/tools/${t.slug}`,
      name: t.name,
    })),
  };
}

function articleLd(slug: string, title: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    mainEntityOfPage: `${SITE_URL}/best/feature/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'CADGuide.tools',
      url: SITE_URL,
    },
    datePublished: '2026-01-01',
    dateModified: '2026-05-21',
  };
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const content = FEATURE_CONTENTS[slug];
  if (!content) return {};
  return pageMetadata({
    title: content.title,
    description: content.description,
    path: `/best/feature/${slug}`,
    ogType: 'article',
  });
}

export default async function BestFeaturePage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const feature = featureCategories.find((f) => f.slug === slug);
  const content = FEATURE_CONTENTS[slug];
  
  if (!feature || !content) notFound();

  // Dynamically filter tools by the feature ID using the lib logic we added
  const ranked = filterToolsByFeature(feature.id);

  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Best Of', path: '/best' },
    { name: feature.name, path: `/best/feature/${feature.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListLd(feature.slug, content.title, content.description, ranked)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleLd(feature.slug, content.title, content.description)),
        }}
      />

      <main className="min-h-screen bg-slate-50">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {/* Breadcrumb nav */}
          <nav className="text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            {' / '}
            <Link href="/best" className="hover:underline">
              Best Of
            </Link>
            {' / '}
            <span className="text-slate-700">Best by Feature</span>
          </nav>

          <header className="mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100 mb-4">
              Feature Spotlight
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {content.title}
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              {content.intro}
            </p>
          </header>

          {/* Key Technologies section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{content.technologiesHeading}</h2>
            <p className="text-slate-700 leading-relaxed mb-6">{content.technologiesIntro}</p>
            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left">Technology</th>
                    <th scope="col" className="px-6 py-3 text-left">Application</th>
                    <th scope="col" className="px-6 py-3 text-left">Engineering Benefit</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200 text-sm text-slate-700">
                  {content.techTable.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-900">{item.tech}</td>
                      <td className="px-6 py-4">{item.app}</td>
                      <td className="px-6 py-4 text-slate-600">{item.benefit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Top Products section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Top Rated Software with {feature.name}</h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              Our editor team evaluated every tool in the catalog based on their native {feature.name.toLowerCase()} capabilities. Here are the top-performing packages:
            </p>
            <ol className="space-y-6">
              {ranked.map((tool, i) => {
                const totalReviews = (tool.external_ratings ?? []).reduce(
                  (acc, r) => acc + (r.count ?? 0),
                  0,
                );
                return (
                  <li
                    key={tool.slug}
                    className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 hover:border-blue-300 transition-colors shadow-sm"
                  >
                    <div className="flex items-start gap-5">
                      <div className="flex-shrink-0">
                        <div className="text-2xl font-extrabold text-blue-600 w-10 text-center">
                          {i + 1}.
                        </div>
                      </div>
                      <ToolLogo
                        slug={tool.slug}
                        src={tool.logo_url}
                        websiteUrl={tool.official_url}
                        name={tool.name}
                        className="w-16 h-16 rounded-xl flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <Link
                            href={`/tools/${tool.slug}`}
                            className="text-xl font-bold text-slate-900 hover:text-blue-600"
                          >
                            {tool.name}
                          </Link>
                          <span className="text-sm text-slate-500">
                            {pricingLabel(tool)} · {tool.platforms.join(' / ')}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-sm text-amber-600 font-semibold">
                          <span>★ {tool.score.toFixed(1)}/5</span>
                          {totalReviews > 0 && (
                            <span className="text-slate-500 font-normal">
                              ({totalReviews.toLocaleString()} customer reviews)
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-slate-700 leading-relaxed">
                          {tool.short_desc}
                        </p>
                        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                          <div>
                            <dt className="text-slate-500 font-medium">
                              Why it&apos;s on this list
                            </dt>
                            <dd className="text-slate-800">{whyPickedLine(tool)}</dd>
                          </div>
                          <div>
                            <dt className="text-slate-500 font-medium">
                              Best for
                            </dt>
                            <dd className="text-slate-800">{bestForLine(tool)}</dd>
                          </div>
                        </dl>
                        <div className="mt-4">
                          <Link
                            href={`/tools/${tool.slug}`}
                            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
                          >
                            Read the full {tool.name} review →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* Selection Guide section */}
          <section className="mb-12 bg-slate-100 border border-slate-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3">{content.selectionGuideTitle}</h2>
            <p className="text-slate-700 mb-4">{content.selectionGuideIntro}</p>
            <ul className="list-disc pl-5 text-slate-700 space-y-2">
              {content.selectionItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          {/* FAQ section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {content.faqs.map((faq, idx) => (
                <details key={idx} className="group border border-slate-200 rounded-xl bg-white p-4 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between font-semibold text-slate-900 cursor-pointer list-none">
                    <span>{faq.q}</span>
                    <span className="transition-transform group-open:rotate-180">
                      <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="mt-3 text-slate-600 leading-relaxed text-sm border-t border-slate-100 pt-3">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Matchmaker call to action */}
          <section className="rounded-2xl bg-blue-50 border border-blue-100 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              Need a personalized recommendation?
            </h2>
            <p className="text-slate-700 mb-4">
              Answer a few questions about your budget, target industry, operating system, and required formats, and we will build a custom list for your team.
            </p>
            <Link
              href="/matchmaker"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
            >
              Try the Matchmaker →
            </Link>
          </section>
        </article>
      </main>
    </>
  );
}
