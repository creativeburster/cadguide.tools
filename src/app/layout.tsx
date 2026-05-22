import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";
import { Navbar } from "@/components/navbar";
import { PWARegistration } from "@/components/pwa-registration";
import { SiteNotice } from "@/components/site-notice";
import Script from "next/script";

export const metadata: Metadata = {
  title: "CADGuide.tools | Compare 235+ CAD & BIM Software (ASM vs Parasolid)",
  description: "The ultimate objective directory for CAD pros. Deep-dive into technical specs, kernel engines, expert verdicts, and pricing for 235+ professional 2D/3D design tools.",
  metadataBase: new URL('https://cadguide.tools'),
  alternates: {
    canonical: 'https://cadguide.tools',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
        <meta name="theme-color" content="#020617" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
        
        {/* DNS Preconnects for external resources */}
        <link rel="preconnect" href="https://icon.horse" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://logo.clearbit.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen w-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-2NC8HV27GC" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2NC8HV27GC');
          `}
        </Script>
        <PWARegistration />
        <SiteNotice />
        <Navbar />
        <main className="flex-grow w-full">
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
