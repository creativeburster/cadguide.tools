---
title: "Trimble Business Center GNSS Processing: Baseline Failures, Ephemeris Data, Network Adjustment Singularities, and Account Name Path Issues"
excerpt: "TBC baseline processing fails for 5 distinct reasons: missing ephemeris data, Windows account names with special characters, missing geoid models, base coordinates too far from true position, and 15-second epoch intervals on long sessions. We cover each with fixes, plus network adjustment 'numerical problems' diagnosis."
category: "gnss-processing"
softwareSlug: "trimble-business-center"
keyword: "Trimble Business Center TBC GNSS baseline processing ephemeris network adjustment numerical problems geoid"
slug: "trimble-business-center-gnss-baseline-processing-ephemeris-network-adjustment"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://community.trimble.com/discussion/process-baselines-failed-because-no-reference-files-are-available"
  - "https://community.trimble.com/question/tbc-baseline-processing-taking-too-long"
  - "https://community.trimble.com/discussion/network-adjustment-could-not-be-successfully-completed-numerical-problems"
---

# Trimble Business Center GNSS Processing: Baseline Failures, Ephemeris Data, Network Adjustment Singularities, and Account Name Path Issues

Trimble Business Center (TBC) is widely used for GNSS baseline processing and network adjustment, but users encounter recurring issues that can halt production. Five distinct causes account for the majority of baseline processing failures, and network adjustment "numerical problems" have their own diagnostic path. This guide covers each with community-verified fixes.

## Issue 1: "No Reference Files Are Available"

### Symptom

When processing baselines, TBC fails with: "No reference files are available"

### Cause

The "reference files" are **ephemeris data** — satellite orbit information needed to compute baselines. Without ephemeris data for the observation period, TBC cannot process the baselines.

### Fix

1. Use **Internet Download** in TBC to download ephemeris data:
   - For CORS stations: Download **IGS Final Orbits**
   - For rapid results: IGS Rapid Orbits are sufficient
   - For final results: IGS Final Orbits provide slightly better elevation accuracy
2. After downloading, re-run Process Baselines

### Why It Works Sometimes But Not Others

Some baselines may process without explicit ephemeris download because TBC can use broadcast ephemeris embedded in the observation files. However, for CORS station baselines, the ephemeris must be downloaded separately — the station observation files don't include them.

## Issue 2: Windows Account Name with Special Characters

### Symptom

Baseline processing fails on one computer but works perfectly on another — even with the same TBC version and project files.

### Cause

If the Windows account name contains special characters (e.g., apostrophe `O'Brien`), TBC's GNSS module has trouble with file paths that include the account name. The file path becomes `C:\Users\O'Brien\Documents\...` and the apostrophe breaks path resolution.

### Fix

**Option A**: Create a new Windows account without special characters and process from there.

**Option B**: Change all TBC file paths from Drive C to Drive D (or another drive) to avoid the account name in the path:
1. Move TBC project files to `D:\TBC_Projects\`
2. Update TBC settings to use the new path
3. Re-open the project and process

### Why It's Hard to Diagnose

The error message gives no hint about the account name — it just says "no reference files available" or fails silently. The issue was discovered by a user who noticed their school's TBC worked fine, then traced it to their personal account name.

## Issue 3: Missing Geoid Model

### Symptom

Baseline processing completes but produces huge coordinate errors — positions are off by meters when compared to VRS or RTK results.

### Cause

In project settings under **Coordinate System/Geoid model & Vertical Datum**, no geoid model was selected. Without a geoid model, TBC cannot correctly transform between ellipsoidal and orthometric heights, producing large vertical errors and affecting horizontal positions in some projections.

### Fix

1. Go to **Settings → Coordinate System**
2. Select the correct **Geoid model** for your region
3. Select the correct **Vertical Datum**
4. Re-process baselines and re-run network adjustment

### Why VRS/RTK Worked But TBC Didn't

VRS and RTK corrections are computed by the reference station network with the geoid model already applied. TBC post-processing requires you to configure the geoid model yourself — it's not automatic.

## Issue 4: "Base Coordinates Are Too Far Away from True Coordinates"

### Symptom

When processing baselines, TBC displays: "Base coordinates are too far away from true coordinates." When processing does proceed, all baselines shrink significantly — distances show around hundredths of a foot, which is clearly incorrect.

### Cause

TBC is told the base station is at certain Lat/Long/Height (LLH) coordinates, but the satellite observations indicate the base is actually at a significantly different position (e.g., 100 feet off in latitude, 400 feet off in longitude). TBC refuses to process when the discrepancy is too large.

This commonly occurs when:
- Static files were recorded with a **Leica receiver** and converted to RINEX
- The RINEX header contains approximate coordinates that are far from the true position
- No seed coordinates were provided from a known source

### Fix

1. **Seed at least one point** with known good coordinates:
   - Send one observation file to **OPUS** (NGS Online Positioning User Service)
   - Use the OPUS solution as the fixed coordinate for that point
   - TBC can then process all other baselines relative to this seeded point
2. Or: Use an **NGS CORS station** in the network as a fixed reference
3. Check the base coordinates in TBC by turning on photos — if the base appears visually in the wrong place, the coordinates are wrong

## Issue 5: Excessively Long Processing Times

### Symptom

Processing 8 baselines with 30-second epoch intervals takes 3+ hours (45+ minutes per baseline). Each baseline has 6-10 hours of observation data with 60+ satellites.

### Cause

Processing long static sessions (6+ hours) with full GNSS (60+ satellites) at a 15-second interval creates an enormous computation load. More data is not always better — for long sessions, high-frequency logging is overkill.

### Fix

1. **Set Processing Interval to Automatic**:
   - Go to **Settings → Baseline Processing → Processing interval: Automatic**
   - TBC will down-sample to the interval needed (typically 3-4 minutes for 6-hour sessions)
   - Processing time drops from hours to minutes
   - Precision impact is negligible (very moderate improvement at 15s vs auto)

2. **Verify multi-threading**:
   - While processing, hit **Ctrl-Shift-Esc** → Performance → CPU
   - Check if multiple cores are being used
   - If only one core is active, the multi-thread baseline processor may not be engaged
   - The multi-thread processor was introduced in HD GNSS and may be hard-coded in recent versions

3. **Follow recommended data rates**:
   - Short sessions (< 1 hour): 15-second logging is appropriate
   - Medium sessions (1-4 hours): 15-30 seconds
   - Long sessions (4+ hours): 1-5 minute logging is sufficient
   - Satellites need to move to determine position — 8-hour sessions don't need 15-second data

## Network Adjustment: "Numerical Problems"

### Symptom

"Network adjustment could not be successfully completed. Numerical Problems"

### Cause

This is a core error in the network adjustment module. The matrix of normal equation coefficients becomes **singular** — TBC cannot solve the normal equations. Causes include:

1. **Sloppy data**: Bad height on one or more observations can skew results
2. **Mixed observation types**: Cannot have RTN/VRS data in an adjustment alongside base-and-rover RTK
3. **Uncomputable station coordinates**: A station's coordinates cannot be computed, making the matrix singular
4. **Fixed coordinate issues**: Check fixed coordinates — if a fixed point is wrong, the adjustment cannot resolve

### Fix

1. **Check fixed coordinates** — verify that all fixed control points have correct values
2. **Remove bad observations** — look for outliers in height or position
3. **Don't mix VRS/RTN with base-and-rover RTK** in the same adjustment
4. **Check for uncomputable stations** — stations that cannot be reached by the network geometry
5. **Review observation quality** — ensure all baselines processed successfully before adjustment

## Best Practices for TBC GNSS Processing

1. **Always download ephemeris data** before processing — don't rely on broadcast ephemeris alone
2. **Use Automatic processing interval** — let TBC down-sample long sessions
3. **Configure geoid model** before processing — not after
4. **Seed at least one point** with OPUS or CORS coordinates
5. **Avoid special characters in Windows account names** — or move projects to a clean path
6. **Don't mix VRS/RTN with base-and-rover RTK** in network adjustment
7. **Check all baselines processed successfully** before running network adjustment
8. **Use IGS Rapid Orbits for most projects** — Final Orbits only marginally improve elevation
9. **For 40-point networks**: Consider RTK with two base setups instead of full static — visit each point for 30 seconds from each base, let each base record for post-processing
10. **Monitor CPU utilization** during processing to verify multi-threading is active
