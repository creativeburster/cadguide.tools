---
title: "ARES Commander Crash on Launch from OpenGL Graphics Driver, LISP DCL load_dialog Failure, DWG Background Image Crash on Open, TTR TTT Circle Creation Unsupported via Script, and LISP Korean Language Parameter Processing Failure: OpenGL Profile Switch, FLISP Editor, Empty Row Fix, and Language Workarounds"
excerpt: "ARES Commander fails for 5 distinct reasons: crash on launch from outdated OpenGL graphics drivers requiring OPENGLPROFILE command or /glprofile angle switch, LISP DCL files not loading with load_dialog function requiring 2024 update fix, DWG crash from missing background image requiring image path verification, TTR TTT circle creation unsupported via Script or LISP requiring manual creation, and LISP command parameter processing failure in Korean language requiring 2025 update fix. We cover each with fixes from Graebert Help Center."
category: "troubleshooting"
softwareSlug: "ares-commander"
keyword: "ARES Commander crash launch OpenGL graphics driver OPENGLPROFILE glprofile angle LISP DCL load_dialog DWG background image crash TTR TTT circle script LISP Korean language parameter processing FLISP editor"
slug: "ares-commander-crash-launch-opengl-graphics-driver-lisp-dcl-load-dialog-dwg-background-image-crash-ttr-ttt-circle-script-korean-language-parameter-flisp-editor"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://help.graebert.com/en/articles/6202248-troubleshooting-crash-on-start-launch-ares-commander-2022-and-newer-versions"
  - "https://help.graebert.com/en/articles/9260031-ares-commander-2025-release-notes"
  - "https://help.graebert.com/en/articles/7903865-ares-commander-2024-release-notes"
---

# ARES Commander Crash on Launch from OpenGL Graphics Driver, LISP DCL load_dialog Failure, DWG Background Image Crash on Open, TTR TTT Circle Creation Unsupported via Script, and LISP Korean Language Parameter Processing Failure: OpenGL Profile Switch, FLISP Editor, Empty Row Fix, and Language Workarounds

ARES Commander produces errors from OpenGL graphics issues, LISP DCL failures, DWG background image crashes, script limitations, and language-specific LISP problems. This guide covers the 5 most common ARES Commander problems with diagnostic steps and community-verified fixes from the Graebert Help Center.

## 1. Crash on Launch from Outdated OpenGL Graphics Driver

### Symptom

ARES Commander 2022 and newer versions won't launch. The application crashes immediately on startup or shows a blank window. The crash may occur after a graphics driver update, Windows update, or ARES Commander update. Some users see a brief flash of the splash screen before the crash. The issue may affect only specific machines with certain graphics configurations.

### Root Cause

"Some configurations/setups may result in graphics problems when using ARES Commander, usually due to 'old' (Display) device drivers or dated components of the OS. Under certain scenarios, can cause extreme results, like being unable to launch the application." ARES Commander uses OpenGL for rendering. Outdated or incompatible graphics drivers don't support the required OpenGL version, causing the application to crash during graphics initialization. The default OpenGL profile may not be compatible with the system's graphics configuration.

### Fix

1. **Update graphics drivers**:
   - "Make sure your Display device driver is updated"
   - "We recommend that you download the driver directly from the device manufacturer's website"
   - Download from NVIDIA, AMD, or Intel directly
   - Not from Windows Update

2. **Update the operating system**:
   - "Make sure your OS is updated"
   - "Check the Historic of updates for Failed or Pending updates"
   - "And repeat the action as appropriate"
   - Install all pending Windows updates

3. **Try a different OpenGL profile**:
   - "You can try to 'force' the application to start under a different OpenGL profile"
   - "Using the OPENGLPROFILE command"
   - If the application can't launch at all
   - Use the desktop shortcut method below

4. **Add /glprofile angle to shortcut**:
   - "Select the ARES Commander desktop shortcut, and press mouse-right click"
   - "Select 'Properties'"
   - "Go to the 'Shortcut' tab"
   - "In the 'Target' field, add /glprofile angle after ARESC-exe"
   - "Click OK. Launch ARES Commander via the edited shortcut"

5. **Try compatibility OpenGL profile**:
   - "If the application does not start with the recommended core OpenGL profile"
   - "You can try the start parameter compatibility"
   - Add `/glprofile compatibility` to the shortcut target
   - This uses a more compatible but slower OpenGL profile

6. **Check system requirements**:
   - "Make sure that your Computer meets (ideally exceeds) the application's System Requirements"
   - Check the Graebert Help Center for system requirements
   - Ensure adequate RAM and graphics memory
   - For your ARES Commander version

7. **Use integrated graphics as fallback**:
   - If the discrete GPU causes the crash
   - Try launching with integrated graphics
   - Set in Windows Graphics Settings
   - Or in the graphics card control panel

### Community Report

> "Some configurations/setups may result in graphics problems when using ARES Commander, usually due to 'old' (Display) device drivers or dated components of the OS. Under certain scenarios, can cause extreme results, like being unable to launch the application. Select the ARES Commander desktop shortcut, Properties, Shortcut tab, in the Target field add /glprofile angle after ARESC-exe. If the application does not start with the recommended core OpenGL profile, you can try the start parameter compatibility."

## 2. LISP DCL Files Not Loading with load_dialog Function

### Symptom

LISP routines that use dialog boxes (DCL files) fail in ARES Commander. The `load_dialog` function returns an error or fails to load the DCL file. The same LISP routine works in AutoCAD. The error may be "Error preventing the loading of .dcl files with the LISP load_dialog function." The DCL file exists and is in the correct path.

### Root Cause

"Address the error preventing the loading of .dcl files with the LISP load_dialog function." ARES Commander's LISP engine had a bug in the `load_dialog` function that prevented DCL files from being loaded. The function didn't properly resolve file paths or had an incompatibility with the DCL file format. This was fixed in ARES Commander 2024.

### Fix

1. **Update to ARES Commander 2024 or later**:
   - "Address the error preventing the loading of .dcl files with the LISP load_dialog function"
   - This fix is included in ARES Commander 2024
   - Update to the latest version
   - To resolve the DCL loading issue

2. **Use absolute paths for DCL files**:
   - Instead of relative paths
   - Use full absolute paths in `load_dialog`
   - `(load_dialog "C:/path/to/dialog.dcl")`
   - This may work around path resolution issues

3. **Check DCL file format**:
   - Ensure the DCL file uses standard syntax
   - That is compatible with both AutoCAD and ARES Commander
   - Avoid AutoCAD-specific DCL features
   - That may not be supported

4. **Use the FLISP Editor for debugging**:
   - "Debugging LISP programs can sometimes be challenging"
   - "This new LISP Editor is a Visual Studio Code extension"
   - "That enables you to easily edit and debug your code"
   - "If there is an issue, the debugger will show you where your code is breaking"

5. **Load DCL files manually**:
   - If `load_dialog` fails
   - Try loading the DCL content manually
   - Or use a different dialog approach
   - Such as command-line input instead of dialogs

6. **Check file permissions**:
   - Ensure the DCL file has read permissions
   - For the ARES Commander process
   - Permission issues can cause load_dialog to fail
   - Without a clear error message

7. **Report persistent DCL issues**:
   - If the issue persists after updating
   - Report to Graebert support
   - Provide the LISP routine and DCL file
   - They can diagnose the specific compatibility issue

### Community Report

> "Address the error preventing the loading of .dcl files with the LISP load_dialog function. Fix the Lisp error occurring when creating arc with a small radius. Debugging LISP programs can sometimes be challenging. This new LISP Editor is a Visual Studio Code extension that enables you to easily edit and debug your code."

## 3. DWG Background Image Crash on Open

### Symptom

Opening a DWG file that references a missing background image causes ARES Commander to crash. The crash occurs during file opening, before the drawing is displayed. The DWG file may have worked previously when the background image was available. The crash is immediate and doesn't produce an error message.

### Root Cause

"The application is unable to locate the view's background image from same folder than current DWG. Opening a DWG file with a missing background image causes ARES Commander to crash." ARES Commander tries to load background images referenced in the DWG file during the opening process. If the background image file is missing or the path is incorrect, the image loading code encounters a null reference, causing the application to crash. The crash occurs before error handling can intercept the missing file.

### Fix

1. **Restore the missing background image**:
   - "The application is unable to locate the view's background image"
   - "From same folder than current DWG"
   - Find the missing image file
   - Place it in the same folder as the DWG file

2. **Check image path in the DWG**:
   - If the image was moved
   - Update the image path in the DWG file
   - Use the IMAGE command (if accessible)
   - To re-path the background image

3. **Open the DWG on a machine with the image**:
   - If you have access to a machine
   - Where the background image is available
   - Open the DWG there
   - Remove the background image reference

4. **Use DWG recovery tools**:
   - Use AutoCAD's RECOVER command
   - Or other DWG repair tools
   - To open the file and remove the broken reference
   - Then save and open in ARES Commander

5. **Update ARES Commander**:
   - This crash issue may be fixed
   - In newer versions of ARES Commander
   - Update to the latest version
   - Which may handle missing images gracefully

6. **Remove image references before sharing**:
   - Before sharing DWG files
   - Remove background image references
   - Or embed the images in the DWG
   - To prevent crashes on other machines

7. **Use the same folder for images**:
   - Always store background images
   - In the same folder as the DWG file
   - Use relative paths instead of absolute paths
   - To prevent path issues when sharing files

### Community Report

> "The application is unable to locate the view's background image from same folder than current DWG. Opening a DWG file with a missing background image causes ARES Commander to crash. [DESKTOP-308199, DESKTOP-308203]"

## 4. TTR TTT Circle Creation Unsupported via Script or LISP

### Symptom

Creating TTR (Tangent, Tangent, Radius) or TTT (Tangent, Tangent, Tangent) circles through Script or LISP is not possible in ARES Commander. Specifying different tangents with a script is also unsupported. The same script or LISP routine works in AutoCAD. Manual creation via the UI works fine.

### Root Cause

"Creating TTR/TTT circles through Script or LISP is not possible, and specifying different tangents with a script is also unsupported." The TTR and TTT circle creation commands in ARES Commander don't support programmatic access through Script or LISP. The tangent calculation requires interactive input that the script/LISP interface can't provide. This is a limitation of the ARES Commander API, not a bug.

### Fix

1. **Create TTR/TTT circles manually**:
   - "Creating TTR/TTT circles through Script or LISP is not possible"
   - Use the UI command to create these circles
   - Manually select the tangent objects and enter the radius
   - This is the only supported method

2. **Calculate tangent points in LISP**:
   - Instead of using the TTR/TTT command
   - Calculate the tangent points mathematically in LISP
   - Then create the circle using the center and radius
   - Using `(entmake)` with calculated values

3. **Use alternative circle creation**:
   - Instead of tangent-tangent-radius
   - Calculate the circle center manually
   - Use the center-radius or center-diameter method
   - With calculated values

4. **Update ARES Commander**:
   - Check if newer versions support
   - TTR/TTT circles via Script or LISP
   - This limitation may be addressed in future updates
   - Check the release notes

5. **Use the FLISP Editor for debugging**:
   - "This new LISP Editor is a Visual Studio Code extension"
   - "That enables you to easily edit and debug your code"
   - Use the FLISP editor to develop
   - Alternative approaches to tangent circle creation

6. **Report the limitation to Graebert**:
   - If TTR/TTT via LISP is critical for your workflow
   - Report the limitation to Graebert support
   - Request API support for these commands
   - In future versions

7. **Use a hybrid approach**:
   - Use LISP for everything except TTR/TTT
   - Then use the UI for TTR/TTT circles
   - Combine automated and manual steps
   - In your workflow

### Community Report

> "Creating TTR/TTT circles through Script or LISP is not possible, and specifying different tangents with a script is also unsupported. [DESKTOP-94046]"

## 5. LISP Korean Language Parameter Processing Failure

### Symptom

Some LISP routines fail in ARES Commander when using the Korean language version. Commands do not process parameters correctly in Korean. The same routines work in English or other language versions. The error may occur when LISP commands receive Korean-language input or parameters.

### Root Cause

"Some LISP routines fail as commands do not process parameters in the Korean language as expected." ARES Commander's LISP engine has a language-specific bug in the Korean language version. Command parameter processing doesn't correctly handle Korean-language input, causing LISP routines to fail. This is likely a character encoding or locale-specific issue in the LISP interpreter.

### Fix

1. **Update to ARES Commander 2025 or later**:
   - "Some LISP routines fail as commands do not process parameters in the Korean language as expected"
   - This issue is listed in the 2025 release notes
   - Check if the fix is included in the latest update
   - Update to the newest version

2. **Switch to English language**:
   - If the fix is not yet available
   - Switch ARES Commander to English language
   - As a workaround
   - The LISP routines should work in English

3. **Use English command names in LISP**:
   - In LISP routines, use the underscore prefix
   - For command names: `(command "_.CIRCLE" ...)`
   - This forces English command names
   - Regardless of the UI language

4. **Check character encoding**:
   - Ensure LISP files are saved in UTF-8
   - Or the appropriate Korean encoding
   - Encoding mismatches can cause parameter processing failures
   - Especially for Korean characters

5. **Use the FLISP Editor for debugging**:
   - "This new LISP Editor is a Visual Studio Code extension"
   - "That enables you to easily edit and debug your code"
   - "If there is an issue, the debugger will show you where your code is breaking"
   - Use it to identify the exact failure point

6. **Report the issue to Graebert**:
   - If the issue persists after updating
   - Report to Graebert support
   - Provide the LISP routine and Korean input
   - That causes the failure

7. **Avoid Korean characters in parameters**:
   - If possible, use English or numeric parameters
   - In LISP routines
   - Avoid Korean characters in command parameters
   - Until the fix is available

### Community Report

> "Some LISP routines fail as commands do not process parameters in the Korean language as expected. [DESKTOP-94259] Creating TTR/TTT circles through Script or LISP is not possible, and specifying different tangents with a script is also unsupported. [DESKTOP-94046]"

## 6. Additional ARES Commander Issues

### Zoom Crash After Attaching DWG

**Issue**: "Resolved a crash issue occurring when zooming after attaching a particular DWG."
**Fix**: Update to ARES Commander 2024 or later. The fix addresses a crash that occurs when zooming after attaching an external DWG reference.

### LISP Arc Creation Error with Small Radius

**Issue**: "Fix the Lisp error occurring when creating arc with a small radius."
**Fix**: Update to ARES Commander 2024 or later. The fix handles arc creation with very small radii in LISP routines.

### LISP Visual LISP Reactor Issues

**Issue**: "LISP: Visual LISP reactor was not working properly."
**Fix**: Update to the latest ARES Commander version. Visual LISP reactors (vlr- functions) have been fixed in recent updates. Check the release history for the specific fix.

### LISP vl-exit-with-value Function

**Issue**: "LISP: vl-exit-with-value function didn't work properly."
**Fix**: Update to the latest ARES Commander version. The `vl-exit-with-value` function has been fixed in recent updates.

### LISP entmod Hang with OLE Objects

**Issue**: "LISP entmod function hang issue with OLE objects fixed."
**Fix**: Update to the latest ARES Commander version. The `entmod` function no longer hangs when modifying OLE objects.

### LISP Loop Rotate Hang

**Issue**: "LISP: The application hangs, when repeating the loop to rotate an entity."
**Fix**: Update to the latest ARES Commander version. The hang issue in rotate loops has been fixed.

### LISP Command Execution Error with Dimension Text

**Issue**: "LISP: Command execution error occurred, when '()' was included in dimension text of LINEARDIMENSION (DIMLINEAR)."
**Fix**: Update to the latest ARES Commander version. The command execution error with parentheses in dimension text has been fixed.

### Performance Improvements

**Issue**: ARES Commander performance improvements in 2024.
**Fix**: "Select can be for example 50% faster than before, Copy & Paste 25% faster, and Undo can in some cases be as much as 8x faster." Update to ARES Commander 2024 or later for significant performance improvements.

### PDF to DWG Conversion on Mobile

**Issue**: "In addition to DWG, you can now open PDF files with ARES Touch on Android and iOS."
**Fix**: "The PDF files can not only be viewed, but also converted to DWG with the new PDF Import feature." Use ARES Touch on mobile devices for PDF to DWG conversion.

## Best Practices

1. **Update graphics drivers from manufacturer** — prevents OpenGL crash on launch
2. **Use /glprofile angle shortcut switch** — fixes crash when default OpenGL profile fails
3. **Update to ARES Commander 2024+ for DCL fix** — resolves load_dialog failure
4. **Store background images in same folder as DWG** — prevents crash on open
5. **Create TTR/TTT circles manually** — not supported via Script or LISP
6. **Use English command names in LISP** — prevents Korean language parameter issues
7. **Use FLISP Editor for debugging** — Visual Studio Code extension for LISP debugging
8. **Keep ARES Commander updated** — many LISP fixes in recent releases
9. **Use absolute paths for DCL files** — workaround for path resolution issues
10. **Remove background image references before sharing** — prevents crashes on other machines
