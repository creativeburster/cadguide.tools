---
title: "MSC Nastran Fatal 9137 Pivot Ratio and Solver Errors: Excessive Pivot Ratios in Matrix KLL from Rigid Body Motion Requiring SOL 103 Diagnosis, SOL 103 Response Dynamics Stuck at Frequency from Disk Space and MUMPS Solver, Fatal 4291 EQD4S Singular J-Matrix from Orthotropic Material Missing Shear Moduli, No Results Found in SOL 101 from BAILOUT and AUTOMPC Misuse, and Unable to Allocate Open Core from Memory Configuration on Linux"
excerpt: "MSC Nastran fails for 5 distinct reasons: fatal 9137 excessive pivot ratios from rigid body motion requiring SOL 103 normal modes to identify 0 Hz mechanisms, SOL 103 Response Dynamics stuck at certain frequency from insufficient disk space and MUMPS solver issues, fatal 4291 singular J-matrix from orthotropic MAT8 material with missing shear moduli G12 G1Z G2Z, no results in SOL 101 from using BAILOUT=-1 as a crutch instead of fixing constraints, and unable to allocate Open Core from memory configuration on Linux with 1.5TB RAM. We cover each with fixes from Siemens Community and Eng-Tips forums."
category: "troubleshooting"
softwareSlug: "msc-nastran"
keyword: "MSC Nastran fatal 9137 excessive pivot ratio matrix KLL rigid body motion SOL 103 normal modes 0 Hz mechanism Response Dynamics stuck frequency disk space MUMPS solver fatal 4291 EQD4S singular J-matrix MAT8 orthotropic shear modulus G12 G1Z G2Z BAILOUT AUTOMPC open core memory Linux"
slug: "msc-nastran-fatal-9137-pivot-ratio-sol103-response-dynamics-mumps-4291-eqd4s-mat8-orthotropic-shear-modulus-bailout-open-core-memory-linux"
author: "CADGuide Tools Editorial Team"
readTime: "14 min"
date: "2025-07-31"
sources:
  - "https://community.sw.siemens.com/s/question/0D5Vb000006dfRWKAY/excessive-pivot-ratio-fatal-error-9137"
  - "https://community.sw.siemens.com/s/question/0D5Vb00000aYjNnKAK/sol-103-response-dynamics-simulation-gets-stuck-at-certain-frequency"
  - "https://www.eng-tips.com/threads/nastran-limitation-configuration.506947/"
---

# MSC Nastran Fatal 9137 Pivot Ratio and Solver Errors: Excessive Pivot Ratios in Matrix KLL from Rigid Body Motion Requiring SOL 103 Diagnosis, SOL 103 Response Dynamics Stuck at Frequency from Disk Space and MUMPS Solver, Fatal 4291 EQD4S Singular J-Matrix from Orthotropic Material Missing Shear Moduli, No Results Found in SOL 101 from BAILOUT and AUTOMPC Misuse, and Unable to Allocate Open Core from Memory Configuration on Linux

MSC Nastran produces fatal errors from rigid body motion, solver configuration issues, material definition problems, and memory allocation failures. This guide covers the 5 most common MSC Nastran problems with diagnostic steps and community-verified fixes from Siemens Community and Eng-Tips forums.

## 1. Fatal 9137 Excessive Pivot Ratios from Rigid Body Motion

### Error Message

```
*** USER FATAL MESSAGE 9137 (SEKRRS)
*** RUN TERMINATED DUE TO EXCESSIVE PIVOT RATIOS IN MATRIX KLL
*** USER ACTION: CONSTRAIN MECHANISMS WITH SPCI OR SUPORTI ENTRIES OR SPECIFY PARAM,BAILOUT,-1 TO CONTINUE THE RUN WITH MECHANISMS.
```

### Symptom

Running a linear static analysis (SOL 101) produces fatal 9137 with excessive pivot ratios. A prior modal analysis (SOL 103) showed the first mode at 50+ Hz, suggesting no rigid body motion. But the static analysis still fails.

### Root Cause

The stiffness matrix is ill-conditioned — either from a rigid body motion (mechanism) or a bad combination of elements. Even if SOL 103 doesn't show an obvious 0 Hz mode, high diagonal ratios (1E15) in the .f06 file indicate near-singular stiffness. The model may have poorly connected elements, orphan nodes, or CBUSH elements with zero stiffness.

### Fix

1. **Run SOL 103 Normal Modes analysis**:
   - This is the most reliable diagnostic method
   - Look for modes with frequency near 0 Hz — these are rigid body modes
   - The mode shape animation shows exactly which part is unconstrained
   - "The most reliable method is to run a modal/eigenvalue analysis (SOL 103), this will solve the model and identify the rigid body motion immediately associated to a frequency value of near to 0 Hz"

2. **Check the .f06 file for DIAGONAL RATIO values**:
   - Look for nodes with DIAGONAL RATIO of 1E15 or higher
   - These nodes have near-zero stiffness — they're disconnected or poorly constrained
   - Focus constraint fixes on these specific nodes

3. **Increase MAXRATIO** — with caution:
   - If the highest diagonal ratio is around 1E10, increase MAXRATIO to 1E11
   - **Acceptable MAXRATIO thresholds**:
     - No glue, no contact, no parabolic shell: 1.0E+7
     - No glue, no contact, with parabolic shell: 1.0E+8
     - With glue and contact: 1.0E+10 (default changes automatically)
   - Don't exceed these thresholds unless you know there's a much softer portion due to material or thickness

4. **Check for orphan nodes and CBUSH elements**:
   - Remove orphan nodes (nodes not connected to any element)
   - Check CBUSH elements for zero stiffness
   - These create singular stiffness matrix entries

5. **Check mesh connectivity**:
   - "Your mesh doesn't seem connected near this cylinder"
   - Use node merging to connect coincident nodes
   - Verify that contact/glue regions are properly defined

6. **Do NOT use BAILOUT=-1 as a permanent fix**:
   - "PARAM,BAILOUT,-1 is very dangerous because you get the linear static solution, yes, but it is not an effective method to identify the error"
   - "I have found users setting BAILOUT by default in all of their linear static analysis — what an error!!"
   - BAILOUT is for debugging only, not for production runs

### Community Report

> "Don't worry, this is the most common error of Nastran users. The most reliable method is to run a modal/eigenvalue analysis (SOL 103). The animation of mode shape #1 will identify immediately the reason of the error."

> "I suggest to avoid the use of PARAM,BAILOUT,-1. It is very dangerous because you get the linear static solution but it doesn't help to identify the design error."

## 2. SOL 103 Response Dynamics Stuck at Certain Frequency

### Symptom

Running SOL 103 Response Dynamics on a large model (~300,000 elements) from 0 to 2000 Hz. The solver easily calculates the first 14 modes (up to 896 Hz) in 1.5 minutes, but gets stuck trying to find the 15th mode. Running 0-1000 Hz doesn't finish after 30 minutes. However, running 900-1000 Hz finds the 15th mode at 906 Hz in 40 seconds.

### Root Cause

Two potential causes:
1. **Insufficient disk space** — the solver fills available memory/disk while solving and can't proceed
2. **MUMPS solver issue** — in Simcenter 3D/Nastran V2406, MUMPS is the default solver for SOL 103 and Response Dynamics, and may have issues with certain frequency ranges

### Fix

1. **Check disk space**:
   - "There was not enough disk space, and the solver filled the available memory while solving"
   - Free up disk space on the scratch directory drive
   - Ensure at least 2-3x the model size in free disk space

2. **Slice the frequency range**:
   - As a workaround, split the frequency range into smaller chunks
   - Run 0-900 Hz, then 900-1000 Hz, then 1000-2000 Hz
   - Combine the results manually
   - This is time-consuming but works

3. **Try the MUMPS solver vs. Lanczos**:
   - In V2406, MUMPS is the default for SOL 103 Response Dynamics
   - Try switching to the Lanczos solver
   - Open a support case with Siemens if MUMPS continues to fail

4. **Use RDMODES**:
   - "RDMODES will reduce solving time"
   - RDMODES is a residual flexibility approach that can speed up Response Dynamics
   - Check the Nastran documentation for RDMODES usage

5. **Check .f06 for MUMPS loading**:
   - Look for: "Loading Local Library libMumps_nompi_ilp64.dll"
   - This confirms MUMPS is being used
   - If MUMPS fails, try a different solver

6. **Set Response Dynamics parameters**:
   - SOL 103 Response Dynamics writes special parameters automatically:
     - `PARAM OUGCORD GLOBAL`
     - `PARAM RSOPT 1`
     - `PARAM RSCON YES`
   - These are not written by classic SOL 103
   - If using classic SOL 103 for Response Simulation, set them manually in Bulk Data

### Community Report

> "I found the solution to this problem: there was not enough disk space, and the solver filled the available memory while solving."

> "In Simcenter 3D/Simcenter Nastran V2406, we introduced a new capability related to the MUMPS solver for real eigenvalue analysis. MUMPS solver is the default for SOL 103, SOL 111, SOL 105, and SOL 112 including SOL 130 - Response Dynamics."

## 3. Fatal 4291 EQD4S Singular J-Matrix from Orthotropic Material

### Error Message

```
*** USER FATAL MESSAGE 4291 (EQD4S)
FOR ELEMENT WITH ID = 1 THE MATERIAL ROUTINE -MAT- RETURNS A 2X2 J-MATRIX
FOR MATERIAL ID = 1 WHICH IS SINGULAR.
```

### Symptom

Running SOL 103 (normal modes) with composite shell elements using MAT8 orthotropic material. The error 4291 indicates a singular J-matrix for the material. The material properties appear to be isotropic values entered into an orthotropic material model.

### Root Cause

The MAT8 orthotropic material card requires three shear moduli (G12, G1Z, G2Z). The user entered only one shear modulus (G12) and left G1Z and G2Z as zero or undefined. This makes the 2x2 transverse shear stiffness matrix singular. The material properties may also be isotropic values incorrectly entered into an orthotropic material model.

### Fix

1. **Enter all three shear moduli**:
   - MAT8 requires G12, G1Z, and G2Z
   - "I tried to put all 3 shear modulus and run the analysis, apparently the solution work"
   - If test data is not available for G1Z and G2Z, use G12 as an approximation

2. **Use PARAM, SHELLTVSMATTYPE**:
   - `PARAM, SHELLTVSMATTYPE, FLEXIBLE` — G1Z and G2Z default to G12
   - `PARAM, SHELLTVSMATTYPE, RIGID` — G1Z and G2Z are penalty values approximating rigid transverse shear stiffness
   - Try FLEXIBLE first, then RIGID if FLEXIBLE doesn't work

3. **Verify material model matches properties**:
   - Don't enter isotropic properties into an orthotropic material model
   - If the material is isotropic, use MAT1, not MAT8
   - If the material is orthotropic, enter all required orthotropic properties

4. **Check for multiple materials**:
   - If there are multiple materials in the model, check each one
   - The error reports material ID = 1, but other materials may also have issues
   - Verify all MAT8 cards have complete property definitions

5. **Check composite layup**:
   - If using PCOMP, verify each ply has correct material and thickness
   - A single PSHELL layer with MAT8 should also work
   - Test with a simple single-layer model first

### Community Report

> "I tried to put all 3 shear modulus and run the analysis, apparently the solution work. However, I don't have the other value."

> "It sounds like you have a solution: enter three values for the shear moduli. Regarding the parameter statement for SHELLTVSMATTYPE, it is possible that the software is not recognizing it for some reason."

## 4. No Results Found in SOL 101 from BAILOUT and AUTOMPC Misuse

### Symptom

Running SOL 101 linear static analysis. Check tool reports no errors or warnings. Solver runs OK. But when trying to open results, "No results are found" in both Results Viewer and the standard view.

### Root Cause

The solver produced fatal 9137 (excessive pivot ratios) but the user didn't check the .f06 file. The "No results found" message means the solver terminated without writing results. The user then used BAILOUT=-1 and AUTOMPC=YES to force a solution, but doesn't understand when or why to use these parameters.

### Fix

1. **Check the .f06 file for fatal errors**:
   - "Check your .f06 file for Fatal error messages"
   - The .f06 file contains all solver messages
   - Look for "USER FATAL MESSAGE" entries
   - The .log file does not contain useful troubleshooting information

2. **Understand BAILOUT=-1**:
   - `PARAM,BAILOUT,-1` forces Nastran to continue despite mechanisms
   - **For debugging only** — never for production results
   - "Param Bailout should never be used to obtain a solution. It's only for debug purposes and should be used with caution."
   - Results obtained with BAILOUT are potentially invalid

3. **Understand AUTOMPC=YES**:
   - `PARAM,AUTOMPC,YES` automatically constrains singular DOFs
   - Can help with mechanisms from element formulations
   - But it masks the real problem — fix the model instead
   - Use temporarily to get past the error, then fix the root cause

4. **Run SOL 103 to diagnose**:
   - "Run a SOL 103 to see what's 'flying' — ie not attached properly"
   - 0 Hz modes show exactly which parts are unconstrained
   - Fix the constraints based on the mode shape

5. **Include FEM and SIM files when seeking help**:
   - "Your rar file only includes the SIM file. You would also need to supply the FEM file."
   - Without both files, others can't examine the model
   - Always include .fem, .sim, and .f06 files

### Community Report

> "I have changed some cards on case control then I can see the result: BAILOUT=-1, AUTOMPC=YES. However I don't clearly understand why and when I should use them and how they affect result accuracy."

> "Param Bailout should never be used to obtain a solution. It's only for debug purposes. We need to figure out the main issue with your model."

## 5. Unable to Allocate Open Core from Memory Configuration on Linux

### Error Message

```
Unable to allocate Open Core
Requested size = 811640815656 bytes
```

### Symptom

Running MSC Nastran SOL 103 on a Linux system with 1.5TB of RAM. The solver fails with "Unable to allocate Open Core" requesting ~811GB of memory. The input file uses many INIT and ASSIGN statements for database and scratch files.

### Root Cause

The default memory allocation is half the installed RAM (mem=max in the rc file). With 1.5TB installed, Nastran requests ~750GB. However, other processes are consuming memory, leaving insufficient free RAM. Alternatively, the many INIT and ASSIGN statements in the input file may cause excessive memory usage.

### Fix

1. **Check running processes**:
   - Use the `top` command on Linux to see which processes are resident
   - Check how much memory is currently allocated
   - Kill any zombie processes consuming memory
   - "Either there is a hardware problem with the memory, or one or more processes were consuming more than half the installed RAM"

2. **Specify memory explicitly**:
   - Use `mem=` on the command line instead of mem=max
   - Example: `nastran input.dat mem=400gb`
   - Allocate less than half the installed RAM to leave room for the OS

3. **Remove unnecessary INIT and ASSIGN statements**:
   - "You might be better off removing them and using the default allocations for scratch files"
   - The default scratch file allocation is usually sufficient
   - Custom INIT/ASSIGN statements can cause memory issues

4. **Reboot if needed**:
   - "If all else fails, reboot the computer to kill off any zombie'd processes"
   - Zombie processes can hold large amounts of memory
   - A reboot clears all process memory

5. **Check the rc file**:
   - Located at `/usr/local/meca/MSC/2021/nastran/conf/nast20213rc`
   - Check if `mem=max` is defined
   - Change to a specific value if needed

6. **Check scratch disk space**:
   - Ensure the scratch directory has sufficient space
   - Nastran writes large scratch files during solving
   - Use fast SSD storage for scratch files

### Community Report

> "Your command line did not request an amount of memory, so I will assume that mem=max is defined in the rc file, which means the default allocation will be half the installed memory. Use the 'top' command to see which processes are resident."

> "You might be better off removing the INIT and ASSIGN statements and using the default allocations for scratch files."

## 6. Additional MSC Nastran Issues

### SOL 101 Outputs Only First 5 Subcases

**Issue**: SOL 101 only outputs results for the first 5 subcases, ignoring the rest.
**Fix**: Check the Case Control section for SUBCOM or SUBSEQ cards that may limit output. Verify that all subcases have proper output requests (DISPLACEMENT, STRESS, etc.).

### CROD Elements Without Rotational DOF

**Issue**: Truss models with CROD elements create mechanisms because CROD elements have no rotational stiffness.
**Fix**: "CROD elements do not have rotational DOF — all is articulated." Use CBAR or CBEAM elements instead, or add diagonal members to create rigid triangles.

### Contact Non-Convergence in SOL 101

**Issue**: Linear static analysis with contact doesn't converge.
**Fix**: Increase contact iterations from 20 (default) to 45. Check .f06 for "CONTACT FORCE CONVERGENCE RATIO" vs CTOL. Only include tangent-continuous surfaces in contact regions.

## Best Practices

1. **Run SOL 103 before SOL 101** — identifies rigid body modes at 0 Hz
2. **Check .f06 file for fatal messages** — don't rely on "solver run OK" message
3. **Never use BAILOUT=-1 for production** — debugging only, results are invalid
4. **Enter all required material properties** — MAT8 needs G12, G1Z, G2Z
5. **Use PARAM, SHELLTVSMATTYPE, FLEXIBLE** — defaults missing shear moduli to G12
6. **Respect MAXRATIO thresholds** — 1E7 (no glue/contact), 1E8 (parabolic shell), 1E10 (glue/contact)
7. **Remove orphan nodes and zero-stiffness CBUSH** — causes singular stiffness matrix
8. **Specify memory explicitly on Linux** — don't rely on mem=max default
9. **Remove unnecessary INIT/ASSIGN statements** — use default scratch file allocation
10. **Include .fem, .sim, and .f06 files** when seeking help — not just the .sim file
