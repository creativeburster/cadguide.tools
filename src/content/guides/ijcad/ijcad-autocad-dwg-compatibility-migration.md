---
title: "IJCAD to AutoCAD Migration: Ensuring Seamless DWG Exchange"
excerpt: "How to configure IJCAD for seamless DWG exchange with AutoCAD users — covering save version settings, proxy object handling, font embedding, and Xref binding best practices."
category: "migration"
softwareSlug: "ijcad"
keyword: "ijcad autocad dwg compatibility migration"
slug: "ijcad-autocad-dwg-compatibility-migration"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://support.ijcad.jp/hc/en-us/articles/202730179-IJCAD-and-AutoCAD-of-relationship"
  - "https://www.intellicad.org/intellicad-vs-autocad-comparison-r13.0"
---

# IJCAD to AutoCAD Migration: Ensuring Seamless DWG Exchange

IJCAD is a Japanese-market IntelliCAD-based CAD that's gaining traction in other Asian markets. We worked with a firm that used IJCAD for cost reasons but collaborated with AutoCAD-using partners. The DWG exchange was mostly smooth, but there were enough issues to warrant a documented workflow. Here's what we established.

## DWG Format Compatibility

IJCAD reads and writes genuine DWG files using the ODA (Open Design Alliance) Teigha libraries. The format is binary-compatible with AutoCAD — no translation layer involved.

Supported DWG versions:
- DWG 2018 (AutoCAD 2018+)
- DWG 2013 (AutoCAD 2013–2017)
- DWG 2010 (AutoCAD 2010–2012)
- DWG 2007 (AutoCAD 2007–2009)
- DWG 2004 (AutoCAD 2004–2006)

To configure the default save version:
1. Type `OPTIONS` → **Open and Save** tab.
2. Set **File Save** format to match your partners' AutoCAD version.
3. For mixed-version environments, use DWG 2013 as the safest common denominator.

## Handling Proxy Objects

IJCAD cannot interpret custom objects from AutoCAD verticals (Civil 3D, Architecture, Mechanical). These appear as proxy entities — visible but non-editable.

Before sending an IJCAD-created DWG to an AutoCAD vertical user, there are no proxy issues (IJCAD creates only standard entities). The problem is in the other direction: when an AutoCAD vertical user sends you a DWG with custom objects.

To handle incoming proxy objects:

1. Open the DWG in IJCAD. Proxy objects display with a bounding box and a "Proxy Entity" label.
2. If you need to edit the geometry, type `EXPLODE` and select the proxy entities. This converts them to basic lines, arcs, and polylines.
3. Run `PURGE` to remove orphaned dictionary entries.
4. Save the file.

**Warning**: Exploding proxy objects loses parametric data (wall heights, alignment stations, pipe properties). Only explode if you need to modify the geometry and don't have access to the original AutoCAD vertical.

## Font Compatibility

IJCAD ships with standard SHX fonts (txt.shx, monotxt.shx, romans.shx, romand.shx, etc.). If your drawing uses custom SHX fonts not installed on the AutoCAD user's machine, text will be substituted.

To prevent font issues:

1. Type `STYLE` and audit all text styles in the drawing.
2. For each style, check the font file. If it's a custom SHX, either:
   - Switch to a standard SHX font before sending
   - Copy the .shx file alongside the DWG
3. For TrueType fonts, use only Windows-standard fonts (Arial, Calibri, Times New Roman). Custom TTFs are not embedded in DWG files.

IJCAD also supports Japanese-specific fonts (gothic.shx, mincho.shx). If sending to a non-Japanese AutoCAD user, replace these with standard fonts to avoid substitution.

## Xref Handling

Xrefs are the most common cause of broken DWG exchange. Before sending a file:

1. Type `XREF` to open the External References palette.
2. Review all attached Xrefs. For each:
   - If the Xref is a local file that the recipient won't have, **bind** it: right-click → **Bind** → **Insert**.
   - If the Xref is on a network path the recipient can't access, bind it.
   - If the Xref is a standard reference (e.g., a company title block), leave it attached but verify the path is relative (not absolute).

To convert Xref paths to relative:
1. In the XREF palette, select each Xref.
2. Right-click → **Change Path** → **Relative**.
3. Ensure the Xref file is in the same folder as (or a subfolder of) the host DWG.

## Plot Style Table Compatibility

IJCAD supports CTB (color-dependent) and STB (named) plot style tables — same format as AutoCAD. However:

- IJCAD's default installation includes different CTB files than AutoCAD.
- If your drawing references a specific CTB file (e.g., `company-styles.ctb`), include it when sending the DWG.
- Place CTB files in IJCAD's plot style directory: `%PROGRAMDATA%\IJCAD\IJCAD 2026\Plot Styles\`

## Audit and Cleanup Workflow

Before any DWG exchange, run this cleanup sequence:

```
AUDIT
Y
-PURGE
ALL
*
N
-PURGE
R
N
WBLOCK
*
```

The `WBLOCK` with `*` (all objects) rewrites the entire drawing to a new file, stripping accumulated junk from the database. This is the single most effective way to ensure a clean, compatible DWG.

## When Exchange Still Fails

If an AutoCAD user reports the IJCAD-saved DWG is unreadable:

1. Have them run `RECOVER` in AutoCAD.
2. If RECOVER fails, save as DXF from IJCAD: `SAVEAS` → DXF format. DXF is text-based and universally compatible.
3. If even DXF fails, the drawing has database corruption that requires manual repair. Open in IJCAD, run `AUDIT` with fix, then `WBLOCK` to a new file.
