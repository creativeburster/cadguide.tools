---
title: "Gerber AccuMark Cloud Collaboration: Remote Pattern Sharing and Multi-Site Production"
excerpt: "AccuMark Cloud enables remote pattern sharing, 3D viewing, and collaboration across distributed production teams. I cover cloud setup, sharing patterns and markers with remote facilities, version control, and managing multi-site production with AccuMark Cloud."
category: "workflow"
softwareSlug: "gerber-accumark"
keyword: "Gerber AccuMark Cloud collaboration remote pattern sharing multi-site production version control"
slug: "gerber-accumark-cloud-collaboration-remote-pattern-sharing-multi-site"
author: "CADGuide Tools Editorial Team"
readTime: "9 min"
date: "2025-06-29"
sources:
  - "https://www.gerbertechnology.com/accumark/"
  - "https://www.gerbertechnology.com/accumark-cloud/"

---

# Gerber AccuMark Cloud Collaboration: Remote Pattern Sharing and Multi-Site Production

I've managed multi-site apparel production using AccuMark Cloud to distribute patterns and markers to factories in different countries. Cloud collaboration has become essential as apparel production is increasingly distributed — design happens in one country, pattern making in another, and cutting/sewing in yet another. AccuMark Cloud provides the infrastructure to share pattern data, 3D samples, and markers across geographic boundaries.

## AccuMark Cloud Overview

AccuMark Cloud is Gerber's cloud collaboration platform that enables:
- **Remote pattern sharing**: Share patterns with factories and partners
- **3D virtual sample viewing**: View 3D garments in a web browser
- **Marker distribution**: Send markers to remote cutting facilities
- **Version control**: Track changes and maintain the latest version
- **Comment and review**: Leave feedback on patterns and 3D samples
- **Multi-site synchronization**: Keep all sites working from the same data

## Cloud Setup

### Account Configuration

1. Contact Gerber to set up an AccuMark Cloud account
2. Define user roles:
   - **Administrator**: Full access, user management
   - **Pattern maker**: Upload and modify patterns
   - **Marker maker**: Upload and modify markers
   - **Reviewer**: View and comment on patterns and 3D samples
   - **Factory user**: Download markers and cut files
3. Set up storage areas in the cloud matching your local AccuMark structure

### Connecting AccuMark to the Cloud

1. In AccuMark Explorer, go to **Cloud Settings**
2. Enter your cloud account credentials
3. Select which storage areas to sync with the cloud
4. Configure sync settings:
   - **Automatic sync**: Changes upload immediately
   - **Manual sync**: Upload on demand
   - **Scheduled sync**: Upload at specified intervals
5. Test the connection to verify data transfers correctly

## Sharing Patterns

### Uploading Patterns to the Cloud

1. Select the pattern in AccuMark Explorer
2. Right-click → **Upload to Cloud**
3. Choose what to include:
   - Pattern pieces
   - Grade rule tables
   - Markers
   - 3D simulation data
   - Tech pack (if linked to YuniquePLM)
4. Set sharing permissions:
   - **Private**: Only your organization
   - **Specific users**: Selected team members
   - **Factory access**: Specific factory partners
5. Click **Upload**

### Version Control

1. Every upload creates a new version in the cloud
2. Version history shows:
   - Who made the change
   - When the change was made
   - What was changed
3. Previous versions can be restored if needed
4. This ensures all sites are working from the latest version
5. If a factory downloads an old version, the cloud flags the mismatch

### Downloading Patterns at Remote Sites

1. At the remote factory, open AccuMark Explorer
2. Go to **Cloud Browser**
3. Navigate to the shared storage area
4. Select the pattern to download
5. Right-click → **Download to Local**
6. The pattern appears in the local AccuMark storage area
7. The factory can now create markers and cut files

## 3D Virtual Sample Sharing

### Uploading 3D Samples

1. In AccuMark 3D, save the 3D simulation
2. Right-click → **Upload to Cloud**
3. The 3D garment is uploaded with:
   - 3D mesh and textures
   - Avatar
   - Fabric properties
   - Colorway information
4. Set viewing permissions for buyers and partners

### Viewing 3D Samples in a Browser

1. Recipients receive an email with a viewing link
2. They open the link in a web browser — no AccuMark license required
3. The 3D viewer allows:
   - **Orbit**: Rotate the garment 360°
   - **Zoom**: Examine details
   - **Pan**: Move the view
   - **Colorway switch**: View different color options
   - **Measurements**: View POM measurements
4. Viewers can leave comments on specific areas of the garment

### Buyer Review Workflow

1. Designer uploads the 3D sample to the cloud
2. Buyer receives an email notification
3. Buyer views the 3D sample in their browser
4. Buyer leaves comments:
   - "Neckline is too high"
   - "Sleeve length needs to be 2cm longer"
   - "Color is approved"
5. Designer sees the comments in AccuMark 3D
6. Designer adjusts the pattern and uploads a new version
7. Buyer reviews the updated 3D sample
8. Buyer approves the style for production

## Marker Distribution

### Sending Markers to Factories

1. Create the marker in AccuMark Marker Making
2. Right-click → **Upload to Cloud**
3. The marker includes:
   - Piece outlines and positions
   - Cut file data
   - Ply count and fabric specifications
   - Size breakdown
4. The factory receives a notification
5. Factory downloads the marker to their local AccuMark
6. Factory sends the cut file to their Gerber cutter

### Multi-Site Marker Management

For production across multiple factories:
1. Create markers for each factory (different size runs per factory)
2. Upload each marker to the cloud with factory-specific permissions
3. Each factory downloads only their assigned markers
4. Track which factory has downloaded which markers
5. If a marker is updated, the cloud notifies the factory to re-download

## Multi-Site Production Workflow

### Design to Production Flow

1. **Design office (US)**: Create the pattern in AccuMark PDS
2. **Design office**: Simulate in AccuMark 3D and validate fit
3. **Design office**: Upload pattern and 3D to AccuMark Cloud
4. **Pattern maker (Mexico)**: Download pattern, create grade rules
5. **Pattern maker**: Upload graded patterns to cloud
6. **Marker maker (Mexico)**: Download graded patterns, create markers
7. **Marker maker**: Upload markers to cloud
8. **Factory (Mexico)**: Download markers, cut, and sew
9. **Design office**: Track production status via YuniquePLM

### Change Management

When a pattern change is needed after production has started:
1. Designer modifies the pattern in PDS
2. Uploads the new version to the cloud
3. The cloud flags the change to all users who downloaded the previous version
4. The factory is notified to re-download
5. The factory downloads the updated marker
6. Production continues with the updated pattern
7. Version history shows exactly what changed and when

## Common Issues

### Cloud Sync Fails

- Check internet connection at both sites
- Verify cloud account credentials are current
- Check storage limits on the cloud account
- Try manual sync instead of automatic
- Contact Gerber support if the issue persists

### Factory Downloads Old Version

- Check that the factory re-downloaded after the update
- Verify version control is showing the latest version
- Ensure the factory's AccuMark is set to check for updates
- Communicate directly with the factory about the change

### 3D Sample Won't Load in Browser

- Check that the recipient's browser supports WebGL
- Try a different browser (Chrome, Firefox, Edge)
- Verify the 3D file was fully uploaded
- Check file size — large 3D files may take time to load

### Comments Don't Appear in AccuMark

- Refresh the cloud connection in AccuMark
- Verify the comment was saved in the web viewer
- Check that the correct 3D sample is open
- Re-open the 3D simulation from the cloud

## Summary

AccuMark Cloud enables remote collaboration for distributed apparel production. Upload patterns, 3D samples, and markers to the cloud with specific sharing permissions. Remote factories download patterns and markers to their local AccuMark. Buyers view 3D samples in a web browser without an AccuMark license and leave comments for the design team. Version control tracks all changes and ensures all sites work from the latest version. For multi-site production, each factory downloads only their assigned markers. When pattern changes occur, the cloud notifies affected users to re-download. The most common issues — sync failures, old versions, and 3D viewing problems — are addressed by checking connections, verifying version status, and ensuring browser compatibility.
