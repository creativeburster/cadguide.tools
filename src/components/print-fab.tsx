'use client';

import { usePathname } from 'next/navigation';
import { Printer } from 'lucide-react';

/** Floating Print / Save-as-PDF button shown on cheatsheet routes. */
export function PrintFab() {
  const pathname = usePathname();
  const isSheet = pathname?.includes('shortcuts') || pathname?.includes('sheet') || pathname?.includes('reference');
  if (!isSheet) return null;
  return (
    <button
      onClick={() => window.print()}
      className="fixed bottom-6 right-6 z-[300] inline-flex items-center gap-2 px-5 h-12 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 transition-all print:hidden"
      title="Print or save this sheet as PDF"
    >
      <Printer className="w-4 h-4" />
      Print / PDF
    </button>
  );
}
