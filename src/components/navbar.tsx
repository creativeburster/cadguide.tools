'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Directory', href: '/tools' },
    { name: 'Compare', href: '/compare' },
    { name: 'Matchmaker', href: '/matchmaker' },
    { name: 'Deals', href: '/deals' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
      <header className="sticky top-0 z-[200] bg-white/95 backdrop-blur-md border-b border-slate-100 w-full h-16 overflow-x-hidden">
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-slate-900 flex items-center gap-2 group shrink-0">
            <span className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white text-sm shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform font-black">CG</span>
            <span className="tracking-tight whitespace-nowrap">CADGuide<span className="text-blue-600">.tools</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12 text-sm xl:text-base font-semibold text-slate-600">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-blue-600 transition-colors">{link.name}</Link>
            ))}
            <Button asChild variant="outline" size="sm" className="rounded-xl px-4 border-blue-200 text-blue-600 hover:bg-blue-50 font-bold text-sm whitespace-nowrap">
              <Link href="/sponsor">Sponsor Us</Link>
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-blue-600 transition-all z-[500] relative flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg"
            aria-label="Toggle Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isMobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay - compact dropdown panel */}
      <div className={cn(
        "fixed inset-x-4 top-[101px] bg-white z-[250] md:hidden transition-all duration-300 ease-in-out border border-slate-100 rounded-2xl shadow-2xl overflow-hidden",
        isMobileMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible pointer-events-none -translate-y-4"
      )}>
        <nav className="flex flex-col p-4 bg-white">
          <div className="flex flex-col">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 text-lg font-bold text-slate-900 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="mt-2 p-2">
            <Button asChild size="lg" className="w-full rounded-xl bg-blue-600 text-white font-bold h-12 text-base">
              <Link href="/sponsor" onClick={() => setIsMobileMenuOpen(false)}>Sponsor a Tool</Link>
            </Button>
          </div>
        </nav>
      </div>
      
      {/* Background overlay when menu is open */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[90] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
