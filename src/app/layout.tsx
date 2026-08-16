import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";
import { Navbar } from "@/components/navbar";
import { HideInEmbed } from "@/components/hide-in-embed";
import { PrintFab } from "@/components/print-fab";
import { PWARegistration } from "@/components/pwa-registration";
import { SiteNotice } from "@/components/site-notice";
import { BackToTop } from "@/components/back-to-top";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

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
    <html lang="en-US" className={`antialiased ${inter.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
        <meta name="theme-color" content="#020617" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
        
        {/* Sitemap and LLMs.txt references for SEO & AI Search Crawler discovery */}
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt Index" />
        
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
      <body className={`min-h-screen w-full flex flex-col bg-slate-50 text-slate-900 font-sans ${inter.className}`}>
        {/* Google Analytics - lazyOnload ensures it never contends for bandwidth or blocks FCP/LCP */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2NC8HV27GC"
          strategy="lazyOnload"
          data-cfasync="false"
        />
        <Script
          id="google-analytics-init"
          strategy="lazyOnload"
          data-cfasync="false"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-2NC8HV27GC');
            `,
          }}
        />
        <Script
          id="brandreward-sdk"
          strategy="lazyOnload"
          data-cfasync="false"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (typeof window !== 'undefined' && window.location.hostname && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
                  var _BRConf = { key: '81f9b4c973e1fb37a704344789dc0719' };
                  window._BRConf = _BRConf;
                  (function(d, t) {
                    var s = d.createElement(t); s.type = 'text/javascript'; s.async = true;
                    var scheme = (document.location.protocol == 'https:')?'https':'http';
                    s.src = scheme+'://n.brandreward.com/js/br.js';
                    var r = d.getElementsByTagName(t)[0]; r.parentNode.insertBefore(s, r);
                  }(document, 'script'));
                }
              } catch(_) {}
            `,
          }}
        />
        <PWARegistration />
        <HideInEmbed>
          <SiteNotice />
          <Navbar />
        </HideInEmbed>
        <main className="flex-grow w-full">
          {children}
        </main>
        <HideInEmbed>
          <Footer />
          <CookieConsent />
          <BackToTop />
          <PrintFab />
        </HideInEmbed>
      </body>
    </html>
  );
}
