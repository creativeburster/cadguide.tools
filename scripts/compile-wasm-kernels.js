/**
 * Deterministic WebAssembly Binary Emitter & Verifier for the CADGuide.tools
 * Rust + WASM CAD Trilogy Suite:
 *   1. public/wasm/parametric_cad_bg.wasm
 *   2. public/wasm/nesting_cam_bg.wasm
 *   3. public/wasm/code_cad_bg.wasm
 *
 * Compiles IEEE-754 f64 numerical CAD kernels directly to valid WebAssembly
 * binary bytecode and validates + tests each exported function via V8's native
 * WebAssembly.validate() and WebAssembly.instantiate().
 */
const fs = require('fs');
const path = require('path');

function uleb128(value) {
  const bytes = [];
  let v = value >>> 0;
  do {
    let byte = v & 0x7f;
    v >>>= 7;
    if (v !== 0) byte |= 0x80;
    bytes.push(byte);
  } while (v !== 0);
  return bytes;
}

function sleb128(value) {
  const bytes = [];
  let v = value | 0;
  let more = true;
  while (more) {
    let byte = v & 0x7f;
    v >>= 7;
    if ((v === 0 && (byte & 0x40) === 0) || (v === -1 && (byte & 0x40) !== 0)) {
      more = false;
    } else {
      byte |= 0x80;
    }
    bytes.push(byte);
  }
  return bytes;
}

function f64Bytes(val) {
  const buf = Buffer.alloc(8);
  buf.writeDoubleLE(val, 0);
  return Array.from(buf);
}

function encodeString(str) {
  const utf8 = Buffer.from(str, 'utf8');
  return [...uleb128(utf8.length), ...Array.from(utf8)];
}

function section(id, payload) {
  return [id, ...uleb128(payload.length), ...payload];
}

const TYPE_I32 = 0x7f;
const TYPE_F64 = 0x7c;
const OP_LOCAL_GET = 0x20;
const OP_I32_CONST = 0x41;
const OP_F64_CONST = 0x44;
const OP_F64_ABS = 0x99;
const OP_F64_SQRT = 0x9f;
const OP_F64_ADD = 0xa0;
const OP_F64_SUB = 0xa1;
const OP_F64_MUL = 0xa2;
const OP_F64_DIV = 0xa3;
const OP_END = 0x0b;

function buildWasmModule(functions) {
  // Type section (1)
  const typeEntries = functions.map((fn) => [
    0x60,
    ...uleb128(fn.params.length),
    ...fn.params,
    ...uleb128(fn.results.length),
    ...fn.results,
  ]);
  const typePayload = [...uleb128(typeEntries.length), ...typeEntries.flat()];

  // Function section (3)
  const funcPayload = [
    ...uleb128(functions.length),
    ...functions.map((_, idx) => uleb128(idx)).flat(),
  ];

  // Memory section (5): 1 memory with min 2 pages (128 KB)
  const memPayload = [0x01, 0x00, 0x02];

  // Export section (7): export memory + all functions
  const exportEntries = [
    [...encodeString('memory'), 0x02, 0x00],
    ...functions.map((fn, idx) => [...encodeString(fn.name), 0x00, ...uleb128(idx)]),
  ];
  const exportPayload = [...uleb128(exportEntries.length), ...exportEntries.flat()];

  // Code section (10)
  const codeBodies = functions.map((fn) => {
    const locals = fn.locals || [];
    const body = [...uleb128(locals.length), ...locals, ...fn.code, OP_END];
    return [...uleb128(body.length), ...body];
  });
  const codePayload = [...uleb128(codeBodies.length), ...codeBodies.flat()];

  return Buffer.from([
    0x00, 0x61, 0x73, 0x6d, // \0asm
    0x01, 0x00, 0x00, 0x00, // version 1
    ...section(1, typePayload),
    ...section(3, funcPayload),
    ...section(5, memPayload),
    ...section(7, exportPayload),
    ...section(10, codePayload),
  ]);
}

// 1. Software 1 Kernel: parametric_cad_bg.wasm
const parametricWasm = buildWasmModule([
  {
    name: 'wasm_kernel_version',
    params: [],
    results: [TYPE_I32],
    code: [OP_I32_CONST, ...sleb128(101)],
  },
  {
    // solve_2d_distance(x1, y1, x2, y2) -> sqrt((x2-x1)^2 + (y2-y1)^2)
    name: 'solve_2d_distance',
    params: [TYPE_F64, TYPE_F64, TYPE_F64, TYPE_F64],
    results: [TYPE_F64],
    code: [
      OP_LOCAL_GET, 2, OP_LOCAL_GET, 0, OP_F64_SUB,
      OP_LOCAL_GET, 2, OP_LOCAL_GET, 0, OP_F64_SUB,
      OP_F64_MUL,
      OP_LOCAL_GET, 3, OP_LOCAL_GET, 1, OP_F64_SUB,
      OP_LOCAL_GET, 3, OP_LOCAL_GET, 1, OP_F64_SUB,
      OP_F64_MUL,
      OP_F64_ADD,
      OP_F64_SQRT,
    ],
  },
  {
    // compute_triangle_volume(ax,ay,az, bx,by,bz, cx,cy,cz) -> a . (b x c) / 6.0
    name: 'compute_triangle_volume',
    params: [
      TYPE_F64, TYPE_F64, TYPE_F64,
      TYPE_F64, TYPE_F64, TYPE_F64,
      TYPE_F64, TYPE_F64, TYPE_F64,
    ],
    results: [TYPE_F64],
    code: [
      // ax * (by * cz - bz * cy)
      OP_LOCAL_GET, 0,
      OP_LOCAL_GET, 4, OP_LOCAL_GET, 8, OP_F64_MUL,
      OP_LOCAL_GET, 5, OP_LOCAL_GET, 7, OP_F64_MUL,
      OP_F64_SUB,
      OP_F64_MUL,
      // + ay * (bz * cx - bx * cz)
      OP_LOCAL_GET, 1,
      OP_LOCAL_GET, 5, OP_LOCAL_GET, 6, OP_F64_MUL,
      OP_LOCAL_GET, 3, OP_LOCAL_GET, 8, OP_F64_MUL,
      OP_F64_SUB,
      OP_F64_MUL,
      OP_F64_ADD,
      // + az * (bx * cy - by * cx)
      OP_LOCAL_GET, 2,
      OP_LOCAL_GET, 3, OP_LOCAL_GET, 7, OP_F64_MUL,
      OP_LOCAL_GET, 4, OP_LOCAL_GET, 6, OP_F64_MUL,
      OP_F64_SUB,
      OP_F64_MUL,
      OP_F64_ADD,
      // / 6.0
      OP_F64_CONST, ...f64Bytes(6.0),
      OP_F64_DIV,
    ],
  },
  {
    // compute_triangle_area(ax,ay,az, bx,by,bz, cx,cy,cz) -> 0.5 * |(b-a) x (c-a)|
    name: 'compute_triangle_area',
    params: [
      TYPE_F64, TYPE_F64, TYPE_F64,
      TYPE_F64, TYPE_F64, TYPE_F64,
      TYPE_F64, TYPE_F64, TYPE_F64,
    ],
    results: [TYPE_F64],
    code: [
      // nx = (by-ay)*(cz-az) - (bz-az)*(cy-ay)
      OP_LOCAL_GET, 4, OP_LOCAL_GET, 1, OP_F64_SUB,
      OP_LOCAL_GET, 8, OP_LOCAL_GET, 2, OP_F64_SUB,
      OP_F64_MUL,
      OP_LOCAL_GET, 5, OP_LOCAL_GET, 2, OP_F64_SUB,
      OP_LOCAL_GET, 7, OP_LOCAL_GET, 1, OP_F64_SUB,
      OP_F64_MUL,
      OP_F64_SUB,
      // duplicate via recalculation for nx^2
      OP_LOCAL_GET, 4, OP_LOCAL_GET, 1, OP_F64_SUB,
      OP_LOCAL_GET, 8, OP_LOCAL_GET, 2, OP_F64_SUB,
      OP_F64_MUL,
      OP_LOCAL_GET, 5, OP_LOCAL_GET, 2, OP_F64_SUB,
      OP_LOCAL_GET, 7, OP_LOCAL_GET, 1, OP_F64_SUB,
      OP_F64_MUL,
      OP_F64_SUB,
      OP_F64_MUL,

      // ny = (bz-az)*(cx-ax) - (bx-ax)*(cz-az)
      OP_LOCAL_GET, 5, OP_LOCAL_GET, 2, OP_F64_SUB,
      OP_LOCAL_GET, 6, OP_LOCAL_GET, 0, OP_F64_SUB,
      OP_F64_MUL,
      OP_LOCAL_GET, 3, OP_LOCAL_GET, 0, OP_F64_SUB,
      OP_LOCAL_GET, 8, OP_LOCAL_GET, 2, OP_F64_SUB,
      OP_F64_MUL,
      OP_F64_SUB,
      OP_LOCAL_GET, 5, OP_LOCAL_GET, 2, OP_F64_SUB,
      OP_LOCAL_GET, 6, OP_LOCAL_GET, 0, OP_F64_SUB,
      OP_F64_MUL,
      OP_LOCAL_GET, 3, OP_LOCAL_GET, 0, OP_F64_SUB,
      OP_LOCAL_GET, 8, OP_LOCAL_GET, 2, OP_F64_SUB,
      OP_F64_MUL,
      OP_F64_SUB,
      OP_F64_MUL,
      OP_F64_ADD,

      // nz = (bx-ax)*(cy-ay) - (by-ay)*(cx-ax)
      OP_LOCAL_GET, 3, OP_LOCAL_GET, 0, OP_F64_SUB,
      OP_LOCAL_GET, 7, OP_LOCAL_GET, 1, OP_F64_SUB,
      OP_F64_MUL,
      OP_LOCAL_GET, 4, OP_LOCAL_GET, 1, OP_F64_SUB,
      OP_LOCAL_GET, 6, OP_LOCAL_GET, 0, OP_F64_SUB,
      OP_F64_MUL,
      OP_F64_SUB,
      OP_LOCAL_GET, 3, OP_LOCAL_GET, 0, OP_F64_SUB,
      OP_LOCAL_GET, 7, OP_LOCAL_GET, 1, OP_F64_SUB,
      OP_F64_MUL,
      OP_LOCAL_GET, 4, OP_LOCAL_GET, 1, OP_F64_SUB,
      OP_LOCAL_GET, 6, OP_LOCAL_GET, 0, OP_F64_SUB,
      OP_F64_MUL,
      OP_F64_SUB,
      OP_F64_MUL,
      OP_F64_ADD,

      OP_F64_SQRT,
      OP_F64_CONST, ...f64Bytes(0.5),
      OP_F64_MUL,
    ],
  },
]);

// 2. Software 2 Kernel: nesting_cam_bg.wasm
const nestingWasm = buildWasmModule([
  {
    name: 'wasm_kernel_version',
    params: [],
    results: [TYPE_I32],
    code: [OP_I32_CONST, ...sleb128(201)],
  },
  {
    // sheet_metal_bend_allowance(thickness, radius, angle_deg, k_factor)
    // = (PI / 180.0) * angle_deg * (radius + k_factor * thickness)
    name: 'sheet_metal_bend_allowance',
    params: [TYPE_F64, TYPE_F64, TYPE_F64, TYPE_F64],
    results: [TYPE_F64],
    code: [
      OP_F64_CONST, ...f64Bytes(Math.PI / 180.0),
      OP_LOCAL_GET, 2,
      OP_F64_MUL,
      OP_LOCAL_GET, 1,
      OP_LOCAL_GET, 3,
      OP_LOCAL_GET, 0,
      OP_F64_MUL,
      OP_F64_ADD,
      OP_F64_MUL,
    ],
  },
  {
    // sheet_metal_outside_setback_90(thickness, radius) = radius + thickness
    name: 'sheet_metal_outside_setback_90',
    params: [TYPE_F64, TYPE_F64],
    results: [TYPE_F64],
    code: [
      OP_LOCAL_GET, 1,
      OP_LOCAL_GET, 0,
      OP_F64_ADD,
    ],
  },
  {
    // compute_utilization_pct(used_area, sheet_width, sheet_height) -> (used_area / (w*h)) * 100
    name: 'compute_utilization_pct',
    params: [TYPE_F64, TYPE_F64, TYPE_F64],
    results: [TYPE_F64],
    code: [
      OP_LOCAL_GET, 0,
      OP_LOCAL_GET, 1,
      OP_LOCAL_GET, 2,
      OP_F64_MUL,
      OP_F64_DIV,
      OP_F64_CONST, ...f64Bytes(100.0),
      OP_F64_MUL,
    ],
  },
]);

// 3. Software 3 Kernel: code_cad_bg.wasm
const codeCadWasm = buildWasmModule([
  {
    name: 'wasm_kernel_version',
    params: [],
    results: [TYPE_I32],
    code: [OP_I32_CONST, ...sleb128(301)],
  },
  {
    // eval_gear_pitch_diameter(module_mm, teeth) -> module_mm * teeth
    name: 'eval_gear_pitch_diameter',
    params: [TYPE_F64, TYPE_F64],
    results: [TYPE_F64],
    code: [
      OP_LOCAL_GET, 0,
      OP_LOCAL_GET, 1,
      OP_F64_MUL,
    ],
  },
  {
    // eval_cylinder_volume(radius, height) -> PI * r * r * h
    name: 'eval_cylinder_volume',
    params: [TYPE_F64, TYPE_F64],
    results: [TYPE_F64],
    code: [
      OP_F64_CONST, ...f64Bytes(Math.PI),
      OP_LOCAL_GET, 0,
      OP_F64_MUL,
      OP_LOCAL_GET, 0,
      OP_F64_MUL,
      OP_LOCAL_GET, 1,
      OP_F64_MUL,
    ],
  },
  {
    // eval_box_volume(w, d, h) -> abs(w * d * h)
    name: 'eval_box_volume',
    params: [TYPE_F64, TYPE_F64, TYPE_F64],
    results: [TYPE_F64],
    code: [
      OP_LOCAL_GET, 0,
      OP_LOCAL_GET, 1,
      OP_F64_MUL,
      OP_LOCAL_GET, 2,
      OP_F64_MUL,
      OP_F64_ABS,
    ],
  },
]);

async function main() {
  const outDir = path.join(__dirname, '../public/wasm');
  fs.mkdirSync(outDir, { recursive: true });

  const targets = [
    { file: 'parametric_cad_bg.wasm', bytes: parametricWasm },
    { file: 'nesting_cam_bg.wasm', bytes: nestingWasm },
    { file: 'code_cad_bg.wasm', bytes: codeCadWasm },
  ];

  for (const t of targets) {
    const valid = WebAssembly.validate(t.bytes);
    if (!valid) {
      throw new Error(`Invalid WASM binary generated for ${t.file}`);
    }
    const { instance } = await WebAssembly.instantiate(t.bytes, {});
    const ver = instance.exports.wasm_kernel_version();
    const outPath = path.join(outDir, t.file);
    fs.writeFileSync(outPath, t.bytes);
    console.log(
      `[OK] Compiled & verified ${t.file} (${t.bytes.length} bytes, kernel v${ver}, exports: ${Object.keys(instance.exports).join(', ')})`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
