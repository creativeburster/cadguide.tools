# CADGuide Engineering Specifications & Technical Documentation

Welcome to the official technical documentation and engineering specifications maintained by the [CADGuide.tools](https://cadguide.tools) engineering team.

This knowledge repository documents core mathematical foundations, binary file specifications, and concurrency models used across computer-aided design (CAD), computer-aided manufacturing (CAM), and building information modeling (BIM) toolchains.

---

## 🛠️ Core Engineering Modules

1. **[DWG Version Magic Bytes Matrix](specs/dwg-version-matrix.md)**  
   Deterministic binary header signatures for AutoCAD DWG files from R1.1 to 2026, enabling zero-trust client-side file inspection without native desktop runtimes.  
   *Interactive Tool:* [DWG Version Checker](https://cadguide.tools/toolbox/dwg-version-checker)

2. **[Sheet Metal K-Factor & Bend Deduction Formulations](specs/k-factor-equations.md)**  
   Mathematical derivations of neutral axis shift (\(K\)), bend allowance (\(BA\)), bend deduction (\(BD\)), and setback (\(SB\)) across ANSI and DIN 6935 manufacturing standards.  
   *Interactive Tool:* [Sheet Metal K-Factor Calculator](https://cadguide.tools/toolbox/k-factor-calculator)

3. **[Concurrent Licensing Poisson Probability Models](specs/network-license-poisson.md)**  
   Stochastic resource modeling and Erlang-B/Poisson probability approximations for enterprise FLEXlm / Reprise (RLM) floating CAD license pools.  
   *Interactive Tool:* [Concurrent License Optimizer](https://cadguide.tools/toolbox/concurrent-license-calculator)

---

## 🎯 Architecture Principles

- **Zero-Server Processing**: All binary inspection algorithms execute client-side via JavaScript TypedArray (`ArrayBuffer`, `DataView`) without transferring proprietary CAD geometries over the network.
- **Deterministic Math**: Pure analytical calculations adhering to DIN 6935, ISO 10303 (STEP), and ANSI standards.
- **Open Knowledge**: Public specifications provided to assist hardware makers, CAM programmers, and enterprise CAD administrators.

For full interactive calculators, comprehensive CAD troubleshooting guides, and software comparisons, visit the main portal at **[https://cadguide.tools](https://cadguide.tools)**.
