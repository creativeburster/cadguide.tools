'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, ShieldAlert, AlertTriangle, Loader2 } from 'lucide-react';

const TRUSTED_DOMAINS = [
  'cadguide.tools',
  'g2.com',
  'capterra.com',
  'trustradius.com',
  'softwareadvice.com',
  'wikipedia.org'
];

function isTrustedUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    const hostname = parsed.hostname.toLowerCase();
    return TRUSTED_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
}

function RedirectBridge() {
  const searchParams = useSearchParams();
  const rawUrl = searchParams.get('url');
  const [url, setUrl] = useState('');
  const [isTrusted, setIsTrusted] = useState(true);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (rawUrl) {
      try {
        const decoded = decodeURIComponent(rawUrl);
        if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
          // Client-only sync from URL search params; safe on mount.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setUrl(decoded);
          setIsTrusted(isTrustedUrl(decoded));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [rawUrl]);

  useEffect(() => {
    if (!url || !isTrusted) return;
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.replace(url);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const timeout = setTimeout(() => {
      window.location.replace(url);
    }, 3500);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [url, isTrusted]);

  if (!rawUrl) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-2xl font-black mb-2">Invalid Redirect Request</h1>
        <p className="text-slate-400 max-w-md">No destination URL was provided. Please go back to the directory.</p>
      </div>
    );
  }

  // Untrusted external URL: Show visual warning screen rather than silent auto-redirect
  if (!isTrusted) {
    let hostnameStr = '';
    try {
      hostnameStr = new URL(url).hostname;
    } catch {
      hostnameStr = 'unknown host';
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0c0f1d] via-[#0f172a] to-[#1e1b4b] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Pulsing Warning Red Glow background */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] animate-pulse"></div>

        <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-red-500/20 p-8 md:p-12 rounded-[36px] shadow-2xl text-center relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/25 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-4 text-red-200">
            External Security Alert
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            You are attempting to visit an unverified third-party destination. To guard against phishing, please verify this destination belongs to the official software site:
          </p>

          <div className="w-full bg-slate-950/70 border border-red-500/10 rounded-2xl p-4 mb-8 text-xs font-mono text-red-400 break-all text-center">
            {url}
          </div>

          <div className="bg-red-500/5 border border-red-500/20 text-red-200 text-[11px] rounded-2xl p-4 mb-8 text-left leading-relaxed">
            <strong>⚠️ Security Notice:</strong> This domain (<strong>{hostnameStr}</strong>) is not listed in our verified platforms catalog. Ensure you trust this website before continuing.
          </div>

          <div className="w-full space-y-4">
            <button
              onClick={() => window.location.replace(url)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black h-14 rounded-2xl shadow-lg shadow-red-500/20 text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              I Trust This Website, Proceed <ArrowRight className="w-4 h-4" />
            </button>
            
            <button 
              onClick={() => window.history.back()}
              className="w-full bg-slate-900 hover:bg-white/5 border border-white/10 text-slate-300 hover:text-white font-bold h-12 rounded-2xl text-xs transition-all"
            >
              Cancel and Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Trusted URL: Show normal 3s countdown redirect page
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#0f172a] to-[#1e293b] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>

      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[36px] shadow-2xl text-center relative z-10 flex flex-col items-center">
        {/* Animated Circle Loader */}
        <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin absolute" />
          <span className="font-black text-lg text-blue-400">{countdown}s</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-4">
          Leaving CADGuide
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          You are being redirected to an external rating source to read independent reviews. 
        </p>

        {url && (
          <div className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 mb-8 text-xs font-mono text-blue-400 truncate text-center">
            {url}
          </div>
        )}

        {/* Real-time Drift Disclaimer to solve rating mismatch */}
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[11px] rounded-2xl p-4 mb-8 text-left leading-relaxed">
          <strong>⚠️ Note on Score Deviations:</strong> Ratings shown on our site represent historic editorial benchmarks. Current live scores on third-party platforms (G2, Capterra, etc.) may fluctuate due to continuous daily user feedback.
        </div>

        <div className="w-full space-y-4">
          <a
            href={url || '#'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-14 rounded-2xl shadow-lg shadow-blue-500/20 text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            Redirect Now <ArrowRight className="w-4 h-4" />
          </a>
          
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-transparent hover:bg-white/5 text-slate-400 hover:text-white font-bold h-12 rounded-2xl text-xs transition-all"
          >
            Cancel and Go Back
          </button>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-[10px] text-slate-500 leading-relaxed uppercase tracking-wider">
          Redirection is automatic. If it takes too long, please check your network connection or VPN proxy settings.
        </div>
      </div>
    </div>
  );
}

export default function GoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    }>
      <RedirectBridge />
    </Suspense>
  );
}

