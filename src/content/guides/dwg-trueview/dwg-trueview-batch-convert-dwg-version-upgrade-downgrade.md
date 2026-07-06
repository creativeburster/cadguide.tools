---
title: "DWG TrueView Batch Convert: Upgrading and Downgrading DWG File Versions"
excerpt: "How to use DWG TrueView's DWG Convert tool to batch convert DWG files between versions — covering version compatibility, conversion settings, and common conversion issues."
category: "deployment"
softwareSlug: "dwg-trueview"
keyword: "dwg trueview batch convert dwg version upgrade downgrade"
slug: "dwg-trueview-batch-convert-dwg-version-upgrade-downgrade"
author: "CADGuide Technical Editorial"
readTime: "9 min read"
date: "2026-07-06"
sources:
  - "https://knowledge.autodesk.com/support/dwg-trueview/learn-explore/dwg-convert"
  - "https://www.autodesk.com/support/dwg-file-format"
---

# DWG TrueView Batch Convert: Upgrading and Downgrading DWG File Versions

DWG file format changes with each AutoCAD release. A DWG saved in AutoCAD 2026 can't be opened in AutoCAD 2018 without conversion. DWG TrueView's DWG Convert tool handles this — for free, in batch. I convert hundreds of files per project. Here's the process.

## DWG Version History

| AutoCAD Version | DWG Format | Year |
|----------------|-----------|------|
| AutoCAD 2026 | DWG 2018 | 2026 |
| AutoCAD 2024-2025 | DWG 2018 | 2024 |
| AutoCAD 2021-2023 | DWG 2018 | 2021 |
| AutoCAD 2018-2020 | DWG 2018 | 2018 |
| AutoCAD 2015-2017 | DWG 2013 | 2015 |
| AutoCAD 2013-2014 | DWG 2013 | 2013 |
| AutoCAD 2010-2012 | DWG 2010 | 2010 |
| AutoCAD 2007-2009 | DWG 2007 | 2007 |
| AutoCAD 2004-2006 | DWG 2004 | 2004 |
| AutoCAD 2000-2002 | DWG 2000 | 2000 |
| AutoCAD R14 | DWG R14 | 1997 |

**Key point**: DWG 2018 format has been used since AutoCAD 2018 and is still current in 2026. This means files saved in AutoCAD 2018-2026 are all compatible. If you're converting to share with someone using AutoCAD 2018+, you don't need to convert at all.

## When to Convert

### Downgrade (Newer → Older)

You need to downgrade when:
- A client uses an older AutoCAD version
- A contractor's software only supports older DWG formats
- You're submitting to a government portal that requires a specific format
- You're using third-party software that only supports older DWG

### Upgrade (Older → Newer)

You need to upgrade when:
- AutoCAD prompts "This drawing was created by an older version"
- You want to use newer features (but TrueView doesn't add features — it only converts the format)
- Your BIM software requires a minimum DWG version

## Using DWG Convert

### Step 1: Open DWG Convert

1. In DWG TrueView: **File** → **DWG Convert**.
2. The DWG Convert dialog appears with:
   - **Files list** (left): Files to convert
   - **Conversion setup** (right): Output format and settings
   - **Output folder** (bottom): Destination for converted files

### Step 2: Add Files

1. Click **Add Files** → browse and select DWG files.
2. Or click **Add Folder** → select a folder to add all DWG files in it.
3. Files appear in the list with:
   - **File name**
   - **Current version** (e.g., "DWG 2018")
   - **Size**

4. Remove files: select → click **Remove**.
5. You can mix files of different versions — each will be converted to the target version.

### Step 3: Set Conversion Setup

1. Click **Conversion Setups** → **New** (or edit an existing setup).
2. Name the setup (e.g., "Convert to 2013").
3. Set:

**General tab:**
- **Output format**: 
  - DWG 2018 (current)
  - DWG 2013
  - DWG 2010
  - DWG 2007
  - DWG 2004
  - DWG 2000
  - DWG R14
- **Output folder**: Where converted files are saved
- **Overwrite existing**: Check to replace files with the same name

**Modify tab:**
- **Purge**: Remove unused blocks, layers, and styles (reduces file size)
- **Audit and fix**: Check for errors and attempt repair
- **Explode anonymous blocks**: Convert anonymous blocks to named blocks
- **Bind Xrefs**: Bind external references into the drawing (optional — usually leave unchecked)

**Advanced tab:**
- **Custom scales**: Add or remove annotation scales
- **Remove hidden objects**: Clean up objects not visible in the drawing
- **Convert digital signatures**: Preserve or remove digital signatures

4. Click **OK** to save the setup.

### Step 4: Convert

1. Select the conversion setup from the dropdown.
2. Set the output folder.
3. Click **Convert**.
4. DWG TrueView processes each file:
   - Opens the file
   - Converts to the target format
   - Saves to the output folder
   - Reports success or failure

5. A log file is generated showing the conversion results for each file.

## Common Conversion Issues

### Proxy Objects

When downgrading, newer AutoCAD objects may not exist in older versions:

- **Proxy objects**: Custom objects from AutoCAD verticals (Architecture, Civil 3D, Map) appear as proxy objects in older versions.
- **Proxy display**: The proxy object may display as a block or may not display at all.
- **Solution**: Enable "Proxy graphics" in the conversion setup so proxy objects display (but can't be edited).

### Missing Fonts

If the drawing uses custom fonts that aren't installed on the conversion machine:
- Text may display as simplex or txt.shx (default substitution).
- **Solution**: Install the required fonts before converting, or accept the substitution.

### Xref Paths

External references (Xrefs) use file paths that may not be valid on the conversion machine:
- **Absolute paths**: `C:\Projects\Site Plan.dwg` — may not exist on the target machine.
- **Relative paths**: `..\Site Plan.dwg` — works if the folder structure is preserved.
- **No path**: `Site Plan.dwg` — AutoCAD searches the support paths.

- **Solution**: Use relative paths or bind Xrefs during conversion (if the recipient needs a single file).

### Large File Sizes

Newer DWG files may be significantly larger than older format files due to:
- Additional metadata
- Annotation scales
- Visual styles
- **Solution**: Enable "Purge" and "Remove hidden objects" in the conversion setup.

### Drawing Corruption

Sometimes a DWG file is corrupted and can't be converted:
- **Solution**: Enable "Audit and fix" in the conversion setup. DWG TrueView runs AUDIT on each file and attempts to fix errors.
- If AUDIT can't fix the file, use **RECOVER** command in AutoCAD (not available in TrueView).

## Best Practices

1. **Always keep the original**: Convert to a new folder, don't overwrite the originals. If conversion introduces issues, you still have the original files.

2. **Test with one file first**: Convert one file and verify it opens correctly in the target software before batch-converting hundreds of files.

3. **Document the conversion**: Note the target version and any settings used. If the recipient has issues, you can reproduce the conversion with the same settings.

4. **Use DWG 2013 as a safe default**: DWG 2013 is supported by AutoCAD 2013+ and most third-party software. It's the most compatible format for sharing.

5. **Purge before converting**: Enable purge in the conversion setup to reduce file size and remove unused elements that could cause issues in older versions.

6. **Check the log**: After batch conversion, review the log file for any failures. Re-convert failed files with audit enabled.
