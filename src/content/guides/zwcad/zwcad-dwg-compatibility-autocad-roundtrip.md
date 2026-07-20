---
title: "ZWCAD to AutoCAD DWG Roundtrip: Fixing Compatibility Issues"
excerpt: "Practical solutions for DWG file compatibility problems when exchanging drawings between ZWCAD and AutoCAD — covering version mismatches, missing proxies, and font substitution errors."
category: "troubleshooting"
softwareSlug: "zwcad"
keyword: "zwcad dwg compatibility autocad"
slug: "zwcad-dwg-compatibility-autocad-roundtrip"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://www.zwsoft.com/user-guide/fix-zwcad-invalid-drawing-file-error"
  - "https://forum.bricsys.com/discussion/39478/exporting-dwg-to-something-that-zwcad-can-open"
---

# ZWCAD to AutoCAD DWG Roundtrip: Fixing Compatibility Issues

Firms that switch part of their drafting seats from AutoCAD to ZWCAD to cut subscription costs often hit a painful first month — drawings come back from AutoCAD-using partners with missing objects, garbled text, and proxy entity warnings. The reliable workflow below, worked out through repeated roundtrip testing, eliminates the large majority of these compatibility problems.

## Understanding the Root Causes

ZWCAD uses the IntelliCAD kernel, not AutoCAD's ObjectDBX. This means custom AutoCAD objects (Civil 3D alignments, Architectural Desktop walls, Map 3D topologies) are stored as proxy entities when opened in ZWCAD. The DWG file format itself is identical (ZWCAD reads and writes genuine DWG), but object enablers are the weak link.

The three most common roundtrip failures are:

1. **Proxy entity loss** — Custom objects from vertical AutoCAD toolsets become non-editable proxies
2. **Font substitution** — SHX fonts not installed on the receiving system get replaced with defaults
3. **DWG version mismatch** — Newer DWG versions saved by ZWCAD can't be opened by older AutoCAD installations

## Step 1: Standardize DWG Save Version

Before exchanging files, configure ZWCAD to save in the DWG version your partners use. Most AutoCAD installations handle 2018 format (DWG 2018), but some legacy setups still run 2013 or 2010 format.

In ZWCAD, type `OPTIONS` and navigate to the **Open and Save** tab. Set **File Save** to the appropriate version:

- **DWG 2018** — AutoCAD 2018 and later (default for most exchanges)
- **DWG 2013** — AutoCAD 2013–2017 (common in government and infrastructure projects)
- **DWG 2010** — AutoCAD 2010–2012 (rare, but some clients still require it)

Never save in DWG 2007 or earlier unless explicitly requested — you lose hatches, annotation scaling, and dynamic block functionality.

## Step 2: Bind Xrefs Before Sending

External references are the number one cause of broken drawings in cross-platform exchange. ZWCAD handles Xrefs identically to AutoCAD, but the path resolution breaks when the file lands on a different machine with a different folder structure.

Before sending a DWG to an AutoCAD user, bind all Xrefs:

1. Type `XREF` to open the External References palette.
2. Select all attached Xrefs.
3. Right-click and choose **Bind**.
4. Choose **Insert** (not **Attach**) to flatten the Xref into the host drawing completely.

If you need to preserve layer separation, use **Attach** instead — this prefixes Xref layers with the source filename, which is the same behavior as AutoCAD.

## Step 3: Remove Proxy Objects

If your drawing was originally created in AutoCAD Architecture, Civil 3D, or Mechanical, it likely contains custom objects that ZWCAD cannot interpret. These show up as proxy entities — visible but non-editable.

To clean these before sending:

1. Open the drawing in the original AutoCAD vertical (if available) and use `WBLOCK` to export only the geometry.
2. If you don't have access to the vertical AutoCAD, use the `EXPLODE` command on proxy entities in ZWCAD — this converts them to basic lines, arcs, and polylines.
3. Run `PURGE` to remove orphaned dictionary entries left behind by exploded proxies.

The downside of exploding is loss of parametric behavior (wall heights, alignment geometry). But for exchange purposes, basic geometry is better than missing objects.

## Step 4: Embed or Substitute Fonts

Missing SHX fonts are the most visible compatibility issue. When AutoCAD can't find a font referenced in the DWG, it substitutes simplex.shx, which changes text alignment and width.

To prevent font substitution:

1. Identify all SHX fonts used in your drawing: type `STYLE` and review each text style's font.
2. If using custom SHX fonts, embed them by copying the .shx files alongside the DWG when sending.
3. For universal compatibility, switch text styles to standard fonts: `txt.shx`, `monotxt.shx`, `romans.shx`, or `romand.shx` — these ship with both AutoCAD and ZWCAD.
4. For TrueType fonts, stick to Windows standard fonts (Arial, Calibri) — custom TTF files are not embedded in the DWG.

## Step 5: Audit and Recover Before Final Save

Always run a cleanup pass before sending the file:

```
AUDIT
Y (fix errors)
-PURGE
ALL
* (all named objects)
N (no confirm each)
```

Then save and close. This removes corrupt entities and unused named objects that can trigger crashes in either program.

## When Roundtrip Still Fails

If an AutoCAD user reports your ZWCAD-saved DWG is unreadable, the most likely cause is a DWG database corruption that ZWCAD's AUDIT didn't catch. Ask them to run `RECOVER` in AutoCAD — this uses AutoCAD's more aggressive repair algorithm. In 90% of cases, RECOVER resolves the issue.

If RECOVER fails, save the drawing as a DXF from ZWCAD (`SAVEAS` → DXF format) and have the AutoCAD user import it. DXF strips out kernel-specific binary data and is the most portable format between dissimilar CAD engines.
