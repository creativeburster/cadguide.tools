# @willsunagency/dwg-header-parser

> Lightweight, zero-dependency Node.js and browser library to parse AutoCAD DWG binary file headers and detect format release years.
>
> 🌐 **Live Interactive Web App**: [CADGuide.tools DWG Version Checker](https://cadguide.tools/toolbox/dwg-version-checker)

---

## Why This Library?

AutoCAD DWG files are proprietary binary formats. Opening a 200MB drawing just to find out why a junior engineer's CAD program says *"Drawing file is not valid"* wastes valuable engineering hours.

Every AutoCAD drawing stores an ASCII magic string in the first 6 bytes of its binary header (e.g. `AC1032`, `AC1027`, `AC1024`). This library reads only the necessary 6 bytes directly from a Node.js `Buffer`, a browser `File` / `Blob`, or an `ArrayBuffer` without transferring or uploading the entire file.

If you need a free, client-side GUI with drag-and-drop support, visit [CADGuide.tools](https://cadguide.tools/toolbox/dwg-version-checker).

---

## Installation

```bash
npm install @willsunagency/dwg-header-parser
```

Or run globally via CLI:

```bash
npm install -g @willsunagency/dwg-header-parser
dwg-header-parser sample.dwg
```

---

## Usage

### 1. Node.js

```javascript
const fs = require('fs');
const { parseDwgHeader } = require('@willsunagency/dwg-header-parser');

// Read only the first 6 bytes from the file
const fd = fs.openSync('floorplan.dwg', 'r');
const buffer = Buffer.alloc(6);
fs.readSync(fd, buffer, 0, 6, 0);
fs.closeSync(fd);

const info = parseDwgHeader(buffer);
console.log(info);
// Output:
// {
//   valid: true,
//   code: 'AC1032',
//   version: 'AutoCAD 2018 - 2026',
//   releaseYear: 2018,
//   compatible: 'AutoCAD 2018+'
// }
```

### 2. Browser (HTML5 FileReader / ArrayBuffer)

```javascript
import { parseDwgHeader } from '@willsunagency/dwg-header-parser';

async function onFileDrop(file) {
  // Slice only the first 6 bytes
  const slice = file.slice(0, 6);
  const arrayBuffer = await slice.arrayBuffer();
  
  const result = parseDwgHeader(arrayBuffer);
  if (result.valid) {
    alert(`Detected DWG Version: ${result.version} (${result.code})`);
  }
}
```

---

## DWG Header Magic Byte Reference Table

| Header Code | AutoCAD Release Version | Release Year | Backward Compatibility |
| :--- | :--- | :--- | :--- |
| `AC1032` | AutoCAD 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026 | 2018 | AutoCAD 2018+ only |
| `AC1027` | AutoCAD 2013, 2014, 2015, 2016, 2017 | 2013 | AutoCAD 2013-2017 |
| `AC1024` | AutoCAD 2010, 2011, 2012 | 2010 | AutoCAD 2010-2012 |
| `AC1021` | AutoCAD 2007, 2008, 2009 | 2007 | AutoCAD 2007-2009 |
| `AC1018` | AutoCAD 2004, 2005, 2006 | 2004 | AutoCAD 2004-2006 |
| `AC1015` | AutoCAD 2000, 2000i, 2002 | 2000 | AutoCAD 2000-2002 |
| `AC1014` | AutoCAD Release 14 | 1997 | Legacy |
| `AC1012` | AutoCAD Release 13 | 1994 | Legacy |
| `AC1009` | AutoCAD Release 11 / 12 | 1990 | Legacy |

For interactive version conversion guidelines and DWG repair resources, visit the [CADGuide.tools Guides Index](https://cadguide.tools/guides).

---

## License

MIT © [CADGuide.tools](https://cadguide.tools)
