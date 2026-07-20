---
title: "3DEXPERIENCE xDesign and xShape: Browser-Based Modeling Workflow for SOLIDWORKS Teams"
excerpt: "How to use xDesign and xShape in the 3DEXPERIENCE platform — covering the transition from SOLIDWORKS desktop to browser-based modeling, feature comparison, data exchange via derived parts, and when to use each tool in a hybrid workflow."
category: "workflow"
softwareSlug: "3dexperience"
keyword: "3dexperience xdesign xshape browser based modeling solidworks workflow"
slug: "3dexperience-xdesign-xshape-browser-based-modeling-solidworks"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-09"
sources:
  - "https://3dswym.3dexperience.3ds.com/wiki/solidworks-news-info/setting-up-your-3dexperience-and-solidworks-environment_BDZiR6arRWqzpvBthirHOg"
  - "https://3dswym.3dexperience.3ds.com/wiki/solidworks-news-info/implementing-3dexperience-for-solidworks-users-solidpractices_HRtgRGasQ96Ppz_SfpikRw"
---

# 3DEXPERIENCE xDesign and xShape: Browser-Based Modeling Workflow for SOLIDWORKS Teams

xDesign and xShape are the browser-based CAD apps in the 3DEXPERIENCE platform. xDesign is for parametric feature-based modeling (like SOLIDWORKS). xShape is for subdivision surface modeling (like SolidWorks Power Surfacing or Blender). We've used both alongside SOLIDWORKS desktop in hybrid workflows. They're not replacements for SOLIDWORKS — they're complementary tools that extend CAD access to more team members. Here's how to use them effectively.

## Understanding xDesign and xShape

### xDesign

- **Parametric feature-based modeler** — similar to SOLIDWORKS part modeling
- **Runs in the browser** — no desktop installation
- **Feature tree** — familiar to SOLIDWORKS users
- **Sketch-based** — 2D sketches extruded/revolved into 3D
- **Assembly support** — basic assembly capabilities
- **Direct editing** — push/pull, move face, replace face

### xShape

- **Subdivision surface modeler** — organic, freeform shapes
- **Runs in the browser** — no desktop installation
- **Control cage manipulation** — pull points to shape surfaces
- **Bridge to parametric** — convert subdivision surfaces to B-rep solids
- **Concept modeling** — ideal for industrial design and concept development

## Step 1: Access the Apps

1. Log in to the 3DEXPERIENCE platform at `3dexperience.3ds.com`.
2. From the app switcher (3DDashboard), search for:
   - **3D Sculpt** (xShape) — for subdivision modeling
   - **3D Creator** (xDesign) — for parametric modeling
3. The app opens in the browser — no installation required.

### Role Requirements

- **3D Creator role**: Access to xDesign
- **3D Sculptor role**: Access to xShape
- **3DEXPERIENCE SOLIDWORKS**: Includes both roles

## Step 2: Model in xDesign

### Creating a Part

1. Open xDesign from the platform dashboard.
2. Click **New Component**.
3. Select a reference plane (XY, YZ, ZX).
4. Create a sketch:
   - Draw lines, circles, rectangles
   - Add dimensions and constraints
5. Extrude, revolve, or loft the sketch into a solid.
6. Add features:
   - **Fillets/Chamfers**: Edge treatments
   - **Holes**: Hole wizard with standard sizes
   - **Patterns**: Linear, circular, mirror
   - **Shell**: Hollow out a solid
   - **Rib**: Add reinforcing ribs
7. The feature tree shows the modeling history.

### xDesign vs SOLIDWORKS Differences

| Feature | xDesign | SOLIDWORKS |
|---|---|---|
| Platform | Browser | Desktop |
| File format | 3DEXPERience component | .sldprt |
| Feature tree | Similar | Similar |
| Sketching | Similar | Similar |
| Assemblies | Basic | Full |
| Drawings | Via 3D Drawing | Full 2D drawings |
| Add-ins | Limited | Extensive |
| Performance | Depends on internet | Local hardware |
| Offline | No | Yes |

### xDesign Best Practices

- **Use for concept design** — quick part creation without opening SOLIDWORKS
- **Use for remote access** — model from any device with a browser
- **Use for non-CAD users** — engineers and managers can review and make simple edits
- **Don't use for complex assemblies** — SOLIDWORKS desktop is better for large assemblies
- **Don't use for drawings** — SOLIDWORKS desktop drawing tools are more capable

## Step 3: Model in xShape

### Creating an Organic Shape

1. Open xShape from the platform dashboard.
2. Click **New Component**.
3. Start with a primitive:
   - **Box**: Subdivision cube
   - **Cylinder**: Subdivision cylinder
   - **Sphere**: Subdivision sphere
   - **Quad**: Subdivision quad mesh
4. Manipulate the control cage:
   - **Pull points**: Drag control points to shape the surface
   - **Add divisions**: Subdivide areas for more control
   - **Crease edges**: Make edges sharp
   - **Smooth edges**: Make edges rounded
5. Convert to solid:
   - Click **Convert to Solid**
   - The subdivision surface becomes a B-rep solid
   - The solid can be used in xDesign or SOLIDWORKS

### xShape Use Cases

- **Consumer product design** — ergonomic shapes, bottle contours, handles
- **Automotive concept** — body panels, interior trim concepts
- **Medical device design** — organic shapes that match anatomy
- **Concept exploration** — quick shape studies before committing to parametric modeling

### xShape Best Practices

- **Start simple** — begin with a primitive and add detail gradually
- **Use symmetry** — model one half and mirror
- **Convert to solid early** — don't over-refine the subdivision surface before converting
- **Check the solid in xDesign** — verify the converted solid is usable for downstream features

## Step 4: Hybrid Workflow — xDesign/xShape to SOLIDWORKS

The most powerful workflow combines browser apps with SOLIDWORKS desktop:

### Use Case 1: Concept in xShape, Detail in SOLIDWORKS

1. **Concept phase**: Use xShape to create an organic shape (e.g., a consumer product housing).
2. **Convert to solid**: Convert the subdivision surface to a B-rep solid.
3. **Save to platform**: Save the component to a Collaborative Space.
4. **Open in SOLIDWORKS**: Open the component in SOLIDWORKS desktop via MySession.
5. **Detail phase**: Add engineering features in SOLIDWORKS:
   - Mounting bosses
   - Snap fits
   - Ribs and gussets
   - Hole patterns
6. **Save back to platform**: Save the modified part back to the Collaborative Space.

### Use Case 2: Concept in xDesign, Detail in SOLIDWORKS

1. **Concept phase**: Use xDesign to create the basic part geometry.
2. **Save to platform**: Save the component to a Collaborative Space.
3. **Open in SOLIDWORKS**: Open the component in SOLIDWORKS via MySession.
4. **Derived part**: SOLIDWORKS creates a derived part linked to the xDesign component.
5. **Add features**: Add SOLIDWORKS-specific features on top of the derived geometry.
6. **Sync**: When the xDesign component is modified, the SOLIDWORKS derived part updates.

### Maintaining Feature References

For the derived part workflow to work correctly:

1. Configure the **Derived Format Management** in the Platform Management dashboard:
   - Navigate to Collaborative Spaces Configuration Center
   - Select Derived Format Management
   - Edit the conversion rule for the 3DEXPERIENCE converter
   - Enable "Additional Features" and "Generic Features and Associativity"
2. This preserves face IDs during geometry exchange, ensuring SOLIDWORKS features (fillets, holes) maintain references when the xDesign model updates.

## Step 5: Collaborative Design

### Multiple Users on the Same Assembly

1. User A creates an assembly in xDesign and saves to the platform.
2. User B opens the same assembly in SOLIDWORKS desktop.
3. Both users can work on different components simultaneously.
4. MySession shows the sync status:
   - **Up to date**: No changes from other users
   - **Modified by others**: Another user has changed a component
   - **Modified by us**: You have local changes
5. When either user saves, the other sees the update in MySession.

### Conflict Resolution

If both users modify the same component:
1. The platform detects the conflict on save.
2. The second user to save gets a conflict warning.
3. Options:
   - **Merge**: Attempt to merge changes (limited capability)
   - **Overwrite**: Save your version (other user's changes lost)
   - **Cancel**: Keep the other user's version, discard your changes

**Best practice**: Assign different components to different users. Don't have two people editing the same part simultaneously.

## Step 6: Review and Markup

Non-CAD users can participate in the design process:

1. **3DPlay**: View and section models in the browser — no CAD license needed
2. **3DSwym**: Comment on models in a social collaboration environment
3. **3DBoard**: Create 3D dashboards combining models, comments, and tasks
4. **Snapshot**: Capture a viewpoint and share it with stakeholders

This is a significant advantage over SOLIDWORKS PDM, where non-CAD users need eDrawings or PDM Web Client to view files.

## Best Practices

- **Use xDesign for simple parts and remote access** — don't force everything through SOLIDWORKS desktop
- **Use xShape for organic concepts** — then convert to solid and detail in SOLIDWORKS
- **Configure Derived Format Management** — preserves feature references during geometry exchange
- **Use Z-up orientation** — matches 3DEXPERIENCE native apps
- **Assign components, not assemblies, to users** — prevents concurrent edit conflicts
- **Train non-CAD users on 3DPlay** — enables review without CAD licenses
- **Don't replace SOLIDWORKS with browser apps** — use them as complementary tools
- **Test the derived part workflow before production** — ensure feature references survive updates
