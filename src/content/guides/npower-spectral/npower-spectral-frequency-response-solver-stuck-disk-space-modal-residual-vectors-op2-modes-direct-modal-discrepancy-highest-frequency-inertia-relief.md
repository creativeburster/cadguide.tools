---
title: "nPower Spectral Frequency Response Solver Stuck at Specific Frequency from Insufficient Disk Space, Modal Frequency Method Inaccurate Results from Missing Residual Vectors, Cannot Find Normal Modes in OP2 from Large Mode Count, Direct vs Modal Frequency Response Discrepancy from Insufficient Highest Frequency, and OptiStruct Inertia Relief Not Supported in Direct Frequency Response: Disk Space Check, Resvec Yes, OP2 Size Limit, Frequency Range Increase, and Inrel Disable"
excerpt: "nPower Spectral fails for 5 distinct reasons: frequency response solver stuck at specific frequency from insufficient disk space requiring disk cleanup, modal frequency method inaccurate results from missing residual vectors requiring RESVEC YES, cannot find normal modes in OP2 from large mode count requiring mode reduction, direct vs modal frequency response discrepancy from insufficient highest frequency requiring range increase, and OptiStruct inertia relief not supported in direct frequency response requiring INREL disable. We cover each with fixes from Altair and Siemens community."
category: "frequency-response-and-solver-errors"
softwareSlug: "npower-spectral"
keyword: "nPower Spectral frequency response solver stuck specific frequency disk space modal frequency method residual vectors RESVEC YES cannot find normal modes OP2 large mode count direct vs modal discrepancy insufficient highest frequency OptiStruct inertia relief direct frequency response INREL"
slug: "npower-spectral-frequency-response-solver-stuck-disk-space-modal-residual-vectors-op2-modes-direct-modal-discrepancy-highest-frequency-inertia-relief"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://2026.help.altair.com/2026/hwsolvers/os/topics/solvers/os/analysis_frequency_response_c.htm"
  - "https://community.sw.siemens.com/s/question/0D5Vb00000aYjNnKAK/sol-103-response-dynamics-simulation-gets-stuck-at-certain-frequency"
  - "https://community.sw.siemens.com/s/question/0D54O000061xkQESAY/strange-results-in-frequency-response"
---

# nPower Spectral Frequency Response Solver Stuck at Specific Frequency from Insufficient Disk Space, Modal Frequency Method Inaccurate Results from Missing Residual Vectors, Cannot Find Normal Modes in OP2 from Large Mode Count, Direct vs Modal Frequency Response Discrepancy from Insufficient Highest Frequency, and OptiStruct Inertia Relief Not Supported in Direct Frequency Response: Disk Space Check, Resvec Yes, OP2 Size Limit, Frequency Range Increase, and Inrel Disable

nPower Spectral produces errors from solver stalls, modal method inaccuracies, OP2 mode finding failures, direct vs modal discrepancies, and inertia relief incompatibility. This guide covers the 5 most common nPower Spectral problems with diagnostic steps and community-verified fixes from Altair and Siemens community.

## 1. Frequency Response Solver Stuck at Specific Frequency from Insufficient Disk Space

### Symptom

The SOL 103 Response Dynamics simulation gets stuck at a specific frequency. The solver easily calculates the first several modes but is unable to find the next mode, even after extended running time. Reducing the frequency range allows the solver to find the mode. Running from 0 to the full range doesn't finish, but running in smaller ranges works.

### Root Cause

"There was not enough disk space, and the solver filled the available memory while solving." The solver runs out of disk space and memory when processing large frequency ranges. The solver stores intermediate results and mode data on disk. When the disk fills up, the solver can't write additional data and gets stuck at the current frequency. The issue is more pronounced for large models with many elements.

### Fix

1. **Check available disk space**:
   - "There was not enough disk space"
   - "And the solver filled the available memory"
   - Check available disk space
   - Before running large analyses

2. **Free up disk space**:
   - Free up disk space
   - By deleting unnecessary files
   - Before running
   - Large frequency response analyses

3. **Split frequency range**:
   - "Trying to run from 0 to 1000Hz"
   - "It did not finish the solution"
   - "If I entered 900Hz-1000Hz range"
   - "It easily found the 15th mode"
   - Split the frequency range into smaller segments

4. **Use RDMODES to reduce solving time**:
   - "RDMODES will reduce solving time"
   - Use RDMODES
   - To reduce the number of modes
   - And solving time

5. **Check MUMPS solver**:
   - "MUMPS solver is the default"
   - "For SOL 103; SOL 111; SOL 105; SOL 112"
   - "Including SOL 130 - Response Dynamics"
   - Verify MUMPS solver is being used

6. **Reduce model size**:
   - If disk space is limited
   - Reduce the model size
   - By using superelements
   - Or coarser mesh

7. **Use out-of-core solver**:
   - Use out-of-core solver option
   - Which uses disk storage
   - Instead of memory
   - For large models

### Community Report

> "I've created a relatively large model (around 300,000 elements), and tried to run a SOL 103 Response Dynamics simulation. The solver easily calculated the first 14 modes (14th mode at 896 Hz), but it was unable to find the 15th mode (even after half an hour of running). If I entered 900Hz-1000Hz range, it easily found the 15th mode at 906 Hz in around 40 secs. I found the solution to this problem: there was not enough disk space, and the solver filled the available memory while solving."

## 2. Modal Frequency Method Inaccurate Results from Missing Residual Vectors

### Symptom

When running frequency response analysis with the modal frequency method, output accelerations near the base start from values much lower than the input. Using the direct integration method produces correct results. The discrepancy means important modes are being lost with the modal frequency method. The issue occurs with enforced motion analysis.

### Root Cause

"In NXN 6.1, if you use the default SPCD for enforced motion, you must remember to turn on residual vectors (PARAM, RESVEC, YES). Otherwise you will get the effect you are describing. In NXN 7, we changed the default to a newer SPCD formulation that does not require residual vectors." The modal frequency method truncates the mode set at a specified highest frequency. If residual vectors are not enabled, the truncated mode set doesn't capture the static response contribution, leading to inaccurate results near the base. The residual vectors supplement the mode set to improve accuracy.

### Fix

1. **Enable residual vectors**:
   - "Turn on residual vectors"
   - "PARAM, RESVEC, YES"
   - Add PARAM, RESVEC, YES
   - To the bulk data

2. **Use newer SPCD formulation**:
   - "In NXN 7, we changed the default"
   - "To a newer SPCD formulation"
   - "That does not require residual vectors"
   - Use NXN 7+ for automatic fix

3. **Increase highest frequency**:
   - "I also tried raising highest frequency value"
   - "To 50000 Hz and in this case"
   - "The solution matches with direct integration"
   - Increase the highest frequency value

4. **Use direct method for verification**:
   - "If I use direct integration method"
   - "The solution is ok"
   - Use direct method
   - To verify modal results

5. **Check enforced motion formulation**:
   - Verify the SPCD formulation
   - Being used for
   - Enforced motion analysis
   - Check solver version

6. **Use residual vectors for accuracy**:
   - "When residual vectors are included"
   - "Inertia relief can be applied"
   - Use residual vectors
   - For improved accuracy

7. **Verify results match direct method**:
   - After enabling RESVEC
   - Verify the modal results
   - Match the direct method
   - Results

### Community Report

> "If I run the analysis with modal frequency method, using a highest frequency value of 6000 Hz, the output accelerations of nodes near base start from values much lower than the 0.5 input. If I use direct integration method the solution is ok: output accelerations start from 0.5 g. In NXN 6.1, if you use the default SPCD for enforced motion, you must remember to turn on residual vectors (PARAM, RESVEC, YES). Otherwise you will get the effect you are describing."

## 3. Cannot Find Normal Modes in OP2 from Large Mode Count

### Symptom

After successfully solving SOL 103 Response Dynamics, creating a new Response Dynamics process produces the error "Can not find normal modes in OP2. Please check if the solution is solved successfully." The OP2 file exists and can be loaded in Simcenter, showing correct results. The error occurs when recovering a large number of modes (e.g., 290 modes from 20 to 2000 Hz).

### Root Cause

The OP2 file may be too large for the Response Dynamics module to read. When recovering a large number of modes (e.g., 290 modes), the OP2 file size exceeds the module's capacity. The module can't find the normal modes in the OP2 file because it can't read the entire file, even though the file is valid and contains the correct results.

### Fix

1. **Reduce the number of modes**:
   - "How many modes are you recovering?"
   - "In total 290 modes (from 20 to 2000 Hz)"
   - "Do you think the op2 is too big?"
   - Reduce the number of recovered modes

2. **Narrow the frequency range**:
   - Instead of 20 to 2000 Hz
   - Use a narrower range
   - To reduce the number of modes
   - And OP2 file size

3. **Verify OP2 file is valid**:
   - "I can load the op2 file in simcenter"
   - "I can see the results are ok"
   - Verify the OP2 file
   - Is valid and complete

4. **Check for FATAL messages**:
   - "I have checked, I have no FATAL messages"
   - Check the Nastran f06 file
   - For any FATAL messages
   - That may indicate issues

5. **Check .sim file corruption**:
   - "I think there might be a problem"
   - "With my .sim file, it might be corrupted"
   - Check the .sim file
   - For corruption

6. **Duplicate on different computer**:
   - "Can you duplicate the issue"
   - "On a different computer?"
   - Test on another machine
   - To isolate the issue

7. **Re-run SOL 103**:
   - "If you run it again (SOL103)"
   - "Do you always get the issue?"
   - Re-run the analysis
   - To check for intermittent issues

### Community Report

> "I have successfully solved and obtained mode shapes for SOL103 Response Dynamics solution. After getting result I am creating new solution process 'Response Dynamics'. I am getting following error: 'Can not find normal modes in OP2. Please check if the solution is solved successfully.' I have checked, I have no FATAL messages and I can load the op2 file in simcenter, I can see the results are ok, but Response Dynamics can seem to see the OP2. In total 290 modes (from 20 to 2000 Hz). Do you think the op2 is too big?"

## 4. Direct vs Modal Frequency Response Discrepancy from Insufficient Highest Frequency

### Symptom

When running frequency response with the modal method, results don't match the direct method. The modal method produces lower accelerations near the base than expected. Using a very high maximum frequency (e.g., 50000 Hz) makes the modal results match the direct method. The issue occurs when the highest frequency used for modal extraction is insufficient.

### Root Cause

"I think this means I loose important modes with modal frequency method and the solution is approximate. I also tried raising highest frequency value to 50000 Hz and in this case the solution matches with direct integration." The modal frequency method only captures modes up to the specified highest frequency. If the highest frequency is too low, important high-frequency modes are excluded, leading to inaccurate results. The direct method doesn't have this limitation because it solves the full system of equations.

### Fix

1. **Increase highest frequency value**:
   - "I also tried raising highest frequency value"
   - "To 50000 Hz and in this case"
   - "The solution matches with direct integration"
   - Increase the highest frequency

2. **Use residual vectors**:
   - "I've tried to add resvec,yes too"
   - "But the problem is unchanged"
   - "Unless I increase max frequency"
   - Use RESVEC with increased frequency

3. **Use direct method for verification**:
   - "If I use direct integration method"
   - "The solution is ok"
   - Use direct method
   - To verify modal results

4. **Check enforced motion formulation**:
   - Verify the SPCD formulation
   - For enforced motion
   - And use the appropriate
   - Method for your version

5. **Use FASTFR or FastFRS for large problems**:
   - "Improved performance may be obtained"
   - "By using the Faster Modal Solution Method (FASTFR)"
   - "Or the Fast Frequency Response Solver (FastFRS)"
   - Use FASTFR for large modal problems

6. **Verify frequency range covers key modes**:
   - Ensure the frequency range
   - Covers all significant modes
   - That contribute to
   - The response

7. **Use modal method for large problems**:
   - "For large problems involving more than a few frequencies"
   - "The modal solution is typically the most efficient"
   - Use modal method
   - For computational efficiency

### Community Report

> "If I run the analysis with modal frequency method, using a highest frequency value of 6000 Hz, the output accelerations of nodes near base start from values much lower than the 0.5 input. If I use direct integration method the solution is ok. I think this means I loose important modes with modal frequency method. I also tried raising highest frequency value to 50000 Hz and in this case the solution matches with direct integration. Why do I have to use such high frequencies?"

## 5. OptiStruct Inertia Relief Not Supported in Direct Frequency Response

### Symptom

When attempting to run a direct frequency response analysis with inertia relief enabled, the solver errors out. The error message indicates that inertia relief is not supported for direct frequency response analysis. The issue occurs when INREL is set to a non-zero value for direct frequency response.

### Root Cause

"OptiStruct does not support inertia relief for direct frequency response analysis. The solver will error out if it is attempted." Inertia relief is not supported for direct frequency response analysis in OptiStruct. The direct frequency response solver solves the full system of equations, which doesn't support the inertia relief formulation. Inertia relief is only available for certain analysis types.

### Fix

1. **Disable inertia relief for direct FRF**:
   - "OptiStruct does not support inertia relief"
   - "For direct frequency response analysis"
   - "The solver will error out if it is attempted"
   - Set INREL to 0 for direct FRF

2. **Use modal frequency response instead**:
   - "When residual vectors are included"
   - "Inertia relief can be applied by default"
   - "To constrained models"
   - Use modal FRF with residual vectors

3. **Use INREL, 0 explicitly**:
   - "If has to be, INREL, 0"
   - Set INREL to 0
   - Explicitly in the
   - Bulk data

4. **Use residual vectors for modal FRF**:
   - "When residual vectors are included"
   - "Inertia relief can be applied"
   - Enable RESVEC for
   - Modal frequency response

5. **Constrain the model instead**:
   - Instead of inertia relief
   - Apply proper constraints
   - To the model
   - For direct frequency response

6. **Check analysis type compatibility**:
   - Verify that the analysis type
   - Supports inertia relief
   - Before enabling
   - INREL parameter

7. **Use alternative analysis methods**:
   - If inertia relief is required
   - Use an analysis method
   - That supports it
   - (e.g., modal FRF with RESVEC)

### Community Report

> "OptiStruct does not support inertia relief for direct frequency response analysis. The solver will error out if it is attempted. When residual vectors are included, inertia relief can be applied by default to constrained models. If has to be, INREL, 0."

## 6. Additional nPower Spectral Issues

### FASTFR and FastFRS Solvers

**Issue**: "For some classes for models, improved performance may be obtained by using the Faster Modal Solution Method (FASTFR) or the Fast Frequency Response Solver (FastFRS)."
**Fix**: Use FASTFR or FastFRS for large modal frequency response problems. These solvers provide improved performance for specific model classes.

### Frequency Set Configuration

**Issue**: "A frequency set must be referenced using a FREQUENCY statement. A METHOD statement is required for the modal method to control the normal modes analysis."
**Fix**: Ensure FREQUENCY and METHOD statements are properly referenced. Use EIGVRETRIEVE to retrieve saved eigenvectors for computational efficiency.

### Output Data Format

**Issue**: "Select the complex frequency response data format (real/imaginary or magnitude/phase)."
**Fix**: Choose the appropriate output data format. Use real/imaginary for complex analysis. Use magnitude/phase for engineering interpretation.

### Output File Format

**Issue**: "Select the output file format (h3d, punch, or op2)."
**Fix**: Choose the appropriate output file format. Use h3d for HyperView. Use punch for text-based results. Use op2 for Simcenter integration.

### Random PSD Frequency Response

**Issue**: "Perform random frequency response analysis. This includes two steps: define unit input frequency response subcase, and perform random response analysis."
**Fix**: Follow the two-step process for random PSD analysis. Define unit input subcases first. Then combine with auto and cross PSD matrix.

### Unit Input Frequency Response

**Issue**: "Set up subcases with unit inputs. In practice, this is common to generate vibration and noise sensitivity results."
**Fix**: Use unit input subcases for sensitivity analysis. Generate vibration and noise sensitivity results from unit inputs.

### MUMPS Solver Default

**Issue**: "MUMPS solver is the default for SOL 103; SOL 111; SOL 105; and SOL 112 including SOL 130 - Response Dynamics."
**Fix**: Use MUMPS solver as default for eigenvalue and response dynamics analysis. Verify MUMPS is being used in the f06 file.

## Best Practices

1. **Check disk space before large frequency response analyses** — prevents solver stalls
2. **Enable PARAM, RESVEC, YES for modal frequency response** — improves accuracy
3. **Reduce mode count if OP2 is too large** — prevents Response Dynamics import failure
4. **Increase highest frequency for modal method accuracy** — captures important high-frequency modes
5. **Disable INREL for direct frequency response** — not supported in OptiStruct
6. **Use direct method to verify modal results** — ensures accuracy
7. **Split frequency range for large models** — prevents disk space issues
8. **Use FASTFR or FastFRS for large modal problems** — improved performance
9. **Use MUMPS solver for SOL 103/111/105/112** — default for best performance
10. **Use RDMODES to reduce solving time** — reduces mode count and computation time
