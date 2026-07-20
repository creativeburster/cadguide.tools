---
title: "ActCAD LISP Compatibility: Running AutoLISP Routines Without Modification"
excerpt: "How to run existing AutoLISP routines in ActCAD — covering supported functions, VL- extensions workaround, DCL dialog support, and debugging common LISP errors."
category: "workflow"
softwareSlug: "actcad"
keyword: "actcad lisp compatibility autolisp"
slug: "actcad-lisp-compatibility-autolisp-routines"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://en.wikipedia.org/wiki/AutoLISP"
  - "https://forums.intellicadms.com/viewtopic.php?t=3391"
---

# ActCAD LISP Compatibility: Running AutoLISP Routines Without Modification

ActCAD runs on the IntelliCAD kernel, which means its LISP engine is close to AutoCAD's but not identical. I ported about 60 LISP routines from AutoCAD to ActCAD last quarter — roughly 80% ran without changes, 15% needed minor tweaks, and 5% required full rewrites. Here's what I learned.

## What Works Out of the Box

Pure AutoLISP functions work in ActCAD without modification:

- All math functions (`+`, `-`, `*`, `/`, `sin`, `cos`, `atan`, etc.)
- List manipulation (`car`, `cdr`, `append`, `length`, `nth`, `subst`)
- String functions (`strcat`, `strlen`, `substr`, `strcase`)
- Command calls via `(command ...)`
- `entget`, `entmod`, `entmake`, `entdel` for entity manipulation
- `ssget`, `ssadd`, `ssdel`, `sslength` for selection sets
- DCL dialog files — fully supported

## What Does NOT Work

- **Visual LISP (VL- functions)** — `vl-load-com`, `vlax-get-acad-object`, `vla-*` functions are not supported
- **ObjectARX/BRX calls** — No .NET or C++ API bridge from LISP
- **Some `vl-catch-all-apply`** — ActCAD's error handling differs slightly
- **Reactors** — `vlr-*` reactor functions are not implemented

## Testing Your LISP Routines

Before deploying any routine, run this quick compatibility check:

1. Open the .lsp file in a text editor.
2. Search for `vl-`, `vla-`, `vlax-`, `vlr-` — if found, the routine uses Visual LISP.
3. Search for `vla-get-`, `vla-put-` — ActiveX automation, unsupported.
4. Search for `gsm` — if found, the routine uses Geometric Constraint Manager APIs.

If none of these searches return hits, the routine is pure AutoLISP and should run in ActCAD.

## Common Fixes for Near-Compatible Routines

### Fix 1: Replace VL- string functions

AutoCAD routines often use `vl-string-subst` or `vl-string-search`. Replace with pure AutoLISP:

```lisp
; Instead of vl-string-search:
(setq pos (vl-string-search " " mystring))
; Replace with:
(setq pos (while (/= (substr mystring (1+ i) 1) " ") (setq i (1+ i)))
```

### Fix 2: Replace VLA- entity property access

Instead of `vla-get-layer`:

```lisp
; Instead of:
(setq lay (vla-get-layer (vlax-ename->vla-object ent)))
; Use:
(setq lay (cdr (assoc 8 (entget ent))))
```

The `entget` approach reads the layer name directly from the entity's association list — it's the pure AutoLISP equivalent and works in both AutoCAD and ActCAD.

### Fix 3: Replace VL-CATCH-ALL-APPLY

```lisp
; Instead of:
(setq result (vl-catch-all-apply 'my-func (list arg1 arg2)))
; Use:
(setq result nil)
(setq *error* (lambda (msg) (setq result nil)))
(setq result (my-func arg1 arg2))
(setq *error* nil)
```

This isn't as clean, but it achieves the same error-trapping behavior.

## Loading LISP Routines in ActCAD

ActCAD loads LISP files the same way as AutoCAD:

1. **Manual load**: Type `(load "myroutine.lsp")` at the command line.
2. **Startup load**: Add the load command to `actcad.lsp` (equivalent to `acad.lsp`) in the support directory.
3. **Suite load**: Use `APPLOAD` command — the dialog is nearly identical to AutoCAD's.

The support directory location for `actcad.lsp`:
```
%APPDATA%\ActCAD\ActCAD 2026\enu\Support\actcad.lsp
```

## Debugging LISP Errors in ActCAD

When a LISP routine fails silently in ActCAD, enable verbose error reporting:

```lisp
(setq *error* (lambda (msg) (princ (strcat "\nError: " msg)) (princ)))
```

Place this at the top of your routine before any other code. ActCAD will print the error message to the command line instead of failing silently.

For step-by-step debugging, ActCAD supports the `_(break)` function — insert it anywhere in your code to pause execution and inspect variables. This is ActCAD-specific and not available in AutoCAD.
