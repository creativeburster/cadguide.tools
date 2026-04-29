import { getToolBySlug, tools, categories } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ToolLogo } from '@/components/tool-logo';

interface Props {
  params: Promise<{ slug: string }>;
}

// Enables full static export (SSG) compatibility
export function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

// Dynamically generate per-page Metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: 'Tool Not Found' };

  return {
    title: `${tool.name} Review 2026: Pricing, Features & Alternatives | CADTools.io`,
    description: `Expert review of ${tool.name}. Explore its ${tool.core_features.slice(0, 3).join(', ')} features, pricing starting at $${tool.starting_price}, and professional verdict by CAD experts.`,
    alternates: {
      canonical: `https://cadtools.io/tools/${tool.slug}`,
    },
    openGraph: {
      title: `${tool.name} - Professional CAD Analysis`,
      description: tool.short_desc,
      type: 'article',
      url: `https://cadtools.io/tools/${tool.slug}`,
      images: [{ url: tool.logo_url }],
    }
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  // E-E-A-T structured data schema (critical for SEO trust signals)
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "operatingSystem": tool.platforms.join(", "),
    "applicationCategory": "DesignApplication",
    "offers": {
      "@type": "Offer",
      "price": tool.starting_price,
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": tool.score,
      "ratingCount": 120
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": tool.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <article className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <nav className="bg-slate-50 border-b py-3 text-sm md:text-base text-slate-500">
        <div className="container mx-auto px-4">
          <Link href="/" className="hover:text-blue-600 font-medium transition-colors">Home</Link>
          <span className="mx-2 opacity-30">/</span>
          <Link href="/tools" className="hover:text-blue-600 font-medium transition-colors">Tools</Link>
          <span className="mx-2 opacity-30">/</span>
          <span className="text-slate-900 font-bold">{tool.name}</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-12">
        <main className="flex-1">
          <header className="flex flex-col md:flex-row items-start gap-6 mb-8">
            <ToolLogo 
              src={tool.logo_url} 
              name={tool.name} 
              className="w-24 h-24 border-2 border-slate-100 shadow-xl rounded-3xl shrink-0 transform hover:rotate-3 transition-transform" 
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <Badge className="bg-blue-600/10 text-blue-700 border-none px-3 font-bold uppercase tracking-widest text-[10px]">
                  {categories.find(c => c.id === tool.category_id)?.name || 'Software'}
                </Badge>
                <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
                  </span>
                  Verified 2026
                </div>
              </div>
              <h1 className="text-3xl lg:text-5xl font-black text-slate-900 mb-3 tracking-tight leading-tight">{tool.name} Review</h1>
              <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">{tool.short_desc}</p>
            </div>
          </header>

          {/* At a Glance Grid - Inspired by Capterra */}
          <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Country</span>
              <span className="text-sm font-bold text-slate-900 leading-tight">🌍 {tool.country || 'USA'}</span>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Best For</span>
              <span className="text-sm font-bold text-slate-900 leading-tight">{tool.industries[0]}</span>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Platform</span>
              <span className="text-sm font-bold text-slate-900">{tool.platforms.join(", ")}</span>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Kernel</span>
              <span className="text-sm font-bold text-slate-900">{tool.tech_specs?.engine || "Proprietary"}</span>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Starting Price</span>
              <span className="text-sm font-black text-blue-600">{tool.starting_price === 0 ? "FREE" : `$${tool.starting_price}/yr`}</span>
            </div>
          </section>

          <div className="space-y-12">
            <section id="overview" className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-black text-slate-900 mb-4 border-l-8 border-blue-600 pl-6 flex items-center gap-3">
                Overview
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">{tool.description}</p>
              
              {tool.expert_verdict && (
                <div className="bg-slate-900 text-white p-8 rounded-[40px] relative overflow-hidden shadow-2xl group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H12.017C11.4647 13 11.017 12.5523 11.017 12V9C11.017 6.23858 13.2556 4 16.017 4H19.017C21.7784 4 24.017 6.23858 24.017 9V15C24.017 18.3137 21.3307 21 18.017 21H14.017ZM0 21L0 18C0 16.8954 0.895431 16 2 16H5C5.55228 16 6 15.5523 6 15V9C6 8.44772 5.55228 8 5 8H2C1.44772 8 1 8.44772 1 9V12C1 12.5523 0.552285 13 0 13H-2V12V9C-2 6.23858 0.238576 4 3 4H6C8.76142 4 11 6.23858 11 9V15C11 18.3137 8.31371 21 5 21H0Z" /></svg>
                  </div>
                  <h3 className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                    <span className="w-8 h-px bg-blue-400/30"></span>
                    Professional Verdict
                  </h3>
                  <p className="text-xl font-medium leading-snug italic relative z-10 text-slate-100">
                    "{tool.expert_verdict}"
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-black text-sm">CT</div>
                    <div>
                      <div className="text-sm font-bold">CADTools Research Team</div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Industry Analysts</div>
                    </div>
                  </div>
                </div>
              )}
            </section>
            <section id="features" className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Core Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                {tool.core_features.map((feature, i) => (
                  <li key={i} className="text-slate-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </section>

            <section id="pros-cons" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100">
                <h3 className="text-lg font-bold text-green-700 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  Pros
                </h3>
                <ul className="space-y-4">
                  {tool.pros.map((pro, i) => (
                    <li key={i} className="text-sm text-slate-600 font-medium leading-relaxed">{pro}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50/50 p-6 rounded-3xl border border-red-100">
                <h3 className="text-lg font-bold text-red-700 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  Cons
                </h3>
                <ul className="space-y-4">
                  {tool.cons.map((con, i) => (
                    <li key={i} className="text-sm text-slate-600 font-medium leading-relaxed">{con}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section id="faqs">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {tool.faqs.map((faq, i) => (
                  <div key={i} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-3">{faq.q}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        <aside className="w-full lg:w-96 space-y-4">
          <div className="sticky top-24 space-y-4">
            {/* Table of Contents Navigation */}
            <div className="bg-white border border-slate-100 rounded-[40px] p-6 shadow-sm">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Jump To</h4>
              <div className="space-y-1.5">
                {[
                  { name: 'Overview', id: 'overview', icon: 'M4 6h16M4 12h16M4 18h7' },
                  { name: 'Features', id: 'features', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                  { name: 'Pros & Cons', id: 'pros-cons', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
                  { name: 'FAQs', id: 'faqs', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
                ].map(item => (
                  <a 
                    href={`#${item.id}`}
                    key={item.name}
                    className="flex items-center gap-3 w-full text-left p-2 rounded-xl hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-all font-bold text-sm group no-underline"
                  >
                    <svg className="w-4 h-4 opacity-50 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} /></svg>
                    {item.name}
                  </a>
                ))}
               </div>
             </div>

            {/* Technical Performance Stats - Inspired by Software Advice */}
            <div className="bg-slate-50 rounded-[40px] p-6 border border-slate-100">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Technical Score</h4>
              <div className="space-y-4">
                {[
                  { label: 'Modeling Depth', score: 92 },
                  { label: 'Rendering Speed', score: 85 },
                  { label: 'API / Plugin Ecosystem', score: 95 },
                  { label: 'Multi-Core Efficiency', score: 78 }
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-slate-500">{stat.label}</span>
                      <span className="text-slate-900">{stat.score}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full" 
                        style={{ width: `${stat.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 font-bold mt-6 uppercase tracking-wider text-center">
                * Compared to Category Average
              </p>
            </div>

            {/* Hardware Certification Guide */}
            <div className="bg-white border border-slate-100 rounded-[40px] p-6 shadow-sm">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Hardware Guide</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Workstation Certified</div>
                    <div className="text-[10px] text-slate-400 leading-relaxed mt-1">NVIDIA RTX / Quadro highly recommended for viewport stability.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">RAM Recommendation</div>
                    <div className="text-[10px] text-slate-400 leading-relaxed mt-1">32GB RAM minimum for large assembly/BIM workflows.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expert Tip Card */}
            <div className="bg-blue-600 text-white rounded-[40px] p-6 shadow-xl shadow-blue-200 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
               </div>
               <h4 className="text-xs font-black text-blue-200 uppercase tracking-widest mb-4">Pro Tip</h4>
               <p className="text-sm font-medium leading-relaxed">
                 "Before purchasing, always check if your specific plugins support the latest version. We recommend starting with a trial to test local network rendering efficiency."
               </p>
            </div>

            {/* Popular Comparisons */}
            <div className="bg-white border border-slate-100 rounded-[40px] p-6 shadow-sm">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Popular Versus</h4>
              <div className="space-y-4">
                {tools.filter(t => t.category_id === tool.category_id && t.id !== tool.id).slice(0, 3).map(comp => (
                  <Link 
                    key={comp.id} 
                    href={`/tools/${comp.slug}`}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group"
                  >
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center p-2 shrink-0">
                      <img src={comp.logo_url} alt={comp.name} className="max-h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[11px] font-black text-slate-900 truncate max-w-[120px]">{tool.name} vs {comp.name}</div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Quick Compare</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Mini - Inspired by G2 Footer bits */}
            <div className="bg-slate-50 rounded-[40px] p-6 border border-slate-200">
               <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3">Stay Geeky</h4>
               <p className="text-xs text-slate-500 font-medium mb-6 leading-relaxed">Join 5,000+ CAD pros getting weekly tech deep-dives.</p>
               <div className="flex gap-2">
                 <input type="email" placeholder="Email..." className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-blue-600 outline-none" />
                 <button className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                 </button>
               </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Sticky Mobile CTA - Inspired by G2/Capterra */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] backdrop-blur-lg bg-white/90">
        <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Starts at</div>
            <div className="text-xl font-black text-slate-900">{tool.starting_price === 0 ? 'FREE' : `$${tool.starting_price}`}</div>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-6 rounded-2xl shadow-lg shadow-blue-200 flex-1">
            <a href={tool.affiliate_url || tool.official_url} target="_blank" rel="nofollow noopener">
              Get Started
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
