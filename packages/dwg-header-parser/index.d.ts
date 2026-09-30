export interface DwgVersionInfo {
  version: string;
  releaseYear: number;
  code: string;
  compatible: string;
}

export interface DwgParseResult {
  valid: boolean;
  code?: string;
  version?: string;
  releaseYear?: number;
  compatible?: string;
  error?: string;
}

export declare const DWG_VERSION_MAP: Record<string, DwgVersionInfo>;

export declare function parseDwgHeader(buffer: Buffer | Uint8Array | ArrayBuffer): DwgParseResult;
