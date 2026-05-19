'use client';

import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from 'react';

function NewsletterForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('https://14c0c158.sibforms.com/serve/MUIFAKIxKpcA9tVcGMHLoh1hj5E5nIDzAq2znbxbzvMcjfkPq3hEYLFBQ6sT2Ay_pV6p6i-dyE3A8DmKpCbG0_NJhlCfZAWOGziY94NmSKC3hLU9V-pzratM4gdnUu9F3wbBUtqS6MRh0bCipP7gT4bjwmbMgIQ-qRcdy70QNBdaipZGyXI0rnYnvZAxAELcDVqpvofktMOrSCoM', {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Newsletter submission error:', error);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="text-green-400 text-2xl mb-2">✓</div>
        <p className="text-white font-medium">Thanks for subscribing!</p>
        <p className="text-sm text-slate-500 mt-1">Check your inbox for confirmation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h4 className="text-white font-black mb-4 uppercase text-xs tracking-[0.2em]">Newsletter</h4>
      <p className="text-[11px] text-slate-500 leading-tight">
        Monthly digest: new tool reviews, fresh deals, and curated picks.
      </p>
      <div className="space-y-2">
        <Input
          type="email"
          name="EMAIL"
          placeholder="you@company.com"
          required
          disabled={isSubmitting}
          className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 h-8 rounded-lg text-[11px] w-full"
        />
        <input type="text" name="email_address_check" value="" className="hidden" />
        <input type="hidden" name="locale" value="en" />
        <input type="hidden" name="html_type" value="simple" />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 h-8 px-3 rounded-lg font-black text-[9px] uppercase tracking-widest whitespace-nowrap w-full"
        >
          {isSubmitting ? '...' : 'Subscribe'}
        </Button>
      </div>
    </form>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-20 pb-12 border-t border-slate-900">
      <div className="container mx-auto px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-5 -ml-20">
            <div className="text-xl font-black text-white flex items-center gap-2">
              <span className="text-blue-500">CAD</span>Guide.tools
            </div>
            <p className="text-sm leading-relaxed">
              The world&apos;s premier independent directory for CAD, BIM, & Engineering software. Deep-diving into 235+ tools to help professionals make smarter tech decisions.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-slate-950 flex items-center justify-center text-[8px] text-white font-bold">JD</div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-slate-950 flex items-center justify-center text-[8px] text-white font-bold">MK</div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-slate-950 flex items-center justify-center text-[8px] text-white font-bold">AL</div>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trusted by 5k+ Pros</span>
            </div>
          </div>

          {/* Browse by Role */}
          <div>
            <h4 className="text-white font-black mb-4 uppercase text-xs tracking-[0.2em]">By Role</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/for/architects" className="hover:text-blue-400 transition-colors">Architects</Link></li>
              <li><Link href="/for/mechanical-engineers" className="hover:text-blue-400 transition-colors">Mechanical Engineers</Link></li>
              <li><Link href="/for/civil-engineers" className="hover:text-blue-400 transition-colors">Civil Engineers</Link></li>
              <li><Link href="/for/students" className="hover:text-blue-400 transition-colors">Students</Link></li>
              <li><Link href="/for/jewelry-designers" className="hover:text-blue-400 transition-colors">Jewelry Designers</Link></li>
            </ul>
          </div>

          {/* Browse Software */}
          <div>
            <h4 className="text-white font-black mb-4 uppercase text-xs tracking-[0.2em]">Browse</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/alternatives" className="hover:text-blue-400 transition-colors">Alternatives</Link></li>
              <li><Link href="/platforms" className="hover:text-blue-400 transition-colors">By Platform</Link></li>
              <li><Link href="/file-formats" className="hover:text-blue-400 transition-colors">By File Format</Link></li>
              <li><Link href="/free" className="hover:text-blue-400 transition-colors">Free CAD</Link></li>
              <li><Link href="/open-source" className="hover:text-blue-400 transition-colors">Open-Source CAD</Link></li>
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="text-white font-black mb-4 uppercase text-xs tracking-[0.2em]">Ecosystem</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/matchmaker" className="hover:text-blue-400 transition-colors">Smart Matchmaker</Link></li>
              <li><Link href="/compare" className="hover:text-blue-400 transition-colors">Tool Comparisons</Link></li>
              <li><Link href="/deals" className="hover:text-blue-400 transition-colors">Active Software Deals</Link></li>
              <li><Link href="/tools" className="hover:text-blue-400 transition-colors">Technical Directory</Link></li>
              <li><Link href="/sponsor" className="hover:text-blue-400 transition-colors">List Your Software</Link></li>
            </ul>
          </div>

          {/* Organization */}
          <div>
            <h4 className="text-white font-black mb-4 uppercase text-xs tracking-[0.2em]">Organization</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">Our Methodology</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Support Desk</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy & Terms</Link></li>
              <li><Link href="/all-tools" className="hover:text-blue-400 transition-colors">All Tools Index</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="mr-20">
            <NewsletterForm />
          </div>
        </div>

        <div className="pt-10 border-t border-slate-900 grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-[11px] font-medium text-slate-600">
          <div className="hidden md:block" />
          <div className="flex items-center gap-4 justify-center whitespace-nowrap">
            <span>© {new Date().getFullYear()} CADGuide.tools</span>
            <span>•</span>
            <span className="text-slate-500">Independent Analysis • No Paid Rankings</span>
          </div>
          <div className="flex gap-8 justify-center md:justify-end">
            <Link href="#" className="hover:text-white transition-colors uppercase tracking-widest">Twitter</Link>
            <Link href="#" className="hover:text-white transition-colors uppercase tracking-widest">LinkedIn</Link>
            <Link href="#" className="hover:text-white transition-colors uppercase tracking-widest">Newsletter</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

