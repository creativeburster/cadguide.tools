export interface BendCalculationParams {
  thickness: number;
  insideRadius: number;
  angleDegrees: number;
  kFactor: number;
}

export interface BendCalculationResult {
  thickness: number;
  insideRadius: number;
  angleDegrees: number;
  kFactor: number;
  bendAllowance: number;
  outsideSetback: number;
  bendDeduction: number;
  neutralAxisOffset: number;
}

export interface MaterialKFactorInfo {
  name: string;
  kFactor: number;
}

export declare const MATERIAL_K_FACTORS: Record<string, MaterialKFactorInfo>;

export declare function calculateSheetMetalBend(params: BendCalculationParams): BendCalculationResult;
