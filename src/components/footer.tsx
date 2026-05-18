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
    <form onSubmit={handleSubmit} className="space-y-4">
      <h4 className="text-white font-black uppercase text-xs tracking-[0.2em]">Newsletter</h4>
      <p className="text-xs text-slate-500 leading-relaxed">
        Monthly digest: new tool reviews, fresh deals, and curated picks. No spam — unsubscribe anytime.
      </p>
      <div className="space-y-2">
        <Input
          type="email"
          name="EMAIL"
          placeholder="you@company.com"
          required
          disabled={isSubmitting}
          className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 h-11 rounded-lg text-sm w-full"
        />
        <input type="text" name="email_address_check" value="" className="hidden" />
        <input type="hidden" name="locale" value="en" />
        <input type="hidden" name="html_type" value="simple" />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 h-11 px-5 rounded-lg font-black text-[10px] uppercase tracking-widest whitespace-nowrap w-full"
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
      <div className="container mx-auto px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-10 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="text-xl font-black text-white flex items-center gap-2">
              <span className="text-blue-500">CAD</span>Guide.tools
            </div>
            <p className="text-sm leading-relaxed">
              The world&apos;s premier independent directory for CAD, BIM, & Engineering software. Deep-diving into 235+ tools to help professionals make smarter tech decisions.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  { initial: 'A', from: 'from-blue-500', to: 'to-purple-600' },
                  { initial: 'M', from: 'from-emerald-500', to: 'to-teal-600' },
                  { initial: 'S', from: 'from-amber-500', to: 'to-orange-600' },
                ].map((a) => (
                  <div
                    key={a.initial}
                    className={`w-8 h-8 rounded-full border-2 border-slate-950 bg-gradient-to-br ${a.from} ${a.to} flex items-center justify-center text-white text-[11px] font-black`}
                  >
                    {a.initial}
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trusted by 5k+ Pros</span>
            </div>
          </div>

          {/* Browse by Role */}
          <div>
            <h4 className="text-white font-black mb-4 uppercase text-xs tracking-[0.2em]">By Role</h4>
            <div className="flex flex-wrap gap-x-3 gap-y-2 text-sm">
              <Link href="/for/architects" className="hover:text-blue-400 transition-colors whitespace-nowrap">Architects</Link>
              <span className="text-slate-700">|</span>
              <Link href="/for/mechanical-engineers" className="hover:text-blue-400 transition-colors whitespace-nowrap">Mechanical Engineers</Link>
              <span className="text-slate-700">|</span>
              <Link href="/for/civil-engineers" className="hover:text-blue-400 transition-colors whitespace-nowrap">Civil Engineers</Link>
              <span className="text-slate-700">|</span>
              <Link href="/for/students" className="hover:text-blue-400 transition-colors whitespace-nowrap">Students</Link>
              <span className="text-slate-700">|</span>
              <Link href="/for/jewelry-designers" className="hover:text-blue-400 transition-colors whitespace-nowrap">Jewelry Designers</Link>
            </div>
          </div>

          {/* Browse Software */}
          <div>
            <h4 className="text-white font-black mb-4 uppercase text-xs tracking-[0.2em]">Browse</h4>
            <div className="flex flex-wrap gap-x-3 gap-y-2 text-sm">
              <Link href="/alternatives" className="hover:text-blue-400 transition-colors whitespace-nowrap">Alternatives</Link>
              <span className="text-slate-700">|</span>
              <Link href="/platforms" className="hover:text-blue-400 transition-colors whitespace-nowrap">By Platform</Link>
              <span className="text-slate-700">|</span>
              <Link href="/file-formats" className="hover:text-blue-400 transition-colors whitespace-nowrap">By File Format</Link>
              <span className="text-slate-700">|</span>
              <Link href="/free" className="hover:text-blue-400 transition-colors whitespace-nowrap">Free CAD</Link>
              <span className="text-slate-700">|</span>
              <Link href="/open-source" className="hover:text-blue-400 transition-colors whitespace-nowrap">Open-Source CAD</Link>
            </div>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="text-white font-black mb-4 uppercase text-xs tracking-[0.2em]">Ecosystem</h4>
            <div className="flex flex-wrap gap-x-3 gap-y-2 text-sm">
              <Link href="/matchmaker" className="hover:text-blue-400 transition-colors whitespace-nowrap">Smart Matchmaker</Link>
              <span className="text-slate-700">|</span>
              <Link href="/compare" className="hover:text-blue-400 transition-colors whitespace-nowrap">Tool Comparisons</Link>
              <span className="text-slate-700">|</span>
              <Link href="/deals" className="hover:text-blue-400 transition-colors whitespace-nowrap">Active Software Deals</Link>
              <span className="text-slate-700">|</span>
              <Link href="/tools" className="hover:text-blue-400 transition-colors whitespace-nowrap">Technical Directory</Link>
              <span className="text-slate-700">|</span>
              <Link href="/sponsor" className="hover:text-blue-400 transition-colors whitespace-nowrap">List Your Software</Link>
            </div>
          </div>

          {/* Organization */}
          <div>
            <h4 className="text-white font-black mb-4 uppercase text-xs tracking-[0.2em]">Organization</h4>
            <div className="flex flex-wrap gap-x-3 gap-y-2 text-sm">
              <Link href="/about" className="hover:text-blue-400 transition-colors whitespace-nowrap">Our Methodology</Link>
              <span className="text-slate-700">|</span>
              <Link href="/contact" className="hover:text-blue-400 transition-colors whitespace-nowrap">Support Desk</Link>
              <span className="text-slate-700">|</span>
              <Link href="/privacy" className="hover:text-blue-400 transition-colors whitespace-nowrap">Privacy & Terms</Link>
              <span className="text-slate-700">|</span>
              <Link href="/all-tools" className="hover:text-blue-400 transition-colors whitespace-nowrap">All Tools Index</Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
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

