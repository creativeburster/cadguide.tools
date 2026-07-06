---
title: "BricsCAD to AutoCAD DWG Compatibility: Seamless Workflow Transition Guide"
excerpt: "A practical workflow guide for switching between BricsCAD and AutoCAD without losing data, layer states, or xref integrity. Covers DWG version matching, font substitution, and LISP portability."
category: "workflow"
softwareSlug: "bricscad"
keyword: "bricscad autocad compatibility"
slug: "bricscad-dwg-compatibility-autocad-workflow-transition"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://www.bricsys.com/bricscad/compare"

---

# BricsCAD to AutoCAD DWG Compatibility: Seamless Workflow Transition Guide

Switching between BricsCAD and AutoCAD is increasingly common as firms look to reduce licensing costs without disrupting established workflows. The good news is that BricsCAD uses the same DWG file format natively — no translation layer, no file conversion. But that does not mean the transition is friction-free. Subtle differences in system variables, font availability, LISP extensions, and rendering engines can cause unexpected issues when files move between the two platforms. This guide covers every compatibility pitfall I have encountered in production environments and how to resolve them.

## DWG Version Alignment

The single most important step is ensuring both platforms read and write the same DWG version. BricsCAD supports DWG 2018 through R12, matching AutoCAD's format range. However, the default save format differs:

- **AutoCAD 2024+** defaults to DWG 2018 format
- **BricsCAD V24+** also defaults to DWG 2018 format
- Older BricsCAD versions (V20 and earlier) may default to DWG 2013

To verify and align the save format in BricsCAD, run `DWGFORMAT` or check `Settings > Drawing > Save > Default save format`. Set it to `2018` if your team uses current AutoCAD versions. This prevents the "file created by an incompatible version" warning that appears when an older DWG is opened in newer AutoCAD.

## Layer State and Filter Compatibility

Layer states (`.las` files) created in AutoCAD import cleanly into BricsCAD in most cases. However, layer filters stored in the drawing do not always round-trip perfectly. The issue stems from how each program stores filter definitions in the `LAYDICTIONARY` object.

If layer filters are critical to your workflow, use the `LAYTRANS` command in AutoCAD to export a layer translation map, then manually recreate filters in BricsCAD using the `LAYER` command palette. This is more reliable than importing `.las` files directly when complex filter criteria (such as property-based filters) are involved.

## Font Substitution and Text Style Issues

Text styles that reference SHX fonts installed with AutoCAD (such as `txt.shx`, `simplex.shx`, `monotxt.shx`) will display correctly in BricsCAD only if those font files are present in BricsCAD's support path. BricsCAD ships with its own copies of the standard SHX fonts, but custom SHX fonts must be copied manually.

To resolve missing font warnings:

1. Locate your AutoCAD SHX fonts (typically in `C:\Program Files\Autodesk\AutoCAD 20XX\Fonts`)
2. Copy the needed `.shx` files to `C:\Program Files\Bricsys\BricsCAD VXX\Fonts`
3. Restart BricsCAD and run `REGENALL` on open drawings

For TrueType fonts, both platforms rely on the Windows font directory, so TTF compatibility is generally not an issue.

## LISP Routine Portability

BricsCAD's LISP engine is highly compatible with AutoCAD's Visual LISP, but there are documented differences in specific function groups:

- **COM wrapper functions** (`vla-*`, `vlax-*`) work in BricsCAD but some ActiveX properties differ for entity types unique to BricsCAD (such as `BIM` classification data)
- **`vl-catch-all-apply`** is fully supported
- **`vl-sort`** and **`vl-sort-i`** behave identically
- **Diesel expressions** in menu macros are fully supported
- **`grread`** and **`grdraw`** work but may behave differently with multi-monitor setups

The most common LISP failure when moving from AutoCAD to BricsCAD is missing COM object properties. If your LISP routine accesses drawing objects through `vla-get-ActiveDocument`, test each property access in the BricsCAD console using `(vlax-dump-object (vlax-ename->vla-object (entlast)))` to verify the property exists.

## XREF Path Type Consistency

Both platforms support absolute, relative, and no-path xref attachments. The default path type differs:

- **AutoCAD** defaults to `Relative` (since 2018)
- **BricsCAD** defaults to `Absolute`

This mismatch causes broken xref paths when files move between platforms. To standardize, set the `PROJECTNAME` system variable and use `XREFPATH` to audit paths after opening a file from the other platform. If xrefs show as "Not Found", run `XREF` > right-click > `Change Path` and select the correct path type.

## Plot Style Table Compatibility

CTB and STB plot style tables are fully compatible between platforms. However, page setups saved in AutoCAD may reference printer names that differ on machines running BricsCAD. When a page setup references a missing printer, BricsCAD substitutes the default system printer, which can shift margins and scale.

The fix is to use the `PAGESETUP` command to reassign the correct printer for each layout after opening the file. For batch processing, use the BricsCAD `PUBLISH` command with a sheet set (`.dst`) file that has been updated with local printer names.

## Dynamic Block Compatibility

Dynamic blocks created in AutoCAD function in BricsCAD with full parameter and action support. However, the Block Authoring Palettes in BricsCAD have a slightly different interface. If you need to edit dynamic block parameters in BricsCAD:

1. Use `BEDIT` to open the block in the editing environment
2. The Parameters and Actions tabs are available but may be in a different order than AutoCAD
3. All standard parameter types (Linear, Polar, XY, Rotation, Alignment, Visibility, Lookup) are supported
4. Constraint-based dynamic blocks (geometric and dimensional constraints) are supported in BricsCAD Pro and above

One known issue: visibility states with large numbers of objects (over 500 per state) can cause slower response in BricsCAD compared to AutoCAD. If performance is a concern, consider splitting the block into nested blocks.

## Sheet Set Manager (.DST) Files

BricsCAD includes a Sheet Set Manager that reads and writes `.dst` files compatible with AutoCAD's format. Sheet subsets, custom properties, and callout links all round-trip correctly. The one limitation is that Sheet Set custom fields that reference AutoCAD-specific `DATE` or `SHEETSET` Diesel expressions may not evaluate identically.

## Recommended Workflow for Mixed Environments

If your team uses both BricsCAD and AutoCAD on the same projects, follow these rules:

1. **Standardize on DWG 2018 format** — set `DWGFORMAT` on all machines
2. **Use relative xref paths** — set `XLOADCONTROL` to 2 and train users to use relative paths
3. **Centralize custom fonts** — place SHX files on a network share and add the path to both platforms' support file search paths
4. **Test LISP routines in BricsCAD** before deployment — use the `LISP` command console to verify function compatibility
5. **Use CTB/STB files from a shared location** — avoid embedding page setups that reference local printer names
6. **Audit drawings after cross-platform transfer** — run `AUDIT` with `Y` to fix errors, then `PURGE` to remove unused named objects

## Conclusion

BricsCAD and AutoCAD DWG compatibility is strong at the file format level, but the devil is in the details of fonts, LISP extensions, xref paths, and printer configurations. By standardizing these elements across your team, you can maintain a seamless workflow where files move between platforms without data loss or visual discrepancies. The key is proactive configuration — do not wait for a compatibility error to surface during a deadline crunch.
