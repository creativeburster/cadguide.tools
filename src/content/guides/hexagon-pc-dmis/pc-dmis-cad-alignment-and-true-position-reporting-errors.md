---
title: "PC-DMIS CAD Alignment and True Position Reporting Errors"
excerpt: "PC-DMIS CAD Alignment and True Position Reporting Errors: symptoms, root causes, and step-by-step fixes, verified against Hexagon Nexus Community."
category: "troubleshooting"
softwareSlug: "hexagon-pc-dmis"
keyword: "PC-DMIS Legacy dimensions True Position internal datum reference frame D1 D2 D3 program alignment CAD model axis mismatch Part Machine Setup CAD refuses align reality original translation CAD=PART point cloud best fit specific surface plane alignment CAD offset CAD import coordinate system upside down Z facing down Transform axis reassignment"
slug: "pc-dmis-cad-alignment-and-true-position-reporting-errors"
author: "CADGuide Tools Editorial Team"
readTime: "13 min"
date: "2025-07-31"
sources:
---

# PC-DMIS CAD Alignment and True Position Reporting Errors: Legacy Dimensions True Position Uses Internal Datum Reference Frame D1 D2 D3 Differing from Program Alignment, CAD Model Axis Mismatch Requiring Part/Machine Setup Axis Configuration, CAD Refuses to Align with Reality from Original Translation Overriding Alignment Requiring CAD=PART, Point Cloud Best Fit Alignment Doesn't Match Specific Surface Requiring Plane Alignment and CAD Offset, and CAD Import Coordinate System Upside Down Z Facing Down Requiring Transform or Axis Reassignment

PC-DMIS's CAD alignment, true position reporting, and point cloud matching produce errors from datum reference frame differences, axis mismatches, and translation conflicts. This guide covers the 5 most common PC-DMIS problems with diagnostic steps and community-verified fixes from Hexagon Nexus Community.

## 1. Legacy Dimensions True Position Uses Internal Datum Reference Frame

### Symptom

Legacy dimensions in true position reporting use datum A BC, introducing D1, D2, and D3. Compared to standard reporting, the Y-axis values differ. The delta is significant — 0.177mm (0.007"). LOC14 and CIR51 show different location values between legacy and standard reporting.

### Root Cause

Legacy dimensions with "use datum" and "fit to datums" checked create an internal datum reference frame (D1, D2, D3) in the background — essentially an internal alignment. Standard dimensions come from the program's alignment. The difference between the internal datum reference frame and the program alignment causes the discrepancy. The alignment may use different math types (Chebyshev vs. standard LSQ) or different datum calculation methods.

### Fix

1. **Understand the two methods**:
   - The difference is between auto alignment vs. programmed alignment

2. **Use consistent alignment method**:
   - Create a manual alignment using datum features
   - This ensures the program alignment matches the datum reference frame

3. **Use BFRE for datum plane calculation**:
   - BFRE (Best Fit Recompensate Error) removes form error from the datum calculation
   - This provides more accurate datum reference

4. **Use Max_insc for B and C datums**:
   - Maximum inscribed cylinder/circle simulates the mating envelope
   - This is the correct math type for datum features that are holes/cylinders

5. **Migrate to XactMeasure or Geometric Tolerance**:
   - XactMeasure handles datum reference frames internally and consistently
   - Geometric Tolerance command (PC-DMIS 2018+) is the most accurate

6. **Document which method is used**:
   - Ensure all programs use the same reporting method
   - Don't mix legacy and XactMeasure for the same characteristic
   - "Which method is considered more accurate?" — Geometric Tolerance command is the most ASME/ISO compliant

### Community Report

> "Legacy dimensions use datum A BC, which introduces D1, D2, and D3. There are differences in the Y-axis value. The delta is significant — 0.177mm is nothing to scoff at. The first dimension has 'use datum' and 'fit to datums' checked, creating an internal alignment. Your other dimensions come from whatever alignment you have in your program."

## 2. CAD Model Axis Mismatch Requiring Part/Machine Setup

### Symptom

First time importing a CAD file into PC-DMIS 2018 R2. After import, the CAD model's coordinate system doesn't match the part placement on the CMM. The Z-axis is facing down (upside down). Manual alignment and CAD-to-part transform don't work because the coordinate system is inverted.

### Root Cause

The CAD model was created with a different axis convention than the CMM. The CAD Z-axis may point down (common in some aerospace conventions) while the CMM Z-axis points up. PC-DMIS maps CAD axes to machine axes based on the Part/Machine setup configuration. If this mapping isn't configured, the alignment uses the wrong axis vectors.

### Fix

1. **Configure Part/Machine axis mapping**:
   - Map CAD Z to Machine -Z (or appropriate axis)

2. **Use Read Point alignment**:
   - Read Point is quicker for one-off parts

3. **Transform CAD coordinate system**:
   - Use Transform function in PC-DMIS to rotate/translate the CAD model
   - Or use external CAD software (SolidWorks, etc.) to reorient before import

4. **Use CAD=PART after alignment**:
   - This syncs the CAD model position with the measured part position

5. **Check part/machine axis configuration before alignment**:
   - F5 > Part/Machine tab
   - Verify axis mapping is correct
   - Adjust before performing any alignment

6. **Use Readpoint for new users**.

### Community Report

> "My actual part on the CMM is placed with Z facing down. I tried using manual alignment and transform CAD model to part but it didn't work because the coordinate system is upside down. Go to Setup Options (F5), Part/Machine tab, Part Setup, change the CAD AXIS to the Machine AXIS."

## 3. CAD Refuses to Align with Reality from Original Translation

### Symptom

CAD model refuses to line up with where the part is in reality. Manual alignment of plane for Z, line for Y rotation, and lines for X translation all fail. CAD=PART has been tried multiple ways. The original CAD translation when uploading overrides the alignment — moving the original translation moves the alignment to that translation.

### Root Cause

When the CAD model is imported, PC-DMIS stores an original translation. This translation takes precedence over the alignment. When you perform an alignment, PC-DMIS moves the alignment to the CAD's original position, not the other way around. The alignment can't override the CAD's stored translation. There's no hole or feature to translate to that would work for this part.

### Fix

1. **Understand CAD translation vs. alignment**:
   - The CAD translation has priority over the alignment

2. **Transform the CAD model before alignment**:
   - Use Insert > Transform to move the CAD model to the desired position
   - Transform the CAD so its origin matches the desired alignment origin
   - Then perform the alignment

3. **Use CAD=PART carefully**:
   - After alignment, use CAD=PART to sync the model with the part
   - If it doesn't work, close without saving and try again

4. **Use external CAD software to reposition**:
   - Open the CAD model in SolidWorks, Fusion 360, etc.
   - Move the origin to the desired position
   - Re-export and import into PC-DMIS

5. **Create a partial alignment**.

6. **Avoid fully manual programming**:
   - Use the transform + alignment + CAD=PART workflow
   - If all else fails, re-export the CAD with correct origin from external software

### Community Report

> "The CAD model refuses to line up with where the part is in reality. The original translation of the CAD when uploading will not automatically translate to the alignment, but will move the alignment to the original translation. I figured this out by moving the original translation and PC-DMIS moved the alignment to that translation."

## 4. Point Cloud Best Fit Alignment Doesn't Match Specific Surface

### Symptom

After scanning a workpiece with an arm scanner, need to align the CAD model so a particular surface is perfectly matched. When applying the colormap, that surface should be zeroed (green). Automatic alignment does a best fit without considering the specific surface requirement. Moving CAD origins and aligning axes along the surface didn't produce the desired result.

### Root Cause

The point cloud alignment utility performs a global best fit, which minimizes overall deviation across all points. This doesn't guarantee that a specific surface will be zeroed. The best fit distributes deviation across all surfaces, so the critical surface may still show deviation. To force a specific surface to zero, a targeted alignment is needed.

### Fix

1. **Create a plane on the critical surface**:
   - Extract the plane from the point cloud on the desired surface
   - Use this plane in the alignment

2. **Use point cloud alignment tool for initial best fit**:
   - This gets the point cloud roughly aligned with the CAD
   - Then refine with the targeted plane alignment

3. **Use CAD offset to filter edge points**:
   - This ensures only the flat surface is used for alignment

4. **Use New Alignment for plane leveling**:
   - This constrains 3 degrees of freedom (plane orientation and Z-origin)

5. **Perform CAD=PART after partial alignment**:
   - Save the program before CAD=PART
   - CAD=PART cannot be undone

6. **Understand alignment vs. CAD origin**.

### Community Report

> "Once I scan my workpiece I want to align the CAD model so a particular surface must be perfectly matched. The program seems to do the best fit without considering my needs. Create a plane on the surface, then align using the created plane. Use CAD offset to filter out edge points. Use new alignment to level and origin to the plane."

## 5. CAD Import Coordinate System Upside Down Z Facing Down

### Symptom

CAD model imported into PC-DMIS has Z-axis facing down. The part on the CMM has Z-axis facing up. The coordinate system is inverted, making alignment impossible. Manual alignment fails because the point vectors are inverted.

### Root Cause

The CAD model was created with a Z-down convention (common in aerospace and some automotive industries). PC-DMIS imports the CAD with its native coordinate system. The CMM's Z-axis points up. When the CAD Z is down, probing a surface gives a vector opposite to what the CAD expects, causing alignment to fail.

### Fix

1. **Change CAD axis to Machine axis mapping**:
   - Map CAD Z to Machine -Z

2. **Transform the CAD model**:
   - Use Insert > Transform > Rotate
   - Rotate the CAD model 180 degrees around X or Y axis
   - This flips Z from down to up
   - Then perform the alignment

3. **Re-export CAD with correct orientation**:
   - Open the CAD in external software (SolidWorks, CATIA, etc.)
   - Change the coordinate system so Z points up
   - Re-export as STEP or IGES
   - Re-import into PC-DMIS

4. **Use Readpoint alignment**:
   - Place probe at the readpoint position manually
   - Execute from the readpoint

5. **Perform manual alignment with corrected vectors**:
   - After changing axis mapping in F5 settings
   - Perform manual alignment: level to plane, rotate to line, translate to point
   - The point vectors should now be correct
   - Then use CAD=PART to sync

6. **For high-volume parts, use DCC alignment**.

### Community Report

> "My CAD model coordinate system when imported has Z facing down. My actual part on CMM is placed with Z facing up. Go to Setup Options (F5), Part/Machine tab, Part Setup, change the CAD AXIS to the Machine AXIS. By doing this, it will change the vector of the points you use for your manual alignment."

## 6. Additional PC-DMIS Issues

### Readpoint Alignment for New Users

**Issue**: Brand new to CMM, need to align CAD to part from scratch.
**Fix**: "Use the readpoint function — it's the quickest way. Insert a readpoint by typing 'read' in the edit window. Place your probe manually at the readpoint position. Then execute the program from the readpoint with your probe manually placed there."

### CAD=PART Cannot Be Undone

**Issue**: CAD=PART produces unexpected results and can't be reversed.
**Fix**: "Save the program before doing the CAD=PART command, just in case it does something weird. CAD=PART can not be undone." If it goes wrong, close the program without saving and reopen.

### Auto Alignment vs. Programmed Alignment

**Issue**: Auto alignment gives different results than programmed alignment.
**Fix**: "I was taught to never use auto alignment. A very simple alignment: level to plane A, rotate from B to C, then transfer XYZ to A or B. The difference is between auto alignment vs. programmed alignment. Maybe auto alignment designs based on best fit."

### XactMeasure vs. Legacy Dimensions

**Issue**: XactMeasure and legacy dimensions give different true position results.
**Fix**: "XactMeasure does not do any recalculation of datums. Constructing a primary datum plane to use in the alignment would only make sense if running a current version using the geometric tolerance command. Both 2015.1 and 2019.2 use XactMeasure."

## Best Practices

1. **Configure Part/Machine axis mapping before alignment** — F5 > Part/Machine tab
2. **Use Readpoint for new users or one-off parts** — quickest alignment method
3. **Save before CAD=PART** — it cannot be undone
4. **Transform CAD before alignment if origin is wrong** — or re-export from CAD software
5. **Use BFRE with Constrained_L2 for datum planes** — more accurate than BF
6. **Use Max_insc for hole/cylinder datums** — simulates mating envelope
7. **Don't mix legacy and XactMeasure reporting** — use one method consistently
8. **Create targeted plane alignment for critical surfaces** — not just best fit
9. **Use CAD offset to filter edge points** — avoids fillet interference
10. **Use DCC alignment for high-volume parts** — eliminates manual probing each run
