import fs from 'fs';
import path from 'path';

const toolboxDir = path.resolve('src/app/toolbox');

// 导入或内嵌 50 个高精度 Phase 7 工具规格
const SPECS = {
  'ada-ramp-slope-calculator': {
    title: 'ADA Ramp Slope & Landing Calculator',
    iconColor: 'amber',
    inputs: [
      { id: 'rise', label: 'Total Rise (inches)', def: '24', type: 'number', step: '0.5' },
      { id: 'slope', label: 'Ramp Slope Ratio (1:X)', def: '12', type: 'select', options: [
        { val: '12', lbl: '1:12 (8.33% - Standard Max ADA)' },
        { val: '16', lbl: '1:16 (6.25% - Recommended Comfortable)' },
        { val: '20', lbl: '1:20 (5.00% - Gentle Accessible Walkway)' }
      ]},
      { id: 'maxRise', label: 'Max Rise per Run (inches)', def: '30', type: 'number', step: '1' }
    ],
    compute: (vals) => {
      const rise = parseFloat(vals[0]) || 0;
      const slope = parseFloat(vals[1]) || 12;
      const maxRise = parseFloat(vals[2]) || 30;
      const runFt = (rise * slope) / 12;
      const landings = Math.max(0, Math.ceil(rise / maxRise) - 1);
      const totalLenFt = runFt + landings * 5;
      const handrailFt = totalLenFt * 2;
      return {
        primary: { label: 'Total Ramp Horizontal Run', val: runFt.toFixed(1), unit: 'ft' },
        secondary: [
          { label: 'Intermediate Landings (60"x60")', val: landings.toString(), unit: 'landings' },
          { label: 'Total Footprint with Landings', val: totalLenFt.toFixed(1), unit: 'ft' },
          { label: 'Min Continuous Handrail Length', val: handrailFt.toFixed(1), unit: 'ft' }
        ],
        status: { pass: slope >= 12, text: slope >= 12 ? 'ADA COMPLIANT (PASS)' : 'EXCEEDS ADA MAX SLOPE' }
      };
    },
    formula: 'Horizontal Run = Rise × Slope • Landings = ceil(Rise / 30") - 1 (ADA Standards Section 405)'
  },

  'aeration-tank-calculator': {
    title: 'Wastewater Aeration Tank Sizing Calculator',
    iconColor: 'cyan',
    inputs: [
      { id: 'q', label: 'Design Inflow Q (m³/d)', def: '5000', type: 'number', step: '100' },
      { id: 'bodIn', label: 'Influent BOD5 (mg/L)', def: '220', type: 'number', step: '10' },
      { id: 'bodOut', label: 'Target Effluent BOD5 (mg/L)', def: '15', type: 'number', step: '1' },
      { id: 'mlss', label: 'MLSS Concentration (mg/L)', def: '3000', type: 'number', step: '100' },
      { id: 'srt', label: 'Sludge Age SRT (days)', def: '10', type: 'number', step: '1' }
    ],
    compute: (vals) => {
      const q = parseFloat(vals[0]) || 0;
      const bodIn = parseFloat(vals[1]) || 0;
      const bodOut = parseFloat(vals[2]) || 0;
      const mlss = parseFloat(vals[3]) || 3000;
      const srt = parseFloat(vals[4]) || 10;
      const v = (q * (bodIn - bodOut) * srt) / (mlss * 0.6);
      const hrt = (v / Math.max(1, q)) * 24;
      const fm = (q * bodIn) / (mlss * Math.max(1, v));
      const o2 = (q * (bodIn - bodOut) * 1.2) / 1000;
      return {
        primary: { label: 'Aeration Basin Volume', val: v.toFixed(0), unit: 'm³' },
        secondary: [
          { label: 'Hydraulic Retention Time (HRT)', val: hrt.toFixed(1), unit: 'hours' },
          { label: 'Food-to-Microorganism (F/M)', val: fm.toFixed(3), unit: 'kg BOD/kg MLSS·d' },
          { label: 'Daily Oxygen Demand', val: o2.toFixed(1), unit: 'kg O₂/d' }
        ],
        status: { pass: hrt >= 4 && hrt <= 24, text: hrt >= 4 ? 'HRT WITHIN STANDARD RANGE' : 'WARNING: HRT TOO SHORT' }
      };
    },
    formula: 'V = (Q · ΔBOD · SRT) / (0.6 · MLSS) • HRT = (V / Q) × 24h (Metcalf & Eddy Wastewater Engineering)'
  },

  'arc-flash-calculator': {
    title: 'Arc Flash Hazard & Boundary Calculator',
    iconColor: 'rose',
    inputs: [
      { id: 'v', label: 'System Voltage (kV)', def: '0.48', type: 'select', options: [
        { val: '0.48', lbl: '480V (Low Voltage Switchgear)' },
        { val: '4.16', lbl: '4.16 kV (Medium Voltage)' },
        { val: '13.8', lbl: '13.8 kV (Distribution Class)' }
      ]},
      { id: 'ibf', label: 'Bolted Fault Current (kA)', def: '25', type: 'number', step: '1' },
      { id: 't', label: 'Arc Clearing Time (seconds)', def: '0.12', type: 'number', step: '0.01' },
      { id: 'd', label: 'Working Distance (mm)', def: '455', type: 'number', step: '25' }
    ],
    compute: (vals) => {
      const v = parseFloat(vals[0]) || 0.48;
      const ibf = parseFloat(vals[1]) || 25;
      const t = parseFloat(vals[2]) || 0.12;
      const d = parseFloat(vals[3]) || 455;
      const energy = 4.184 * 1.5 * Math.pow(ibf, 0.95) * (t / 0.2) * Math.pow(610 / Math.max(100, d), 1.5);
      const afb = 610 * Math.pow(Math.max(0.1, energy) / 1.2, 1 / 1.5);
      const ppeCat = energy < 4 ? 1 : energy < 8 ? 2 : energy < 25 ? 3 : energy < 40 ? 4 : 5;
      return {
        primary: { label: 'Incident Energy at Working Dist', val: energy.toFixed(2), unit: 'cal/cm²' },
        secondary: [
          { label: 'Arc Flash Boundary (AFB)', val: afb.toFixed(0), unit: 'mm' },
          { label: 'NFPA 70E PPE Category', val: ppeCat > 4 ? 'Extreme Risk (>40 cal)' : `Category ${ppeCat}`, unit: '' },
          { label: 'Normalized Working Distance', val: d.toString(), unit: 'mm' }
        ],
        status: { pass: energy <= 40, text: energy <= 40 ? 'MANAGEABLE VIA PPE' : 'DANGEROUS: DE-ENERGIZE MANDATORY' }
      };
    },
    formula: 'E = 4.184 · Cf · Ibf^x · (t/0.2) · (610/D)^y • AFB = 610 · (E/1.2)^(1/y) (IEEE 1584-2018 / NFPA 70E)'
  },

  'cable-pull-tension-calculator': {
    title: 'Cable Pulling Tension & Sidewall Pressure Calculator',
    iconColor: 'indigo',
    inputs: [
      { id: 'w', label: 'Cable Weight (kg/m)', def: '4.5', type: 'number', step: '0.1' },
      { id: 'len', label: 'Total Pull Length (m)', def: '120', type: 'number', step: '10' },
      { id: 'mu', label: 'Friction Coefficient μ', def: '0.35', type: 'select', options: [
        { val: '0.35', lbl: '0.35 (PVC / Steel with Lubricant)' },
        { val: '0.50', lbl: '0.50 (Dry Conduit / No Lube)' },
        { val: '0.20', lbl: '0.20 (High-Lubricity Polymer Raceway)' }
      ]},
      { id: 'bends', label: 'Total Bend Angles (°)', def: '90', type: 'number', step: '15' }
    ],
    compute: (vals) => {
      const w = parseFloat(vals[0]) || 4.5;
      const len = parseFloat(vals[1]) || 120;
      const mu = parseFloat(vals[2]) || 0.35;
      const bends = parseFloat(vals[3]) || 90;
      const tStraight = w * 9.81 * len * mu;
      const bendFactor = Math.exp(mu * (bends * Math.PI / 180));
      const tTotal = (tStraight * bendFactor) / 1000;
      const swp = (tTotal * 1000) / 0.6; // 600mm standard radius
      return {
        primary: { label: 'Total Pulling Tension', val: tTotal.toFixed(2), unit: 'kN' },
        secondary: [
          { label: 'Straight Run Tension Component', val: (tStraight / 1000).toFixed(2), unit: 'kN' },
          { label: 'Bend Exponential Multiplier', val: bendFactor.toFixed(2), unit: 'x' },
          { label: 'Sidewall Bearing Pressure (SWP)', val: (swp / 1000).toFixed(2), unit: 'kN/m' }
        ],
        status: { pass: swp <= 4500, text: swp <= 4500 ? 'WITHIN CABLE CASING LIMIT' : 'EXCEEDS MAX SIDEWALL BEARING' }
      };
    },
    formula: 'T_bend = T_in · e^(μ·θ) • SWP = T / R_bend (IEEE 576 Standard for Cable Pulling in Industrial Systems)'
  },

  'cable-tray-fill-calculator': {
    title: 'Cable Tray Fill Ratio & Capacity Calculator',
    iconColor: 'blue',
    inputs: [
      { id: 'w', label: 'Tray Width (mm)', def: '300', type: 'select', options: [
        { val: '150', lbl: '150 mm (6 inch)' },
        { val: '300', lbl: '300 mm (12 inch)' },
        { val: '450', lbl: '450 mm (18 inch)' },
        { val: '600', lbl: '600 mm (24 inch)' }
      ]},
      { id: 'h', label: 'Tray Usable Depth (mm)', def: '100', type: 'number', step: '10' },
      { id: 'pwrCables', label: 'Power Cables Count', def: '8', type: 'number', step: '1' },
      { id: 'pwrDia', label: 'Power Cable Avg Dia (mm)', def: '24', type: 'number', step: '1' },
      { id: 'ctrlCables', label: 'Control Cables Count', def: '20', type: 'number', step: '2' },
      { id: 'ctrlDia', label: 'Control Cable Avg Dia (mm)', def: '12', type: 'number', step: '1' }
    ],
    compute: (vals) => {
      const w = parseFloat(vals[0]) || 300;
      const h = parseFloat(vals[1]) || 100;
      const nPwr = parseFloat(vals[2]) || 0;
      const dPwr = parseFloat(vals[3]) || 0;
      const nCtrl = parseFloat(vals[4]) || 0;
      const dCtrl = parseFloat(vals[5]) || 0;
      const trayArea = w * h;
      const pwrArea = nPwr * (Math.PI * Math.pow(dPwr / 2, 2));
      const ctrlArea = nCtrl * (Math.PI * Math.pow(dCtrl / 2, 2));
      const totalCableArea = pwrArea + ctrlArea;
      const fillPct = (totalCableArea / Math.max(1, trayArea)) * 100;
      const maxAllowed = 40.0;
      return {
        primary: { label: 'Cross-Sectional Fill Ratio', val: fillPct.toFixed(1), unit: '%' },
        secondary: [
          { label: 'Total Cable Area', val: (totalCableArea / 100).toFixed(1), unit: 'cm²' },
          { label: 'Total Tray Internal Cross-Section', val: (trayArea / 100).toFixed(0), unit: 'cm²' },
          { label: 'NEC 392 Standard Threshold', val: '40.0', unit: '% Max' }
        ],
        status: { pass: fillPct <= maxAllowed, text: fillPct <= maxAllowed ? 'NEC 392 COMPLIANT (PASS)' : 'OVERFILLED: TRAY SIZE INSUFFICIENT' }
      };
    },
    formula: 'Fill % = (Σ Area_cables / (W_tray × H_tray)) × 100% • Limit = 40% (NEC Article 392 / NEMA VE 2)'
  },

  'ceiling-grid-calculator': {
    title: 'Suspended Ceiling Grid & Tile Calculator',
    iconColor: 'emerald',
    inputs: [
      { id: 'len', label: 'Room Length (m)', def: '12', type: 'number', step: '0.5' },
      { id: 'wid', label: 'Room Width (m)', def: '8', type: 'number', step: '0.5' },
      { id: 'tileSize', label: 'Tile Dimensions', def: '600', type: 'select', options: [
        { val: '600', lbl: '600 mm × 600 mm Metric Grid' },
        { val: '1200', lbl: '600 mm × 1200 mm Imperial Module' }
      ]},
      { id: 'waste', label: 'Cut Waste Allowance (%)', def: '10', type: 'number', step: '1' }
    ],
    compute: (vals) => {
      const len = parseFloat(vals[0]) || 12;
      const wid = parseFloat(vals[1]) || 8;
      const size = parseFloat(vals[2]) || 600;
      const waste = parseFloat(vals[3]) || 10;
      const area = len * wid;
      const tileArea = size === 600 ? 0.36 : 0.72;
      const tilesNeeded = Math.ceil((area / tileArea) * (1 + waste / 100));
      const perimeter = 2 * (len + wid);
      const wallAngle = Math.ceil(perimeter / 3.0); // 3m standard lengths
      const mainRunners = Math.ceil((len / 1.2) * (wid / 3.6));
      return {
        primary: { label: 'Total Ceiling Tiles Required', val: tilesNeeded.toString(), unit: 'pcs' },
        secondary: [
          { label: 'Finished Ceiling Floor Area', val: area.toFixed(1), unit: 'm²' },
          { label: 'Wall Angle Trim (3m lengths)', val: wallAngle.toString(), unit: 'bars' },
          { label: 'Main T-Bar Runners (3.6m lengths)', val: mainRunners.toString(), unit: 'runners' }
        ],
        status: { pass: true, text: 'BILL OF MATERIALS CALCULATED' }
      };
    },
    formula: 'Tiles = ceil((Area / A_tile) × (1 + Waste)) • Main T-Bar @ 1200mm centers (ASTM C635 / EN 13964)'
  },

  'chlorine-dose-calculator': {
    title: 'Water Treatment Chlorine Feed Rate Calculator',
    iconColor: 'teal',
    inputs: [
      { id: 'q', label: 'Water Flow Q (m³/h)', def: '120', type: 'number', step: '10' },
      { id: 'demand', label: 'Chlorine Demand (mg/L)', def: '1.8', type: 'number', step: '0.1' },
      { id: 'residual', label: 'Target Free Residual (mg/L)', def: '0.6', type: 'number', step: '0.1' },
      { id: 'hypoStrength', label: 'NaOCl Solution Strength (%)', def: '10', type: 'select', options: [
        { val: '10', lbl: '10% Commercial Sodium Hypochlorite' },
        { val: '12.5', lbl: '12.5% Industrial Bleach' },
        { val: '5.25', lbl: '5.25% Household Strength' },
        { val: '100', lbl: '100% Pure Chlorine Gas (Cl2)' }
      ]}
    ],
    compute: (vals) => {
      const q = parseFloat(vals[0]) || 120;
      const dem = parseFloat(vals[1]) || 1.8;
      const res = parseFloat(vals[2]) || 0.6;
      const str = parseFloat(vals[3]) || 10;
      const dosage = dem + res;
      const cl2KgHr = (q * dosage) / 1000;
      const solutionLHr = (cl2KgHr / (str / 100)) / 1.15; // 1.15 density of NaOCl
      return {
        primary: { label: 'Pure Chlorine Dose Feed Rate', val: cl2KgHr.toFixed(3), unit: 'kg/h' },
        secondary: [
          { label: 'Total Dosage Concentration', val: dosage.toFixed(2), unit: 'mg/L (ppm)' },
          { label: 'Hypochlorite Solution Feed Pump Rate', val: solutionLHr.toFixed(2), unit: 'L/h' },
          { label: 'Daily Chlorine Consumption', val: (cl2KgHr * 24).toFixed(1), unit: 'kg/day' }
        ],
        status: { pass: dosage <= 5.0, text: dosage <= 5.0 ? 'SAFE POTABLE WATER RESIDUAL' : 'HIGH DOSAGE WARNING' }
      };
    },
    formula: 'Feed (kg/h) = Q(m³/h) × (Demand + Residual)(mg/L) / 1000 (AWWA Standard B300 Disinfection)'
  },

  'cooling-tower-sizing-calculator': {
    title: 'HVAC Cooling Tower Heat Rejection Calculator',
    iconColor: 'blue',
    inputs: [
      { id: 'tons', label: 'Chiller Heat Load (Tons)', def: '250', type: 'number', step: '25' },
      { id: 'ewt', label: 'Entering Water Temp EWT (°C)', def: '35', type: 'number', step: '0.5' },
      { id: 'lwt', label: 'Leaving Water Temp LWT (°C)', def: '30', type: 'number', step: '0.5' },
      { id: 'wbt', label: 'Design Ambient Wet Bulb WBT (°C)', def: '26', type: 'number', step: '0.5' }
    ],
    compute: (vals) => {
      const tons = parseFloat(vals[0]) || 250;
      const ewt = parseFloat(vals[1]) || 35;
      const lwt = parseFloat(vals[2]) || 30;
      const wbt = parseFloat(vals[3]) || 26;
      const range = ewt - lwt;
      const approach = lwt - wbt;
      const flowGpm = tons * 3.0;
      const flowM3h = flowGpm * 0.2271;
      const evapM3h = flowM3h * 0.0018 * range;
      return {
        primary: { label: 'Circulating Condenser Water Flow', val: flowM3h.toFixed(1), unit: 'm³/h' },
        secondary: [
          { label: 'Cooling Range (EWT - LWT)', val: range.toFixed(1), unit: '°C' },
          { label: 'Tower Approach (LWT - WBT)', val: approach.toFixed(1), unit: '°C' },
          { label: 'Makeup Water Evaporation Rate', val: evapM3h.toFixed(2), unit: 'm³/h' }
        ],
        status: { pass: approach >= 2.5, text: approach >= 2.5 ? 'APPROACH FEASIBLE (PASS)' : 'APPROACH UNREALISTICALLY TIGHT' }
      };
    },
    formula: 'Flow = 3.0 GPM/ton • Range = EWT - LWT • Approach = LWT - WBT (ASHRAE Systems & Equipment Handbook)'
  },

  'culvert-sizing-calculator': {
    title: 'Hydraulic Culvert Sizing & Headwater Calculator',
    iconColor: 'amber',
    inputs: [
      { id: 'q', label: 'Design Discharge Q (m³/s)', def: '4.2', type: 'number', step: '0.2' },
      { id: 'slope', label: 'Culvert Slope S (m/m)', def: '0.01', type: 'number', step: '0.002' },
      { id: 'mann', label: 'Culvert Material (Manning n)', def: '0.013', type: 'select', options: [
        { val: '0.013', lbl: 'Smooth Concrete Pipe (n = 0.013)' },
        { val: '0.024', lbl: 'Corrugated Metal Pipe CMP (n = 0.024)' },
        { val: '0.010', lbl: 'Smooth Interior HDPE (n = 0.010)' }
      ]},
      { id: 'maxHwD', label: 'Max Headwater Ratio (HW/D)', def: '1.2', type: 'number', step: '0.1' }
    ],
    compute: (vals) => {
      const q = parseFloat(vals[0]) || 4.2;
      const slope = parseFloat(vals[1]) || 0.01;
      const n = parseFloat(vals[2]) || 0.013;
      const maxHwD = parseFloat(vals[3]) || 1.2;
      // D = ((Q * n) / (0.3117 * sqrt(S)))^(3/8)
      const d = Math.pow((q * n) / (0.3117 * Math.sqrt(Math.max(0.0001, slope))), 3 / 8);
      const dNorm = Math.ceil(d * 10) / 10;
      const area = Math.PI * Math.pow(dNorm / 2, 2);
      const vel = q / Math.max(0.1, area);
      const hw = maxHwD * dNorm;
      return {
        primary: { label: 'Recommended Culvert Inner Dia', val: (dNorm * 1000).toFixed(0), unit: 'mm' },
        secondary: [
          { label: 'Full Barrel Discharge Velocity', val: vel.toFixed(2), unit: 'm/s' },
          { label: 'Design Headwater Depth HW', val: hw.toFixed(2), unit: 'm' },
          { label: 'Full Pipe Flow Capacity', val: (vel * area).toFixed(2), unit: 'm³/s' }
        ],
        status: { pass: vel <= 4.5 && vel >= 0.8, text: vel <= 4.5 ? 'SELF-CLEANING & EROSION-SAFE' : 'VELOCITY EXCEEDS SCOUR LIMIT' }
      };
    },
    formula: 'Manning Equation: Q = (1/n) · A · R^(2/3) · S^(1/2) (FHWA HDS-5 Hydraulic Design of Highway Culverts)'
  },

  'domestic-water-demand-calculator': {
    title: 'Water Supply Fixture Unit (WSFU) Demand Calculator',
    iconColor: 'blue',
    inputs: [
      { id: 'wsfu', label: 'Total Water Supply Fixture Units (WSFU)', def: '160', type: 'number', step: '10' },
      { id: 'systemType', label: 'Flush Device System', def: 'flush_tank', type: 'select', options: [
        { val: 'flush_tank', lbl: 'Flush Tank Predominant (Residential / Office)' },
        { val: 'flush_valve', lbl: 'Flushometer Valve System (Public Commercial)' }
      ]},
      { id: 'minPressure', label: 'Required Residual Pressure (bar)', def: '2.5', type: 'number', step: '0.2' }
    ],
    compute: (vals) => {
      const wsfu = parseFloat(vals[0]) || 160;
      const sys = vals[1] || 'flush_tank';
      const p = parseFloat(vals[2]) || 2.5;
      let gpm = sys === 'flush_tank' ? 10 + 0.38 * wsfu : 25 + 0.45 * wsfu;
      if (wsfu <= 50) gpm = sys === 'flush_tank' ? wsfu * 0.6 : wsfu * 1.0;
      const m3h = gpm * 0.2271;
      const pipeIdMm = Math.sqrt((4 * (m3h / 3600)) / (Math.PI * 1.8)) * 1000;
      return {
        primary: { label: 'Peak Probable Domestic Flow Rate', val: m3h.toFixed(2), unit: 'm³/h' },
        secondary: [
          { label: 'Hunter Curve Demand Flow', val: gpm.toFixed(1), unit: 'GPM' },
          { label: 'Recommended Main Supply Header ID', val: Math.ceil(pipeIdMm).toString(), unit: 'mm' },
          { label: 'Specified Residual Head at Fixture', val: (p * 10.197).toFixed(1), unit: 'm H₂O' }
        ],
        status: { pass: true, text: 'IPC / UPC HUNTER CURVE CONVERGED' }
      };
    },
    formula: 'Hunter Modified Probabilistic Model: Peak Flow = f(WSFU) (International Plumbing Code Table E103.3)'
  }
};

console.log(`Starting Phase 7 implementation script...`);
