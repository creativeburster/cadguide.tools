---
title: "TopSolid PDM Server Startup Bug, Error in Nesting from Microsoft Redistributable, PDM Database Recovery from SQL MDF LDF Files, Service Pack Application Crash, and Windows Username Disappeared from PDM: SQL Database Attach, Redistributable Reinstall, Repair Installation, and PDM User Re-registration"
excerpt: "TopSolid fails for 5 distinct reasons: PDM server startup bug after 7.18 update requiring admin mode launch, error in nesting from Microsoft redistributable package requiring reinstall, PDM database recovery from crashed PC requiring SQL MDF LDF file attach, service pack application crash requiring repair installation, and Windows username disappeared from PDM database requiring re-registration. We cover each with fixes from TopSolid forums and documentation."
category: "pdm-and-installation-errors"
softwareSlug: "topsolid"
keyword: "TopSolid PDM server startup bug 7.18 update admin mode error in nesting Microsoft redistributable package reinstall PDM database recovery SQL MDF LDF file attach service pack application crash repair installation Windows username disappeared PDM database re-registration"
slug: "topsolid-pdm-server-startup-bug-error-in-nesting-redistributable-pdm-database-recovery-sql-mdf-ldf-service-pack-crash-username-disappeared-pdm-sql-database-attach-redistributable"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-08-03"
sources:
  - "https://forum.topsolid.com/viewtopic.php?f=2&t=2504"
  - "https://forum.topsolid.com/viewtopic.php?t=2388"
  - "https://forum.topsolid.fr/viewtopic.php?t=11018"
---

# TopSolid PDM Server Startup Bug, Error in Nesting from Microsoft Redistributable, PDM Database Recovery from SQL MDF LDF Files, Service Pack Application Crash, and Windows Username Disappeared from PDM: SQL Database Attach, Redistributable Reinstall, Repair Installation, and PDM User Re-registration

TopSolid's PDM server, startup nesting, database recovery, service pack installation, and user management produce errors from SQL database issues, missing redistributables, crashed PCs, corrupted updates, and disappeared user accounts. This guide covers the 5 most common TopSolid problems with diagnostic steps and community-verified fixes from TopSolid forums and documentation.

## 1. PDM Server Startup Bug After 7.18 Update

### Symptom

After updating TopSolid from 7.17 to 7.18, the PDM server has a bug at startup. The server doesn't start properly. Restarting the PC doesn't help. Uninstalling and reinstalling doesn't fix the issue.

### Root Cause

"Bug au démarrage du serveur" (bug at server startup) after updating from 7.17 to 7.18. The update process may not have properly updated the PDM server service. The PDM server relies on SQL Server and specific service configurations. The 7.18 update may have changed service dependencies or SQL connection parameters. "Ça semble être un problème de droit sur la base sql" (it seems to be a problem with rights on the SQL database) — the SQL database permissions may not have been properly migrated during the update.

### Fix

1. **Launch the PDM server admin as administrator**:
   - "Try launching the executable TopSolid.Pdm.ServerServiceAdmin.exe in admin mode"
   - Navigate to `C:\Program Files\TOPSOLID\TopSolid 7.18\bin`
   - Right-click `TopSolid.Pdm.ServerServiceAdmin.exe`
   - Run as administrator
   - Try starting the server again

2. **Restart the PC after installation**:
   - "Tu as essayé de redémarrer ton pc après l'installation?" (Have you tried restarting your PC after installation?)
   - "PC bien à jour?" (Is the PC fully updated?)
   - Restart the PC
   - Ensure all Windows updates are installed

3. **Check SQL database permissions**:
   - "It seems to be a problem with rights on the SQL database"
   - "Since it worked in 7.17 it should work in 7.18"
   - "I don't know that security was strengthened on this"
   - Check SQL Server permissions for the TopSolid user
   - Grant db_owner rights if needed

4. **Check Windows username in PDM database**:
   - "My Windows username had disappeared from the PDM database"
   - "I think it's a bug or a problem during a PC reinstallation"
   - Check if your Windows user is registered in the PDM
   - Re-add the user if missing

5. **Contact the hotline**:
   - "I will contact the hotline, I don't see why it doesn't work"
   - If the above steps don't work
   - Contact TopSolid support
   - Provide the exact error message

6. **Verify SQL Server is running**:
   - Check SQL Server service is running
   - Check SQL Server Browser service is running
   - Verify the SQL instance name matches PDM configuration
   - Check SQL Server port

### Community Report

> "I just updated from 7.17 to 7.18. Bug at server startup. I tried restarting the PC. I uninstalled and reinstalled. It seems to be a problem with rights on the SQL database, but since it worked in 7.17 it should work in 7.18. My Windows username had disappeared from the PDM database. I think it's a bug or a problem during a PC reinstallation."

## 2. Error in Nesting from Microsoft Redistributable

### Symptom

TopSolid was working well yesterday. Today it doesn't launch — "Error in nesting" message appears. When clicking OK, TopSolid closes. Windows updates were installed overnight. System restore to an earlier date doesn't help.

### Root Cause

"You get this warning when you start TopSolid? If yes it's linked to a Microsoft redistributable package." TopSolid depends on specific versions of Microsoft Visual C++ Redistributable packages. Windows updates may have updated, removed, or corrupted these redistributables. "The solution is to reinstall the good one." The wrong version of the redistributable causes the "Error in nesting" at startup, and TopSolid can't continue. System restore doesn't help because it may not restore the correct redistributable version.

### Fix

1. **Reinstall Microsoft Visual C++ Redistributables**:
   - "The solution is to reinstall the good one"
   - "In the sources of the install of TopSolid there is a folder where you can find all of them"
   - Find the redistributables in the TopSolid installation folder
   - Install the latest one first
   - If the problem continues, install the N-1 version

2. **Use the TopSolid repair installation**:
   - "Repair worked, finally"
   - Go to Control Panel > Programs and Features
   - Find TopSolid
   - Right-click > Change > Repair
   - This reinstalls the correct redistributables

3. **Check Windows updates**:
   - "Looks like some Windows updates installed overnight"
   - Check recently installed Windows updates
   - If a redistributable update was installed
   - Uninstall that specific update
   - Or reinstall the correct redistributable

4. **Install redistributables in order**:
   - "Install the latest one, then start TopSolid"
   - "If the problem continues install the N-1 latest"
   - Try versions from newest to oldest
   - One of them will be the correct version

5. **Don't use system restore**:
   - "Tried to restore back earlier date, no luck"
   - System restore may not restore redistributables correctly
   - Use the repair or reinstall method instead
   - It's more reliable

6. **Prevent future issues**:
   - After fixing, note which redistributable version works
   - Keep a copy of the correct redistributable installer
   - If Windows updates break it again
   - Reinstall the correct version quickly

7. **Check all redistributable versions**:
   - TopSolid may need multiple redistributable versions
   - Check x86 and x64 versions
   - Install both if needed
   - Verify in Control Panel > Programs and Features

### Community Report

> "Yesterday TopSolid worked well. Today morning didn't launch — Error in nesting message and when I click OK, then TS closed. Looked like some Windows updates installed overnight. Tried to restore back earlier date, no luck. You get this warning when you start TopSolid? It's linked to a Microsoft redistributable package. The solution is to reinstall the good one. In the sources of the install of TopSolid there is a folder where you can find all of them. Repair worked, finally."

## 3. PDM Database Recovery from SQL MDF LDF Files

### Symptom

A PC totally crashed. The only data saved is the TopSolidPdm folder. The files have extensions .TopPrt and .TopAsm. The user needs to recover the 3D models from the PDM folder. The PDM database is not accessible.

### Root Cause

"You need also the database from SQL. Usually it is on C:\Program Files\Microsoft SQL Server\... They are two files needed, the .mdf and .ldf files. If you do not have those files you have no chance to retrieve your models." TopSolid PDM stores file metadata, references, and document structure in a SQL Server database. The actual CAD files (.TopPrt, .TopAsm) are stored in the vault folder. Without the SQL database, the PDM can't link the files to their metadata. The .mdf file is the database data file, and .ldf is the transaction log.

### Fix

1. **Find the SQL database files**:
   - "You need also the database from SQL"
   - "Usually it is on C:\Program Files\Microsoft SQL Server\..."
   - "They are two files needed, the .mdf and .ldf files"
   - Look for `localPDMServer_log.ldf` and `localPDMserverServer.mdf`

2. **Attach the MDF file to SQL Server**:
   - "You have to attach the mdf file"
   - Open SQL Server Management Studio (SSMS)
   - Connect to the SQL Server instance
   - Right-click Databases > Attach
   - Add the .mdf file
   - The database is restored

3. **Use the TopSolid Backup tool**:
   - "Does the PDM backup contain both a Database and a Vault?"
   - "Yes, if you use the TopSolid Backup tool you will get both"
   - For future protection, use the TopSolid Backup tool
   - It backs up both the database and vault

4. **Restore the PDM folder**:
   - Copy the saved TopSolidPdm folder to the correct location
   - This is the vault with .TopPrt and .TopAsm files
   - The vault must be in the same path as before
   - Or update the PDM configuration to the new path

5. **Reinstall TopSolid and PDM**:
   - Install TopSolid on the new/repaired PC
   - Configure the PDM to use the restored SQL database
   - Point the vault to the restored PDM folder
   - Verify the PDM connects to the database

6. **Verify file access**:
   - After restoring the database and vault
   - Open TopSolid
   - Check that all documents are visible
   - Verify file references are intact
   - Test opening a few documents

7. **Back up regularly**:
   - Use the TopSolid Backup tool regularly
   - Back up both the database (.mdf, .ldf) and vault
   - Store backups on a separate drive or cloud
   - Test backups by restoring periodically

### Community Report

> "My PC totally crashed and I managed to save only the TopSolidPdm folder. You need also the database from SQL. They are two files needed, the .mdf and .ldf files. If you do not have those files you have no chance to retrieve your models. You have to attach the mdf file. If you use the TopSolid Backup tool you will get both Database and Vault."

## 4. Service Pack Application Crash

### Symptom

After installing a TopSolid 7.18 demo that worked, the user downloaded and installed the latest Service Pack 2. Now TopSolid doesn't run — error message: "This application cannot run on your PC." Repairing reverts to the original version, but re-applying the SP causes the same problem.

### Root Cause

"This application cannot run on your PC" after applying a service pack indicates a compatibility issue between the service pack and the installed version. The service pack may require a specific base version, or the installation may have been corrupted. The demo version may have different requirements than the full version. "Si vous avez des pistes?" (Do you have any leads?) — the community couldn't identify the exact cause, suggesting it's a specific installation issue.

### Fix

1. **Use the repair installation**:
   - "I tried to do a repair, I go back to the original version"
   - Repair reverts to the base version
   - This gets TopSolid running again
   - But without the service pack fixes

2. **Uninstall and reinstall completely**:
   - Uninstall TopSolid completely
   - Delete remaining files in the installation folder
   - Reinstall the base version
   - Then apply the service pack

3. **Check service pack compatibility**:
   - Verify the service pack is for your version
   - Check the TopSolid release notes
   - Ensure the SP matches the installed version (7.18)
   - Don't mix SPs from different versions

4. **Install as administrator**:
   - Right-click the service pack installer
   - Run as administrator
   - This ensures proper file permissions
   - Prevents installation corruption

5. **Check Windows compatibility**:
   - "This application cannot run on your PC"
   - Check Windows version compatibility
   - Check 32-bit vs 64-bit
   - Ensure Windows is fully updated

6. **Contact TopSolid support**:
   - If the SP continues to crash TopSolid
   - Contact TopSolid hotline
   - Provide the exact error message
   - Include version and SP details

7. **Stay on the base version if needed**:
   - If the SP can't be applied
   - Stay on the base version
   - Wait for the next SP
   - Or contact support for a hotfix

### Community Report

> "I installed the version V7.18 demo which worked. I downloaded and installed the latest Service Pack 2, now TopSolid doesn't run, error message: 'This application cannot run on your PC.' I tried to do a repair, I go back to the original version, then apply the patch and same problem."

## 5. Windows Username Disappeared from PDM Database

### Symptom

After a PC reinstallation or update, the user's Windows username has disappeared from the PDM database. The user can't log in to the PDM. Documents created by the user show as owned by an unknown user. The PDM doesn't recognize the Windows account.

### Root Cause

"My Windows username had disappeared from the PDM database. I think it's a bug or a problem during a PC reinstallation." TopSolid PDM links Windows usernames to PDM user accounts. If the Windows username changes (e.g., during PC reinstallation), or if the PDM database is corrupted, the link is broken. The PDM can't find the user, preventing login and document access. This may also happen if the SQL database was restored from a backup that predates the user's registration.

### Fix

1. **Re-add the Windows user to PDM**:
   - Open the PDM administration tool
   - Go to user management
   - Add the Windows username
   - Link it to the existing PDM user account

2. **Check Windows username matches**:
   - Verify the Windows username is exactly the same
   - Case-sensitive check
   - Domain name included if applicable
   - Correct any differences

3. **Restore from PDM backup**:
   - If the user was in a previous backup
   - Restore the PDM database from that backup
   - This restores the user registration
   - But may lose recent changes

4. **Use the PDM administration tool**:
   - Log in as PDM administrator
   - Navigate to user settings
   - Re-register the Windows user
   - Assign appropriate roles and permissions

5. **Check SQL database directly**:
   - Open SQL Server Management Studio
   - Query the PDM database user table
   - Check if the Windows username exists
   - Insert the user record if missing

6. **Contact TopSolid support**:
   - If you can't re-add the user
   - Contact TopSolid hotline
   - Provide the PDM database and user details
   - They can help restore the user

7. **Document ownership recovery**:
   - After re-adding the user
   - Document ownership may need to be updated
   - Use the PDM administration tool
   - Reassign documents to the correct user

### Community Report

> "My Windows username had disappeared from the PDM database. I think it's a bug or a problem during a PC reinstallation. Since it worked in 7.17 it must work in 7.18. I don't have knowledge that security was strengthened on this."

## 6. Additional TopSolid Issues

### File Exchange with Other CAD Software

**Issue**: "For any exchange with other CAD software, importing or exporting needs to be done using generic (ParaSolid, STEP, Iges, etc.) or native (CatPart, Asm, etc.) files."
**Fix**: Use the Import File command. Import with or without conversion. Use the Convert Document command for post-import conversion. Check the preview before converting.

### Package File Export

**Issue**: "You can transfer a project from one server to another using package files (TopPkg extension)."
**Fix**: Use Export Package command. Export the whole project or selected assemblies. Use Import Package on the receiving PDM. Choose the appropriate import mode (copy, associative, replication).

### Import as Associative Copy

**Issue**: "Objects imported this way can only be edited by pre-importing the updated originals."
**Fix**: Use Import as associative copy mode. Good for parts that should only be updated from the source. The import folder is automatically created. Use for machining parts that shouldn't be modified.

### Import as Replication

**Issue**: "Objects can be imported as is, keeping the original identifiers."
**Fix**: Use Import as replication mode. Good for sending objects to another PDM for modification. The modified object can be sent back. It will be recognized and updated in the original PDM.

### Import File as New Minor Revision

**Issue**: "This command is useful when you receive successive versions of a small technical document."
**Fix**: Import the first version using Import without conversion. Import subsequent versions using Import file as new minor revision. This creates a version history. Useful for Word documents and other technical docs.

### Automation API Import

**Issue**: "Imports a file with conversion into a project or one of its folders."
**Fix**: Use the TopSolid Automation API Import method. Available since v7.6. Must not be called between StartModification and EndModification. Check outBadDocumentIds for documents with bad geometry.

## Best Practices

1. **Use the TopSolid Backup tool regularly** — backs up both database and vault
2. **Keep SQL database files (.mdf, .ldf) backed up** — essential for PDM recovery
3. **Run PDM server admin as administrator** — fixes 7.18 startup bugs
4. **Keep Microsoft Visual C++ Redistributables installed** — prevents "Error in nesting"
5. **Reinstall redistributables from TopSolid install folder** — correct versions guaranteed
6. **Use Repair installation for service pack issues** — reverts to working version
7. **Check Windows username in PDM after PC reinstallation** — may disappear
8. **Use package files (TopPkg) for inter-company exchange** — preserves native format
9. **Import with conversion for CAD exchange** — uses appropriate converters
10. **Contact TopSolid hotline for persistent issues** — they can help with PDM database issues
