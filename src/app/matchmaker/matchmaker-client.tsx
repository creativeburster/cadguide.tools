'use client';

import { useState, useMemo, useEffect } from 'react';
import { tools, categories } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ToolLogo } from '@/components/tool-logo';
import Link from 'next/link';

export default function MatchmakerPage({ validCompareSlugs = [] }: { validCompareSlugs?: string[] }) {
  const [step, setStep] = useState(1);
  const [isDeepMatch, setIsDeepMatch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const validCompareSet = useMemo(() => new Set(validCompareSlugs), [validCompareSlugs]);
  
  const [selections, setSelections] = useState({
    industry: '',
    platform: '',
    budget: '',
    orgSize: '',
    workflow: '',
    experience: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);

  const handleSelection = (key: string, value: string) => {
    setSelections((prev) => ({ ...prev, [key]: value }));
    if (!isDeepMatch && step === 3) {
      setStep(100); // Result page
    } else if (isDeepMatch && step === 6) {
      setStep(100);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const startDeepMatch = () => {
    setIsDeepMatch(true);
    setStep(4);
  };

  const reset = () => {
    setStep(1);
    setIsDeepMatch(false);
    setSearchQuery('');
    setSelections({
      industry: '',
      platform: '',
      budget: '',
      orgSize: '',
      workflow: '',
      experience: '',
    });
  };

  const filteredRecommendations = useMemo(() => {
    return tools
      .map((tool) => {
        let score = 0;
        const maxScore = 100;

        // 1. Industry Fit (30 points)
        if (!selections.industry) {
          score += 30;
        } else {
          const selectedInd = selections.industry.toLowerCase();
          const hasExactIndustry = tool.industries.some((i) =>
            i.toLowerCase().includes(selectedInd)
          );
          if (hasExactIndustry) {
            score += 30;
          } else {
            // General drafting tools like AutoCAD, BricsCAD, DraftSight work for any industry
            const isGeneralDrafting = tool.industries.some(
              (i) =>
                i.toLowerCase().includes('general') ||
                i.toLowerCase().includes('drafting')
            );
            if (selectedInd === 'architecture' && tool.category_id === 'c3') {
              score += 25; // BIM matches architecture closely
            } else if (
              selectedInd === 'manufacturing' &&
              (tool.category_id === 'c2' || tool.category_id === 'c5')
            ) {
              score += 25; // 3D modeling and CAE match manufacturing
            } else if (selectedInd === 'electrical engineering' && tool.category_id === 'c6') {
              score += 25; // EDA matches electrical
            } else if (isGeneralDrafting) {
              score += 18; // general purpose tools are good backups
            } else {
              score += 5; // minimum fallback matching
            }
          }
        }

        // 2. Platform Compatibility (25 points)
        if (!selections.platform) {
          score += 25;
        } else {
          const hasNative = tool.platforms.includes(selections.platform);
          if (hasNative) {
            score += 25;
          } else if (tool.platforms.includes('Web')) {
            score += 22; // Web-native SaaS platforms run anywhere via browser
          } else if (selections.platform === 'macOS' && (tool.platforms.includes('iOS') || tool.platforms.includes('iPadOS'))) {
            score += 15; // Apple ecosystem synergy
          } else {
            score += 2; // emulation required
          }
        }

        // 3. Budget Alignment (20 points)
        if (!selections.budget || selections.budget === 'any') {
          score += 20;
        } else if (selections.budget === 'free') {
          if (
            tool.starting_price === 0 ||
            tool.pricing_type === 'Free' ||
            tool.pricing_type === 'Open Source'
          ) {
            score += 20;
          } else if (tool.pricing_type === 'Freemium') {
            score += 14; // Freemium offers a solid free layer
          } else {
            score += 0;
          }
        } else if (selections.budget === 'low') {
          if (
            tool.starting_price === 0 ||
            tool.pricing_type === 'Free' ||
            tool.pricing_type === 'Open Source'
          ) {
            score += 20; // free is low budget
          } else if (tool.starting_price < 1000) {
            score += 20; // meets criteria strictly
          } else if (tool.starting_price < 2000) {
            score += 12; // slightly higher budget but competitive
          } else {
            score += 0;
          }
        }

        // 4. Core Workflow Matching (15 points)
        if (!selections.workflow) {
          score += 15;
        } else {
          const matchWF =
            (selections.workflow === '2D' && tool.category_id === 'c1') ||
            (selections.workflow === '3D' && tool.category_id === 'c2') ||
            (selections.workflow === 'BIM' && tool.category_id === 'c3');
          if (matchWF) {
            score += 15;
          } else {
            // General drafting tools c1 support 3D/BIM workflows partially
            if (selections.workflow === 'BIM' && tool.category_id === 'c1') {
              score += 8;
            } else if (selections.workflow === '3D' && tool.category_id === 'c1') {
              score += 10;
            } else if (selections.workflow === '3D' && tool.category_id === 'c7') {
              score += 10; // rendering is highly related to 3D modeling
            } else {
              score += 4;
            }
          }
        }

        // 5. Team / Org Scale (5 points)
        if (!selections.orgSize) {
          score += 5;
        } else {
          if (tool.user_scales.includes(selections.orgSize)) {
            score += 5;
          } else {
            score += 2;
          }
        }

        // 6. Experience Level (5 points)
        if (!selections.experience) {
          score += 5;
        } else {
          const exp = selections.experience.toLowerCase();
          if (exp === 'beginner') {
            if (
              tool.short_desc.toLowerCase().includes('easy') ||
              tool.short_desc.toLowerCase().includes('simple') ||
              tool.short_desc.toLowerCase().includes('intuitive') ||
              tool.score > 4.5
            ) {
              score += 5;
            } else {
              score += 3;
            }
          } else {
            score += 5; // Professionals can handle any tool in our database
          }
        }

        // Normalize to percentage
        const matchPercentage = Math.min(
          100,
          Math.max(0, Math.round((score / maxScore) * 100))
        );

        return {
          ...tool,
          matchPercentage,
        };
      })
      .filter((tool) => {
        // Apply search input query if typed in results
        if (!searchQuery) return true;
        const normalize = (str: string) =>
          str.toLowerCase().replace(/[-\s]+/g, '');
        const normalizedQuery = normalize(searchQuery);
        return (
          normalize(tool.name).includes(normalizedQuery) ||
          normalize(tool.short_desc).includes(normalizedQuery)
        );
      })
      // Sort primarily by match strength (percentage), then fall back to Editor Score
      .sort((a, b) => b.matchPercentage - a.matchPercentage || b.score - a.score);
  }, [selections, searchQuery]);

  const topMatches = filteredRecommendations.slice(0, 3);

  return (
    <main className="container mx-auto px-4 py-12 min-h-screen">
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        
        {step <= 6 && (
          <div className="text-center mb-16">
            <Badge className="bg-blue-600/10 text-blue-700 border-none px-4 py-1 mb-6 font-bold uppercase tracking-widest text-[10px]">
              AI Recommendation Engine
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">Find Your Perfect CAD Match</h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              Our smart algorithm analyzes your specific needs to recommend the most efficient tools for your workflow.
            </p>
          </div>
        )}

        {/* Quiz Steps */}
        {step === 1 && (
          <StepCard 
            title="What is your primary industry?" 
            desc="We'll filter tools specialized for your specific field of work."
            step={step}
            isDeepMatch={isDeepMatch}
            onPreviousStep={() => step > 1 && setStep(step - 1)}
          >
            {[
              'Architecture', 'Manufacturing', 'Civil Engineering', 
              'Electrical Engineering', 'Jewelry Design', 'Dental', 
              'Woodworking', 'Shipbuilding', 'Fashion', 'VFX'
            ].map(item => (
              <Button key={item} variant="outline" className="h-16 text-sm font-bold rounded-xl border-slate-100 hover:border-blue-600 hover:bg-blue-50 transition-all px-4" onClick={() => handleSelection('industry', item)}>
                {item === 'Architecture' ? 'Architecture & AEC' : 
                 item === 'Manufacturing' ? 'Mechanical & Mfg' : 
                 item === 'Dental' ? 'Dental & Medical' : 
                 item === 'Woodworking' ? 'Wood & Cabinetry' : item}
              </Button>
            ))}
          </StepCard>
        )}

        {step === 2 && (
          <StepCard 
            title="Which platform do you use?" 
            desc="Native performance depends on choosing the right operating system."
            step={step}
            isDeepMatch={isDeepMatch}
            onPreviousStep={() => step > 1 && setStep(step - 1)}
          >
            {['Windows', 'macOS', 'Linux', 'Web'].map(item => (
              <Button key={item} variant="outline" className="h-20 text-lg font-bold rounded-2xl border-slate-100 hover:border-blue-600 hover:bg-blue-50 transition-all" onClick={() => handleSelection('platform', item)}>
                {item}
              </Button>
            ))}
          </StepCard>
        )}

        {step === 3 && (
          <StepCard 
            title="What is your budget preference?" 
            desc="From free open-source to high-end enterprise solutions."
            step={step}
            isDeepMatch={isDeepMatch}
            onPreviousStep={() => step > 1 && setStep(step - 1)}
          >
            <Button variant="outline" className="h-20 text-lg font-bold rounded-2xl border-slate-100 hover:border-blue-600 hover:bg-blue-50 transition-all" onClick={() => handleSelection('budget', 'free')}>Totally Free</Button>
            <Button variant="outline" className="h-20 text-lg font-bold rounded-2xl border-slate-100 hover:border-blue-600 hover:bg-blue-50 transition-all" onClick={() => handleSelection('budget', 'low')}>Under $1,000/yr</Button>
            <Button variant="outline" className="h-20 text-lg font-bold rounded-2xl border-slate-100 hover:border-blue-600 hover:bg-blue-50 transition-all" onClick={() => handleSelection('budget', 'any')}>Any Budget</Button>
          </StepCard>
        )}

        {step === 4 && (
          <StepCard 
            title="What is your team size?" 
            desc="Some tools are built for solo makers, others for massive enterprises."
            step={step}
            isDeepMatch={isDeepMatch}
            onPreviousStep={() => step > 1 && setStep(step - 1)}
          >
            {['Individuals', 'Mid-Market', 'Enterprise'].map(item => (
              <Button key={item} variant="outline" className="h-20 text-lg font-bold rounded-2xl border-slate-100 hover:border-blue-600 hover:bg-blue-50 transition-all" onClick={() => handleSelection('orgSize', item)}>
                {item}
              </Button>
            ))}
          </StepCard>
        )}

        {step === 5 && (
          <StepCard 
            title="What is your core workflow?" 
            desc="Focusing on the right dimension speeds up your design process."
            step={step}
            isDeepMatch={isDeepMatch}
            onPreviousStep={() => step > 1 && setStep(step - 1)}
          >
            {['2D', '3D', 'BIM'].map(item => (
              <Button key={item} variant="outline" className="h-20 text-lg font-bold rounded-2xl border-slate-100 hover:border-blue-600 hover:bg-blue-50 transition-all" onClick={() => handleSelection('workflow', item)}>
                {item === '2D' ? '2D Drafting' : item === '3D' ? '3D Modeling' : 'BIM Architecture'}
              </Button>
            ))}
          </StepCard>
        )}

        {step === 6 && (
          <StepCard 
            title="What is your experience level?" 
            desc="We'll match you with tools that fit your technical expertise."
            step={step}
            isDeepMatch={isDeepMatch}
            onPreviousStep={() => step > 1 && setStep(step - 1)}
          >
            {['Beginner', 'Intermediate', 'Professional'].map(item => (
              <Button key={item} variant="outline" className="h-20 text-lg font-bold rounded-2xl border-slate-100 hover:border-blue-600 hover:bg-blue-50 transition-all" onClick={() => handleSelection('experience', item)}>
                {item}
              </Button>
            ))}
          </StepCard>
        )}

        {/* Results Page */}
        {step === 100 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Perfect Matches Found
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Your Custom Recommendations</h2>
              <p className="text-slate-500 font-medium">Based on your {selections.industry} profile and {selections.platform} workflow.</p>
            </div>

            {topMatches.length > 0 ? (
              <div className="grid gap-8">
                {topMatches.map((tool, idx) => (
                  <Card key={tool.id} className={`p-8 rounded-[40px] border-none shadow-xl transition-all hover:-translate-y-1 group relative overflow-hidden bg-white ${idx === 0 ? 'ring-4 ring-blue-600/5' : ''}`}>
                    {idx === 0 && (
                      <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest z-10">
                        Top Recommendation
                      </div>
                    )}
                    <div className="flex flex-col xl:flex-row gap-10">
                      <div className="w-full xl:w-48 flex flex-col items-center gap-6">
                        <ToolLogo
                          slug={tool.slug} src={tool.logo_url}
                          websiteUrl={tool.official_url}
                          name={tool.name}
                          className="w-32 h-32 bg-white rounded-3xl border border-slate-50 shadow-xl shadow-slate-100 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="text-center w-full">
                          <div className="text-3xl font-black text-blue-600">{tool.matchPercentage}%</div>
                          <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Match Strength</div>
                          <div className="mt-2 text-xs font-bold text-amber-500 bg-amber-50 rounded-full py-1 px-2.5 inline-flex items-center gap-1 border border-amber-100">
                            ★ {tool.score.toFixed(1)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <h3 className="text-3xl font-black text-slate-900">{tool.name}</h3>
                          <Badge variant="outline" className="bg-slate-50 text-slate-500 font-bold uppercase tracking-widest text-[9px] px-3">{tool.pricing_type}</Badge>
                        </div>
                        <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium line-clamp-3">{tool.short_desc}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-8">
                          {tool.industries.map(ind => (
                            <span key={ind} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-[11px] font-bold">{ind}</span>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button asChild className="h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest flex-1 shadow-xl shadow-slate-200">
                            <Link href={`/tools/${tool.slug}`}>Read Full Expert Review</Link>
                          </Button>
                          <Button asChild variant="outline" className="h-14 rounded-2xl border-slate-200 font-black text-xs uppercase tracking-widest flex-1 hover:bg-slate-50">
                            <a href={tool.affiliate_url || tool.official_url} target="_blank" rel="nofollow noopener noreferrer" aria-label={`Visit official website of ${tool.name}`}>Go to Website</a>
                          </Button>
                        </div>
                        {/* Cross-type exploration pills */}
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-50">
                          {(() => {
                            if (idx !== 0 || topMatches.length < 2) return null;
                            const compareSlug = [tool.slug, topMatches[1].slug].sort().join('-vs-');
                            if (!validCompareSet.has(compareSlug)) return null;
                            return (
                              <Link
                                href={`/compare/${compareSlug}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-[10px] font-bold text-slate-500 transition-all"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                Compare with #{idx + 2}
                              </Link>
                            );
                          })()}
                          <Link
                            href={`/alternatives/${tool.slug}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-[10px] font-bold text-slate-500 transition-all"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            Alternatives
                          </Link>
                          <Link
                            href={`/guides?tool=${tool.slug}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-[10px] font-bold text-slate-500 transition-all"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            Expert Guides
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-[60px] border-2 border-dashed border-slate-200">
                <h2 className="text-2xl font-black text-slate-900 mb-4">No Direct Matches</h2>
                <p className="text-slate-500 font-medium mb-8">Your criteria might be too specific. Try broadening your budget or industry.</p>
                <Button onClick={reset} className="bg-blue-600 text-white rounded-2xl px-10 h-14 font-black text-xs uppercase">Start Over</Button>
              </div>
            )}

            {/* User Interaction Feedback - Unsatisfied? */}
            <div className="bg-slate-900 rounded-[32px] p-8 md:p-10 text-center text-white relative overflow-hidden mt-12 border border-white/5 max-w-3xl mx-auto">
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600 rounded-full blur-[120px] -mr-32 -mt-32 opacity-15"></div>
               <div className="relative z-10">
                 <h2 className="text-2xl md:text-3xl font-black mb-4 tracking-tight">Not satisfied with these results?</h2>
                 <p className="text-slate-400 text-sm md:text-base mb-8 font-medium leading-relaxed">
                   Unlock a <span className="text-blue-400">Deep Profile Match</span> for more precision, or search our entire index manually below.
                 </p>
                 
                 <div className="flex flex-col gap-6 items-center">
                   {/* Action Buttons Row */}
                   <div className="flex flex-wrap justify-center gap-4 w-full">
                     {!isDeepMatch && (
                       <Button onClick={startDeepMatch} className="bg-blue-600 hover:bg-blue-700 h-12 px-8 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-900/50 transition-all hover:scale-105 active:scale-95 whitespace-nowrap min-w-[180px] flex items-center justify-center text-white">
                         Unlock Deep Match
                       </Button>
                     )}
                     <Button variant="outline" asChild className="h-12 px-8 rounded-xl border-2 border-white/30 bg-white/5 text-white font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all whitespace-nowrap min-w-[180px] flex items-center justify-center">
                       <Link href="/tools">Full Directory</Link>
                     </Button>
                   </div>

                   {/* Search Row - Much more prominent */}
                   <div className="w-full max-w-lg relative">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-400">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                     </div>
                     <Input 
                        placeholder="Search CAD/BIM tools manually (e.g. 'parametric')..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-14 bg-white/20 border-2 border-blue-500/50 text-white placeholder:text-slate-400 rounded-xl pl-12 pr-4 text-sm focus:ring-4 focus:ring-blue-600/20 focus:border-blue-400 focus:bg-white/25 outline-none transition-all w-full shadow-2xl"
                     />
                     {searchQuery && (
                       <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl p-3 shadow-2xl text-slate-900 text-left border border-slate-100 animate-in fade-in zoom-in-95 duration-200 z-50">
                         <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2 border-b border-slate-50 pb-1">Search Results</div>
                         {filteredRecommendations.slice(0, 3).map(t => (
                           <Link key={t.id} href={`/tools/${t.slug}`} className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded-lg transition-all group">
                             <ToolLogo slug={t.slug} src={t.logo_url} websiteUrl={t.official_url} name={t.name} className="w-8 h-8 bg-slate-50 rounded shrink-0 border border-slate-100 group-hover:border-blue-200" />
                             <div className="flex-1 min-w-0">
                               <div className="font-black text-xs text-slate-900 truncate">{t.name}</div>
                               <div className="text-[8px] text-slate-400 font-bold uppercase">{t.pricing_type}</div>
                             </div>
                             <svg className="w-3 h-3 text-slate-300 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                           </Link>
                         ))}
                         {filteredRecommendations.length === 0 && (
                           <div className="p-2 text-center text-slate-400 text-[10px] font-bold">No results found</div>
                         )}
                       </div>
                     )}
                   </div>
                 </div>
               </div>
            </div>

            <div className="text-center pt-8">
              <Button variant="ghost" onClick={reset} className="text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-slate-900">
                Start Quiz From Scratch
              </Button>
            </div>
          </div>
        )}

        {/* Why Choose Our Matchmaker - Only shown during quiz steps */}
        {step <= 6 && (
          <div className="mt-16 pt-16 border-t border-slate-100 animate-in fade-in duration-500">
            <div className="text-center mb-12">
              <Badge className="bg-blue-600/10 text-blue-700 border-none px-4 py-1 mb-6 font-bold uppercase tracking-widest text-[10px]">
                Our Commitments
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                Why Use Our CAD Matchmaker?
              </h2>
              <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                We design our tools to respect your privacy and provide genuine value, free from marketing traps.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 hover:border-blue-200 transition-all group">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-lg mb-6 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">100% Privacy, Zero Spam</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  We will never ask for your email address or personal contact details. Get instant access to your recommendations without gatekeeping.
                </p>
              </div>

              <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 hover:border-blue-200 transition-all group">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-lg mb-6 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">EULA Audit Prevention</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Avoid costly software audit penalties. We evaluate tools against licensing risks and commercial policies to ensure compliance.
                </p>
              </div>

              <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 hover:border-blue-200 transition-all group">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-lg mb-6 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Objective & Unbiased</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Our algorithm processes technical benchmarks, active licensing formats, and hardware requirements, not vendor sponsorships.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Best Lists Section - Always visible */}
        <div className="mt-16 pt-16 border-t border-slate-100">
          <div className="text-center mb-12">
            <Badge className="bg-blue-600/10 text-blue-700 border-none px-4 py-1 mb-6 font-bold uppercase tracking-widest text-[10px]">
              Expert Rankings
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Explore Best Lists by Category</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">
              Curated rankings of top tools in each CAD category, based on expert scores and real customer reviews.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                href={`/best/${c.slug}`}
                className="block rounded-2xl bg-white border border-slate-200 hover:border-blue-300 p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Best {c.name} Software
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2">{c.description}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                  View ranking →
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="rounded-xl border-slate-200 font-bold text-xs uppercase tracking-widest">
              <Link href="/best">View All Best Lists</Link>
            </Button>
          </div>
        </div>

        {/* FAQ Section - Always visible */}
        <div className="mt-16 pt-16 border-t border-slate-100">
          <div className="text-center mb-12">
            <Badge className="bg-blue-600/10 text-blue-700 border-none px-4 py-1 mb-6 font-bold uppercase tracking-widest text-[10px]">
              Matchmaker Help & FAQ
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">
              Find quick answers to common questions about our matching process and CAD compatibility.
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid gap-6">
            <div className="bg-white rounded-[24px] p-6 md:p-8 border border-slate-100 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900 mb-2">How does the matching algorithm work?</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Our recommendation engine uses a weighted scoring model to match your inputs. Industry requirements account for 30% of the score, operating system compatibility represents 25%, budget preferences take up 20%, and your specific drafting workflow contributes 15%. The remaining 10% is divided between team size fit and user experience levels.
              </p>
            </div>

            <div className="bg-white rounded-[24px] p-6 md:p-8 border border-slate-100 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900 mb-2">What is the difference between Quick Match and Deep Match?</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Quick Match is designed for speed, asking 3 critical questions (Industry, OS, and Budget) to immediately identify your top recommendations. Deep Match expands this checklist to 6 questions, factoring in team scalability, native 2D/3D workflows, and CAD drafting experience to pinpoint highly-specialized alternatives.
              </p>
            </div>

            <div className="bg-white rounded-[24px] p-6 md:p-8 border border-slate-100 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900 mb-2">Are the recommended CAD tools fully compatible with DWG/DXF?</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Yes. Seamless data exchange is critical for CAD workflows. Every recommended tool in our index natively supports DWG and DXF standard formats, allowing you to import and export drawings without losing parametric blocks, layers, or scale factors when collaborating with other engineering teams.
              </p>
            </div>

            <div className="bg-white rounded-[24px] p-6 md:p-8 border border-slate-100 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900 mb-2">Is the CAD Matchmaker tool free to use?</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Yes, our Matchmaker service is completely free to use. We do not lock results behind paywalls or require email sign-ups. Our primary goal is to guide CAD professionals toward the most efficient and cost-effective software solutions for their design environments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

interface StepCardProps {
  title: string;
  desc: string;
  step: number;
  isDeepMatch: boolean;
  onPreviousStep: () => void;
  children: React.ReactNode;
}

function StepCard({ title, desc, step, isDeepMatch, onPreviousStep, children }: StepCardProps) {
  return (
    <Card className="border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] rounded-[40px] p-8 md:p-12 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-200">
            {step}
          </div>
          <div>
            <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Matchmaker Question</div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
          </div>
        </div>
        <p className="text-slate-500 font-medium mb-10 text-lg">{desc}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {children}
        </div>
        <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between">
          <Button variant="ghost" onClick={onPreviousStep} className="text-slate-400 font-bold hover:text-slate-900">
            Previous Step
          </Button>
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            {isDeepMatch ? `Step ${step} of 6` : `Step ${step} of 3`}
          </div>
        </div>
      </div>
    </Card>
  );
}

