import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = pageMetadata({
  title: 'Contact CADTools.cc',
  description:
    'Get in touch with the CADTools.cc team for partnerships, software submissions, listing corrections, press inquiries, or general feedback.',
  path: '/contact',
});

export default function ContactPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <ContactBody />
    </>
  );
}

function ContactBody() {
  return (
    <main className="min-h-screen bg-slate-50 py-24">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Info Side */}
          <div className="space-y-12">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Get in Touch</h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Have a question about a specific CAD tool? Want to sponsor our directory? Or found an error in our data? We'd love to hear from you.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0 text-xl">📧</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-lg">Email Support</h3>
                  <p className="text-blue-600 font-medium">support@cadtools.cc</p>
                  <p className="text-sm text-slate-500 mt-1">We typically respond within 24-48 business hours.</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center shrink-0 text-xl">📍</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-lg">Our Location</h3>
                  <p className="text-slate-600">No. 10 Zhongguancun East Road, Haidian District</p>
                  <p className="text-slate-600">Beijing, 100084, China</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center shrink-0 text-xl">🤝</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-lg">Partnerships</h3>
                  <p className="text-slate-600">Interested in advertising or a featured listing?</p>
                  <p className="text-blue-600 font-medium">partners@cadtools.cc</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-white">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Your Name</label>
                  <Input placeholder="John Doe" className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                  <Input type="email" placeholder="john@example.com" className="h-12 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                <Input placeholder="Inquiry about..." className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
                <textarea 
                  className="w-full min-h-[150px] p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <Button type="submit" className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-200">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
