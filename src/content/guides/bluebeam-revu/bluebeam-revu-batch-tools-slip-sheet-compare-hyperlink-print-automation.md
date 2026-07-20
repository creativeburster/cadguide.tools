---
title: "Bluebeam Revu Batch Tools: Slip Sheet, Compare, Hyperlink, and Print Automation"
excerpt: "A guide to Bluebeam Revu's batch processing tools covering slip sheeting for drawing revisions, document comparison for change tracking, automatic hyperlinking for navigation, and batch printing for large drawing sets."
category: "workflow"
softwareSlug: "bluebeam-revu"
keyword: "bluebeam revu batch tools"
slug: "bluebeam-revu-batch-tools-slip-sheet-compare-hyperlink-print-automation"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://support.bluebeam.com/articles/category/revu-batch/"
  - "https://www.bluebeam.com/product/revu/"
---

# Bluebeam Revu Batch Tools: Slip Sheet, Compare, Hyperlink, and Print Automation

Managing large drawing sets is one of the most time-consuming tasks in construction document management. Bluebeam Revu's batch tools automate slip sheeting, comparison, hyperlinking, and printing across hundreds of PDF pages. This guide covers each batch tool and how to use it efficiently.

## Batch Slip Sheet

### What Slip Sheeting Does

Slip sheeting replaces old drawing pages with new revisions while preserving all markups from the old version. When a new drawing revision arrives, instead of starting over, you slip sheet the new page into the existing set and carry over all review markups.

### Running Batch Slip Sheet

1. File > Batch > Slip Sheet
2. Set:
   - **Current file**: The existing drawing set with markups
   - **New file**: The revised drawing set
3. Matching options:
   - **Match by page label**: Match pages by their label (e.g., "A-101")
   - **Match by page number**: Match by sequential page number
   - **Match by file name**: Match by original file name
4. Click "Slip Sheet"
5. Revu replaces matching pages with new versions
6. All markups from old pages are transferred to new pages

### Reviewing Transferred Markups

After slip sheeting:
1. Markups that fall on unchanged geometry appear normally
2. Markups that fall on changed geometry are flagged with a warning icon
3. Review each flagged markup:
   - If the issue is still relevant, keep the markup
   - If the revision resolved the issue, mark as "Resolved"
4. This ensures no review comments are lost during drawing revisions

### Best Practices for Slip Sheeting

- Use consistent page labels across revisions (A-101, A-102, etc.)
- Always keep the previous version as backup before slip sheeting
- Review all flagged markups after slip sheeting
- Export the markup list before and after slip sheeting to verify nothing was lost

## Batch Compare Documents

### What Compare Does

Compare Documents identifies differences between two versions of a drawing set. It highlights added, deleted, and modified content on each page.

### Running Compare

1. File > Batch > Compare Documents
2. Set:
   - **Document A**: Old version
   - **Document B**: New version
3. Comparison options:
   - **Compare by**: Visual appearance or text content
   - **Color coding**:
     - Added content: Green
     - Deleted content: Red
     - Modified content: Yellow
   - **Sensitivity**: Low (major changes only) to High (minor pixel changes)
   - **Auto-align**: Yes (compensates for slight position shifts)
4. Click "Compare"
5. Revu generates a comparison report with:
   - Page-by-page summary
   - Count of additions, deletions, modifications per page
   - Visual overlay showing changes

### Using Compare Results

1. Navigate to pages with changes (sorted by change count)
2. Review each change:
   - Green: New content added — verify it's correct
   - Red: Content removed — verify it was intentional
   - Yellow: Content modified — verify the modification
3. Add markups to flag concerns about changes
4. Export the comparison report as PDF for project records

### Overlay Comparison

For a visual overlay approach:
1. Document > Overlay Pages
2. Select two or more PDFs
3. Assign colors per document (e.g., old = red, new = blue)
4. Revu overlays the drawings
5. Interpretation:
   - **Red only**: Deleted in new version
   - **Blue only**: Added in new version
   - **Purple (red + blue overlap)**: Unchanged

## Batch Hyperlink

### What Batch Hyperlink Does

Automatically creates hyperlinks between drawing references:
- Detail callouts on floor plans → detail sheets
- Section markers → section sheets
- Elevation markers → elevation sheets
- Schedule references → schedule pages

### Running Batch Hyperlink

1. File > Batch > Hyperlink
2. Select the PDF file(s) to process
3. Set:
   - **Hyperlink type**: 
     - **By text**: Search for text patterns (e.g., "See Detail 4/A-501")
     - **By region**: Search in specific areas (e.g., callout bubbles)
   - **Target matching**: Match by page label or text content
4. Click "Process"
5. Revu scans all pages and creates hyperlinks automatically

### Verifying Hyperlinks

1. Click a callout or reference on a floor plan
2. Revu navigates to the corresponding detail/section/elevation
3. Verify a sample of hyperlinks to ensure accuracy
4. Fix any broken links manually:
   - Right-click the hyperlink text > Edit Hyperlink
   - Set the correct target page

### Benefits of Hyperlinked Drawing Sets

- Navigate large drawing sets by clicking references
- No more flipping through pages to find details
- Studio Session participants can navigate efficiently
- Reduces review time by 30-50% for large projects

## Batch Print

### Running Batch Print

1. File > Batch > Print
2. Select PDF files to print (add multiple files)
3. Set print parameters:
   - **Printer**: Physical plotter or PDF driver
   - **Paper size**: A1, A2, A3, or match page size
   - **Orientation**: Auto, Portrait, or Landscape
   - **Scaling**: Fit to page, Actual size, or Custom scale
   - **Color**: Color, Grayscale, or Monochrome
   - **Page range**: All pages or specific pages
4. Set output order:
   - **File order**: Print in the order files were added
   - **Page order**: Print by page label (alphabetical)
   - **Custom order**: Drag and drop to reorder
5. Click "Print All"
6. Revu prints all files sequentially without further intervention

### Print Settings per File

For mixed-format drawing sets:
1. Select a file in the batch list
2. Click "Settings" for that file
3. Override the global settings:
   - Different paper size for specific files
   - Different orientation for specific files
   - Different color setting for specific files
4. This handles sets with mixed A1/A2/A3 sheets

### Batch Print to PDF

1. Set printer to "Bluebeam PDF" or "Microsoft Print to PDF"
2. Set output folder
3. Choose: single PDF (combined) or individual PDFs per file
4. Click "Print All"
5. Revu generates PDF output for the entire batch

## Batch Markup Summary

### Running Markup Summary

1. File > Batch > Markup Summary
2. Select multiple PDF files
3. Revu compiles all markups from all files into a single report:
   - File name
   - Page number
   - Markup subject
   - Author
   - Date
   - Status
   - Measurement (if applicable)
4. Export as CSV or PDF
5. Use for project-wide markup tracking across multiple drawing sets

## Batch Security

### Applying Security to Multiple Files

1. File > Batch > Security
2. Select PDF files
3. Set security options:
   - **Password protection**: Require password to open
   - **Permissions**: Restrict printing, editing, copying
   - **Encryption level**: 128-bit or 256-bit
4. Click "Apply"
5. Security settings are applied to all selected files

## Batch Flatten

### What Flatten Does

Flattening converts markups into permanent PDF content — they can no longer be edited as markups. This is useful for:
- Issuing final drawings where markups should be permanent
- Preventing further markup edits
- Reducing file size (markups become part of the page content)

### Running Batch Flatten

1. File > Batch > Flatten
2. Select PDF files
3. Set:
   - **Flatten markups**: All markups, or filter by type/author/status
   - **Preserve form fields**: Keep interactive form fields
   - **Keep annotations editable**: Keep specific annotation types as markups
4. Click "Flatten"
5. All markups are burned into the PDF content

**Warning**: Flattening is irreversible. Always keep a backup of the unflattened version.

## Best Practices for Batch Processing

1. **Always keep backups** before batch operations — especially slip sheet and flatten
2. **Test on a small subset first** — verify results before processing the full set
3. **Use consistent page labels** — essential for slip sheeting and hyperlinking
4. **Run compare after slip sheeting** — verify that changes were correctly applied
5. **Create hyperlinks early** — hyperlink the drawing set as soon as it's received
6. **Use batch print for submissions** — ensures consistent print settings across all sheets
7. **Export markup summaries regularly** — track review progress across the project
8. **Document the batch process** — so any team member can repeat it

## Conclusion

Bluebeam Revu's batch tools eliminate hours of manual work in drawing set management. Slip sheeting preserves review markups across revisions, document comparison highlights changes between versions, automatic hyperlinking enables efficient navigation, and batch printing produces consistent output. By incorporating these tools into the standard document management workflow, construction teams can process drawing revisions in minutes instead of hours, ensuring that the team always works with the latest information without losing valuable review history.
