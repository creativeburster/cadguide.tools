---
title: "Creo config.pro Best Practices: Essential Settings for Performance and Stability"
excerpt: "config.pro is Creo's master configuration file, and most users never touch the defaults. I share the settings I deploy to every workstation — for performance, stability, large assemblies, and team standardization."
category: "deployment"
softwareSlug: "ptc-creo"
keyword: "Creo config.pro settings best practices performance"
slug: "creo-config-pro-best-practices-settings"
author: "CAD IT Admin"
readTime: "10 min"
date: "2025-06-20"
sources:
  - "https://community.ptc.com/t5/System-Administration/License-Request-Failure-on-Startup/td-p/1029641"
  - "https://community.ptc.com/t5/3D-Part-Assembly-Design/STEP-file-failing-to-open-in-Creo-10/td-p/941769"
---

# Creo config.pro Best Practices: Essential Settings for Performance and Stability

I've been administering Creo (and Pro/E before it) for over 15 years, and `config.pro` is the single most impactful configuration file in the system. It controls everything from display quality to memory management to default templates. Most users never modify it — they accept the defaults and wonder why Creo is slow, unstable, or behaves differently than their colleague's installation. I maintain a master `config.pro` that I deploy to every workstation in our engineering department. Here are the settings I consider essential, organized by category.

## File Locations and Loading Order

Creo loads `config.pro` files in a specific order, and later files override earlier ones:

1. **System config**: `<Creo install>\Common Files\text\config.pro` — loaded first, applies to all users
2. **User config**: `%USERPROFILE%\config.pro` — loaded second, per-user overrides
3. **Working directory config**: `<current directory>\config.pro` — loaded third, project-specific overrides
4. **Startup config**: Specified with the `-config` command-line flag — loaded last, highest priority

I put company-wide settings in the system config and allow users to add personal settings in their user config. The working directory config is used for project-specific settings like different units or drawing standards.

## Performance Settings

These settings have the most impact on Creo's responsiveness:

```
! Large assembly mode — enables deferred regeneration and reduced display quality
large_assembly_mode yes

! Delay regeneration when modifying features — batch changes before regenerating
delay_regen_on_modify yes

! Don't auto-regenerate after each operation
auto_regen_restore no

! Reduce display quality during dynamic operations (pan, zoom, rotate)
display_quality low
spin_quality low
render_quality low

! Disable shaded solid edges during spin (reduces GPU load)
shaded_solid_edges no

! Use software OpenGL for compatibility (switch to hardware if certified GPU)
graphics win32_gdi
! For certified workstations with Quadro/Radeon Pro:
! graphics opengl

! Enable async file opening (non-blocking file operations)
async_file_open yes

! Reuse the existing Creo window instead of opening new ones
reuse_window yes
```

## Memory Management

```
! Set the maximum memory per window (MB)
max_window_memory 2048

! Enable lightweight graphics for large assemblies
retrieve_data_with_simp_reps yes

! Open simplified representations by default
open_simplified_rep_by_default yes

! Use simplified reps for drawings
default_simp_rep_drawing yes

! Don't load family table instances into memory until needed
famtab_instance_with_external_ref no
```

## Stability Settings

```
! Set undo buffer size (number of operations)
undo_buffer_size 10

! Enable automatic backup
autobackup_enabled yes
autobackup_interval 15

! Save backup to a specific directory
autobackup_directory C:\Creo_Backup

! Don't allow Creo to close with unsaved changes
confirm_on_close yes

! Enable crash recovery
crash_recovery yes
```

## File Management and Templates

```
! Set default templates
template_solidpart C:\Creo_Templates\start_part.prt
template_designasm C:\Creo_Templates\start_asm.asm
template_drawing C:\Creo_Templates\start_drawing.drw

! Set default units to millimeters
pro_unit_sys mmns

! Set default accuracy type (relative)
accuracy_type relative

! Set default accuracy value
default_abs_accuracy 0.001

! Use metric units for mass properties
pro_unit_mass kg
pro_unit_length mm

! Save drawings with the model
save_drawing_with_model yes

! Don't create backup files in the working directory
save_backup no
```

## Drawing Settings

```
! Set drawing format
drawing_format_directory C:\Creo_Templates\formats

! Set default drawing scale
default_draw_scale 1:1

! Set projection angle (first angle for ISO, third angle for ANSI)
projection_type THIRD_ANGLE

! Set tolerance display
tol_display yes
tol_mode plus_minus

! Set default text height
drawing_text_height 3.0

! Set default font
drawing_text_font iso3098b

! Display dimensions in the drawing
create_drawing_dims_only yes

! Don't show tan edges in drawings
tan_edge_display_for_new_views no
```

## Sketcher Settings

```
! Set sketcher accuracy
sketcher_accuracy 0.0001

! Enable snap to grid
sketcher_snap_to_grid no

! Set grid spacing
sketcher_grid_spacing 1.0

! Enable automatic dimensioning
sketcher_auto_dimensioning no

! Display constraints
sketcher_constraint_display yes

! Set default dimension precision
sketcher_dimension_precision 3
```

## Import/Export Settings

```
! STEP import settings
intf_in_use_template_file yes
intf_in_profile_file C:\Creo_Templates\import_profile.ipf

! Don't create features during STEP import (faster, less memory)
intf3d_in_create_features no

! IGES import settings
intf3d_in_iges_import_as_surface no

! Export settings
intf_out_export_brep yes
step_out_format ap242

! Set export accuracy
intf_out_accuracy_lower_bound 0.0001
```

## Team Standardization Settings

```
! Set company name for metadata
pro_company_name "Your Company Name"

! Set default material
pro_material_dir C:\Creo_Templates\materials

! Set library directory
pro_library_dir C:\Creo_Library

! Set trail file directory
trail_dir C:\Creo_Trail

! Set default working directory
default_dir C:\Creo_Projects

! Disable user customization of ribbon (optional, for standardization)
disable_user_customization no
```

## Deployment Strategy

### Master config.pro

1. Create a master `config.pro` with all company-wide settings
2. Place it on a network share accessible to all users
3. Create a deployment script that copies it to each workstation:

```batch
@echo off
copy \\server\Creo_Config\config.pro "C:\Program Files\PTC\Creo 11.0\Common Files\text\config.pro" /Y
copy \\server\Creo_Config\config.sup "C:\Program Files\PTC\Creo 11.0\Common Files\text\config.sup" /Y
echo Config deployed successfully
```

### Using config.sup for Locked Settings

`config.sup` (supersede) is a locked version of `config.pro` — users cannot override its settings. Use it for settings that must be consistent across all users:

1. Create a `config.sup` with critical settings (units, templates, file paths)
2. Place it in the same directory as `config.pro`
3. Users can override `config.pro` settings but not `config.sup` settings

### Per-User config.pro

Allow users to create a personal `config.pro` in their home directory for:
- Display preferences (colors, fonts)
- Personal shortcuts
- Custom mapkeys

## Verifying config.pro Settings

To check which config.pro settings are active:

1. In Creo, go to **File → Options → Configuration Editor**
2. This shows all active config.pro settings and their values
3. Settings from `config.sup` are marked with a lock icon
4. You can search for specific settings by name

To check if a specific setting is being loaded:

1. **File → Options → Configuration Editor**
2. Click **Find**
3. Type the setting name
4. The current value and source file are displayed

## Common config.pro Mistakes

### 1. Setting graphics to opengl on uncertified hardware
Using hardware OpenGL with a non-certified graphics card (GeForce, consumer Radeon) can cause display corruption and crashes. Use `win32_gdi` for uncertified hardware.

### 2. Setting undo_buffer_size too high
A high undo buffer (50+) consumes significant memory. For large assemblies, set it to 10 to reduce memory pressure.

### 3. Not using config.sup for critical settings
If users can override template paths or units, you'll end up with inconsistent files. Lock these with `config.sup`.

### 4. Placing config.pro in the wrong directory
The system config must be in `<Creo install>\Common Files\text\`. Placing it elsewhere means Creo won't find it.

### 5. Overriding locked settings in config.sup
Some users try to override `config.sup` settings by placing contradictory values in their user `config.pro`. This doesn't work — `config.sup` always takes precedence. If a setting is locked, the only way to change it is to modify the `config.sup` file itself on the system.

### 6. Not testing config changes on a non-production machine
Before deploying a new `config.pro` to all workstations, test it on a single machine first. A typo in a config setting can cause Creo to behave unpredictably or fail to start. I always test new configurations on my own workstation for a full day before deploying to the team.

## Troubleshooting config.pro Issues

If Creo behaves unexpectedly after a config.pro change, here's my diagnostic process:

1. **Check the Configuration Editor**: File → Options → Configuration Editor shows all active settings and their source files. Verify the setting is being loaded from the expected file.
2. **Rename config.pro temporarily**: Rename the system config.pro to config.pro.bak and restart Creo. If the problem disappears, the config.pro is the cause.
3. **Binary search**: If you have a large config.pro, comment out half the settings and test. If the problem disappears, the culprit is in the commented half. Repeat until you find the specific setting.
4. **Check for conflicting config.pro files**: Remember that multiple config.pro files are loaded in order — system, user, working directory. A setting in the working directory config.pro may override the system config.pro.

## Summary

A well-configured `config.pro` is the difference between a smooth Creo experience and a frustrating one. The most impactful settings are:

1. **`large_assembly_mode yes`** — enables all large assembly optimizations
2. **`delay_regen_on_modify yes`** — prevents slow regeneration during editing
3. **`retrieve_data_with_simp_reps yes`** — reduces memory for large assemblies
4. **`display_quality low`** — improves display performance
5. **`template_solidpart` / `template_designasm`** — ensures consistent starting files

Deploy a master `config.pro` to all workstations, use `config.sup` for locked settings, and allow per-user customization for preferences. Verify settings with the Configuration Editor, and train users to check their config when Creo behaves unexpectedly.
