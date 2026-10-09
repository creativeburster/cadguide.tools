'use strict';

function erlangB(trafficErlangs, servers) {
  let b = 1.0;
  for (let m = 1; m <= servers; m++) {
    b = (trafficErlangs * b) / (m + trafficErlangs * b);
  }
  return b;
}

function solveFloatingSeats(totalEngineers, concurrencyRatio, maxDenialRate = 0.01) {
  const traffic = totalEngineers * concurrencyRatio;
  let servers = Math.max(1, Math.floor(traffic));
  while (servers < totalEngineers) {
    const blockingProb = erlangB(traffic, servers);
    if (blockingProb <= maxDenialRate) {
      break;
    }
    servers++;
  }
  return servers;
}

function calculateLicenseTCO(options) {
  const {
    totalEngineers = 20,
    peakConcurrentRatio = 0.40,
    annualSubPerSeat = 2030,
    floatingSeatPremium = 0.35,
    denialTolerance = 0.01
  } = options;

  const floatingSeats = solveFloatingSeats(totalEngineers, peakConcurrentRatio, denialTolerance);
  const namedCost = totalEngineers * annualSubPerSeat;
  const floatingCost = floatingSeats * (annualSubPerSeat * (1 + floatingSeatPremium));
  const annualSavings = namedCost - floatingCost;

  return {
    totalEngineers,
    recommendedFloatingSeats: floatingSeats,
    namedCost: Math.round(namedCost * 100) / 100,
    floatingCost: Math.round(floatingCost * 100) / 100,
    annualSavings: Math.round(annualSavings * 100) / 100,
    breakEvenUtilization: Math.round((1 / (1 + floatingSeatPremium)) * 100) / 100
  };
}

module.exports = {
  erlangB,
  solveFloatingSeats,
  calculateLicenseTCO
};
