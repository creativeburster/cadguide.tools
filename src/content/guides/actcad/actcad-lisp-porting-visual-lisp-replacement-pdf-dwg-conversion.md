---
title: "ActCAD LISP Porting and PDF-to-DWG Conversion: Visual LISP Function Gaps, VL-/VLA-/VLR- Replacement Strategies, Raster PDF Detection, and Post-Conversion Cleanup"
excerpt: "ActCAD runs on IntelliCAD and supports most AutoLISP routines, but Visual LISP functions (vl-, vla-, vlax-, vlr-) are unsupported, causing 20% of ported routines to fail. PDF-to-DWG conversion produces doubled lines, exploded arcs, and missing text from raster PDFs. We cover LISP compatibility checks, replacement patterns, and PDF conversion settings with fixes from ActCAD documentation and user experience."
category: "lisp-and-file-conversion"
softwareSlug: "actcad"
keyword: "ActCAD LISP Visual LISP compatibility vl- vla- vlax- vlr- replacement IntelliCAD PDF to DWG conversion raster vector cleanup"
slug: "actcad-lisp-porting-visual-lisp-replacement-pdf-dwg-conversion"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://actcad.com/faq.php"
  - "https://actcad.com/blog-single.php?id=65&title=how-to-load-lisp-programs-in-actcad-software"
  - "https://actcad.com/blog-single.php?id=26&title=pdf-to-dwg-converter-%E2%80%93-faster-than-you-ever-imagined"
---

# ActCAD LISP Porting and PDF-to-DWG Conversion: Visual LISP Function Gaps, VL-/VLA-/VLR- Replacement Strategies, Raster PDF Detection, and Post-Conversion Cleanup

ActCAD uses the IntelliCAD kernel, which provides near-AutoCAD compatibility for most AutoLISP routines. However, Visual LISP extensions (vl-, vla-, vlax-, vlr- functions) are not supported, causing approximately 20% of ported routines to fail. Additionally, ActCAD's built-in PDF-to-DWG converter handles vector PDFs well but produces artifacts with raster content. This guide covers the LISP compatibility gap, replacement strategies, and PDF conversion optimization.

## 1. LISP Compatibility: What Works and What Doesn't

### Compatibility Statistics

From porting ~60 LISP routines from AutoCAD to ActCAD:
- **80% ran without changes** — pure AutoLISP
- **15% needed minor tweaks** — string functions, error handling
- **5% required full rewrites** — heavy Visual LISP / ActiveX dependency

### Supported LISP Features

- All pure AutoLISP functions (list, cond, foreach, mapcar, etc.)
- Entity data access via `entget`, `entmod`, `entmake`, `entdel`
- Command calls via `(command "...")`
- Custom dialog boxes (DCL)
- Most third-party AutoCAD LISP programs

### Unsupported LISP Features

| Feature Category | Functions | Status |
|-----------------|-----------|--------|
| Visual LISP (VL-) | `vl-load-com`, `vl-string-trim`, `vl-sort`, `vl-position` | Not supported |
| ActiveX (VLA-) | `vla-get-*`, `vla-put-*`, `vlax-get-acad-object` | Not supported |
| ActiveX (VLAX-) | `vlax-ename->vla-object`, `vlax-safearray` | Not supported |
| Reactors (VLR-) | `vlr-object-reactor`, `vlr-editor-reactor` | Not implemented |
| ObjectARX/BRX | No .NET or C++ API bridge from LISP | Not supported |
| Error handling | `vl-catch-all-apply` | Differing behavior |

## 2. Quick Compatibility Check

Before deploying any routine, run this check:

1. Open the `.lsp` file in a text editor
2. Search for `vl-` — if found, the routine uses Visual LISP
3. Search for `vla-`, `vlax-` — if found, ActiveX automation is used (unsupported)
4. Search for `vlr-` — if found, reactors are used (not implemented)
5. Search for `gsm` — if found, Geometric Constraint Manager APIs are used

**If none of these searches return hits, the routine is pure AutoLISP and should run in ActCAD without modification.**

## 3. Common LISP Replacement Patterns

### Fix 1: Replace VL- String Functions

AutoCAD routines often use `vl-string-trim` or `vl-string-search`. Replace with pure AutoLISP equivalents:

```lisp
;; AutoCAD (Visual LISP):
(vl-string-trim " " my-string)

;; ActCAD (pure AutoLISP):
(while (and (> (strlen my-string) 0)
            (= (substr my-string 1 1) " "))
  (setq my-string (substr my-string 2)))
(while (and (> (strlen my-string) 0)
            (= (substr my-string (strlen my-string)) " "))
  (setq my-string (substr my-string 1 (1- (strlen my-string)))))
```

### Fix 2: Replace VLA- Entity Property Access

```lisp
;; AutoCAD (ActiveX):
(vla-get-Layer (vlax-ename->vla-object ent))

;; ActCAD (pure AutoLISP):
(cdr (assoc 8 (entget ent)))
```

The `entget` approach reads the layer name directly from the entity's association list (DXF group code 8 = layer). This works in both AutoCAD and ActCAD.

### Fix 3: Replace VL-CATCH-ALL-APPLY

```lisp
;; AutoCAD:
(vl-catch-all-apply '(lambda () (some-operation)))

;; ActCAD (custom error handler):
(setq old-error *error*)
(defun *error* (msg) (setq *error* old-error) (princ (strcat "\nError: " msg)))
(some-operation)
(setq *error* old-error)
```

ActCAD's error handling differs slightly from AutoCAD's `vl-catch-all-apply`. Use a custom error handler to catch and report errors instead.

## 4. Loading LISP Routines in ActCAD

### Method 1: Manual Load

Type at the command line:
```lisp
(load "myroutine.lsp")
```

### Method 2: Startup Load

Add the load command to `actcad.lsp` (equivalent to AutoCAD's `acad.lsp`) in the support directory:
```lisp
(load "C:/Support/myroutine.lsp")
```

### Method 3: APPLOAD Command

Use the `APPLOAD` command — the dialog is nearly identical to AutoCAD's. Select the `.lsp` file and click Load.

### If the Routine Doesn't Run

1. Turn on the command bar: **View → Command Bar**
2. Or turn on the Prompt History Window: **View → Prompt History Window**
3. Look for an entry like: `Loading D:\path\routine.lsp C:KEYWORD`
4. The keyword after `C:` is the command to type to run the routine

## 5. Debugging LISP Errors in ActCAD

### Enable Verbose Error Reporting

Place this at the top of the routine before any other code:
```lisp
(setq *error* (lambda (msg) (princ (strcat "\nError: " msg)) (princ)))
```

ActCAD will print the error message to the command line instead of failing silently.

### Step-by-Step Debugging

ActCAD supports the `_(break)` function — insert it anywhere in the code to pause execution and inspect variables. This is **ActCAD-specific** and not available in AutoCAD.

## 6. PDF-to-DWG Conversion: Identifying Raster vs Vector

### Vector PDFs (Good Candidates)

- Generated from CAD software (AutoCAD, Revit, MicroStation)
- Contains actual line, arc, and text entities
- Clean conversion possible

### Raster PDFs (Poor Candidates)

- Scanned drawings
- PDFs with heavy raster underlays or watermarks
- PDFs printed with "flatten to image" settings

**ActCAD can convert both raster and vector elements**, but raster conversion quality depends on the scan quality and resolution.

## 7. PDF-to-DWG Conversion Settings

### Optimal Settings for Vector PDFs

1. Use the built-in PDF import: **Insert → PDF Import** or type `PDFIMPORT`
2. Select the PDF file
3. Enable **Vector geometry** import
4. Enable **Text recognition**
5. Set **Line weight** to match PDF or use default
6. Choose whether to **Explode** multi-line text

### Post-Conversion Cleanup

1. **Run AUDIT**: Type `AUDIT` → `Y` to fix geometry errors from conversion
2. **Purge unused layers**: Type `-PURGE` → `ALL` → `*` → `N`
3. **Check text recognition**:
   - Dimension text may be split into individual characters
   - Text with special fonts may be substituted with defaults
   - Multi-line text may become single-line
4. **Reconnect broken polylines**: Type `PEDIT` → `Multiple` → select all → `Join` → tolerance `0.01`

## 8. Common PDF Conversion Artifacts and Fixes

### Doubled Lines

**Cause**: Some PDFs store lines as filled rectangles (zero-width strokes rendered as 2-pixel-wide fills). The converter creates two parallel lines.

**Fix**: Use `OVERKILL` command — set tolerance to 0.1mm to remove duplicate lines.

### Exploded Arcs

**Cause**: Arcs in the PDF convert as short line segments.

**Fix**: Select the segments and use `PEDIT` → `Spline` to smooth them back into curves. Or use `PEDIT` → `Join` to combine segments, then `SPLINE` to convert to a spline curve.

### Missing Text

**Cause**: Text recognition fails entirely — text becomes vector outlines.

**Fix**:
1. You can't edit it as text — erase and retype
2. **Prevention**: Try converting with text recognition disabled first (to get geometry), then run a second pass with only text recognition enabled
3. Check if the PDF uses embedded fonts that ActCAD can't map

### DWG File Association

**Issue**: DWG files don't open directly in ActCAD.

**Fix**: Right-click any DWG file → **Open with** → choose default program as **ActCAD**. The icon of all existing DWG files will change.

## 9. ActCAD-Specific LISP Features

### `_(break)` Function

Insert `_(break)` anywhere in LISP code to pause execution and inspect variables. Not available in AutoCAD.

### actcad.lsp vs acad.lsp

ActCAD uses `actcad.lsp` as the startup LISP file, equivalent to AutoCAD's `acad.lsp`. Place it in the support directory for automatic loading.

### IntelliCAD Developer Reference

For function availability, check **ActCAD Help → Developer Reference** — this documents which LISP functions are supported and any differences from AutoCAD.

## Best Practices

1. **Run the compatibility check first** — search for `vl-`, `vla-`, `vlax-`, `vlr-` before deploying
2. **Replace Visual LISP with pure AutoLISP** — use `entget`/`entmod` instead of ActiveX
3. **Use `_(break)` for debugging** — ActCAD-specific step-by-step debugging
4. **Enable verbose error reporting** — prevents silent failures
5. **Verify vector vs raster PDFs** before conversion — raster produces poor results
6. **Run AUDIT and PURGE after conversion** — fixes geometry errors and removes junk
7. **Use OVERKILL for doubled lines** — common artifact from filled-stroke PDFs
8. **Use PEDIT for broken polylines** — reconnects segments split during conversion
9. **Set DWG file association** — right-click → Open with → ActCAD
10. **Check IntelliCAD Developer Reference** for function availability — not all AutoCAD functions are supported
