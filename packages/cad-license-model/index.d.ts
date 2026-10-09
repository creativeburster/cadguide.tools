export interface LicenseModelOptions {
  totalEngineers: number;
  peakConcurrentRatio?: number;
  annualSubPerSeat?: number;
  floatingSeatPremium?: number;
  denialTolerance?: number;
}

export interface LicenseModelResult {
  totalEngineers: number;
  recommendedFloatingSeats: number;
  namedCost: number;
  floatingCost: number;
  annualSavings: number;
  breakEvenUtilization: number;
}

export function erlangB(trafficErlangs: number, servers: number): number;
export function solveFloatingSeats(totalEngineers: number, concurrencyRatio: number, maxDenialRate?: number): number;
export function calculateLicenseTCO(options: LicenseModelOptions): LicenseModelResult;
