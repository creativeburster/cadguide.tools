---
title: "Navisworks 4D Simulation: Linking BIM Models to Construction Schedules with TimeLiner"
excerpt: "A guide to creating 4D construction simulations in Navisworks TimeLiner covering schedule import from Primavera and MS Project, task-to-element linking, simulation playback, and progress tracking for construction planning."
category: "workflow"
softwareSlug: "navisworks"
keyword: "navisworks 4d simulation timeliner"
slug: "navisworks-4d-simulation-timeliner-bim-schedule-construction"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://help.autodesk.com/view/NAV/2024/ENU/?guid=GUID-TIMELINER"
  - "https://www.autodesk.com/products/navisworks/overview"
---

# Navisworks 4D Simulation: Linking BIM Models to Construction Schedules with TimeLiner

TimeLiner is Navisworks' 4D simulation module that links 3D BIM model elements to construction schedule tasks. By combining 3D geometry with time (the 4th dimension), you can visualize the construction sequence, identify scheduling conflicts, and communicate the build plan to stakeholders. This guide covers the complete 4D workflow.

## TimeLiner Overview

### What TimeLiner Does

- Imports construction schedules from Primavera P6, MS Project, or CSV
- Links schedule tasks to 3D model elements
- Simulates construction over time (4D animation)
- Tracks actual progress against planned
- Exports simulations as video or image sequences

### Opening TimeLiner

1. Home > TimeLiner
2. The TimeLiner panel opens with tabs:
   - **Tasks**: Schedule import and management
   - **Data Sources**: Automatic linking rules
   - **Configure**: Simulation settings
   - **Simulate**: Playback controls
   - **Export**: Video and image export

## Schedule Import

### From Primavera P6

1. TimeLiner > Tasks > Add Schedule
2. Select "Primavera P6"
3. Browse to the .XER file
4. Set import options:
   - **Include all tasks** or filter by WBS
   - **Map columns**: Task name, Start, Finish, Duration, % Complete
5. Click Import
6. The schedule appears in the Tasks tab

### From Microsoft Project

1. TimeLiner > Tasks > Add Schedule
2. Select "Microsoft Project"
3. Browse to the .MPP file
4. Set import options (same as Primavera)
5. Click Import

### From CSV

1. Export schedule from any tool as CSV
2. TimeLiner > Tasks > Add Schedule > CSV
3. Map columns:
   - Task ID, Task Name, Start Date, Finish Date, Duration, % Complete
4. Click Import

### Manual Schedule Entry

For small projects or testing:
1. TimeLiner > Tasks > Add Task
2. Enter task name, start date, finish date
3. Build the schedule manually

## Linking Tasks to Model Elements

### Manual Linking

1. Select a task in the Tasks tab
2. In the 3D view, select the corresponding model elements
3. Click "Attach Selection to Task" in the TimeLiner toolbar
4. The elements are now linked to the task
5. During simulation, these elements appear when the task starts and disappear when it ends

### Automatic Linking via Data Sources

1. TimeLiner > Data Sources > Add
2. Set matching rules:
   - **Match by parameter**: e.g., match task name to element parameter
   - **Match by element ID**: link via a shared ID property
   - **Match by layer/class**: link by layer name or class
3. Example rule:
   - If Task Name contains "Column" AND Level = "Level 1"
   - Then link to all columns on Level 1
4. Click "Run Rules" to auto-link
5. Review and fix any unmatched tasks

### Using Selection Sets for Linking

1. Create Selection Sets by construction task (e.g., "Excavation", "Foundations", "Structure L1")
2. In TimeLiner, select a task
3. Right-click > Attach Selection Set
4. Choose the corresponding Selection Set
5. This is the most reliable method for complex projects

### Linking Status

Each task shows linking status:
- **Green**: Fully linked (all elements attached)
- **Yellow**: Partially linked (some elements attached)
- **Red**: Not linked (no elements attached)
- **Gray**: No elements needed (summary tasks, milestones)

## Simulation Configuration

### Simulation Settings

1. TimeLiner > Configure
2. Set:
   - **Start date**: Project start date (from schedule)
   - **End date**: Project end date
   - **Interval**: Daily, weekly, or custom
   - **Speed**: Frames per second for playback
   - **Override model colors**: Yes (use task status colors)

### Task Status Colors

Configure colors for different construction states:
- **Planned**: Blue (not yet started)
- **In Progress**: Yellow (under construction)
- **Completed**: Green (finished)
- **Delayed**: Red (behind schedule)

### Appearance Settings

1. TimeLiner > Configure > Appearance
2. Set how elements appear/disappear:
   - **Appear**: Fade in, grow, or instant
   - **Disappear**: Fade out, shrink, or instant
   - **Duration**: 0.5 seconds for transitions
3. Set display options:
   - **Show task name**: Display current task name on screen
   - **Show date**: Display current simulation date
   - **Show progress bar**: Display overall project progress

## Running the Simulation

### Playback Controls

1. TimeLiner > Simulate
2. Use playback controls:
   - **Play**: Start the simulation from the current position
   - **Pause**: Stop at the current date
   - **Stop**: Return to the start
   - **Step Forward/Backward**: Move one interval at a time
   - **Slider**: Drag to any date in the project
3. The 3D model updates to show the construction state at the current date

### Viewpoint Management

1. Create Saved Viewpoints for key construction phases:
   - "Excavation complete"
   - "Foundations poured"
   - "Structure topped out"
   - "MEP rough-in"
   - "Final inspection"
2. During simulation, switch between viewpoints to show different angles

### Section Views During Simulation

1. Create section planes to cut through the building
2. During simulation, the section shows interior construction progress
3. Useful for showing MEP installation behind walls

## Progress Tracking

### Updating Actual Progress

1. As construction progresses, update the schedule:
   - Update % Complete for each task
   - Update actual start and finish dates
2. Re-import the updated schedule into TimeLiner
3. TimeLiner shows:
   - **Planned vs. Actual**: Side-by-side comparison
   - **Delay visualization**: Red highlighting for delayed tasks
   - **Progress percentage**: Overall and per-task

### Progress Report

1. TimeLiner > Export > Progress Report
2. Generate a report showing:
   - Planned completion percentage
   - Actual completion percentage
   - Delayed tasks
   - Critical path status
3. Export as PDF for project meetings

## Export

### Video Export

1. TimeLiner > Export > Animation
2. Set:
   - **Format**: AVI or WMV
   - **Resolution**: 1920×1080 (Full HD) or 3840×2160 (4K)
   - **FPS**: 30 (standard) or 60 (smooth)
   - **Duration**: Calculated from interval and speed settings
3. Click "Export" — Navisworks renders each frame and compiles the video
4. For long projects, rendering can take several hours

### Image Sequence Export

1. TimeLiner > Export > Image Sequence
2. Set:
   - **Format**: PNG or JPG
   - **Resolution**: 1920×1080
   - **Interval**: One image per week (or day)
3. Navisworks exports one image per interval
4. Use the images for presentations or time-lapse animations

### PDF Export

1. TimeLiner > Export > PDF
2. Generate a PDF with:
   - Simulation screenshots at key dates
   - Task list with dates
   - Progress summary
3. Suitable for client reporting

## Common 4D Issues

### Elements Appear/Disappear at Wrong Times

**Cause**: Task-to-element links are incorrect.
**Fix**: Review the linking in the Tasks tab. Verify that each task has the correct elements attached. Use Selection Sets for reliable linking.

### Simulation Runs Too Fast or Too Slow

**Cause**: Speed or interval settings are wrong.
**Fix**: In Configure, adjust the interval (daily for short projects, weekly for long projects) and speed (more FPS for slower playback).

### Some Elements Never Appear

**Cause**: Elements are not linked to any task.
**Fix**: Check for unlinked elements in the Tasks tab (red status). Attach them to the appropriate task.

### Video Quality Is Low

**Cause**: Low resolution or compression settings.
**Fix**: Set resolution to 1920×1080 or higher. Use AVI with minimal compression. For best quality, export as image sequence and compile in video editing software.

## Best Practices

1. **Link early and often** — attach elements to tasks as soon as both are available
2. **Use Selection Sets** — the most reliable linking method for complex projects
3. **Review the simulation weekly** — catch scheduling conflicts early
4. **Show critical path** — highlight critical path tasks in a different color
5. **Include temporary works** — model scaffolding, formwork, and cranes for realistic simulation
6. **Update progress regularly** — keep the simulation in sync with actual construction
7. **Use for client communication** — 4D is the most effective way to explain construction sequence to non-technical stakeholders
8. **Export short clips** — 30-60 second clips for meetings are more effective than full-length videos

## Conclusion

Navisworks TimeLiner transforms static 3D BIM models into dynamic 4D construction simulations. By linking schedule tasks to model elements, you can visualize the construction sequence, identify spatial conflicts in the schedule, track actual progress, and communicate the build plan effectively. The key to success is reliable task-to-element linking (use Selection Sets), regular schedule updates, and thoughtful simulation configuration. For client presentations and project team coordination, 4D simulation is one of the most powerful communication tools in the BIM workflow.
