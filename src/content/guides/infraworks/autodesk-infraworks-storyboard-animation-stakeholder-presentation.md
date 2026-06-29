---
title: "Autodesk InfraWorks Storyboards, Animations, and Stakeholder Presentation"
excerpt: "InfraWorks storyboard tools create animated flythroughs, construction sequences, and comparison views for stakeholder presentations. I cover creating storyboards, keyframe animation, before/after comparisons, and exporting videos and interactive web scenes."
category: "workflow"
softwareSlug: "infraworks"
keyword: "Autodesk InfraWorks storyboard animation flythrough stakeholder presentation video export"
slug: "autodesk-infraworks-storyboard-animation-stakeholder-presentation"
author: "CAD IT Admin"
readTime: "9 min"
date: "2025-06-22"
sources:
  - "https://knowledge.autodesk.com/support/infraworks/learn-explore/caas/CloudHelp/cloudhelp/ENU/InfraWorks-DataExchange/files/InTheCollection/InfraWorks-DataExchange-InTheCollection-CivilStructuresWorkflows-html-html.html"
  - "https://www.autodesk.com/learn/ondemand/curated/roadway-and-bridge-modeling-in-civil-3d-and-infraworks"
---

# Autodesk InfraWorks Storyboards, Animations, and Stakeholder Presentation

I've created dozens of InfraWorks presentations for public hearings, client reviews, and regulatory submissions. The storyboard tools transform a static 3D model into a compelling narrative — animated flythroughs, construction phasing sequences, and before/after comparisons that help non-technical stakeholders understand the project's impact. A well-crafted storyboard can make the difference between project approval and confusion.

## What Are Storyboards?

Storyboards are sequences of scenes that create an animation or presentation. Each scene captures a specific camera position, time of day, and visual setting. When played in sequence, they create a smooth animated flythrough of the project.

## Creating a Storyboard

### Step 1: Open the Storyboard Panel

1. Window → Storyboard
2. The Storyboard panel appears at the bottom of the screen
3. A new storyboard is created by default

### Step 2: Add Scenes

1. Navigate to the first viewpoint in the 3D model
2. Click **Add Scene** in the storyboard panel
3. The current camera position is captured as a scene
4. Navigate to the next viewpoint
5. Click **Add Scene** again
6. Repeat for all desired viewpoints

### Step 3: Configure Scene Properties

Select a scene to configure:

**Camera**:
- **Position**: X, Y, Z coordinates
- **Target**: Where the camera looks
- **Field of View**: Wide angle for overview, narrow for detail
- **Height**: Camera elevation

**Timing**:
- **Duration**: How long the scene plays (seconds)
- **Transition**: Smooth ease-in/ease-out or linear

**Environment**:
- **Time of Day**: Morning, noon, sunset, night
- **Date**: Affects sun angle and shadows
- **Weather**: Clear, cloudy, fog, rain, snow

**Display**:
- **Visible features**: Toggle roads, buildings, utilities
- **Analysis results**: Show earthwork, drainage, or traffic analysis overlays

### Step 4: Preview the Animation

1. Click **Play** in the storyboard panel
2. InfraWorks animates through all scenes
3. The camera smoothly transitions between viewpoints
4. Check timing and adjust durations as needed

### Step 5: Export

1. Click **Export Video** in the storyboard panel
2. Choose format and resolution:
   - **MP4**: Most compatible
   - **AVI**: Higher quality, larger file
   - **Resolution**: 1080p for presentations, 4K for large displays
3. Set frame rate (30fps standard, 60fps for smooth motion)
4. Click **Export** and wait for rendering

## Animation Types

### Flythrough Animation

The most common type — a camera flies through the project area:
1. Start with a wide overview shot
2. Fly toward the project area
3. Follow the road alignment at ground level
4. Circle around key features (bridges, intersections)
5. End with a wide overview

### Construction Sequence

Show the project being built over time:
1. Create scenes showing the existing conditions
2. Add scenes showing earthwork and grading
3. Add scenes showing road construction
4. Add scenes showing the completed project
5. Use the **Date** setting to show seasonal changes
6. Use feature visibility toggles to show/hide construction elements

### Before/After Comparison

Show the impact of the project:
1. Create a scene showing existing conditions (hide proposed features)
2. Create a scene showing the completed project (show proposed features)
3. Use the same camera position for both
4. Set a short transition between them
5. The animation flips between before and after

### Traffic Simulation

If traffic data is available:
1. Import traffic analysis data
2. Create scenes showing traffic flow at different times
3. Show congestion points and how the project resolves them

## Camera Techniques

### Orbit Shot

1. Position the camera at an angle to the feature
2. Set the target on the feature center
3. In the next scene, move the camera 90° around the feature
4. The animation creates an orbit effect

### Zoom In

1. Start with a wide view
2. Add a scene with the camera closer to the feature
3. The animation zooms in smoothly

### Ground-Level Drive

1. Position the camera at vehicle height (1.5m)
2. Set the target along the road alignment
3. Add scenes at intervals along the road
4. The animation simulates driving along the road

### Aerial Overview

1. Position the camera high above the project
2. Set the target at the project center
3. Add scenes at different angles
4. The animation creates an aerial survey effect

## Environment Settings

### Time of Day

- **Dawn (6:00 AM)**: Soft warm light, long shadows — dramatic effect
- **Midday (12:00 PM)**: Bright, even lighting — clear visibility
- **Golden Hour (5:00 PM)**: Warm light, long shadows — most flattering
- **Dusk (7:00 PM)**: Blue tones, lights turning on — atmospheric
- **Night (9:00 PM)**: Dark with street lights — urban context

### Weather

- **Clear**: Best for showing project details
- **Cloudy**: Soft, even lighting — good for technical presentations
- **Fog**: Atmospheric — use sparingly
- **Rain/Snow**: Shows drainage and weather impact — use for specific analysis

## Interactive Web Scenes

### Exporting to Web

1. File → Share → Cloud
2. Upload the model to Autodesk Docs
3. Generate a web scene link
4. Share the link with stakeholders
5. They can explore the 3D model in a web browser without InfraWorks

### Web Scene Features

- **Orbit, pan, zoom**: Full 3D navigation
- **Measure**: Distance and area measurements
- **Layer toggle**: Show/hide features
- **View presets**: Jump to predefined viewpoints
- **Comments**: Leave feedback on specific locations

## Presentation Best Practices

### For Public Hearings

1. Start with a wide aerial view showing the project location
2. Zoom in to the project area
3. Show existing conditions
4. Transition to the proposed design
5. Fly along the road alignment
6. Stop at key features (intersections, bridges)
7. Show before/after comparisons
8. End with a wide overview

### For Client Reviews

1. Focus on design changes since the last review
2. Use before/after comparisons for alternatives
3. Show detailed views of specific design elements
4. Include construction sequence if applicable
5. Keep the presentation under 5 minutes

### For Regulatory Submissions

1. Show the project in its full environmental context
2. Include visual impact analysis (before/after from key viewpoints)
3. Show drainage and earthwork analysis overlays
4. Demonstrate compliance with design standards
5. Export at high resolution (4K if possible)

## Common Issues

### Animation Is Jerky

- Increase scene duration (2-3 seconds minimum)
- Use ease-in/ease-out transitions
- Reduce the camera movement between scenes
- Increase the number of intermediate scenes

### Video Quality Is Low

- Increase export resolution to 1080p or 4K
- Increase frame rate to 60fps
- Enable anti-aliasing in export settings
- Render with higher quality settings

### Model Looks Empty

- Add buildings, trees, and street furniture
- Import GIS data for surrounding context
- Use coverage areas for landscaping
- Add vehicles and people for scale

### Export Takes Too Long

- Reduce video duration
- Lower resolution for draft previews
- Close other applications during rendering
- Simplify the model (reduce polygon count)

## Summary

InfraWorks storyboards create animated presentations for stakeholder communication. Add scenes by navigating to viewpoints and clicking Add Scene. Configure camera position, duration, time of day, and weather for each scene. The most effective presentations start with a wide overview, fly to the project area, follow key features, and end with a before/after comparison. Use ground-level drives for road projects and aerial orbits for bridge projects. Export as MP4 at 1080p for standard presentations, or use cloud sharing for interactive web scenes that stakeholders can explore independently. Keep presentations under 5 minutes for public hearings, and always preview the animation before exporting the final video.
