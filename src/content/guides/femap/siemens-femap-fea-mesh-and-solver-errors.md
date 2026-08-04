---
title: "Siemens Femap FEA Mesh and Solver Errors"
excerpt: "Siemens Femap FEA Mesh and Solver Errors: symptoms, root causes, and step-by-step fixes, verified against Siemens Community."
category: "troubleshooting"
softwareSlug: "femap"
keyword: "Siemens Femap mesh repair rogue nodes poor element quality meshing toolbox geometry slicing USER FATAL MESSAGE 316 BLSEG connection region GUI mismatch recreation FATAL MESSAGE 9137 plate element bonding excessive pivot ratios unconstrained model SOL 103 run time elemental errors tria 4 nodes non-connected nodes pre-analysis detection mesh distortion uneven element transitions mapped mesh biasing"
slug: "siemens-femap-fea-mesh-and-solver-errors"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://community.sw.siemens.com/s/question/0D5Vb00000ZrYy1KAF/request-help-on-mesh-repair"
  - "https://community.sw.siemens.com/s/question/0D5Vb00000cytweKAA/-user-fatal-message-316-ifpdrv-illegal-data-on-bulk-data-entry-blseg"
  - "https://community.sw.siemens.com/s/question/0D5Vb00000cryYgKAI/plate-element-bonding-error-fatal-message-9137-and-pivot-ratio-issue"
---

# Siemens Femap FEA Mesh and Solver Errors: Mesh Repair from Rogue Nodes and Poor Element Quality Requiring Meshing Toolbox and Geometry Slicing, USER FATAL MESSAGE 316 BLSEG from Connection Region GUI Mismatch Requiring Recreation, FATAL MESSAGE 9137 Plate Element Bonding and Excessive Pivot Ratios from Unconstrained Model Requiring SOL 103 Diagnosis, Run Time Elemental Errors from Tria with 4 Nodes and Non-Connected Nodes Requiring Pre-Analysis Detection, and Mesh Distortion from Uneven Element Transitions Requiring Mapped Mesh or Biasing

Siemens Femap's mesh generation, connection regions, plate element bonding, element quality, and mesh transitions produce errors from rogue nodes, GUI-input file mismatches, unconstrained models, element corruption, and uneven refinement. This guide covers the 5 most common Femap problems with diagnostic steps and community-verified fixes from Siemens Community.

## 1. Mesh Repair from Rogue Nodes and Poor Element Quality

### Symptom

Meshing a plate reinforced with a triangular rib pattern. The mesher places a rogue node in the middle of a rib segment, creating a cluster of poor-quality elements. The rogue node is embedded in the mesh and can't be easily removed. Element quality in this region is unacceptable.

### Root Cause

The automatic mesher placed a node in the middle of the rib segment due to meshing algorithm decisions about element sizing and geometry decomposition. This rogue node creates poorly shaped elements around it. The triangular rib pattern is challenging for the mesher because the geometry transitions are complex and the mesher's default sizing doesn't handle the rib geometry well.

### Fix

1. **Use the Meshing Toolbox**:
   - "If there is short edge, you can give a try combining curve in meshing toolbox"
   - Use Mesh > Meshing Toolbox
   - Use the Combine Curves tool to merge short edges
   - Use the Move Node tool to relocate the rogue node
   - Use the Delete Element tool to remove bad elements

2. **Slice the geometry into smaller parts**:
   - "A 'trick' is to slice the plate in many, many parts"
   - "This helps the mesher to create a quality mesh"
   - Use Geometry > Surface > Break to split surfaces
   - Create smaller, simpler meshing regions

3. **Use CBEAM elements for triangular ribs**:
   - "I suggest to mesh the triangular pattern with 1-D CBEAM elements, is very easy"
   - Instead of solid meshing the ribs
   - Use beam elements to represent the ribs
   - This avoids the meshing challenge entirely

4. **Use CHEXA extruded elements**:
   - "You can mesh perfectly triangular pattern with 3-D SOLID CHEXA elements"
   - "Extruding a 2-D QUAD4 (PLOT PLANAR) mesh to create the solid elements"
   - "With two elements in the thickness"
   - Create a 2D mesh first, then extrude to 3D

5. **Reduce element size for parabolic elements**:
   - "If you insist to mesh with 3-D Solid CTETRA 10-nodes high order parabolic elements"
   - "You need to reduce the element size to have 'at least' two elements in the wall thickness"
   - "To account for stress gradient"
   - Smaller elements improve quality but increase solve time

6. **Replicate mesh with COPY or REFLECT**:
   - "You can mesh locally a portion and replicate using command MESH > COPY or MESH > REFLECT"
   - Mesh one rib segment perfectly
   - Copy/reflect to other segments
   - This ensures consistent quality across all ribs

### Community Report

> "Repairing flaws in a mesh has always been my biggest challenge. The mesher decided to place a node in the middle of that rib segment that led to this little basket of deplorables. If there is short edge, you can give a try combining curve in meshing toolbox. A 'trick' is to slice the plate in many parts, this helps the mesher create a quality mesh. You can mesh perfectly with CHEXA elements extruding a 2-D QUAD4 mesh."

## 2. USER FATAL MESSAGE 316 BLSEG from Connection Region GUI Mismatch

### Symptom

Using Femap 2412. Error: "USER FATAL MESSAGE 316 (IFPDRV) ILLEGAL DATA ON BULK DATA ENTRY BLSEG." Connection Regions were set up correctly in the GUI. But the Preview Analysis Input File shows different settings than what was configured in the GUI.

### Root Cause

"The reason of the error is explained in the Nastran output file *.f06. The BLSEG command is used to define a GLUE or CONTACT EDGE region, and the options to select in FEMAP are dependent of the analysis type." The GUI settings weren't properly written to the input file. This is a GUI-to-input-file synchronization issue where the Connection Region settings in the GUI don't match what's written to the Nastran input file.

### Fix

1. **Check the Nastran output file (.f06)**:
   - "The reason of the error is explained in the nastran output file *.f06"
   - Open the .f06 file
   - Find the BLSEG error details
   - Identify which BLSEG entry has illegal data

2. **Compare GUI settings with input file**:
   - "The settings shown in the Preview Analysis Input File were different from what I had configured"
   - Use Model > Analysis > Preview Analysis Input File
   - Compare the BLSEG entries with GUI settings
   - Identify discrepancies

3. **Delete and recreate Connection Regions**:
   - "I was able to resolve the issue by identifying the incorrect Connection Region entries in the preview file"
   - "Deleting them, and then recreating those Connection Regions from scratch"
   - "After that, the analysis ran without errors"
   - Delete the problematic Connection Regions
   - Recreate them from scratch

4. **Verify analysis type compatibility**:
   - "The options to select in FEMAP are dependent of the analysis type"
   - Ensure the Connection Region type is compatible with the analysis type
   - GLUE and CONTACT EDGE options vary by analysis sequence
   - Check the Femap documentation for compatible options

5. **Post the model for developer investigation**:
   - "Please post here your FEMAP model to investigate the problem in depth by FEMAP developers"
   - If the issue persists after recreation
   - Share the model on the Siemens Community
   - Femap developers monitor the forum

### Community Report

> "While using Femap 2412, I encountered USER FATAL MESSAGE 316 (IFPDRV) ILLEGAL DATA ON BULK DATA ENTRY BLSEG. The Connection Regions were set up correctly in the GUI, but the settings shown in the Preview Analysis Input File were different from what I had configured. I resolved the issue by identifying the incorrect Connection Region entries, deleting them, and recreating those Connection Regions from scratch."

## 3. FATAL MESSAGE 9137 Plate Element Bonding and Excessive Pivot Ratios

### Symptom

Two plate (shell) elements bonded together in Femap. Running analysis produces: "FATAL MESSAGE 9137 (GUSER7): Plate element connectivity or geometry problem" and "RUN TERMINATED DUE TO EXCESSIVE PIVOT RATIOS IN MATRIX KLL." Adding a constraint to the problem node makes the simulation run, but doesn't represent real boundary conditions.

### Root Cause

"Your model either is not correctly constrained or you have a rigid body motion meaning that a part of the model is free to move in the space (node merging was not performed, or a GLUE connector was not correctly defined)." The plate elements are not properly connected — either node merging wasn't done or the GLUE connector is incorrectly defined. This creates a mechanism (unconstrained degree of freedom) that makes the stiffness matrix singular.

### Fix

1. **Run SOL 103 normal modes analysis**:
   - "The simply method is to run a normal modes/eigenvalue analysis (SOL103)"
   - "The animation of first natural frequency (with a value of 0 Hz) will tell you where is the problem"
   - A 0 Hz mode indicates a rigid body motion
   - Animate the mode to see which part is free to move

2. **Use PARAM,BAILOUT,-1**:
   - "By using SOL 103 together with PARAM,BAILOUT,-1"
   - "I'm able to clearly pinpoint where constraint issues exist"
   - This parameter forces Nastran to continue despite errors
   - Allowing you to identify all problem areas

3. **Merge coincident nodes**:
   - "Have you merged coincident nodes between plates?"
   - "I suggest to use always the classical method of node merging"
   - Use Mesh > Geometry > Merge Coincident Nodes
   - This ensures plates are properly connected

4. **Use node merging instead of GLUE for critical stresses**:
   - "GLUE should be used in areas where stresses are not critical"
   - "If I have to compute stresses for fatigue analysis in seam welds"
   - "The use of GLUE is forgiven, not at all"
   - "Classical node merging is the correct procedure"

5. **Relax PARAM MAXRATIO**:
   - "You can try relaxing param maxratio default value"
   - This allows the solver to proceed with higher pivot ratios
   - Use with caution — results may be less accurate
   - Fix the root cause instead if possible

6. **Check CROD element DOF**:
   - "Remember CROD elements do not have rotational DOF, all is articulated"
   - "So the stiffness matrix is singular, the user forgot to create diagonal bars"
   - If using CROD elements, add diagonal bars for stability
   - Or use CBEAM elements which have rotational DOF

### Community Report

> "FATAL MESSAGE 9137: Plate element connectivity or geometry problem. RUN TERMINATED DUE TO EXCESSIVE PIVOT RATIOS IN MATRIX KLL. Your model is not correctly constrained or you have a rigid body motion. Run a normal modes/eigenvalue analysis (SOL103): the animation of first natural frequency (with a value of 0 Hz) will tell you where the problem is. Have you merged coincident nodes between plates? I suggest to use always the classical method of node merging."

## 4. Run Time Elemental Errors from Tria with 4 Nodes and Non-Connected Nodes

### Symptom

When meshing from plates, several errors occur: tria elements with 4 nodes instead of 3, tria/quad becoming line elements, non-connected nodes, and rigid elements with the same node. These cause run time errors with various codes during analysis.

### Root Cause

"This happens when we merge some nodes or we change some plate after meshing." Mesh editing operations (node merging, element modification) can corrupt elements. Merging nodes can create tria elements with duplicate nodes (appearing as 4 nodes). Modifying plates after meshing can disconnect elements. These errors are only detected when running the analysis.

### Fix

1. **Use Femap's built-in element quality check**:
   - "The inbuilt error detecting program of Femap does it within few minutes"
   - "But only when we run the Program"
   - Use Model > Check > Element Quality
   - This identifies problematic elements before analysis

2. **Set solver GEOM CHECK to NONE**:
   - "From solver side, there is option of geom check as none to skip element quality"
   - This skips element quality checking during analysis
   - Use only if you're confident the elements are acceptable
   - Not recommended for production analysis

3. **Use the API for pre-analysis error detection**:
   - "Is there any way to call this inbuilt program of Femap that detects run time error without running the analysis?"
   - Write an API script to check elements before analysis
   - Access Femap's element quality checking via API
   - This saves time by catching errors early

4. **Fix tria with 4 nodes**:
   - This occurs from node merging creating duplicate nodes
   - Delete the corrupted element
   - Recreate it as a proper tria or quad
   - Verify with element quality check

5. **Fix non-connected nodes**:
   - Use Mesh > Geometry > Merge Coincident Nodes
   - Set appropriate tolerance for merging
   - Verify all nodes are connected
   - Use Model > Check > Free Edges to find disconnects

6. **Fix rigid elements with same node**:
   - Check rigid element definitions
   - Ensure independent and dependent nodes are different
   - Delete and recreate rigid elements with correct nodes
   - Verify with Model > Check > Element Quality

7. **Avoid editing mesh after creation**:
   - "This happens when we merge some nodes or we change some plate after meshing"
   - Minimize post-meshing edits
   - If edits are necessary, re-check element quality
   - Consider remeshing the affected region

### Community Report

> "When we make a mesh model from plate, we find few errors: tria with 4 node instead of 3, tria/quad become line element, none connected nodes, rigid element with same node. Due to which we face run time error with various codes. This happens when we merge some nodes or we change some plate after meshing. I have written an API with excel to detect and eliminate these errors without running the analysis."

## 5. Mesh Distortion from Uneven Element Transitions

### Symptom

Meshing a cylinder section with 6 curves. Different refinement for each curve — greatest number of nodes on curve 3. When increasing nodes on curve 3, element distortions occur. Nodes in the central part are dragged and crushed against curve 3, leaving the center almost empty.

### Root Cause

The mesh transition from coarse (central area) to fine (curve 3) is too abrupt. The mesher tries to transition from few elements to many elements in a short distance, causing element distortion. Without proper transition control, the mesher drags nodes toward the dense region, leaving the center sparse and creating distorted elements at the transition.

### Fix

1. **Use mapped mesh for transitions**:
   - "Create a nice mapped mesh at the density you want in the coarse area"
   - "First, create a nice mapped mesh at the density you want"
   - Use Mesh > Geometry > Mapped Mesh
   - This creates structured mesh with controlled transitions

2. **Use mesh biasing for transitions**:
   - "Set Mesh Sizing on the curves to what you want transition wise"
   - "Leverage mesh biasing to help the transition from coarse to fine"
   - Use Mesh > Mesh Sizing > Biased
   - This creates gradual transitions

3. **Start with even number of divisions**:
   - "To improve mesh quality of transition elements the 'trick' is to start with EVEN number of element divisions"
   - Even divisions create better transition patterns
   - Odd divisions create problematic transition elements
   - Use 2, 4, 6, 8... divisions instead of 3, 5, 7...

4. **Use Body/On Mesh Mesher (STAR-CCM+ technology)**:
   - "Use the Body/On Mesh Mesher (STAR-CCM+ technology)"
   - "You can achieve some really nice transitions"
   - This mesher handles transitions better than the default
   - Available in newer Femap versions

5. **Create an internal rectangular region via API**:
   - "Using the API, I created an internal rectangular region"
   - "One of the longest sides coinciding with curve 3"
   - "This area is like a cage and behaves like a barrier"
   - "That prevents the nodes close to curve 3 from dragging those in the central area"

6. **Slice the geometry for better meshing**:
   - "The 'trick' is to slice the plate in many, many parts"
   - Break the cylinder section into smaller patches
   - Mesh each patch separately
   - This gives better control over transitions

### Community Report

> "When I increase the number of nodes on curve 3, distortions begin to occur. The nodes of the central part were dragged and crushed against curve 3 leaving it almost empty. Create a nice mapped mesh at the density you want. Set Mesh Sizing on the curves and leverage mesh biasing. The 'trick' is to start with EVEN number of element divisions. Using the API, I created an internal rectangular region that behaves like a barrier preventing nodes from dragging."

## 6. Additional Femap Issues

### OFFSET in Beam and Shell Elements

**Issue**: Using offset in CBEAM, CTRIA3, CQUAD4 elements produces incorrect results in some analysis types.
**Fix**: "Always try to avoid offset definition. For linear buckling analysis (SOL105), offsets should not be used. Offsets are not allowed with nonlinear material. Use GLUE contact instead — GLUE is supported in all solution sequences."

### GLUE vs Node Merging for Stress Analysis

**Issue**: When to use GLUE vs node merging for connecting elements.
**Fix**: "GLUE should be used in areas where stresses are not critical. If I have to compute stresses for fatigue analysis in seam welds, classical node merging is the correct procedure. GLUE edge-to-face is valid but node merging is preferred for critical stress areas."

### Mass Properties with Offset Elements

**Issue**: "NX Nastran doesn't modify the mass properties of an offset element to reflect the existence of the offset."
**Fix**: "If you need the weight or mass properties of an offset element, use the RBAR method to create the offset instead of ZOFFS or MID4 method."

### Mesh Quality Verification

**Issue**: Need to verify mesh quality before analysis.
**Fix**: Use Model > Check > Element Quality. Check element aspect ratio, warpage, skew, Jacobian. Use Mesh > Meshing Toolbox for interactive quality improvement. Run SOL 103 to verify model stability.

## Best Practices

1. **Use Meshing Toolbox for rogue node removal** — combine curves, move nodes, delete bad elements
2. **Slice geometry into smaller parts for better meshing** — helps the mesher create quality elements
3. **Use CBEAM elements for rib patterns** — avoids complex solid meshing
4. **Extrude 2D QUAD4 mesh to CHEXA for solid elements** — ensures quality
5. **Delete and recreate Connection Regions if BLSEG error occurs** — GUI-input file mismatch
6. **Run SOL 103 to diagnose constraint issues** — 0 Hz modes indicate rigid body motion
7. **Use PARAM,BAILOUT,-1 with SOL 103 to pinpoint all constraint issues** — comprehensive diagnosis
8. **Merge coincident nodes instead of GLUE for critical stress areas** — more accurate results
9. **Start mesh transitions with EVEN number of divisions** — improves transition quality
10. **Use mapped mesh and biasing for smooth transitions** — prevents node dragging
