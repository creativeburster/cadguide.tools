import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy & Data Protection — GDPR & CCPA Compliant',
  description:
    'How CADGuide.tools collects, uses, and protects your information. GDPR and CCPA compliant. No data sold to third parties.',
  path: '/privacy',
});

export default function PrivacyPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Privacy', path: '/privacy' },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <PrivacyBody />
    </>
  );
}

function PrivacyBody() {
  return (
    <main className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        <div className="bg-white p-12 md:p-16 rounded-[2.5rem] shadow-sm border border-slate-200">
          <h1 className="text-4xl font-black text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-500 mb-12">Last Updated: April 25, 2026</p>

          <div className="prose prose-slate lg:prose-lg max-w-none">
            <p>At <strong>CADGuide.tools</strong>, we take your privacy seriously. This policy describes how we collect, use, and protect your information when you visit our website.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">1. Information We Collect</h2>
            <p>We may collect information in the following ways:</p>
            <ul>
              <li><strong>Direct Information:</strong> When you use our &quot;Contact Us&quot; form or subscribe to our newsletter, we collect your name and email address.</li>
              <li><strong>Usage Data:</strong> We automatically collect information about your interactions with our site (e.g., pages visited, software clicked, search queries).</li>
              <li><strong>Cookies:</strong> We use cookies to enhance your browsing experience and analyze site traffic.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">2. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul>
              <li>Provide and maintain our CAD software directory.</li>
              <li>Improve our &quot;Smart Matchmaker&quot; algorithm based on user preferences.</li>
              <li>Respond to your inquiries and support requests.</li>
              <li>Send you updates or promotional offers (only if you opt-in).</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">3. Data Security</h2>
            <p>We implement professional security measures to protect your personal data. However, please note that no method of transmission over the internet is 100% secure.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">4. Third-Party Links</h2>
            <p>Our directory contains links to external software vendors. We are not responsible for the privacy practices or content of these third-party websites.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">5. Your Rights</h2>
            <p>You have the right to request access to, correction of, or deletion of your personal information stored by us. Please contact us at <strong>support@cadguide.tools</strong> for any such requests.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">6. Changes to This Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

            <div className="mt-16 p-8 bg-slate-50 rounded-3xl border border-slate-100 italic text-slate-600">
              If you have any questions about this Privacy Policy, please contact us at support@cadguide.tools.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
