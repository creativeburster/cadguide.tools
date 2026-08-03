---
title: "IDEA StatiCa Connection Analysis 0 Percent or Not Reaching 100 Percent from Singularities, Stop at Limit Strain Halting Analysis at 25 Percent Load, GMNA Hollow Section Instability Break, Bolt Operations Incorrect Plate Selection and Slotted Hole Singularity, and Missing Welds at Gusset Plates Causing Singularity: Singularity Detection, Stop at Limit Strain Disable, GMNA Toggle, Bolt Model Verification, and Weld Addition"
excerpt: "IDEA StatiCa fails for 5 distinct reasons: Connection analysis 0 percent or not reaching 100 percent from singularities requiring missing weld or bolt detection, Stop at Limit Strain halting analysis at 25 percent load requiring code setup disable, GMNA hollow section instability break requiring GMNA toggle, bolt operations incorrect plate selection and slotted hole singularity requiring bolt model verification, and missing welds at gusset plates causing singularity requiring weld addition. We cover each with fixes from IDEA StatiCa Support Center."
category: "connection-analysis-and-convergence-errors"
softwareSlug: "idea-statica"
keyword: "IDEA StatiCa connection analysis 0 percent not reaching 100 percent singularity Stop at Limit Strain GMNA hollow section instability bolt operations incorrect plate selection slotted hole missing welds gusset plates"
slug: "idea-statica-connection-analysis-0-percent-singularity-stop-at-limit-strain-gmna-hollow-section-bolt-operations-slotted-hole-missing-welds-gusset-plates"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://www.ideastatica.com/support-center/analysis-convergence"
  - "https://www.ideastatica.com/support-center/connection-analysis-0-or-doesn-t-reach-100"
  - "https://www.ideastatica.com/support-center/blog/troubleshooting-idea-statica-connection-models"
---

# IDEA StatiCa Connection Analysis 0 Percent or Not Reaching 100 Percent from Singularities, Stop at Limit Strain Halting Analysis at 25 Percent Load, GMNA Hollow Section Instability Break, Bolt Operations Incorrect Plate Selection and Slotted Hole Singularity, and Missing Welds at Gusset Plates Causing Singularity: Singularity Detection, Stop at Limit Strain Disable, GMNA Toggle, Bolt Model Verification, and Weld Addition

IDEA StatiCa produces errors from singularities, Stop at Limit Strain, GMNA instability, bolt operation issues, and missing welds. This guide covers the 5 most common IDEA StatiCa problems with diagnostic steps and community-verified fixes from IDEA StatiCa Support Center.

## 1. Connection Analysis 0 Percent or Not Reaching 100 Percent from Singularities

### Symptom

The connection analysis shows 0% or stops at a percentage below 100%. The analysis doesn't complete successfully. A singularity warning may appear. The deformed shape shows items moved 1 m, indicating which parts are not properly connected. The issue occurs when parts of the model are not connected properly and can freely move or rotate.

### Root Cause

"The finite element analysis might not converge for several reasons, usually due to some element that is not sufficiently supported and can freely move or rotate. The most common causes of analysis failure are singularities when the parts of a model are not connected properly and are free to move or rotate. A user is notified and should check the model for missing welds or bolts. The deformed shape is shown with the items which caused the first singularity moved 1 m so that singularity may be easily detected." Singularities occur when model parts aren't properly connected. The FEA solver can't find equilibrium because parts can move or rotate freely, causing the analysis to fail.

### Fix

1. **Check the deformed shape for singularities**:
   - "The deformed shape is shown with the items which caused the first singularity"
   - "Moved 1 m so that singularity may be easily detected"
   - View the deformed shape
   - To identify the singularity source

2. **Check for missing welds or bolts**:
   - "A user is notified and should check the model"
   - "For missing welds or bolts"
   - Review all connections
   - For missing welds or bolts

3. **Increase analysis iterations**:
   - "When the joint model is very complex"
   - "Raise the values of the Number of analysis iterations"
   - "From default value 25 to higher (e.g., 50)"
   - "And the Divergent iterations count from default value 3 to higher (e.g., 5)"
   - Increase iterations in Code setup

4. **Check material properties**:
   - "If a material property is filled with 0 (zero)"
   - "Or some non-acceptable value"
   - "The finite element model can not be calculated"
   - Verify all material properties are valid

5. **Review operation order**:
   - "Only operations above the current operation"
   - "Can be used in the current operation"
   - "The order of operations matters"
   - Verify operation order is correct

6. **Check for excessive deformations**:
   - "A warning system for excessive deformations"
   - "Improves the model stability assessment"
   - "The overall results display a warning"
   - "When large displacements over 1 m are detected"
   - Check for deformations over 1 m

7. **Use transparent mode to verify welds**:
   - "The butt weld is represented by a yellow line"
   - "Visible when the 3D screen is switched to transparent mode"
   - Use transparent mode
   - To verify weld creation

### Community Report

> "The finite element analysis might not converge for several reasons, usually due to some element that is not sufficiently supported and can freely move or rotate. The most common causes of analysis failure are singularities when the parts of a model are not connected properly and are free to move or rotate. A user is notified and should check the model for missing welds or bolts. The deformed shape is shown with the items which caused the first singularity moved 1 m so that singularity may be easily detected."

## 2. Stop at Limit Strain Halting Analysis at 25 Percent Load

### Symptom

The analysis stops before reaching 100% of the applied loads. The analysis may stop at 25% or another partial percentage. The welds or plates show utilization ratios near 99%. The analysis halts because a component has reached its capacity. The user can't see the full behavior of the connection under complete loading.

### Root Cause

"In the Code setup, there is an option to activate the Stop at limit strain feature. If this is turned on, the analysis halts when the capacity of any part of the connection (e.g., a plate, a weld, etc.) is reached. In case the connection is overloaded, the analysis stops before the inputted load effects are fully applied and the actual percentage of used loads is displayed." The Stop at Limit Strain feature is designed to prevent analysis beyond material capacity. When a component reaches its limit strain, the analysis stops to indicate that the connection is overloaded at that load level.

### Fix

1. **Disable Stop at Limit Strain**:
   - "If I uncheck the stop-at-limit strain"
   - "The software will run 100% of the loads"
   - "So that you can see the whole picture"
   - Uncheck Stop at Limit Strain in Code setup

2. **Review the utilization ratios**:
   - "The welds utilization ratio was 99%"
   - "So the analysis stopped"
   - "And only 25% of the loads were applied"
   - Review which component triggered the stop

3. **Increase component capacity**:
   - If the connection is overloaded
   - Increase the capacity of the controlling component
   - (e.g., larger welds, thicker plates)
   - To allow the analysis to reach 100%

4. **Check if the connection is truly overloaded**:
   - "If the connection is overloaded"
   - "The analysis stops before the inputted load effects"
   - "Are fully applied"
   - Determine if the design needs modification

5. **Use the analysis percentage as diagnostic**:
   - "The actual percentage of used loads is displayed"
   - Use the percentage
   - To assess how much
   - The connection can carry

6. **Re-run after design changes**:
   - After modifying the connection design
   - Re-run the analysis
   - With Stop at Limit Strain
   - To verify the improvement

7. **Document the limiting component**:
   - Document which component
   - Triggered the stop
   - For design optimization
   - And future reference

### Community Report

> "In the Code setup, there is an option to activate the Stop at limit strain feature. If this is turned on, the analysis halts when the capacity of any part of the connection (e.g., a plate, a weld, etc.) is reached. In case the connection is overloaded, the analysis stops before the inputted load effects are fully applied. When the analysis doesn't finish until 100%, the stop-at-limit strain is one item to check. If I uncheck the stop-at-limit strain, the software will run 100% of the loads so that you can see the whole picture."

## 3. GMNA Hollow Section Instability Break

### Symptom

When using HSS (Hollow Structural Section) members as bearing members, the analysis breaks at a certain percentage of applied loads. The analysis doesn't reach 100%. The issue occurs specifically with hollow section bearing members. The break happens because the hollow section loses stability under the applied loads.

### Root Cause

"When using HSS members as bearing members, we use GMNA, which stands for advanced geometrically nonlinear analysis. This provides more precise results for models mainly with hollow section members. When the connection is overloaded, the hollow sections might lose stability, which results in a break of the analysis at the current percentage of applied loads. By disabling the GMNA in the Code setup, the analysis finishes with 100%, revealing the failure of the hollow section and other parts of the connections." GMNA (Geometrically and Materially Nonlinear Analysis) is automatically used for hollow section bearing members. When the hollow section loses stability, the GMNA solver can't converge, causing the analysis to break.

### Fix

1. **Disable GMNA in Code setup**:
   - "By disabling the GMNA in the Code setup"
   - "The analysis finishes with 100%"
   - "Revealing the failure of the hollow section"
   - "And other parts of the connections"
   - Turn off GMNA to complete the analysis

2. **Confirm Stop at Limit Strain is not active**:
   - "Look at the Code setup"
   - "And confirm that Stop at limit strain is not active"
   - Disable both GMNA and Stop at Limit Strain
   - For full analysis

3. **Check deformed shape for large deformations**:
   - "Look at the deformed shape"
   - "Spot large and unrealistic deformations"
   - "Review the operations related to the large deformations"
   - "And fix the modeling issue"
   - Review deformations after disabling GMNA

4. **Fix design issues**:
   - "Spot the design issue, fix it"
   - "And re-run it"
   - After identifying the failure
   - Fix the design and re-run

5. **Re-enable GMNA after fixing design**:
   - "If the design is good"
   - "Return to the Code setup"
   - "Activate the GMNA again"
   - "And ensure the design is OK"
   - Re-enable GMNA after fixing

6. **Use GMNA workflow steps**:
   - "Here are the steps to get the analysis to work when running GMNA:"
   - 1. Confirm Stop at limit strain is not active
   - 2. Check deformed shape for large deformations
   - 3. Fix modeling issues
   - 4. Turn off GMNA and re-run
   - 5. Fix design, re-enable GMNA

7. **Verify hollow section capacity**:
   - After the analysis completes
   - Verify the hollow section
   - Has adequate capacity
   - For the applied loads

### Community Report

> "When using HSS members as bearing members, we use GMNA, which stands for advanced geometrically nonlinear analysis. When the connection is overloaded, the hollow sections might lose stability, which results in a break of the analysis at the current percentage of applied loads. By disabling the GMNA in the Code setup, the analysis finishes with 100%, revealing the failure of the hollow section and other parts of the connections. Turn off GMNA under code setup and re-run the analysis. Spot the design issue, fix it, and re-run it. If the design is good, return to the Code setup, activate the GMNA again."

## 4. Bolt Operations Incorrect Plate Selection and Slotted Hole Singularity

### Symptom

Bolt operations fail or create singularities in the connection model. Common issues include incorrect plate selection in a grid operation, openings in the same position as the bolt, and slotted holes creating singularities. The analysis fails or shows 0% completion. The issue is related to how bolts are configured in the model.

### Root Cause

"There are some common errors related to bolts: Incorrect plate selection in a grid operation. The maximum allowable gap between plates connected by bolts is 1/16". Slotted hole in the direction of the load: when using slotted holes, the direction of the slot is released. That can create a singularity as there is no restraint in that direction. Opening in the same position as the bolt." Bolt operations require correct plate selection and proper hole configuration. Slotted holes release the restraint in the slot direction, which can create a singularity if no other restraint exists in that direction.

### Fix

1. **Verify plate selection in bolt operations**:
   - "Incorrect plate selection in a grid operation"
   - Verify the correct plates
   - Are selected in each bolt operation
   - Especially in grid operations

2. **Check bolt gap**:
   - "The maximum allowable gap between plates"
   - "Connected by bolts is 1/16""
   - Verify the gap between plates
   - Doesn't exceed 1/16"

3. **Check slotted hole orientation**:
   - "Slotted hole in the direction of the load"
   - "The direction of the slot is released"
   - "That can create a singularity"
   - "As there is no restraint in that direction"
   - Verify slotted holes don't align with load direction

4. **Check for overlapping openings**:
   - "Opening in the same position as the bolt"
   - Verify no openings
   - Are placed at the same position
   - As bolts

5. **Add restraint for slotted holes**:
   - If slotted holes create singularities
   - Add additional restraint
   - In the released direction
   - (e.g., add a utility weld)

6. **Review bolt detailing checks**:
   - "IDEA StatiCa checks bolt spacing and weld sizes required by AISC"
   - "Go to the Check tab > Bolt/weld tab results"
   - "Review the detailing column"
   - "And find the item failing"
   - Check bolt detailing warnings

7. **Reset Code setup properties**:
   - "Some options can influence the analysis"
   - "Within the code setup in the design tab"
   - "So I always try to reset code setup properties"
   - Reset Code setup if issues persist

### Community Report

> "There are some common errors related to bolts: Incorrect plate selection in a grid operation. The maximum allowable gap between plates connected by bolts is 1/16". Slotted hole in the direction of the load: when using slotted holes, the direction of the slot is released. That can create a singularity as there is no restraint in that direction. Opening in the same position as the bolt. IDEA StatiCa checks bolt spacing and weld sizes required by AISC. Go to the Check tab > Bolt/weld tab results > Review the detailing column and find the item failing."

## 5. Missing Welds at Gusset Plates Causing Singularity

### Symptom

The connection analysis fails with a singularity warning. The deformed shape shows a gusset plate moving 1 m, indicating it's not properly connected. The gusset plate appears unstressed in the stress results. A gap opens between the plate and the column in the deflected shape. The issue is caused by a missing weld between the gusset plate and the connecting member.

### Root Cause

"Missing welds at gusset plates leading to singularity." The most common cause of singularities in IDEA StatiCa is missing welds. When a gusset plate is added to the model without the corresponding weld operation, the plate is not connected to the adjacent member. The plate can move freely, creating a singularity that prevents the analysis from converging.

### Fix

1. **View the deformed shape**:
   - "Visual results such as the deformed shape"
   - "Plastic strains, or contact pressure"
   - "Are often the most helpful for identifying modeling errors"
   - View the deformed shape first

2. **Check stress results**:
   - "The provided model incorrectly omitted the weld"
   - "Between the web connection plate and the column flange"
   - "This is most clearly seen in the stress results"
   - "Where the plate is shown to be unstressed"
   - Check for unstressed plates

3. **Check deflected shape for gaps**:
   - "In the deflected shape"
   - "Where a gap opens between the plate and the column"
   - Look for gaps
   - Between plates and members

4. **Add the missing weld**:
   - "Adding the weld corrects the error"
   - Add the missing weld operation
   - Between the gusset plate
   - And the connecting member

5. **Verify weld in transparent mode**:
   - "The butt weld is represented by a yellow line"
   - "Visible when the 3D screen is switched to transparent mode"
   - Switch to transparent mode
   - To verify the weld is created

6. **Check operation order**:
   - "Only operations above the current operation"
   - "Can be used in the current operation"
   - "When you look at the list of operations in a model"
   - "You can't add a weld to a plate that is lower in the list"
   - Ensure the plate operation is above the weld

7. **Re-run analysis after adding weld**:
   - After adding the missing weld
   - Re-run the analysis
   - To verify the singularity
   - Is resolved

### Community Report

> "Missing welds at gusset plates leading to singularity. The provided model incorrectly omitted the weld between the web connection plate and the column flange. This is most clearly seen in the stress results (where the plate is shown to be unstressed) and in the deflected shape (where a gap opens between the plate and the column). The missing weld could also have been identified by viewing the model. Adding the weld corrects the error."

## 6. Additional IDEA StatiCa Issues

### CBFEM Friction Calculation Limitation

**Issue**: "The CBFEM model in IDEA StatiCa can not directly calculate and code-check friction between plates when modeling a connection based on friction and preloaded bolts."
**Fix**: Add a "utility" weld to deal with small shear forces. Use a Partial weld with Offset. The impact of the utility weld on model behavior is negligible.

### Mitre Cut Butt Weld Alignment

**Issue**: "When the operation Cut and its cutting method Mitre cut is used to cut and weld members with circular hollow sections, sometimes the analysis is not done, resulting in analysis 0%."
**Fix**: "Change the value of α - Rotation for one of the connected members so that the elements are aligned and the butt weld is created." Adjust the rotation to align 1D elements.

### Mesh Convergence Sensitivity

**Issue**: "The sensitivity analysis considering mesh discretization should be performed for complicated geometries."
**Fix**: Perform mesh sensitivity analysis for complex geometries. Refine the mesh and compare results. Ensure results are independent of element size.

### Detailing Checks for Bolts and Welds

**Issue**: "IDEA StatiCa checks bolt spacing and weld sizes required by AISC. If one or more detailing checks do not comply, the software will tell you that there is a detailing warning."
**Fix**: Go to Check tab > Bolt/weld tab results > Review the detailing column. Click the plus icon for the calculation report. See the detailed warning and fix the detailing issue.

### Excessive Deformation Warning

**Issue**: "A warning system for excessive deformations improves the model stability assessment. The overall results display a warning when large displacements over 1 m are detected."
**Fix**: Review deformation results when the warning appears. Identify the source of large deformations. Fix the modeling issue causing unrealistic displacements.

### Clamp Connection Praying Force

**Issue**: "In such a connection, where only tension/compression force is applied and transferred via contact, there is a small prying shear force generated. Since friction is not taken into account, the shear force is not transferred, the model is unstable."
**Fix**: Add a utility weld (Partial weld with Offset) to deal with the small shear force. The impact on model behavior is negligible.

### Code Setup Reset

**Issue**: "Some options can influence the analysis within the code setup in the design tab, so I always try to reset code setup properties."
**Fix**: Reset Code setup properties to defaults. Verify the configuration applies to all project items. Test with default settings first.

## Best Practices

1. **Check deformed shape for singularities** — items moved 1 m indicate the problem
2. **Disable Stop at Limit Strain to see full analysis** — allows 100% load application
3. **Disable GMNA for hollow section instability** — allows analysis to complete
4. **Verify bolt plate selection and hole orientation** — prevents bolt singularities
5. **Check for missing welds at gusset plates** — most common singularity cause
6. **Use transparent mode to verify welds** — yellow lines indicate butt welds
7. **Check operation order** — welds can only reference operations above them
8. **Increase analysis iterations for complex models** — 50 iterations, 5 divergent
9. **Verify all material properties are non-zero** — zero values cause analysis 0%
10. **Reset Code setup when troubleshooting** — eliminates configuration issues
