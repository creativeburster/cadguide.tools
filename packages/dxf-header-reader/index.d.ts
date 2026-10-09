export interface DxfHeaderResult {
  type: 'DWG' | 'DXF';
  version: string;
  release: string;
  codePage?: string;
  isBinary: boolean;
}

export declare const VERSION_MAP: Record<string, string>;
export function parseDxfHeader(buffer: Buffer | string | Uint8Array): DxfHeaderResult;
