---
title: "Moldex3D Injection Molding Simulation Errors"
excerpt: "Moldex3D Injection Molding Simulation Errors: symptoms, root causes, and step-by-step fixes, verified against Moldiverse Forum."
category: "troubleshooting"
softwareSlug: "moldex3d"
keyword: "Moldex3D random analysis failure Intel 13th 14th Gen CPU instability replacement AMD workaround Error 4000 cooling non-matching mesh part insert matching mesh non-matching faces disabled high shear rates PTT viscoelastic model corner instability mesh refinement solver settings license task exceeded concurrent jobs license management symmetry mesh preprocessing crash 2025 R1 update"
slug: "moldex3d-injection-molding-simulation-errors"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-08-03"
sources:
  - "https://forum.moldex3d.cloud/question/analysis-failed-randomly-intels-crashing-13th-and-14th-gen-cpus/"
  - "https://forum.moldex3d.cloud/answer/re-error-4000-during-cooling-in-an-overmolding-simulation/"
  - "https://forum.moldex3d.cloud/question/issue-with-high-shear-rates-in-exponential-phan-thien-tanner-viscoelastic-model/"
---

# Moldex3D Injection Molding Simulation Errors: Random Analysis Failure from Intel 13th 14th Gen CPU Instability Requiring CPU Replacement or AMD Workaround, Error 4000 During Cooling from Non-Matching Mesh Between Part and Insert Requiring Matching Mesh with Non-Matching Faces Disabled, High Shear Rates in PTT Viscoelastic Model from Corner Instability Requiring Mesh Refinement or Solver Settings, License Task Exceeded from Concurrent Jobs Requiring License Management, and Symmetry Mesh Preprocessing Crash from Mesh Issues Requiring 2025 R1 Update

Moldex3D's solver stability, mesh matching, viscoelastic models, license management, and mesh preprocessing produce errors from CPU instability, non-matching meshes, corner shear rates, license limits, and symmetry mesh bugs. This guide covers the 5 most common Moldex3D problems with diagnostic steps and community-verified fixes from Moldiverse Forum.

## 1. Random Analysis Failure from Intel 13th 14th Gen CPU Instability

### Symptom

Random analysis failure in every stage of Moldex3D analysis — COOL, FLOW, and Pack. The failure is random and not reproducible at Moldex3D HQ even with the same trouble cases from customers. The analysis fails at different stages each time. No specific error message — the analysis simply fails.

### Root Cause

"Intel extends 13th & 14th Gen CPU warranties by 2 years in response to chip instability issues. We start to think if there is connection between Moldex3D analysis failure and Intel CPU instability issues. Since all our tests are based on AMD CPU and analysis failure from users is based on Intel i9-14900F (14th Gen)." Intel 13th and 14th Gen CPUs have a known instability issue that causes random computational errors. Moldex3D's solver performs intensive floating-point calculations that are sensitive to CPU instability. The random errors cause the solver to produce incorrect results or crash.

### Fix

1. **Update Intel CPU microcode**:
   - Check for BIOS updates from motherboard manufacturer
   - Update to the latest BIOS with Intel microcode patch
   - The microcode update fixes the voltage instability
   - This is the primary fix from Intel

2. **Use AMD-based workstation**:
   - If possible, run Moldex3D on AMD-based systems
   - AMD CPUs don't have the 13th/14th Gen instability issue
   - This is the most reliable workaround

3. **Replace affected Intel CPU**:
   - Intel extended warranty for 13th/14th Gen CPUs
   - Contact Intel for RMA if CPU is affected
   - Replace with a new or different CPU
   - The replacement should have the fix applied

4. **Underclock or undervolt**:
   - Reduce CPU clock speed slightly
   - Or reduce voltage in BIOS
   - This may reduce the instability
   - But will also reduce performance

5. **Disable turbo boost**:
   - Turn off Intel Turbo Boost in BIOS
   - Run at base clock speed
   - This reduces the voltage spikes that cause instability
   - May prevent random analysis failures

6. **Monitor for crashes**:
   - Run CPU stress tests (Prime95, Cinebench)
   - If the CPU crashes during stress tests, it's affected
   - Contact Intel for replacement
   - Use AMD workstation in the meantime

### Community Report

> "In the end of July 2024, Moldex3D HQ received analysis failure from users — a random failure in every stage of Moldex3D analysis such as COOL, FLOW and Pack. This issue is not reproducible at Moldex3D HQ even with those trouble cases from customer. Intel extends 13th & 14th Gen CPU warranties by 2 years in response to chip instability issues. All our tests are based on AMD CPU and analysis failure from users is based on Intel i9-14900F (14th Gen)."

## 2. Error 4000 During Cooling from Non-Matching Mesh Between Part and Insert

### Symptom

Error 4000 during cooling in an overmolding simulation. The error occurs even without meshing error messages. Redesigned the metal insert but the error persists. The analysis fails at the cooling stage.

### Root Cause

"The mesh elements between part insert and part itself were probably not 'matching.'" In overmolding simulations, the mesh between the metal insert and the plastic part must be matching — nodes on the interface must align. Non-matching meshes create gaps or overlaps in the thermal calculation, causing the cooling solver to fail with Error 4000. The meshing may pass quality checks but still have non-matching interfaces.

### Fix

1. **Regenerate the mesh**:
   - Delete the existing mesh
   - Regenerate from scratch
   - This may create matching meshes

2. **Disable "Allow non-matching faces"**:
   - Go to Preference Settings
   - Untick "Allow non-matching faces"
   - This forces the mesher to create matching meshes

3. **Check mesh at insert-part interface**:
   - Visually inspect the mesh at the interface
   - Verify nodes align between insert and part
   - If nodes don't align, remesh with matching constraint
   - Use the mesh matching tool

4. **Use conformal meshing**:
   - Enable conformal meshing for the insert-part interface
   - This ensures the mesh conforms at the interface
   - Nodes are shared at the boundary
   - Prevents non-matching mesh errors

5. **Simplify the insert geometry**:
   - If the insert has complex features
   - Simplify the geometry
   - This makes mesh matching easier
   - Gradually add complexity back

6. **Check for mesh quality issues**:
   - Even without error messages, check mesh quality
   - Look for high aspect ratio elements
   - Check for negative volume elements
   - Fix any quality issues before analysis

### Community Report

> "I am facing an error 4000 during cooling in an overmolding simulation. I initially fully redesigned the metal insert, thinking it was a meshing issue, but even without meshing error message, I still have this error 4000. The mesh elements between part insert and part itself were probably not 'matching.' Try to regenerate the mesh. Tip to create 'matching mesh' — please untick 'Allow non-matching faces' at preference setting interface."

## 3. High Shear Rates in PTT Viscoelastic Model from Corner Instability

### Symptom

Using exponential Phan-Thien Tanner (PTT) viscoelastic model. Extremely high shear rates develop at the corners of the melt inlet. These high shear rates propagate towards the melt front and eventually catch up with it. The entire model experiences excessively high shear rates, leading to unrealistic and incorrect results. Different meshes and solver settings don't improve the situation.

### Root Cause

The PTT viscoelastic model is sensitive to mesh quality at corners and sharp transitions. At the melt inlet corners, the velocity gradient is very high, creating extreme shear rates. The viscoelastic solver amplifies these due to the elastic stress accumulation. The high shear rates then propagate through the flow field, contaminating the entire solution. This is a numerical instability at sharp corners.

### Fix

1. **Refine mesh at inlet corners**:
   - Create a finer mesh at the melt inlet corners
   - Use boundary layer meshing
   - Smooth the corner geometry if possible
   - This reduces the velocity gradient at corners

2. **Round the inlet corners**:
   - If possible, round the inlet geometry
   - Remove sharp corners at the melt entrance
   - This reduces the shear rate concentration
   - Even a small radius helps

3. **Adjust solver settings**:
   - Reduce the time step size
   - Increase the number of iterations
   - Use a more stable numerical scheme
   - Experiment with different solver parameters

4. **Use a different viscoelastic model**:
   - Try the linear PTT model instead of exponential
   - Or try the Oldroyd-B model
   - Different models have different stability characteristics
   - The exponential PTT is known to be less stable

5. **Reduce relaxation time**:
   - The PTT model's relaxation time affects stability
   - Try a shorter relaxation time
   - This reduces the elastic stress buildup
   - But may change the physical behavior

6. **Use stabilization techniques**:
   - Enable solver stabilization options
   - Use upwind discretization for stress
   - Add artificial diffusion to the stress equation
   - This may control the shear rate propagation

7. **Check inlet boundary conditions**:
   - Verify the inlet velocity profile
   - Use a fully developed flow profile
   - Avoid plug flow at the inlet
   - This reduces corner shear rates

### Community Report

> "I am facing an issue with my simulation using an exponential Phan-Thien Tanner (PTT) viscoelastic model. Extremely high shear rates quickly develop at the corners of my melt inlet. These high shear rates then propagate towards the melt front and eventually catch up with it. The entire model experiences excessively high shear rates, leading to unrealistic and incorrect results. I have experimented with different meshes and solver settings, but so far I have not been able to improve the situation."

## 4. License Task Exceeded from Concurrent Jobs

### Symptom

Submitting a calculation and receiving error: "task no. of job(s) is greater than available license no." The analysis doesn't start. The error occurs when multiple jobs are submitted simultaneously or when previous jobs are still running.

### Root Cause

Moldex3D uses a license system that limits the number of concurrent analysis tasks. Each running analysis consumes one or more license tokens. When the number of submitted jobs exceeds the available license tokens, the error occurs. The license server doesn't queue jobs — it simply rejects the excess.

### Fix

1. **Check available licenses**:
   - Open Moldex3D License Manager
   - Check the number of available license tokens
   - Verify how many are currently in use
   - Wait for running jobs to finish before submitting new ones

2. **Queue jobs manually**:
   - Don't submit all jobs at once
   - Submit one job at a time
   - Wait for each to complete
   - Then submit the next

3. **Use the Job Scheduler**:
   - Use Moldex3D's Job Scheduler/Computing Manager
   - This queues jobs and runs them as licenses become available
   - Instead of submitting directly
   - Submit through the scheduler

4. **Purchase additional licenses**:
   - If concurrent jobs are frequently needed
   - Contact Moldex3D sales for additional license tokens
   - This increases the number of concurrent jobs
   - Prevents the error

5. **Check for orphaned licenses**:
   - Sometimes a crashed job doesn't release its license
   - Restart the license server
   - Check for orphaned license tokens
   - This may free up licenses

6. **Monitor license usage**:
   - Use the Computing Manager to monitor
   - Set maximum tasks to match available licenses
   - If max tasks shows 0 after IP change, reconfigure the server

### Community Report

> "When I submitted the calculation, I got error message: 'task no. of job(s) is greater than available license no.' How to solve it? Use the Job Scheduler to queue jobs. Check available licenses in License Manager. Purchase additional licenses if needed. If max tasks shows 0 after RC Server IP change, reconfigure the server."

## 5. Symmetry Mesh Preprocessing Crash from Mesh Issues

### Symptom

Moldex3D crashes during preprocessing when using symmetry mesh. The crash occurs during mesh generation or preparation. The crash is related to symmetry mesh creation. The analysis doesn't start because preprocessing fails.

### Root Cause

"Fixed symmetry mesh issues causing preprocessing crashes." The symmetry mesh generation has a bug that causes a crash during preprocessing. The symmetry mesh tool creates a mirror of the mesh on one side of the symmetry plane. When the mesh doesn't properly align with the symmetry plane, or when the symmetry plane intersects complex geometry, the mesh generation crashes.

### Fix

1. **Update to Moldex3D 2025 R1**:
   - Install Moldex3D 2025 R1
   - This is the primary fix
   - The symmetry mesh bug is resolved

2. **Check symmetry plane alignment**:
   - Verify the symmetry plane is properly defined
   - Ensure the plane aligns with the model geometry
   - Check for gaps between the model and symmetry plane
   - Adjust the plane position

3. **Simplify geometry at symmetry plane**:
   - If the symmetry plane intersects complex features
   - Simplify the geometry at the intersection
   - Remove small features near the symmetry plane
   - This may prevent the mesh crash

4. **Use full model instead of symmetry**:
   - If symmetry mesh crashes
   - Use the full model without symmetry
   - This avoids the symmetry mesh generation
   - But increases computation time

5. **Create mesh without symmetry first**:
   - Generate the mesh without symmetry
   - Verify mesh quality
   - Then apply symmetry as a post-processing step
   - This may work around the crash

6. **Check mesh quality before symmetry**:
   - Ensure the base mesh is high quality
   - Fix any mesh errors before applying symmetry
   - The symmetry tool may crash on poor quality meshes
   - Use Mesh Check before symmetry

### Community Report

> "Moldex3D 2025 R1: Fixed symmetry mesh issues causing preprocessing crashes. Resolved CAD import issues from NX and CATIA, especially involving assemblies with complex mating. Corrected thermal pin simulation behavior in over-molded parts. Stabilized Linux-based solver operations for distributed computing environments. Fixed API call inconsistencies affecting automated workflows."

## 6. Additional Moldex3D Issues

### CAD Import from NX and CATIA

**Issue**: "Resolved CAD import issues from NX and CATIA, especially involving assemblies with complex mating."
**Fix**: Update to 2025 R1. Use STEP or IGES as intermediate format if direct import fails. Simplify assembly mating relationships before export.

### Thermal Pin Simulation in Over-Molded Parts

**Issue**: "Corrected thermal pin simulation behavior in over-molded parts."
**Fix**: Update to 2025 R1. Verify thermal pin properties. Check contact resistance settings. Use correct material properties for thermal pin.

### Linux Solver Stability

**Issue**: "Stabilized Linux-based solver operations for distributed computing environments."
**Fix**: Update to 2025 R1. Check Linux distribution compatibility. Verify network configuration for distributed computing. Use the latest solver build.

### API Call Inconsistencies

**Issue**: "Fixed API call inconsistencies affecting automated workflows in some enterprise environments."
**Fix**: Update to 2025 R1. Check API documentation for changes. Update custom scripts. Verify API endpoint compatibility.

### iSLM Project Sync Issues

**Issue**: "iSLM Project Sync — after removing local project, next sync shows the same folder again."
**Fix**: Clear iSLM cache. Check sync settings. Verify project deletion is complete. Contact Moldex3D support if issue persists.

### Moldex3D Crash

**Issue**: "Moldex3d crash" — general crash reports.
**Fix**: Update to latest version. Check system requirements. Monitor memory usage. Check for Intel CPU instability. Contact support with crash log.

## Best Practices

1. **Check for Intel 13th/14th Gen CPU instability** — primary cause of random analysis failures
2. **Use AMD-based workstations for critical analyses** — avoids CPU instability
3. **Untick "Allow non-matching faces" for overmolding** — prevents Error 4000
4. **Regenerate mesh if Error 4000 occurs** — may create matching meshes
5. **Refine mesh at inlet corners for viscoelastic models** — reduces corner shear rates
6. **Round sharp corners at melt inlet** — prevents shear rate concentration
7. **Use Job Scheduler for license management** — prevents license exceeded errors
8. **Update to Moldex3D 2025 R1 for symmetry mesh fix** — prevents preprocessing crash
9. **Monitor license usage in Computing Manager** — prevents concurrent job errors
10. **Keep Moldex3D updated** — 2025 R1 includes many bug fixes and stability improvements
