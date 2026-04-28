import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";
import { Navbar } from "@/components/navbar";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CADTools.io | Compare 80+ CAD & BIM Software (ASM vs Parasolid)",
  description: "The ultimate objective directory for CAD pros. Deep-dive into technical specs, kernel engines, expert verdicts, and pricing for 80+ professional 2D/3D design tools.",
  metadataBase: new URL('https://cadtools.io'),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "CADTools.io | The Expert Hub for CAD Decisions",
    description: "Compare over 80+ CAD tools objectively. Filter by OS, pricing, kernel, and industry.",
    url: 'https://cadtools.io',
    siteName: 'CADTools.io',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://cadtools.io/#website",
      "url": "https://cadtools.io",
      "name": "CADTools.io",
      "description": "The Ultimate CAD Software Directory & Matchmaker",
      "publisher": { "@id": "https://cadtools.io/#organization" },
    },
    {
      "@type": "Organization",
      "@id": "https://cadtools.io/#organization",
      "name": "CADTools.io",
      "url": "https://cadtools.io",
      "logo": { "@type": "ImageObject", "url": "https://cadtools.io/logo.png" }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("antialiased", "font-sans", geist.variable)}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={cn(inter.className, "min-h-screen w-full flex flex-col bg-slate-50 overflow-x-hidden")}>
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
