'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { tools } from '@/lib/data';
import { ToolLogo } from '@/components/tool-logo';
import { NewsletterSubscribe } from '@/components/newsletter-subscribe';
import Link from 'next/link';

import { activeDeals, type Deal } from '@/lib/deals-data';

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
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4">
                    {deal.description}
                  </p>

                  {tool && (
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 mb-6 transition-colors group/link"
                    >
                      Read Full {tool.name} Review
                      <svg className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </Link>
                  )}

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
