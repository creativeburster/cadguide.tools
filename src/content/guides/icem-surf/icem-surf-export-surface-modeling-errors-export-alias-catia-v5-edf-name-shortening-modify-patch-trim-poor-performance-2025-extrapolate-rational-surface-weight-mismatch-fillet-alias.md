---
title: "ICEM Surf Export and Surface Modeling Errors: Export to Alias and CATIA V5 from EDF Name Shortening and CATIA V5 Export Window Error Requiring Format Workarounds, Modify Patch Trim Poor Performance in 2025.2 from Extrapolate Behavior Change Requiring Tangent Extrapolation, Rational Surface Weight Mismatch from Fillet Creation Requiring Weight Reset to 1, Alias 2017 CatPart Import COS from Trimmed Surfaces Requiring Untrim and Retrim, and ICEM Surf 2025.2 Bug Fixes in Trim Face RM and IO Requiring Update"
excerpt: "ICEM Surf fails for 5 distinct reasons: export to Alias and CATIA V5 from EDF name shortening and CATIA V5 export window error requiring format workarounds, Modify Patch Trim poor performance in 2025.2 from extrapolate behavior change requiring tangent extrapolation, rational surface weight mismatch from fillet creation requiring weight reset to 1, Alias 2017 CatPart import COS from trimmed surfaces requiring untrim and retrim, and ICEM Surf 2025.2 bug fixes in trim face RM and IO requiring update. We cover each with fixes from 3DS Community and McNeel Forum."
category: "troubleshooting"
softwareSlug: "icem-surf"
keyword: "ICEM Surf export Alias CATIA V5 EDF name shortening export window error Modify Patch Trim poor performance 2025.2 extrapolate behavior tangent extrapolation rational surface weight mismatch fillet creation weight reset Alias 2017 CatPart import COS trimmed surfaces untrim retrim 2025.2 bug fixes trim face RM IO update"
slug: "icem-surf-export-surface-modeling-errors-export-alias-catia-v5-edf-name-shortening-modify-patch-trim-poor-performance-2025-extrapolate-rational-surface-weight-mismatch-fillet-alias"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-08-02"
sources:
  - "https://3dswym.3dexperience.3ds.com/post/catia-creative-design-styling-user-community/is-it-possible-to-export-from-icem-to-alias-catia-and-not-die-trying_KNfZiAhKSLWB9WsV9SmvFw"
  - "https://3dswym.3dexperience.3ds.com/post/catia-creative-design-styling-user-community/icem-surf-2025-modify-patch-trim-is-really-poor_5B6nrAKWTzu7fgXv5Qloxw"
  - "https://discourse.mcneel.com/t/odd-issue-with-single-span-surface/138950"
---

# ICEM Surf Export and Surface Modeling Errors: Export to Alias and CATIA V5 from EDF Name Shortening and CATIA V5 Export Window Error Requiring Format Workarounds, Modify Patch Trim Poor Performance in 2025.2 from Extrapolate Behavior Change Requiring Tangent Extrapolation, Rational Surface Weight Mismatch from Fillet Creation Requiring Weight Reset to 1, Alias 2017 CatPart Import COS from Trimmed Surfaces Requiring Untrim and Retrim, and ICEM Surf 2025.2 Bug Fixes in Trim Face RM and IO Requiring Update

ICEM Surf's export formats, patch trimming, surface weights, CATIA compatibility, and version updates produce errors from EDF limitations, extrapolate changes, rational surfaces, trim conversion, and bug fixes. This guide covers the 5 most common ICEM Surf problems with diagnostic steps and community-verified fixes from 3DS Community and McNeel Forum.

## 1. Export to Alias and CATIA V5 from EDF Name Shortening

### Symptom

Need to export files from ICEM Surf to Alias without losing editing capabilities. EDF format works but modifies (shortens) the names of lists that group surfaces. CATIA V5 export option produces an error window when attempted. Need a format that preserves surface names and editability.

### Root Cause

The EDF format truncates list names to fit its naming convention limitations. The CATIA V5 export has a bug or configuration issue that produces an error window. ICEM Surf's export filters have limitations in preserving metadata (list names, grouping information) when converting to other formats. The CATIA V5 export may require specific license or configuration settings.

### Fix

1. **Use EDF format with name adjustment**:
   - "The only format that's worked for us has been EDF"
   - "But the problem is that the names of the different lists that group the surfaces are modified (it shortens them)"
   - After export, manually rename the lists in Alias
   - Or use shorter list names in ICEM Surf before export

2. **Try CATIA V5 export with different settings**:
   - "When I try to export as Catia v5, oops! This window appears"
   - Check the CATIA V5 export settings
   - Try different export options (version, precision)
   - Verify the CATIA V5 export license is available

3. **Use STEP as intermediate format**:
   - Export from ICEM Surf as STEP
   - Import STEP into CATIA V5
   - Import STEP into Alias
   - Check if surface names are preserved

4. **Use IGES as alternative**:
   - Export from ICEM Surf as IGES
   - Import into Alias
   - IGES may preserve grouping differently
   - Check editability after import

5. **Contact 3DS support for CATIA V5 export issue**:
   - The error window on CATIA V5 export is likely a bug
   - Report to 3DS support with:
     - ICEM Surf version
     - Error message screenshot
     - Sample file
   - Request a fix or workaround

6. **Use ICEM Surf Direct Link**:
   - If available, use the Direct Link between ICEM Surf and CATIA
   - This preserves associativity and naming
   - Check if Direct Link is licensed
   - Configure the connection between the software

### Community Report

> "We need to export files from Surf so they can be opened in Alias, without losing editing capabilities. The only format that's worked has been EDF, but the names of the different lists that group the surfaces are modified (it shortens them). A colleague suggested exporting as Catia v5, but when I try, this window appears. Any help is appreciated!"

## 2. Modify Patch Trim Poor Performance in 2025.2

### Symptom

ICEM Surf 2025.2 Modify Patch - Trim function is very poor compared to 2021.2. It won't trim to a Plane. In 2021.2, with Extrapolate on, it would just trim even if the trim curve or Plane didn't quite connect two opposite sides. In 2025.2, it refuses until Tangent extrapolation is turned on. Turning on the Extrapolate option above Tangent and Curvature makes the patch disappear.

### Root Cause

"I know you have tried to make the function more consistent with Create-Patch Face but it is so temperamental and fussy now." The 2025 version changed the Modify Patch - Trim behavior to be more consistent with Create-Patch Face. This change made the trim function more strict about geometry requirements. The Extrapolate option's behavior changed — it now interacts differently with Tangent and Curvature extrapolation options, sometimes causing the patch to disappear.

### Fix

1. **Enable Tangent extrapolation**:
   - "In 2025.2 now, it refuses to do it until maybe Tangent extrapolation is turned on"
   - In the Modify Patch - Trim dialog
   - Enable Tangent extrapolation
   - This allows the trim to work with slightly incomplete curves

2. **Don't use Extrapolate with Tangent/Curvature**:
   - "If I turn this on, the patch now seems to disappear into outer space!"
   - Don't enable the Extrapolate option when Tangent or Curvature is on
   - Use only one extrapolation method at a time
   - The combination causes the patch to disappear

3. **Use 2021.2 for critical trim operations**:
   - "I am getting many complaints from users about how poor it is compared to 2021.2"
   - If 2025.2 trim is too problematic
   - Keep 2021.2 installed for critical work
   - Use 2025.2 for other tasks

4. **Ensure trim curves fully connect**:
   - In 2025.2, the trim function is stricter
   - Ensure trim curves or planes fully connect two opposite sides
   - Don't rely on extrapolation to fill gaps
   - Create complete trim geometry

5. **Use Create-Patch Face instead**:
   - Since 2025 made Modify Patch - Trim consistent with Create-Patch Face
   - Use Create-Patch Face directly
   - This may give more predictable results
   - The behavior is the same as the new Modify Patch - Trim

6. **Report to 3DS**:
   - "I don't know what you have done to the Modify Patch - Trim function"
   - "But I am getting many complaints from users"
   - Report the regression on the 3DS Community
   - Request restoration of 2021.2 behavior or a fix

### Community Report

> "ICEM Surf 2025 Modify Patch - Trim is really poor compared to 2021.2. It's so temperamental and fussy now. Often it won't trim to a Plane. In 2021.2, with Extrapolate on, it would just do it, no errors. In 2025.2, it refuses until maybe Tangent extrapolation is turned on. If I turn Extrapolate on above this, the patch disappears into outer space!"

## 3. Rational Surface Weight Mismatch from Fillet Creation

### Symptom

Matching Surface A into Surface B in Rhino — control points from Surface A get screwed up. Both surfaces show the same degree in U (degree 5) in Rhino. But when imported into ICEM Surf, Surface B shows degree 10. The edges don't match even though control points do.

### Root Cause

"The CVs have individual weights (not all 1)." Surface B was created by snipping off the end of a 2.5mm tangential fillet with split by iso curve. The tangential fillet is a degree 2 rational surface with a weighted centre control point. When the surface was split, the rational weights were preserved. Rhino's MatchSrf adjusts control point locations but not weights. "Two surfaces with different weights on the relevant control points cannot exactly match, even if the degrees, number of control points and knot parameter values are exactly the same."

### Fix

1. **Reset all CV weights to 1**:
   - "Select all CVs of this surface and set weight to 1"
   - "Check again if export-import behaves better"
   - In Rhino, select all control points
   - Use SetWeight command to set all to 1
   - This makes the surface non-rational

2. **Avoid rational surfaces for precision modeling**:
   - "In general for precision modeling, rational surfaces (some or all weights not equal to 1) are best avoided"
   - "An exception is for special cases such as spheres, cylinders, etc where non-unity weights are required to exactly represent conics"
   - Check weights after any fillet or conic operation
   - Reset to 1 if exact matching is needed

3. **Use G2 blend instead of circular arc fillet**:
   - "FilletSrf in V7 has an option to use a G2 (curvature continuity) blend surface rather than a circular arc surface"
   - "The G2 blend surface will be non-rational, single span of degree 5 with 6 control points"
   - This avoids rational weights entirely
   - But the result is not a constant radius fillet

4. **Rebuild fillet to non-rational**:
   - "A circular arc fillet can be rebuilt to a non-rational degree 3 surface using RebuildUV in the V direction"
   - "Note that the result may be multi-span in the V direction"
   - Use RebuildUV after creating the fillet
   - This removes rational weights

5. **Use degree 6 for arc fillet accuracy**:
   - "When I worked in the Class-A dept of an Auto manufacturer, we surfaced in single span only"
   - "Tangential arc fillets were degree 6 (order 7) because it was deemed to be the least number of control points but the most accurate to an arc within manufacturing tolerance"
   - Use degree 6 single span for arc approximation
   - This is non-rational and accurate

6. **Check weights in ICEM Surf**:
   - ICEM Surf shows the actual degree (10 in this case)
   - Use ICEM Surf's diagnostics to identify rational surfaces
   - Check weight values on control points
   - Reset to 1 for non-rational workflow

### Community Report

> "When I tried matching Surface A into Surface B, the control points got screwed up. Both surfaces have the same degree in U (degree 5) in Rhino, but ICEM Surf showed Surface B to be degree 10. The CVs have individual weights (not all 1). Surface B was created by snipping off the end of a tangential fillet — a degree 2 rational surface with a weighted centre control point. Select all CVs and set weight to 1 — check again. In general, rational surfaces are best avoided for precision modeling."

## 4. Alias 2017 CatPart Import COS from Trimmed Surfaces

### Symptom

Importing CatPart files saved from the latest ICEM Surf into Alias 2017. Getting a lot of COS (Curves on Surface) around the border. Trimmed surfaces (called "faced" surfaces in ICEM Surf) produce COS around the edges where they were cut. Getting COS on top and bottom edges plus small lines at the bottom. This doesn't happen in Alias 2016.

### Root Cause

"They must have made a change somewhere in the translator code because none of the open options seem to make any difference." Alias 2017 changed the CATIA file translator, which handles ICEM Surf's trimmed surfaces differently. The translator creates COS (Curves on Surface) on all edges of trimmed surfaces, not just the intended trim edge. This is a translator behavior change between Alias 2016 and 2017.

### Fix

1. **Use Alias 2016 for ICEM Surf CatPart import**:
   - "This does not happen in 2016"
   - If Alias 2016 is available, use it for importing ICEM Surf CatParts
   - Import in 2016, then open in 2017
   - This avoids the translator issue

2. **Untrim surfaces before export**:
   - "Untrim the surface and you'll see it"
   - In ICEM Surf, untrim the surfaces before exporting
   - Export untrimmed surfaces
   - Retrim in Alias after import

3. **Delete unwanted COS in Alias**:
   - After import, identify the unwanted COS
   - Delete COS on top and bottom edges
   - Keep only the intended trim COS
   - This is manual cleanup but works

4. **Use STEP instead of CatPart**:
   - Export from ICEM Surf as STEP
   - Import STEP into Alias
   - STEP may handle trims differently
   - Check if COS are created correctly

5. **Report to Autodesk**:
   - "You might try reporting the problem to Autodesk"
   - "I don't know if this is a bug or a feature, but it is annoying"
   - Report the translator behavior change
   - Provide sample files for testing

6. **Use IGES format**:
   - Export from ICEM Surf as IGES
   - Import IGES into Alias 2017
   - IGES handles trimmed surfaces differently
   - Check if COS are created correctly

### Community Report

> "Importing CatParts saved from the latest ICEM Surf into Alias 2017 — getting a lot of COS around the border. Trimmed surfaces produce COS around the edges where they were cut. I get COS on top and a lot of small lines at the bottom. This does not happen in 2016. They must have made a change in the translator code. Untrim the surface and you'll see it. I don't know if this is a bug or a feature, but it is annoying."

## 5. ICEM Surf 2025.2 Bug Fixes in Trim Face RM and IO

### Symptom

Using ICEM Surf 2025.2. Various bugs in Trim, Face, RM (Recovery Management), and I/O (import/export) operations. Need to know if these are fixed in the latest version.

### Root Cause

ICEM Surf 2025.2 includes bug fixes for Trim, Face, RM, and I/O areas. These are known issues from earlier 2025 versions that have been addressed in the 2025.2 release. "Some bug fixes in the area of Trim, Face, RM, i/o."

### Fix

1. **Update to ICEM Surf 2025.2**:
   - "ICEM Surf 2025.2 is ready for download since last weekend"
   - Go to https://software.3ds.com/
   - Navigate to CATIA section and choose ICEM Surf
   - Download and install 2025.2

2. **Check release notes for specific fixes**:
   - "Some bug fixes in the area of Trim, Face, RM, i/o"
   - Review the 2025.2 release notes
   - Verify your specific issues are fixed
   - Test after updating

3. **Report unfixed bugs**:
   - If your issue persists in 2025.2
   - Report on the 3DS Community
   - Provide detailed reproduction steps
   - Include sample files

4. **Keep previous version as backup**:
   - Before updating to 2025.2
   - Keep the previous version installed
   - Test 2025.2 with your workflow
   - Revert if critical issues are found

5. **Participate in the 3DS Community**:
   - The CATIA Creative Design & Styling User Community
   - Report issues and share solutions
   - 3DS developers monitor the community
   - User feedback drives bug fixes

### Community Report

> "ICEM Surf 2025.2 is ready for download. Some bug fixes in the area of Trim, Face, RM, i/o. First go to CATIA section and choose ICEM Surf at https://software.3ds.com/. Happy Surfing!"

## 6. Additional ICEM Surf Issues

### EDF Format Limitations

**Issue**: EDF format shortens list names when exporting to Alias.
**Fix**: Use shorter list names in ICEM Surf. Or manually rename lists after import in Alias. Consider STEP or IGES as alternatives. Request EDF format improvements from 3DS.

### Extrapolate Behavior Confusion

**Issue**: "If you have Tangent and Curvature Extrapolate options, what is Extrapolate doing above this?"
**Fix**: The Extrapolate option above Tangent/Curvature appears to be a separate linear extrapolation. When combined with Tangent or Curvature, it causes unexpected behavior (patch disappearing). Use only one extrapolation method at a time.

### Cross-Software Surface Matching

**Issue**: Surfaces created in one software (Rhino) don't match exactly in another (ICEM Surf) due to rational weights.
**Fix**: Always check CV weights after fillet operations. Reset to 1 for non-rational surfaces. Use G2 blends instead of arc fillets. Verify degree and weights in ICEM Surf after import.

### Version Compatibility

**Issue**: Behavior changes between ICEM Surf versions (2021.2 vs 2025.2) affect workflows.
**Fix**: Test new versions thoroughly before production use. Keep previous versions installed. Report regressions on 3DS Community. Participate in beta testing if available.

## Best Practices

1. **Use EDF for Alias export but expect name shortening** — manually rename lists after import
2. **Enable Tangent extrapolation for Modify Patch Trim in 2025.2** — don't use Extrapolate with it
3. **Reset all CV weights to 1 after fillet operations** — prevents rational surface issues
4. **Use G2 blend instead of circular arc fillet** — creates non-rational surfaces
5. **Use degree 6 single span for arc approximation** — non-rational and accurate
6. **Import ICEM Surf CatParts in Alias 2016, not 2017** — avoids COS translator issue
7. **Untrim surfaces before export to avoid COS** — retrim in target software
8. **Update to ICEM Surf 2025.2 for Trim Face RM IO fixes** — download from 3DS
9. **Check surface degree in ICEM Surf** — it shows actual degree including rational expansion
10. **Report regressions on 3DS Community** — developers monitor and respond
