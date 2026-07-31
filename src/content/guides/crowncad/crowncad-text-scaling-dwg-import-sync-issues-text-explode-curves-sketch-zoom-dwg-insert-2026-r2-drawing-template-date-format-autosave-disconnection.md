---
title: "CrownCAD Cloud CAD Text Scaling, DWG Import, and Sync Issues: Text Cannot Scale or Stretch Without Exploding to Curves, Sketch Zoom Limitation Prevents Text Enlargement, DWG Insert into Sketch from 2026 R2, Engineering Drawing Template Date Format Errors, and Internet Disconnection Auto-Save Recovery"
excerpt: "CrownCAD fails for 5 distinct reasons: text cannot be scaled or stretched without exploding to curves unlike SolidWorks, sketch zoom doesn't allow text enlargement, DWG files can now be inserted directly into sketches from 2026 R2, engineering drawing templates have incorrect date format with missing or extra spaces, and internet disconnection auto-save preserves session state for sync on reconnection. We cover each with fixes from CrownCAD community and documentation."
category: "text-scaling-and-dwg-import-issues"
softwareSlug: "crowncad"
keyword: "CrownCAD text scaling stretch explode curves sketch zoom DWG insert sketch 2026 R2 engineering drawing template date format internet disconnection auto-save sync"
slug: "crowncad-text-scaling-dwg-import-sync-issues-text-explode-curves-sketch-zoom-dwg-insert-2026-r2-drawing-template-date-format-autosave-disconnection"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://cloud.tencent.com/developer/news/1037628"
  - "https://www.crowncad.com/english/guide/navigation.html"
  - "https://sde.vn/en/cad-collaboration-real-time-collaborative-design-on-crowncad/"
---

# CrownCAD Cloud CAD Text Scaling, DWG Import, and Sync Issues: Text Cannot Scale or Stretch Without Exploding to Curves, Sketch Zoom Limitation Prevents Text Enlargement, DWG Insert into Sketch from 2026 R2, Engineering Drawing Template Date Format Errors, and Internet Disconnection Auto-Save Recovery

CrownCAD is a cloud-based 3D CAD platform with strong SolidWorks file import and real-time collaboration, but text handling, sketch scaling, DWG import, and template formatting have limitations. This guide covers the 5 most common CrownCAD problems with diagnostic steps and community-verified fixes from CrownCAD community and documentation.

## 1. Text Cannot Scale or Stretch Without Exploding to Curves

### Symptom

Text cannot be scaled or stretched directly like in SolidWorks. In SolidWorks, text size can be freely defined and text can be extruded directly. In CrownCAD, text must be exploded (dissolved) and converted to curves before any scaling or extrusion operations.

### Root Cause

CrownCAD's text handling is more limited than SolidWorks. Text objects are treated as atomic entities that can't be directly scaled, stretched, or extruded. They must first be converted to curve geometry (exploded) before any transformation operations can be applied.

### Fix

1. **Explode text to curves**:
   - Select the text object
   - Use the Explode/Dissolve command
   - The text converts to individual curve segments
   - Curves can then be scaled, stretched, or extruded

2. **Scale after exploding**:
   - Once text is curves, use the Scale command
   - Select all curve segments of the text
   - Apply the desired scale factor
   - Note: individual letter proportions may need adjustment

3. **Extrude after exploding**:
   - Convert text to curves first
   - Select the curves
   - Use the Extrude command
   - Set the extrusion depth

4. **Set text size before exploding**:
   - Choose the correct font size before exploding
   - After exploding, size changes require manual curve editing
   - Plan ahead to minimize rework

5. **Compare with SolidWorks workflow**:
   - SolidWorks: create text → set size → extrude (all in one step)
   - CrownCAD: create text → set font/size → explode to curves → scale/transform → extrude
   - The extra steps are a current limitation

### Community Report

> "In SolidWorks, text can be freely defined in size and directly stretched, but in CrownCAD text needs to be dissolved and converted to curves first. Character processing seems to be a difficulty for domestic 3D software."

## 2. Sketch Zoom Limitation Prevents Text Enlargement

### Symptom

CrownCAD doesn't support sketch zoom (scaling) operations. When trying to enlarge text or other sketch elements within a sketch, the zoom/scale function is not available. The user wants to make text larger but can't scale it within the sketch environment.

### Root Cause

CrownCAD's sketch environment doesn't include a sketch-level scale or zoom command. This is a UI/feature limitation — the sketch tools don't include transform operations that would allow scaling of sketch elements.

### Fix

1. **Explode text first, then scale outside sketch**:
   - Explode the text to curves within the sketch
   - Exit the sketch
   - Scale the curve entities in the 3D environment
   - This is a workaround, not a direct fix

2. **Set the correct size before creating text**:
   - Choose the appropriate font size when creating the text
   - Since you can't scale later, get the size right upfront
   - Delete and recreate text if the size is wrong

3. **Use a reference dimension approach**:
   - Create text at a standard size
   - Use reference geometry to measure the desired size
   - Recreate the text at the correct size

4. **Request the feature from CrownCAD**:
   - Submit a feature request for sketch-level scaling
   - CrownCAD is actively developing and accepts user feedback
   - This is a commonly requested feature

### Community Report

> "CrownCAD doesn't support sketch zoom. I want to enlarge the text CAD2D3D but can't achieve it. The text effect is truly a difficult problem for domestic 3D software."

## 3. DWG Insert into Sketch from 2026 R2

### Symptom

Previously, reusing legacy 2D drawings required multiple conversion steps. Users needed to import DWG files, extract geometry, and manually place it into sketches. With CrownCAD 2026 R2, a new Insert DWG feature is available.

### Root Cause

Older CrownCAD versions didn't support direct DWG insertion into the sketch environment. Users had to use intermediate steps or external converters. The 2026 R2 update adds this capability natively.

### Fix

1. **Use Insert DWG command (2026 R2+)**:
   - In the sketch environment, select Insert DWG
   - Choose a local DWG file
   - All geometric data is imported into the project
   - Geometry is accurately placed on the working plane
   - Existing design data can be seamlessly reused

2. **Supported import/export formats**:
   - Import: STEP, IGES, Parasolid, DWG, DXF
   - Export: STEP, IGES, DWG, DXF
   - Direct DWG import into sketches is new in 2026 R2

3. **For older versions — use DXF as intermediary**:
   - Export DWG to DXF in another CAD tool
   - Import DXF into CrownCAD
   - Manually place geometry into sketches

4. **Verify geometry after import**:
   - Check that all entities imported correctly
   - Verify dimensions match the original DWG
   - Check for missing or distorted entities

### Community Report

> "With the new Insert DWG feature, users can now import local DWG files directly into the active sketch environment. Once the command is selected, all geometric data is brought into the project and accurately placed on the working plane."

## 4. Engineering Drawing Template Date Format Errors

### Symptom

Engineering drawing templates in CrownCAD have incorrect date formats. The year/month/day format has missing or extra spaces, making the date display look unprofessional. This is not a technical issue but a formatting/template issue.

### Root Cause

The default drawing templates shipped with CrownCAD have formatting errors in the date field. The template's text field for the date doesn't have proper spacing between year, month, and day components.

### Fix

1. **Edit the drawing template**:
   - Open the drawing template editor
   - Find the date field in the title block
   - Adjust the spacing between date components
   - Save the template

2. **Create a custom template**:
   - Start from scratch or modify the default template
   - Set the correct date format (e.g., YYYY-MM-DD or DD/MM/YYYY)
   - Ensure proper spacing
   - Save as a custom template for future use

3. **Use a text field instead of auto-date**:
   - Replace the automatic date field with a manual text field
   - Enter the date manually when creating drawings
   - This avoids the template formatting issue

4. **Report the template issue to CrownCAD**:
   - This is a template quality issue, not a software bug
   - Submit feedback to CrownCAD support
   - Future template updates may fix the formatting

### Community Report

> "The engineering drawing template date format is incorrect — there's clearly a missing or extra space. This is not a technical issue, it's an attitude issue, and attitude is more worrying than technology."

## 5. Internet Disconnection Auto-Save Recovery

### Symptom

When the internet connection becomes unstable or drops during a CrownCAD session, users worry about losing design work. Since CrownCAD is cloud-based, disconnection could potentially lose all unsaved work.

### Root Cause

CrownCAD is a cloud-based platform that requires internet connectivity. However, it includes an auto-save mechanism that continuously records the project state. The system is designed to handle connection interruptions gracefully.

### Fix

1. **CrownCAD auto-saves after every operation**:
   - The auto-save mechanism records the project state after every click or modeling operation
   - No manual saving is required — the system continuously saves
   - This is a core feature of the cloud architecture

2. **If internet is interrupted**:
   - CrownCAD temporarily pauses
   - The current session state is preserved locally
   - Wait for the connection to restore
   - All data is synchronized immediately on reconnection
   - No design work is lost

3. **Real-time sync technology**:
   - When Engineer A is editing a feature, Engineer B sees a notification indicator
   - Changes by Engineer A are instantly updated on Engineer B's screen
   - This eliminates data conflicts and version collisions
   - If sync is interrupted, it resumes on reconnection

4. **Version control for recovery**:
   - CrownCAD maintains complete operation history
   - Users can review design history and compare differences
   - Any previous version can be restored with a single click
   - This provides an additional safety net beyond auto-save

5. **Sharing links for external review**:
   - Generate a secure sharing link with view-only permissions
   - Recipients don't need a CrownCAD account
   - They can open the link in a web browser on phone or computer
   - They can rotate, inspect, section-view, and annotate the 3D model

### Community Report

> "CrownCAD includes an Auto-save mechanism that continuously records the project state after every click or modeling operation. If the internet connection is interrupted unexpectedly, the software temporarily pauses while preserving the current session state. Once the connection is restored, all data is synchronized immediately without losing any design work."

## 6. Additional CrownCAD Issues

### SolidWorks Assembly Import

**Issue**: Can CrownCAD import SolidWorks assembly files?
**Fix**: Yes — SolidWorks assembly files import directly into CrownCAD with display fidelity matching the original. The import is smooth and operations are fluid.

### Limited International Documentation

**Issue**: CrownCAD documentation is primarily in Chinese, with limited English documentation.
**Fix**: Use the English guide at crowncad.com/english/guide/. The community is growing internationally. Submit documentation requests to support.

### Steep Learning Curve for Advanced Modeling

**Issue**: Advanced modeling features have a steep learning curve.
**Fix**: Start with basic part modeling, then progress to assemblies and drawings. Use the built-in tutorials. Join the community for tips.

### Plugin Ecosystem Development

**Issue**: CrownCAD's plugin ecosystem is still developing.
**Fix**: The platform supports private cloud, public cloud, and hybrid cloud deployments. Third-party plugins are being developed. Check the CrownCAD marketplace regularly.

### Cloud Security Concerns

**Issue**: Users worry about design data security on the cloud.
**Fix**: CrownCAD uses enterprise-grade data security protocols including end-to-end encryption and automatic backups. This often provides higher security than local storage vulnerable to viruses or hardware failures.

## Best Practices

1. **Explode text to curves before scaling or extruding** — CrownCAD's text is atomic
2. **Set text size correctly before exploding** — can't easily resize after
3. **Use Insert DWG in 2026 R2+** — direct DWG import into sketches
4. **Create custom drawing templates** — fix date format spacing issues
5. **Trust the auto-save mechanism** — work is preserved even on disconnection
6. **Use version control to restore previous states** — single-click recovery
7. **Generate sharing links for external review** — no account needed for viewers
8. **Import SolidWorks assemblies directly** — display fidelity is maintained
9. **Start with basic modeling** — progress to advanced features gradually
10. **Submit feature requests to CrownCAD** — the platform is actively developing
