---
title: "SimScale Workflow and Collaboration: Project Setup, Mesh Import, and Team Sharing"
excerpt: "A guide to SimScale workflow and collaboration covering project setup, CAD import and geometry preparation, mesh configuration, simulation templates, result sharing, public projects, and API integration for automated simulation pipelines."
category: "workflow"
softwareSlug: "simscale"
keyword: "simscale workflow collaboration"
slug: "simscale-workflow-collaboration-project-setup-mesh-import-team-sharing"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://www.simscale.com/product/"
  - "https://docs.simscale.com/"
---

# SimScale Workflow and Collaboration: Project Setup, Mesh Import, and Team Sharing

The collaboration features in SimScale are what actually sold me on the platform. I was working on a project with a team spread across three time zones, and the ability to share a simulation result with a simple URL — no software install, no file transfer — was a game changer. Let me walk you through the workflow and collaboration tools I use regularly.

## Project Setup

### Creating a Project

1. Dashboard > New Project
2. Set:
   - **Project name**: Descriptive (e.g., "Heat Sink Optimization Q3 2026")
   - **Description**: Project details and objectives
   - **Visibility**: Private or Public
3. Project structure:
   - **Geometries**: CAD files
   - **Meshes**: Generated meshes
   - **Simulations**: Analysis setups
   - **Runs**: Solver executions
   - **Results**: Post-processing data

### Importing CAD

1. Geometries > Import
2. Supported formats:
   - **STEP** (.stp, .step): Recommended (neutral, preserves geometry)
   - **IGES** (.igs, .iges): Legacy neutral
   - **Parasolid** (.x_t, .x_b): Siemens NX, Solid Edge
   - **BREP** (.brep): Open CASCADE native
   - **STL** (.stl): Mesh format (for 3D scans or topology optimization)
3. File size limit:
   - **Community**: 100 MB
   - **Professional**: 500 MB
   - **Enterprise**: 2 GB
4. After import:
   - Check geometry for errors (gaps, sliver faces)
   - Use SimScale geometry tools to repair
   - Mid-surface thin walls (for shell meshing)

### Geometry Preparation

1. **Simplify**: Remove unnecessary features (small fillets, logos)
2. **Decimate**: Reduce detail in non-critical regions
3. **Mid-surface**: Convert thin solids to surfaces (for shells)
4. **Imprint**: Ensure mating surfaces share edges (for contact)
5. **Clean**: Remove duplicate surfaces, merge edges

## Mesh Configuration

### Automatic Meshing

1. Meshes > Create Mesh
2. Select geometry
3. Mesh type:
   - **Tetrahedral**: General purpose (most geometries)
   - **Hex dominant**: Better quality (for simple geometries)
   - **Shell**: For thin walls (2D elements)
4. Fineness: 1-10
   - **1-3**: Coarse (fast, preliminary)
   - **4-6**: Moderate (typical production)
   - **7-10**: Fine (high accuracy, slow)
5. Local refinements:
   - **Face refinement**: Select critical faces, set element size
   - **Edge refinement**: Select critical edges
   - **Region refinement**: Select volume, set element size
   - **Inflation layers**: For CFD wall treatment

### Mesh Quality Check

1. After meshing, SimScale reports:
   - **Total cells**: Element count
   - **Total nodes**: Node count
   - **Mesh quality**: Orthogonal quality, aspect ratio
2. Check:
   - **Orthogonal quality**: > 0.1 (minimum), > 0.3 (good)
   - **Aspect ratio**: < 20 (acceptable), < 5 (good)
   - **Skewness**: < 0.8 (acceptable), < 0.5 (good)
3. If quality is poor:
   - Increase fineness
   - Add local refinements
   - Simplify geometry

### Mesh Import

1. SimScale supports mesh import:
   - **OpenFOAM**: .polyMesh folder
   - **UNV**: Universal mesh format
   - **STL**: Triangulated mesh (for CFD surfaces)
2. Use case:
   - Mesh generated in external tool (HyperMesh, ANSA, Gmsh)
   - Import to SimScale for solver execution
3. Advantage:
   - Use specialized meshing tool for complex geometry
   - Run solver on cloud HPC

## Simulation Templates

### Creating Templates

1. Set up a simulation with all physics, materials, and boundary conditions
2. Save as template:
   - Simulations > Save as Template
3. Template includes:
   - **Analysis type**: Static, CFD, thermal, etc.
   - **Materials**: Assigned to geometry
   - **Boundary conditions**: Loads and supports
   - **Solver settings**: Tolerances, time steps
4. Template does NOT include:
   - Geometry (must be re-imported)
   - Mesh (must be re-generated)

### Using Templates

1. New Simulation > From Template
2. Select template
3. Import new geometry
4. Generate mesh
5. Assign materials and boundary conditions to new geometry
6. Run

### Template Applications

1. **Standardized analyses**: Same analysis type across multiple products
2. **Design variants**: Same setup with different geometry
3. **Team standards**: Ensure consistent simulation setup
4. **Onboarding**: New team members use validated templates

## Running Simulations

### Solver Selection

1. SimScale uses open-source solvers:
   - **Code_Aster**: Structural (static, dynamic, nonlinear)
   - **OpenFOAM**: CFD (incompressible, compressible, multiphase)
   - **CalculiX**: Structural (alternative to Code_Aster)
2. SimScale auto-selects solver based on analysis type
3. No need to configure solver manually (but advanced settings available)

### Run Configuration

1. Simulations > Create Run
2. Set:
   - **Run name**: Descriptive (e.g., "Baseline_v1")
   - **Compute resources**: Number of cores (8, 16, 32)
   - **Maximum runtime**: Prevent runaway jobs (e.g., 24 hours)
3. Run:
   - Click "Start"
   - Simulation queued on cloud
   - Monitor: Progress bar, residual plots
4. Run time depends on:
   - Mesh size (more cells = longer)
   - Physics complexity (nonlinear = longer)
   - Cores (more = faster, up to scaling limit)

### Parallel Runs

1. Run multiple simulations simultaneously:
   - **Parametric study**: Different parameter values
   - **Design variants**: Different geometries
   - **Wind directions**: 8 directions in parallel
2. Each run uses independent cloud resources
3. No interference between runs
4. Total cost = sum of all runs

## Result Sharing and Collaboration

### Sharing Results

1. Results > Share
2. Options:
   - **Private link**: Only people with link can view
   - **Team share**: All team members can view
   - **Public link**: Anyone can view (no login required)
3. Shared results include:
   - **3D viewer**: Interactive post-processing in browser
   - **Contour plots**: Pre-configured views
   - **Probe points**: Pre-defined measurement points
   - **Animations**: Mode shapes, transient results

### Team Collaboration

1. Organization > Teams
2. Create teams:
   - **Structural team**: Access to FEA projects
   - **CFD team**: Access to CFD projects
   - **Management**: View-only access to all projects
3. Permissions:
   - **Owner**: Full control (delete, share, edit)
   - **Editor**: Can create and modify simulations
   - **Viewer**: Can view results only
4. Real-time collaboration:
   - Multiple users can view same project simultaneously
   - Comments on simulations and results
   - Version history (track changes)

### Public Projects

1. Project > Visibility > Public
2. Public projects:
   - **Anyone can view**: Without SimScale account
   - **Showcase**: Portfolio of simulation work
   - **Education**: Share tutorials and examples
3. SimScale public project library:
   - Browse community projects
   - Copy and modify for own use
   - Learn from real-world examples

## API Integration

### SimScale API

1. REST API for automation:
   - **Create project**: Programmatically
   - **Import geometry**: From URL or upload
   - **Create mesh**: Trigger meshing
   - **Create simulation**: From template
   - **Start run**: Execute solver
   - **Get results**: Download results
2. Authentication:
   - API key (from account settings)
   - Bearer token in header
3. Use cases:
   - **Automated pipeline**: CAD → mesh → simulate → report
   - **Design optimization**: Run many variants automatically
   - **Integration**: Embed simulation in product development workflow

### Example API Workflow

```python
import requests

# Create project
headers = {"Authorization": "Bearer YOUR_API_KEY"}
project = requests.post("https://api.simscale.com/v1/projects",
    headers=headers,
    json={"name": "Automated Analysis", "visibility": "private"})

# Import geometry
geometry = requests.post(f"https://api.simscale.com/v1/projects/{project_id}/geometries",
    headers=headers,
    json={"url": "https://example.com/part.step"})

# Create mesh
mesh = requests.post(f"https://api.simscale.com/v1/projects/{project_id}/meshes",
    headers=headers,
    json={"geometry_id": geometry_id, "fineness": 5})

# Create simulation from template
sim = requests.post(f"https://api.simscale.com/v1/projects/{project_id}/simulations",
    headers=headers,
    json={"template_id": "structural_template_001"})

# Start run
run = requests.post(f"https://api.simscale.com/v1/projects/{project_id}/simulations/{sim_id}/runs",
    headers=headers,
    json={"name": "Automated Run", "num_cores": 16})
```

## Cost Management

### Pricing Model

1. **Community plan**: Free (limited resources)
   - 8 cores, 100K nodes, public projects
2. **Professional plan**: Monthly/annual subscription
   - 32 cores, 5M nodes, private projects
   - Includes support and training
3. **Enterprise plan**: Custom pricing
   - 96 cores, unlimited mesh, API access
   - Dedicated support, SLA

### Cost Optimization

1. **Start coarse**: Run preliminary with coarse mesh (fast, cheap)
2. **Refine selectively**: Only refine critical regions
3. **Use symmetry**: Reduce model size by 2× or 4×
4. **Parallel runs**: Run variants simultaneously (faster wall time)
5. **Templates**: Avoid re-setup errors (save time)
6. **Monitor runs**: Cancel stuck or diverging runs early

## Best Practices

1. **Geometry first**: Clean geometry before meshing
2. **Mesh convergence**: Verify results don't change with refinement
3. **Start simple**: Linear analysis before nonlinear
4. **Validate**: Compare to analytical or experimental data
5. **Document**: Use project description and run names
6. **Share early**: Get team feedback during setup
7. **Use templates**: Standardize across team
8. **Monitor cost**: Track core-hours per project

## Wrapping Up

The collaboration side of SimScale is honestly its biggest differentiator. Being able to send a client a link and let them explore the 3D results in their browser — no software, no plugins — is huge for client communication. The API is also handy if you want to automate repetitive analyses. I set up a pipeline that runs a standard thermal analysis on every new heat sink design and posts the results to our team chat. It's not something you'd do with desktop CAE without a lot of scripting and infrastructure.
