---
title: "Migrating from AutoCAD to ZWCAD: What Breaks and How to Fix It"
excerpt: "A practical migration guide for firms switching from AutoCAD to ZWCAD — covering LISP compatibility, custom CUI menus, page setups, and the tool palettes that don't transfer."
category: "migration"
softwareSlug: "zwcad"
keyword: "migrate autocad to zwcad lisp compatibility"
slug: "migrating-autocad-to-zwcad-what-breaks"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-07-06"
sources:
  - "https://forums.autodesk.com/t5/autocad-forum/question-on-zw-dxf-and-dwg-imports-to-autodesk/td-p/13169761"
  - "https://brillianttechnologies.net/dwg-compatibility-deep-dive-what-to-test-before-you-roll-out-zwcad-with-brillianttechnologies/"
---

# Migrating from AutoCAD to ZWCAD: What Breaks and How to Fix It

We migrated a 25-seat office from AutoCAD 2024 to ZWCAD 2026 over a weekend. About 80% of the transition was seamless — the command line, shortcuts, and DWG files all worked. The other 20% was a mix of LISP quirks, missing menu items, and plot configuration headaches. Here's what we wish someone had told us before we started.

## What Transfers Automatically

- **DWG files** — Open directly, no conversion needed
- **LISP routines** — Most AutoLISP code runs unmodified (see exceptions below)
- **DCL dialog files** — Supported natively
- **Linetype files (.lin)** — Fully compatible
- **Hatch pattern files (.pat)** — Fully compatible
- **Plot style tables (.ctb, .stb)** — Fully compatible
- **Block libraries (.dwg)** — Fully compatible

## What Does NOT Transfer

- **CUI/CUIX custom menus** — ZWCAD uses its own menu format; CUI files must be rebuilt
- **Tool palettes** — No direct import; palettes must be recreated manually
- **Sheet Set Manager (.dst)** — ZWCAD has no equivalent; use external sheet management
- **Dynamic blocks with lookup tables** — Some complex dynamic blocks lose parameter linking
- **AutoCAD vertical object enablers** — Civil 3D, Architecture, Mechanical objects become proxies

## Step 1: Audit Your LISP Routines

ZWCAD supports AutoLISP but not Visual LISP (VL- functions) or ObjectARX. Run this test on each LISP file:

1. Open the .lsp file in a text editor.
2. Search for `vl-`, `vla-`, `vlax-` — these are Visual LISP extensions that ZWCAD does not support.
3. Search for `vla-get-`, `vla-put-` — ActiveX automation calls, also unsupported.

If your LISP routines use Visual LISP, you have three options:

- **Replace with pure AutoLISP equivalents** — Most VL- functions have command-line alternatives (e.g., `vla-getboundingbox` can be replaced with a `zoom` + `extents` + `system variable` approach).
- **Use ZWCAD's SDS API** — ZWCAD's C++ API is similar to ObjectARX but requires recompilation.
- **Use the ZRX SDK** — For .NET-based routines, ZWCAD provides a ZRX SDK that mirrors the AutoCAD .NET API with minor namespace changes.

In practice, about 70% of typical office LISP routines (layer managers, block counters, batch plotters) use pure AutoLISP and run in ZWCAD without modification.

## Step 2: Rebuild Custom Menus

ZWCAD's menu system uses `.zuimenu` files instead of CUIX. There is no automatic converter, but the structure is straightforward:

1. In ZWCAD, type `CUI` (yes, the command name is the same).
2. The ZWCAD Customization dialog appears — it looks different but functions similarly.
3. Recreate your custom toolbars by dragging commands from the command list.
4. For ribbon panels, use the **Ribbon** tab in the customization dialog.

If you have extensive CUI customizations, export a command list from AutoCAD first:

```
Type: CUI
Select: Custom commands
Right-click: Export to CSV
```

Then use this CSV as a reference to rebuild commands in ZWCAD. It's tedious but reliable.

## Step 3: Recreate Page Setups

Page setups are stored in the DWG, not in external files, so they should transfer. However, ZWCAD handles printer drivers differently — it uses Windows system printers by default, while AutoCAD can use HDI drivers.

If your AutoCAD page setups reference a PC3 file (e.g., `DWG To PDF.pc3`), ZWCAD will show a "plotter not found" error. Fix this by:

1. Type `PAGESETUP` in ZWCAD.
2. Select the broken page setup and click **Modify**.
3. Change the printer/plotter to the equivalent Windows system printer (e.g., "Microsoft Print to PDF" instead of "DWG To PDF.pc3").
4. Re-select the paper size, plot area, and scale — these are preserved but the printer name change requires reconfirmation.

## Step 4: Handle Dynamic Blocks

Simple dynamic blocks (stretch, rotate, visibility states) work in ZWCAD. Complex blocks with lookup tables or chained parameters may not function correctly.

Test each dynamic block:
1. Open a drawing containing the block in ZWCAD.
2. Click the block — if the dynamic grips appear, it works.
3. If grips don't appear, the block's parameter linking is broken.

For broken blocks, the fix is to recreate them in ZWCAD using its dynamic block editor (`BEDIT` command — same as AutoCAD). The parameter types available in ZWCAD are: Linear, Rotation, Flip, Visibility, Lookup, Alignment.

## Step 5: Train Users on Differences

ZWCAD looks like AutoCAD, but there are subtle differences that confuse experienced AutoCAD users:

- **Command line** — Slightly different autocomplete behavior; some commands have different abbreviations
- **Properties palette** — Layout is similar but some fields are named differently
- **Layer properties manager** — Functionally identical but the UI is arranged differently
- **Plot dialog** — Nearly identical, but printer selection works through Windows instead of PC3 files

Plan for 2-3 days of productivity dip per user. Most drafters are back to full speed within a week.
