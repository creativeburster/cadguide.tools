# Technical Blueprint: Interactive Calculators & Professional CAD/BIM Micro-Tools Hub

This document defines the architectural blueprint and UX design specifications for the upcoming **Interactive Calculators & Small Tools Hub** (`/tools-hub` or `/calculators`).

---

## 1. Core Architectural Philosophy: 100% Client-Side Execution

All interactive calculators, parsers, and IT administrative utilities will run **100% on the client side** inside the user's browser using HTML5 File APIs, Vanilla JavaScript, and WebAssembly (Wasm).

### Why Zero-Backend/Zero-API?
*   **Absolute Corporate Data Privacy (零数据泄露风险)**: Professional CAD drawings (DXF, DWG), layer tables, and company licenses are highly confidential. By performing 100% of the parsing and calculation client-side, **no data ever leaves the user's computer or uploads to our servers**. This eliminates security concerns for enterprise IT auditors, allowing them to freely use our tools.
*   **Instantaneous Responsiveness (极致零延迟体验)**: Eliminates round-trip HTTP requests to servers, processing files and equations locally at hardware speed with zero loading states.
*   **Zero Server Maintenance & Massive Scalability (零运维与高并发架构)**: Requires zero database, zero server-side CPU load, and zero API gateways. The entire hub is static, making deployment on edge CDNs (like Vercel) virtually free and 100% scalable during sudden traffic spikes.

---

## 2. Interactive Tool Catalog & Technical Blueprints (五大微工具设计蓝图)

### Tool 1: WebAssembly DXF Header & Watermark Integrity Parser (在线 DXF 体检与水印扫描器)
*   **SEO Target Intent**: `online dxf viewer free`, `dxf layer reader`, `dxf educational watermark detector`, `repair dxf file header`.
*   **Technical Implementation**:
    *   HTML5 `FileReader` reads file as ArrayBuffer/text block.
    *   A lightweight JS parser iterates through the ASCII DXF structure, searching specifically for group code `9` (header variables like `$ACADVER`, `$LTSCALE`), group code `2` (Layer Table names), and signature blocks associated with educational version stamps (e.g. `Educational Product` flags, custom registry markers).
*   **Inputs**: Local `.dxf` file (drag & drop).
*   **Outputs**:
    *   CAD Version Code mapping (e.g., `AC1027 ➔ AutoCAD 2013-2017`).
    *   Complete Layer list with names, status, and custom hex color boxes.
    *   Watermark Status Flag: `[SAFE]` or `[WARNING: Educational Watermark Detected - Plotting will trigger border watermarks]`.
*   **Premium UX Mockup**:
    *   A dashed drag-and-drop landing target using smooth micro-animations.
    *   Once loaded, displays a terminal console showing live ASCII stream parsing, followed by a grid of active layers and a color-coded security indicator.

---

### Tool 2: CAD CTB Plot Style to Interactive Pen Weights Table Converter (在线 CTB 打印线宽校准转换器)
*   **SEO Target Intent**: `convert ctb to pdf`, `cad ctb table reader`, `autocad ctb line weights list`, `print ctb file offline`.
*   **Technical Implementation**:
    *   CTB files are binary file structures storing plot parameters for all 255 indexing colors.
    *   The JS parser reads the file bytes, parses the internal index data offsets, and extracts pen thicknesses, screening percentages, linetype parameters, and color override values.
*   **Inputs**: Local `.ctb` print style file.
*   **Outputs**:
    *   An interactive, searchable, and filterable **255-Color Calibration Table**.
    *   Columns: Color ID, Pen Weight (mm), Screening (%), Linetype, Pen Style.
    *   Export Actions: One-click "Export to Clean PDF" and "Download as standard JSON".
*   **Premium UX Mockup**:
    *   High-contrast color matrix showing all 255 color swatches. Clicking any color swatch instantly details its precise plotting specs in a modern sliding side-drawer.

---

### Tool 3: DIN 6935 Sheet Metal Bend Allowance & K-Factor Calculator (数字钣金折弯系数计算器)
*   **SEO Target Intent**: `bend allowance calculator online`, `k-factor sheet metal calculation`, `din 6935 bend calculator`, `solidworks bend allowance parameters`.
*   **Technical Implementation**:
    *   Applies standard DIN 6935 metal bending formulas:
        $$\text{Bend Allowance } (BA) = \frac{\pi}{180} \times A \times (R + K \times T)$$
        $$\text{Bend Deduction } (BD) = 2 \times (R + T) \times \tan(A/2) - BA$$
    *   Where $A = \text{angle}$, $R = \text{inner bend radius}$, $T = \text{material thickness}$, $K = \text{K-Factor}$.
*   **Inputs**: Material type dropdown, Thickness $T$ (mm), Bend Radius $R$ (mm), Angle $A$ (degrees), K-Factor.
*   **Outputs**:
    *   Bend Allowance $BA$ (mm) and Bend Deduction $BD$ (mm) exact values.
    *   Recommended flat pattern blank size modifiers.
*   **Premium UX Mockup**:
    *   An interactive 2D SVG canvas displaying a cross-section of the folded metal sheet.
    *   As the user adjusts sliders for Thickness and Angle, the SVG bend geometry animates in real-time, displaying the neutral fiber shift.

---

### Tool 4: SLA/FDM 3D Printing Chordal Deviation & Facet Density Optimizer (3D 打印弦高偏差切片优化器)
*   **SEO Target Intent**: `stl export tolerance calculator`, `chordal deviation 3d print`, `step file to stl resolution`, `mesh density optimizer`.
*   **Technical Implementation**:
    *   Calculates chordal deviation (sagitta $S$) for circular paths of radius $R$ and facet angular tolerance $\theta$:
        $$S = R \times \left(1 - \cos\left(\frac{\theta}{2}\right)\right)$$
    *   Calculates the number of polygonal segments required to keep printing tolerances watertight.
*   **Inputs**: Circle/Hole Radius (mm), STL Export Angle (degrees), Printer SLA/FDM layer thickness resolution (mm).
*   **Outputs**:
    *   Calculated Chordal Deviation (mm).
    *   Facet Segment Count.
    *   Watertight Status Indicator: Red (facet visible in print), Yellow (acceptable standard), Green (smooth circle / watertight mesh).
*   **Premium UX Mockup**:
    *   A high-definition canvas demonstrating a smooth circle overlaid with a polygonal approximation. Sliders dynamically increase/decrease segments to visualize print-surface facet stepping.

---

### Tool 5: FLEXlm Options File Syntax Builder & Seat Allocator (FLEXlm 授权管理与 Options 语法生成器)
*   **SEO Target Intent**: `flexlm options file builder`, `cad options file generator`, `reserve named user seats flexlm`, `restrict autocad network licenses`.
*   **Technical Implementation**:
    *   A pure JS visual configuration compiler that builds syntax-compliant options files for FLEXlm daemon servers based on standard administrator options parameters (`RESERVE`, `INCLUDE`, `EXCLUDE`, `GROUP`, `HOST_GROUP`, `TIMEOUT`).
*   **Inputs**: Feature Code selector (AutoCAD, Revit, SolidWorks), Admin action choice, User/Host group list, restriction parameters.
*   **Outputs**:
    *   Perfect, syntactically verified copy-pasteable `options.opt` text file code.
    *   Interactive Named User seat pool utilization chart.
*   **Premium UX Mockup**:
    *   A high-end, clean admin workspace. Drag users into standard pools, toggling switches representing Options keywords. Displays the dynamic compile text in a dark-themed monospaced terminal editor with one-click copy.
