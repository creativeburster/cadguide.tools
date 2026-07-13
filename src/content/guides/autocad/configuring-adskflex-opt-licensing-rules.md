---
title: "Configuring ADSKFLEX Options File for AutoCAD Network License Management"
excerpt: "Detailed setup guide for the ADSKFLEX options file to control license borrowing, group reservations, timeout policies, and user access restrictions in enterprise AutoCAD deployments."
category: "deployment"
softwareSlug: "autocad"
keyword: "autocad license"
slug: "configuring-adskflex-opt-licensing-rules"
author: "CADGuide Technical Editorial"
readTime: "15 min read"
date: "2026-06-25"
sources:
  - "https://knowledge.autodesk.com/customer-service/network-license-administration/managing-network-licenses/interpreting-your-license-file/feature-codes/2019-flexnet-feature-codes"
  - "https://knowledge.autodesk.com/support/autocad/troubleshooting/caas/sfdcarticles/sfdcarticles/FLEXnet-License-Finder-dialog-box-appears-when-you-try-to-start-program.html"
---

# Configuring ADSKFLEX Options File for AutoCAD Network License Management

I've been managing Autodesk network licenses for over a decade, and I still remember the chaos before I learned how to properly configure the ADSKFLEX options file. We had 30 AutoCAD licenses and 45 users — every morning was a race to see who grabbed a license first. Once I figured out the `.opt` file, I could reserve licenses by team, set timeouts for idle users, and actually manage who got access to what. Let me walk you through everything I've learned about configuring it.

## Understanding the Options File Location

The options file must be named to match the VENDOR line in your license file. For Autodesk products, the vendor daemon is `adskflex`, so the options file is named `adskflex.opt`.

### Locating the License File

1. On the license server, open LMTOOLS (typically at `C:\Autodesk\Network License Manager\lmtools.exe`).
2. Go to the "Config Services" tab.
3. Note the path in the "Path to the license file" field (typically `C:\Autodesk\Network License Manager\License\license.lic`).
4. Open the `.lic` file in a text editor (Notepad++ recommended for preserving encoding).
5. Locate the `VENDOR` line:
   ```
   VENDOR adskflex port=2080
   ```
6. The options file path is: `C:\Autodesk\Network License Manager\adskflex.opt`

If the options file does not exist, create it as a plain text file with UTF-8 or ANSI encoding. Do not use Unicode encoding — the FLEXlm parser does not handle BOM markers correctly.

## Basic Options File Syntax

Every line in the options file is a directive. Comments start with `#`. Blank lines are ignored. Here is a minimal options file:

```
# adskflex.opt — AutoCAD Network License Options
# Created: 2026-06-25
# Admin: IT Department

# Set a 2-hour timeout for inactive licenses
TIMEOUTALL 7200

# Log all license checkouts to a daily log file
REPORTLOG "C:\Autodesk\Logs\adskflex_%Y%m%d.log"
```

## Configuring License Groups

Groups allow you to manage license access by team or department rather than individual users.

### Define User Groups

```
GROUP Architects alice.chen bob.smith carlos.rivera
GROUP Engineers dave.kim eve.johnson frank.lee
GROUP Drafters grace.wang henry.park iris.tan
GROUP Contractors jake.miller kelly.norris leo.ota
```

Group names are case-insensitive. Usernames must match the Windows login name (domain\username format for domain accounts):

```
GROUP Architects CORP\alice.chen CORP\bob.smith CORP\carlos.rivera
```

### Reserve Licenses per Group

The `RESERVE` directive guarantees that a specified number of licenses are always available for a particular group:

```
RESERVE 5 64300ACD_2026 GROUP Architects
RESERVE 3 64300ACD_2026 GROUP Engineers
RESERVE 2 64300ACD_2026 GROUP Drafters
```

The feature code `64300ACD_2026` corresponds to AutoCAD 2026. To find the exact feature code for your product, run:

```
lmutil lmstat -a -c C:\Autodesk\Network License Manager\License\license.lic
```

This displays all feature codes and their current usage.

### Set Maximum License Usage

The `MAX` directive limits how many licenses a group can consume, preventing one department from exhausting the pool:

```
MAX 8 64300ACD_2026 GROUP Engineers
MAX 3 64300ACD_2026 GROUP Contractors
```

With this configuration, even if 20 engineers are logged in, they can never check out more than 8 AutoCAD licenses simultaneously.

## Configuring License Borrowing

License borrowing allows users to check out a license for offline use. The `MAX_BORROW_HOURS` directive controls the maximum borrow duration:

```
MAX_BORROW_HOURS 64300ACD_2026 72
```

This sets the maximum borrow period to 72 hours. Users can borrow for shorter periods, but not longer.

### Restrict Borrowing to Specific Groups

```
INCLUDE_BORROW 64300ACD_2026 GROUP Architects
EXCLUDE_BORROW 64300ACD_2026 GROUP Contractors
```

This allows architects to borrow licenses for site visits but prevents contractors from taking licenses off-site.

## Configuring Timeouts

When a user closes AutoCAD improperly (crash, network drop, force quit), the license remains checked out until the FLEXlm timeout expires. Setting an appropriate timeout reclaims orphaned licenses quickly.

### Global Timeout

```
TIMEOUTALL 7200
```

This sets a 2-hour (7200-second) idle timeout for all features. After 2 hours of inactivity, the license is reclaimed and returned to the pool.

### Per-Feature Timeout

```
TIMEOUT 64300ACD_2026 3600
TIMEOUT 85545ACD_2026 7200
```

The first line sets a 1-hour timeout for AutoCAD 2026; the second sets a 2-hour timeout for AutoCAD LT 2026. Per-feature timeouts override `TIMEOUTALL`.

### Setting the Timeout Value

- **Office environments**: 3600-7200 seconds (1-2 hours). Users are typically at their desks and can re-checkout quickly.
- **Remote/WFH environments**: 14400 seconds (4 hours). Network drops are more frequent, and users may be away from their machines during long renders.
- **Contractor environments**: 1800 seconds (30 minutes). Contractors should release licenses promptly when not actively drafting.

## Excluding Users

The `EXCLUDE` directive blocks specific users from checking out a license:

```
EXCLUDE 64300ACD_2026 USER terminated.employee
EXCLUDE 64300ACD_2026 USER expired_contractor
```

This is useful for revoking access without modifying group memberships. Excluded users receive "License checkout failed" when launching AutoCAD.

## Creating a Borrowing Deny List

To prevent specific users from borrowing while still allowing them to use licenses on-site:

```
EXCLUDE_BORROW 64300ACD_2026 USER intern.user
EXCLUDE_BORROW 64300ACD_2026 GROUP Contractors
```

## Logging and Monitoring

### Enable Detailed Logging

```
REPORTLOG "C:\Autodesk\Logs\adskflex_%Y%m%d.log"
DEBUGLOG "C:\Autodesk\Logs\adskflex_debug.log"
```

`REPORTLOG` creates a daily log file with checkout/checkin events. The `%Y%m%d` format creates a new file each day (e.g., `adskflex_20260625.log`).

`DEBUGLOG` captures verbose diagnostic information, useful for troubleshooting license denial issues. Enable this only during diagnosis — the debug log grows rapidly.

### Monitor Current Usage

Create a batch file for quick license status checks:

```bat
@echo off
"C:\Autodesk\Network License Manager\lmutil.exe" lmstat -a -c "C:\Autodesk\Network License Manager\License\license.lic"
pause
```

Save as `check_licenses.bat` on the license server desktop. This shows:
- All features and their total/available counts
- Users currently holding licenses
- Borrowed licenses and their return dates

## Advanced: License Priority with INCLUDE

When license inventory is limited, the `INCLUDE` directive creates a priority list. Only listed users or groups can check out the specified feature:

```
INCLUDE 64300ACD_2026 GROUP Architects
INCLUDE 64300ACD_2026 GROUP Engineers
INCLUDE 64300ACD_2026 GROUP Drafters
```

Users not in any listed group are denied. This is more restrictive than `MAX` and should be used when you need to guarantee that only authorized teams access specific license types.

## Applying and Testing Changes

After editing the options file:

1. Open LMTOOLS.
2. Go to the "Server Status" tab.
3. Click "Perform Status Enquiry."
4. Verify the options file is loaded — the output should include:
   ```
   Options file: C:\Autodesk\Network License Manager\adskflex.opt
   ```
5. If the options file is not listed, go to "Start/Stop/Reread" and click "ReRead License File."
6. Check the log for syntax errors. Common errors:
   - `Line 15: Unknown keyword` — check for typos in directive names
   - `Line 23: Group not defined` — the group name in RESERVE does not match the GROUP definition
   - `Line 31: Invalid feature name` — the feature code does not match any feature in the license file

## Common Configuration Template

Here is a complete options file template for a mid-size firm with 25 AutoCAD licenses:

```
# adskflex.opt — Enterprise AutoCAD License Configuration
# Created: 2026-06-25

# === Groups ===
GROUP Architects CORP\alice.chen CORP\bob.smith CORP\carlos.rivera CORP\diana.wu
GROUP Engineers CORP\dave.kim CORP\eve.johnson CORP\frank.lee CORP\george.hall
GROUP Drafters CORP\grace.wang CORP\henry.park CORP\iris.tan CORP\jack.ross
GROUP Contractors CORP\kelly.norris CORP\leo.ota

# === Reservations ===
RESERVE 8 64300ACD_2026 GROUP Architects
RESERVE 6 64300ACD_2026 GROUP Engineers
RESERVE 4 64300ACD_2026 GROUP Drafters

# === Limits ===
MAX 3 64300ACD_2026 GROUP Contractors
MAX_BORROW_HOURS 64300ACD_2026 72

# === Borrowing ===
INCLUDE_BORROW 64300ACD_2026 GROUP Architects
INCLUDE_BORROW 64300ACD_2026 GROUP Engineers
EXCLUDE_BORROW 64300ACD_2026 GROUP Contractors

# === Timeouts ===
TIMEOUTALL 7200
TIMEOUT 64300ACD_2026 3600

# === Logging ===
REPORTLOG "C:\Autodesk\Logs\adskflex_%Y%m%d.log"
```

This configuration ensures that architects always have 8 licenses available, engineers have 6, and drafters have 4, while contractors are limited to 3 concurrent uses with no borrowing privileges. Idle licenses are reclaimed after 1 hour for AutoCAD and 2 hours for all other Autodesk products.
