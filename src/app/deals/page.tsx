'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { tools } from '@/lib/data';
import Link from 'next/link';
import { ToolLogo } from '@/components/tool-logo';

interface Deal {
  id: string;
  toolId: string;
  title: string;
  description: string;
  discount: string;
  code?: string;
  expires?: string;
  type: 'Official' | 'Coupon' | 'Educational' | 'Bundle';
  link: string;
}

const activeDeals: Deal[] = [
  {
    id: 'd11',
    toolId: 't56',
    title: 'nanoCAD Pro Subscription',
    description: 'Special introductory price for new professional subscribers. Experience high-end CAD with lower cost.',
    discount: '20% OFF New Sub',
    type: 'Official',
    link: 'https://nanocad.com/buy/',
  },
  {
    id: 'd12',
    toolId: 't57',
    title: 'progeCAD Professional Sale',
    description: 'Get the most versatile AutoCAD alternative with an additional discount for first-time buyers.',
    discount: '15% OFF Perpetual',
    type: 'Coupon',
    code: 'PROGE15',
    link: 'https://www.progecad.com/buy',
  },
  {
    id: 'd13',
    toolId: 't62',
    title: 'TurboCAD Platinum Deal',
    description: 'All-in-one professional design suite at a fraction of the cost of Revit or AutoCAD.',
    discount: 'Save $150 Today',
    type: 'Official',
    link: 'https://www.turbocad.com/turbocad-windows/turbocad-platinum.html',
  },
  {
    id: 'd9',
    toolId: 't53',
    title: 'DWG FastView Premium Upgrade',
    description: 'Get 30% OFF on your first year of Premium subscription. Access all features on all devices.',
    discount: '30% OFF Annual',
    type: 'Coupon',
    code: 'FASTVIEW30',
    link: 'https://en.dwgfastview.com/upgrade',
  },
  {
    id: 'd10',
    toolId: 't54',
    title: 'GstarCAD Trade-in Special',
    description: 'Switch to GstarCAD and get up to 20% off on your first perpetual license.',
    discount: '20% Trade-in Bonus',
    type: 'Official',
    link: 'https://www.gstarcad.net/buy',
  },
  {
    id: 'd1',
    toolId: 't1',
    title: 'Autodesk Referral Program',
    description: 'Refer a friend to AutoCAD and receive a reward credit for your next renewal.',
    discount: 'Up to $250 Credit',
    type: 'Official',
    link: 'https://www.autodesk.com/campaigns/refer-a-friend',
  },
  {
    id: 'd2',
    toolId: 't2',
    title: 'SolidWorks for Students',
    description: 'Complete CAD/CAE suite including CSWA/CSWP certification vouchers.',
    discount: '90% OFF / FREE',
    type: 'Educational',
    link: 'https://www.solidworks.com/solution/organization-type/students',
  },
  {
    id: 'd3',
    toolId: 't5',
    title: 'ZWCAD 2026 Promo',
    description: 'Save big on perpetual licenses. No forced subscriptions.',
    discount: '15% OFF New License',
    expires: '2026-06-30',
    type: 'Official',
    link: 'https://www.zwsoft.com/zwcad',
  },
  {
    id: 'd4',
    toolId: 't4',
    title: 'SketchUp Education Discount',
    description: 'Professional 3D modeling for higher education students and teachers.',
    discount: '$55 / Year',
    type: 'Educational',
    link: 'https://www.sketchup.com/plans-and-pricing/higher-education',
  },
  {
    id: 'd5',
    toolId: 't3',
    title: 'Autodesk Fusion Personal Use',
    description: 'Free version for non-commercial projects and qualifying hobbyists.',
    discount: 'FREE FOR HOBBYISTS',
    type: 'Bundle',
    link: 'https://www.autodesk.com/products/fusion-360/personal',
  },
  {
    id: 'd6',
    toolId: 't6',
    title: 'BricsCAD Trade-in Deal',
    description: 'Switch from any other CAD to BricsCAD and get a competitive discount.',
    discount: 'Up to 20% OFF',
    type: 'Official',
    link: 'https://www.bricsys.com/bricscad',
  },
  {
    id: 'd7',
    toolId: 't10',
    title: 'ZWCAD Renewal Discount',
    description: 'Exclusive upgrade pricing for owners of older ZWCAD versions.',
    discount: 'Upgrade Save 25%',
    type: 'Official',
    link: 'https://www.zwsoft.com/zwcad/buy',
  },
  {
    id: 'd8',
    toolId: 't1',
    title: 'AutoCAD Annual Subscription',
    description: 'Save 10% compared to monthly payments by choosing the annual plan.',
    discount: '10% OFF Annual',
    type: 'Official',
    link: 'https://www.autodesk.com/products/autocad/overview',
  }
];

export default function DealsPage() {
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

      {/* Main Deals Grid */}
      <section className="container mx-auto px-4 -mt-10 pb-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeDeals.map((deal) => {
            const tool = tools.find(t => t.id === deal.toolId);
            return (
              <Card key={deal.id} className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300">
                <div className="p-8 flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <ToolLogo 
                        src={tool?.logo_url || ''} 
                        name={tool?.name || 'CAD Tool'} 
                        className="w-12 h-12 border border-slate-100 rounded-2xl group-hover:scale-110 transition-transform" 
                      />
                      <Badge variant={deal.type === 'Official' ? 'default' : deal.type === 'Educational' ? 'secondary' : 'outline'} className="rounded-full px-3 text-[9px] uppercase font-bold tracking-widest">
                        {deal.type}
                      </Badge>
                    </div>

                  <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{deal.title}</h3>
                  <div className="text-2xl font-black text-blue-600 mb-4 tracking-tight">{deal.discount}</div>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                    {deal.description}
                  </p>

                  {deal.expires && (
                    <div className="flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase tracking-widest mb-4">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Expires: {new Date(deal.expires).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                  <Button asChild className="flex-1 bg-slate-900 hover:bg-blue-600 text-white font-bold h-12 rounded-xl text-xs uppercase tracking-widest transition-all">
                    <a href={deal.link} target="_blank" rel="nofollow noopener">Activate Deal</a>
                  </Button>
                  {deal.code && (
                    <Button variant="outline" className="flex-1 border-dashed border-blue-200 bg-blue-50 text-blue-600 font-bold h-12 rounded-xl text-xs uppercase transition-all">
                      Code: {deal.code}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Newsletter / Alert Section */}
        <section className="mt-24 bg-blue-600 rounded-[48px] p-10 md:p-20 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -ml-48 -mt-48"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight">Never miss a massive CAD discount again.</h2>
            <p className="text-blue-100 text-lg mb-10 font-medium">
              We notify you about flash sales, Black Friday early access, and secret coupon codes directly to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email..." 
                className="h-16 bg-white/20 border-white/30 text-white placeholder:text-blue-200 rounded-2xl px-6 focus:ring-4 focus:ring-white/20 outline-none transition-all"
              />
              <Button className="h-16 bg-white text-blue-600 hover:bg-blue-50 px-10 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20">
                Join Alerts
              </Button>
            </form>
            <p className="text-blue-200 text-[10px] font-bold mt-6 uppercase tracking-widest">
              Zero spam. Only valid deals. Unsubscribe anytime.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
