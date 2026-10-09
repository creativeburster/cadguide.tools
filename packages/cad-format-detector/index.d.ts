export interface CADDetectResult {
  detected: boolean;
  format?: 'DWG' | 'DXF' | 'STEP' | 'IGES' | 'IFC' | 'UNKNOWN';
  magic?: string;
  version?: string;
  description?: string;
  variant?: 'ascii' | 'binary';
  isBinary?: boolean;
  error?: string;
  preview?: string;
}

export declare function detectCADFormat(buffer: Uint8Array | ArrayBuffer | Buffer): CADDetectResult;
export declare const DWG_MAP: Record<string, { version: string; name: string }>;
