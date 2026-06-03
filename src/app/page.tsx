import { tools } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Metadata } from 'next';
import { ToolLogo } from '@/components/tool-logo';
import { pageMetadata, websiteLd, organizationLd } from '@/lib/seo';
import { SmartSearch } from '@/components/SmartSearch';

export const metadata: Metadata = pageMetadata({
  title: `CADGuide.tools: Compare 235+ Best CAD Software ${new Date().getFullYear()} (Free & Pro)`,
  description:
    'Find the perfect design tool. Compare 235+ professional CAD software for 2D/3D, BIM, and specialized industries. Expert reviews, pricing, and our smart Matchmaker.',
  path: '/',
});

export default function Home() {
  const websiteLdData = websiteLd();
  const organizationLdData = organizationLd();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLdData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLdData) }}
      />
      <HomeBody />
    </>
  );
}

const INDUSTRY_STANDARD_SLUGS = [
  'autocad',
  'solidworks',
  'revit',
  'rhino-3d',
  'altium-designer',
  'siemens-nx'
];

const BIM_SLUGS = [
  'revit',
  'tekla-structures',
  'archicad',
  'civil-3d',
  'chief-architect',
  'vectorworks',
  'allplan',
  'openroads-designer',
  'vectorworks-landmark'
];

const VERTICAL_GEM_SLUGS = [
  'matrixgold',
  'exocad',
  'clo-3d',
  'cabinet-vision',
  'substance-painter',
  'marvelous-designer',
  'aveva-marine',
  'wysiwyg',
  'land-fx',
  'prusaslicer',
  'bambu-studio',
  '3design'
];

function HomeBody() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden w-full">
      {/* Hero Section - Deep ocean blue */}
      <section className="bg-gradient-to-br from-blue-950 via-[#0a192f] to-blue-900 text-white pt-24 pb-32 relative overflow-hidden w-full px-4">
        {/* Abstract background elements - pure blue glow effect */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/30 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] -ml-40 -mb-40"></div>
        
        <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 border border-white/20 px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold mb-10 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
            </span>
            Verified & Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-8 tracking-tight leading-[1.1] break-words">
            Compare and Find Your <span className="text-blue-400">Perfect CAD</span> Software.
          </h1>
          <p className="text-lg sm:text-xl text-blue-100/70 mb-14 max-w-2xl mx-auto leading-relaxed">
            Independent reviews, transparent pricing, and deep technical specs for professional CAD & BIM software.
          </p>
          
          {/* Advanced Interactive Smart Search */}
          <div className="max-w-3xl mx-auto w-full">
            <SmartSearch />
          </div>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 px-4">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-600 hover:text-white border-none font-bold h-14 rounded-xl transition-all">
              <Link href="/matchmaker">Try Smart Matchmaker</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-blue-400/50 text-white hover:bg-white/10 font-bold h-14 rounded-xl">
              <Link href="/tools">Explore All Tools</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 1. TOP RATED SHELF */}
      <section className="max-w-[1360px] mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10 gap-4 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">Industry Standards</h2>
            <p className="text-sm text-slate-400 font-medium mt-1">The most trusted and highest-rated CAD platforms worldwide.</p>
          </div>
          <Button asChild variant="ghost" className="text-blue-600 font-bold p-0 hover:bg-transparent shrink-0">
            <Link href="/tools" className="flex items-center gap-1 text-sm sm:text-base transition-transform hover:translate-x-1">Full Directory →</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INDUSTRY_STANDARD_SLUGS.map(slug => tools.find(t => t.slug === slug)).filter((t): t is typeof tools[number] => !!t).map((tool) => (
            <Card key={tool.id} className="overflow-hidden border-2 hover:border-blue-600 transition-all group relative rounded-[32px] bg-white shadow-sm hover:shadow-xl">
              <div className="p-8">
                <div className="flex items-center gap-5 mb-6">
                  <ToolLogo 
                    slug={tool.slug} src={tool.logo_url} 
                    websiteUrl={tool.official_url}
                    name={tool.name}
                    priority={true}
                    className="w-16 h-16 border border-slate-100 rounded-2xl shrink-0 shadow-sm" 
                  />
                  <div>
                    <h3 className="font-black text-xl group-hover:text-blue-600 transition-colors">
                      <Link href={`/tools/${tool.slug}`}>{tool.name}</Link>
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-yellow-500 text-sm font-black">★ {tool.score}</span>
                      <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-widest h-5 bg-slate-50">{tool.pricing_type}</Badge>
                    </div>
                  </div>
                </div>
                <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-8 leading-relaxed">
                  {tool.short_desc}
                </p>
                <div className="flex gap-3">
                  <Button asChild variant="outline" className="flex-1 rounded-xl font-bold text-xs h-11">
                    <Link href={`/tools/${tool.slug}`}>Review</Link>
                  </Button>
                  <Button asChild className="flex-1 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold text-xs h-11">
                    <a href={tool.affiliate_url || tool.official_url} target="_blank" rel="nofollow noopener noreferrer">Website</a>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 2. BIM & AEC SHELF - Light Gray Background */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
               </div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">Trending BIM Solutions</h2>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BIM_SLUGS.map(slug => tools.find(t => t.slug === slug)).filter((t): t is typeof tools[number] => !!t).map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.slug}`} className="group bg-white p-5 rounded-[24px] border border-slate-200/60 hover:border-blue-100 hover:shadow-xl transition-all flex items-start gap-4">
                <ToolLogo 
                  slug={tool.slug} src={tool.logo_url} 
                  websiteUrl={tool.official_url}
                  name={tool.name} 
                  className="w-14 h-14 rounded-xl border border-slate-100 shadow-sm shrink-0 bg-white transition-all group-hover:scale-105 group-hover:shadow-md" 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-black text-slate-900 group-hover:text-blue-600 text-sm sm:text-base transition-colors truncate">{tool.name}</h3>
                    <span className="text-yellow-500 text-xs font-black shrink-0">★ {tool.score}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{tool.pricing_type} • AEC Industry</p>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1.5 font-medium leading-relaxed">{tool.short_desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. VERTICAL GEMS - Dark Blue Background */}
      <section className="bg-[#0a192f] py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="max-w-[1360px] mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">Specialized Vertical Gems</h2>
            <p className="text-blue-200/50 max-w-2xl mx-auto font-medium">Deep-industry specific tools that redefine professional efficiency in niche sectors.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {VERTICAL_GEM_SLUGS.map(slug => tools.find(t => t.slug === slug)).filter((t): t is typeof tools[number] => !!t).map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.slug}`} className="group bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-white/10 hover:border-blue-400/50 transition-all text-center">
                <ToolLogo 
                  slug={tool.slug} src={tool.logo_url} 
                  websiteUrl={tool.official_url}
                  name={tool.name} 
                  className="w-16 h-16 mx-auto rounded-xl mb-4 transition-all bg-white shadow-lg group-hover:scale-110" 
                />
                <div className="text-[10px] font-black text-white uppercase tracking-tighter truncate">{tool.name}</div>
                <div className="text-[8px] text-blue-400 font-bold mt-1">{tool.industries[0]}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white text-slate-900 py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4 tracking-tight">Independent & Objective Analysis</h2>
          <p className="text-slate-500 mb-12 max-w-2xl mx-auto text-lg font-medium leading-relaxed">We don't accept paid rankings. Our scores are derived from technical parameters, user feedback, and market performance.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="text-blue-600 text-5xl font-black mb-2">240+</div>
              <div className="text-slate-900 font-black uppercase tracking-widest text-xs">Tools Indexed</div>
            </div>
            <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="text-blue-600 text-5xl font-black mb-2">100%</div>
              <div className="text-slate-900 font-black uppercase tracking-widest text-xs">Neutral Data</div>
            </div>
            <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="text-blue-600 text-5xl font-black mb-2">Free</div>
              <div className="text-slate-900 font-black uppercase tracking-widest text-xs">Always Open</div>
            </div>
          </div>
        </div>
      </section>
      {/* Browse by … Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100 font-black uppercase text-[10px] tracking-[0.25em] py-1 px-3 rounded-full">Discover</Badge>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Browse Tools & Guides by …</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              Slice the catalog by role, platform, file format, or pricing — every angle has its own curated guide.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <Link href="/for" className="block p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="text-xs uppercase tracking-wider text-blue-600 font-black">17 roles</div>
              <div className="mt-1 text-lg font-black text-slate-900">By Role</div>
              <div className="mt-1 text-xs text-slate-500">Architects, engineers, students…</div>
            </Link>
            <Link href="/sectors" className="block p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="text-xs uppercase tracking-wider text-blue-600 font-black">16 sectors</div>
              <div className="mt-1 text-lg font-black text-slate-900">By Sector</div>
              <div className="mt-1 text-xs text-slate-500">Aerospace, automotive, civil structures…</div>
            </Link>
            <Link href="/platforms" className="block p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="text-xs uppercase tracking-wider text-blue-600 font-black">6 platforms</div>
              <div className="mt-1 text-lg font-black text-slate-900">By Platform</div>
              <div className="mt-1 text-xs text-slate-500">Windows, Mac, Linux, Web, iOS, Android</div>
            </Link>
            <Link href="/file-formats" className="block p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="text-xs uppercase tracking-wider text-blue-600 font-black">29 formats</div>
              <div className="mt-1 text-lg font-black text-slate-900">By File Format</div>
              <div className="mt-1 text-xs text-slate-500">DWG, STEP, STL, IFC, DXF…</div>
            </Link>
            <Link href="/pricing" className="block p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="text-xs uppercase tracking-wider text-blue-600 font-black">7 categories</div>
              <div className="mt-1 text-lg font-black text-slate-900">By Pricing & License</div>
              <div className="mt-1 text-xs text-slate-500">Free, perpetual buyouts, floating networks, student access…</div>
            </Link>
            <Link href="/compare#disciplines" className="block p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="text-xs uppercase tracking-wider text-blue-600 font-black">5 disciplines</div>
              <div className="mt-1 text-lg font-black text-slate-900">By Discipline</div>
              <div className="mt-1 text-xs text-slate-500">Side-by-side spec matches and competitor guides by engineering field…</div>
            </Link>
            <Link href="/alternatives" className="block p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="text-xs uppercase tracking-wider text-blue-600 font-black">Switchover Guides</div>
              <div className="mt-1 text-lg font-black text-slate-900">Alternatives</div>
              <div className="mt-1 text-xs text-slate-500">Curated switch-away guides per tool</div>
            </Link>
            <Link href="/best#by-feature" className="block p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-bl-lg">New</div>
              <div className="text-xs uppercase tracking-wider text-blue-600 font-black">16 Features</div>
              <div className="mt-1 text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">By Feature</div>
              <div className="mt-1 text-xs text-slate-500">16 technical spotlights + 7 discipline reviews</div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50 -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-700 rounded-full blur-3xl opacity-50 -ml-32 -mb-32"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Can't Find Your Preferred Software?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Our directory is growing every day. If you want us to review a specific tool, or if you're a vendor, let us know.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-600 hover:text-white font-bold px-10 h-14 text-lg rounded-2xl shadow-xl shadow-blue-900/20 transition-all">
              <Link href="/sponsor">Submit or Claim a Tool</Link>
            </Button>
            <Button asChild size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold px-10 h-14 text-lg rounded-2xl">
              <Link href="/matchmaker">Talk to Expert</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
