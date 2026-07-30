---
title: "DWG FastView Mobile: Can't Open Drawings, Missing Fonts, Cloud Sync Conflicts, and Performance Limits"
excerpt: "DWG FastView users on mobile hit recurring issues: drawings won't open due to memory limits or file errors, missing fonts show as question marks, cloud sync conflicts between devices, and WhatsApp-shared files fail to load. We cover each with official fixes from GstarCAD support."
category: "troubleshooting"
softwareSlug: "dwg-fastview"
keyword: "DWG FastView cannot open drawing missing font cloud sync conflict mobile fix"
slug: "dwg-fastview-cannot-open-drawing-missing-font-sync-conflict-fix"
author: "CADGuide Tools Editorial Team"
readTime: "9 min"
date: "2025-07-30"
sources:
  - "https://blog.dwgfastview.com/faq/"
  - "https://blog.dwgfastview.com/why-cant-i-open-my-drawing/"
  - "https://blog.dwgfastview.com/understanding-the-setting-of-dwg-fastview-for-mobile/"
---

# DWG FastView Mobile: Can't Open Drawings, Missing Fonts, Cloud Sync Conflicts, and Performance Limits

DWG FastView is a cross-platform DWG viewer and editor for iOS, Android, and Windows. As a mobile-first CAD tool, it faces unique constraints: limited device memory, cloud-only project storage, and font availability on mobile operating systems. This guide covers the most common issues reported to GstarCAD support.

## Issue 1: Drawing Won't Open

**Symptom**: A DWG file fails to open, sometimes causing the app to crash.

**Three Root Causes** (per official FAQ):

### 1a. The DWG File Itself Has Errors

The drawing may be corrupted or contain entities that DWG FastView cannot parse.

**Fix**: Open the same file in DWG FastView for Windows (desktop version) — it will display the specific error reason. Fix the drawing in AutoCAD or GstarCAD on desktop, then reopen on mobile.

### 1b. The Drawing Is Too Large or Complex

Mobile devices have limited running memory (RAM). Very large or complex drawings exceed available memory.

**Fix**:
- **Compress the drawing**: Reduce file size by purging unused elements, blocks, and layers
- **Split into multiple drawings**: Divide one large drawing into two or three smaller files
- **Use View Mode**: Switch to View Mode (faster, less memory-intensive) via **More → Switch icon** in the top-right

### 1c. Device Memory Is Insufficient

Older phones or tablets with limited RAM simply cannot load large drawings.

**Fix**: Close other apps running in the background. If the problem persists, the device may lack sufficient RAM for CAD workloads — test on a device with more memory.

## Issue 2: Can't Open Drawings Shared via Third-Party Apps (WhatsApp, Email)

**Symptom**: Drawings sent or received through WhatsApp, email, or other third-party apps won't open when tapped.

**Root Cause**: A file association bug in older versions of DWG FastView.

**Fix**: Update DWG FastView to the **latest version** from the App Store or Google Play. This bug was fixed in a recent release. If the issue persists, contact support with your device info (OS version, brand) and DWG FastView account email.

## Issue 3: iPad/Tablet Doesn't Recognize Drawings Synced from PC

**Symptom**: Drawings synced from a PC to a tablet via cloud don't appear or won't open.

**Root Cause**: The filename contains punctuation marks or spaces that the mobile OS cannot parse.

**Fix**: Rename the file on the PC before syncing — remove all spaces and punctuation from the filename (e.g., `Drawing 1 (final).dwg` → `Drawing1final.dwg`). Ensure the file extension is `.dwg`.

## Issue 4: Missing Fonts Showing as Question Marks

**Symptom**: Text in the drawing displays as `???` or question marks.

**Root Cause**: The font referenced in the DWG file is not installed on the mobile device. DWG FastView cannot bundle all CAD fonts due to licensing and storage constraints.

**Fix**:

1. **Enable Missing Font Prompt**: Go to **Settings → Tips of missing font** → turn ON. When a font is missing, a tip window appears and the font is replaced automatically with a substitute
2. **Import the required font manually**:
   - Download the font file (`.shx`, `.ttf`) to your mobile device (transfer from PC via the same method used for importing drawings)
   - In DWG FastView, go to the **Fonts** folder in settings
   - Tap the **+** button and select the font file(s) to add
   - Reopen the drawing — fonts should display correctly
3. **Delete unused fonts**: Use the trash can icon next to each font file in the Fonts folder to remove fonts you no longer need

## Issue 5: Cloud Sync Conflicts Between Devices

**Symptom**: After editing a drawing on Device A and syncing to the cloud, the same drawing on Device B shows a red status indicator when refreshed.

**Root Cause**: The drawing was modified on both devices independently. Device A uploaded its version to the cloud, but Device B has a local version that was also modified but not synced.

**Fix**:

1. When the conflict prompt appears on Device B, tap **OK** to continue
2. The file modified on Device A (already uploaded to the cloud) will be downloaded to Device B
3. The file modified on Device B is moved to the **Conflicted File Folder**
4. Review both versions and manually merge changes if needed

**Prevention**: Always sync to the cloud immediately after editing. Pull-down to refresh before starting work on a different device to ensure you have the latest version.

## Issue 6: Upgrade Page Won't Load or Payment Fails

**Symptom**: The in-app upgrade/purchase page fails to load, or payment processing fails.

**Fix**:
1. Check your internet connection
2. Restart DWG FastView
3. If payment still fails, purchase on the **DWG FastView website** instead — log in with the same email and password used in the app
4. DWG FastView uses a cross-platform account: one subscription works on PC, mobile, and web

## View Mode vs. Edit Mode

DWG FastView offers two work modes that affect both functionality and performance:

| Mode | Capabilities | Performance |
|------|-------------|-------------|
| **View Mode** | Fast viewing, measurement, layer visibility | Faster, lower memory usage |
| **Edit Mode** | Drawing, editing, annotating, 3D browsing, layout switching | Slower, higher memory usage |

Switch via **More → Switch icon** (top-right of interface). For large drawings on memory-constrained devices, use View Mode for reviewing and Edit Mode only for active editing sessions.

## DWG Version Compatibility

DWG FastView supports DWG/DXF versions from AutoCAD R12 through 2013+. In Settings, you can specify which version to save drawings as, ensuring compatibility with your desktop CAD workflow.

## Supported File Formats (iOS)

DWG FastView for iOS supports: `.ocf`, `.dwg`, `.dxf`, `.dws`, `.dwt`, `.bmp`, `.jpg`, `.jpeg`, `.gif`, `.png`, `.txt`, `.doc`, `.docx`, `.pdf`, `.xls`, `.xlsx`, `.ppt`, `.pptx`, `.tif`, `.rtf`, `.ttf`, `.ttc`, `.shx`, `.sht`, `.shp`, `.fon`

Requires iOS 8.0 or higher. Compatible with iPhone, iPad, and iPod touch.
