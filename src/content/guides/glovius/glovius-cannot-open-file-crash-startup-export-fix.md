---
title: "Glovius CAD Viewer Won't Open Files, Crashes on Startup, and Export Limitations: Official Fixes"
excerpt: "Glovius users hit three recurring issues: can't open CAD files on older versions, crashes on launch due to graphics drivers or missing VC++ runtime, and STEP/IGES export blocked by trial limitations. We cover each with steps from Glovius official support."
category: "troubleshooting"
softwareSlug: "glovius"
keyword: "Glovius CAD viewer crash startup cannot open file export STEP fix"
slug: "glovius-cannot-open-file-crash-startup-export-fix"
author: "CADGuide Tools Editorial Team"
readTime: "7 min"
date: "2025-07-30"
sources:
  - "https://www.glovius.com/support/faqs/"
  - "https://www.glovius.com/support/release-notes-archive/"
  - "https://www.glovius.com/cad-viewer/"
---

# Glovius CAD Viewer Won't Open Files, Crashes on Startup, and Export Limitations: Official Fixes

Glovius is a lightweight CAD viewer that supports CATIA, NX, SolidWorks, Creo, Inventor, Solid Edge, STEP, IGES, and JT files. Three issues account for the majority of support tickets: file open failures, startup crashes, and export format restrictions. All three have documented fixes from Glovius support.

## Issue 1: Cannot Open CAD Files

**Symptom**: Glovius launches but fails to open a CAD file, showing an error or doing nothing.

**Root Cause**: The file format was introduced in a newer version of Glovius than the one installed. For example, SolidWorks 2022 files require a Glovius version that supports the SolidWorks 2022 format — older Glovius builds cannot parse the newer file structure.

**Fix**:

1. Download the **latest Glovius version** from `https://www.glovius.com/downloads/`
2. Install and relaunch
3. If the file still won't open, email `support@glovius.com` with the file attached for analysis

Glovius adds support for new CAD format versions with each release. Checking the release notes archive confirms which formats are supported in your version.

## Issue 2: Crashes on Startup

**Symptom**: Glovius crashes immediately on launch, sometimes with no error message.

**Fix Sequence** (from official FAQ):

1. **Update Glovius** to the latest version from `https://www.glovius.com/downloads/`
2. **On Windows 7**: Install **VC redist 2015** from `https://www.microsoft.com/en-in/download/details.aspx?id=48145`
3. **Update graphics drivers**:
   - Open **Device Manager** from Control Panel
   - Expand **Display adapters**
   - Right-click your video card → **Update driver**
4. If Glovius still crashes, locate the crash log file and email it to `support@glovius.com` for analysis

**Note**: Glovius requires a minimum of 4GB RAM and Windows 10 or 11. On Windows 7, the VC++ runtime is the most common crash cause. On Windows 10/11, graphics driver incompatibility is the primary culprit.

## Issue 3: Cannot Export to STEP, IGES, or JT

**Symptom**: Export options for STEP, IGES, 3D PDF, or JT are grayed out or produce an error.

**Root Cause**: These export formats require a **Glovius PLUS** license. The free trial version and the basic viewer do not include format export capabilities.

**Fix**:

1. Contact `support@glovius.com` to request a **trial license of Glovius PLUS**
2. Once activated, export to STEP, IGES, JT, 3D PDF, 3D HTML, STL, OBJ, and other formats becomes available

The free viewer supports: viewing, measuring, sectioning, analyzing, and exporting to image formats (BMP, JPG, PNG). The PLUS license adds: STEP/IGES/JT export, 3D PDF with BREP, Bill of Materials reports, and 3D Compare.

## Issue 4: Measurement Errors on Scaled 2D Drawings

**Symptom**: Point-to-point measurements on 2D drawing files show incorrect values.

**Root Cause**: A known bug in measurement calculation for scaled views in 2D drawing files. This was identified and fixed in a Glovius release notes update.

**Fix**: Update to the latest Glovius version. The fix addresses measurement calculation in scaled views specifically. If the issue persists, verify the drawing's scale factor in the source CAD application and report the file to Glovius support.

## Issue 5: Slow Performance on Large Files (400MB+)

**Symptom**: Glovius becomes unresponsive when opening very large CAD assemblies (400MB and above).

**Fix**: Update to the latest version — performance improvements for 400MB+ files were specifically addressed in release notes:

- Optimized computation of component properties for the Analyze tool
- Product Structure performance improvements
- Improved file rendering for smoother transitions after opening

If performance is still inadequate, use the **Hide/Isolate** functions to reduce the number of displayed components during analysis. The **Explode** tool can also help navigate large assemblies by separating components visually.

## Supported File Formats (Current)

Glovius supports viewing the following CAD formats:

| Source CAD | Format Extensions |
|------------|-------------------|
| CATIA V5 | `.CATPart`, `.CATProduct` |
| Siemens NX | `.prt`, `.asm` |
| SolidWorks | `.sldprt`, `.sldasm`, `.slddrw` |
| PTC Creo / Pro-E | `.prt`, `.asm`, `.creoprt`, `.nxprt` |
| Autodesk Inventor | `.ipt`, `.iam` |
| Solid Edge | `.par`, `.asm`, `.dft` |
| Neutral | `.step`, `.stp`, `.iges`, `.igs`, `.jt`, `.stl`, `.3mf` |

Each new Glovius release adds support for the latest version of these formats. If a file from a recently released CAD version won't open, check the release notes to confirm support was added.
