# @willsunagency/dxf-header-reader

> Ultra-lightweight zero-dependency binary and ASCII DXF header inspector.

Reads AutoCAD Drawing Interchange Format (DXF) and DWG headers without external dependencies. Quickly extracts ACADVER ($ACADVER), DWG code page ($DWGCODEPAGE), maintenance release, and drawing extents in sub-millisecond execution times.

Official online browser inspector with zero cloud uploads available at [CADGuide.tools DWG Version Checker](https://cadguide.tools/toolbox/dwg-version-checker).

---

## Installation

```bash
npm install @willsunagency/dxf-header-reader
```

Or run via CLI:

```bash
npx @willsunagency/dxf-header-reader path/to/drawing.dxf
```

---

## Supported AutoCAD Versions

- **AC1032**: AutoCAD 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026
- **AC1027**: AutoCAD 2013, 2014, 2015, 2016, 2017
- **AC1024**: AutoCAD 2010, 2011, 2012
- **AC1021**: AutoCAD 2007, 2008, 2009
- **AC1018**: AutoCAD 2004, 2005, 2006
- **AC1015**: AutoCAD 2000, 2000i, 2002
- **AC1009**: AutoCAD R11, R12

---

## Programmatic Usage

```javascript
const fs = require('fs');
const { parseDxfHeader } = require('@willsunagency/dxf-header-reader');

const fileBuffer = fs.readFileSync('blueprint.dxf');
const header = parseDxfHeader(fileBuffer);

console.log(header);
// Outputs: { version: 'AC1032', release: 'AutoCAD 2018-2026', codePage: 'ANSI_1252' }
```

---

## License

MIT © CADGuide.tools
Interactive tools and full specification matrices at [CADGuide.tools](https://cadguide.tools/).
