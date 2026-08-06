---
title: "WorkNC Post Processor and Roughing Performance Errors"
excerpt: "WorkNC Post Processor and Roughing Performance Errors: symptoms, root causes, and step-by-step fixes, verified against Practical Machinist and Italian CAD forums."
category: "manufacturing"
softwareSlug: "worknc"
keyword: "WorkNC concatenated post file number COMPOSITE_PP_NAME_SEPARATOR menu97.cfg post processor .dat .ang roughing rest-machining overmetal tool size contouring edge stop support surface scale function miniature calculation time"
slug: "worknc-post-processor-and-roughing-performance-errors"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://www.practicalmachinist.com/forum/threads/worknc-v19-postpro-question.319972/"
  - "https://www.practicalmachinist.com/forum/threads/about-work-nc.243960/"
  - "https://3dcad.news/community/threads/worknc-per-stampi.61849/"
---

# WorkNC Post Processor and Roughing Performance Errors: Concatenated Post File Number Adds Extra Digits from COMPOSITE_PP_NAME_SEPARATOR, Post Processor Development Requires .dat and .ang File Editing, Roughing Rest-Machining Performance Poor with Overmetal and Tool Size Changes, Contouring Does Not Stop on Edges Requiring Support Surface Construction, and Small Tool Scale Function Required for Miniature Work Increasing Calculation Times

WorkNC's post processors and roughing strategies suffer from file numbering issues, poor rest-machining performance, and contouring limitations. This guide covers the 5 most common WorkNC problems with diagnostic steps and community-verified fixes from Practical Machinist and Italian CAD forums.

## 1. Concatenated Post File Number Adds Extra Digits

### Symptom

WorkNC V19 posts G-code with 4-digit program numbers for Fanuc controllers. When posting concatenated post processes, the software adds an extra 2 digits to the end of the specified program number, relating to the number of concatenated post processes in the workzone. There's no obvious way to stop this.

### Root Cause

The concatenated post-processing feature automatically appends a sequence number to the file name. The `COMPOSITE_PP_NAME_SEPARATOR` in `menu97.cfg` defines the separator character used when forming the prefix of concatenated post-processed files. The extra digits are the sequence identifiers for each concatenated process.

### Fix

1. **Check the separator in menu97.cfg**:
   - Navigate to `C:\WorkNC19\client\instsite\`
   - Find `menu97.cfg`
   - Go about 2/3 of the way down
   - Find: `COMPOSITE_PP_NAME_SEPARATOR = _`
   - The separator is used between the program number and the sequence digits

2. **Post as a single (non-concatenated) post**:
   - When posting as a single post, the extra digits are not added
   - Use this if you need exact control over the program number

3. **Edit the post processor (.dat file)**:
   - The post processor is a `.dat` file in `C:\WorkNC19\pospro\`
   - Send the .dat file and any .ang scripts to WorkNC support for modification
   - Support can modify the file naming logic
   - Note: support response may take weeks or months

4. **Rename the file after posting**:
   - Post the concatenated file
   - Rename the output file to remove the extra digits
   - This is a manual workaround but effective

5. **Modify the post script (.ang file)**:
   - If .ang scripts are used for the post, modify the file naming logic
   - The .ang script controls how the output filename is constructed
   - Remove or modify the sequence number appending logic

### Community Report

> "The software adds an extra 2 numbers onto the end of the specified number which relates to the number of concatenated post process. Is there any way of stopping the software from adding these 2 numbers? No. You can't even set the program number."

> "Take a look in your C:\WorkNC19\client\instsite folder. Find menu97.cfg. Find the line: COMPOSITE_PP_NAME_SEPARATOR = What does it equal?"

## 2. Post Processor Development Requires .dat and .ang File Editing

### Symptom

Need to configure post processors for WorkNC 19 G3. The company no longer wants to deal with the WorkNC reseller. Post processor development requires understanding .dat and .ang file formats.

### Root Cause

WorkNC post processors are not standard open formats. They use proprietary .dat files for the post configuration and .ang scripts for custom logic. Without reseller support, users must develop expertise in these file formats themselves.

### Fix

1. **Understand the .dat file format**:
   - Located in `C:\WorkNC19\pospro\`
   - Contains the post processor configuration for a specific machine
   - Defines G-code format, tool change, coolant, etc.
   - Editable in a text editor

2. **Understand .ang scripts**:
   - Optional script files for custom post logic
   - Used for machine-specific modifications
   - May not exist for all posts
   - If they exist, they need to be modified alongside the .dat file

3. **Start from an existing post**:
   - Find the closest matching post for your machine
   - Copy the .dat file and modify it
   - Test with simple parts first
   - Gradually add complexity

4. **Contact WorkNC support (with patience)**:
   - WorkNC support is known to be slow
   - Provide detailed information about your machine and requirements
   - Follow up regularly

5. **Join user communities**:
   - Practical Machinist forum has WorkNC users
   - Italian CAD forums (CAD3D.it, 3dcad.news) have WorkNC discussions
   - Share post processor solutions with other users

6. **Consider alternative CAM packages**:
   - Some users switched to hyperMILL or other CAM systems
   - Evaluate if post processor issues justify a CAM switch

### Community Report

> "I find that WorkNC is very bad when it comes to the post processing. There is no way that I know of to do what you want. Maybe you can contact support and they'll get back to you in a few weeks or months."

## 3. Roughing Rest-Machining Performance Poor with Overmetal and Tool Size Changes

### Symptom

When roughing with a D10 tool and setting overmetal +0.3, then switching to a D4 tool with the same overmetal, the D4 tool should only go back where the D10 doesn't pass. Instead, the rest-machining operation is not performing well — the D4 tool machines areas it shouldn't need to.

### Root Cause

WorkNC's roughing rest-machining strategy doesn't efficiently detect and machine only the remaining stock after a larger tool. The overmetal setting (stock to leave) is applied uniformly, and the rest-machining algorithm doesn't properly compare the previous tool's machined volume with the current tool's accessible volume.

### Fix

1. **Use different overmetal for the smaller tool**:
   - Don't use the same overmetal for both tools
   - The D10 with +0.3 overmetal leaves 0.3mm stock
   - The D4 should use a smaller overmetal (e.g., +0.1) to clean up closer to the surface
   - This forces the D4 to machine only the areas the D10 couldn't reach

2. **Use WorkNC's rest-machining feature properly**:
   - Ensure the rest-machining option is enabled in the roughing parameters
   - The previous tool path must be referenced correctly
   - Check that the stock model is updated after the D10 operation

3. **Use a separate roughing strategy for rest-machining**:
   - Don't use the same roughing strategy for both tools
   - Use a dedicated rest-machining or pencil machining strategy for the D4
   - These strategies are designed to detect remaining stock

4. **Consider switching to hyperMILL or PowerMill**:
   - Other CAM systems have more efficient rest-machining algorithms

5. **Use stock model tracking**:
   - Ensure WorkNC's stock model is enabled and tracking material removal
   - The stock model should be updated after each operation
   - The D4 operation should reference the updated stock model

### Community Report

> "Start with a tool D10 and impose overmetal +0.3, then put tool D4 with same overmetal. The D4 only has to go back where the D10 does not pass, but for these operations I do not find it performing."

> "I think one has to start contributing in the finishes, but for roughing and rest-machining, no! Otherwise we return to the 90s!"

## 4. Contouring Does Not Stop on Edges Requiring Support Surface Construction

### Symptom

In contouring operations, the toolpath does not stop on the edge of the part but rotates slightly around the edge. The user cannot extend in tangency or stop the tool halfway on the edge. The "extensive processing check" parameter is always blocked.

### Root Cause

WorkNC's contouring strategy doesn't have native edge-detection or tangency extension. The toolpath follows the surface boundary, which may cause the tool to wrap around edges slightly. Without support surfaces, the toolpath can't be controlled at edges.

### Fix

1. **Construct support surfaces**:
   - Create support surfaces (also called "drive surfaces" or "check surfaces") at the edges
   - These surfaces act as boundaries for the toolpath
   - The toolpath stops at the support surface instead of wrapping around

2. **Create protective surfaces in the CAD model**:
   - Before programming, create protective surfaces in the CAD model
   - These surfaces define where the toolpath should stop
   - Import them into WorkNC as separate geometry
   - Use them as check surfaces in the contouring operation

3. **Use different overmetal on support surfaces**:
   - Create support surfaces with a different overmetal value
   - Color-code them differently from the original 3D model
   - Group them and assign specific milling strategies
   - This allows finer control over edge behavior

4. **Try a different contouring strategy**:
   - WorkNC has multiple contouring strategies
   - Try a different strategy that may handle edges better
   - Some strategies have built-in edge control

5. **Accept the limitation**:
   - "90's help" — this is a known limitation of WorkNC
   - Other CAM systems (hypermILL, PowerMill) have better edge control
   - If edge precision is critical, consider a CAM switch

### Community Report

> "In the trim of shouldering in contouring, it does not stop on the edge of the edges but turns slightly around. I cannot extend in tangency the workmanship or stop the tool halfway on the edge. The assistance told me that you have to protect the edge by building support surfaces — 90's help."

## 5. Small Tool Scale Function Required for Miniature Work

### Symptom

Cannot use very small tools (e.g., 0.010 inch / 0.25mm diameter endmill) directly. The software requires scaling the part up to use small tools, then scaling the G-code back down. This increases calculation times significantly.

### Root Cause

WorkNC's internal precision and resolution is optimized for typical mold/die manufacturing scales. Very small tools (below ~0.5mm) fall below the software's default resolution, causing inaccurate toolpaths. The scale function increases the model size to bring the tool diameter into the software's optimal resolution range.

### Fix

1. **Use the Scale function**:
   - Scale the part up by 10x or 100x
   - Program the toolpaths at the larger scale
   - Scale the G-code output back down

2. **Accept longer calculation times**:
   - Scaling increases calculation times proportionally
   - Plan for longer programming time
   - Use parallel processing if available

3. **Use a different CAM system for miniature work**:
   - Some CAM systems handle small tools natively without scaling
   - Fusion 360, Mastercam, and hyperMILL support small tools directly
   - If miniature work is common, consider switching

4. **Verify G-code after scaling back**:
   - After scaling the G-code back down, verify all coordinates
   - Check tool offsets and work offsets
   - Verify feed rates are correct for the actual scale
   - Test with air cutting first

5. **Check if the latest version improves small tool support**:
   - WorkNC has been updating its capabilities
   - Check if the latest version supports small tools without scaling

### Community Report

> "You can't use a .010 diameter endmill, you have to scale the part up. The scale function increases the resolution to a higher degree for increased precision with the trade-off of making the calc times longer."

## 6. Additional WorkNC Issues

### Slow Support Response

**Issue**: WorkNC support takes weeks or months to respond to post processor requests.
**Fix**: Develop in-house post expertise. Join user communities for peer support. Consider switching to a CAM system with better support.

### Outdated UI and Graphics

**Issue**: WorkNC's interface looks dated ("90's setting layout") with poor graphics ("reminds me of playing PONG on an ATARI").
**Fix**: Check if the latest version (V21+) has improved UI. Consider modern CAM alternatives if UI is a major concern.

### Lack of 3D Model Hole Machining

**Issue**: WorkNC couldn't machine holes from 3D models (as of 2014).
**Fix**: Later versions may have added this capability. Verify with the latest version. If still missing, use a different CAM system for hole-making operations.

### Toolholder Remote Desktop Wipe

**Issue**: WorkNC tech support remotely wiped out toolholder models during a support session.
**Fix**: Always backup toolholder libraries before allowing remote support access. Don't grant remote access without confirming what will be modified.

### Post Never Worked for DMU-70 EVO

**Issue**: WorkNC tech support spent 3 weeks trying to write a post for a DMU-70 EVO and never got it right. HSMworks worked on the first try.
**Fix**: If WorkNC can't produce a working post for your machine, evaluate alternative CAM systems. Post processor availability is critical — a CAM system without a working post is useless.

## Best Practices

1. **Post as single (non-concatenated) for exact program numbers** — avoids extra digits
2. **Check COMPOSITE_PP_NAME_SEPARATOR in menu97.cfg** — controls file naming
3. **Keep backups of .dat and .ang post files** — before any modifications
4. **Use different overmetal for rest-machining tools** — forces smaller tool to clean up
5. **Build support surfaces for edge control** — WorkNC's contouring needs them
6. **Use the Scale function for tools below 0.5mm** — increases resolution
7. **Plan for longer calc times when scaling** — proportional to scale factor
8. **Develop in-house post expertise** — don't rely solely on slow support
9. **Backup toolholder libraries before remote support** — prevent data loss
10. **Evaluate alternative CAM systems if post issues persist** — post availability is critical
