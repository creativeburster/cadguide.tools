---
title: "3DEXPERIENCE File Preparation Assistant: Cleaning SOLIDWORKS Data Before Platform Migration"
excerpt: "How to use the SOLIDWORKS File Preparation Assistant to audit and clean data before migrating to 3DEXPERIENCE — covering duplicate detection, missing references, 3D Interconnect links, trailing spaces, and configuration issues that cause platform problems."
category: "migration"
softwareSlug: "3dexperience"
keyword: "3dexperience file preparation assistant solidworks data migration cleanup"
slug: "3dexperience-file-preparation-assistant-solidworks-data-migration-cleanup"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-07-09"
sources:
  - "https://3dswym.3dexperience.3ds.com/wiki/solidworks-news-info/implementing-3dexperience-for-solidworks-users-solidpractices_HRtgRGasQ96Ppz_SfpikRw"
  - "https://3dswym.3dexperience.3ds.com/wiki/solidworks-news-info/solidworks-set-up-and-configuration_sgwEMtCYRO29HZQz8bGpbA"
---

# 3DEXPERIENCE File Preparation Assistant: Cleaning SOLIDWORKS Data Before Platform Migration

I've seen companies skip the File Preparation Assistant and upload their SOLIDWORKS data directly to 3DEXPERIENCE. Every single time, they regret it. Duplicate files create unwanted linked Physical Products. Missing references cause broken assemblies. 3D Interconnect links to non-native CAD files can't be saved to the platform. The File Preparation Assistant catches all of these before they become platform problems. Here's how to use it properly.

## What the File Preparation Assistant Does

The File Preparation Assistant is a free tool included with SOLIDWORKS 2022+ and Collaborative Designer for SOLIDWORKS. It runs locally — no platform connection required. It analyzes your SOLIDWORKS files and reports:

- **Trailing spaces in filenames** — "Bracket.sldprt " (with a space) vs "Bracket.sldprt"
- **Duplicate files** — same filename, same content, different folders
- **Missing file references** — assemblies with broken component links
- **3D Interconnect links** — references to non-native CAD files (STEP, IGES, CATIA)
- **Missing configurations** — parts without configurations
- **Other file inconsistencies** — various data quality issues

## Step 1: Launch the File Preparation Assistant

1. Open SOLIDWORKS.
2. Go to the **Tools** tab → **File Preparation Assistant**.
3. The assistant opens as a standalone application.
4. No platform connection is needed — it works entirely locally.

### System Requirements

- SOLIDWORKS 2022 or later (included with all SOLIDWORKS Design packages)
- Or Collaborative Designer for SOLIDWORKS
- Runs on the same workstation as SOLIDWORKS

## Step 2: Select Files to Analyze

1. Click **Add Files** or **Add Folder**.
2. Select the files or folders to analyze:
   - **Single folder**: Analyzes all SOLIDWORKS files in one folder
   - **Recursive folder**: Analyzes all subfolders
   - **Specific files**: Select individual parts, assemblies, and drawings
3. For large datasets, break the analysis into batches:
   - **Batch 1**: Active project files
   - **Batch 2**: Library and standard parts
   - **Batch 3**: Archive and reference files

### What to Analyze

Analyze everything you plan to upload to the platform:
- **Parts** (.sldprt)
- **Assemblies** (.sldasm)
- **Drawings** (.slddrw)
- **Library parts** — Toolbox, Design Library, standard components

## Step 3: Run the Analysis

1. Click **Analyze**.
2. The assistant processes each file and checks for issues.
3. Progress is shown for each file.
4. When complete, a summary report appears:
   - **Total files analyzed**
   - **Files with issues**
   - **Issue categories and counts**

### Analysis Time

For a typical project with 500-1000 files, the analysis takes 10-30 minutes. For large datasets (5000+ files), it can take several hours. Run it during off-hours.

## Step 4: Resolve Trailing Spaces

**Problem**: Filenames with trailing spaces ("Bracket .sldprt") cause issues on the 3DEXPERIENCE platform. The platform may treat "Bracket" and "Bracket " as different files, creating duplicates.

**Fix**:
1. In the assistant results, expand the **Trailing Spaces** category.
2. Review the affected files.
3. Click **Fix** to automatically remove trailing spaces.
4. The assistant renames the files and updates references.

### Manual Check

After the assistant fixes trailing spaces, verify that no references broke:
1. Open a few assemblies that reference the renamed files.
2. Confirm that all components load correctly.
3. If references broke, use SOLIDWORKS **File** → **Find References** to relink.

## Step 5: Resolve Duplicate Files

**Problem**: Duplicate files (same filename, same content, in different folders) create unwanted linked Physical Products on the platform. When you save both to the platform, they're treated as the same Physical Product, and modifying one modifies the other.

**Fix**:
1. In the assistant results, expand the **Duplicates** category.
2. Review each duplicate group:
   - **Same content, same name**: True duplicates — delete one copy
   - **Same name, different content**: Not true duplicates — rename one
3. For true duplicates:
   - Decide which copy to keep (usually the most recent or most referenced)
   - Update all assemblies that reference the deleted copy to point to the kept copy
   - Delete the duplicate
4. For same-name-different-content:
   - Rename one file to something unique
   - Update references

### Duplicate Resolution Strategy

- **Keep the copy in the most logical folder** — e.g., keep the library part in the library folder
- **Update references before deleting** — don't delete a file that assemblies still reference
- **Document the decision** — keep a log of which duplicates were merged

## Step 6: Resolve Missing File References

**Problem**: Assemblies with missing component references (broken links) can be saved to the platform, but the missing components won't be available. When other users open the assembly, components are missing.

**Fix**:
1. In the assistant results, expand the **Missing References** category.
2. For each assembly with missing references:
   - Open the assembly in SOLIDWORKS
   - Use **File** → **Find References** to identify missing components
   - Locate the missing files (search local drives, network shares, backups)
   - Relink the references
3. If files are truly lost:
   - Suppress or delete the missing components
   - Document the missing components for manual recreation

### Common Causes of Missing References

- **Files moved to a different folder** — the assembly still points to the old location
- **Files renamed outside SOLIDWORKS** — Windows Explorer rename breaks links
- **Network drive path changes** — mapped drive letter changed
- **Files on offline storage** — archive media not currently accessible

## Step 7: Resolve 3D Interconnect Links

**Problem**: SOLIDWORKS 3D Interconnect allows referencing non-native CAD files (STEP, IGES, CATIA V5, Inventor). These linked non-native files can't be saved to the 3DEXPERIENCE platform. The SOLIDWORKS file can be saved, but the referenced non-native file cannot.

**Fix**:
1. In the assistant results, expand the **3D Interconnect Links** category.
2. For each file with 3D Interconnect links:
   - Open the file in SOLIDWORKS
   - Right-click the linked component → **Break Link**
   - The component becomes a standard SOLIDWORKS part (geometry is preserved, but the link to the source CAD file is removed)
3. Save the file after breaking the link.

### When to Break vs. Keep Links

- **Break all links before migration** — recommended. The platform can't manage non-native CAD references.
- **Keep links only if you maintain the non-native files separately** — but this creates a hybrid workflow that's hard to manage.

### Breaking Links Changes Behavior

After breaking a 3D Interconnect link:
- The component geometry is frozen — it won't update if the source CAD file changes
- The component becomes a standard SOLIDWORKS part
- Material properties may need to be redefined

## Step 8: Resolve Missing Configurations

**Problem**: Parts without configurations may create issues when saved to the platform. The platform uses configurations to manage Physical Products. A part with no configurations creates a single Physical Product, but some platform workflows expect at least one configuration.

**Fix**:
1. In the assistant results, expand the **Missing Configurations** category.
2. For each part without configurations:
   - Open the part in SOLIDWORKS
   - Add a default configuration (ConfigurationManager → Add Configuration)
   - Save the part
3. This is a low-severity issue — most parts work fine without explicit configurations. But adding one prevents edge cases.

## Step 9: Upload Cleaned Data

After resolving all issues:

1. Use the **3DEXPERIENCE Utility** to upload files.
2. Upload in batches — start with library parts, then project files.
3. Verify that all files appear in the platform.
4. Open a few assemblies to confirm that references work.
5. Check that properties are visible in the platform web apps.

### Upload Order

1. **Toolbox and standard parts** — upload first, promote to Released
2. **Design Library parts** — upload second, promote to Released
3. **Project parts** — upload third
4. **Project assemblies** — upload last (after all referenced parts are uploaded)
5. **Drawings** — upload after assemblies

This order ensures that references resolve correctly during upload.

## Best Practices

- **Run the assistant on all data before uploading** — don't skip any files
- **Fix all issues before migration** — fixing issues on the platform is harder
- **Break all 3D Interconnect links** — the platform can't manage non-native references
- **Document all changes** — keep a log of duplicates merged, references fixed, links broken
- **Upload in batches** — don't upload everything at once
- **Verify after each batch** — open files and check references
- **Run the assistant again after major changes** — if you fix issues and then make more changes, run it again before uploading
- **Train users on data hygiene** — prevent future issues by establishing naming conventions and file management practices
