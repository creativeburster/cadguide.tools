---
title: "3DEXPERIENCE SOLIDWORKS Integration: Collaborative Spaces, MySession, and Platform Setup"
excerpt: "How to set up 3DEXPERIENCE for SOLIDWORKS users — covering Collaborative Space creation, MySession configuration, system options for external references, model orientation (Y-up vs Z-up), and bookmark organization best practices."
category: "deployment"
softwareSlug: "3dexperience"
keyword: "3dexperience solidworks integration collaborative space mysession setup"
slug: "3dexperience-solidworks-integration-collaborative-space-mysession-setup"
author: "CADGuide Tools Editorial Team"
readTime: "13 min read"
date: "2026-07-09"
sources:
  - "https://3dswym.3dexperience.3ds.com/wiki/solidworks-news-info/setting-up-your-3dexperience-and-solidworks-environment_BDZiR6arRWqzpvBthirHOg"
  - "https://3dswym.3dexperience.3ds.com/wiki/solidworks-news-info/solidworks-set-up-and-configuration_sgwEMtCYRO29HZQz8bGpbA"
---

# 3DEXPERIENCE SOLIDWORKS Integration: Collaborative Spaces, MySession, and Platform Setup

I've implemented 3DEXPERIENCE for three SOLIDWORKS-based companies. The pattern is always the same: the first month is painful, the second month starts to click, and by the third month nobody wants to go back to local file management. But only when the setup is done right. A poorly configured 3DEXPERIENCE environment creates more problems than it solves. Here's my setup playbook.

## Understanding the Architecture

3DEXPERIENCE is a cloud platform. SOLIDWORKS connects to it via the Collaborative Designer for SOLIDWORKS role (or 3DEXPERIENCE SOLIDWORKS). The key concepts:

- **Collaborative Space**: Cloud storage location for your CAD data (like a shared network drive, but with version control and lifecycle management)
- **MySession**: SOLIDWORKS task pane showing the sync status of each component
- **Bookmarks**: Folder-like organization structure in the platform
- **Physical Product vs CAD Family**: How SOLIDWORKS parts/assemblies map to platform objects
- **Maturity States**: Lifecycle states (In Work, Released, Obsolete)

## Step 1: Create Collaborative Spaces

1. Log in to the 3DEXPERIENCE platform as an administrator.
2. Open the **Platform Management Cockpit**.
3. Go to the **Collaborative Spaces Control Center**.
4. Click **New Collaborative Space**:
   - **Name**: e.g., "Design and Engineering"
   - **Family Type**: Design (manages CAD data)
   - **Visibility**: Private (only members can see content)
5. Add members and assign roles:
   - **Leader/Owner**: Can release data, perform admin tasks, design
   - **Author**: Can create/edit/delete content, design
   - **Reader**: Can view and comment

### Collaborative Space Strategy

- **Limit the number of spaces** — too many spaces confuse users. One or two per project is usually enough.
- **Use Protected visibility for released content** — "Protected" means Released content is visible to all platform users, while In Work content is only visible to space members.
- **Don't create per-user spaces** — collaboration requires shared spaces.

## Step 2: Configure SOLIDWORKS MySession Settings

MySession is the task pane that shows sync status. Proper configuration prevents working on stale data.

1. In SOLIDWORKS, open the **3DEXPERIENCE** task pane → **MySession**.
2. Click the gear icon → **Settings**.
3. Configure:
   - **Refresh MySession after opening files**: Enable — ensures status updates when files load
   - **Auto-lock on modify**: Enable — prevents concurrent edits
   - **Show conflict warnings**: Enable — alerts when another user has modified a component

### Why "Refresh MySession" Matters

Without this setting, a user might open a component that a colleague has already modified. The status column shows "Up to date" even though the platform has a newer version. The user works on stale data, saves, and overwrites the colleague's changes. Enabling auto-refresh prevents this.

## Step 3: Configure SOLIDWORKS System Options

### External References

1. Go to **Tools** → **Options** → **External References**.
2. Set **Load Reference Documents** to **All**.
3. Enable **Load Documents in Memory Only**.

This ensures that when a derived part references a platform component, the reference loads in memory without opening a separate window. Critical for the browser-based design app workflow.

### Model Orientation

3DEXPERIENCE native apps use **Z-axis up**. SOLIDWORKS traditionally uses **Y-axis up**. This mismatch causes orientation problems when exchanging models.

**For SOLIDWORKS 2025+**:
1. When creating a new part or assembly, select **Z-up** in the New Document dialog.
2. Or create templates with Z-up orientation.

**For SOLIDWORKS 2024 and earlier**:
1. Create a part template with Z-up orientation:
   - Open a new part
   - Change the view to Isometric with Z-up
   - Rename the reference planes (Top → XY, Front → ZX, Right → YZ)
   - Save as a template
2. Use this template for all parts that will be shared with 3DEXPERIENCE apps.

## Step 4: Set Up Attribute Mapping

SOLIDWORKS properties must map to 3DEXPERIENCE attributes correctly:

1. **Configuration-specific properties** map to **Physical Product** — these are searchable and visible in all web apps.
2. **Custom properties on the Summary tab** map to **CAD Family** — less visible in web apps.

### Best Practice for Properties

- **Store all project-relevant properties on the Configuration Specific tab** — not the Summary tab
- **Property names must match the platform attribute names** — coordinate with your platform admin
- **Use consistent naming** — e.g., "Material", "PartNumber", "Description", "Project"

## Step 5: Organize with Bookmarks

Bookmarks are the folder structure in 3DEXPERIENCE:

1. Open the **Bookmarks** app on the platform.
2. Create a hierarchical structure:
   ```
   Project Alpha/
   ├── 01-Concept
   ├── 02-Detailed Design
   │   ├── Mechanical
   │   ├── Electrical
   │   └── Software
   ├── 03-Released
   └── 04-Archive
   ```
3. In SOLIDWORKS, save files to the appropriate bookmark location.

### Bookmark Best Practices

- **Replicate your existing folder structure** — minimizes user confusion
- **Don't go too deep** — 3-4 levels maximum
- **Use the Connected Design Library** — store library parts in a bookmark for easy access
- **Promote library parts to "Released"** — prevents accidental modification

## Step 6: Upload Existing Data

### Using the File Preparation Assistant

Before migrating existing SOLIDWORKS files:

1. In SOLIDWORKS, go to **Tools** → **File Preparation Assistant**.
2. Select files to analyze.
3. The assistant checks for:
   - **Trailing spaces in filenames** — can cause issues on the platform
   - **Duplicate files** — identify and merge or delete
   - **Missing file references** — broken links that need fixing
   - **3D Interconnect links** — non-native CAD references; recommended to break
   - **Missing configurations** — parts without configurations may create issues
4. Resolve all issues before uploading.

### Upload Process

1. Use the **3DEXPERIENCE Utility** (separate application) to upload files.
2. The utility replicates your local folder structure as bookmarks.
3. Upload in batches — don't try to upload thousands of files at once.
4. After upload, verify that all files are visible in the platform.

### Post-Upload

1. **Promote library parts to Released** — prevents accidental edits
2. **Verify file references** — open a few assemblies to confirm links work
3. **Check property mapping** — verify that properties appear in the platform
4. **Test with a second user** — confirm that another user can access and modify files

## Step 7: Configure Design Library and Toolbox

### Design Library

1. Upload your Design Library parts to a collaborative space.
2. Organize with bookmarks.
3. Promote to "Released" maturity state.
4. In SOLIDWORKS, configure the Connected Design Library to point to the platform location.

### Toolbox

1. Use the Toolbox configuration utility to create a package file.
2. Upload the Toolbox components to a collaborative space.
3. Configure the default collaborative space and maturity state in the Collaborative Spaces Configuration Center.
4. Set maturity to "In Work" if components need editing, or "Released" if they're ready for use.

## Common Setup Mistakes

### Too Many Collaborative Spaces

Creating a separate space for each project or each user creates confusion. Users can't find files, permissions get tangled, and data gets scattered. Use one or two spaces with bookmark organization instead.

### Not Running the File Preparation Assistant

Uploading dirty data (broken references, duplicates, trailing spaces) creates problems that are harder to fix on the platform than locally. Always run the assistant first.

### Ignoring Model Orientation

If some users model Y-up and others Z-up, models arrive in the platform with inconsistent orientations. Standardize before migration.

### Properties on the Wrong Tab

Properties on the Summary tab don't map to Physical Products and aren't visible in web apps. Users can't search for parts by properties. Always use the Configuration Specific tab.

## Best Practices

- **Limit Collaborative Spaces** — one or two per project, not per user
- **Enable MySession auto-refresh** — prevents working on stale data
- **Use Z-up orientation** — matches 3DEXPERIENCE native apps
- **Run File Preparation Assistant before migration** — clean data is critical
- **Store properties on Configuration Specific tab** — ensures visibility in web apps
- **Promote library parts to Released** — prevents accidental modification
- **Standardize settings across all workstations** — inconsistent settings cause sync issues
- **Train users before go-live** — 3DEXPERIENCE requires a mindset shift from file-based to data-based thinking
