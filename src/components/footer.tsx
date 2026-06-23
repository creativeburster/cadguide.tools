'use client';

import Link from 'next/link';
import { NewsletterSubscribe } from '@/components/newsletter-subscribe';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-20 pb-12 border-t border-slate-900 w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-10 gap-8 lg:gap-6 mb-16">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-2 xl:col-span-2 space-y-5">
            <div className="text-xl font-black text-white flex items-center">
              <span className="text-blue-500">CAD</span>Guide.tools
            </div>
            <p className="text-sm leading-relaxed">
              The world&apos;s premier independent directory for CAD, BIM, & Engineering software. Deep-diving into CAD & BIM tools to help professionals make smarter tech decisions.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-slate-950 flex items-center justify-center text-[8px] text-white font-bold">JD</div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-slate-950 flex items-center justify-center text-[8px] text-white font-bold">◆</div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-slate-950 flex items-center justify-center text-[8px] text-white font-bold">MK</div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 border-2 border-slate-950 flex items-center justify-center text-[8px] text-white font-bold">●</div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-rose-600 border-2 border-slate-950 flex items-center justify-center text-[8px] text-white font-bold">AL</div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-teal-600 border-2 border-slate-950 flex items-center justify-center text-[8px] text-white font-bold">▲</div>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trusted by 5k+ Pros</span>
            </div>
          </div>

          {/* Browse by Role */}
          <div>
            <h4 className="text-white font-black mb-4 uppercase text-[10px] tracking-[0.2em]">
              <Link href="/for" className="hover:text-blue-400 transition-colors">By Role</Link>
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/for/architects" className="hover:text-blue-400 transition-colors">Architects</Link></li>
              <li><Link href="/for/mechanical-engineers" className="hover:text-blue-400 transition-colors">Mechanical</Link></li>
              <li><Link href="/for/civil-engineers" className="hover:text-blue-400 transition-colors">Civil Eng</Link></li>
              <li><Link href="/for/students" className="hover:text-blue-400 transition-colors">Students</Link></li>
              <li><Link href="/for/jewelry-designers" className="hover:text-blue-400 transition-colors">Jewelry</Link></li>
            </ul>
          </div>

          {/* Browse Software */}
          <div>
            <h4 className="text-white font-black mb-4 uppercase text-[10px] tracking-[0.2em]">
              <Link href="/tools" className="hover:text-blue-400 transition-colors">Browse</Link>
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/alternatives" className="hover:text-blue-400 transition-colors">Alternatives</Link></li>
              <li><Link href="/platforms" className="hover:text-blue-400 transition-colors">Platforms</Link></li>
              <li><Link href="/best#by-feature" className="hover:text-blue-400 transition-colors">Features</Link></li>
              <li><Link href="/file-formats" className="hover:text-blue-400 transition-colors">Formats</Link></li>
              <li><Link href="/open-source" className="hover:text-blue-400 transition-colors">Open Source</Link></li>
            </ul>
          </div>

          {/* Pricing & License */}
          <div>
            <h4 className="text-white font-black mb-4 uppercase text-[10px] tracking-[0.2em]">
              <Link href="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link>
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/pricing/free" className="hover:text-blue-400 transition-colors">Free CAD</Link></li>
              <li><Link href="/pricing/perpetual" className="hover:text-blue-400 transition-colors">Perpetual</Link></li>
              <li><Link href="/pricing/subscription" className="hover:text-blue-400 transition-colors">Subscription</Link></li>
              <li><Link href="/pricing/network" className="hover:text-blue-400 transition-colors">Floating Net</Link></li>
              <li><Link href="/pricing/educational" className="hover:text-blue-400 transition-colors">Student License</Link></li>
            </ul>
          </div>

          {/* Toolbox */}
          <div>
            <h4 className="text-white font-black mb-4 uppercase text-[10px] tracking-[0.2em]">
              <Link href="/toolbox" className="hover:text-blue-400 transition-colors">Toolbox</Link>
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/toolbox/dwg-version-checker" className="hover:text-blue-400 transition-colors">DWG Checker</Link></li>
              <li><Link href="/toolbox/shortcuts" className="hover:text-blue-400 transition-colors">CAD Shortcuts</Link></li>
              <li><Link href="/toolbox/k-factor-calculator" className="hover:text-blue-400 transition-colors">K-Factor Calc</Link></li>
              <li><Link href="/toolbox/flexlm-concurrent-seats-queue" className="hover:text-blue-400 transition-colors">FLEXlm Calc</Link></li>
              <li><Link href="/toolbox/3d-printing-chordal-deviation" className="hover:text-blue-400 transition-colors">Mesh Optimizer</Link></li>
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="text-white font-black mb-4 uppercase text-[10px] tracking-[0.2em]">Ecosystem</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/matchmaker" className="hover:text-blue-400 transition-colors">Matchmaker</Link></li>
              <li><Link href="/compare" className="hover:text-blue-400 transition-colors">Comparisons</Link></li>
              {process.env.NODE_ENV === 'development' && (
                <li><Link href="/guides" className="hover:text-blue-400 transition-colors">Guides Library</Link></li>
              )}
              <li><Link href="/deals" className="hover:text-blue-400 transition-colors">Deals</Link></li>
              <li><Link href="/tools" className="hover:text-blue-400 transition-colors">Directory</Link></li>
              <li><Link href="/sponsor" className="hover:text-blue-400 transition-colors">List Tool</Link></li>
            </ul>
          </div>

          {/* Organization */}
          <div>
            <h4 className="text-white font-black mb-4 uppercase text-[10px] tracking-[0.2em]">Org</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">Methodology</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact & Support</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/affiliate-disclosure" className="hover:text-blue-400 transition-colors">Affiliate Disclosure</Link></li>
              <li><Link href="/all-tools" className="hover:text-blue-400 transition-colors">All Tools</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-2 xl:col-span-2">
            <NewsletterSubscribe variant="footer" />
          </div>

        </div>

        <div className="pt-10 border-t border-slate-900 grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-[11px] font-medium text-slate-400">
          <div className="hidden md:block" />
          <div className="flex items-center gap-4 justify-center whitespace-nowrap">
            <span>© {new Date().getFullYear()} CADGuide.tools</span>
            <span>•</span>
            <span className="text-slate-400">Independent Analysis • No Paid Rankings</span>
          </div>
          <div className="flex gap-8 justify-center md:justify-end">
            <Link href="#" aria-label="Follow CADGuide.tools on Twitter" className="hover:text-white transition-colors uppercase tracking-widest">Twitter</Link>
            <Link href="#" aria-label="Follow CADGuide.tools on Facebook" className="hover:text-white transition-colors uppercase tracking-widest">Facebook</Link>
            <Link href="#" aria-label="Join CADGuide.tools community on Reddit" className="hover:text-white transition-colors uppercase tracking-widest">Reddit</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

