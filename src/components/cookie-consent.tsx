'use client';

import { useState, useEffect } from 'react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentItem {
  value: 'accepted' | 'declined' | 'custom';
  expiry: number;
  preferences: CookiePreferences;
}

// Set localStorage with an expiry time
const setCookieConsentWithExpiry = (value: 'accepted' | 'declined' | 'custom', preferences: CookiePreferences) => {
  const now = new Date();
  const expiry = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days
  const item: CookieConsentItem = {
    value,
    expiry: expiry.getTime(),
    preferences,
  };
  localStorage.setItem('cookie-consent', JSON.stringify(item));
};

// Get localStorage with an expiry time and handle compatibility
const getCookieConsentWithExpiry = (): CookieConsentItem | null => {
  const itemStr = localStorage.getItem('cookie-consent');
  if (!itemStr) return null;
  try {
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem('cookie-consent');
      return null;
    }
    
    // Compatibility check for older cookie structure
    if (typeof item === 'object' && item !== null && 'value' in item) {
      if (!item.preferences) {
        const isAccepted = item.value === 'accepted';
        item.preferences = {
          essential: true,
          analytics: isAccepted,
          marketing: isAccepted,
        };
      }
      return item as CookieConsentItem;
    }
    return null;
  } catch {
    localStorage.removeItem('cookie-consent');
    return null;
  }
};

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  
  // Custom preference states (essential is always true)
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const consent = getCookieConsentWithExpiry();
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDeclineAll = () => {
    const prefs = { essential: true, analytics: false, marketing: false };
    setCookieConsentWithExpiry('declined', prefs);
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    const prefs = { essential: true, analytics: true, marketing: true };
    setCookieConsentWithExpiry('accepted', prefs);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const prefs = { essential: true, analytics, marketing };
    setCookieConsentWithExpiry('custom', prefs);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-500 w-[calc(100%-3rem)] sm:w-full sm:max-w-[420px]">
      <div className="bg-slate-950/95 text-slate-100 p-6 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] border border-slate-800/80 backdrop-blur-xl relative transition-all duration-300 ease-in-out">
        
        {/* Top Glow bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-2xl opacity-80" />

        <button
          onClick={handleDeclineAll}
          className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-full text-xs transition-colors cursor-pointer"
          aria-label="Decline and close cookie banner"
        >
          ✕
        </button>

        {!showPreferences ? (
          /* Simple View */
          <div className="flex flex-col gap-5 pt-1">
            <div>
              <h3 className="font-bold text-base mb-2 flex items-center gap-2 text-white">
                <span className="text-xl">🍪</span> Cookie Settings
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                We use cookies to personalize content, optimize performance, and keep our site free using merchant affiliate links. By continuing, you agree to our{' '}
                <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline font-medium">
                  Privacy Policy
                </a>.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 mt-1">
              <button
                onClick={() => setShowPreferences(true)}
                className="w-full sm:flex-1 bg-slate-900 hover:bg-slate-800/80 text-white font-semibold rounded-xl text-xs h-9 border border-slate-850/80 transition-all active:scale-[0.98] flex items-center justify-center cursor-pointer"
              >
                Customize
              </button>
              <button
                onClick={handleDeclineAll}
                className="w-full sm:flex-1 bg-slate-900 hover:bg-slate-800/80 text-white font-semibold rounded-xl text-xs h-9 border border-slate-850/80 transition-all active:scale-[0.98] flex items-center justify-center cursor-pointer"
              >
                Decline All
              </button>
              <button
                onClick={handleAcceptAll}
                className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs h-9 shadow-md shadow-blue-900/20 transition-all active:scale-[0.98] flex items-center justify-center cursor-pointer"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          /* Preferences View */
          <div className="flex flex-col gap-5 pt-1 animate-in fade-in slide-in-from-right-3 duration-300">
            <div>
              <button 
                onClick={() => setShowPreferences(false)}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1 mb-3 transition-colors cursor-pointer"
              >
                ← Back to simple view
              </button>
              <h3 className="font-bold text-base mb-1 text-white">
                Customize Preferences
              </h3>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Manage your consent choices for different cookies below. For more information, please read our{' '}
                <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline font-medium">
                  Privacy Policy
                </a>.
              </p>
            </div>

            {/* Cookie Categories */}
            <div className="flex flex-col gap-4 border-y border-slate-805/60 py-4 my-1">
              
              {/* Category: Essential */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">Strictly Necessary</span>
                    <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">Required</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-tight">
                    Essential for navigation, basic features, and security of the site. They cannot be turned off.
                  </p>
                </div>
                <div className="relative inline-flex items-center mt-1">
                  <input type="checkbox" checked disabled className="sr-only peer" />
                  <div className="w-10 h-6 bg-blue-600/70 border border-blue-500/50 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[18px] after:bg-white after:rounded-full after:h-5 after:w-5 cursor-not-allowed opacity-80" />
                </div>
              </div>

              {/* Category: Analytics */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <span className="text-xs font-semibold text-white">Analytics & Performance</span>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-tight">
                    Helps us understand how visitors use the website (e.g. page visits, loading speed) to improve overall design.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1 select-none">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-slate-800 border border-slate-700/60 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 peer-checked:after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-checked:border-blue-500" />
                </label>
              </div>

              {/* Category: Marketing */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <span className="text-xs font-semibold text-white">Marketing & Partner Affiliates</span>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-tight">
                    Enables tracking for partner affiliate recommendations, allowing us to keep this service completely free.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1 select-none">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-slate-800 border border-slate-700/60 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 peer-checked:after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-checked:border-blue-500" />
                </label>
              </div>

            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSavePreferences}
                className="flex-1 bg-slate-900 hover:bg-slate-800/80 text-white font-semibold rounded-xl text-xs h-9 border border-slate-850/80 transition-all active:scale-[0.98] flex items-center justify-center cursor-pointer"
              >
                Save Choices
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs h-9 shadow-md shadow-blue-900/20 transition-all active:scale-[0.98] flex items-center justify-center cursor-pointer"
              >
                Accept All
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
