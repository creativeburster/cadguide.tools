---
title: "KISSsoft and Creo Integration: Interface Setup and Troubleshooting"
excerpt: "A PTC Community user reports errors when integrating KISSsoft with Creo 9. The fix: run KISSsoft as administrator, calculate and export the gear first, then use Creo's 'Create New Gear' button."
category: "deployment"
softwareSlug: "kisssoft"
keyword: "kisssoft creo integration interface setup troubleshooting"
slug: "kisssoft-creo-integration-interface-setup"
author: "CADGuide Technical Editorial"
readTime: "6 min read"
date: "2026-07-12"
sources:
  - "https://community.ptc.com/3d-part-assembly-design-327/kisssoft-and-creo-159268"
  - "https://www.eng-tips.com/threads/kisssoft-menu-in-siemens-nx.434708/"
---

# KISSsoft and Creo Integration: Interface Setup and Troubleshooting

A user on the PTC Community forum reported difficulties creating an interface between Creo 9 and KISSsoft 2023. Despite following the KISSsoft manual and trying all three variants, the integration didn't work — clicking "Create New Gear" in Creo produced an error about a missing file.

## The Problem

**Forum post**: PTC Community, "KISSsoft and Creo" (user discussion)

**User's report**: "I am currently working on creating an interface between Creo 9 and KISSsoft. I am following the manual provided by KISSsoft (2023) to complete the necessary steps, but I am encountering difficulties."

**Error**: When clicking "Create New Gear" in Creo 9, an error message appears referring to "Applisoft." The error mentions a folder where no file is present. When the user manually creates a file with the suggested name and clicks "Create New Gear" again, nothing happens — not even an error.

## The Fix

The user eventually found the solution and posted an update:

> "If somebody has the same stupid and very rare problem: You must open KISSsoft as administrator, calculate your gear, export it (3D). Open Creo and click Create New Gear. That's all (that I needed to solve my problem and it worked for me)."

### Step-by-Step Fix

1. **Open KISSsoft as Administrator**:
   - Right-click the KISSsoft shortcut
   - Select "Run as Administrator"
   - This is critical — without admin rights, KISSsoft cannot write the export files to the required location

2. **Calculate the Gear**:
   - Open or create the gear calculation in KISSsoft
   - Run the calculation to completion
   - Ensure there are no errors in the calculation

3. **Export the 3D Model**:
   - In KISSsoft, export the gear as a 3D model
   - This creates the file that Creo's "Create New Gear" button looks for
   - The export must be done while KISSsoft is running as administrator

4. **Open Creo and Create the Gear**:
   - Open Creo 9 (normal mode, no admin needed)
   - Click the **Create New Gear** button (from the KISSsoft integration)
   - Creo reads the exported file and creates the gear model

## Why Administrator Rights Are Required

KISSsoft needs to write files to system directories (typically `C:\Program Files\` or the Creo installation directory) to establish the interface. Without administrator rights, Windows prevents these writes, and the export files are either not created or placed in a virtualized directory that Creo can't find.

The error about a "missing file" in a specific folder occurs because:
1. KISSsoft tried to write the export file to the folder
2. Without admin rights, Windows redirected the write to a virtual store (UAC virtualization)
3. Creo looks in the original folder, not the virtual store
4. The file appears to be missing

## KISSsoft Integration with Other CAD Systems

KISSsoft provides integration with multiple CAD systems. The setup process varies:

### Siemens NX Integration
An Eng-Tips forum user reported: "I installed KISSsoft but I do not see the menu in Siemens NX."

**Fix**:
1. Follow the KISSsoft manual for NX integration:
   - Manual location: `http://www.kisssoft.ch/Manual/en/8984.htm`
   - Tutorial: `http://www.kisssoft.ch/Manual/en/8988.htm`
2. If the menu doesn't appear:
   - Verify the NX version is supported by your KISSsoft version
   - Check environment variables for KISSsoft paths
   - Run NX once after installation to trigger menu registration
   - Contact KISSsoft support if the menu still doesn't appear

### General Integration Checklist

For any CAD integration with KISSsoft:

1. **Check version compatibility**: Verify your KISSsoft version supports your CAD version
   - KISSsoft 2023 supports: SOLIDWORKS, Creo, NX, Inventor, CATIA, Solid Edge
   - Check the KISSsoft product description for specific version numbers
2. **Install the integration**: Run the KISSsoft integration installer for your specific CAD system
3. **Run as administrator**: First-time setup requires admin rights for both KISSsoft and the CAD system
4. **Follow the manual**: Each CAD system has specific setup steps in the KISSsoft manual
5. **Test with a simple gear**: Create a simple spur gear first to verify the integration works before attempting complex geometries

## Common Integration Issues

### Issue: "Create New Gear" Does Nothing
- Run KISSsoft as administrator
- Calculate and export the gear first
- Check that the export file exists in the expected folder
- Verify the CAD system version is supported

### Issue: Error Referring to "Applisoft"
- Applisoft is a third-party integration component used by KISSsoft
- Contact both KISSsoft support and Applisoft support
- The error typically indicates a missing configuration file

### Issue: KISSsoft Menu Not Visible in CAD
- Run the CAD system once after installing the KISSsoft integration
- Check the CAD system's add-in/plugin manager — the KISSsoft add-in may need to be manually enabled
- Verify environment variables point to the correct KISSsoft installation

### Issue: Gear Created but Geometry Is Wrong
- Check the export settings in KISSsoft (3D model format, precision)
- Verify the gear calculation completed without errors
- Check that the correct gear was exported (not a different one from the project)

## KISSsoft Support Resources

- **KISSsoft Manual**: Available at `kisssoft.ch/Manual/`
- **KISSsoft Support**: Contact via the KISSsoft website or your local reseller
- **KISSsoft Tutorials**: Available in the Downloads section of `kisssoft.com`
- **Training**: KISSsoft offers live stream training courses for various modules

## Best Practices

1. **Always run as admin for first-time setup**: This avoids file permission issues
2. **Test with simple geometry first**: Verify the integration with a basic spur gear before complex models
3. **Keep versions synchronized**: Update KISSsoft and your CAD system to compatible versions
4. **Document your setup**: Record the exact steps and settings that work — integration setup can be difficult to reproduce
5. **Contact support early**: If you've tried the manual steps and it still doesn't work, contact KISSsoft support rather than spending hours troubleshooting
