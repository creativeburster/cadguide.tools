'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import React from 'react';

// Define the 5 guide pillars data structure with real keywords
interface GuidePillar {
  id: string;
  category: 'troubleshooting' | 'performance' | 'printing' | 'standards' | 'enterprise';
  categoryLabel: string;
  title: string;
  desc: string;
  metrics: string;
  gradient: string;
  articles: { title: string; slug: string; keyword: string }[];
}

const GUIDE_PILLARS: GuidePillar[] = [
  {
    id: 'p1',
    category: 'troubleshooting',
    categoryLabel: 'Pillar 3 · Error Fixes',
    title: 'CAD Software Troubleshooting',
    desc: 'Diagnose and repair crash on launch, fatal memory lockouts, local licensing telemetry conflicts, and corrupted drawing files.',
    metrics: '8 Troubleshooting Blueprints',
    gradient: 'from-rose-500 via-pink-600 to-red-500',
    articles: [
      { title: 'Fix AutoCAD License Activation Failed (Registry Patch Guide)', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad license' },
      { title: 'Why Autodesk AutoCAD Freezes on Windows 11 Large DWG Files', slug: 'autocad-freeze-solution', keyword: 'autocad' },
      { title: 'Resolve SolidWorks Price Seat Allocation & EULA Compliance Warnings', slug: 'solidworks-price-compliance', keyword: 'solidworks price' },
      { title: 'AutoCAD Architecture Fatal Error 0x0024 Recovery Workflow', slug: 'autocad-architecture-error', keyword: 'autocad architecture' }
    ]
  },
  {
    id: 'p2',
    category: 'performance',
    categoryLabel: 'Pillar 4 · Tuning',
    title: 'Hardware & Performance Optimization',
    desc: 'Fine-tune local hardware parameters, allocate graphic card resources, and customize multicore configurations for large assemblies.',
    metrics: '6 Optimization Blueprints',
    gradient: 'from-amber-500 via-orange-600 to-yellow-500',
    articles: [
      { title: 'Tuning SolidWorks Free & Pro Suites on Low-End Laptops', slug: 'solidworks-laptop-tuning', keyword: 'solidworks free' },
      { title: 'Best GPU Drivers & Hardware Acceleration Settings for Autodesk Inventor', slug: 'inventor-gpu-acceleration', keyword: 'autodesk inventor' },
      { title: 'Fix Solid Edge Graphics Stuttering & Loading Delays', slug: 'solid-edge-performance', keyword: 'solid edge' },
      { title: 'FreeCAD Custom Settings Migration for Multi-Core Workstations', slug: 'freecad-workstation-setup', keyword: 'freecad' }
    ]
  },
  {
    id: 'p3',
    category: 'printing',
    categoryLabel: 'Pillar 5 · Output',
    title: 'Print & PDF Plotting Workflows',
    desc: 'Standardize batch plotting configurations, resolve missing line weights, export clean high-fidelity vectors, and calibrate paper size guidelines.',
    metrics: '5 Output Blueprints',
    gradient: 'from-teal-500 via-emerald-600 to-cyan-500',
    articles: [
      { title: 'ISO Standard Paper Setups for AutoCAD Online Plotting', slug: 'autocad-online-plotting', keyword: 'autocad online' },
      { title: 'How to Batch Print Multiple Drawing Formats in DraftSight', slug: 'draftsight-batch-plot', keyword: 'draftsight' },
      { title: 'CTB Custom Pen Table Setup for AutoCAD Electrical Blueprints', slug: 'autocad-electrical-ctb', keyword: 'autocad electrical' },
      { title: 'Fix PDF Missing Line Weights and Scrambled Fonts After CAD Export', slug: 'cad-pdf-export-fix', keyword: 'cad software' }
    ]
  },
  {
    id: 'p4',
    category: 'standards',
    categoryLabel: 'Pillar 6 · Compliance',
    title: 'Industry Standards & Best Practices',
    desc: 'Align enterprise drawing layouts to international ANSI, ISO, and IEC drafting guidelines. Deploy CAD standards for corporate team synergy.',
    metrics: '8 Compliance Blueprints',
    gradient: 'from-blue-500 via-indigo-600 to-violet-500',
    articles: [
      { title: 'ANSI Standard Layer Naming for Commercial CAD Building Designs', slug: 'ansi-layer-standards', keyword: 'cad design' },
      { title: 'ISO Standard Dimension Scales for Mechanical Production Drafting', slug: 'iso-dimension-standards', keyword: 'autodesk autocad' },
      { title: 'IEC Electrical Schematic CAD Drawing Best Practices', slug: 'iec-electrical-best-practices', keyword: 'autocad electrical' },
      { title: 'Enterprise CAD File Archiving & Version Naming Convention Standard', slug: 'enterprise-file-archiving', keyword: 'cad programs' }
    ]
  },
  {
    id: 'p5',
    category: 'enterprise',
    categoryLabel: 'Pillar 7 · IT Admin',
    title: 'Enterprise Deployment & Migration',
    desc: 'Coordinate mass silent installation scripts, set up local concurrent FLEXlm servers, and draft complete AutoCAD migration crossover paths.',
    metrics: '6 Administration Blueprints',
    gradient: 'from-purple-500 via-violet-600 to-fuchsia-500',
    articles: [
      { title: 'Complete CAD Migration Guide: AutoCAD to BricsCAD Pro Crossover', slug: 'autocad-to-bricscad-migration', keyword: 'bricscad' },
      { title: 'Mass Offline Silent Installation of AutoCAD LT for Corporate Teams', slug: 'autocad-lt-silent-deployment', keyword: 'autocad lt' },
      { title: 'AutoCAD for Mac: Cross-Platform License Server Deployment Guide', slug: 'autocad-mac-license-server', keyword: 'autocad for mac' },
      { title: 'How to Budget and Buy AutoCAD Seats: Multi-Version Corporate Domain Setup', slug: 'buy-autocad-enterprise', keyword: 'buy autocad' }
    ]
  }
];

export default function GuidesClient() {
  const [activeTab, setActiveTab] = useState<'all' | 'troubleshooting' | 'performance' | 'printing' | 'standards' | 'enterprise'>('all');
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const filteredPillars = activeTab === 'all' 
    ? GUIDE_PILLARS 
    : GUIDE_PILLARS.filter(p => p.category === activeTab);

  const accordionFaqs = [
    {
      q: 'How can our enterprise office optimize CAD license seat costs safely?',
      a: 'Deploying a mix of perpetual buyouts (like BricsCAD or ZWCAD) alongside standard subscriptions is the most successful corporate strategy. Rather than purchasing expensive individual AutoCAD seats for every drafting terminal, you can set up floating FLEXlm license servers. Check out our detailed "AutoCAD to BricsCAD Migration Crossover Guide" under Pillar 7 to learn how to transition without training downtime.'
    },
    {
      q: 'What are the legal compliance risks of utilizing Free CAD in commercial setups?',
      a: 'Using hobbyist or "free for personal use" licenses in commercial office networks triggers severe software compliance audits. Autodesk and other major vendors monitor network telemetry packets and DWG file metadata. To maintain absolute safety without recurring subscription overheads, deploy GPL copyleft open-source suites (like FreeCAD or LibreCAD) which natively grant full commercial design rights.'
    },
    {
      q: 'What is the standard offline grace period for subscription CAD software?',
      a: 'Modern named-user subscriptions do not require a persistent connection, but must connect to the internet to validate active licensing tokens. The grace period typically ranges from 14 to 30 days. Beyond this offline window, the software automatically transitions into read-only viewer mode until a connection is established.'
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      
      {/* Banner Visual Top Accent */}
      <div className="w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      {/* Header Area */}
      <header className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-12 lg:pt-16 pb-6 text-center">
        <Badge className="bg-blue-600/10 text-blue-700 border-none px-4 py-1 mb-6 font-bold uppercase tracking-widest text-[10px] rounded-full">
          CAD Professional Library
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-none">
          Professional CAD Guides & Standards
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto font-medium">
          Zero basic tutorials. Zero student drawing commands. Explore pure, B-End engineering blueprints, troubleshooting steps, and hardware tunings, curated by industry architects and IT administrators.
        </p>
      </header>

      {/* Main Layout Grid */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 mt-8">
        
        {/* Navigation Tabs Menu */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-slate-200 pb-6">
          {[
            { id: 'all', label: 'All Guides' },
            { id: 'troubleshooting', label: 'Troubleshooting (Pillar 3)' },
            { id: 'performance', label: 'Performance & Tuning (Pillar 4)' },
            { id: 'printing', label: 'Print & PDF Output (Pillar 5)' },
            { id: 'standards', label: 'Industry Best Practices (Pillar 6)' },
            { id: 'enterprise', label: 'IT Deployment & Migration (Pillar 7)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100 scale-[1.02]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic 5-Pillar Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
          {filteredPillars.map((p) => (
            <Card
              key={p.id}
              className="border-none shadow-[0_24px_48px_-15px_rgba(0,0,0,0.05)] rounded-[32px] p-6 sm:p-8 bg-white relative overflow-hidden flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
            >
              {/* Top Accent Gradient Background Blob */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none opacity-40" />

              <div className="relative z-10 space-y-6">
                
                {/* Card Title Header */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {p.categoryLabel}
                    </span>
                    <Badge variant="outline" className="bg-slate-50 text-slate-400 text-[9px] font-bold border-slate-100 uppercase tracking-wide">
                      {p.metrics}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${p.gradient}`} />
                    {p.title}
                  </h3>
                  
                  <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                    {p.desc}
                  </p>
                </div>

                {/* --- Mapped Sub-articles List (Pillar Guides) --- */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Featured Guides & Blueprints
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm">
                    {p.articles.map((art) => (
                      <li key={art.slug} className="group/item flex items-start gap-2">
                        <span className="text-blue-600 font-bold shrink-0 mt-0.5">→</span>
                        <div className="flex-1 min-w-0">
                          {/* We link specifically to our created guides template page */}
                          <Link 
                            href={`/guides/${art.slug}`} 
                            className="font-bold text-slate-800 hover:text-blue-600 transition-colors group-hover/item:underline block leading-snug"
                          >
                            {art.title}
                          </Link>
                          {/* Showcase targeted search vector */}
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                            Keyword Mapped: {art.keyword}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Bottom Quick Card Action */}
              <div className="mt-8 pt-4 border-t border-slate-100 text-xs font-black text-blue-600 flex items-center gap-1 group cursor-pointer relative z-10 self-start">
                <span className="hover:underline">Explore All {p.metrics}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Card>
          ))}
        </div>

        {/* --- CRITICAL INTEGRATION: ENTERPRISE FAQ ACCORDION MENU SYSTEM --- */}
        <section className="mt-20 max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <Badge className="bg-indigo-600/10 text-indigo-700 border-none px-4 py-1 mb-4 font-bold uppercase tracking-widest text-[9px] rounded-full">
              Q&A Interactive Board
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Enterprise CAD Operations Q&A Board
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
              Select an operational issue below to review detailed deployment recommendations and legal frameworks.
            </p>
          </div>

          <div className="space-y-4">
            {accordionFaqs.map((faq, idx) => {
              const isOpen = openAccordion === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all"
                >
                  {/* Accordion Trigger Header */}
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-black text-slate-900 hover:bg-slate-50 transition-colors gap-4"
                  >
                    <span>{faq.q}</span>
                    <span className={`transform transition-transform text-blue-600 text-lg ${isOpen ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>

                  {/* Accordion Collapsible Content panel */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-96 border-t border-slate-100 p-5 bg-slate-50' : 'max-h-0'
                    }`}
                  >
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Premium CAD Matchmaker CTA Banner */}
        <section className="mt-20 rounded-[40px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent)] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Evaluate your enterprise CAD requirements dynamically
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm sm:text-base leading-relaxed font-normal">
              Specify your company&apos;s custom budgets, team sizes, local operating systems, and drafting standard workflows to calculate the ultimate high-precision CAD shortlist.
            </p>
            <div className="pt-2">
              <Button asChild className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest px-10 shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95">
                <Link href="/matchmaker">Launch CAD Matchmaker</Link>
              </Button>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
