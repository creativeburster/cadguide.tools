---
title: "Siemens NX 2506 Licensing Shared Library Failed to Load from Anti-Virus Quarantining salt_clt.dll, run_journal Failed to Initialize UFUN 948822 from Missing SPLM_LICENSE_SERVER Environment Variable, License Error Cannot Connect to License Server from Wrong Port or Stopped Service, Journal Execution Error from Undefined Object Reference in Custom Macros, and Structure Designer License Not Available from Bundle Configuration Issues: Anti-Virus Exclusion, Environment Variable Set, License Server Verification, Object Reference Debug, and Bundle Update"
excerpt: "Siemens NX fails for 5 distinct reasons: licensing shared library failed to load from anti-virus quarantining salt_clt.dll requiring anti-virus exclusion, run_journal failed to initialize UFUN 948822 from missing SPLM_LICENSE_SERVER environment variable requiring environment variable set, license error cannot connect to license server from wrong port or stopped service requiring license server verification, journal execution error from undefined object reference in custom macros requiring object reference debug, and Structure Designer license not available from bundle configuration issues requiring bundle update. We cover each with fixes from Siemens community."
category: "license-and-journal-errors"
softwareSlug: "siemens-nx"
keyword: "Siemens NX 2506 licensing shared library failed to load anti-virus quarantining salt_clt.dll run_journal failed initialize UFUN 948822 missing SPLM_LICENSE_SERVER environment variable license error cannot connect license server wrong port stopped service journal execution error undefined object reference custom macros Structure Designer license not available bundle configuration"
slug: "siemens-nx-2506-salt-clt-dll-antivirus-ufun-splm-license-server-journal-object-reference-structure-designer-bundle"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-04"
sources:
  - "https://community.sw.siemens.com/s/question/0D5Vb00000p2i6WKAQ/new-nx2506-install-the-licensing-shared-library-failed-to-load"
  - "https://community.sw.siemens.com/s/question/0D5Vb00000BB9RRKA1/runjournal-error-failed-to-initialize-ufun-948822"
  - "https://community.sw.siemens.com/s/question/0D5Vb00000WWqL3KAL/nx-license-error-cannot-connect-to-license-server-system-the-serverimgrd-has-not-been-started-yet-or-ugslicenseserver-is-set-to-the-wrong-port-host-15"
---

# Siemens NX 2506 Licensing Shared Library Failed to Load from Anti-Virus Quarantining salt_clt.dll, run_journal Failed to Initialize UFUN 948822 from Missing SPLM_LICENSE_SERVER Environment Variable, License Error Cannot Connect to License Server from Wrong Port or Stopped Service, Journal Execution Error from Undefined Object Reference in Custom Macros, and Structure Designer License Not Available from Bundle Configuration Issues: Anti-Virus Exclusion, Environment Variable Set, License Server Verification, Object Reference Debug, and Bundle Update

Siemens NX produces errors from licensing library failures, journal initialization, license server connections, journal execution, and bundle configuration. This guide covers the 5 most common Siemens NX problems with diagnostic steps and community-verified fixes from Siemens community.

## 1. Licensing Shared Library Failed to Load from Anti-Virus Quarantining salt_clt.dll

### Symptom

After a full install of NX2506, the error "The licensing shared library failed to load" appears on startup. The error occurs no matter where NX is started. The log file shows "Library not found in image directory C:\Program Files\Siemens\NX2506\NXBIN\salt_clt.dll. The specified module could not be found." The file salt_clt.dll does not exist in the NXBIN directory.

### Root Cause

"On researching this it appears that certain anti-virus applications have been known to quarantine/delete salt_clt.dll. Is there any chance you have anti-virus enabled that's affecting your install? Looks like it was the anti-virus. Datto AV to be specific." Anti-virus software (specifically Datto AV) quarantines or deletes salt_clt.dll during or after installation. The salt_clt.dll file is the Siemens Licensing Toolkit library required for NX to load its licensing system. Without this file, NX cannot initialize the licensing subsystem.

### Fix

1. **Disable anti-virus during installation**:
   - "Is there any chance you"
   - "Have anti-virus enabled"
   - "That's affecting your install?"
   - Disable AV

2. **Add NX installation folder to anti-virus exclusions**:
   - Add the NX
   - Installation directory
   - To anti-virus
   - Exclusion list

3. **Restore salt_clt.dll from quarantine**:
   - Check anti-virus
   - Quarantine for
   - salt_clt.dll and
   - Restore it

4. **Reinstall NX after disabling anti-virus**:
   - "What did work was"
   - "Hamstringing it via powershell"
   - "Stopping the AV"
   - Reinstall NX

5. **Use Siemens License Server (SLS) v4.x**:
   - "From NX 2312 onward"
   - "Use of SLS is mandatory"
   - "And the old one will not work"
   - Use SLS

6. **Verify salt_clt.dll exists after install**:
   - Check that
   - salt_clt.dll exists
   - In NXBIN
   - After install

7. **Check for other quarantined files**:
   - "Is the salt_clt.dll"
   - "The only thing you guys"
   - "Have seen get deleted"
   - "Due to antivirus?"
   - Check other files

### Community Report

> "New NX2506 install, The licensing shared library failed to load. Library not found in image directory C:\Program Files\Siemens\NX2506\NXBIN\salt_clt.dll. The specified module could not be found. On researching this it appears that certain anti-virus applications have been known to quarantine/delete salt_clt.dll. Looks like it was the anti-virus. Datto AV to be specific."

## 2. run_journal Failed to Initialize UFUN 948822 from Missing SPLM_LICENSE_SERVER Environment Variable

### Symptom

Running Python journals in batch mode via run_journal from the command line fails with "failed to initialize UFUN 948822." The journal runs fine if started through the GUI with the play button. The issue started after a recent NX software update. The error occurs with NX2306 but worked fine with NX2007.

### Root Cause

"It was indeed a license server issue. SPLM_LICENSE_SERVER must be set for run_journal to work again. What I did was: 1. Start Windows command line 2. Enter set SPLM_LICENSE_SERVER= without the quotes and the brackets." The run_journal command requires the SPLM_LICENSE_SERVER environment variable to be set. After updating from NX2007 to NX2306, the environment variable may not be properly configured. The standard command prompt doesn't have this variable, while the NX Command Prompt does.

### Fix

1. **Set SPLM_LICENSE_SERVER environment variable**:
   - "SPLM_LICENSE_SERVER"
   - "Must be set for"
   - "Run_journal to work again"
   - Set variable

2. **Use NX Command Prompt instead of standard cmd**:
   - "A best practice would be"
   - "To launch run_journal from"
   - "A NX Command prompt"
   - "Rather than a standard cmd window"
   - Use NX Command Prompt

3. **Set as Windows system environment variable**:
   - "If you set the"
   - "SPLM_LICENSE_SERVER variable"
   - "As a Windows system"
   - "Environment variable"
   - Set system variable

4. **Verify license server is running**:
   - "The variable is created"
   - "By the NX installer"
   - "To point to the"
   - "Correct server"
   - Verify server

5. **Check license server port**:
   - "29000 is the new default"
   - "But the previous default"
   - "Was 28000"
   - Check port

6. **Use correct format for variable**:
   - Format:
   - "SPLM_LICENSE_SERVER=28000@server_name"
   - Or "29000@server_name"
   - Use correct format

7. **Check for license changes between NX versions**:
   - "Licenses can change"
   - "Between NX releases"
   - "So you might use an"
   - "API method that now needs"
   - "A different license"
   - Check license changes

### Community Report

> "run_journal error: failed to initialize UFUN 948822. It was indeed a license server issue. SPLM_LICENSE_SERVER must be set for run_journal to work again. A best practice would be to launch run_journal from a NX Command prompt, rather than a standard cmd window. This should ensure that all necessary environment variables are defined correctly. If you set the SPLM_LICENSE_SERVER variable as a Windows system environment variable, you do not need to set it in any script."

## 3. License Error Cannot Connect to License Server from Wrong Port or Stopped Service

### Symptom

The error "Cannot connect to license server system. The server (lmgrd) has not been started yet, or UGS_LICENSE_SERVER is set to the wrong port@host. [-15]" appears. NX was working after installation but the next day the error occurred. Reinstalling didn't fix the issue.

### Root Cause

"The message describes the 2 most common issues to look at: 1) Is the License Service started and running? 2) Is the SERVER variable pointing to the right name and port number used as your license server? E.g. SPLM_LICENSE_SERVER = 29000@my_server_name. The first number is the port. 29000 is the new default, but the previous default was 28000." Two causes: (1) The license service (lmgrd) is not running on the server. (2) The SPLM_LICENSE_SERVER environment variable points to the wrong port or host name. The port number changed from 28000 (old default) to 29000 (new default).

### Fix

1. **Check if license service is running**:
   - "Is the License Service"
   - "Started and running?"
   - Check service
   - Status

2. **Verify SPLM_LICENSE_SERVER port and host**:
   - "Is the SERVER variable"
   - "Pointing to the right name"
   - "And port number"
   - Verify variable

3. **Use correct port number**:
   - "29000 is the new default"
   - "But the previous default"
   - "Was 28000"
   - Use correct port

4. **Check license server status with lmutil**:
   - "lmutil lmstat -a -c port@license_host"
   - "If the license server is up"
   - "You will see: license UP v11.19.5"
   - Use lmutil

5. **Use Siemens License Server (SLS) for NX 2312+**:
   - "If you are running NX 2312"
   - "Or newer, you must use"
   - "The newer Siemens License Server (SLS)"
   - Use SLS

6. **Start license service**:
   - "If it's on your own machine"
   - "But if this is just a"
   - "1 user, or Node Locked license"
   - "There is no need to run"
   - "It as a Service"
   - Start service

7. **Check with IT for network licenses**:
   - "This might be somewhere"
   - "In your network so IT"
   - "May need to do it"
   - Contact IT

### Community Report

> "NX License Error: Cannot connect to license server system. The server (lmgrd) has not been started yet, or UGS_LICENSE_SERVER is set to the wrong port@host. [-15]. The message describes the 2 most common issues: 1) Is the License Service started and running? 2) Is the SERVER variable pointing to the right name and port number? 29000 is the new default, but the previous default was 28000."

## 4. Journal Execution Error from Undefined Object Reference in Custom Macros

### Symptom

A journal execution error occurs when running custom macros. The error appears at specific lines in the code. The error may not appear on the first run but appears on subsequent runs. The error references NXJournalsXXXXX files and journal0.vb that don't exist.

### Root Cause

"Ignore the NXJournalsXXX\journal0.vb file name that is not directly relevant to the issue. NX takes the original journal code and copies/compiles it before it is run. You need to find the original journal code that is being run and start by inspecting line 130. Errors beget more errors, 1/2 the battle is finding the original error. In your case, it looks like mySelectedObject does not refer to anything." The NXJournals files are temporary compilation files and not the actual issue. The real error is in the original journal code where a variable (e.g., mySelectedObject) doesn't have a valid reference. The first error triggers subsequent errors that mask the original issue.

### Fix

1. **Find the original journal code**:
   - "NX takes the original"
   - "Journal code and copies/compiles"
   - "It before it is run"
   - Find original code

2. **Inspect the line mentioned in error**:
   - "Start by inspecting line 130"
   - "Specifically, what arguments"
   - "Are you passing"
   - Inspect error line

3. **Add logging to identify the issue**:
   - "I suggest adding a few lines"
   - "Of code to log what"
   - "The current work part is"
   - Add logging

4. **Check for undefined object references**:
   - "MySelectedObject does not"
   - "Refer to anything"
   - Check object
   - References

5. **Find the original error**:
   - "Errors beget more errors"
   - "1/2 the battle is finding"
   - "The original error"
   - Find original

6. **Check variable declaration and assignment**:
   - "Track down where"
   - "mySelectedObject is defined"
   - "And why it has"
   - "No valid reference"
   - Check variables

7. **Add echo to verify object state**:
   - "Echo mySelectedObject is nothing:"
   - "A true response will tell you"
   - "That mySelectedObject doesn't"
   - "Refer to anything"
   - Add echo

### Community Report

> "Where do I start to troubleshoot this Journal Execution Error. Ignore the NXJournalsXXX\journal0.vb file name that is not directly relevant to the issue. NX takes the original journal code and copies/compiles it before it is run. You need to find the original journal code. Errors beget more errors, 1/2 the battle is finding the original error. In your case, it looks like mySelectedObject does not refer to anything."

## 5. Structure Designer License Not Available from Bundle Configuration Issues

### Symptom

Within the Design group, clicking More and then Structure Designer results in a "license not available" message. In version 2412 this option was called Structure Manager. The log file shows the feature is included in the current license. Similar "License not found" errors appear for NX Sheet Metal, Studio Visualize, Vehicle Design Automation, and Vehicle Design and Validation.

### Root Cause

"An initial guess is that your admin had not updated your license file. Second guess is something is wrong with the Bundle settings (e.g. to run NX you need both ACD10 and ACD11 set since there are so many features in the Academic product - too many for 1 bundle). I have heard cases where this causes issues." The bundle configuration doesn't include the correct bundle assignments for Structure Designer and other modules. The license file may need updating, or the bundle settings need to include both ACD10 and ACD11 bundles for the Academic product which has too many features for a single bundle.

### Fix

1. **Contact software licensing admin**:
   - "Your software licensing admin"
   - "Has reached out to Siemens"
   - "About this issue"
   - Contact admin

2. **Update license file**:
   - "May need an updated"
   - "License file"
   - Update license

3. **Check Bundle settings**:
   - "Something is wrong"
   - "With the Bundle settings"
   - Check bundles

4. **Set both ACD10 and ACD11 bundles**:
   - "To run NX you need"
   - "Both ACD10 and ACD11 set"
   - "Since there are so many features"
   - "In the Academic product"
   - Set both bundles

5. **Verify Structure Designer license in log**:
   - "The log file shows"
   - "That the feature is included"
   - "In the current license"
   - Verify log

6. **Check for license count fluctuations**:
   - "Licenses assigned briefly"
   - "Went from 5 down to 1"
   - "Then to 5"
   - Check fluctuations

7. **Don't change bundles mid-session**:
   - "Maybe you trying to change"
   - "Bundles in mid-session"
   - "But that should not be needed"
   - Don't change mid-session

### Community Report

> "Within the Design group, click on More and then click Structure Designer to receive a license not available message. In version 2412 this option is called Structure Manager. We are also receiving License not found errors for modules such as NX Sheet Metal, Studio Visualize, Vehicle Design Automation, and Vehicle Design and Validation. An initial guess is that your admin had not updated your license file. Second guess is something is wrong with the Bundle settings."

## 6. Additional Siemens NX Issues

### Old Siemens PL License Server Incompatibility

**Issue**: "Prior to NX 2312, you could use either the old Siemens PL License Server (last release was v11.x from 2019) or the new Siemens License Server (SLS). From NX 2312 onward, use of SLS is mandatory."
**Fix**: Update to SLS v4.x. Don't use old PL License Server. Check SLS version.

### Python COM API Enumeration Error

**Issue**: "Python scripts accessing the API via COM (comtypes library) failed to run due to misnamed eHingeDistributionType enumeration values."
**Fix**: Use .NET (pythonnet library). Check enumeration values. Update NX version.

### Cross-Product API Exception

**Issue**: "The cross-product API versions 2.0 and 2.1 caused an exception when used to interact with any version of SAP2000/CSiBridge."
**Fix**: Use API version 2.2. Don't use cross-product API with older versions. Check API compatibility.

### Temporary Folder Cleanup

**Issue**: "The temporary folder is not suited for files that are needed, the administrators can activate a cleanup of it through group policies."
**Fix**: Don't store important files in temp folder. Check group policy cleanup. Use proper folder.

### Journal Identifier for Linked Bodies

**Issue**: "I'm not sure that journal identifiers can be used to find occurrence or linked bodies, I'd be a bit surprised if this works as intended."
**Fix**: Don't use journal identifiers for linked bodies. Use alternative methods. Check identifier scope.

### License File Path Missing

**Issue**: "I can't find or don't have c:\full_path_to_my_folder\my_license_file.lic of SPLM_LICENSE_SERVER."
**Fix**: Check license file path. Verify file exists. Contact admin for license file location.

### Anti-Virus Deleting Other Files

**Issue**: "Is the salt_clt.dll the only thing you guys have seen get deleted due to antivirus?"
**Fix**: Check for other quarantined files. Add all NX files to exclusions. Monitor anti-virus logs.

### NX Command Prompt Best Practice

**Issue**: "A best practice would be to launch run_journal from a NX Command prompt, rather than a standard cmd window."
**Fix**: Always use NX Command Prompt. Check environment variables. Verify all variables defined.

### License Bundle Count Issues

**Issue**: "Licenses assigned briefly went from 5 down to 1 then to 5. Maybe you trying to change bundles in mid-session."
**Fix**: Don't change bundles mid-session. Set all bundles before session start. Verify bundle count.

### SYSLOG for License Diagnosis

**Issue**: "Not see any messages in it about SD (or any) being denied. The only odd thing I noticed is that licenses assigned briefly went from 5 down to 1."
**Fix**: Check SYSLOG for license denials. Monitor license count. Verify bundle assignments.

## Best Practices

1. **Disable anti-virus during NX installation or add exclusions** — prevents salt_clt.dll quarantine
2. **Use NX Command Prompt for run_journal** — ensures all environment variables are defined
3. **Set SPLM_LICENSE_SERVER as Windows system environment variable** — persists across restarts
4. **Verify license server port (29000 new default, 28000 old)** — prevents connection errors
5. **Use Siemens License Server (SLS) v4.x for NX 2312+** — old PL License Server is incompatible
6. **Find the original error in journal execution** — subsequent errors mask the root cause
7. **Add logging to journal code for debugging** — log current work part and function arguments
8. **Set both ACD10 and ACD11 bundles for Academic product** — too many features for one bundle
9. **Don't change license bundles mid-session** — can cause license availability issues
10. **Check SYSLOG for license denial messages** — helps diagnose license availability issues
