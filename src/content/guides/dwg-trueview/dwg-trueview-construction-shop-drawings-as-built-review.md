---
title: "DWG TrueView for Construction: Reviewing Shop Drawings and As-Builts On Site"
excerpt: "How construction professionals can use DWG TrueView on site for reviewing shop drawings, checking dimensions, verifying as-built conditions, and plotting full-size drawings without AutoCAD."
category: "deployment"
softwareSlug: "dwg-trueview"
keyword: "dwg trueview construction shop drawings as-built review"
slug: "dwg-trueview-construction-shop-drawings-as-built-review"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://www.autodesk.com/viewers"
  - "https://thatcadgirl.com/faq/use-dwg-convert-save-dwg-files-earlier-version/"
---

# DWG TrueView for Construction: Reviewing Shop Drawings and As-Builts On Site

On a construction site, you need to view drawings quickly, measure dimensions, and print full-size plots — but you don't always have an AutoCAD license. DWG TrueView fills this gap. We've used it on job sites for years. Here's the field workflow.

## Setting Up DWG TrueView for Site Use

### Installation

1. Install DWG TrueView on the site computer (Windows laptop or desktop).
2. The installation is ~700MB — download before going to site if internet is unreliable.
3. No license or activation needed — it's completely free.

### File Organization

Set up a consistent folder structure for project drawings:

```
C:\Project\
├── 00-Issued\           (Design drawings from the architect/engineer)
│   ├── Rev-1\
│   ├── Rev-2\
│   └── Rev-3\           (Latest revision)
├── 01-Shop-Drawings\    (Submittals from subcontractors)
│   ├── Steel\
│   ├── MEP\
│   └── Architectural\
├── 02-As-Built\         (Field-verified drawings)
├── 03-RFI\              (Requests for Information)
└── 04-Changes\          (Change orders and revised drawings)
```

This organization helps you quickly find the right drawing when standing on site with a subcontractor asking a question.

## Reviewing Shop Drawings

### Step 1: Open the Shop Drawing

1. **File** → **Open** → select the shop drawing DWG.
2. Shop drawings are typically submitted in DWG or PDF format. For DWG files, TrueView opens them directly.

### Step 2: Compare with Design Drawing

1. **File** → **DWG Compare**.
2. Select:
   - Drawing 1: The design drawing (from the architect/engineer)
   - Drawing 2: The shop drawing (from the subcontractor)
3. Run the comparison.
4. Review differences:
   - **Green (added)**: Subcontractor added elements not in the design — check if they're necessary
   - **Red (deleted)**: Subcontractor omitted elements from the design — check if intentional
   - **Yellow (modified)**: Subcontractor changed dimensions or positions — verify compliance

5. Common shop drawing deviations:
   - **Steel fabricator**: Changed bolt hole sizes, modified connection details
   - **MEP contractor**: Routed ducts/pipes differently than shown on design
   - **Door supplier**: Changed frame types or hardware schedules

### Step 3: Measure Critical Dimensions

1. **View** → **Measure** → **Distance**.
2. Check critical dimensions:
   - **Clearance**: Distance between structural elements and MEP runs
   - **Opening sizes**: Door and window rough openings
   - **Embed locations**: Distance from column centerlines to embed plates
   - **Slope**: Use angle measurement to verify drainage slopes

3. Compare measured dimensions with the specification requirements.

### Step 4: Check Layer Information

1. **View** → **Layer Properties**.
2. Turn on/off layers to isolate specific trades:
   - Turn off everything except "Structural" to review steel details
   - Turn off everything except "MEP" to review ductwork routing
   - Turn on "Dimensions" to verify all required dimensions are shown

3. Check that the shop drawing includes all required layers:
   - Dimensions
   - Notes and callouts
   - Material specifications
   - Weld symbols (for steel)

### Step 5: Mark Up and Return

1. Use the markup tools (via Design Review integration):
   - Add cloud marks around areas needing revision
   - Add text notes with review comments
   - Stamp as "Approved", "Approved as Noted", or "Revise and Resubmit"

2. Export the marked-up drawing as PDF:
   - **Output** → **Plot** → select **DWG to PDF.pc3**
   - Set paper size to match the drawing (A1, A2, or full size)
   - Plot to PDF

3. Email the marked-up PDF to the subcontractor for revision.

## Verifying As-Built Conditions

### Step 1: Import Field Measurements

1. Open the design drawing in DWG TrueView.
2. **View** → **Measure** → **Distance** to check design dimensions.
3. Compare with field measurements (from tape measure, laser distance meter, or total station).

### Step 2: Document Discrepancies

1. If field measurements differ from design:
   - Note the discrepancy (e.g., "Wall at Grid B is 50mm off from design position")
   - Use the measurement tool to show the design dimension
   - Take a screenshot: **Tools** → **Screenshot** → save as PNG

2. Create an RFI (Request for Information):
   - Attach the screenshot showing the discrepancy
   - Describe the field condition
   - Request guidance from the architect/engineer

### Step 3: Update As-Built Drawings

1. While TrueView can't edit drawings, you can:
   - Note all as-built deviations in a spreadsheet
   - Send the notes to the CAD operator for updating the DWG
   - Or use AutoCAD Web (free) for minor edits

2. For full as-built drawing updates, the CAD operator uses AutoCAD to modify the original DWG based on field notes.

## Printing Full-Size Drawings On Site

### Plotter Setup

1. Connect a large-format plotter (HP DesignJet, Canon imagePROGRAF) to the site computer.
2. **Output** → **Plot** → select the plotter as the printer.
3. Set:
   - **Paper size**: A1 (594×841mm) or A0 (841×1189mm) — match the drawing size
   - **Plot scale**: 1:1 (full size) — critical for construction drawings
   - **Plot area**: Extents or Window (select the area to print)
   - **Orientation**: Match the drawing orientation

4. Click **Preview** → verify the output looks correct.
5. Click **OK** to plot.

### PDF for Sharing

1. **Output** → **Plot** → select **DWG to PDF.pc3**.
2. Set paper size and scale (1:1 for full size, or fit-to-page for review copies).
3. Plot to PDF.
4. Email the PDF to team members who don't have DWG TrueView.

### Batch Plotting

For printing an entire drawing set:

1. **Output** → **Batch Plot**.
2. Add all DWG files in the project folder.
3. Set the same plot settings for all files (or customize per file).
4. Click **Plot** — all drawings print in sequence.
5. This saves hours of opening and plotting each file individually.

## Site Workflow Tips

1. **Keep drawings organized by revision**: Never overwrite an older revision. When Revision 3 arrives, put it in a new folder. This preserves the revision history for dispute resolution.

2. **Use DWG Compare for every revision**: When a new revision arrives, compare it with the previous revision before distributing to the team. Knowing what changed prevents construction errors.

3. **Print at full size**: Never print construction drawings at reduced scale. A 1:50 drawing printed at 1:75 will have incorrect dimensions — contractors will measure from the print and get wrong values.

4. **Keep TrueView updated**: Autodesk updates DWG TrueView with each AutoCAD release. Update annually to ensure compatibility with the latest DWG format.

5. **Carry a USB with TrueView installer**: If the site computer needs to be replaced, you can install TrueView without internet access.

6. **Use the command line for speed**: Type `Z` + `E` + Enter for Zoom Extents. Type `LAYER` to open the layer manager. These shortcuts are faster than clicking ribbon buttons.
