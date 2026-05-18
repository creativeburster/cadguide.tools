'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from 'react';

export function ContactBody() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('https://formsubmit.co/ajax/support@cadguide.tools', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const data = await response.json();
        alert(data.message || 'There was a problem submitting the form');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was a problem submitting the form');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-slate-50 py-24">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-white text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Message Sent!</h1>
            <p className="text-lg text-slate-600">Thank you for contacting us. We'll get back to you within 24-48 business hours.</p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="mt-8 h-12 px-8 bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              Send Another Message
            </Button>
          </div>
        </div>
      </main>
    );
  }

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
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="hidden" name="_subject" value="New Contact Form Submission from CADGuide.tools" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
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
                className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-200"
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
