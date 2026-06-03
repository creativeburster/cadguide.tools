'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { tools } from '@/lib/data';
import { ToolLogo } from '@/components/tool-logo';
import { NewsletterSubscribe } from '@/components/newsletter-subscribe';

interface Deal {
  id: string;
  toolId: string;
  title: string;
  description: string;
  discount: string;
  code?: string;
  expires?: string;
  type: 'Promo' | 'Evergreen' | 'FreeStudent';
  link: string;
}

const activeDeals: Deal[] = [
  // 1. Promo Codes & Sales
  {
    id: 'd-progecad',
    toolId: 't57', // progeCAD Pro
    title: 'progeCAD Professional Discount',
    description: 'Get the highly versatile, DWG-compatible AutoCAD alternative with an additional discount for new perpetual licenses.',
    discount: '15% OFF Perpetual',
    type: 'Promo',
    code: 'PROGE15',
    link: 'https://www.progecad.com/buy',
  },
  {
    id: 'd-dwgfastview',
    toolId: 't53', // DWG FastView
    title: 'DWG FastView Premium Upgrade',
    description: 'Unlock full features, cloud storage, and remove ads across mobile, web, and desktop clients.',
    discount: '30% OFF Annual',
    type: 'Promo',
    code: 'FASTVIEW30',
    link: 'https://en.dwgfastview.com/upgrade',
  },
  {
    id: 'd-nanocad',
    toolId: 't56', // nanoCAD
    title: 'nanoCAD Pro Subscription Sale',
    description: 'Introductory price for new professional subscribers. Pro-grade CAD with parametric 3D modeling and 3D constraints.',
    discount: '20% OFF New Sub',
    type: 'Promo',
    link: 'https://nanocad.com/buy/',
  },
  {
    id: 'd-turbocad',
    toolId: 't62', // TurboCAD
    title: 'TurboCAD Platinum Discount',
    description: 'Special pricing on the all-in-one professional design suite. Powerful 2D drafting and 3D surface/solid modeling.',
    discount: 'Save $150 Today',
    type: 'Promo',
    link: 'https://www.turbocad.com/turbocad-windows/turbocad-platinum.html',
  },
  {
    id: 'd-zwcad-promo',
    toolId: 't12', // ZWCAD
    title: 'ZWCAD Perpetual License Promotion',
    description: 'Save big on lightweight, fast, and fully DWG-compatible CAD. Enjoy perpetual licensing with no forced updates.',
    discount: '15% OFF New License',
    type: 'Promo',
    link: 'https://www.zwsoft.com/zwcad',
  },
  {
    id: 'd-bricscad-promo',
    toolId: 't13', // BricsCAD
    title: 'BricsCAD Upgrade & Competitor Trade-in',
    description: 'Switch from any other CAD to BricsCAD or upgrade your existing perpetual license for exclusive discounts.',
    discount: 'Up to 20% OFF',
    type: 'Promo',
    link: 'https://www.bricsys.com/bricscad',
  },
  {
    id: 'd-gstarcad-tradein',
    toolId: 't54', // GstarCAD
    title: 'GstarCAD Competitor Trade-in Bonus',
    description: 'Switch your AutoCAD or other CAD seat to a GstarCAD perpetual license and claim a 20% discount bonus.',
    discount: '20% Trade-in Bonus',
    type: 'Promo',
    link: 'https://www.gstarcad.net/buy',
  },

  // 2. Evergreen Commercial Savings
  {
    id: 'd-autocad-annual',
    toolId: 't1', // AutoCAD
    title: 'AutoCAD Annual Plan Discount',
    description: 'Save 10% compared to monthly payments by choosing the AutoCAD annual subscription plan.',
    discount: 'Save 10% Annually',
    type: 'Evergreen',
    link: 'https://www.autodesk.com/products/autocad/overview',
  },
  {
    id: 'd-sketchup-annual',
    toolId: 't3', // SketchUp
    title: 'SketchUp Pro Annual Plan',
    description: 'Save on 3D modeling and layout documentation by selecting the annual subscription billing option.',
    discount: 'Save ~12% on Pro',
    type: 'Evergreen',
    link: 'https://www.sketchup.com/plans-and-pricing/higher-education',
  },
  {
    id: 'd-fusion-annual',
    toolId: 't5', // Fusion 360
    title: 'Autodesk Fusion Annual Plan',
    description: 'Save around 33% by billing the unified CAD/CAM/CAE workspace annually instead of monthly.',
    discount: 'Save 33% Annually',
    type: 'Evergreen',
    link: 'https://www.autodesk.com/products/fusion-360',
  },
  {
    id: 'd-rhino-edu',
    toolId: 't6', // Rhino 3D
    title: 'Rhino 3D Student & Faculty License',
    description: 'Get the full commercial version of Rhino 3D at a massive discount. Perpetual license, no subscription fees, no expiry.',
    discount: '80% OFF License',
    type: 'Evergreen',
    link: 'https://www.rhino3d.com/',
  },
  {
    id: 'd-vectorworks-edu',
    toolId: 't17', // Vectorworks
    title: 'Vectorworks Academic Pricing',
    description: 'Deep student discounts on professional BIM, landscape design, and entertainment architecture design tools.',
    discount: 'Over 90% OFF',
    type: 'Evergreen',
    link: 'https://www.vectorworks.net/',
  },

  // 3. Free & Student Plans
  {
    id: 'd-autocad-student',
    toolId: 't1', // AutoCAD
    title: 'AutoCAD Student Free Access',
    description: 'Get free 1-year renewable access to Autodesk software and services for educational purposes.',
    discount: '100% FREE / Student',
    type: 'FreeStudent',
    link: 'https://www.autodesk.com/education/edu-software',
  },
  {
    id: 'd-solidworks-student',
    toolId: 't2', // SolidWorks
    title: 'SolidWorks for Students',
    description: 'Access the complete CAD/CAE suite for education, including free CSWA/CSWP exam certification vouchers.',
    discount: '90% OFF / Free CSWA',
    type: 'FreeStudent',
    link: 'https://www.solidworks.com/solution/organization-type/students',
  },
  {
    id: 'd-fusion-hobbyist',
    toolId: 't5', // Fusion 360
    title: 'Autodesk Fusion for Personal Use',
    description: 'Free version for non-commercial projects, qualifying hobbyists, and startups generating under $1,000/year.',
    discount: 'FREE for Hobbyists',
    type: 'FreeStudent',
    link: 'https://www.autodesk.com/products/fusion-360/personal',
  },
  {
    id: 'd-onshape-free',
    toolId: 't14', // Onshape
    title: 'Onshape Free Non-Commercial Plan',
    description: 'Professional cloud-native parametric CAD for makers, hobbyists, and open-source project designers.',
    discount: 'FREE / Public Docs',
    type: 'FreeStudent',
    link: 'https://www.onshape.com/en/products/free',
  },
  {
    id: 'd-freecad-free',
    toolId: 't11', // FreeCAD
    title: 'FreeCAD Open Source Desktop CAD',
    description: '100% free and open-source parametric 3D CAD modeling software. Perpetual access with no restrictions.',
    discount: '100% FREE Forever',
    type: 'FreeStudent',
    link: 'https://www.freecad.org/',
  },
  {
    id: 'd-qcad-free',
    toolId: 't55', // QCAD
    title: 'QCAD Community Edition',
    description: 'Community-driven, free, open-source 2D CAD systems for drafting, schematics, and vector engineering.',
    discount: '100% FREE Core',
    type: 'FreeStudent',
    link: 'https://qcad.org/',
  },
  {
    id: 'd-blender-free',
    toolId: 't51', // Blender
    title: 'Blender 3D Suite',
    description: 'Free open-source 3D software for modeling, rigging, animation, rendering, simulation, and compositing.',
    discount: '100% FREE Creator Suite',
    type: 'FreeStudent',
    link: 'https://www.blender.org/',
  }
];

export default function DealsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'Promo' | 'Evergreen' | 'FreeStudent'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const filteredDeals = activeDeals.filter(
    (deal) => activeTab === 'all' || deal.type === activeTab
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className="bg-slate-900 py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] -mr-48 -mt-48 opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="bg-blue-600 text-white border-none px-4 py-1 mb-6 font-bold uppercase tracking-widest text-[10px]">
            Live Savings Tracker
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-black mb-6 tracking-tight">Active CAD Software Deals</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            We track the entire web to find the best coupons, discounts, and promotional offers for professional design tools.
          </p>
        </div>
      </section>

      {/* Tab Filters */}
      <section className="container mx-auto px-4 -mt-10 relative z-20 mb-8">
        <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-white/90 backdrop-blur border border-slate-200/50 shadow-xl shadow-slate-200/40 rounded-2xl max-w-2xl mx-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            All Offers ({activeDeals.length})
          </button>
          <button
            onClick={() => setActiveTab('Promo')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'Promo'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Promo Codes & Sales
          </button>
          <button
            onClick={() => setActiveTab('Evergreen')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'Evergreen'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Evergreen Savings
          </button>
          <button
            onClick={() => setActiveTab('FreeStudent')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'FreeStudent'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Free & Student
          </button>
        </div>
      </section>

      {/* Main Deals Grid */}
      <section className="container mx-auto px-4 pb-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => {
            const tool = tools.find((t) => t.id === deal.toolId);
            return (
              <Card
                key={deal.id}
                className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="p-8 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <ToolLogo
                      slug={tool?.slug}
                      src={tool?.logo_url || ''}
                      websiteUrl={tool?.official_url}
                      name={tool?.name || 'CAD Tool'}
                      className="w-12 h-12 border border-slate-100 rounded-2xl group-hover:scale-110 transition-transform"
                    />
                    <Badge
                      variant={
                        deal.type === 'Promo'
                          ? 'default'
                          : deal.type === 'Evergreen'
                          ? 'secondary'
                          : 'outline'
                      }
                      className="rounded-full px-3 text-[9px] uppercase font-bold tracking-widest"
                    >
                      {deal.type === 'Promo'
                        ? 'Promo Code'
                        : deal.type === 'Evergreen'
                        ? 'Evergreen'
                        : 'Free / Student'}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {deal.title}
                  </h3>
                  <div className="text-2xl font-black text-blue-600 mb-4 tracking-tight">
                    {deal.discount}
                  </div>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                    {deal.description}
                  </p>

                  {deal.expires && (
                    <div className="flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase tracking-widest mb-4">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Expires: {new Date(deal.expires).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                  <Button
                    asChild
                    className="flex-1 bg-slate-900 hover:bg-blue-600 text-white font-bold h-12 rounded-xl text-xs uppercase tracking-widest transition-all"
                  >
                    <a
                      href={deal.link}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                    >
                      Activate Deal
                    </a>
                  </Button>
                  {deal.code && (
                    <Button
                      onClick={() => handleCopy(deal.code!, deal.id)}
                      variant="outline"
                      className="flex-1 border-dashed border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold h-12 rounded-xl text-xs uppercase transition-all relative overflow-hidden"
                    >
                      {copiedId === deal.id ? (
                        <span className="text-green-600 font-black">
                          Copied!
                        </span>
                      ) : (
                        <span>Code: {deal.code}</span>
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredDeals.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[32px] border border-slate-100 shadow-sm max-w-lg mx-auto">
            <p className="text-slate-400 font-medium">No active deals found in this category.</p>
          </div>
        )}

        {/* Newsletter / Alert Section */}
        <section className="mt-24">
          <NewsletterSubscribe variant="banner" />
        </section>
      </section>
    </main>
  );
}
