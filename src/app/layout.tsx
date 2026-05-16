import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";
import { Navbar } from "@/components/navbar";
import { PWARegistration } from "@/components/pwa-registration";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CADTools.cc | Compare 175+ CAD & BIM Software (ASM vs Parasolid)",
  description: "The ultimate objective directory for CAD pros. Deep-dive into technical specs, kernel engines, expert verdicts, and pricing for 175+ professional 2D/3D design tools.",
  metadataBase: new URL('https://cadtools.cc'),
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#020617" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={cn(inter.className, "min-h-screen w-full flex flex-col bg-slate-50 text-slate-900 overflow-x-hidden")}>
        <PWARegistration />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
