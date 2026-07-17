import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";
import { Navbar } from "@/components/navbar";
import { PWARegistration } from "@/components/pwa-registration";
import { SiteNotice } from "@/components/site-notice";
import { BackToTop } from "@/components/back-to-top";
import Script from "next/script";

export const metadata: Metadata = {
  title: "CADGuide.tools | Compare CAD & BIM Software (ASM vs Parasolid)",
  description: "The ultimate objective directory for CAD pros. Deep-dive into technical specs, kernel engines, expert verdicts, and pricing for professional 2D/3D design tools.",
  metadataBase: new URL('https://cadguide.tools'),
  alternates: {
    canonical: 'https://cadguide.tools',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.svg',
  },
  authors: [{ name: "CADGuide.tools Editorial", url: "https://cadguide.tools/about" }],
  publisher: "CADGuide.tools",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US" className="antialiased">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
        <meta name="theme-color" content="#020617" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
        
        {/* Sitemap and LLMs.txt references for SEO & AI Search Crawler discovery */}
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt Index" />
        
        {/* DNS Preconnects for external resources */}
        <link rel="preconnect" href="https://icon.horse" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://logo.clearbit.com" crossOrigin="anonymous" />
        
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
        
        {/* Sync script to prevent layout shift for returning users who dismissed notice */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('site-notice-dismissed') === 'true') {
                  document.documentElement.classList.add('site-notice-dismissed');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen w-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        {/* Google Analytics — skip for known bots to keep GA4 data clean */}
        <Script
          id="ga-bot-filter"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var ua = navigator.userAgent;
                var bots = /GPTBot|ChatGPT-User|ClaudeBot|Claude-Web|PerplexityBot|Google-Extended|cohere-ai|OMgili|YouBot|Applebot-Extended|Meta-ExternalAgent|Amazonbot|Bytespider|PetalBot|Baiduspider|AhrefsBot|SemrushBot|DotBot|BLEXBot|MJ12bot|MegaIndex|DataForSeoBot|Googlebot|Bingbot|Slurp|DuckDuckBot|facebookexternalhit|Twitterbot|LinkedInBot|TelegramBot|WhatsApp/i;
                if (bots.test(ua)) return;
                var s = document.createElement('script');
                s.async = true;
                s.src = 'https://www.googletagmanager.com/gtag/js?id=G-2NC8HV27GC';
                document.head.appendChild(s);
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-2NC8HV27GC');
              })();
            `,
          }}
        />
        <Script
          id="brandreward-sdk"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              if (window.location.hostname && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
                var _BRConf = { key: '81f9b4c973e1fb37a704344789dc0719' };
                window._BRConf = _BRConf;
                (function(d, t) {
                  var s = d.createElement(t); s.type = 'text/javascript'; s.async = true;
                  var scheme = (document.location.protocol == 'https:')?'https':'http';
                  s.src = scheme+'://n.brandreward.com/js/br.js';
                  var r = d.getElementsByTagName(t)[0]; r.parentNode.insertBefore(s, r);
                }(document, 'script'));
              }
            `,
          }}
        />
        <PWARegistration />
        <SiteNotice />
        <Navbar />
        <main className="flex-grow w-full">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <BackToTop />
      </body>
    </html>
  );
}
