'use client';

import { AlertTriangle } from 'lucide-react';
import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'tungforce', name: 'Square-Shoulder Milling (TungForce-Rec)' },
  { id: 'highfeed', name: 'High-Feed Milling (DoFeedQuad)' },
  { id: 'drilling', name: 'Indexable Drilling (DrillForce-Meister)' },
  { id: 'tips', name: 'Catalog Guidelines' },
];

const SHORTCUTS = [
  // Tungaloy TungForce-Rec AVGT-MJ / AVGT-AJ (TR506-G p. 17)
  {
    keys: 'Low carbon steel (S15C, SS400, C15E)',
    command: 'Vc: 230-430 m/min | fz: 0.07-0.12 mm/t',
    category: 'tungforce',
    description: 'Tungaloy TungForce-Rec AVGT-MJ/AJ (TR506-G p. 17). Grade AH3225 (First choice). Also covers E275A, C15E4.',
  },
  {
    keys: 'Carbon & alloy steel (S55C, SCM440, <=300 HB)',
    command: 'Vc: 150-350 m/min | fz: 0.07-0.12 mm/t',
    category: 'tungforce',
    description: 'Tungaloy TungForce-Rec AVGT-MJ/AJ (TR506-G p. 17). Grade AH3225, up to 300 HB. Also covers C55, 42CrMo4.',
  },
  {
    keys: 'Prehardened steel (NAK80, PX5, 30-40 HRC)',
    command: 'Vc: 100-230 m/min | fz: 0.07-0.12 mm/t',
    category: 'tungforce',
    description: 'Tungaloy TungForce-Rec AVGT-MJ/AJ (TR506-G p. 17). Grade AH3225, 30-40 HRC.',
  },
  {
    keys: 'Stainless steel (SUS304, SUS316)',
    command: 'Vc: 150-220 m/min | fz: 0.06-0.1 mm/t',
    category: 'tungforce',
    description: 'Tungaloy TungForce-Rec AVGT-MJ/AJ (TR506-G p. 17). Grade AH3135. Also covers X5CrNi18-9, X5CrNiMo17-12-3.',
  },
  {
    keys: 'Grey cast iron (FC250, FC300, 150-250 HB)',
    command: 'Vc: 200-330 m/min | fz: 0.07-0.12 mm/t',
    category: 'tungforce',
    description: 'Tungaloy TungForce-Rec AVGT-MJ/AJ (TR506-G p. 17). Grade AH120, 150-250 HB. Also covers GG25, GG30.',
  },
  {
    keys: 'Ductile cast iron (FCD400, FCD600, 150-250 HB)',
    command: 'Vc: 150-240 m/min | fz: 0.07-0.12 mm/t',
    category: 'tungforce',
    description: 'Tungaloy TungForce-Rec AVGT-MJ/AJ (TR506-G p. 17). Grade AH120, 150-250 HB. Also covers GGG60, 600-3.',
  },
  {
    keys: 'Aluminium alloys (Si < 13%)',
    command: 'Vc: 650-1000 m/min | fz: 0.07-0.12 mm/t',
    category: 'tungforce',
    description: 'Tungaloy TungForce-Rec AVGT-AJ (TR506-G p. 17). Grade KS05F uncoated carbide for wrought/low-silicon aluminum.',
  },
  {
    keys: 'Aluminium alloys (Si >= 13%)',
    command: 'Vc: 100-230 m/min | fz: 0.04-0.12 mm/t',
    category: 'tungforce',
    description: 'Tungaloy TungForce-Rec AVGT-AJ (TR506-G p. 17). Grade KS05F for high-silicon cast aluminum alloys.',
  },
  {
    keys: 'Titanium alloys (Ti-6Al-4V)',
    command: 'Vc: 40-90 m/min | fz: 0.04-0.1 mm/t',
    category: 'tungforce',
    description: 'Tungaloy TungForce-Rec AVGT-MJ (TR506-G p. 17). Grade AH130 (catalog PDF prints "Ti-6AI-4V" with uppercase I).',
  },
  {
    keys: 'Superalloys (Inconel 718)',
    command: 'Vc: 45-65 m/min | fz: 0.04-0.09 mm/t',
    category: 'tungforce',
    description: 'Tungaloy TungForce-Rec AVGT-MJ (TR506-G p. 17). Grade AH130.',
  },
  {
    keys: 'Hardened steel (SKD61, 40-50 HRC)',
    command: 'Vc: 45-70 m/min | fz: 0.04-0.08 mm/t',
    category: 'tungforce',
    description: 'Tungaloy TungForce-Rec AVGT-MJ (TR506-G p. 17). Grade AH120, 40-50 HRC (X40CrMoV5-1).',
  },
  {
    keys: 'Hardened steel (SKD11, 50-60 HRC)',
    command: 'Vc: 40-65 m/min | fz: 0.04-0.06 mm/t',
    category: 'tungforce',
    description: 'Tungaloy TungForce-Rec AVGT-MJ (TR506-G p. 17). Grade AH120, 50-60 HRC (X153CrMoV12).',
  },

  // Tungaloy DoFeedQuad High-Feed Milling (Milling-highfeed-dofeedquad-img-cutting-conditions.pdf p. 1)
  {
    keys: 'High carbon steels (S45C / C45, <=300 HB) — High-Feed',
    command: 'Vc: 100-300 m/min | fz: 0.5-2.0 mm/t',
    category: 'highfeed',
    description: 'Tungaloy DoFeedQuad TXQ12 (Max ap = 2.0 mm). Grades AH725 / T3130 / AH130.',
  },
  {
    keys: 'Alloyed steels (SCM440 / 42CrMo4, <=300 HB) — High-Feed',
    command: 'Vc: 100-200 m/min | fz: 0.5-1.5 mm/t',
    category: 'highfeed',
    description: 'Tungaloy DoFeedQuad TXQ12 (Max ap = 2.0 mm). Grades AH725 / T3130 / AH130.',
  },
  {
    keys: 'Prehardened steels (PX5, NAK80, 30-40 HRC) — High-Feed',
    command: 'Vc: 100-200 m/min | fz: 0.5-1.0 mm/t',
    category: 'highfeed',
    description: 'Tungaloy DoFeedQuad TXQ12 (Max ap = 2.0 mm). Grade AH725.',
  },
  {
    keys: 'Stainless steel (SUS304, <=200 HB) — High-Feed',
    command: 'Vc: 100-150 m/min | fz: 0.3-0.8 mm/t',
    category: 'highfeed',
    description: 'Tungaloy DoFeedQuad TXQ12 (Max ap = 2.0 mm). Grade AH130.',
  },
  {
    keys: 'Grey cast iron (FC250 / GG250) — High-Feed',
    command: 'Vc: 100-300 m/min | fz: 0.5-2.0 mm/t',
    category: 'highfeed',
    description: 'Tungaloy DoFeedQuad TXQ12 (Max ap = 2.0 mm). Grade AH120.',
  },
  {
    keys: 'Ductile cast irons (FCD600 / GGG60) — High-Feed',
    command: 'Vc: 80-200 m/min | fz: 0.5-2.0 mm/t',
    category: 'highfeed',
    description: 'Tungaloy DoFeedQuad TXQ12 (Max ap = 2.0 mm). Grade AH120.',
  },
  {
    keys: 'Titanium alloy (Ti-6Al-4V, <=40 HRC) — High-Feed',
    command: 'Vc: 30-60 m/min | fz: 0.3-0.7 mm/t',
    category: 'highfeed',
    description: 'Tungaloy DoFeedQuad TXQ12 (Max ap = 2.0 mm). Grade AH725 (catalog PDF prints "Ti-6AI-4V" with uppercase I).',
  },
  {
    keys: 'Hardened steels (SKD61, 40-50 HRC) — High-Feed',
    command: 'Vc: 80-130 m/min | fz: 0.1-0.3 mm/t',
    category: 'highfeed',
    description: 'Tungaloy DoFeedQuad TXQ12 (Max ap = 2.0 mm). Grade AH725.',
  },
  {
    keys: 'Hardened steels (SKD61, 50-60 HRC) — High-Feed',
    command: 'Vc: 50-70 m/min | fz: 0.03-0.07 mm/t',
    category: 'highfeed',
    description: 'Tungaloy DoFeedQuad TXQ12 standard cutting condition table for 50-60 HRC hardened steels.',
  },

  // Tungaloy DrillForce-Meister Indexable Drills (h_scc_509.pdf p. 1, ø26.0–41.0 mm)
  {
    keys: 'Low carbon steel (C15, C20) — Indexable Drill',
    command: 'Vc: 80-140 m/min | f: 0.2-0.55 mm/rev',
    category: 'drilling',
    description: 'Tungaloy DrillForce-Meister (h_scc_509.pdf): ø26-35.9 mm uses 0.2-0.5 mm/rev; ø36-41.0 mm uses 0.2-0.55 mm/rev.',
  },
  {
    keys: 'Carbon & alloy steel (S55C, SCM440) — Indexable Drill',
    command: 'Vc: 80-130 m/min | f: 0.2-0.55 mm/rev',
    category: 'drilling',
    description: 'Tungaloy DrillForce-Meister (h_scc_509.pdf): ø26-35.9 mm uses 0.2-0.5 mm/rev; ø36-41.0 mm uses 0.2-0.55 mm/rev.',
  },
  {
    keys: 'Prehardened steel (NAK80, PX5) — Indexable Drill',
    command: 'Vc: 50-100 m/min | f: 0.2-0.55 mm/rev',
    category: 'drilling',
    description: 'Tungaloy DrillForce-Meister (h_scc_509.pdf): ø26-35.9 mm uses 0.2-0.5 mm/rev; ø36-41.0 mm uses 0.2-0.55 mm/rev.',
  },
  {
    keys: 'Stainless steel (SUS304, SUS316) — Indexable Drill',
    command: 'Vc: 40-80 m/min | f: 0.15-0.35 mm/rev',
    category: 'drilling',
    description: 'Tungaloy DrillForce-Meister (h_scc_509.pdf): ø26-35.9 mm uses 0.15-0.3 mm/rev; ø36-41.0 mm uses 0.2-0.35 mm/rev.',
  },
  {
    keys: 'Grey cast iron (FC250, FC300) — Indexable Drill',
    command: 'Vc: 80-180 m/min | f: 0.25-0.6 mm/rev',
    category: 'drilling',
    description: 'Tungaloy DrillForce-Meister (h_scc_509.pdf): ø26-35.9 mm uses 0.25-0.55 mm/rev; ø36-41.0 mm uses 0.3-0.6 mm/rev.',
  },
  {
    keys: 'Ductile cast iron (400-15, 600-3) — Indexable Drill',
    command: 'Vc: 80-140 m/min | f: 0.25-0.6 mm/rev',
    category: 'drilling',
    description: 'Tungaloy DrillForce-Meister (h_scc_509.pdf): ø26-35.9 mm uses 0.25-0.55 mm/rev; ø36-41.0 mm uses 0.3-0.6 mm/rev.',
  },
  {
    keys: 'Non-ferrous materials — Indexable Drill',
    command: 'Vc: 100-200 m/min | f: 0.4-0.7 mm/rev',
    category: 'drilling',
    description: 'Tungaloy DrillForce-Meister (h_scc_509.pdf): ø26-35.9 mm uses 0.4-0.6 mm/rev; ø36-41.0 mm uses 0.5-0.7 mm/rev.',
  },
  {
    keys: 'Titanium alloys (Ti-6Al-4V) — Indexable Drill',
    command: 'Vc: 20-50 m/min | f: 0.1-0.25 mm/rev',
    category: 'drilling',
    description: 'Tungaloy DrillForce-Meister (h_scc_509.pdf): ø26-35.9 mm uses 0.1-0.2 mm/rev; ø36-41.0 mm uses 0.1-0.25 mm/rev (catalog PDF prints "Ti-6AI-4V" with uppercase I).',
  },
  {
    keys: 'Heat-resistant alloys (Inconel 718) — Indexable Drill',
    command: 'Vc: 20-50 m/min | f: 0.1-0.25 mm/rev',
    category: 'drilling',
    description: 'Tungaloy DrillForce-Meister (h_scc_509.pdf): ø26-35.9 mm uses 0.1-0.2 mm/rev; ø36-41.0 mm uses 0.1-0.25 mm/rev.',
  },
  {
    keys: 'Hardened materials — Indexable Drill',
    command: 'Vc: 20-60 m/min | f: 0.1-0.25 mm/rev',
    category: 'drilling',
    description: 'Tungaloy DrillForce-Meister (h_scc_509.pdf): ø26-35.9 mm uses 0.1-0.2 mm/rev; ø36-41.0 mm uses 0.1-0.25 mm/rev.',
  },

  // Verbatim catalog operating notes
  {
    keys: 'Initial Trial Rule (DoFeedQuad)',
    command: 'Start at 50% of standard values',
    category: 'tips',
    description: 'Tungaloy DoFeedQuad catalog note: Cutting conditions are limited by rigidity and power; start from half of the standard values and increase gradually while confirming normal operation.',
  },
  {
    keys: 'Overhang & Chatter Control',
    command: 'Minimize overhang; reduce n and fz',
    category: 'tips',
    description: 'Tungaloy DoFeedQuad catalog note: Keep tool overhang as short as possible to avoid chatter; when overhang is long, decrease revolutions and feed.',
  },
  {
    keys: 'High-Feed Vibration Order (fl_highfeed.pdf)',
    command: 'Adjust at 70%: Vc -> ap -> fz',
    category: 'tips',
    description: 'Tungaloy fl_highfeed.pdf p. 17: Optimizing cutting parameters to 70% may minimize vibration; adjust in order (1) Vc, (2) DOC ap, (3) fz (note: using a feed rate of 0.5 mm/z or lower may adversely increase vibration for the SWMT0904ZER/UER cutter series shown on p. 17).',
  },
];

const TIPS = [
  {
    title: 'Manufacturer catalog ranges apply to specific insert grades',
    content: 'All rows above are transcribed from Tungaloy published cutting condition sheets (TR506-G TungForce-Rec p. 17, DoFeedQuad TXQ12 p. 1, and DrillForce-Meister h_scc_509.pdf p. 1). Using a different insert geometry, substrate, coolant pressure, or spindle taper requires consulting that specific tool manufacturer catalog.',
  },
  {
    title: 'High-feed milling uses shallow axial depth with large fz',
    content: 'DoFeedQuad high-feed conditions (fz = 0.5-2.0 mm/t) only apply at shallow axial depth (Max ap = 2.0 mm for TXQ12) and low lead angle (~13 deg). Never apply high-feed fz values to full-depth square-shoulder slotting.',
  },
];

export default function CncSpeedsFeedsClient() {
  return (
    <div className="space-y-6">
      <div
        data-testid="manufacturer-advisory"
        className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 flex items-start gap-3 text-amber-950 shadow-sm"
      >
        <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm md:text-base leading-relaxed">
          <span className="font-black">Typical reference values only — always follow cutting tool manufacturer catalog recommendations.</span>{' '}
          These tables cite published ranges from Tungaloy catalogs (TR506-G TungForce-Rec, DoFeedQuad TXQ12, and DrillForce-Meister h_scc_509.pdf) for indexable carbide tooling; verify speed, feed, grade, and depth of cut against the datasheet for your exact cutter and machine rigidity.
        </div>
      </div>

      <ShortcutCheatsheetClient
        title="CNC Speeds & Feeds"
        subtitle="Published Vc and fz/f reference data from Tungaloy indexable milling and drilling catalogs."
        categories={CATEGORIES}
        shortcuts={SHORTCUTS}
        tips={TIPS}
      />
    </div>
  );
}
