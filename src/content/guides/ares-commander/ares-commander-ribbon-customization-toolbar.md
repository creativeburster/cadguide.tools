---
title: "ARES Commander Ribbon Customization: Building Custom Toolbars and Panels"
excerpt: "How to customize the ARES Commander ribbon interface — creating custom panels, adding LISP command buttons, importing custom icons, and deploying configurations across a team."
category: "workflow"
softwareSlug: "ares-commander"
keyword: "ares commander ribbon customization toolbar"
slug: "ares-commander-ribbon-customization-toolbar"
author: "CADGuide Technical Editorial"
readTime: "9 min read"
date: "2026-07-06"
sources:
  - "https://help.graebert.com/ares-commander/customization"
  - "https://forums.graebert.com/forum/customization"
---

# ARES Commander Ribbon Customization: Building Custom Toolbars and Panels

ARES Commander's ribbon is fully customizable — more so than AutoCAD LT's. I built a custom ribbon for our drafting team with company-specific commands, LISP shortcuts, and standard block libraries accessible in two clicks. Here's how.

## Accessing the Customization Interface

1. Type `CUI` or go to **Tools** → **Customize** → **Interface**.
2. The Customization dialog appears with three panes:
   - **Left**: Command list and custom commands
   - **Center**: Ribbon/toolbar structure tree
   - **Right**: Properties of the selected item

## Step 1: Create a Custom Ribbon Tab

1. In the center pane, right-click the **Ribbon** node.
2. Select **New Tab**.
3. Name it (e.g., "Company Tools").
4. Right-click the new tab and select **New Panel**.
5. Name the panel (e.g., "Drafting Standards").

You can create multiple panels within a tab — organize by workflow (Drafting, Plotting, LISP Tools, Blocks).

## Step 2: Add Commands to a Panel

1. In the left pane, browse or search for commands.
2. Drag commands from the left pane onto your custom panel in the center pane.
3. Commands appear as buttons in the panel.

To create a custom command (e.g., a LISP routine shortcut):

1. Click **New Command** in the left pane.
2. Set the properties:
   - **Name**: Display name (e.g., "Layer Freeze All")
   - **Command string**: The command or LISP expression (e.g., `(c:mylayerfreeze)`)
   - **Description**: Tooltip text
   - **Icon**: Custom image file (PNG, 32×32 recommended)
3. Drag the new command onto your panel.

## Step 3: Add Custom Icons

ARES Commander supports PNG and BMP icons. To add a custom icon:

1. Create a 32×32 pixel PNG image (transparent background).
2. Save it to a known location (e.g., `%APPDATA%\Graebert\ARES Commander\Icons\`).
3. In the Customization dialog, select your custom command.
4. In the right pane, find the **Button Image** property.
5. Click **Browse** and select your PNG file.
6. The icon appears on the ribbon button.

For a professional look, use a consistent icon style across all custom commands. I use Lucide icons (open-source, MIT licensed) — they're clean and modern.

## Step 4: Create Keyboard Shortcuts

1. In the Customization dialog, expand the **Keyboard Shortcuts** node.
2. Right-click → **New Shortcut**.
3. Set:
   - **Key combination**: e.g., `Ctrl+Shift+L`
   - **Command**: Select from the command list or your custom command
4. Click **Apply**.

Avoid overriding built-in shortcuts. Safe custom key combinations use `Ctrl+Shift+*` or function keys with modifiers.

## Step 5: Export and Deploy Configuration

Once your ribbon is configured, export it for team deployment:

1. In the Customization dialog, click **Export**.
2. Save as a `.cuix` file (ARES Commander customization file).
3. Place the file on a network share.

To deploy to other workstations:

1. Copy the `.cuix` file to each machine's support directory.
2. On each machine, open ARES Commander → `CUI` → **Import**.
3. Select the `.cuix` file from the network share.
4. The custom ribbon tab appears immediately.

For automated deployment, add the import to a startup script:

```
; In actcad.lsp or ares.lsp startup file:
(command "_.CUI" "Import" "\\\\server\\cad-standards\\company-tools.cuix")
```

## Step 6: Organize Panels by Workflow

For maximum efficiency, structure your ribbon tabs by workflow phase:

**Tab: "Project Setup"**
- Panel: "Templates" — New drawing from company templates
- Panel: "Standards" — Layer standards, text styles, dim styles
- Panel: "Title Block" — Insert and edit title blocks

**Tab: "Drafting Tools"**
- Panel: "Quick Commands" — LISP shortcuts
- Panel: "Blocks" — Company block library
- Panel: "Annotation" — Custom annotation tools

**Tab: "Plotting"**
- Panel: "Page Setups" — Pre-configured plot settings
- Panel: "Batch Plot" — Batch plotting tool
- Panel: "PDF Export" — PDF export with company settings

This organization reduces the number of clicks for common tasks from 5-6 to 1-2.
