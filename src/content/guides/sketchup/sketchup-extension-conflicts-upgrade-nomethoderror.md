---
title: "SketchUp Extension Conflicts After Version Upgrade: NoMethodError and Migration Issues"
excerpt: "After upgrading SketchUp, extensions throw NoMethodError or stop loading entirely. We cover the clean installation process, Ruby API compatibility checks, and the extension isolation method that identifies the culprit."
category: "troubleshooting"
softwareSlug: "sketchup"
keyword: "SketchUp extension conflict NoMethodError upgrade migration"
slug: "sketchup-extension-conflicts-upgrade-nomethoderror"
author: "CADGuide Tools Editorial Team"
readTime: "8 min"
date: "2025-06-25"
sources:
  - "https://forums.sketchup.com/t/extension-problems-with-sketchup-2024/266720"
  - "https://forums.sketchup.com/t/lost-all-2024-extensions-after-installing-2025/317589"
  - "https://forums.sketchup.com/t/sketchup-2024-2025-extension-problem/319790"
  - "https://help.sketchup.com/en/troubleshooting/extension-errors"
---

# SketchUp Extension Conflicts After Version Upgrade: NoMethodError and Migration Issues

A user on the SketchUp Community forum reported that after updating to SketchUp 2024, several extensions stopped working — Shape Loader, Artisan, ClothWorks, FlexTools Component Browser, and 3DArc Studio all gave "NoMethodError" messages in the new extension error window. Another user reported losing all 2024 extensions after installing 2025, despite the two versions supposedly being independent with separate install and AppData folders. A third user had extension problems across both 2024 and 2025.

These are the three most common extension problems after a SketchUp version upgrade, and each has a different root cause and fix.

## Problem 1: NoMethodError After Upgrade

When extensions throw "NoMethodError" after a SketchUp upgrade, it means the extension is calling a Ruby API method that no longer exists or has been renamed in the new SketchUp version. SketchUp's Ruby API changes with each major release — methods are deprecated, renamed, or removed.

### Understanding the Error

The "NoMethodError" message in SketchUp's extension error window looks like:

```
Error: NoMethodError
undefined method `some_method_name' for #<SomeClass:0x0000000>
```

This means the extension is trying to call `some_method_name` on an object of `SomeClass`, but that method doesn't exist in the current SketchUp Ruby API.

### Fix 1: Check for Extension Updates

1. Open **Extensions → Extension Manager**
2. For each broken extension, note the developer name
3. Visit the developer's website or the Extension Warehouse page
4. Check if a newer version is available that supports your SketchUp version
5. Download and install the updated version

Most active extension developers release compatibility updates within weeks of a new SketchUp version. If no update is available, the extension may be abandoned.

### Fix 2: Contact the Extension Developer

If no update is available on the Extension Warehouse:

1. Find the developer's contact information on the extension's Extension Warehouse page
2. Send a message describing the NoMethodError, including:
   - The exact error message
   - Your SketchUp version
   - Your operating system
3. Many developers will provide a fix or a beta version

### Fix 3: Find Alternative Extensions

If the developer is unresponsive or has abandoned the extension:

1. Search the Extension Warehouse for extensions with similar functionality
2. Check the SketchUp Community forum for recommendations
3. Look for open-source alternatives on GitHub

### Fix 4: Don't Force-Load Incompatible Extensions

Never modify extension code to bypass NoMethodError. The error means the extension is trying to do something the API no longer supports. Forcing it to load can corrupt your model or crash SketchUp. If an extension is incompatible, leave it disabled until an update is available.

## Problem 2: Lost All Extensions After Installing New Version

A user reported: "I installed 2025 a couple of days ago to try out some of the new features. My understanding is that it's completely independent from 2024 and has separate install and appdata folders. I opened and closed both of them repeatedly without issue. Then I spent 2 days not using Sketchup at all and on the next launch, all extensions were gone."

### Root Cause: Extension Migration Failure

When you install a new SketchUp version, it offers to migrate extensions from the previous version. This migration copies extension files from the old Plugins folder to the new one. The migration can fail silently if:

- The old Plugins folder has permission issues
- Extension files are locked by another process
- The migration script encounters an unexpected file format
- The user skips the migration dialog

### Fix 1: Manually Copy Extensions

1. Close both SketchUp versions
2. Navigate to the old version's Plugins folder:
   - Windows: `%AppData%\SketchUp\SketchUp 2024\Plugins\`
   - Mac: `~/Library/Application Support/SketchUp 2024/Plugins/`
3. Navigate to the new version's Plugins folder:
   - Windows: `%AppData%\SketchUp\SketchUp 2025\Plugins\`
   - Mac: `~/Library/Application Support/SketchUp 2025/Plugins/`
4. Copy all files and folders from the old Plugins folder to the new one
5. Restart SketchUp 2025
6. Go to **Extensions → Extension Manager** and verify extensions are loaded

### Fix 2: Reinstall Extensions Fresh

If manual copying doesn't work:

1. Close SketchUp
2. Delete the contents of the new version's Plugins folder
3. Open SketchUp
4. Go to **Extensions → Extension Warehouse**
5. Search for each extension and install it fresh
6. This ensures you get the latest version compatible with your SketchUp version

### Fix 3: Check Extension Licensing

Some extensions require re-activation after migration:

1. Open the extension's settings or about dialog
2. Check if a license key is required
3. Enter your license key (you may need to deactivate on the old version first)
4. Some extensions use machine-specific licensing — contact the developer if re-activation fails

## Problem 3: Extensions Causing Startup Crashes

When extensions cause SketchUp to crash at startup, you may not be able to access the Extension Manager to disable them.

### Fix 1: Safe Mode (Shift+Launch)

1. Hold down **Shift** while launching SketchUp
2. SketchUp shows a dialog asking if you want to disable extensions
3. Click **Yes** to skip extension loading
4. SketchUp opens without any extensions
5. Go to **Extensions → Extension Manager**
6. Disable all extensions
7. Restart SketchUp normally
8. Re-enable extensions one at a time, restarting after each
9. When SketchUp crashes after enabling a specific extension, that's the culprit

### Fix 2: Rename the Plugins Folder

If Safe Mode doesn't work:

1. Close SketchUp
2. Navigate to: `%AppData%\SketchUp\SketchUp 2025\Plugins\`
3. Rename the folder to `Plugins_disabled`
4. Create a new empty `Plugins` folder
5. Start SketchUp — it should open without extensions
6. Copy extensions from `Plugins_disabled` to `Plugins` one at a time
7. Restart SketchUp after each copy to identify the problematic extension

### Fix 3: Check the Ruby Console

1. Open SketchUp with extensions disabled (Safe Mode)
2. Go to **Window → Ruby Console**
3. Enable one extension in the Extension Manager
4. Restart SketchUp with the Ruby Console open
5. Watch the console for error messages during extension loading
6. The error message will identify which extension is failing and why

## Preventing Extension Conflicts in the Future

### Before Upgrading SketchUp

1. **Document your extensions**: Take a screenshot of the Extension Manager showing all installed extensions and their versions
2. **Check compatibility**: Visit each extension's Extension Warehouse page and check compatibility with the new SketchUp version
3. **Wait 2-4 weeks**: Don't upgrade on day one. Wait for extension developers to release compatibility updates
4. **Keep the old version installed**: SketchUp allows multiple versions to coexist. Keep the old version until all extensions work in the new one

### After Upgrading SketchUp

1. **Don't migrate extensions automatically**: Skip the migration dialog and install extensions fresh
2. **Install one at a time**: Install extensions one by one, testing SketchUp after each installation
3. **Test on a copy**: Before using the new version on production files, test with a copy of your project

### Managing Extension Dependencies

Some extensions depend on other extensions or shared libraries:

1. Check the extension's documentation for dependencies
2. Install dependencies first, then the dependent extension
3. Common dependencies:
   - **SketchUp Extensions Platform**: Required by many extensions
   - **TT_Lib2**: Required by many ThomThom extensions
   - **LibFredo6**: Required by all Fredo extensions
4. If a dependent extension fails, check if its dependency is installed and up to date

## Summary

| Problem | Root Cause | Fix |
|---------|-----------|-----|
| NoMethodError after upgrade | Ruby API method removed/renamed | Update extension, contact developer, or find alternative |
| Lost extensions after new version | Migration failure | Manually copy Plugins folder or reinstall fresh |
| Startup crashes from extensions | Incompatible extension loading at startup | Safe Mode (Shift+launch), rename Plugins folder, check Ruby Console |
| Extension dependency failures | Missing or outdated shared library | Install dependencies first, check documentation |

The most important preventive measure is to wait 2-4 weeks after a new SketchUp release before upgrading. This gives extension developers time to release compatibility updates. When you do upgrade, install extensions fresh rather than migrating — you'll get the latest compatible versions and avoid migration-related issues.
