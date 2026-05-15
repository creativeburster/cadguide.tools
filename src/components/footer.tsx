import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-20 pb-12 border-t border-slate-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="text-2xl font-black text-white flex items-center gap-2">
              <span className="text-blue-500">CAD</span>Tools.cc
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              The world's premier independent directory for CAD, BIM, and Engineering software. Deep-diving into 175+ tools to help professionals make smarter tech decisions.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800" />)}
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trusted by 5k+ Monthly Users</span>
            </div>
          </div>

          {/* Top Industries - SEO POWERHOUSE */}
          <div>
            <h4 className="text-white font-black mb-6 uppercase text-xs tracking-[0.2em]">Top Industries</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/tools?q=Electrical" className="hover:text-blue-400 transition-colors">Electrical Engineering</Link></li>
              <li><Link href="/tools?q=Jewelry" className="hover:text-blue-400 transition-colors">Jewelry & Gemology</Link></li>
              <li><Link href="/tools?q=Dental" className="hover:text-blue-400 transition-colors">Dental & Medical</Link></li>
              <li><Link href="/tools?q=Fashion" className="hover:text-blue-400 transition-colors">Fashion & Apparel</Link></li>
              <li><Link href="/tools?q=Marine" className="hover:text-blue-400 transition-colors">Shipbuilding & Marine</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-black mb-6 uppercase text-xs tracking-[0.2em]">Ecosystem</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/matchmaker" className="hover:text-blue-400 transition-colors">Smart Matchmaker</Link></li>
              <li><Link href="/deals" className="hover:text-blue-400 transition-colors">Active Software Deals</Link></li>
              <li><Link href="/tools" className="hover:text-blue-400 transition-colors">Technical Directory</Link></li>
              <li><Link href="/sponsor" className="hover:text-blue-400 transition-colors">List Your Software</Link></li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="text-white font-black mb-6 uppercase text-xs tracking-[0.2em]">Organization</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">Our Methodology</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Support Desk</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy & Terms</Link></li>
              <li><Link href="/all-tools" className="hover:text-blue-400 transition-colors">All Tools Index</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-medium text-slate-600">
          <div className="flex items-center gap-4">
            <span className="bg-slate-900 px-3 py-1 rounded-full border border-slate-800">© {new Date().getFullYear()} CADTools.cc</span>
            <span className="hidden md:inline">•</span>
            <span className="text-slate-500">Independent Analysis • No Paid Rankings</span>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors uppercase tracking-widest">Twitter</Link>
            <Link href="#" className="hover:text-white transition-colors uppercase tracking-widest">LinkedIn</Link>
            <Link href="#" className="hover:text-white transition-colors uppercase tracking-widest">Newsletter</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

