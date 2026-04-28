'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-500 max-w-[320px]">
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-2xl border border-slate-700/50 backdrop-blur-xl">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
              <span>🍪</span> Cookie Policy
            </h3>
            <p className="text-slate-400 text-[12px] leading-tight">
              We use cookies to improve your experience. By continuing, you agree to our <a href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</a>.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm"
              variant="ghost" 
              onClick={() => setIsVisible(false)}
              className="flex-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs h-8"
            >
              Decline
            </Button>
            <Button 
              size="sm"
              onClick={accept}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs h-8 shadow-lg shadow-blue-900/40"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
