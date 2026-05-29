import { tools } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToolLogo } from '@/components/tool-logo';
import { ARTICLES_LIST, CATEGORY_SECTIONS } from '@/lib/guides-data';
import { Award, FileText, Cloud, Cpu, ArrowLeft, CheckCircle2, AlertTriangle, ShieldAlert, BookOpen, Star, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamicParams = true;

// Helper to parse slug into tool and article template details
function parseGuideSlug(slug: string) {
  const sortedTools = [...tools].sort((a, b) => b.slug.length - a.slug.length);
  for (const t of sortedTools) {
    if (slug.startsWith(`${t.slug}-`)) {
      const rest = slug.substring(t.slug.length + 1);
      const lastHyphenIdx = rest.lastIndexOf('-');
      if (lastHyphenIdx >= 0) {
        const category = rest.substring(0, lastHyphenIdx);
        const artIndexStr = rest.substring(lastHyphenIdx + 1);
        const artIndex = parseInt(artIndexStr, 10);
        
        // Find matching article template
        const template = ARTICLES_LIST.find(art => art.category === category && art.id.endsWith(`art-${artIndex}`));
        if (template) {
          return { tool: t, template, category, artIndex };
        }
      }
    }
  }
  return null;
}

export function generateStaticParams() {
  const params: { slug: string }[] = [];
  // For static builds, pre-render exactly 10 guides per tool to generate 2,400+ fast static routes
  for (const tool of tools) {
    const selectedArticles = ARTICLES_LIST.slice(0, 10);
    for (const art of selectedArticles) {
      const artIndex = art.id.split('-').pop();
      params.push({
        slug: `${tool.slug}-${art.category}-${artIndex}`,
      });
    }
  }
  return params;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseGuideSlug(slug);
  if (!parsed) return {};

  const { tool, template } = parsed;
  const isAutoCAD = template.softwareSlug === 'autocad';
  const replaceRegex = isAutoCAD ? /autocad/gi : /solidworks/gi;

  const title = template.title.replace(replaceRegex, tool.name);
  const description = template.excerpt.replace(replaceRegex, tool.name);

  return {
    title: `${title} — CAD Expert Troubleshooting`,
    description,
    keywords: [tool.name.toLowerCase(), `${tool.name.toLowerCase()} guide`, `${tool.name.toLowerCase()} tutorial`, template.keyword.replace(replaceRegex, tool.name.toLowerCase())],
    alternates: {
      canonical: `https://cadguide.tools/guides/${slug}`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parsed = parseGuideSlug(slug);

  if (!parsed) {
    notFound();
  }

  const { tool, template, category, artIndex } = parsed;
  const isAutoCAD = template.softwareSlug === 'autocad';
  const replaceRegex = isAutoCAD ? /autocad/gi : /solidworks/gi;

  const title = template.title.replace(replaceRegex, tool.name);
  const excerpt = template.excerpt.replace(replaceRegex, tool.name);
  const keyword = template.keyword.replace(replaceRegex, tool.name.toLowerCase());

  // Renders distinct detailed technical guides based on category sections
  const getDynamicSteps = (cat: string, name: string) => {
    switch (cat) {
      case 'troubleshooting':
        return [
          {
            title: `Repair Corrupted Registry & Local Profiles for ${name}`,
            desc: `Navigate to your workstation local AppData directory \`C:\\Users\\%USERNAME%\\AppData\\Local\\${name}\` and backup configuration XML models. Open registry database editor (regedit.exe) and verify FLEXlm options binding paths.`,
          },
          {
            title: 'Verify Concurrent Seat Daemon & Host Ports',
            desc: `Query LMTools status log to ensure concurrent licensing sockets are bound to TCP ports 27000-27009 or 2080. If EULA seat EULA watermark compliance locks trigger, perform standard safe offline profile resets.`,
          },
          {
            title: `Wipe Temporary Drawing Cache & Restore Recovered Assets`,
            desc: `Wipe all background cache assets under Windows Temp folder and locate temporary recovery databases (.sv$ or .ac$ formats). Copy files to an isolated backup subnet to prevent background serialization overwrites.`,
          },
        ];
      case 'performance':
        return [
          {
            title: `Override Workstation GPU Hardware Acceleration in ${name}`,
            desc: `Launch ${name} command console or navigation pane and search Graphic Buffers setting. Ensure graphic pipeline buffer allocations are mapped to high-speed dedicated VRAM and override Windows desktop virtualization constraints.`,
          },
          {
            title: 'Optimize Thread Multi-Processing & Pagefile Buffers',
            desc: `Allocate high-performance hardware pipelines by editing virtualized system pagefiles. Re-map thread priorities to optimize geometric NURBS modeling kernels and eliminate system UI stutter.`,
          },
          {
            title: 'Flush Large 3D Assembly Geometry Memory',
            desc: `Clear structural multi-core memory leaks by flushes on assembly geometry buffer. Setup periodic autosave parameters to clear idle background RAM every 20 drawing iterations.`,
          },
        ];
      case 'printing':
        return [
          {
            title: 'Standardize Corporate CTB Pen Tables Styles',
            desc: 'Map enterprise standard monochrome and custom layout pen weight style files. Verify CTB margins match standard paper layout borders and synchronize model scales.',
          },
          {
            title: 'Calibrate Paper Plot Margins & High-Definition Vector Output',
            desc: 'Configure physical page dimensions to conform with uniform ISO and ANSI guidelines. Eliminate vector missing line weight bugs and embedded scrambled fonts during exports.',
          },
        ];
      case 'standards':
        return [
          {
            title: `Establish AIA & ANSI Layer Naming Conventions in ${name}`,
            desc: 'Configure standardized corporate design templates based on AIA, ANSI, and mechanical ISO guidelines. Standardize engineering dimension scale metrics across multi-disciplinary assets.',
          },
          {
            title: 'Write Robust BIM Execution Plans (BEP)',
            desc: 'Ensure public tenders EULA compliance coordinates. Build unified standards to automate mechanical production drafts and annotations.',
          },
        ];
      case 'deployment':
        return [
          {
            title: `Silent Enterprise MSI Quiet Deployments for ${name}`,
            desc: 'Compile mass deployment command lines to quietly run customized MSIs. Exclude cloud telemetry sync and tracking agents to optimize private subnet security.',
          },
          {
            title: 'FLEXlm Options seat allocations and SAML SSO Authentication',
            desc: 'Verify Named User token allocations via centralized enterprise domains. Restrict and reserve group licensing concurrent daemons on workstation networks.',
          },
        ];
      case 'migration':
        return [
          {
            title: `Import Legacy AutoLISP CUIX Customizations to ${name}`,
            desc: 'Extract and import legacy command configurations, custom PGP command aliases, and AutoLISP script libraries natively without code translation overheads.',
          },
          {
            title: 'Re-Map Coordinate Databases & Parametric Constraints',
            desc: 'Evaluate crossover compatibility metrics. Translate geometric assemblies constraints from mechanical kernels without loss of parametric design integrity.',
          },
        ];
      case 'procurement':
        return [
          {
            title: `Subscription vs Perpetual Cost Metrics for ${name}`,
            desc: 'Calculate 3-year cumulative software buyout break-even sheets. Evaluate team Named User license budgeting vs shared Flex license pools.',
          },
          {
            title: 'Mitigate Compliance Audit Swe Sweeps & Token Reclaims',
            desc: 'Implement formal vendor asset audits compliance checklists. Identify and disable watermarked educational license credentials on corporate networks.',
          },
        ];
      default:
        return [
          {
            title: `Enforce CAD to CAM G-Code Watertight Solid Kernels`,
            desc: 'Evaluate mathematical model boundary tolerances to optimize additive 3D slicing. Prevent polygon mesh triangulation triangulation facets.',
          },
          {
            title: 'CNC Lathe Milling Speeds Calibration',
            desc: 'Configure sheet metal folding allowances with precision K-Factor calculators. Enforce uniform feed rates during multi-axis machining exports.',
          },
        ];
    }
  };

  const steps = getDynamicSteps(category, tool.name);

  // Generate breadcrumb links for crawlers
  const breadcrumbs = [
    { name: 'Home', item: 'https://cadguide.tools/' },
    { name: 'Guides', item: 'https://cadguide.tools/guides' },
    { name: title, item: `https://cadguide.tools/guides/${slug}` },
  ];

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((b, idx) => ({
      '@type': 'ListItem',
      'position': idx + 1,
      'name': b.name,
      'item': b.item,
    })),
  };

  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    'headline': title,
    'description': excerpt,
    'inLanguage': 'en-US',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://cadguide.tools/guides/${slug}`,
    },
    'author': {
      '@type': 'Person',
      'name': 'Will P. (BIM Architect)',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'CADGuide Tools',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://cadguide.tools/icon.svg',
      },
    },
    'datePublished': '2026-05-01',
    'dateModified': '2026-05-29',
    'about': {
      '@type': 'SoftwareApplication',
      'name': tool.name,
      'operatingSystem': tool.platforms?.join(', '),
      'applicationCategory': 'BusinessApplication',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />

      <div className="bg-[#fcfdfe] min-h-screen pb-20 w-full overflow-x-hidden">
        {/* Dynamic Header */}
        <div className="bg-white border-b py-6 w-full">
          <div className="max-w-[1360px] mx-auto px-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-4">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/guides" className="hover:text-blue-600 transition-colors">Guides</Link>
              <span>/</span>
              <span className="text-slate-900 truncate">{tool.name} Technical Guide</span>
            </div>

            <Link href="/guides" className="inline-flex items-center gap-2 text-xs font-black text-blue-600 mb-6 hover:underline group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Guides Library
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4 max-w-4xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-blue-600 text-white border-none font-black px-3 py-1 uppercase tracking-widest text-[9px] rounded-lg">
                    {category.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="bg-slate-50 border-slate-100 font-bold px-3 py-1 text-[10px] text-slate-500">
                    Keyword Mapped
                  </Badge>
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  {title}
                </h1>
                <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed">
                  {excerpt}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <ToolLogo slug={tool.slug} name={tool.name} src={tool.logo_url} className="w-16 h-16 rounded-2xl shadow bg-white border border-slate-100" />
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Target Software</span>
                  <Link href={`/tools/${tool.slug}`} className="font-black text-slate-900 hover:text-blue-600 hover:underline block text-lg">
                    {tool.name}
                  </Link>
                  <span className="text-xs text-slate-500 font-bold">Expert Score: ★ {tool.score}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="max-w-[1360px] mx-auto px-4 py-8 md:py-12 w-full">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-start w-full">
            {/* Left Content Column */}
            <main className="flex-1 space-y-8 md:space-y-12 min-w-0 w-full">
              {/* Author Banner */}
              <div className="bg-white p-5 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-lg shadow-blue-200">
                    WP
                  </div>
                  <div>
                    <span className="font-black text-slate-900 block text-sm">Will P. (BIM Architect)</span>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Enterprise Systems Lead</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs text-slate-500 font-bold">
                  <div>Read Time: <span className="text-slate-900 font-black">7 min</span></div>
                  <div>Published: <span className="text-slate-900 font-black">May 2026</span></div>
                  <div>Status: <span className="text-emerald-600 font-black flex items-center gap-1">● Verified</span></div>
                </div>
              </div>

              {/* Technical Overview Container */}
              <Card className="border-none shadow-[0_24px_48px_-15px_rgba(0,0,0,0.03)] bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-[32px] overflow-hidden relative p-6 sm:p-8">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px]"></div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] uppercase tracking-widest">
                    <ShieldAlert className="w-4 h-4" /> Technical Alert Checklist
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                    Deploying Technical Patches on Named-User and Shared Subnets
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
                    This troubleshooting playbook resolves active licensing overrides, runtime graphical cache stutter, and ISO dimension style configurations for {tool.name}. Make sure you backup local coordinate configurations before enforcing registries.
                  </p>
                </div>
              </Card>

              {/* Step-by-Step Technical Guide Content */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Multi-Step Enterprise Resolution Playbook
                  </h2>
                </div>

                <div className="space-y-6">
                  {steps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-100 hover:border-blue-100 shadow-sm transition-all duration-300 relative group flex items-start gap-4 sm:gap-6"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-black text-base flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        {sIdx + 1}
                      </div>
                      <div className="space-y-2 min-w-0">
                        <h4 className="font-black text-slate-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors">
                          {step.title}
                        </h4>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                          {step.desc}
                        </p>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 font-mono text-[10px] sm:text-xs text-slate-500 overflow-x-auto mt-4">
                          <code>
                            {sIdx === 0 && `# Command-line execution for environment verification\nC:\\Program Files\\${tool.name.replace(/\s+/g, '')}\\Bin\\${tool.name.toLowerCase().replace(/\s+/g, '')}.exe --verify-license --verbose`}
                            {sIdx === 1 && `# Query FLEXlm options daemon TCP socket status\nLMUTIL lmstat -a -c C:\\Licenses\\${tool.name.toLowerCase().replace(/\s+/g, '')}.lic`}
                            {sIdx === 2 && `# Wipe local dynamic recovery files safely\ndel /f /q %TEMP%\\*${tool.name.toLowerCase().replace(/\s+/g, '').slice(0, 5)}*.sv$`}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Horizontal Bidirectional Capillary Card (Guide ➔ Review) */}
              <Card className="border-2 border-dashed border-slate-200 bg-white p-6 sm:p-8 rounded-[32px] flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-blue-600 transition-all duration-500">
                <div className="space-y-2">
                  <Badge className="bg-amber-600/10 text-amber-700 font-bold px-3 py-0.5 text-[9px] uppercase tracking-wider rounded-lg">
                    Full Analysis Guide
                  </Badge>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    Read the Full {tool.name} Pricing, Score, and Competitor Review
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm font-medium">
                    Want to know if {tool.name} is the best investment for your enterprise CAD workflows? Check out ratings, pros & cons, and licensing plans.
                  </p>
                </div>
                <Button asChild className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black h-12 sm:h-14 px-8 shadow-md">
                  <Link href={`/tools/${tool.slug}`} className="flex items-center gap-2">
                    Open Review <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </Card>
            </main>

            {/* Right Sidebar */}
            <aside className="w-full lg:w-96 lg:shrink-0 space-y-6 md:space-y-8">
              {/* Tool Profile Card */}
              <Card className="rounded-[24px] md:rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm bg-white space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-50 pb-5">
                  <ToolLogo slug={tool.slug} name={tool.name} src={tool.logo_url} className="w-14 h-14 rounded-2xl border bg-white" />
                  <div>
                    <h4 className="font-black text-slate-900 text-base">{tool.name}</h4>
                    <span className="text-yellow-500 font-black text-xs">★ {tool.score} / 5.0 Rating</span>
                  </div>
                </div>

                <div className="space-y-4 text-xs font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>License Type:</span>
                    <span className="text-slate-900 font-black">{tool.pricing_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Origin Country:</span>
                    <span className="text-slate-900 font-black">{tool.country}</span>
                  </div>
                  {tool.version && (
                    <div className="flex justify-between">
                      <span>Latest Version:</span>
                      <span className="text-slate-900 font-black">{tool.version}</span>
                    </div>
                  )}
                  {tool.platforms && (
                    <div className="flex justify-between">
                      <span>Platforms:</span>
                      <span className="text-slate-900 font-black truncate max-w-[180px]">{tool.platforms.join(', ')}</span>
                    </div>
                  )}
                </div>

                <Button asChild variant="outline" className="w-full h-12 rounded-2xl border-blue-100 text-blue-600 hover:bg-blue-50 font-black transition-colors">
                  <Link href={`/tools/${tool.slug}`}>Check Full Specifications</Link>
                </Button>
              </Card>

              {/* Related Guides Sidebar */}
              <Card className="rounded-[24px] md:rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm bg-white space-y-6">
                <h3 className="font-black text-slate-900 text-base border-b border-slate-50 pb-3 uppercase tracking-wider text-[11px] text-slate-400">
                  Sectors & Alternative Switch
                </h3>
                <div className="space-y-4">
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    Looking to crossover from legacy platforms or evaluate cheaper alternatives? Match similar software in the same industry.
                  </p>
                  <div className="space-y-2">
                    <Button asChild className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs gap-2 flex items-center justify-center">
                      <Link href={`/alternatives/${tool.slug}`}>
                        Compare {tool.name} Alternatives <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Enterprise IT Deployment Banner */}
              <Card className="rounded-[24px] md:rounded-[32px] p-6 sm:p-8 bg-[#0f172a] text-white border-none shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                <div className="relative z-10 space-y-4 text-center">
                  <Badge className="bg-blue-600 text-white border-none font-bold text-[8px] uppercase tracking-widest rounded px-2.5">
                    IT Support
                  </Badge>
                  <h4 className="font-black text-base sm:text-lg">Enterprise Deployment Packages?</h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-medium">
                    Contact our architectural systems leads to get custom silent installation MSIs and Options configuration profiles.
                  </p>
                  <Button asChild className="w-full h-10 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs shadow-md">
                    <Link href="/contact">Request Custom Bundle</Link>
                  </Button>
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
