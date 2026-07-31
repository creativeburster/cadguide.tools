---
title: "BricsCAD LISP and DWG Stability: BLADE Engine Heap Memory Limit, V23 Login-Triggered LISP Slowdown, AEC Dictionary Corruption on Open, Large DWG Random Crashes, and Cross-Platform LISP Porting"
excerpt: "BricsCAD has 5 documented stability problems: LISP engine heap memory capped at ~200MB causing out-of-memory on large lists, V23 login triggers LISP performance regression, AEC dictionaries from AutoCAD files cause crash on open with 'AcDbAttribute can't cast to AcDbViewport', large DWGs with 227K entities crash on move operations, and cross-platform LISP requires BC/AC variable detection. We cover each with fixes from BricsCAD forums."
category: "lisp-and-dwg-stability"
softwareSlug: "bricscad"
keyword: "BricsCAD LISP heap memory BLADE V23 login slow AEC dictionary crash large DWG AcDbAttribute AcDbViewport cross-platform porting"
slug: "bricscad-lisp-dwg-stability-heap-memory-v23-login-aec-dictionary-large-dwg"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://forum.bricsys.com/discussion/38046/lisp-program-much-slower-under-v23-than-v22"
  - "https://forum.bricsys.com/discussion/30160/i-cant-open-my-saved-drawings-without-bricscad-crashing-help"
  - "https://forum.bricsys.com/discussion/36389/heavy-load-with-monster-lists-kills-bricscad"
---

# BricsCAD LISP and DWG Stability: BLADE Engine Heap Memory Limit, V23 Login-Triggered LISP Slowdown, AEC Dictionary Corruption on Open, Large DWG Random Crashes, and Cross-Platform LISP Porting

BricsCAD uses the BLADE LISP engine and the IntelliCAD/ODA kernel for DWG handling. While generally stable, specific scenarios cause crashes and performance degradation: LISP heap memory exhaustion on large data lists, V23 login triggering a LISP performance regression, AEC dictionaries from AutoCAD files corrupting DWG opens, large entity counts crashing on operations, and cross-platform LISP requiring careful variable detection. This guide covers each stability issue with fixes from the BricsCAD user forums.

## 1. LISP Heap Memory Limit: Out-of-Memory on Large Lists

### Symptom

LISP routines that read large data files (e.g., 30MB XYZ coordinate files with 1,000,000 lines) cause BricsCAD to freeze with full processor load and stable RAM usage. The error:

```
error : out of LISP 'Heap' memory at [gc]
```

AutoCAD 2018 on the same machine with the same data and same DOSLib version handles up to 120MB with 4,000,000 lines. BricsCAD handles only 30MB before freezing.

### Root Cause

BricsCAD's LISP engine uses a **fixed memory range** of approximately **200MB**. Large lists consume this memory, and garbage collection cannot reclaim enough to continue.

### Fix

1. **Increase LISP heap memory** via configuration file:
   - Locate `lispex.dll.cfg` in the BricsCAD installation directory
   - Set `VM_PAGE_OVER_HEAP` to a higher value (e.g., 400 or 600)
   - Note: There's a bug where the value for `VM_MAXIMUM_MEM` must be set at the `VM_PAGE_OVER_HEAP` parameter
   - After fix: 400 → ~400MB total, 600 → ~600MB total

2. **Use smarter LISP code**:
   - Avoid storing the same huge data in multiple global variables
   - Set global variables to NIL when no longer needed (globals are never cleared by GC automatically)
   - Use `(vle-file->list filename commentchar)` instead of DOSLib for file reading — more memory-efficient

3. **Use VLE transaction functions** for heavy database operations:
   ```lisp
   (if vle-start-transaction (vle-start-transaction))
   ;; ... heavy operations ...
   (if vle-end-transaction (vle-end-transaction))
   ```
   These can be nested and use internal open/close counters for safety.

4. **V21.2+ improvements**: Memory preset increases to 256MB, and the configuration bug is fixed

### Current Memory Configuration

```
VM total memory : 199.996 MB
VM Page memory  : 120.000 MB available
VM Heap memory  : 79.996 MB available
```

After setting `VM_PAGE_OVER_HEAP` to 400:
```
VM total memory : 399.996 MB
VM Page memory  : 240.000 MB available
VM Heap memory  : 159.996 MB available
```

## 2. V23 Login-Triggered LISP Performance Regression

### Symptom

LISP programs run much slower in V23 than V22. A simple batch plot routine using DOSLib "plods along" in V23. Some days V23 runs fine, other days LISP functions error out on the same DWG and LISP file that worked perfectly the day before.

### Root Cause

A **known performance issue** related to BricsCAD login state. When logged in, LISP performance degrades. When logged out (using `-LOGIN`/`-LOGOUT` commands), performance returns to normal. But logging back in triggers the problem again.

### Fix

1. **Log out** using the `-LOGOUT` command — LISP performance should improve immediately
2. **Stay logged out** during LISP-intensive work sessions
3. **Known issue**: BricsCAD development team is investigating
4. **V23.1.07 and V23.1.08** contain fixes for some LISP instabilities
5. **V23.2** (spring release) expected to contain more comprehensive fixes

### Additional V23 LISP Issues

- **INIGET multiple selection**: First letter sometimes not emphasized/selectable
- **Autoload caching**: Saved LISP with new code not loaded on restart — old version loaded from memory
  - Fix: Remove from APPLOAD, close BricsCAD, re-open, re-load from APPLOAD manager
- **`(prin)` function**: Works in BricsCAD but unknown to BLADE syntax checker — it's a "historical bug" from underlying XLisp/OpenLISP core, retained for compatibility

## 3. AEC Dictionary Corruption: Crash on DWG Open

### Symptom

Opening saved DWG files crashes BricsCAD with:
```
Object of class AcDbAttribute can't be cast to AcDbViewport
```

The RECOVER command also fails with the same message. This happens with files that were previously working fine.

### Root Cause

The DWG file contains **AEC dictionaries** created by AutoCAD (specifically AutoCAD Architecture/AEC versions). These dictionaries store invisible application data that BricsCAD cannot properly interpret, causing a class cast error during file loading.

### Fix

1. **WBlock the entire drawing**:
   - Type `_WBLOCK` and select entire drawing
   - Creates a new file with both Model Space and Paper Space entities
   - Strips out AEC dictionary garbage
   - File size can reduce to ~10% of original

2. **Insert into clean template**:
   1. Start a new DWG from a template
   2. Insert the problem DWG into the new file at 0,0,0 with 0-degree angle
   3. Explode the inserted block
   4. Use `_LAYOUT` → `_Template` to import layouts from the problem drawing
   5. Purge multiple times
   6. Save the new drawing
   7. Note: Paper space dimensions will no longer be associative

3. **Prevention for foreign files**:
   - Always insert received DWG files into your own template
   - WBlock foreign files before working with them
   - Run `_AUDIT` before saving and closing

4. **RECOVER command** — try this first, though it may fail with the same AEC dictionary error

## 4. Large DWG Random Crashes: 227K Entities

### Symptom

BricsCAD v13.2.10 64-bit crashes randomly when editing large drawings (~227,000 entities). Moving a block of 55,000 entities causes a pause followed by a crash. Crashes occur at random intervals from 10 minutes to a few hours.

### Hardware

Win7 64-bit, 16GB RAM, Intel i7 2.5GHz, NVIDIA GeForce GTX580M — should be sufficient for 22MB DWG files.

### Fix

1. **Turn off DRAGMODE**: Set `DRAGMODE` to off — reduces display updates during operations
2. **Set selection preview display to 0**: Eliminates preview highlighting that can trigger crashes
3. **Run AUDIT and PURGE** — the drawing may be corrupt
4. **Test with a clean copy** — create 250,000 polylines and test the same operation to see if it's a BricsCAD limitation or file-specific corruption
5. **Use RECOVER** — open the file with the RECOVER command to fix corruption
6. **WBlock the drawing** — strips out potentially corrupt dictionary data
7. **Upgrade BricsCAD** — newer versions have improved large DWG handling

## 5. Cross-Platform LISP Porting: AutoCAD to BricsCAD

### Compatibility Approach

A user with 25,000+ lines of condensed LISP code for steel structure design runs the same code in both AutoCAD and BricsCAD using platform detection:

```lisp
(setq *bc* (if (wcmatch (strcase (getvar "acadver")) "*BRICSCAD*") 1 nil)
      *ac* (if (wcmatch (strcase (getvar "acadver")) "*LMS TECH*") 1 nil))
```

### Command Differences

| Operation | AutoCAD | BricsCAD |
|-----------|---------|----------|
| UCS entity | `_UCS _ob` | `_UCS _e` (both accept `_object`) |
| Layout set model | `_-layout _S MODEL` | `_layout _S MODEL` |
| 3D Orbit | `_3Dorbit` | `_rtrot` |
| .NET load | `_netload` (AC path) | `_netload` (BC path) |

### Unified Command Example

```lisp
(command-s "_UCS" (if *bc* "_e" "_ob") (handent (car (entsel))))
```

### Performance Notes

- **Compiled files**: `.DES` (BricsCAD encryption) runs at same speed as `.LSP`. `.VLX` (AutoCAD P-Code) runs faster in AutoCAD.
- **BLADE LISP engine** is very fast — comparable to or faster than AutoCAD's Visual LISP for most operations
- **VLE function library**: Native functions for BricsCAD, with emulation (`vle-extension.lsp`) for AutoCAD
- **Transaction functions**: `(vle-start-transaction)` and `(vle-end-transaction)` significantly improve performance for heavy database operations

### BLADE Beautify

BLADE's code reformatter ("Beautify") expands condensed code, which may not match personal coding style. This is cosmetic — disable auto-formatting if you prefer condensed code.

## Best Practices

1. **Increase LISP heap memory** via `lispex.dll.cfg` — set `VM_PAGE_OVER_HEAP` to 400+
2. **Log out during LISP-intensive work** — V23 login causes performance regression
3. **WBlock foreign DWG files** before working — strips AEC dictionary corruption
4. **Insert foreign files into clean template** — prevents dictionary contamination
5. **Run AUDIT before saving** — catches corruption early
6. **Turn off DRAGMODE and selection preview** for large DWGs — reduces crash risk
7. **Use VLE transaction functions** for heavy database operations — significant performance gain
8. **Set global variables to NIL** when done — GC doesn't clear them automatically
9. **Use platform detection variables** (*bc*, *ac*) for cross-platform LISP
10. **Remove LISP from APPLOAD and re-add** if cached old version loads on startup
