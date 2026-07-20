---
title: "Customizing AutoCAD Command Aliases with PGP Files for Faster Drafting"
excerpt: "Complete guide to editing the acad.pgp file, creating custom command shortcuts, distributing aliases across teams, and troubleshooting conflicts with LISP and ribbon commands."
category: "performance"
softwareSlug: "autocad"
keyword: "autocad shortcuts"
slug: "pgp-alias-commands-automation"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-06-25"
sources:
  - "https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Customization/files/GUID-FE9AE544-F537-4D3B-8F75-B76484513787.htm"
  - "https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Customization/files/GUID-D4CACED6-DFBA-43C3-BC42-8D980AB3AE75.htm"
---

# Customizing AutoCAD Command Aliases with PGP Files for Faster Drafting

I'm a firm believer that customizing your PGP file is the single highest-ROI thing you can do in AutoCAD. I've watched drafters save 20-30 minutes a day just by switching to aliases that match their workflow. The defaults like `L` for `LINE` and `C` for `CIRCLE` are fine, but the real gains come when you build aliases around how you actually work. Let me show you how I set up mine.

## Understanding the PGP File

The Program Parameters file (`acad.pgp`) is a plain text file that maps abbreviations to commands. Each line follows this format:

```
ALIAS, *COMMAND
```

For example:

```
L, *LINE
C, *CIRCLE
CO, *COPY
```

The alias is case-insensitive. The asterisk (`*`) before the command name is required. Everything after `*` is treated as the command string sent to the AutoCAD command line.

### Locating the PGP File

The PGP file location varies by AutoCAD version and user profile:

```
%APPDATA%\Autodesk\AutoCAD 2026\R24.0\409\Support\acad.pgp
```

The `409` segment is the locale code for English (US). For other locales, replace with the appropriate code (407 for German, 40C for French, 411 for Japanese).

To find the exact path on your system, type in AutoCAD:

```
(findfile "acad.pgp")
```

This returns the full path to the active PGP file.

### Editing the PGP File Within AutoCAD

AutoCAD provides a built-in editor for the PGP file:

```
ALIASEDIT
```

This opens the PGP file in your default text editor. After saving changes, run:

```
REINIT
```

Check "PGP File" in the Re-initialization dialog and click OK. This reloads the PGP file without restarting AutoCAD.

Alternatively, type:

```
EXPRRESSPGP
```

This command (available in AutoCAD 2024+) directly reloads the PGP file without the Re-init dialog.

## Adding Custom Command Aliases

### Basic Aliases

Add these lines to your `acad.pgp` for common drafting commands that lack default aliases:

```
; === Custom Drafting Aliases ===
DL, *DATALINK
DV, *DATAVIEW
FL, *FILTER
MA, *MATCHPROP
OP, *OPTIONS
PU, *PURGE
RC, *RECOVER
SE, *SELECT
TC, *TOOLPALETTES
XR, *XREF
```

### Aliases for Express Tools

Express Tools are not aliased by default. Add shortcuts for the ones you use frequently:

```
; === Express Tool Aliases ===
BC, *BLOCKTOXREF
FF, *FLATTEN
GS, *GATETEXT
MS, *MSTRETCH
NC, *NCOPY
TC2, *TCASE
WE, *WIPEOUT
XL, *XLIST
```

### Aliases with Command Options

You can include command-line options in the alias by appending them after the command name:

```
; === Aliases with Options ===
A1, *AUDIT Y
PLW, *PLINEWID
ZD, *ZOOM D
ZE, *ZOOM E
ZP, *ZOOM P
```

The alias `A1` runs `AUDIT` and automatically answers `Y` to the "Fix errors?" prompt. `ZE` zooms to extents, `ZP` zooms to the previous view.

### Aliases for LISP Commands

If you have custom AutoLISP commands defined in your `acaddoc.lsp` or `.mnl` files, you can alias them:

```
; === Custom LISP Aliases ===
FFX, *FIXXREFS
NPS, *NEWPROJECTSETUP
RCC, *RECYCLECLEAN
```

Note that the LISP command must be defined with `C:` prefix in the LISP file (e.g., `(defun c:FIXXREFS ...)`), but the alias references only the command name without the `C:` prefix.

## Migrating from Other CAD Software

If you are transitioning from another CAD platform, mapping familiar aliases reduces the learning curve significantly.

### From MicroStation

```
; === MicroStation Aliases ===
F, *FENCE
PL, *PLACE
AC, *ARC
EL, *ELLIPSE
TC, *TEXT
```

### From SolidWorks

```
; === SolidWorks Aliases ===
DR, *DIMRADIUS
DD, *DIMDIAMETER
DA, *DIMANGULAR
DL2, *DIMLINEAR
```

### From BricsCAD

BricsCAD shares the DWG format and many commands with AutoCAD, so most aliases transfer directly. However, BricsCAD-specific commands like `QUAD` and `DRAGGEN` need custom LISP definitions to work in AutoCAD.

## Distributing Custom Aliases Across a Team

For teams working on the same project standards, a shared PGP file ensures everyone uses the same shortcuts.

### Network Deployment

1. Create a master `acad.pgp` file on a network share (e.g., `\\server\cad-standards\acad.pgp`).
2. On each workstation, add the network path to the Support File Search Path:
   ```
   OPTIONS > Files tab > Support File Search Path > Add
   ```
   Add: `\\server\cad-standards`

3. Remove the local `acad.pgp` from the user's support path, or rename it to `acad.pgp.bak` so AutoCAD finds the network version first.

### Deployment via Script

For large-scale deployment, use a login script to copy the master PGP file to each user's support directory:

```bat
@echo off
copy "\\server\cad-standards\acad.pgp" "%APPDATA%\Autodesk\AutoCAD 2026\R24.0\409\Support\acad.pgp" /Y
```

Add this to the user's logon script in Active Directory Group Policy.

### Merging PGP Files

If users have personal aliases that should coexist with the team standard, use the `MERGEPGP` command (available via the Express Tools):

```
MERGEPGP
```

This command prompts you to select a secondary PGP file and merges its entries into the active PGP file, skipping duplicates.

## Troubleshooting Alias Conflicts

### Alias Not Working

If typing an alias does nothing or executes the wrong command:

1. **Check for duplicates**: Search the PGP file for the same alias defined twice. The last definition wins.
2. **Check for LISP conflicts**: A LISP command defined with `C:ALIAS` takes priority over a PGP alias with the same name. Search your `.lsp` files for `(defun c:L` or similar.
3. **Check the Support File Search Path**: If multiple `acad.pgp` files exist in different support paths, AutoCAD uses the first one found. Type `(findfile "acad.pgp")` to confirm which file is active.
4. **Reload the PGP file**: Run `REINIT` and check "PGP File."

### Alias Executes Ribbon Command Instead

In AutoCAD 2024+, the ribbon interface can intercept command input. If typing an alias opens a ribbon panel instead of executing the command:

1. Type `INPUTSEARCHOPTIONS` in the command line.
2. Set `INPUTSEARCHDELAY` to `500` (milliseconds).
3. Uncheck "Search content at cursor."
4. Set `INPUTSEARCHOPTIONS` to `0` to disable the search-as-you-type feature entirely.

This prevents the ribbon from intercepting short abbreviations before they reach the command line.

### Alias Works in One Drawing but Not Another

If an alias works in some drawings but not others, the drawing may have a custom LISP file loaded via its `.mnl` companion file that overrides the alias. Check for `.mnl` files in the same directory as the drawing.

## Best Practices for Alias Design

1. **Keep aliases to 1-3 characters**: Longer aliases defeat the purpose of speed. If you need 4+ characters, the command is not used frequently enough to warrant an alias.
2. **Avoid conflicting with existing defaults**: Before adding an alias, test it in a clean AutoCAD session to ensure it does not override a default you rely on.
3. **Document your custom aliases**: Add a comment block at the top of your PGP file listing all custom additions with their purpose:
   ```
   ; === Custom Aliases Added 2026-06-25 ===
   ; A1  - AUDIT with auto-yes
   ; ZE  - Zoom Extents
   ; ZP  - Zoom Previous
   ; FF  - Flatten (Express Tool)
   ```
4. **Back up before editing**: Always copy `acad.pgp` to `acad.pgp.bak` before making changes. A syntax error in the PGP file can prevent all aliases from loading.
5. **Test after deployment**: After distributing a new PGP file, have one user on each team test their critical aliases before rolling out company-wide.
