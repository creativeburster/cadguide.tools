---
title: "CLO 3D Avatar Dressing Fabric Simulation and Export Errors"
excerpt: "CLO 3D Avatar Dressing Fabric Simulation and Export Errors: symptoms, root causes, and step-by-step fixes, verified against CLO Support, Blender Artists, and Virt-A-Mate Hub."
category: "workflow"
softwareSlug: "clo-3d"
keyword: "CLO 3D low-poly retopology Blender triangular topology fabric simulation buckling stretching default stiffness triangular mesh USD export garment simulation data avatar animation cache file corruption disk space multiple instances OBJ export missing fabric textures JPEG fabric files"
slug: "clo-3d-avatar-dressing-fabric-simulation-and-export-errors"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://blenderartists.org/t/clo-3d-to-blender-workflow/1519983"
  - "https://support.clo3d.com/hc/en-us/articles/23206278838681-How-to-Prevent-CLO-File-Corruption"
  - "https://hub.virtamate.com/threads/issue-with-unrealistic-physical-effects-during-self-made-clothing-creation-%EF%BC%88ai-translated%EF%BC%89.65368/"
---

# CLO 3D Avatar Dressing Fabric Simulation and Export Errors: Low-Poly Retopology from CLO to Blender Loses Details from Triangle Topology, Fabric Simulation Buckling Stretching from Default Low Stiffness and Triangular Mesh, USD Export Workflow for Garment Simulation Data and Avatar Animation Cache, File Corruption from Insufficient Disk Space and Multiple CLO Instances, and OBJ Export Missing Fabric Textures from CLO No Longer Supporting JPEG Fabric Files

CLO 3D's fabric simulation, export workflows, and file management produce errors from triangular topology, stiffness settings, disk space, and texture format changes. This guide covers the 5 most common CLO 3D problems with diagnostic steps and community-verified fixes from CLO Support, Blender Artists, and Virt-A-Mate Hub.

## 1. Low-Poly Retopology from CLO to Blender Loses Details

### Symptom

Exporting garments from CLO 3D to Blender for game assets with a 3,900 triangle limit. Reducing polygon count in CLO or Blender loses all details and parts of the cloth separate when remeshing. Baking high-poly to low-poly doesn't work because the cage doesn't fit the dress shape.

### Root Cause

CLO 3D exports triangular mesh topology. Triangular meshes don't reduce cleanly with quad-based decimation tools. Remeshing in Blender creates new topology that loses garment details (buttons, trims, stitching lines). The cage-based baking fails because the dress shape has concavities and self-collisions that the cage can't accommodate.

### Fix

1. **Produce lower density in CLO first**:
   - Adjust the mesh resolution in CLO before exporting
   - Use CLO's built-in mesh reduction tools
   - This preserves garment structure better than post-export reduction

2. **Manual retopology in Blender**:
   - Use Blender's retopology tools (Poly Build, Edge Loop, etc.)
   - Manually preserve critical details (buttons, seams, trims)
   - This is labor-intensive but produces the best results

3. **Bake normal maps from high-poly to low-poly**:
   - Export the high-poly garment from CLO
   - Create a low-poly version manually in Blender
   - Bake normal maps from high to low
   - Fix self-collisions in CLO before baking

4. **Export without trims and graphics**:
   - CLO has an option to export without graphics and trims
   - Bake trims and graphics as textures instead
   - Apply textures to the low-poly mesh in Blender

5. **Reduce button and trim polygon count**:
   - CLO doesn't offer direct polygon reduction for trims
   - Replace high-poly trims with simple geometry + texture
   - Export trims separately and simplify in Blender

### Community Report

> "My client needs his dress design in low-poly within 3900 triangles, but when I try to reduce the polygon count in Clo 3D or Blender, all kinds of details are lost and parts of the cloth separate when I remesh it. The cage doesn't work because of the dress shape."

## 2. Fabric Simulation Buckling and Stretching from Default Low Stiffness

### Symptom

Clothing created in CLO 3D appears highly unrealistic when simulated: fabric has almost no stiffness, stretches excessively when swung, and exhibits exaggerated deformations. Adjusting stiffness and compression to maximum in the target application (VAM) shows no improvement. Other creators' clothing demonstrates realistic physics with minimal stretching.

### Root Cause

CLO 3D's default fabric properties have low stiffness values. The triangular mesh topology from CLO doesn't simulate well in other physics engines (like VAM's cloth physics). Quad topology would provide better simulation behavior. The default export doesn't include proper fabric property data that other engines can interpret.

### Fix

1. **Increase fabric stiffness in CLO before export**:
   - In CLO's Property Editor, increase:
     - Stretch stiffness (warp and weft)
     - Shear stiffness
     - Bending stiffness
   - Set to maximum values before exporting
   - Test simulation in CLO to verify realistic behavior

2. **Retopologize to quadrilateral polygons**:
   - Export from CLO, then retopologize in Blender to quad topology
   - Quad meshes simulate more stably in most physics engines
   - Use Blender's retopology tools or add-ons

3. **Adjust fabric properties in the target engine**:
   - In VAM or other engines, adjust:
     - Stiffness multiplier
     - Stretch resistance
     - Compression resistance
   - The issue may be in the mesh topology, not just the properties

4. **Use CLO's fabric presets**:
   - CLO includes fabric presets with realistic stiffness values
   - Apply a denim or canvas preset for stiff fabrics
   - Apply a silk or chiffon preset for soft fabrics
   - Don't use default settings — always choose a fabric preset

5. **Export with simulation cache**:
   - Export the garment with simulation cache data
   - This preserves the simulated shape from CLO
   - The target engine can use the cached animation
   - Avoids re-simulation with incorrect properties

6. **Test with different export formats**:
   - OBJ: basic mesh, no simulation data
   - USD: includes simulation data and materials
   - FBX: includes basic animation
   - Test which format preserves fabric properties best

### Community Report

> "The white clothing modeled in CLO3D appears highly unrealistic physically: the fabric has almost no stiffness, stretches excessively when swung, and exhibits exaggerated deformations. The pink clothing created by other creators demonstrates far more realistic physics."

## 3. USD Export Workflow for Garment Simulation Data and Avatar Animation

### Symptom

Need to export CLO 3D garments and avatars to other 3D software (Blender, Unreal Engine) via USD format. Unclear which export settings preserve simulation data, avatar animation, and materials correctly.

### Root Cause

CLO's USD export has multiple options that affect what data is included. The USD Layer Window manages layers, but the workflow is not intuitive. Garment simulation data, avatar animation, and materials each require specific export settings.

### Fix

1. **Use the USD Layer Window**:
   - Create a USD file as the Authoring Layer
   - Export clothing, avatars, and accessories to the Authoring Layer
   - Materials are exported to a Texture folder within the USD directory

2. **Export garment simulation data**:
   - Enable "Include Garment Simulation Data" in export options
   - This includes necessary data for simulation setup in target software
   - Without this, the garment is a static mesh

3. **Export avatar animation**:
   - **Joint**: Saves animation data as skeletal animation (SkelAnimation under SkelRoot)
   - **Cache**: Saves avatar cache animation (baked animation data)
   - Use Joint for rig-based animation, Cache for baked animation

4. **Choose Thick or Thin export**:
   - **Thin**: Export USD without rendering thickness (single-surface mesh)
   - **Thick**: Export USD with rendering thickness as geometry (solid mesh)
   - The export depends on the 3D Garment Rendering Style state in CLO
   - If Thick Textured Surface is active, it exports with thickness

5. **Cache Animation option**:
   - Enable "Cache Animation" to save pattern cache animation
   - This bakes the garment animation into the mesh

6. **Set Prim Paths**:
   - Name the Prim Path for Mesh and Material when exporting
   - This organizes the USD hierarchy
   - Makes it easier to reference specific parts in target software

7. **Export USDZ from Layer**:
   - USDZ is a read-only packaged USD format
   - Once imported, USDZ cannot be exported again
   - Use USD (not USDZ) for editable workflows

### Community Report

> "With USD, you can increase collaboration productivity with a variety of 3D software. You can export clothing, avatars, and accessories with meshes and materials as USD files."

## 4. File Corruption from Insufficient Disk Space and Multiple CLO Instances

### Symptom

CLO project files (.zprj) and garment files (.zpac) become corrupted:
- "Failed to read the project file" error on launch
- "Unreadable" error when opening a saved project
- "Can't be saved" error when trying to save
- Opening takes a long time and eventually fails

### Root Cause

Multiple causes:
1. **Insufficient disk space**: CLO needs at least 20GB free space. If disk fills during saving, the file is partially written and corrupted.
2. **Multiple CLO instances**: Running two or more CLO instances simultaneously can corrupt project file internal data.
3. **Security software**: Antivirus or monitoring tools may restrict CLO's file creation and internet access.
4. **External storage**: USB sticks and portable hard drives have frequent connection failures during file transfer.
5. **Cloud sync services**: NAS and cloud sync may corrupt files during network transfer.

### Fix

1. **Maintain at least 20GB free disk space**:
   - Regularly delete or back up unnecessary files
   - Monitor disk space during long sessions

2. **Run only one CLO instance at a time**:
   - Close one instance before opening another
   - Save the final result with only one CLO running

3. **Configure security software**:
   - Add CLO to antivirus exclusions
   - For enterprise users, contact IT/Security department

4. **Avoid external storage for active work**:
   - Work on local drives only
   - Transfer to external storage after saving and closing

5. **Exclude CLO folders from cloud sync**:
   - Disable syncing Desktop and Documents folders
   - Cloud sync may remove or damage files during sync

6. **Check file size for corruption**:
   - Compare with expected file size (~20MB for basic t-shirt + avatar)

7. **Divide long animations into sections**:
   - Save each section as a separate file

8. **Check disk health**:
   - Use built-in disk management tools (Windows/macOS)
   - Run disk error checking
   - Contact IT support for physical disk failures

### Community Report

> "If disk space is insufficient during the process of designing and saving garments in CLO software, file corruption may actually occur. We recommend that you have at least 20GB of free space. If you use two or more CLO software at the same time, there is a possibility that the internal data may be lost or corrupted."

## 5. OBJ Export Missing Fabric Textures from CLO No Longer Supporting JPEG

### Symptom

Clothing exported from CLO 3D as OBJ files and imported into Blender shows missing fabric textures. The mesh appears as a purple patch instead of the fabric color. Blender reports "Unable to pack file, file source (CLO fabric title.jpg) not found." This worked previously but stopped after a CLO update.

### Root Cause

CLO no longer supports JPEG files for fabrics. The fabric texture references in the exported OBJ point to .jpg files that CLO no longer creates. The .zfab fabric files are still on the computer, but the OBJ export doesn't include the texture files. Blender can't find the referenced JPEG files.

### Fix

1. **Export textures separately from CLO**:
   - Before exporting OBJ, export fabric textures as image files
   - Use CLO's texture export feature
   - Save textures in a known location
   - Re-link textures in Blender manually

2. **Use USD export instead of OBJ**:
   - USD export includes materials and textures
   - All related textures are saved in the Texture folder
   - Import USD into Blender with textures intact

3. **Bake fabric appearance to textures**:
   - In CLO, bake the fabric appearance (color, pattern, texture) to a texture map
   - Export the baked texture with the OBJ
   - Apply the texture in Blender

4. **Purchase CLO fabric kit**:
   - CLO's fabric kit includes proper texture export capabilities
   - This is a paid solution for professional workflows

5. **Use CLO's PBR material export**:
   - Export materials as PBR (Physically Based Rendering) maps
   - Include base color, roughness, normal, and metallic maps
   - These can be re-created in Blender's material editor

6. **Manually re-create fabric materials in Blender**:
   - Take screenshots of the fabric in CLO
   - Re-create the material in Blender using Principled BSDF
   - Use the screenshots as reference for color and roughness
   - This is time-consuming but doesn't require additional purchases

### Community Report

> "It is happening because CLO no longer supports JPEG files for fabrics. You now have to spend $5K for their fabric kit to render your own textiles. The mesh portion shows up as a purple patch on the OBJ when before it showed up as the fabric color."

## 6. Additional CLO 3D Issues

### Button and Trim Polygon Count

**Issue**: No option to reduce polygon count of trims and buttons in CLO export.
**Fix**: Export without trims and graphics. Replace with simplified geometry in Blender. Or bake trim appearance to textures.

### Fabric Properties Not Transferring to Other Engines

**Issue**: Fabric stiffness and compression values set in CLO don't transfer to other physics engines.
**Fix**: Adjust properties in the target engine. Retopologize to quad mesh for better simulation. Export with simulation cache to preserve CLO's simulation.

### USD Layer Management

**Issue**: USD Layer Window is confusing to manage.
**Fix**: Set the correct Authoring Layer before exporting. Use "Set Authoring Layer" by double-clicking. Delete unused layers. USDZ files are read-only — use USD for editable workflows.

### Large Animation File Corruption

**Issue**: Long animations with heavy garments corrupt easily.
**Fix**: Divide the scene into sections. Save each section separately. Keep at least 20GB free disk space. Run only one CLO instance.

## Best Practices

1. **Set fabric properties in CLO before export** — don't rely on defaults
2. **Use quad topology for simulation in other engines** — retopologize from CLO's triangles
3. **Use USD export for complete data transfer** — includes materials, simulation, animation
4. **Maintain 20GB free disk space** — prevents file corruption during saving
5. **Run only one CLO instance** — prevents project file data loss
6. **Exclude CLO folders from cloud sync** — prevents sync corruption
7. **Check file size after saving** — <1MB means unrecoverable corruption
8. **Divide long animations into sections** — prevents fragile animation data
9. **Export textures separately if using OBJ** — CLO no longer includes JPEG textures
10. **Bake fabric appearance to textures** — preserves visual appearance in export
