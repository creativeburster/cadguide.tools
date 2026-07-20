---
title: "Navisworks Freedom and Review: Free Model Viewer, Walkthroughs, and Collaboration Tools"
excerpt: "A guide to using Navisworks Freedom (free viewer) and Navisworks Manage review tools covering NWD file distribution, real-time walkthroughs, sectioning, measuring, commenting, and redlining for project team collaboration."
category: "workflow"
softwareSlug: "navisworks"
keyword: "navisworks freedom viewer review"
slug: "navisworks-freedom-review-free-viewer-walkthroughs-collaboration"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://help.autodesk.com/view/NAV/2024/ENU/"
  - "https://www.autodesk.com/products/navisworks/overview"
---

# Navisworks Freedom and Review: Free Model Viewer, Walkthroughs, and Collaboration Tools

Not everyone on a construction project needs a full Navisworks Manage license. Navisworks Freedom is the free viewer that opens NWD files for review, walkthroughs, and basic measurement. This guide covers the review and collaboration workflow using both Freedom and Manage.

## Navisworks Freedom

### What Freedom Can Do

- Open and view NWD files
- Navigate in 3D (orbit, pan, zoom, walk, fly)
- Use Saved Viewpoints
- Use Sectioning tools
- Measure distances and areas
- Add comments and redlines
- Play animations and simulations
- Export images (screenshots)

### What Freedom Cannot Do

- Open NWC or native format files (only NWD)
- Run clash detection
- Run TimeLiner simulations (can play pre-configured simulations)
- Run Quantification
- Export video (only screenshots)
- Append multiple files

### Distribution Strategy

1. **Navisworks Manage users** (coordinators, BIM managers): Create the NWD file
2. **Navisworks Freedom users** (project managers, clients, contractors): Review the NWD file
3. **Publish NWD weekly** — refresh the published file after model updates
4. **Share via project portal** — upload to BIM 360, SharePoint, or FTP

## Publishing NWD Files

### From Navisworks Manage

1. File > Publish NWD
2. Set:
   - **File name**: `ProjectName_Coordination_YYYYMMDD.nwd`
   - **Password protection**: Optional (for confidential projects)
   - **Include embedded properties**: Yes (enables measurement and properties review)
   - **Include current viewpoints**: Yes (saved viewpoints are available in Freedom)
   - **Include current sectioning**: Yes (section planes are preserved)
3. Click "Publish"
4. The NWD file is a self-contained package

### File Size Management

- NWD files compress geometry — typically 10-20% of the original model size
- For very large projects, publish by building section or floor
- Use the "Reduce File Size" option to further compress (may reduce visual quality slightly)

## Navigation and Walkthroughs

### Navigation Modes

1. **Orbit**: Rotate around the model center (most common for review)
2. **Pan**: Move the view horizontally or vertically
3. **Zoom**: Move closer or farther
4. **Walk**: First-person walkthrough (use arrow keys or WASD)
5. **Fly**: Free movement in any direction
6. **Zoom to Fit**: Frame all visible elements

### Walkthrough Mode

1. View > Navigation > Walk
2. Use keyboard controls:
   - **W/Up**: Move forward
   - **S/Down**: Move backward
   - **A/Left**: Turn left
   - **D/Right**: Turn right
   - **Q**: Move up
   - **E**: Move down
   - **Shift**: Move faster
3. Set collision detection:
   - View > Navigation > Collision Detection > On
   - Prevents walking through walls and floors
4. Set eye height:
   - Typical: 1.7m (average person height)
   - Adjust for different viewing perspectives

### Saved Viewpoints

1. Navigate to a desired view
2. View > Saved Viewpoints > Save
3. Name the viewpoint (e.g., "Main Entrance", "Level 3 Corridor", "Roof Top")
4. Create viewpoints for:
   - Key architectural features
   - Clash hotspots
   - Construction sequencing milestones
   - Client presentation angles
5. Share viewpoints via the NWD file — all Freedom users see them

## Sectioning

### Creating Section Planes

1. View > Sectioning > Enable Sectioning
2. Choose section type:
   - **Plane**: Single cutting plane
   - **Box**: Six-plane box (cut from all sides)
3. For a plane:
   - Set normal direction (X, Y, Z, or custom)
   - Set position (drag the plane or enter coordinate)
4. For a box:
   - Set six plane positions to define the visible volume
5. The model is cut at the section plane(s)

### Using Sections for Review

1. **Floor plan section**: Set a horizontal plane at 1.5m above floor level
2. **Building section**: Set a vertical plane through the building
3. **Detail section**: Use a box to isolate a small area for close inspection
4. Save sectioned views as Saved Viewpoints

### Section Animation

1. Create a section plane
2. View > Sectioning > Animate Section
3. Set start and end positions
4. Navisworks animates the section moving through the building
5. Useful for showing interior spaces progressively

## Measuring

### Distance Measurement

1. Review > Measure > Distance
2. Click two points in the 3D model
3. Navisworks displays:
   - **Delta X, Delta Y, Delta Z**: Component distances
   - **Total distance**: Straight-line distance
4. Use snapping for accurate measurements (endpoint, center, intersection)

### Area Measurement

1. Review > Measure > Area
2. Click multiple points to define a polygon
3. Close the polygon
4. Navisworks displays the enclosed area

### Point Coordinates

1. Review > Measure > Point
2. Click any point in the model
3. Navisworks displays X, Y, Z coordinates

## Commenting and Redlining

### Adding Comments

1. Review > Comments > Add Comment
2. Navigate to the issue location
3. Type the comment
4. Set:
   - **Status**: Open, In Progress, Resolved
   - **Assigned to**: Person responsible
   - **Due date**: Resolution deadline
5. The comment is attached to the current viewpoint
6. Comments are saved in the NWD file and visible to all Freedom users

### Redlining

1. Review > Redline > choose tool (line, circle, rectangle, cloud, text)
2. Draw on the 3D view to highlight issues
3. Redlines are attached to the current viewpoint
4. Redlines are 2D overlays — they don't interact with 3D geometry
5. Use redline clouds to mark areas requiring changes

### Comment Management

1. Review > Comments > Comment List
2. View all comments in a list:
   - Comment text
   - Status (Open, Resolved)
   - Assigned person
   - Viewpoint (click to navigate)
3. Filter by status, assignee, or date
4. Update status as issues are resolved

## Comparison Tools

### Model Comparison (Manage only)

1. Home > Compare
2. Load two versions of the same model (e.g., Revit R1 and R2)
3. Navisworks highlights:
   - **Added elements**: Green (in new, not in old)
   - **Deleted elements**: Red (in old, not in new)
   - **Modified elements**: Yellow (geometry or properties changed)
   - **Unchanged**: Gray
4. Use for:
   - Tracking design changes between revisions
   - Verifying that requested changes were implemented
   - Auditing model updates

### Visual Comparison

1. Open the first model
2. File > Merge > select the second model
3. Use different colors for each model
4. Visually compare alignment and changes

## Export and Sharing

### Screenshot Export

1. Navigate to the desired view
2. File > Export > Image
3. Set:
   - **Format**: PNG (lossless) or JPG (compressed)
   - **Resolution**: 1920×1080 (screen) or 3840×2160 (print)
   - **Include watermark**: Optional
4. Save the image

### Viewpoint Export

1. View > Saved Viewpoints > Export
2. Export viewpoints as XML
3. Import into another Navisworks session
4. Share standard viewpoints across the team

### NWD with Comments

1. After adding comments and redlines
2. File > Save As NWD
3. The NWD includes all comments, redlines, and viewpoints
4. Distribute to the project team for review

## Best Practices for Review Workflows

1. **Publish NWD weekly** — keep reviewers working with the latest model
2. **Create standard viewpoints** — ensure everyone looks at the same views
3. **Use comments for issues** — don't track issues in email
4. **Assign comments to specific people** — accountability drives resolution
5. **Update comment status regularly** — keep the issue list current
6. **Use sectioning for interior review** — don't rely on orbit alone
7. **Set collision detection for walkthroughs** — realistic navigation
8. **Name files with dates** — `Project_20260630.nwd` for clear version tracking
9. **Train Freedom users** — 30 minutes of training is sufficient for most reviewers
10. **Use screenshots for reports** — combine with comments for meeting minutes

## Conclusion

Navisworks Freedom and the review tools in Manage provide a complete model review workflow for the entire project team. By publishing NWD files from Manage, distributing them to Freedom users, and using viewpoints, sectioning, measuring, commenting, and redlining, the team can collaborate effectively around the BIM model. The free Freedom license ensures that all stakeholders — from clients to subcontractors — can access and review the model without additional software costs. By following the best practices in this guide, you can establish a structured review process that keeps the entire project team aligned.
