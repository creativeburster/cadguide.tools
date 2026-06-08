import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = pageMetadata({
  title: 'Affiliate Disclosure & Monetization Transparency | CADGuide.tools',
  description:
    'Transparency is our priority. Learn how CADGuide.tools earns revenue through affiliate partnerships without compromising our review integrity.',
  path: '/affiliate-disclosure',
});

export default function AffiliateDisclosurePage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Affiliate Disclosure', path: '/affiliate-disclosure' },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <DisclosureBody />
    </>
  );
}

function DisclosureBody() {
  return (
    <main className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        <div className="bg-white p-12 md:p-16 rounded-[2.5rem] shadow-sm border border-slate-200">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Affiliate & Advertising Disclosure</h1>
          <p className="text-slate-500 mb-12">Last Updated: June 2, 2026</p>

          <div className="prose prose-slate lg:prose-lg max-w-none">
            <p>
              Transparency, honesty, and editorial independence are the core values of <strong>CADGuide.tools</strong>. 
              We believe in being 100% transparent with our users about how this platform is funded.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">1. What is an Affiliate Link?</h2>
            <p>
              Many of the links directing you to external CAD software vendors, marketplaces, or download pages are 
              <strong> affiliate links</strong>. This means that if you click on one of these links and subsequently purchase 
              a software subscription, perpetual license, or product, we may receive a small commission from the merchant.
            </p>
            <p className="font-semibold text-slate-800 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              💡 Clicking an affiliate link does NOT increase the price you pay. In fact, through some of our partnerships, 
              we are able to secure exclusive discount codes (coupons) or extended free trials that save you money.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">2. Does This Affect Our Reviews and Scores?</h2>
            <p>
              <strong>Absolutely not.</strong> Our scoring system is strictly algorithmic and data-driven, based on objective technical 
              metrics such as file format compatibility, supported platforms, features, pricing models, and public professional reviews.
            </p>
            <ul>
              <li>We do not accept payments to increase a software&apos;s rating or rating position.</li>
              <li>We list open-source and free alternatives alongside commercial software, even though we receive no compensation for them.</li>
              <li>Whether a software vendor has an affiliate program or not has zero impact on our evaluation.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">3. Why Do We Use Affiliate Marketing?</h2>
            <p>
              Maintaining an extensive directory of 230+ complex professional CAD/BIM tools, publishing in-depth troubleshooting 
              guides, and running advanced comparison algorithms requires significant server resources and expert editing hours.
            </p>
            <p>
              Affiliate monetization allows us to keep CADGuide.tools <strong>100% free</strong> to access, without cluttering the 
              site with intrusive pop-up ads or charging you a subscription fee to find the right software.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">4. Affiliate Programs We Participate In</h2>
            <p>
              We partner with various trusted affiliate networks and merchant platforms, including but not limited to:
            </p>
            <ul>
              <li><strong>Impact.com</strong> (for Autodesk, SketchUp, etc.)</li>
              <li><strong>Avangate / 2Checkout (Verifone)</strong> (for professional CAD/SaaS developers)</li>
              <li><strong>ShareASale</strong> (for mid-sized engineering utilities)</li>
              <li>Direct in-house partnership programs from software publishers</li>
            </ul>

            <div className="mt-16 p-8 bg-blue-50 rounded-3xl border border-blue-100 text-blue-900">
              <h3 className="text-xl font-bold mb-2 text-blue-950">Thank You for Your Support</h3>
              <p className="mb-0 text-sm leading-relaxed">
                By purchasing your design software through our links, you are supporting our ability to keep publishing unbiased, 
                independent comparison data and helpful troubleshooting resources. We are deeply grateful for your trust.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
