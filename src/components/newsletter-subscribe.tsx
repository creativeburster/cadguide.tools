'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface NewsletterSubscribeProps {
  /** Visual variant */
  variant?: 'footer' | 'sidebar' | 'banner';
  /** Custom placeholder text */
  placeholder?: string;
  /** Custom button text */
  buttonText?: string;
  /** Custom success message */
  successMessage?: string;
  /** Custom className for the wrapper */
  className?: string;
  /** Custom title for banner variant */
  title?: string;
  /** Custom description for banner variant */
  description?: string;
}

export function NewsletterSubscribe({
  variant = 'footer',
  placeholder = 'you@company.com',
  buttonText = 'Subscribe',
  successMessage,
  className = '',
  title,
  description,
}: NewsletterSubscribeProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('submitting');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage(successMessage || data.message || 'Subscribed successfully!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Subscription failed. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  // ─── Footer variant ───
  if (variant === 'footer') {
    if (status === 'success') {
      return (
        <div className={`text-center ${className}`}>
          <div className="text-green-400 text-2xl mb-2">✓</div>
          <p className="text-white font-medium">Thanks for subscribing!</p>
          <p className="text-sm text-slate-500 mt-1">{message}</p>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
        <h4 className="text-white font-black mb-4 uppercase text-xs tracking-[0.2em]">Newsletter</h4>
        <p className="text-[11px] text-slate-500 leading-tight">
          Monthly digest: new tool reviews, fresh deals, and curated picks.
        </p>
        <div className="space-y-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            required
            disabled={status === 'submitting'}
            className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 h-8 rounded-lg text-[11px] w-full"
          />
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={status === 'submitting'}
              className="bg-blue-600 hover:bg-blue-700 h-8 px-8 rounded-lg font-black text-[9px] uppercase tracking-widest whitespace-nowrap"
            >
              {status === 'submitting' ? '...' : buttonText}
            </Button>
          </div>
        </div>
        {status === 'error' && (
          <p className="text-red-400 text-[10px] text-center">{message}</p>
        )}
      </form>
    );
  }

  // ─── Sidebar variant (tool detail page) ───
  if (variant === 'sidebar') {
    if (status === 'success') {
      return (
        <div className={`bg-white p-6 md:p-10 rounded-[24px] md:rounded-[48px] border border-slate-100 shadow-sm text-center ${className}`}>
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-[24px] flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="text-2xl font-black text-slate-900 mb-3">You&apos;re In!</h4>
          <p className="text-sm text-slate-500 font-medium leading-relaxed px-4">{message}</p>
        </div>
      );
    }

    return (
      <div className={`bg-white p-6 md:p-10 rounded-[24px] md:rounded-[48px] border border-slate-100 shadow-sm text-center ${className}`}>
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[24px] flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h4 className="text-2xl font-black text-slate-900 mb-3">CAD Insider</h4>
        <p className="text-sm text-slate-500 mb-8 font-medium leading-relaxed px-4">
          Join 15,000+ professionals. Get weekly license deals and software updates.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder || 'Enter your work email'}
            required
            disabled={status === 'submitting'}
            className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
          />
          <Button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl h-14 shadow-lg shadow-slate-200"
          >
            {status === 'submitting' ? 'Subscribing...' : (buttonText || 'Subscribe Free')}
          </Button>
        </form>
        {status === 'error' && (
          <p className="text-red-500 text-xs mt-3 font-medium">{message}</p>
        )}
      </div>
    );
  }

  // ─── Banner variant (deals page) ───
  if (status === 'success') {
    return (
      <div className={`bg-blue-600 rounded-[48px] p-10 md:p-20 text-white text-center relative overflow-hidden ${className}`}>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -ml-48 -mt-48"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight">You&apos;re all set!</h2>
          <p className="text-blue-100 text-lg font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-blue-600 rounded-[48px] p-10 md:p-20 text-white text-center relative overflow-hidden ${className}`}>
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -ml-48 -mt-48"></div>
      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
          {title || "Never miss a massive CAD discount again."}
        </h2>
        <p className="text-blue-100 text-lg mb-10 font-medium">
          {description || "We notify you about flash sales, Black Friday early access, and secret coupon codes directly to your inbox."}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder || 'Enter your email...'}
            required
            disabled={status === 'submitting'}
            className="h-16 flex-1 w-full bg-white/20 border-white/30 text-white placeholder:text-blue-200 rounded-2xl px-6 focus:ring-4 focus:ring-white/20 outline-none transition-all"
          />
          <Button
            type="submit"
            disabled={status === 'submitting'}
            className="h-16 bg-white text-blue-600 hover:bg-blue-50 px-10 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20"
          >
            {status === 'submitting' ? 'Joining...' : (buttonText || 'Join Alerts')}
          </Button>
        </form>
        {status === 'error' && (
          <p className="text-red-200 text-sm mt-4 font-medium">{message}</p>
        )}
        <p className="text-blue-200 text-[10px] font-bold mt-6 uppercase tracking-widest">
          Zero spam. Only valid deals. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
