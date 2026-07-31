---
title: "ARES Commander Startup and LISP Compatibility: OpenGL Profile Crash on Launch, LISP Command Incompatibility, Cloud Storage Edit Session Lock, acad_colordlg Crash, and Missing Background Image Fatal Error"
excerpt: "ARES Commander fails for 5 distinct reasons: OpenGL profile mismatch causes crash on launch fixable with /glprofile switch, LISP routines fail from Array option in COPY command and 3D Polyline offset incompatibility, cloud storage edit sessions lock after 50 minutes of inactivity, acad_colordlg crashes when accessing Color Book tab, and DWG files with missing background images cause fatal crash on open. We cover each with fixes from Graebert help center and release notes."
category: "startup-and-lisp-compatibility"
softwareSlug: "ares-commander"
keyword: "ARES Commander OpenGL crash launch LISP incompatibility cloud storage edit session lock acad_colordlg crash missing background image fatal error"
slug: "ares-commander-startup-lisp-compatibility-opengl-crash-cloud-lock-colordlg-background-image"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://help.graebert.com/en/articles/6202248-troubleshooting-crash-on-start-launch-ares-commander-2022-and-newer-versions"
  - "https://help.graebert.com/en/articles/11070080-ares-commander-2026-release-notes"
  - "https://help.graebert.com/en/articles/3057171-release-history-of-ares-commander"
---

# ARES Commander Startup and LISP Compatibility: OpenGL Profile Crash on Launch, LISP Command Incompatibility, Cloud Storage Edit Session Lock, acad_colordlg Crash, and Missing Background Image Fatal Error

ARES Commander (by Graebert) is a cross-platform DWG editor with LISP support and cloud storage integration. However, users encounter startup crashes from OpenGL profile mismatches, LISP incompatibilities from command behavior differences, cloud storage edit session locks, and fatal crashes from missing DWG references. This guide covers each failure mode with diagnostic steps and fixes from Graebert's help center and release notes.

## 1. OpenGL Profile Crash on Launch

### Symptom

ARES Commander 2022 and newer versions crash immediately on launch. The application cannot start. This is usually caused by old display device drivers or dated OS components.

### Diagnosis

1. **Check system requirements** — ensure hardware meets or exceeds ARES Commander requirements
2. **Update OS** — check Windows Update history for failed or pending updates
3. **Update display driver** — download directly from the GPU manufacturer's website (NVIDIA, AMD, Intel), not from Windows Update

### Fix: Force OpenGL Profile via Desktop Shortcut

If updating drivers doesn't resolve the crash, force ARES Commander to start under a different OpenGL profile:

1. Right-click the ARES Commander desktop shortcut → **Properties**
2. Go to the **Shortcut** tab
3. In the **Target** field, add `/glprofile angle` after the executable path:
   ```
   "C:\Program Files\Graebert\ARES Commander\ARESC-exe.exe" /glprofile angle
   ```
4. Click OK
5. Launch ARES Commander via the edited shortcut

### Available OpenGL Profiles

| Profile | Behavior | Platform |
|---------|----------|----------|
| `core` | Recommended default — may crash on some systems | All |
| `angle` | Uses ANGLE (DirectX-to-OpenGL translation) | Windows only |
| `compatibility` | Fallback for older graphics hardware | All |

If `angle` doesn't work, try `compatibility`. The `OPENGLPROFILE` command can also be used within ARES Commander to test different profiles (if the application can start with one of them).

## 2. LISP Command Incompatibility: Array Option in COPY and 3D Polyline Offset

### Symptom

LISP routines that work in AutoCAD fail in ARES Commander. Specific command behaviors differ, causing LISP errors or unexpected results.

### Documented Incompatibilities (Fixed in 2026)

1. **Array option in COPY command**: The Array option in the COPY command was causing LISP incompatibilities [DESKTOP-392038]
   - Fixed in ARES Commander 2026
   - Older versions: Modify LISP routines to avoid using the Array option within COPY

2. **3D Polyline offset via LISP**: Offsetting 3D Polylines using LISP routines failed [DESKTOP-403039]
   - Fixed in ARES Commander 2026
   - Older versions: Use a workaround — explode 3D polyline to lines, offset lines, rejoin

3. **TTR/TTT circles via Script/LISP**: Creating TTR (Tangent-Tangent-Radius) or TTT (Tangent-Tangent-Tangent) circles through Script or LISP was not possible [DESKTOP-94046]
   - Fixed in ARES Commander 2025
   - Specifying different tangents with a script was also unsupported

4. **Korean language LISP commands**: Some LISP routines fail as commands do not process parameters in Korean language as expected [DESKTOP-94259]
   - Fixed in ARES Commander 2025

5. **ColorDialog in Modal Dialog**: Calling ColorDialog in a custom Modal Dialog via LISP caused it to lose modal properties and the mouse cursor to disappear [DESKTOP-337059]
   - Fixed in ARES Commander 2026

### Fix

1. **Update to ARES Commander 2026** — resolves most LISP incompatibilities
2. **Modify LISP routines** to avoid known incompatible command options
3. **Use the BLADE LISP development environment** — ARES Commander's built-in LISP IDE for testing
4. **Check release notes** for your version — known LISP issues are documented with DESKTOP IDs

## 3. Cloud Storage Edit Session Lock After Inactivity

### Symptom

After 50 minutes of inactivity, editing sessions from cloud storage cannot be resumed. A misleading error message appears when opening drawings from cloud storage after idle time.

### Root Cause

ARES Commander's cloud storage integration maintains an edit session lock to prevent concurrent editing. After 50 minutes of inactivity, the session expires, but the error message doesn't clearly indicate this.

### Fix

1. **Update to ARES Commander 2026** — resolved the 50-minute inactivity error [DESKTOP-117655]
2. **Close and reopen the drawing** — releases the expired edit session
3. **Save work before periods of inactivity** — prevents lost changes
4. **Check edit session status** — if the file opens as read-only after a crash, the edit session is still locked
   - Another user may need to recover the session
   - Use the cloud storage management panel to release the lock

### Cloud Storage Crash Recovery

If ARES Commander crashes with a file opened from cloud storage:
- The next time the file is opened, it opens as **read-only**
- The edit session becomes accessible to others after recovery [DESKTOP-291004]
- This prevents data loss from concurrent editing but can confuse users

## 4. acad_colordlg Crash: Color Book Tab and True Color Dialog

### Symptom

LISP command `(acad_colordlg 0)` causes ARES Commander to crash when accessing the **Color Book** tab. Similarly, `(acad_truecolordlg)` causes a crash — the RGB page doesn't appear in the Line Color dialog.

### Root Cause

The Color Book tab and True Color dialog had incomplete implementations in older ARES Commander versions, causing crashes when accessed via LISP.

### Fix

1. **Update to ARES Commander 2026** — both crashes are resolved:
   - `(acad_colordlg 0)` no longer crashes when accessing Color Book tab [DESKTOP-389897]
   - `acad_truecolordlg` RGB page now appears in Line Color dialog [DESKTOP-389899]
2. **Avoid LISP routines that call acad_colordlg** in older versions — use direct color setting via `(setvar "CECOLOR" "1")` instead
3. **Use the Properties panel** for color selection instead of LISP dialogs

## 5. Missing Background Image: Fatal Crash on DWG Open

### Symptom

Opening a DWG file that references a missing background image causes ARES Commander to crash. The application cannot locate the view's background image from the same folder as the current DWG.

### Root Cause

ARES Commander cannot find the background image file referenced in the DWG. Unlike AutoCAD, which may substitute a placeholder or ignore the missing reference, ARES Commander crashes.

### Fix

1. **Update to ARES Commander 2025+** — improved handling of missing background images [DESKTOP-308203]
2. **Ensure background image files are in the correct location** — same folder as the DWG or the original path
3. **Remove background image references** before sharing DWG files:
   - In AutoCAD: Use `IMAGEATTACH` → Detach
   - Or use `WBLOCK` to create a clean copy without background references
4. **Use RECOVER command** — may strip missing references and allow the file to open
5. **Insert the DWG into a new drawing** — creates a new file without the missing reference

### Additional Cloud Storage Issues

1. **Opening drawings with cloud-based xrefs** — causes performance issues or application crashes [DESKTOP-344219]
   - Fixed in ARES Commander 2025
2. **Crash on zoom in xref area** — when opening the same file from cloud storage for a second time [DESKTOP-122668]
   - Fixed in earlier releases
3. **DXF files on cloud storage** — cannot be saved back to cloud [DESKTOP-106854]
   - Save locally first, then upload to cloud
4. **Random crash in view-only mode** — when opening files from cloud storage [DESKTOP-99940]
   - Fixed in earlier releases

## 6. LISP-Specific Fixes Across Versions

### Fixed in 2026

- Dynamic prompts in LISP scripts now display correct messages [DESKTOP-336716]
- Array option in COPY command no longer causes LISP incompatibilities [DESKTOP-392038]
- 3D Polyline offset via LISP resolved [DESKTOP-403039]
- Panning in sheet space no longer causes parts of DWG to disappear [DESKTOP-412472]
- ColorDialog in Modal Dialog fixed [DESKTOP-337059]
- acad_colordlg Color Book tab crash fixed [DESKTOP-389897]
- acad_truecolordlg RGB page fixed [DESKTOP-389899]

### Fixed in Earlier Versions

- `tblobjname` LISP function fixed
- `vl-exit-with-value` function didn't work properly [DESKTOP-127825]
- Visual LISP reactor not working properly [DESKTOP-126274]
- `entmod` function hang with OLE objects [DESKTOP-100548]
- Application hangs when repeating loop to rotate an entity [DESKTOP-95575]
- `nentsel` function fixed to wait for user input with pre-selection [DESKTOP-52296]
- Command execution error with "()" in dimension text [DESKTOP-84038]

## Best Practices

1. **Use /glprofile angle** if ARES Commander crashes on launch — most common startup fix
2. **Update display drivers** from manufacturer website — not Windows Update
3. **Update to latest ARES Commander version** — many LISP and cloud fixes are version-specific
4. **Avoid acad_colordlg in LISP** on older versions — use setvar CECOLOR instead
5. **Remove background image references** before sharing DWG files
6. **Save before inactivity** — cloud edit sessions expire after 50 minutes
7. **Use RECOVER** for files with missing references
8. **Check release notes** for your version — known issues documented with DESKTOP IDs
9. **Save DXF files locally** before uploading to cloud storage
10. **Use BLADE LISP IDE** for testing LISP compatibility before deployment
