---
title: "AlphaCAM Router Toolpath Setup: Rough/Finish Profiling, Tool Selection, and Post Processing"
excerpt: "Configure AlphaCAM router toolpaths for woodworking CNC: rough and finish profiling operations, tool selection from the library, tool direction setup, and G-code post processing for 3-axis routers."
category: "workflow"
softwareSlug: "alphacam"
keyword: "alphacam router toolpath rough finish profiling post processor"
slug: "alphacam-router-toolpath-rough-finish-profiling-post-processing"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://cadcamlessons.com/alphacam-basics-rough-finish/"
  - "https://docs.vectric.com/docs/V12.0/AlphaCAM/ENU/Help/form/03-getting-started-the-cnc-workflow/index.html"
---

# AlphaCAM Router Toolpath Setup: Rough/Finish Profiling, Tool Selection, and Post Processing

AlphaCAM is one of the most widely used CAM systems for CNC routing in woodworking and sign-making. The workflow is straightforward once you understand the relationship between geometry, tool direction, and post processing. I'll walk through the complete process from drawing to G-code.

## The CNC Workflow in AlphaCAM

Every AlphaCAM project follows the same sequence:

1. **Create or import geometry** — draw in AlphaCAM or import DXF/DWG
2. **Set tool directions** — define which side of the geometry to machine
3. **Select a tool** from the tool library
4. **Create a machining operation** — rough, finish, pocket, drill, etc.
5. **Select the post processor** — matches your CNC machine controller
6. **Output NC code** — generates the G-code file

## Tool Selection

Before creating any machining operation, you need to select a tool:

1. Go to the **Machine tab** and click **Select Tool**
2. The tool library opens — the default location is `C:\Alphacam\LICOMDAT\rtools.alp`
3. Choose a tool appropriate for your operation:
   - **End mill** for profile cutting and pocketing
   - **Ball nose** for 3D surfacing
   - **V-bit** for engraving and chamfering
   - **Profile tool** for decorative edge profiling
4. Click the tool, then click in the workspace to confirm selection

You can organize tools in sub-folders within the tool library for different machine types or material categories.

## Tool Directions

Tool direction is critical — it determines which side of the geometry the tool cuts on. Getting this wrong means the tool cuts on the wrong side and ruins the part.

1. Press **Ctrl+G** to show geometry direction arrows
2. Each arrow shows the direction and machining side
3. Go to **Machine tab > Tool Directions**
4. For **closed geometries** (rectangles, circles):
   - Set **Direction** (CW or CCW)
   - Set **Side** (Inside or Outside)
5. For the outer contour: typically CW direction, Outside side
6. For inner features (holes, pockets): typically CCW direction, Inside side

The arrow updates in real-time as you change settings. Verify all arrows before creating operations.

## Rough or Finish Profiling

The Rough or Finish operation is the most common profiling toolpath in AlphaCAM:

1. Go to **Machine tab > Rough or Finish**
2. The operation dialog opens with several tabs:
   - **General** — operation name, compensation type
   - **Leads** — lead in/out moves to avoid entry marks
   - **Depth** — total cut depth, number of passes, step-down
   - **Feed Rates** — cutting feed, plunge rate, spindle speed
3. Set the **total depth** and **number of passes** — for a 16mm material, use 4 passes of 4mm each
4. Set **lead in/out** — arc leads of 5mm radius prevent visible entry marks
5. Click **OK** and select the geometry to machine
6. The toolpath appears as a light-blue line

### Checking the Toolpath

After generating the toolpath, always verify it visually:

- The toolpath should be offset from the geometry by the tool radius
- For outside profiling, the toolpath is outside the contour
- For inside profiling, the toolpath is inside the contour
- Check for rapid moves (G0) that could cause collisions

## Post Processing

The post processor translates AlphaCAM toolpaths into G-code for your specific CNC machine:

1. Go to **Home tab > Select Post**
2. The default folder is `C:\Alphacam\LICOMDAT\RPost.Alp`
3. Select the post that matches your machine:
   - `Alpha Standard 3Ax Router.arp` — generic 3-axis router
   - Custom posts for specific controllers (Fanuc, Siemens, etc.)
4. Go to **Home tab > Output NC**
5. Choose the output destination (file, machine, or both)
6. Specify the file name and location
7. Enter a program number (or leave blank)
8. The G-code file is generated

### Common G-Code Issues

Check the generated G-code for these common problems:

- **Rapid move to Z0** — `G0 Z0` is dangerous and can cause collisions. The safe Z height should be above the workpiece. Check the post processor's safe Z setting.
- **Missing tool changes** — ensure the post outputs `Txx M06` for each tool change
- **Wrong feed rates** — verify that the feed rates in the G-code match what you set in the operation

## Profile Machining for Decorative Edges

For decorative edge profiles (crown molding, raised panels):

1. Draw the part outline in 2D
2. Draw the **profile cross-section** on the same 2D sheet — it must be a joined contour
3. Set the tool direction for the reference line (the edge where the profile applies)
4. Create a **Profiled Rough/Finish** operation
5. Select the reference geometry, then click the profile and its reference point
6. Enable **bidirectional** for the profiled rough/finish
7. Use **error control** to adjust the number of passes — finer settings produce smoother finishes

For deep profiles, rough out the bulk material first with a flat-bottom tool, then finish with the profile tool.

## Best Practices

- **Always verify tool directions** before creating operations
- **Check the G-code** for rapid move safety before running on the machine
- **Use lead in/out** to prevent visible entry marks on finished surfaces
- **Set appropriate step-down** — typically 50-70% of tool diameter for roughing
- **Save tools in organized sub-folders** for different machine types
- **Test new post processors** on simple parts before complex jobs
