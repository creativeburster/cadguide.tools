'use client';

import { RelatedTools } from '@/components/related-tools';
import { Info } from 'lucide-react';

export default function CalculatorClient() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
            <Info className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculation Method</h2>
        </div>
        <p className="text-base text-slate-600 leading-relaxed font-medium">
          {"Q_pump = heat_loss/(rho*cp*dT). heat_loss = sum(U*pi*D*L*(T_hot-T_amb)). Return pipe min 0.5 m/s. Pump head = friction+fittings+loop. Includes insulation and balancing valve."}
        </p>
        <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">
            Interactive calculator implementation in progress. The formula and methodology are shown above for reference.
          </p>
        </div>
      </div>
      <RelatedTools />
    </div>
  );
}
