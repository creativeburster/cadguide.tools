export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white p-12 md:p-16 rounded-[2.5rem] shadow-sm border border-slate-200">
          <h1 className="text-4xl font-black text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-500 mb-12">Last Updated: April 25, 2026</p>

          <div className="prose prose-slate lg:prose-lg max-w-none">
            <p>At <strong>CADTools.io</strong>, we take your privacy seriously. This policy describes how we collect, use, and protect your information when you visit our website.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">1. Information We Collect</h2>
            <p>We may collect information in the following ways:</p>
            <ul>
              <li><strong>Direct Information:</strong> When you use our "Contact Us" form or subscribe to our newsletter, we collect your name and email address.</li>
              <li><strong>Usage Data:</strong> We automatically collect information about your interactions with our site (e.g., pages visited, software clicked, search queries).</li>
              <li><strong>Cookies:</strong> We use cookies to enhance your browsing experience and analyze site traffic.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">2. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul>
              <li>Provide and maintain our CAD software directory.</li>
              <li>Improve our "Smart Matchmaker" algorithm based on user preferences.</li>
              <li>Respond to your inquiries and support requests.</li>
              <li>Send you updates or promotional offers (only if you opt-in).</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">3. Data Security</h2>
            <p>We implement professional security measures to protect your personal data. However, please note that no method of transmission over the internet is 100% secure.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">4. Third-Party Links</h2>
            <p>Our directory contains links to external software vendors. We are not responsible for the privacy practices or content of these third-party websites.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">5. Your Rights</h2>
            <p>You have the right to request access to, correction of, or deletion of your personal information stored by us. Please contact us at <strong>support@cadtools.io</strong> for any such requests.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">6. Changes to This Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

            <div className="mt-16 p-8 bg-slate-50 rounded-3xl border border-slate-100 italic text-slate-600">
              If you have any questions about this Privacy Policy, please contact us at support@cadtools.io.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
