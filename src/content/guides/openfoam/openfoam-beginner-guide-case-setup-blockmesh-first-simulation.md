---
title: "OpenFOAM Beginner Guide: Case Setup, Mesh Generation with blockMesh, and First Simulation"
excerpt: "Get started with OpenFOAM CFD: understand case directory structure, create mesh with blockMesh, configure boundary conditions, select a solver, run your first simulation, and post-process with ParaView."
category: "deployment"
softwareSlug: "openfoam"
keyword: "openfoam beginner guide case setup blockmesh first simulation"
slug: "openfoam-beginner-guide-case-setup-blockmesh-first-simulation"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-07-13"
sources:
  - "https://www.openfoam.com/documentation/tutorial-guide"
  - "https://www.openfoam.com/documentation/tutorial-guide/1-introduction"
---

# OpenFOAM Beginner Guide: Case Setup, Mesh Generation with blockMesh, and First Simulation

OpenFOAM is a free, open-source CFD toolbox used across academia and industry. Unlike commercial CFD software with polished GUIs, OpenFOAM is command-line driven and uses text files for all configuration. This makes the learning curve steeper but gives complete control over the simulation. We'll walk you through your first OpenFOAM case from scratch.

## OpenFOAM Case Structure

Every OpenFOAM case has a specific directory structure:

```
myCase/
├── 0/                  # Initial and boundary conditions
│   ├── U              # Velocity field
│   ├── p              # Pressure field
│   └── ...
├── constant/          # Mesh and physical properties
│   ├── polyMesh/      # Mesh files
│   ├── transportProperties  # Fluid properties
│   └── turbulenceProperties # Turbulence model
├── system/            # Solver and run parameters
│   ├── controlDict    # Time stepping, output
│   ├── fvSchemes      # Discretization schemes
│   └── fvSolution     # Linear solver settings
```

Each file is a text dictionary with a specific format. Understanding this structure is the foundation of using OpenFOAM.

## Creating Your First Case: Lid-Driven Cavity

The lid-driven cavity is the "Hello World" of CFD — a square cavity with a moving top wall. It's the standard OpenFOAM tutorial and demonstrates the complete workflow.

### Step 1: Create the Case Directory

```bash
mkdir -p myCavity/0 myCavity/constant myCavity/system
cd myCavity
```

### Step 2: Define Boundary Conditions (0/ directory)

Create `0/U` (velocity):

```
dimensions      [0 1 -1 0 0 0 0];  // m/s

internalField   uniform (0 0 0);

boundaryField
{
    movingWall
    {
        type            fixedValue;
        value           uniform (1 0 0);  // 1 m/s in x-direction
    }
    fixedWalls
    {
        type            noSlip;
    }
    frontAndBack
    {
        type            empty;  // 2D case
    }
}
```

Create `0/p` (pressure):

```
dimensions      [0 2 -2 0 0 0 0];  // m²/s² (kinematic pressure)

internalField   uniform 0;

boundaryField
{
    movingWall
    {
        type            zeroGradient;
    }
    fixedWalls
    {
        type            zeroGradient;
    }
    frontAndBack
    {
        type            empty;
    }
}
```

Key concepts:
- **dimensions** — uses SI units in bracket notation [kg m s K mol A cd]
- **internalField** — initial value for all internal cells
- **boundaryField** — conditions for each boundary patch
- **fixedValue (Dirichlet)** — specifies the value
- **zeroGradient (Neumann)** — zero gradient normal to boundary
- **noSlip** — zero velocity at wall
- **empty** — for 2D cases (no flow in z-direction)

### Step 3: Create the Mesh (constant/polyMesh/)

Use `blockMesh` to generate a structured hexahedral mesh.

Create `system/blockMeshDict`:

```
convertToMeters 0.1;  // Scale factor: 1 unit = 0.1 m

vertices
(
    (0 0 0)      // vertex 0
    (1 0 0)      // vertex 1
    (1 1 0)      // vertex 2
    (0 1 0)      // vertex 3
    (0 0 0.1)    // vertex 4
    (1 0 0.1)    // vertex 5
    (1 1 0.1)    // vertex 6
    (0 1 0.1)    // vertex 7
);

blocks
(
    hex (0 1 2 3 4 5 6 7) (20 20 1) simpleGrading (1 1 1)
);

boundary
(
    movingWall
    {
        type wall;
        faces
        (
            (3 7 6 2)
        );
    }
    fixedWalls
    {
        type wall;
        faces
        (
            (0 4 7 3)
            (2 6 5 1)
            (1 5 4 0)
        );
    }
    frontAndBack
    {
        type empty;
        faces
        (
            (0 3 2 1)
            (4 5 6 7)
        );
    }
);
```

Run blockMesh:

```bash
blockMesh
```

This creates the mesh in `constant/polyMesh/`. The mesh is 20×20×1 cells — a simple uniform grid.

### Step 4: Define Physical Properties (constant/)

Create `constant/transportProperties`:

```
nu              [0 2 -1 0 0 0 0] 0.01;  // Kinematic viscosity
```

Create `constant/turbulenceProperties`:

```
simulationType  laminar;  // No turbulence model for this case
```

### Step 5: Configure Solver Settings (system/)

Create `system/controlDict`:

```
application     icoFoam;  // Incompressible transient solver

startFrom       startTime;
startTime       0;

stopAt          endTime;
endTime         0.5;

deltaT          0.005;

writeControl    timeStep;
writeInterval   20;

purgeWrite      0;

writeFormat     ascii;
writePrecision  6;

runTimeModifiable true;
```

Create `system/fvSchemes`:

```
ddtSchemes
{
    default         Euler;  // First-order time
}

gradSchemes
{
    default         Gauss linear;
}

divSchemes
{
    default         none;
    div(phi,U)      Gauss linear;
}

laplacianSchemes
{
    default         Gauss linear corrected;
}
```

Create `system/fvSolution`:

```
solvers
{
    p
    {
        solver          PCG;
        preconditioner  DIC;
        tolerance       1e-06;
        relTol          0.01;
    }
    U
    {
        solver          PBiCG;
        preconditioner  DILU;
        tolerance       1e-05;
        relTol          0.1;
    }
}

PISO
{
    momentumPredictor no;
    nCorrectors     2;
    nNonOrthogonalCorrectors 0;
    pRefCell        0;
    pRefValue       0;
}
```

### Step 6: Run the Simulation

```bash
icoFoam
```

The solver runs and writes results at intervals defined by `writeInterval`. You'll see time step information in the terminal output.

### Step 7: Post-Process with ParaView

```bash
paraFoam
```

Or open ParaView directly and load the OpenFOAM case:

1. Open ParaView
2. File > Open > select the case directory
3. Select "OpenFOAM" reader
4. Click "Apply"
5. Select the variable to visualize (U, p)
6. Use filters like "Slice", "Contour", "Streamline" for visualization

## Common Issues for Beginners

### "File not found" Errors

OpenFOAM requires all files in the correct directories. Check:
- `0/U` and `0/p` exist
- `constant/transportProperties` and `constant/turbulenceProperties` exist
- `system/controlDict`, `system/fvSchemes`, `system/fvSolution` exist

### Mesh Problems

Run `checkMesh` to verify mesh quality:

```bash
checkMesh
```

This reports mesh statistics and any errors. Fix any reported issues before running the solver.

### Solver Divergence

If the solver diverges (NaN values, rapidly increasing numbers):
- Reduce the time step (deltaT in controlDict)
- Check boundary conditions for consistency
- Verify mesh quality
- Use first-order schemes before switching to higher-order

### Environment Not Set Up

OpenFOAM requires environment variables to be set:

```bash
source /opt/openfoam9/etc/bashrc
```

Add this to your `.bashrc` file to set it automatically on login.

## Best Practices

- **Start with a tutorial case** — copy from `$FOAM_TUTORIALS` and modify
- **Check mesh quality** — run `checkMesh` before every simulation
- **Use first-order schemes first** — switch to second-order after convergence
- **Monitor convergence** — watch the solver output for residual behavior
- **Keep the case organized** — use meaningful names and document changes
- **Use the OpenFOAM documentation** — the User Guide and Tutorial Guide are comprehensive
- **Join the community** — the OpenFOAM forum on CFD-Online is very helpful for beginners
