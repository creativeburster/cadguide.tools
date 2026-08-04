---
title: "Tekla Tedds Add-In Disabled Error 287, Word Instance Failed Error"
excerpt: "Tekla Tedds Add-In Disabled Error 287, Word Instance Failed Error: symptoms, root causes, and step-by-step fixes, verified against Trimble User Assistance."
category: "troubleshooting"
softwareSlug: "tekla-tedds"
keyword: "Tekla Tedds add-in disabled error 287 Word Options disabled items failed to get active instance of Word 32-bit 64-bit Office upgrade VBL variable file out of sync manual deletion recalculation Library Access System memory errors clipboard fatal calculation system resource exhaustion"
slug: "tekla-tedds-add-in-disabled-error-287-word-instance-failed-error"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-08-03"
sources:
  - "https://support.tekla.com/article/how-do-i-resolve-tedds-add-in-disabled-and-or-teddsadd-in-error-287-in-tedds-for-word"
  - "https://support.tekla.com/article/i-cannot-calculate-within-tedds-the-error-message-failed-to-get-the-active-instance-of-word"
  - "https://support.tekla.com/doc/tekla-tedds/2025/ref_errormessages"
---

# Tekla Tedds Add-In Disabled Error 287, Word Instance Failed Error, VBL Variable File Out of Sync, Library Access System Memory Errors, and Calculation Fatal Error: Word Add-In Re-enable, Office Reinstall, VBL File Deletion and Recalculation, and Memory Management

Tekla Tedds' Word integration, calculation engine, variable file synchronization, library access, and system resource handling produce errors from disabled add-ins, Office version mismatches, VBL file desync, memory exhaustion, and disk space issues. This guide covers the 5 most common Tekla Tedds problems with diagnostic steps and community-verified fixes from Trimble User Assistance.

## 1. Tedds Add-In Disabled and Error 287 in Word

### Symptom

When running Tedds for Word, a message appears stating "The Tekla Tedds Add-in is disabled" and/or "Tedds Add-In Error (287)." The pop-up states: "Error (-2147467259): This add-in is installed for all users on this computer and can only be connected or disconnected by an administrator." Tedds functionality is missing from Word.

### Root Cause

"Word has disabled the Tedds for Word Add-In that adds the Tedds functionality to Word. This can happen occasionally if Word encounters a problem or crashes when Tedds is loaded." When Word crashes or encounters an error while the Tedds add-in is loaded, it automatically disables the add-in to prevent future crashes. The add-in is installed for all users, so it requires administrator privileges to re-enable. The error code 287 indicates a COM add-in connection failure.

### Fix

1. **Re-enable the add-in in Word Options**:
   - "Run Microsoft Word on its own"
   - "Open Word Options (File > Options)"
   - "Select the Add-ins page"
   - "Select 'Disabled Items' from the Manage options at the bottom"
   - "Enable anything listed as disabled to do with Tedds"
   - "OK and close Microsoft Word"
   - "Now try launching Tedds for Word"

2. **Run Word as administrator**:
   - The add-in "can only be connected or disconnected by an administrator"
   - Right-click Word > Run as administrator
   - Then follow the re-enable steps above
   - Close Word and relaunch normally

3. **Check COM add-ins**:
   - In Word Options > Add-ins
   - Also check "COM Add-ins" in the Manage dropdown
   - Enable the Tedds COM add-in if disabled
   - Restart Word

4. **Prevent future disabling**:
   - Don't force-close Word while Tedds is running
   - Allow Tedds calculations to complete before closing
   - Keep Office updated
   - Keep Tedds updated

5. **Reinstall Tedds if add-in is missing**:
   - If the add-in doesn't appear in the list at all
   - Reinstall Tekla Tedds
   - This re-registers the add-in
   - Restart Word after installation

6. **Check registry for add-in registration**:
   - Check `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Office\Word\Addins\Tedds`
   - Verify the LoadBehavior value is 3 (auto load)
   - If set to 2 (disabled), change to 3
   - Restart Word

### Community Report

> "When I run Tedds for Word, I get a message that the Tekla Tedds Add-in is disabled and/or 'Tedds Add-In Error'. The problem is that Word has disabled the Tedds for Word Add-In that adds the Tedds functionality to Word. This can happen occasionally if Word encounters a problem or crashes when Tedds is loaded. Select 'Disabled Items' from the Manage options and enable anything listed as disabled to do with Tedds."

## 2. Failed to Get Active Instance of Word from Office Upgrade

### Symptom

When running any calculation command in Tedds, an error prevents calculating. Errors include: "Failed to get the active instance of Word. Click on a document in Word, then try this operation again," "An error has occurred whilst calculating, the document cannot be updated," and "Failed to create new Calc Section (null) Error (0x80029c4a)."

### Root Cause

"This issue often occurs as a result of upgrading from a 32-bit version of Office to a 64-bit version." When Office is upgraded from 32-bit to 64-bit, the Word COM interop registration changes. Tedds relies on specific Word COM interfaces, and the version mismatch causes the integration to fail. "The problem can also manifest itself in several different ways, because there are several different areas of the software which rely on the Microsoft Word integration working correctly and if it has become corrupted on a system then various features may not work." A newer version of Office registered in the registry (e.g., an 8.7 key when Office 2013 is installed) can also cause the issue — "a component of a newer version of Office has been installed e.g. Lync."

### Fix

1. **Full uninstall and reinstall of Microsoft Office**:
   - "In most cases carrying out a full Uninstall and Reinstall of Microsoft Office should resolve the problem"
   - "While a Repair may resolve the issue we have often found that it does not"
   - Close all Office applications (Outlook, Excel, etc.)
   - Use the Microsoft Office uninstall support tool
   - Reboot after reinstall
   - Try Tedds for Word again

2. **Fix registry TypeLib version keys**:
   - "Browse to HKEY_CLASSES_ROOT\Wow6432Node\TypeLib\{00020905-0000-0000-C000-000000000046}"
   - Check for sub-keys: 8.4 (Office 2007), 8.5 (Office 2010), 8.6 (Office 2013), 8.7 (Office 2016)
   - "If a key exists for a version of Office later than the version you have installed, rename the key"
   - Put an underscore before the later version (e.g., `_8.7`)
   - Try calculating in Tedds for Word

3. **Create a registry file for quick workaround**:
   - "Creating a registry file to remove this key is recommended"
   - "Which will provide a quick workaround in case the issue returns"
   - Save the registry edit as a .reg file
   - Run it if the problem recurs

4. **Check for Lync or other Office components**:
   - "The key for the later version Office component e.g. Lync is repaired/updated/patched"
   - "Then the later version registry key is likely to be restored and re-create the problem"
   - If Lync or other Office components are installed
   - They may register newer TypeLib versions
   - Remove or update them

5. **Verify Office is 64-bit**:
   - If you upgraded from 32-bit to 64-bit Office
   - Verify the installation completed successfully
   - Check in Word > File > Account > About Word
   - It should say "64-bit"

6. **Contact Trimble support**:
   - "If the issue persists after attempting the above"
   - "Please contact your local Trimble Helpdesk for further information"
   - Provide the exact error messages
   - Include Office version and Tedds version

### Community Report

> "This issue often occurs as a result of upgrading from a 32-bit version of Office to a 64-bit version. In most cases carrying out a full Uninstall and Reinstall of Microsoft Office should resolve the problem. Check HKEY_CLASSES_ROOT\Wow6432Node\TypeLib\{00020905-0000-0000-C000-000000000046}. If a key exists for a version of Office later than the version you have installed, rename the key of the later version, then try calculating within Tedds for Word."

## 3. VBL Variable File Out of Sync

### Symptom

Tedds displays: "The Tedds document variable file (.VBL) does not exist; a complete document recalculation is required" or "The Tedds document and its associated variable file (.VBL) are out of sync." The document can't be calculated. The VBL file may be missing, corrupted, or read-only. Automatic deletion of the VBL file fails.

### Root Cause

"A Tedds for Word document consists of two files: a Word document and a Tedds variable file with a .VBL file extension. The integrity of the information is ensured through time stamps." If the Word document is modified outside of Tedds (e.g., edited in Word without Tedds running), the time stamps become out of sync. If the VBL file is deleted, corrupted, or set to read-only, the synchronization fails. "The automatic deletion of the Tedds variable file has failed. This may occur when the variable file is set to be read-only."

### Fix

1. **Recalculate the entire document**:
   - "Recalculate the entire document in order to recreate it"
   - Open the document in Tedds for Word
   - Run a full recalculation
   - This recreates the VBL file

2. **Delete the VBL file manually**:
   - "You must delete this file and then perform a complete document re-calculation"
   - Close the document in Tedds
   - Find the .VBL file (same name as the Word document, .VBL extension)
   - Delete it manually
   - Open the document and recalculate

3. **Check for read-only VBL file**:
   - "This may occur when the variable file is set to be read-only"
   - Right-click the .VBL file > Properties
   - Uncheck "Read-only"
   - Try recalculation again

4. **Fix corrupt VBL file**:
   - "The variable file that you are using has been deleted or has become corrupt"
   - "Save and close the document. Delete the .VBL file. Open the document. Recalculate the document."
   - This creates a fresh VBL file

5. **Unable to add section to variables file**:
   - "The variable file either does not exist, or it is corrupt"
   - Same fix: Save and close, delete .VBL, reopen, recalculate

6. **Unable to open variables file**:
   - "The variable file has been deleted or has become corrupt"
   - Save and close the document
   - Delete the .VBL file
   - Open and recalculate

7. **Unable to tidy temporary variable file**:
   - "The error may occur when you are running low on disk space"
   - "Remove any unwanted files from your disk"
   - Free up disk space
   - Recalculate the document

8. **Unable to create temporary VBL file**:
   - "The error usually occurs when your computer is running low on memory"
   - Close other applications
   - Restart the computer
   - Try again

### Community Report

> "A Tedds for Word document consists of two files: a Word document and a Tedds variable file with a .VBL file extension. The integrity of the information is ensured through time stamps. The Tedds document and its associated variable file are out of sync. You must delete this file and then perform a complete document re-calculation. The automatic deletion of the Tedds variable file has failed. This may occur when the variable file is set to be read-only."

## 4. Library Access System Memory Errors

### Symptom

Tedds displays: "Unable to launch the Library Access System," "Failed to get Clipboard data!," or "Failed to open Clipboard!." The Library Access System doesn't open or partially works — items are inserted in Word but Calc Section cannot be created. Clipboard operations fail.

### Root Cause

"The error usually occurs when your computer is running low on memory." The Library Access System uses the Windows Clipboard to transfer data between the library and Word. When memory is low, clipboard operations fail. "When a calculation set is modified, a temporary file is created to contain the changed information. Either the file cannot be created, or cannot be extended to hold the required information. The error is most likely to occur because the disk is full."

### Fix

1. **Close applications to free memory**:
   - "Close some applications. Try again."
   - Close other Office applications
   - Close browser tabs
   - Close unnecessary programs
   - Restart Tedds

2. **Close calculation sets**:
   - "Close calculation sets or other running applications. Try again."
   - Close open calculation sets in Tedds
   - This frees memory used by the sets
   - Reopen only what you need

3. **Free up disk space**:
   - "The error is most likely to occur because the disk is full"
   - "Delete some old files or documents"
   - Clear temporary files
   - Empty the recycle bin
   - Ensure at least 1GB free space

4. **Fix Clipboard errors**:
   - "Failed to get Clipboard data!" — close applications, try again
   - "Failed to open Clipboard!" — close applications, try again
   - If clipboard is locked by another app
   - Close the app locking the clipboard
   - Restart the computer if needed

5. **Check for invalid library file names**:
   - "The name of the library file that you have given contains invalid characters"
   - Check the library file name
   - Remove special characters
   - Use only alphanumeric characters and underscores

6. **Fix incorrect set format**:
   - "The format of the set which you have selected is incorrect"
   - Check the calculation set format
   - Re-create the set if corrupted
   - Import from a backup

7. **Fix file does not exist error**:
   - "You have entered a set name which does not exist"
   - Check the set name spelling
   - Browse to select the correct set
   - Verify the set file exists

8. **Fix clipboard data validation**:
   - "You have attempted to add data into the library, but the data on the clipboard is invalid"
   - Ensure the data on the clipboard is valid
   - Copy the data again from the source
   - Try adding to the library again

### Community Report

> "Unable to launch the Library Access System. The error usually occurs when your computer is running low on memory. Close some applications. Try again. Failed to get Clipboard data! The error usually occurs when your computer is running low on memory. Close calculation sets or other running applications. Try again. When a calculation set is modified, a temporary file is created. The error is most likely to occur because the disk is full."

## 5. Fatal Calculation Errors from System Resource Exhaustion

### Symptom

During a Tedds calculation, the System error dialog appears. The error informs about a system error such as lack of memory or disk space. The calculation cannot continue. Clicking Abort returns to the document as it was before starting the calculation.

### Root Cause

"Fatal errors occur when Tedds for Word cannot run correctly due to a system error, which may mean, for example, lack of memory or disk space." Fatal errors are system-level failures — the computer doesn't have enough resources to complete the calculation. This is different from calculation errors (wrong results) or dimensional errors (invalid input). Fatal errors are environmental — they indicate the system can't support the operation.

### Fix

1. **Click Abort and free resources**:
   - "Click Abort and return to your document, leaving it as it was before starting the calculation"
   - The document is restored to its pre-calculation state
   - Free up memory and disk space
   - Try the calculation again

2. **Free memory before calculating**:
   - Close all unnecessary applications
   - Close other Office documents
   - Close browser tabs
   - Restart the computer if needed
   - Then run the calculation

3. **Free disk space**:
   - "Unable to create temporary variable (.VBL) file. The error usually occurs when your computer is running low on memory."
   - "Unable to create a temporary copy of the variable (.VBL) file. The error usually occurs when you are running low on disk space."
   - "Unable to copy temporary variable file to the document variable (.VBL) file. The error usually occurs when you are running low on disk space."
   - Delete unnecessary files
   - Clear temp files
   - Ensure adequate free space

4. **Fix Expression Evaluation filter errors**:
   - "A problem has occurred in the Expression Evaluation filter"
   - "The Expression Evaluation filter has failed to initialize correctly"
   - "The error may occur when you are running low on memory"
   - Close applications and retry

5. **Handle variable definition errors**:
   - "Variable definition errors occur when you try to use a variable that has not been defined"
   - "Is not one of the standard system variables, or is formatted incorrectly"
   - "Tedds for Word only alerts you about variable definition errors if you have selected the Error on undefined variable option"
   - Check the Tedds options for error handling settings

6. **Handle dimensional or non-fatal errors**:
   - "Dimensional and non-fatal errors occur when Tedds for Word cannot complete the calculation for some reason"
   - These are not system errors
   - Check the calculation input
   - Fix the dimensional or input error

7. **Increase system resources**:
   - If fatal errors occur frequently
   - Add more RAM to the computer
   - Use an SSD instead of HDD
   - Close background services
   - Consider a more powerful workstation

8. **Contact support for persistent issues**:
   - If fatal errors persist despite adequate resources
   - Contact Trimble support
   - Provide the error message and calculation details
   - Include system specifications

### Community Report

> "Fatal errors occur when Tedds for Word cannot run correctly due to a system error, which may mean, for example, lack of memory or disk space. In these situations, the System error dialog appears and informs you about the error that has occurred. Click Abort and return to your document, leaving it as it was before starting the calculation."

## 6. Additional Tekla Tedds Issues

### No System Variables File Found

**Issue**: "The errors occur for a number of reasons. They are very unlikely to arise during normal use of Tedds."
**Fix**: "Contact your dealer or the Support Department for assistance." This is a rare system-level error.

### Problem Adding New Item to Calculation Set

**Issue**: Error when adding new items to a calculation set.
**Fix**: Check the item data. Verify the calculation set is not read-only. Close and reopen the set. Try creating a new set.

### Problem Retrieving Valid Library Item Data

**Issue**: "You have attempted to add data into the library, but the data on the clipboard is invalid."
**Fix**: Re-copy the data from the source. Ensure the clipboard contains valid data. Try a different copy method.

### Problem Updating Selected Library Item

**Issue**: Error when updating a library item in a calculation set.
**Fix**: Check the item is not locked. Verify the set is writable. Close other instances of Tedds. Try again.

### Temporary File Creation Failure

**Issue**: "When a calculation set is modified, a temporary file is created. Either the file cannot be created, or cannot be extended."
**Fix**: "The error is most likely to occur because the disk is full. Delete some old files or documents."

### Data in Temporary Library File Invalid

**Issue**: "The data in the temporary library file is invalid. The error usually occurs when your disk has become corrupted in some way."
**Fix**: "Verify the situation of the disk with a commercially available disk checking package. Try again." Run `chkdsk` on the disk.

## Best Practices

1. **Re-enable the Tedds add-in in Word Options** — when error 287 appears
2. **Full Office reinstall for Word instance errors** — repair usually doesn't work
3. **Check TypeLib registry keys for version mismatches** — rename newer version keys
4. **Delete VBL file and recalculate** — when VBL is out of sync or corrupt
5. **Check VBL file isn't read-only** — prevents automatic deletion
6. **Close applications before Library Access System** — prevents memory errors
7. **Free disk space before calculations** — prevents temporary file errors
8. **Use Autosave** — prevents data loss during fatal errors
9. **Don't edit Tedds documents outside of Tedds** — prevents VBL desync
10. **Keep Office and Tedds updated** — prevents integration issues
