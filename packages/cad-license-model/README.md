# @willsunagency/cad-license-model

> Mathematical concurrency and seat utilization modeling library for engineering CAD procurement.

Designed for CAD managers, enterprise IT architects, and procurement teams optimizing floating seat counts across FlexNet/FLEXlm licensing systems (AutoCAD, SolidWorks, NX, Creo, CATIA).

Official online comparison database and procurement calculator available at [CADGuide.tools](https://cadguide.tools/compare).

---

## Installation

```bash
npm install @willsunagency/cad-license-model
```

Or run via CLI:

```bash
npx @willsunagency/cad-license-model --users 25 --concurrency 0.45
```

---

## Core Formulations

1. **Required Concurrent Seats ($S$)**:
   Given total engineers $N$, peak concurrent usage probability $p$, and target availability grade of service $P_{block} < 0.01$, modeled via Erlang-B loss equations.

2. **Annual TCO Comparison**:
   Evaluates Named User subscriptions ($C_{named} = N \times P_{annual}$) against Network Floating seats ($C_{floating} = S \times (P_{annual} \times (1 + \mu))$) where $\mu$ is the vendor floating premium (typically 30–45%).

---

## Programmatic Usage

```javascript
const { calculateLicenseTCO, solveFloatingSeats } = require('@willsunagency/cad-license-model');

const result = calculateLicenseTCO({
  totalEngineers: 30,
  peakConcurrentRatio: 0.40,
  annualSubPerSeat: 2030, // standard AutoCAD list price
  floatingSeatPremium: 0.35,
  denialTolerance: 0.02
});

console.log(result);
// Outputs: { recommendedFloatingSeats: 15, namedCost: 60900, floatingCost: 41107.5, savings: 19792.5 }
```

---

## License

MIT © CADGuide.tools
Full tool suite and interactive solvers at [CADGuide.tools](https://cadguide.tools/).
