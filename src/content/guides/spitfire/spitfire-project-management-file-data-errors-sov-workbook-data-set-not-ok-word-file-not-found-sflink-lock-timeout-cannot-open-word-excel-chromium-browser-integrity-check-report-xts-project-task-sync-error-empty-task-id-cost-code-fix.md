---
title: "Spitfire Project Management File and Data Errors: SOV Workbook Data Set Not OK from Invalid XML Control Characters Requiring Data Cleanup, Word File Not Found from sfLink Lock Timeout Requiring MinUNCEditSeconds.dev Configuration, Cannot Open Word or Excel from Chromium Browser from ClickOnce Extension and VSTO Issues Requiring Device Setup, Integrity Check Report Data Issues from CCO Lines and Orphan Pay Requests Requiring Manual Repair, and XTS Project Task Sync Error from Empty Task ID or Description Requiring Cost Code Fix"
excerpt: "Spitfire fails for 5 distinct reasons: SOV workbook Data Set Not OK from invalid XML control characters requiring data cleanup, Word file not found from sfLink lock timeout requiring MinUNCEditSeconds.dev configuration, cannot open Word or Excel from Chromium browser from ClickOnce extension and VSTO issues requiring device setup, integrity check report data issues from CCO lines and orphan pay requests requiring manual repair, and XTS project task sync error from empty Task ID or Description requiring cost code fix. We cover each with fixes from Spitfire Client Services KBAs."
category: "file-and-data-errors"
softwareSlug: "spitfire"
keyword: "Spitfire Project Management SOV workbook Data Set Not OK invalid XML control characters data cleanup Word file not found sfLink lock timeout MinUNCEditSeconds.dev configuration cannot open Word Excel Chromium browser ClickOnce extension VSTO device setup integrity check report CCO lines orphan pay requests manual repair XTS project task sync error empty Task ID Description cost code fix"
slug: "spitfire-project-management-file-data-errors-sov-workbook-data-set-not-ok-word-file-not-found-sflink-lock-timeout-cannot-open-word-excel-chromium-browser-integrity-check-report-xts-project-task-sync-error-empty-task-id-cost-code-fix"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-08-03"
sources:
  - "https://support.spitfirepm.com/kba-01810/"
  - "https://support.spitfirepm.com/kba-01853/"
  - "https://support.spitfirepm.com/kba-01466/"
---

# Spitfire Project Management File and Data Errors: SOV Workbook Data Set Not OK from Invalid XML Control Characters Requiring Data Cleanup, Word File Not Found from sfLink Lock Timeout Requiring MinUNCEditSeconds.dev Configuration, Cannot Open Word or Excel from Chromium Browser from ClickOnce Extension and VSTO Issues Requiring Device Setup, Integrity Check Report Data Issues from CCO Lines and Orphan Pay Requests Requiring Manual Repair, and XTS Project Task Sync Error from Empty Task ID or Description Requiring Cost Code Fix

Spitfire's SOV workbook, Word file editing, browser integration, data integrity, and project task syncing produce errors from invalid XML characters, lock timeouts, ClickOnce configuration issues, data inconsistencies, and empty cost code fields. This guide covers the 5 most common Spitfire problems with diagnostic steps and community-verified fixes from Spitfire Client Services KBAs.

## 1. SOV Workbook Data Set Not OK from Invalid XML Control Characters

### Symptom

When trying to open the SOV (Schedule of Values) workbook on a Pay Application, the message appears: "Data Set is NOT OK: wrong number of columns. Contact Spitfire for Assistance." The SOV workbook cannot be opened. The error occurs on specific Pay Applications, not all.

### Root Cause

"This message means that the XML returned by the server is not valid. The cause is usually a description with invalid or unprintable control characters." The SOV workbook communicates with the sfPMS web application using SOAP Web Service, which uses XML to transport data. XML is sensitive to unprintable control characters (e.g., null bytes, form feeds, vertical tabs). If a description field in the SOV data contains such characters, the XML becomes invalid, and the workbook can't parse it. The "wrong number of columns" message is a symptom of the XML parsing failure.

### Fix

1. **Create a dev file to capture the XML**:
   - "Create an empty file named C:\SPITFIRE\sfSOVBilling.Dev"
   - "Be sure the extension is .dev, not .dev.txt"
   - This enables dev mode for the SOV workbook
   - The XML data will be saved to a file

2. **Find the invalid XML data**:
   - "Open the SOV workbook and proceed through the prompts"
   - "When you get the Data Set is NOT OK message, look for c:\spitfire\sfSOVLoadUp.xml"
   - "Open c:\spitfire\sfSOVLoadUp.xml in an XML validation tool (for example Notepad++)"
   - "The invalid node(s) are the cause of the issue"

3. **Fix the invalid data**:
   - "You can use the sfPMS POKE tool (with the bad node's RowGuid)"
   - "Or expose the document item grid to simplify the data for that row"
   - Find the description with invalid characters
   - Remove or simplify the problematic characters

4. **Alternative: use %temp% folder**:
   - "Don't have access to c:\spitfire? Open SOV normally (skip step 1)"
   - "At step 3 above look in the %temp% folder for the newest .XML file"
   - "Copy this someplace and use your XML validation tool"
   - Find and fix the invalid data

5. **Remove the dev file after fixing**:
   - "Remember to remove the C:\SPITFIRE\sfSOVBilling.dev file!"
   - Delete the dev file
   - Restart the SOV workbook
   - Verify it opens correctly

6. **Review descriptions for special characters**:
   - Check all description fields in the SOV
   - Look for control characters, tabs, or non-printable chars
   - Simplify the text
   - Use only standard ASCII characters

7. **Use the Items Grid**:
   - "If the SOV is small, you might make the Items Grid visible"
   - "Review the descriptions"
   - "But this can become a needle in a haystack approach"
   - Use the XML method for large SOVs

### Community Report

> "I am getting the following message when I try to open the SOV workbook on one of my Pay Applications: Data Set is NOT OK: wrong number of columns. Contact Spitfire for Assistance. This message means that the XML returned by the server is not valid. The cause is usually a description with invalid or unprintable control characters. Create an empty file named C:\SPITFIRE\sfSOVBilling.Dev, open the SOV workbook, look for sfSOVLoadUp.xml, open it in Notepad++, the invalid node(s) are the cause."

## 2. Word File Not Found from sfLink Lock Timeout

### Symptom

When trying to open a Word file attachment in Spitfire, the message appears: "Sorry, we couldn't find pathname/filename. Is it possible it was moved, renamed or deleted?" The Word file cannot be opened. The file was checked out but is now missing from the local catalog.

### Root Cause

"It takes longer than normal for the editor to open the file and acquire a lock. After waiting its minimum amount of time without seeing the file lock, sfLink checks the file back in and removes it. When the editor finally does initialize, it tries to lock the file and finds it missing!" The sfLink helper downloads the file, invokes Word, and waits for Word to lock the file. If Word takes too long to start (common with remote paths on VPN or OneDrive), sfLink times out, checks the file back in, and removes the local copy. When Word finally opens, the file is gone.

### Fix

1. **Check the Documents folder path**:
   - "Spitfire temporarily places files in a Spitfire Catalog folder created in the default Windows Documents folder"
   - "If the pathname for 'My Documents' has been changed or corrupted, Spitfire and the file editor may get confused"
   - Right-click Documents > Properties > Location tab
   - Ensure the path is straightforward

2. **Create or edit MinUNCEditSeconds.dev**:
   - "Open sfLink, right click on the [S] icon in the tray and choose 'Show Local Catalog Folder'"
   - "Drill into the Backups folder"
   - "Look for the file MinUNCEditSeconds.dev"
   - "If it's there, open and increase the number of seconds"
   - "If not, create a text file called MinUNCEditSeconds.dev"

3. **Set the timeout value**:
   - "The following should be in the file: MinEditSeconds=45;"
   - Increase from the default to 45 seconds or more
   - This gives Word more time to acquire the lock
   - Save and close the file

4. **Restart sfLink**:
   - "Close sfLink"
   - "Go to the very bottom of your screen, to your system tray"
   - "Click to expand it, then select the Spitfire icon"
   - "Right-mouse click to open a menu, then select Close sfPMS Link Helper"
   - Restart sfLink

5. **Fix the Documents folder location**:
   - "If your folder path is not straightforward, contact your IT Admin to correct it"
   - Move Documents back to default location
   - Remove special characters from the path
   - Avoid OneDrive or VPN paths for Documents

6. **Check for OneDrive interference**:
   - "The path is remote (stored on a VPN or on OneDrive)"
   - Exclude the Spitfire Catalog folder from OneDrive sync
   - Or disable OneDrive temporarily
   - Use a local Documents folder

7. **Verify sfLink is running**:
   - Check the system tray for the Spitfire [S] icon
   - If not running, start sfLink
   - Check the connection status
   - Ensure sfLink is connected to the server

### Community Report

> "You may encounter a message when trying opening a Word file that says: Sorry, we couldn't find pathname/filename. In certain instances, it takes longer than normal for the editor to open the file and acquire a lock. After waiting its minimum amount of time without seeing the file lock, sfLink checks the file back in and removes it. When the editor finally does initialize, it tries to lock the file and finds it missing! Create MinUNCEditSeconds.dev with MinEditSeconds=45;"

## 3. Cannot Open Word or Excel from Chromium Browser

### Symptom

Using Spitfire in Chrome (V2020+), clicking the icon to open Microsoft Word or Excel files from the document's Attachment tab does not work. The file does not open. The message appears: "You already have the Microsoft Office file for this Spitfire document open." The ClickOnce Chromium browser extension was added but didn't help.

### Root Cause

The ClickOnce extension in Chrome is not properly configured, or the sfLink helper is not running correctly. The VSTO (Visual Studio Tools for Office) may not be installed, preventing Office integration. The sfPMS Trust may not be established. The "You already have the file open" message is a false positive from sfLink detecting a stale lock from a previous failed attempt.

### Fix

1. **Close sfPMS Link Helper**:
   - "Right-click on the Spitfire [S] icon, then select Close sfPMS Link Helper"
   - Close sfLink completely
   - Restart sfLink
   - Try opening the file again

2. **Set up the device**:
   - "Try loading http://try.spitfirepm.com/sfPMS/cabs/sflink/sfLink.application?ShowUI=1"
   - "The 'Setup this Device' dialog should appear"
   - Follow the setup wizard
   - Ensure all components are installed

3. **Check Office Integration**:
   - "If Office Integration is not green: Click the button to add Microsoft Visual Studio Tools for Office (VSTO)"
   - "VSTO must be added after Office is installed"
   - "Sometimes our prerequisite installer is not able to do the job"
   - "You can install this Microsoft component directly from Microsoft's page"

4. **Check sfPMS Trust**:
   - "If sfPMS Trust is not green, see KBA-01047"
   - Establish trust between the browser and sfPMS
   - Add the Spitfire URL to trusted sites
   - Install the trust certificate

5. **Check ClickOnce errors**:
   - "If you get Microsoft ClickOnce errors, see KBA-01373"
   - "Then try to Set Up Device again"
   - Clear ClickOnce cache
   - Reinstall the ClickOnce extension

6. **Check if Word opens but Excel doesn't**:
   - "If Word files open but Excel files do not, see also KBA-01822"
   - Excel may need separate configuration
   - Check Excel-specific settings
   - Verify Excel is the default application

7. **Use Internet Explorer as fallback**:
   - If Chrome doesn't work
   - Try Internet Explorer or Edge
   - These have native ClickOnce support
   - No extension needed

### Community Report

> "I use Spitfire in Chrome, which in V2020+ should allow me to open Microsoft Word and Excel files. However, when I click the icon, my file does not open. I did add the ClickOnce Chromium browser extension but that didn't help. Instead I get the message: You already have the Microsoft Office file for this Spitfire document open. If Office Integration is not green, click the button to add VSTO. VSTO must be added after Office is installed."

## 4. Integrity Check Report Data Issues from CCO Lines and Orphan Pay Requests

### Symptom

The Integrity Check report (found in the Admin folder) shows various data integrity issues. Common issues include: CCO lines not on subcontract, orphan pay requests with no parent commitment, duplicate commitment numbers, bad subcontract line data, and closed documents without closed dates. The report identifies data inconsistencies that need manual repair.

### Root Cause

Data integrity issues accumulate over time from various operations: manual edits by Sys Admins after documents are committed, deleted commitments leaving orphan pay requests, duplicate numbering from manual entry, and status mapping inconsistencies. The Integrity Check report categorizes these issues by IC Type to help administrators focus on specific problems. Some issues can be automatically repaired, while others require manual intervention.

### Fix

1. **Run the Integrity Check report**:
   - "Found on the Admin folder"
   - "Select the IC Type to focus the report"
   - "Click the Run Report button to see your results"
   - Review all reported issues

2. **Fix CCO Lines not on Subcontract**:
   - "Approved CCO lines do not exist on Commitment"
   - "Usually happens if the Commitment is manually edited by a Sys Admin after having been committed"
   - "This data condition is only reported, not automatically repaired"
   - Cancel the CCO or force it back to In Process and repost

3. **Fix Orphan Pay Requests**:
   - "Pay Requests with no parent Commitment (e.g., because the Commitment has been deleted)"
   - Delete the orphan pay request
   - Or recreate the parent commitment
   - Link the pay request to the new commitment

4. **Fix Duplicate Commitment Numbers**:
   - "Projects with more than one Commitment with the same commitment number"
   - Find the duplicate commitments
   - Renumber one of them
   - Verify uniqueness

5. **Fix Closed Documents Without Closed Date**:
   - "Documents with a status mapped to 'closed' but with no closed date"
   - Update the document status
   - Set the closed date manually
   - Or change the status back to approved

6. **Fix Bad Subcontract Line Data**:
   - "CCO/Pay Request documents with cost code or accounting data that do not match the parent Commitment"
   - Compare CCO/Pay Request data with the parent commitment
   - Correct the mismatched data
   - Repost the document

7. **Fix Catalog Issues**:
   - "Catalog: No File Name — Files in the Catalog with no filename"
   - "Catalog: Bad GZ Flag — A binary entry marked as compressed but is not"
   - Clean up catalog entries
   - Remove orphaned files
   - Fix compression flags

8. **Fix Duplicate Item Numbers**:
   - "Documents with more than one Item with the same item number"
   - Find the duplicate items
   - Renumber one of them
   - Verify uniqueness within the document

### Community Report

> "On the Integrity Check report, what do the different IC Types mean? CCO Lines not on Subcontract: Approved CCO lines do not exist on Commitment. Usually happens if the Commitment is manually edited by a Sys Admin after having been committed. This data condition is only reported, not automatically repaired. Orphan Pay request: Pay Requests with no parent Commitment (e.g., because the Commitment has been deleted)."

## 5. XTS Project Task Sync Error from Empty Task ID or Description

### Symptom

A SendWBS watchdog alert appears in the Watchdog Alerts part. The alert says: "XTS Error: System.Web.Services.Protocols.SoapException." The error occurs when the project's Cost Code Maintenance screen is syncing with the partner accounting system. The issue affects subsequent Pay Requests and Budget Revisions.

### Root Cause

"The Cost Code Maintenance window cannot include a row with an empty Task ID or an empty Description." The XTS (Microsoft Dynamics SL) integration requires all cost code rows to have both a Task ID and a Description. If any row has an empty Task ID or Description, the SOAP web service call fails with a SoapException. The sync stops, preventing Pay Requests and Budget Revisions from processing correctly.

### Fix

1. **Open Cost Code Maintenance**:
   - "Open the Cost Code Maintenance window on your project"
   - Navigate to the project
   - Open Cost Code Maintenance
   - Review all rows

2. **Find empty Task ID or Description**:
   - "Find the row with an empty Task ID and/or Description"
   - Look for blank fields
   - Check all rows in the grid
   - Identify the problematic row(s)

3. **Make the row inactive**:
   - "Make that row inactive"
   - Set the row status to inactive
   - This excludes it from the sync
   - The empty fields won't cause an error

4. **Save and close**:
   - "Save and close the Cost Code Maintenance window"
   - Save the changes
   - Close the window
   - The sync should resume

5. **Verify sync resumes**:
   - "Syncing should resume correctly after a few minutes"
   - Wait a few minutes
   - Check the Watchdog Alerts
   - The error should clear

6. **Fill in the empty fields**:
   - Instead of making the row inactive
   - Fill in the empty Task ID
   - Fill in the empty Description
   - Save and close

7. **Check for other empty fields**:
   - Review all cost code rows
   - Ensure all required fields are filled
   - Check for other potential sync issues
   - Prevent future errors

### Community Report

> "Such alerts are triggered when there is an issue with the project's Cost Code Maintenance screen syncing with the partner accounting system. XTS Error: System.Web.Services.Protocols.SoapException. The Cost Code Maintenance window cannot include a row with an empty Task ID or an empty Description. Open the Cost Code Maintenance window, find the row with an empty Task ID and/or Description and make that row inactive. Save and close. Syncing should resume correctly after a few minutes."

## 6. Additional Spitfire Issues

### SSPI Context Error

**Issue**: "When I try to run the Spitfire Configuration Tool (ICTool.exe), I get a 'Cannot generate SSPI context' error message."
**Fix**: Check SQL Server connection. Verify SPN registration. Check domain credentials. Restart SQL Server service.

### Multiple Software Versions Dialog

**Issue**: "When I try to open a Word or Excel file, the file does not open. Instead I see a message about running different versions of Spitfire."
**Fix**: "Click the OK button so that Spitfire knows to switch to the other version, then click the icon to open Word or Excel again." Close sfLink from the system tray if needed.

### Microsoft Blocking Macros

**Issue**: "When you open a Microsoft Excel workbook in Spitfire (BFA, SOV, Period Distribution), you may get: SECURITY RISK: Microsoft has blocked macros from running."
**Fix**: Enable macros in Excel Trust Center. Add Spitfire location to Trusted Locations. Unblock the file in File Properties.

### CommitmentBudgeting Rules Retired

**Issue**: "The ProjectConfig | CommitmentBudgeting rules have been retired."
**Fix**: "Contact Spitfire Support for a newer approach." If you changed the defaults as instructed in KBA-01397, you need the new approach.

### Title Field Default Instant Save Removed

**Issue**: "In the Classic UI, the Title field has had a default of instant save. We have removed that default."
**Fix**: "To mark individual document types for auto save, consider adding CSS=uiStoreValue; to the Extended field in the UI Configuration tool."

### Flex Key Forms Require Mask Maintenance Role

**Issue**: "Flex Key Forms in Power UX (such as the Create New Project popup) require the PART | Mask Maintenance (R) role capability."
**Fix**: "This capability has been added to the Everyone role in a recent build. Update to the latest build if you do not find this capability."

## Best Practices

1. **Create sfSOVBilling.Dev to debug SOV Data Set Not OK errors** — captures the XML for analysis
2. **Set MinUNCEditSeconds=45 in MinUNCEditSeconds.dev** — prevents sfLink lock timeout
3. **Keep Documents folder path straightforward** — avoids file open confusion
4. **Install VSTO after Office for Spitfire Office integration** — enables Word/Excel editing
5. **Run Integrity Check report regularly** — catches data issues early
6. **Don't manually edit committed documents** — causes CCO line mismatches
7. **Fill all Task ID and Description fields in Cost Code Maintenance** — prevents XTS sync errors
8. **Update to the latest Spitfire build** — gets security fixes and new features
9. **Keep the PART | Mask Maintenance capability in the Everyone role** — required for Flex Key Forms
10. **Use the Setup Device wizard for browser integration** — ensures all components are installed
