# CAD Calculators & Tools — Domain Blueprint

**Route**: `/calculators`  
**Nav Label**: `Calculators`  
**Status**: Future Phase — to be built after `/guides` is stable  
**Branch**: `feature/calculators` (planned, separate from guides)

> This domain sits as the **third major product pillar** of cadguide.tools, parallel to `/tools` (software reviews) and `/guides` (technical articles). Unlike articles, every page here is a **live, interactive utility** — real-time inputs, instant results, shareable outputs.

---

## Why Calculators Win at SEO

Interactive tools are the most powerful natural link magnets on the web. Engineers bookmark them, share them in forums, embed them in documentation, and return to them weekly. Key benefits:

- **Zero bounce** — users interact for minutes, not seconds
- **High shareability** — "best sheet metal calculator" shared on r/engineering, Grabcad forums, LinkedIn
- **Evergreen traffic** — a K-Factor calculator is searched 10,000+ times/month and never goes stale
- **Backlink magnet** — tools attract 10× more backlinks than equivalent articles
- **Featured snippet capture** — Google often features interactive tools at the top of SERP

---

## Architecture

```
/calculators                          ← Hub index (directory of all tools)
/calculators/[slug]                   ← Each individual calculator page
```

Each calculator page has:
- **Full-screen interactive tool** (inputs, sliders, real-time outputs)
- **Formula explanation section** (educational, indexable text)
- **Related software links** (internal links back to `/tools/[slug]`)
- **Related guides links** (internal links to `/guides/[slug]`)
- **Download/copy result button**

---

## 8 Calculator Categories (Sections)

---

### Category 1: Sheet Metal & Fabrication (`fabrication`)

| # | Calculator Name | Slug | Primary Keyword | Description |
|---|----------------|------|----------------|-------------|
| 1 | K-Factor & Bend Allowance Calculator | `k-factor-bend-allowance` | sheet metal k factor calculator | Enter material thickness, bend radius, bend angle → get flat pattern length, bend allowance, bend deduction |
| 2 | Flat Pattern / Unfold Length Calculator | `flat-pattern-unfold-length` | flat pattern calculator cad | Calculate the flat blank length required for a bent part |
| 3 | Sheet Metal Weight Calculator | `sheet-metal-weight-calculator` | sheet metal weight calculator | Enter material, thickness, dimensions → get weight in kg/lb |
| 4 | Press Brake Tonnage Calculator | `press-brake-tonnage` | press brake tonnage calculator | Calculate required clamping force for air bending operations |
| 5 | Springback Angle Compensation | `springback-angle-compensation` | springback calculator sheet metal | Calculate over-bend angle needed to achieve final target angle |
| 6 | Hole-to-Edge Clearance Checker | `hole-edge-clearance` | minimum hole distance from edge | Check if punched holes meet minimum edge distance rules |
| 7 | Material Bend Radius Finder | `minimum-bend-radius` | minimum bend radius calculator | Find minimum inside bend radius for a given material and thickness |
| 8 | Shear Force Calculator | `shear-force-sheet-metal` | shear force cad calculator | Calculate shear force for straight-line cutting operations |
| 9 | Developed Length Calculator | `developed-length-calculator` | developed length rolled tube | Find the flat blank width needed to roll a tube or cylinder |
| 10 | Weld Filler Wire Calculator | `weld-filler-weight` | weld filler wire weight calculator | Estimate filler wire consumption for a given weld joint geometry |

---

### Category 2: 3D Printing & Additive (`additive`)

| # | Calculator Name | Slug | Primary Keyword | Description |
|---|----------------|------|----------------|-------------|
| 1 | 3D Print Material Cost Estimator | `3d-print-cost-estimator` | 3d print cost calculator | Enter part volume, material, infill density → cost per gram + total cost |
| 2 | FDM Print Time Estimator | `fdm-print-time-estimator` | 3d print time calculator | Estimate print time from layer count, print speed, and travel moves |
| 3 | STL File Mesh Quality Checker | `stl-mesh-quality-checker` | stl mesh quality check | Validate triangle count, polygon density, and watertight integrity |
| 4 | Plastic Shrinkage Compensation | `plastic-shrinkage-compensation` | injection mold shrinkage calculator | Scale up CAD dimensions to account for plastic cooling shrinkage |
| 5 | Infill Density vs Strength Table | `infill-strength-table` | fdm infill density strength | Interactive table: select infill % and pattern → estimated tensile strength |
| 6 | Support Volume Estimator | `support-volume-estimator` | 3d print support material usage | Estimate support material volume for overhanging geometries |
| 7 | Layer Height vs Print Time Tradeoff | `layer-height-time-tradeoff` | layer height print quality | Compare resolution vs print speed at different layer heights |
| 8 | Extruder Flow Rate Calculator | `extruder-flow-rate` | extruder flow rate calculator | Calculate volumetric flow rate from nozzle diameter, print speed, layer height |
| 9 | First Layer Squish Calculator | `first-layer-squish` | first layer calibration fdm | Find optimal z-offset for first layer adhesion |
| 10 | Resin Exposure Time Guide | `resin-exposure-time` | msla resin exposure settings | Interactive resin + layer thickness → recommended exposure time ranges |

---

### Category 3: CNC Machining & Toolpaths (`cnc`)

| # | Calculator Name | Slug | Primary Keyword | Description |
|---|----------------|------|----------------|-------------|
| 1 | CNC Feed Rate & Cutting Speed Calculator | `cnc-feed-rate-speed` | cnc feed rate calculator | Select material, tool diameter, spindle RPM → optimum feed rate |
| 2 | Chip Load Calculator | `chip-load-calculator` | chip load calculator cnc | Calculate chip load per tooth from feed rate, RPM, flute count |
| 3 | Tap Drill Size Calculator | `tap-drill-size` | tap drill size calculator | Select thread size and standard (metric/UNC/UNF) → correct drill bit diameter |
| 4 | Thread Pitch Converter (Metric ↔ Imperial) | `thread-pitch-converter` | thread pitch converter | Convert between TPI, pitch in mm, metric thread designations |
| 5 | Spindle RPM from Surface Speed | `spindle-rpm-surface-speed` | cnc rpm surface speed calculator | Calculate spindle speed from recommended SFM/m/min and tool diameter |
| 6 | Drilling Cycle Time Calculator | `drilling-cycle-time` | cnc drilling time calculator | Estimate drilling time from hole depth, feed rate, number of holes |
| 7 | Surface Finish Ra Estimator | `surface-finish-ra-estimator` | surface roughness calculator | Estimate theoretical surface roughness from feed rate and nose radius |
| 8 | Chamfer & Countersink Depth Finder | `chamfer-countersink-depth` | countersink depth calculator | Find required tool plunge depth for a target chamfer size |
| 9 | Material Removal Rate (MRR) Calculator | `material-removal-rate` | material removal rate calculator | Calculate MRR from depth of cut, width of cut, and feed rate |
| 10 | G54–G59 Work Offset Planner | `work-offset-planner` | cnc work offset setup | Interactive table for planning multiple workpiece coordinate systems |

---

### Category 4: Structural & Civil Engineering (`structural`)

| # | Calculator Name | Slug | Primary Keyword | Description |
|---|----------------|------|----------------|-------------|
| 1 | Beam Deflection Calculator | `beam-deflection-calculator` | beam deflection calculator | Simply supported / cantilever beams — enter load, span, section → max deflection |
| 2 | Moment of Inertia Calculator | `moment-of-inertia-calculator` | moment of inertia calculator | Calculate I for standard cross-sections (I-beam, rectangle, circle, hollow) |
| 3 | Column Buckling (Euler) Load Calculator | `euler-column-buckling` | column buckling load calculator | Calculate critical buckling load for slender columns |
| 4 | Bolt Torque & Preload Calculator | `bolt-torque-preload` | bolt torque calculator | Enter bolt grade, diameter, friction coefficient → clamp force and tightening torque |
| 5 | Weld Stress & Throat Thickness | `weld-stress-throat` | weld throat size calculator | Determine minimum throat size for a fillet weld under shear load |
| 6 | Section Modulus Calculator | `section-modulus-calculator` | section modulus calculator | Calculate S for standard sections to check bending stress |
| 7 | Stress Concentration Factor (Kt) Lookup | `stress-concentration-kt` | stress concentration factor calculator | Interactive chart-based Kt estimator for holes, notches, fillets |
| 8 | Natural Frequency Estimator | `natural-frequency-estimator` | natural frequency calculator beam | Estimate first natural frequency of a beam or plate |
| 9 | Pipe Wall Thickness (ASME B31.3) | `pipe-wall-thickness-asme` | pipe wall thickness calculator asme | Calculate minimum wall thickness for pressure piping systems |
| 10 | Truss Force Analyzer (Method of Joints) | `truss-force-analyzer` | truss calculator online | Interactive 2D truss — add members and loads, see member forces |

---

### Category 5: Unit & Geometry Converters (`converters`)

| # | Calculator Name | Slug | Primary Keyword | Description |
|---|----------------|------|----------------|-------------|
| 1 | Engineering Unit Converter (mm ↔ inch ↔ thou) | `unit-converter-mm-inch` | mm to inches cad converter | Real-time bidirectional unit converter for all common engineering units |
| 2 | Angle Converter (Degrees ↔ Radians ↔ DMS) | `angle-converter-dms` | degrees to radians converter | Convert between decimal degrees, radians, and DMS (degrees/minutes/seconds) |
| 3 | Area & Volume Calculator (3D Primitives) | `area-volume-primitives` | area volume cad calculator | Calculate surface area and volume for sphere, cylinder, cone, box |
| 4 | DPI / PPI Print Resolution Calculator | `dpi-resolution-print-size` | dpi to print size calculator | Enter pixel dimensions and DPI → physical print size; or enter size → required PPI |
| 5 | Scale Factor Converter (Drawing Scales) | `scale-factor-converter` | drawing scale calculator | Convert between drawing scale (1:50, 1:100) and actual/paper dimensions |
| 6 | Temperature Converter (°C ↔ °F ↔ K) | `temperature-converter-engineering` | celsius fahrenheit kelvin converter | Engineering temperature converter with material reference table |
| 7 | Force & Pressure Unit Converter | `force-pressure-converter` | psi to mpa converter | Convert between N, kN, kgf, lbf and Pa, kPa, MPa, psi, bar |
| 8 | Mass & Density Material Weight Calculator | `mass-density-weight-calculator` | material weight calculator | Enter volume + select material → weight in kg/lb |
| 9 | Torque Unit Converter | `torque-unit-converter` | nm to ft lb torque converter | Convert between Nm, kNm, ft·lb, in·lb, kgf·m |
| 10 | CAD Drawing Scale Rule Calculator | `drawing-scale-rule` | scale rule calculator | Enter real-world dimension → get equivalent drawing measurement at any scale |

---

### Category 6: Electrical & PCB CAD (`electrical_pcb`)

| # | Calculator Name | Slug | Primary Keyword | Description |
|---|----------------|------|----------------|-------------|
| 1 | PCB Trace Width Calculator (IPC-2221) | `pcb-trace-width-ipc2221` | pcb trace width calculator | Enter current, copper weight, temperature rise → minimum trace width |
| 2 | PCB Via Current Capacity Calculator | `pcb-via-current-capacity` | pcb via current calculator | Calculate current capacity for a given via diameter and plating |
| 3 | Resistor Voltage Divider Calculator | `resistor-voltage-divider` | voltage divider calculator | Enter Vin, R1, R2 → Vout; or enter Vin, Vout, R1 → R2 |
| 4 | LED Series Resistor Calculator | `led-series-resistor` | led resistor value calculator | Enter supply voltage, LED forward voltage, desired current → resistor value |
| 5 | Capacitor Charge Time Calculator (RC) | `capacitor-rc-charge-time` | rc circuit time constant calculator | Calculate RC time constant and charge/discharge curves |
| 6 | Ohm's Law Calculator | `ohms-law-calculator` | ohms law calculator | Enter any two of V, I, R → solve for the third; includes power |
| 7 | Wire Gauge (AWG ↔ mm²) Converter | `wire-gauge-awg-mm2` | awg to mm2 wire calculator | Convert between AWG and metric wire cross-section, with current capacity reference |
| 8 | PCB Impedance Calculator (Microstrip) | `pcb-impedance-microstrip` | pcb trace impedance calculator | Calculate characteristic impedance for microstrip and stripline traces |
| 9 | Battery Runtime Calculator | `battery-runtime-calculator` | battery life calculator electronics | Enter battery capacity (mAh) and load current → estimated runtime |
| 10 | Power Dissipation & Heat Sink Calculator | `heatsink-thermal-resistance` | heatsink size calculator | Calculate required heatsink thermal resistance for a given power dissipation |

---

### Category 7: CAD License & Cost (`licensing_cost`)

| # | Calculator Name | Slug | Primary Keyword | Description |
|---|----------------|------|----------------|-------------|
| 1 | CAD License TCO Calculator (3-Year) | `cad-license-tco-3year` | autocad license cost calculator | Enter seat count, subscription price, perpetual price → 3-year TCO comparison table |
| 2 | SaaS vs Perpetual Break-Even Calculator | `saas-vs-perpetual-breakeven` | software subscription vs buy calculator | Find the year when buying outright becomes cheaper than renting |
| 3 | FLEXlm Concurrent Seat Optimizer | `flexlm-seat-optimizer` | concurrent license seat calculator | Enter user count and usage hours → recommended seat count for target utilization |
| 4 | Named User Token Reclaim Savings | `named-user-reclaim-savings` | license idle seat calculator | Calculate potential annual savings from reclaiming idle named-user licenses |
| 5 | Team License Bundle Cost Comparison | `team-license-bundle-comparison` | cad team license price comparison | Compare pricing across AutoCAD, BricsCAD, ZWCAD for N seats |
| 6 | GPU Workstation ROI Calculator | `gpu-workstation-roi` | workstation payback calculator | Compare performance gains vs hardware cost — find the payback period |
| 7 | CAD Training Cost Per Hour Calculator | `training-cost-per-hour` | cad training cost calculator | Calculate blended cost of onboarding staff to a new CAD platform |
| 8 | Subscription Inflation Projector | `subscription-inflation-projector` | software price increase projection | Project total 5/10-year spend assuming X% annual price increase |
| 9 | CAD Hardware Depreciation Calculator | `cad-hardware-depreciation` | workstation depreciation calculator | Straight-line and MACRS depreciation schedules for workstation assets |
| 10 | Multi-Region License Cost Normalizer | `multi-region-license-cost` | global software price comparison | Normalize CAD software costs across USD, EUR, GBP, CNY with PPP adjustment |

---

### Category 8: Geometry & Tolerance (`geometry_tolerance`)

| # | Calculator Name | Slug | Primary Keyword | Description |
|---|----------------|------|----------------|-------------|
| 1 | GD&T Tolerance Stack-Up Analyzer | `gdt-tolerance-stackup` | tolerance stack up calculator | Enter individual tolerances in a chain → calculate worst-case and RSS stack-up |
| 2 | Fits & Tolerances (ISO 286) Calculator | `iso-fits-tolerances` | iso hole shaft fit calculator | Select hole/shaft system, nominal size, tolerance grade (H7/g6) → get limits |
| 3 | Surface Area of Revolution Calculator | `surface-area-revolution` | surface area revolution calculator | Calculate surface area generated by revolving a curve around an axis |
| 4 | Gear Tooth & Module Calculator | `gear-tooth-module-calculator` | gear module calculator | Enter gear module and tooth count → pitch diameter, addendum, dedendum |
| 5 | Circle / Arc Chord & Segment Calculator | `circle-chord-segment` | chord length arc segment calculator | Enter radius and arc angle → chord length, sagitta, arc length |
| 6 | True Position Calculator (GD&T) | `true-position-gdt` | true position calculator gdt | Enter measured XY deviation → calculate true position diameter for GD&T callout |
| 7 | Slope & Taper Angle Calculator | `slope-taper-angle` | taper angle calculator | Enter rise and run → angle in degrees; or enter angle → ratio |
| 8 | Involute Gear Profile Generator | `involute-gear-profile` | involute gear calculator | Generate involute gear tooth geometry data for a given module and tooth count |
| 9 | Polygon Inscribed / Circumscribed Calculator | `polygon-inscribed-circumscribed` | polygon inscribed circle calculator | Enter number of sides and side length → inscribed radius, circumscribed radius |
| 10 | Thread Minor / Pitch / Major Diameter | `thread-diameter-calculator` | thread root diameter calculator | Enter thread designation (M10×1.5) → major, pitch, minor diameter values |

---

## Implementation Notes

### Tech Stack
- Each calculator is a **client-side React component** with `"use client"` directive
- All calculations happen **in-browser with zero API calls** — instant results, works offline
- Results are **URL-shareable** via query params (`/calculators/k-factor?thickness=2&radius=4&angle=90`)
- Each page has **full JSON-LD Schema** (`SoftwareApplication` type) for rich snippets

### SEO Structure
- `/calculators` hub page: grid of all tools by category with search
- Each `/calculators/[slug]` page: H1 + interactive tool + formula explanation + related internal links
- Sitemap includes all calculator slugs with `priority: 0.85` and `changeFrequency: 'monthly'`

### Internal Link Strategy
- Sheet metal calculators → link to SolidWorks, Inventor, Fusion 360 tool pages
- CNC calculators → link to Mastercam, Fusion 360, HSMWorks pages
- PCB calculators → link to KiCad, Altium Designer, Eagle pages
- License cost calculators → link to comparison pages (`/compare/autocad-vs-bricscad`)
- All calculators → link to relevant `/guides/[slug]` articles

### Priority Build Order
1. K-Factor Calculator (highest search volume: ~12k/month)
2. CNC Feed Rate Calculator (~18k/month)
3. PCB Trace Width Calculator (~9k/month)
4. Bolt Torque Calculator (~8k/month)
5. CAD License TCO Calculator (unique to this site, strong brand differentiation)
