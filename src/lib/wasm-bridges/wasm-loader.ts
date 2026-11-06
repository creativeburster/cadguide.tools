/**
 * TypeScript <-> Rust WebAssembly Loader & Memory Manager
 * Loads `/wasm/parametric_cad_bg.wasm`, `/wasm/nesting_cam_bg.wasm`, and `/wasm/code_cad_bg.wasm`
 * with synchronous pre-instantiation so first-frame calculations execute inside the native
 * WebAssembly VM without async flicker or SSR hydration mismatch.
 */

export interface ParametricWasmExports {
  memory: WebAssembly.Memory;
  wasm_kernel_version: () => number;
  solve_2d_distance: (x1: number, y1: number, x2: number, y2: number) => number;
  compute_triangle_volume: (
    ax: number, ay: number, az: number,
    bx: number, by: number, bz: number,
    cx: number, cy: number, cz: number
  ) => number;
  compute_triangle_area: (
    ax: number, ay: number, az: number,
    bx: number, by: number, bz: number,
    cx: number, cy: number, cz: number
  ) => number;
}

export interface NestingWasmExports {
  memory: WebAssembly.Memory;
  wasm_kernel_version: () => number;
  sheet_metal_bend_allowance: (thickness: number, radius: number, angleDeg: number, kFactor: number) => number;
  sheet_metal_outside_setback_90: (thickness: number, radius: number) => number;
  compute_utilization_pct: (usedArea: number, sheetWidth: number, sheetHeight: number) => number;
}

export interface CodeCadWasmExports {
  memory: WebAssembly.Memory;
  wasm_kernel_version: () => number;
  eval_gear_pitch_diameter: (moduleMm: number, teeth: number) => number;
  eval_cylinder_volume: (radius: number, height: number) => number;
  eval_box_volume: (w: number, d: number, h: number) => number;
}

const PARAMETRIC_WASM_B64 =
  'AGFzbQEAAAABJwRgAAF/YAR8fHx8AXxgCXx8fHx8fHx8fAF8YAl8fHx8fHx8fHwBfAMFBAABAgMFAwEAAgdmBQZtZW1vcnkCABN3YXNtX2tlcm5lbF92ZXJzaW9uAAARc29sdmVfMmRfZGlzdGFuY2UAARdjb21wdXRlX3RyaWFuZ2xlX3ZvbHVtZQACFWNvbXB1dGVfdHJpYW5nbGVfYXJlYQADCvkBBAUAQeUACxoAIAIgAKEgAiAAoaIgAyABoSADIAGhoqCfCzgAIAAgBCAIoiAFIAeioaIgASAFIAaiIAMgCKKhoqAgAiADIAeiIAQgBqKhoqBEAAAAAAAAGECjC5wBACAEIAGhIAggAqGiIAUgAqEgByABoaKhIAQgAaEgCCACoaIgBSACoSAHIAGhoqGiIAUgAqEgBiAAoaIgAyAAoSAIIAKhoqEgBSACoSAGIAChoiADIAChIAggAqGioaKgIAMgAKEgByABoaIgBCABoSAGIAChoqEgAyAAoSAHIAGhoiAEIAGhIAYgAKGioaKgn0QAAAAAAADgP6IL';

const NESTING_WASM_B64 =
  'AGFzbQEAAAABGgRgAAF/YAR8fHx8AXxgAnx8AXxgA3x8fAF8AwUEAAECAwUDAQACB3gFBm1lbW9yeQIAE3dhc21fa2VybmVsX3ZlcnNpb24AABpzaGVldF9tZXRhbF9iZW5kX2FsbG93YW5jZQABHnNoZWV0X21ldGFsX291dHNpZGVfc2V0YmFja185MAACF2NvbXB1dGVfdXRpbGl6YXRpb25fcGN0AAMKPAQFAEHJAQsXAEQ5nVKiRt+RPyACoiABIAMgAKKgogsHACABIACgCxQAIAAgASACoqNEAAAAAAAAWUCiCw==';

const CODE_CAD_WASM_B64 =
  'AGFzbQEAAAABGARgAAF/YAJ8fAF8YAJ8fAF8YAN8fHwBfAMFBAABAgMFAwEAAgdkBQZtZW1vcnkCABN3YXNtX2tlcm5lbF92ZXJzaW9uAAAYZXZhbF9nZWFyX3BpdGNoX2RpYW1ldGVyAAEUZXZhbF9jeWxpbmRlcl92b2x1bWUAAg9ldmFsX2JveF92b2x1bWUAAwowBAUAQa0CCwcAIAAgAaILFABEGC1EVPshCUAgAKIgAKIgAaILCwAgACABoiACopkL';

function decodeBase64ToBytes(b64: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(b64, 'base64'));
  }
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    out[i] = bin.charCodeAt(i);
  }
  return out;
}

let cachedParametric: ParametricWasmExports | null = null;
let cachedNesting: NestingWasmExports | null = null;
let cachedCodeCad: CodeCadWasmExports | null = null;

export function getParametricWasmSync(): ParametricWasmExports {
  if (cachedParametric) return cachedParametric;
  const bytes = decodeBase64ToBytes(PARAMETRIC_WASM_B64);
  const mod = new WebAssembly.Module(bytes as BufferSource);
  const inst = new WebAssembly.Instance(mod, {});
  cachedParametric = inst.exports as unknown as ParametricWasmExports;
  return cachedParametric;
}

export function getNestingWasmSync(): NestingWasmExports {
  if (cachedNesting) return cachedNesting;
  const bytes = decodeBase64ToBytes(NESTING_WASM_B64);
  const mod = new WebAssembly.Module(bytes as BufferSource);
  const inst = new WebAssembly.Instance(mod, {});
  cachedNesting = inst.exports as unknown as NestingWasmExports;
  return cachedNesting;
}

export function getCodeCadWasmSync(): CodeCadWasmExports {
  if (cachedCodeCad) return cachedCodeCad;
  const bytes = decodeBase64ToBytes(CODE_CAD_WASM_B64);
  const mod = new WebAssembly.Module(bytes as BufferSource);
  const inst = new WebAssembly.Instance(mod, {});
  cachedCodeCad = inst.exports as unknown as CodeCadWasmExports;
  return cachedCodeCad;
}

export async function loadWasmFromPublicUrl<T>(url: string, fallbackSync: () => T): Promise<T> {
  try {
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      const res = await fetch(url);
      if (res.ok) {
        const buf = await res.arrayBuffer();
        if (WebAssembly.validate(buf)) {
          const { instance } = await WebAssembly.instantiate(buf, {});
          return instance.exports as unknown as T;
        }
      }
    }
  } catch {
    // Fallback to synchronously compiled binary
  }
  return fallbackSync();
}
