'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export function SiteNotice() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem('site-notice-dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('site-notice-dismissed', 'true');
    try {
      document.documentElement.classList.add('site-notice-dismissed');
    } catch (_) {}
  };

  if (!isVisible) return null;

  return (
    <div className="bg-blue-600 text-white text-sm relative z-[300] site-notice">
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-2">
        <span className="font-medium text-center pr-6">
          Find and compare CAD & BIM software. Access objective reviews, comparisons, and active <Link href="/deals" className="underline font-bold hover:text-sky-100 transition-colors">deals</Link>{process.env.NODE_ENV === 'development' && ", and professional troubleshooting guides"}.
        </span>
        <button
          onClick={handleDismiss}
          className="absolute right-2 bottom-0.5 p-0.5 hover:bg-white/20 rounded transition-colors"
          aria-label="Dismiss notice"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}
