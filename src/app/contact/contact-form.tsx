'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ContactBody() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);

    try {
      // Using Formsubmit.co for email delivery to support@cadguide.tools
      const response = await fetch('https://formsubmit.co/ajax/support@cadguide.tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
          _subject: 'New Contact Form Submission from CADGuide.tools',
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        e.currentTarget.reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  <p className="text-blue-600 font-medium">support@cadguide.tools</p>
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
                  <p className="text-blue-600 font-medium">partners@cadguide.tools</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-white">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Send us a Message</h2>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-700 font-medium">✓ Message sent successfully! We'll get back to you soon.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 font-medium">✗ Failed to send message. Please try again or email us directly at support@cadguide.tools</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Your Name</label>
                  <Input name="name" placeholder="John Doe" className="h-12 rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                  <Input name="email" type="email" placeholder="john@example.com" className="h-12 rounded-xl" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                <Input name="subject" placeholder="Inquiry about..." className="h-12 rounded-xl" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
                <textarea 
                  name="message"
                  className="w-full min-h-[150px] p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="How can we help you?"
                  required
                ></textarea>
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
