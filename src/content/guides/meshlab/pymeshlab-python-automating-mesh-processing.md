---
title: "PyMeshLab: Automating Mesh Processing with Python Filter Scripts"
excerpt: "PyMeshLab is the Python binding for MeshLab that enables batch processing of meshes — cleaning, decimation, smoothing, and surface reconstruction — all scriptable and reproducible."
category: "workflow"
softwareSlug: "meshlab"
keyword: "pymeshlab python scripting batch mesh processing"
slug: "pymeshlab-python-automating-mesh-processing"
author: "CADGuide Technical Editorial"
readTime: "8 min read"
date: "2026-07-12"
sources:
  - "https://github.com/cnr-isti-vclab/PyMeshLab"
  - "https://pymeshlab.readthedocs.io/en/latest/filter%5Fscripts.html"
  - "https://pymeshlab.readthedocs.io/en/latest/"
---

# PyMeshLab: Automating Mesh Processing with Python Filter Scripts

PyMeshLab is a Python library that interfaces with MeshLab, providing programmatic access to all of MeshLab's mesh processing filters. It replaces the deprecated `meshlabserver` command-line tool and enables batch processing, reproducible pipelines, and integration into automated workflows.

## Installation

```
pip install pymeshlab
```

PyMeshLab is available on PyPI and supports Python 3.7+. It works on Windows, Linux, and macOS.

## Basic Usage

```python
import pymeshlab

ms = pymeshlab.MeshSet()
ms.load_new_mesh('input.obj')

# Apply filters
ms.generate_convex_hull()
ms.save_current_mesh('convex_hull.ply')
```

Every `MeshSet` object represents a collection of meshes (layers in MeshLab GUI terms). You load meshes, apply filters, and save results — all programmatically.

## Filter Scripts: Record and Replay

The most powerful feature of PyMeshLab is filter scripts — sequences of filters with specific parameters that can be saved, loaded, and applied to any mesh.

### Generating a Filter Script from MeshLab GUI

According to the PyMeshLab documentation:

1. Open MeshLab and apply all desired filters to a mesh
2. Go to **Filters → Show current filter script**
3. A dialog appears showing the list of all applied filters
4. Edit the order and parameters as needed
5. Save the filter script as an `.mlx` file

### Applying a Filter Script in Python

```python
import pymeshlab

ms = pymeshlab.MeshSet()
ms.load_new_mesh('input.obj')
ms.load_filter_script('my_script.mlx')
ms.apply_filter_script()
ms.save_current_mesh('result.obj')
```

This applies the exact same sequence of filters with the same parameters to any input mesh. This is invaluable for:
- Batch processing hundreds of scan files with the same cleaning pipeline
- Ensuring reproducible results across different runs
- Documenting the exact processing steps used

### Saving a Filter Script from Python

```python
import pymeshlab

ms = pymeshlab.MeshSet()
ms.load_new_mesh('input.obj')
ms.apply_coord_laplacian_smoothing(stepsmoothnum=10)
# apply more filters...
ms.save_filter_script('my_script.mlx')
```

## Common Processing Pipeline

Here's a typical mesh cleaning pipeline using PyMeshLab:

```python
import pymeshlab

ms = pymeshlab.MeshSet()
ms.load_new_mesh('raw_scan.stl')

# Step 1: Remove duplicate vertices and faces
ms.apply_meshing_remove_duplicate_vertices()
ms.apply_meshing_remove_duplicate_faces()

# Step 2: Remove unreferenced vertices
ms.apply_meshing_remove_unreferenced_vertices()

# Step 3: Repair non-manifold edges
ms.apply_meshing_repair_non_manifold_edges()

# Step 4: Repair non-manifold vertices
ms.apply_meshing_repair_non_manifold_vertices()

# Step 5: Merge close vertices
ms.apply_meshing_merge_close_vertices(threshold=pymeshlab.Percentage(0.1))

# Step 6: Decimate (reduce face count)
ms.apply_meshing_decimation_quadric_edge_collapse(
    targetfacenum=50000,
    preservenormal=True,
    preservetopology=True,
    qualitythr=0.3
)

# Step 7: Smooth
ms.apply_coord_taubin_smoothing(stepsmoothnum=10)

# Step 8: Save
ms.save_current_mesh('clean_mesh.ply')
```

## Batch Processing Multiple Files

```python
import pymeshlab
import os
import glob

input_dir = 'scans/'
output_dir = 'cleaned/'
os.makedirs(output_dir, exist_ok=True)

for filepath in glob.glob(os.path.join(input_dir, '*.stl')):
    filename = os.path.basename(filepath)
    output_path = os.path.join(output_dir, filename.replace('.stl', '.ply'))
    
    ms = pymeshlab.MeshSet()
    ms.load_new_mesh(filepath)
    
    # Apply cleaning pipeline
    ms.apply_meshing_remove_duplicate_vertices()
    ms.apply_meshing_remove_duplicate_faces()
    ms.apply_meshing_remove_unreferenced_vertices()
    ms.apply_meshing_repair_non_manifold_edges()
    ms.apply_meshing_repair_non_manifold_vertices()
    ms.apply_meshing_decimation_quadric_edge_collapse(targetfacenum=50000)
    
    ms.save_current_mesh(output_path)
    print(f'Processed: {filename}')
```

## Filter Name Changes

Starting from version 2022.2, PyMeshLab renamed filter names to be more explanatory. Old filter names are deprecated. To automatically update old scripts:

```python
import pymeshlab

# Update a single script
pymeshlab.replace_pymeshlab_filter_names('/path/to/my/script.py')

# Update all scripts in a directory
pymeshlab.replace_pymeshlab_filter_names('/path/to/my/dir/')
```

If you encounter `AttributeError` when calling a filter method, check the [filter list documentation](https://pymeshlab.readthedocs.io/en/latest/filter_list.html) for the current name.

## Getting Filter Parameters

To see what parameters a filter accepts:

```python
import pymeshlab

ms = pymeshlab.MeshSet()
help(ms.apply_meshing_decimation_quadric_edge_collapse)
```

Or check the [PyMeshLab filter list](https://pymeshlab.readthedocs.io/en/latest/filter_list.html) in the documentation, which lists all filter names and their parameters with default values.

Note that some default parameter values are computed based on the input mesh (the documentation lists defaults computed on a 1×1×1 cube). Leave parameters as default to let PyMeshLab compute them based on your actual mesh.

## Performance Considerations

- **Memory**: PyMeshLab loads the entire mesh into memory. For very large meshes (>2GB), ensure sufficient RAM is available
- **No GUI overhead**: PyMeshLab doesn't render the mesh, so it uses significantly less memory than the MeshLab GUI for the same operations
- **Parallel processing**: You can run multiple PyMeshLab scripts in parallel (separate Python processes) to utilize multi-core CPUs for batch processing
- **MeshLab vs PyMeshLab results**: Both use the same underlying C++ library, so results are identical between GUI and scripted processing

## Use Cases

- **3D scanning pipelines**: Automatically clean, decimate, and export scan data
- **3D print preparation**: Batch-process STL files for print readiness
- **Research reproducibility**: Document exact mesh processing steps in publications
- **Web service integration**: Run mesh processing as a backend service
- **Quality control**: Automatically check meshes for non-manifold errors and generate reports
