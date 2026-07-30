---
title: "Tekla Tedds Installation Errors, Calculator Failures, and Custom Calculation Writing: Complete Fix Guide"
excerpt: "Tekla Tedds users hit three recurring issues: Error 1638/1603 during installation, 'Failed to create Tedds Calculator' after Windows updates, and add-in error 287 in Word. We cover the official repair workflow, dependency checklist, and custom calculation writing with variable definitions and dimensional checking."
category: "troubleshooting"
softwareSlug: "tekla-tedds"
keyword: "Tekla Tedds installation error 1638 1603 failed create calculator fix repair"
slug: "tekla-tedds-installation-calculator-error-fix-guide"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-07-30"
sources:
  - "https://support.tekla.com/tekla-tedds/troubleshoot"
  - "https://support.tekla.com/article/failed-to-create-tedds-calculator-error"
  - "https://support.tekla.com/doc/tekla-tedds/2026/qsq_writingteddscalculationsstage1_ec"
---

# Tekla Tedds Installation Errors, Calculator Failures, and Custom Calculation Writing: Complete Fix Guide

Tekla Tedds is a structural calculation tool that integrates with Microsoft Word for engineering document generation. Three issues account for the majority of support tickets: installation failures with Error 1638/1603, "Failed to create Tedds Calculator" errors after Windows updates, and Tedds for Word add-in loading failures (Error 287). Each has a documented fix sequence from Trimble support.

## Issue 1: Installation Fails with Error 1638 or Error 1603

**Error 1638**: "Another version of this product is already installed. Installation of this version cannot continue."

**Error 1603**: Generic installation failure, often related to missing prerequisites or permission issues.

### Fix for Error 1638

A previous version of Tekla Tedds or Tekla Structural Designer is already installed and conflicts with the new installer.

1. Open **Control Panel → Programs → Programs and Features** (NOT "Add or remove programs")
2. Locate all existing Tekla Tedds components:
   - Tekla Tedds
   - Tekla Tedds 64-bit
   - Tekla Tedds Engineering Library
3. **Uninstall** all three components completely
4. Restart the computer
5. Re-run the new Tekla Tedds installer

### Fix for Error 1603

Error 1603 typically indicates missing dependencies or insufficient permissions.

1. Ensure you have **administrative privileges** for the installation
2. Verify all required dependencies are installed (see checklist below)
3. Temporarily disable antivirus software during installation
4. Run the installer as **Administrator** (right-click → Run as administrator)

## Issue 2: "Failed to Create Tedds Calculator" Error

**Symptom**: When opening or running a calculation command in Tedds or Tedds for Word, the error "Failed to create Tedds Calculator" appears, preventing any calculation.

**Root Cause**: This issue typically occurs after a **Windows update** or due to a problem with the Tedds installation. The calculator engine component becomes unregistered or corrupted.

### Fix: Repair All Three Tedds Components

1. Close **all instances** of Tedds and Tedds for Word
2. Go to **Control Panel → Programs → Programs and Features**
3. Locate the three Tekla Tedds components:
   - **Tekla Tedds**
   - **Tekla Tedds 64-bit**
   - **Tekla Tedds Engineering Library**
4. Right-click on the **first component** → select **Repair** (or Modify)
5. Allow the installer to complete and close
6. Repeat for **each** of the three components, one at a time
7. Relaunch Tedds and run a calculation from the Engineering Library

**Note**: You may need administrative privileges for the repair. Contact your IT department if you lack local admin rights.

If the error persists after repairing all three components, contact your local Tekla support team using the **Contact Support Tool** (built into Tedds).

## Issue 3: Tedds for Word Add-In Error 287

**Symptom**: Microsoft Word opens but the Tekla Tedds Add-in does not load. Error 287 may appear.

**Root Cause**: The Tedds Add-in has been disabled by Word, usually due to a performance timeout or a crash during a previous session.

### Fix

1. In Word, go to **File → Options → Add-ins**
2. At the bottom, select **COM Add-ins** from the dropdown → click **Go**
3. If the Tedds Add-in is listed but unchecked, **check it** to re-enable
4. If the Add-in is listed as disabled, go to **File → Options → Add-ins → Disabled Items** → re-enable it

### Prerequisites for Tedds for Word

If the add-in still won't load, verify these dependencies:

1. **Supported version of Microsoft Office Word** is installed (check system requirements for your Tedds version)
2. **Visual Basic for Applications (VBA)** is installed — verify via **Programs & Features → Modify Office installation → ensure VBA is included**
3. All **Microsoft Office Updates** are installed — run Windows Update
4. **Microsoft Visual Studio 2010 Tools for Office Runtime** is installed

## Complete Dependency Checklist

If Tedds won't install or launch, verify ALL of the following are installed and up to date:

| Dependency | Required For |
|------------|-------------|
| Microsoft .NET Framework 4.7.2 | Tedds core |
| Microsoft Visual C++ 2013, 2015 & 2017 Redistributable (x86) | Tedds 32-bit |
| Microsoft Visual C++ 2013, 2015 & 2017 Redistributable (x64) | Tedds 64-bit |
| Microsoft Visual Studio 2010 Tools for Office Runtime | Tedds for Word |
| Supported Microsoft Office Word with VBA | Tedds for Word |

### Full Repair Sequence

If verification doesn't resolve the issue, repair each component **in this order** via Control Panel → Programs & Features:

1. Tekla Tedds
2. Tekla Tedds 64-bit
3. Tekla Structural License Service
4. Tekla Structural License Service 64-bit
5. Tekla Structural Update Service
6. Tekla Structural Update Service 64-bit
7. Microsoft .NET Framework 4.5.2
8. Microsoft Visual C++ 2013, 2015 & 2017 Redistributable (x86)
9. Microsoft Visual C++ 2013, 2015 & 2017 Redistributable (x64)
10. Microsoft Visual Studio 2010 Tools for Office Runtime

Check after each repair whether the problem is resolved before proceeding to the next.

## Writing Custom Tedds Calculations

Beyond troubleshooting, Tedds' most powerful feature is the ability to write custom calculations that can be reused and updated. This is particularly valuable for firms with repeated calculation patterns.

### Basic Syntax

Tedds follows standard mathematical rules and operators:

- **`=`** defines an expression (triggers calculation)
- **`?`** specifies where the answer should appear
- **`;`** (semicolon) is the delimiter that separates expressions from text or other expressions in the same paragraph — omitting it causes calculation errors

Example:
```
L = 5 m
W = 3 m
A = L * W ?
```

### Variable Rules

- Variable names are **case sensitive**
- Cannot contain **spaces**
- Cannot be **function names** (e.g., `sin`, `cos`)
- Can use **Greek text** and **subscripts**
- The stored value includes **dimensions** — this is how Tedds handles unit conversions automatically

### Critical Behavior: Re-Calculation Required

**The stored value of a variable only changes when you re-calculate the definition, not when you edit it on the page.**

If you edit a variable's value, you must **re-calculate** the variable definition and all calculations that depend on it. Simply editing the text does not update the computed results.

### Dimensional Checking

Tedds automatically checks all dimensions in your calculation and warns you if they are incorrect. Use units consistently throughout — Tedds will verify dimensional correctness and flag mismatches.

For example, if you write `Force = Pressure * Area`, Tedds verifies that the dimensions resolve correctly (N/m² × m² = N). If you accidentally mix units (e.g., mm with inches), Tedds will catch the error.

### Error Handling During Calculation

When Tedds encounters an error during calculation:

1. An error dialog appears with details
2. Click the **Interrupt** button to stop the calculation process
3. Review the error details in the dialog
4. Fix the error in the calculation
5. Re-run the calculation

Common calculation errors:
- **Missing semicolon delimiter** between expressions
- **Undefined variable** referenced before definition
- **Dimensional mismatch** — units don't resolve correctly
- **Division by zero** or other mathematical errors

### Using the Engineering Library

The Tedds Engineering Library contains hundreds of pre-built calculations:

1. Use **Find in list** to search by keyword (e.g., "Steel member design AISC360")
2. Click **Calculate** to launch the calculation interface
3. Enter design parameters (dimensions, loading, material grades)
4. Use built-in **Data Lists** for standard sections — steel shapes, bolts, rebar, timber
5. Click **Preview results** to see utilization ratios and calculation status

Each calculation in the Library may contain over 150 individual items that Tedds automatically assembles based on your input options.
