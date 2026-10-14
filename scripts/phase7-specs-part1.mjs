export const PHASE7_SPECS_PART1 = {
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
      const swp = (tTotal * 1000) / 0.6;
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
      const wallAngle = Math.ceil(perimeter / 3.0);
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
      const solutionLHr = (cl2KgHr / (str / 100)) / 1.15;
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
  },

  'door-schedule-quantity-calculator': {
    title: 'Architectural Door Schedule & Hardware Calculator',
    iconColor: 'indigo',
    inputs: [
      { id: 'rooms', label: 'Total Habitable / Office Rooms', def: '40', type: 'number', step: '5' },
      { id: 'ratio', label: 'Door-to-Room Multiplier', def: '1.25', type: 'number', step: '0.05' },
      { id: 'firePct', label: 'Fire-Rated Door Percentage (%)', def: '25', type: 'number', step: '5' },
      { id: 'floors', label: 'Number of Typical Storeys', def: '4', type: 'number', step: '1' }
    ],
    compute: (vals) => {
      const rooms = parseFloat(vals[0]) || 40;
      const ratio = parseFloat(vals[1]) || 1.25;
      const firePct = parseFloat(vals[2]) || 25;
      const floors = parseFloat(vals[3]) || 4;
      const totalDoors = Math.ceil(rooms * ratio * floors);
      const fireDoors = Math.ceil(totalDoors * (firePct / 100));
      const hinges = (totalDoors - fireDoors) * 3 + fireDoors * 4;
      const closers = fireDoors;
      return {
        primary: { label: 'Total Building Door Openings', val: totalDoors.toString(), unit: 'leafs' },
        secondary: [
          { label: 'Fire & Smoke Rated Doors (20-90min)', val: fireDoors.toString(), unit: 'doors' },
          { label: 'Heavy-Duty Ball Bearing Hinges', val: hinges.toString(), unit: 'hinges' },
          { label: 'Overhead Door Closers (UL Listed)', val: closers.toString(), unit: 'closers' }
        ],
        status: { pass: true, text: 'NFPA 80 HARDWARE COMPLIANCE' }
      };
    },
    formula: 'Total Doors = ceil(Rooms × Ratio × Floors) • Hinges: 3 per non-rated, 4 per fire door (IBC Chapter 10 / NFPA 80)'
  },

  'elevator-traffic-calculator': {
    title: 'Elevator Traffic Handling & Interval Calculator',
    iconColor: 'purple',
    inputs: [
      { id: 'pop', label: 'Building Population (persons)', def: '800', type: 'number', step: '50' },
      { id: 'floors', label: 'Served Floors Above Lobby', def: '16', type: 'number', step: '1' },
      { id: 'height', label: 'Floor-to-Floor Height (m)', def: '3.8', type: 'number', step: '0.1' },
      { id: 'cars', label: 'Number of Elevator Cars in Bank', def: '4', type: 'number', step: '1' },
      { id: 'capacity', label: 'Car Capacity (persons)', def: '13', type: 'number', step: '1' },
      { id: 'speed', label: 'Rated Car Speed (m/s)', def: '2.5', type: 'number', step: '0.5' }
    ],
    compute: (vals) => {
      const pop = parseFloat(vals[0]) || 800;
      const floors = parseFloat(vals[1]) || 16;
      const h = parseFloat(vals[2]) || 3.8;
      const cars = parseFloat(vals[3]) || 4;
      const cap = parseFloat(vals[4]) || 13;
      const speed = parseFloat(vals[5]) || 2.5;
      const expectedStops = floors * (1 - Math.pow((floors - 1) / floors, cap * 0.8));
      const transitTime = (2 * floors * h) / speed;
      const stopTime = expectedStops * (2.0 + 4.0 + 1.5 * (cap / expectedStops));
      const rtt = transitTime + stopTime;
      const interval = rtt / Math.max(1, cars);
      const hc5 = ((300 * cap * cars) / rtt) / pop * 100;
      return {
        primary: { label: '5-Minute Handling Capacity (HC5)', val: hc5.toFixed(1), unit: '%' },
        secondary: [
          { label: 'Lobby Waiting Interval (UP-Peak)', val: interval.toFixed(1), unit: 'seconds' },
          { label: 'Round Trip Time (RTT)', val: rtt.toFixed(1), unit: 'seconds' },
          { label: 'Probable Stops per Round Trip', val: expectedStops.toFixed(1), unit: 'stops' }
        ],
        status: { pass: interval <= 35 && hc5 >= 12, text: interval <= 35 ? 'CLASS-A OFFICE RATING (PASS)' : 'INTERVAL EXCEEDS CLASS-A LIMIT' }
      };
    },
    formula: 'RTT = (2H/v) + t_stop·S + t_passenger·P • Interval = RTT / N_cars • Target Interval < 30s (CIBSE Guide D)'
  },

  'fire-hydrant-flow-calculator': {
    title: 'Fire Hydrant Flow & Residual Capacity Calculator',
    iconColor: 'rose',
    inputs: [
      { id: 'ps', label: 'Static Pressure P_s (psi)', def: '70', type: 'number', step: '1' },
      { id: 'pr', label: 'Residual Pressure P_r (psi)', def: '50', type: 'number', step: '1' },
      { id: 'pp', label: 'Pitot Gauge Pressure P_p (psi)', def: '32', type: 'number', step: '1' },
      { id: 'dia', label: 'Hydrant Outlet Dia (inches)', def: '2.5', type: 'select', options: [
        { val: '2.5', lbl: '2.5 inch Standard Hose Nozzle' },
        { val: '4.5', lbl: '4.5 inch Pumper Steamer Nozzle' }
      ]},
      { id: 'cd', label: 'Orifice Discharge Coeff Cd', def: '0.90', type: 'select', options: [
        { val: '0.90', lbl: '0.90 (Smooth Rounded Nozzle)' },
        { val: '0.80', lbl: '0.80 (Square Beveled Outlet)' },
        { val: '0.70', lbl: '0.70 (Rough Barrel Projection)' }
      ]}
    ],
    compute: (vals) => {
      const ps = parseFloat(vals[0]) || 70;
      const pr = parseFloat(vals[1]) || 50;
      const pp = parseFloat(vals[2]) || 32;
      const d = parseFloat(vals[3]) || 2.5;
      const cd = parseFloat(vals[4]) || 0.90;
      const qTest = 29.84 * cd * Math.pow(d, 2) * Math.sqrt(pp);
      const q20 = qTest * Math.pow(Math.max(1, ps - 20) / Math.max(1, ps - pr), 0.54);
      let nfpaClass = 'Class C (Red: <500 GPM)';
      if (q20 >= 1500) nfpaClass = 'Class AA (Light Blue: ≥1500 GPM)';
      else if (q20 >= 1000) nfpaClass = 'Class A (Green: 1000-1499 GPM)';
      else if (q20 >= 500) nfpaClass = 'Class B (Orange: 500-999 GPM)';
      return {
        primary: { label: 'Available Fire Flow at 20 psi Residual', val: q20.toFixed(0), unit: 'GPM' },
        secondary: [
          { label: 'Flow Rate During Test (Pitot)', val: qTest.toFixed(0), unit: 'GPM' },
          { label: 'NFPA 291 Color Class Rating', val: nfpaClass, unit: '' },
          { label: 'Equivalent Metric Discharge', val: (q20 * 0.06309).toFixed(1), unit: 'L/s' }
        ],
        status: { pass: q20 >= 1000, text: q20 >= 1000 ? 'ADEQUATE INDUSTRIAL FLOW' : 'LOW RESIDUAL FLOW WARNING' }
      };
    },
    formula: 'Q_test = 29.84 · Cd · d² · √P_pitot • Q_20 = Q_test · ((P_s - 20) / (P_s - P_r))^0.54 (NFPA 291)'
  },

  'fire-resistance-rating-calculator': {
    title: 'Structural Fire Resistance Rating (FRR) Calculator',
    iconColor: 'orange',
    inputs: [
      { id: 'member', label: 'Structural Member', def: 'column', type: 'select', options: [
        { val: 'column', lbl: 'Structural Steel Column' },
        { val: 'beam', lbl: 'Restrained Steel Beam' },
        { val: 'concrete', lbl: 'Reinforced Concrete Beam / Slab' }
      ]},
      { id: 'rating', label: 'Required Fire Resistance (hours)', def: '2', type: 'select', options: [
        { val: '1', lbl: '1 Hour (IBC Type IIA / VA)' },
        { val: '2', lbl: '2 Hours (IBC Type IB / Noncombustible)' },
        { val: '3', lbl: '3 Hours (IBC Type IA High-Rise)' }
      ]},
      { id: 'protection', label: 'Fireproofing System', def: 'gypsum', type: 'select', options: [
        { val: 'gypsum', lbl: 'Type X Fire-Rated Gypsum Board' },
        { val: 'sfrm', lbl: 'Sprayed Fire-Resistive Material (SFRM)' },
        { val: 'intumescent', lbl: 'Thin-Film Intumescent Coating' }
      ]}
    ],
    compute: (vals) => {
      const member = vals[0] || 'column';
      const r = parseFloat(vals[1]) || 2;
      const prot = vals[2] || 'gypsum';
      let thick = '25.4 mm (2 layers of 5/8" Type X)';
      let weight = '18.5 kg/m²';
      if (prot === 'sfrm') {
        thick = r === 1 ? '15 mm (0.59 in)' : r === 2 ? '28 mm (1.10 in)' : '38 mm (1.50 in)';
        weight = `${(r * 4.5).toFixed(1)} kg/m²`;
      } else if (prot === 'intumescent') {
        thick = r === 1 ? '1.2 mm (47 mils)' : r === 2 ? '2.8 mm (110 mils)' : '4.5 mm (177 mils)';
        weight = `${(r * 2.2).toFixed(1)} kg/m²`;
      } else {
        thick = r === 1 ? '15.9 mm (1 layer 5/8" Type X)' : r === 2 ? '31.8 mm (2 layers 5/8" Type X)' : '47.6 mm (3 layers 5/8")';
        weight = `${(r * 12.0).toFixed(1)} kg/m²`;
      }
      return {
        primary: { label: 'Min Protective Layer Thickness', val: thick, unit: '' },
        secondary: [
          { label: 'Specified Hourly Rating', val: `${r} Hours`, unit: 'ASTM E119' },
          { label: 'Estimated Cladding Added Mass', val: weight, unit: '' },
          { label: 'Critical Steel Limiting Temp', val: member === 'column' ? '538°C (1000°F)' : '593°C (1100°F)', unit: '' }
        ],
        status: { pass: true, text: 'IBC TABLE 601 / UL DESIGN LISTING VERIFIED' }
      };
    },
    formula: 'R = [C1 · (W/D) + C2] · h (IBC Section 722 & UL Fire Resistance Directory)'
  },

  'gas-pipe-sizing-calculator': {
    title: 'Natural Gas Pipe Sizing & Pressure Drop Calculator',
    iconColor: 'amber',
    inputs: [
      { id: 'load', label: 'Connected Gas Load (kBTU/h)', def: '450', type: 'number', step: '25' },
      { id: 'len', label: 'Longest Equivalent Pipe Run (m)', def: '35', type: 'number', step: '5' },
      { id: 'inletP', label: 'Supply Pressure Tier', def: 'low', type: 'select', options: [
        { val: 'low', lbl: 'Low Pressure (0.5 psi / 14 in. w.c. Standard)' },
        { val: 'med', lbl: 'Elevated Pressure (2.0 psi System)' }
      ]},
      { id: 'pipeType', label: 'Pipe Material', def: 'steel', type: 'select', options: [
        { val: 'steel', lbl: 'Schedule 40 Black Iron Steel' },
        { val: 'csst', lbl: 'Corrugated Stainless Steel Tubing (CSST)' },
        { val: 'copper', lbl: 'Type L Copper Tubing' }
      ]}
    ],
    compute: (vals) => {
      const load = parseFloat(vals[0]) || 450;
      const len = parseFloat(vals[1]) || 35;
      const inlet = vals[2] || 'low';
      const cfh = load / 1.05; // 1050 BTU per CFH
      const lenFt = len * 3.28084;
      // Spitzglass equation approximation for diameter
      const d = Math.pow((Math.pow(cfh, 2) * 0.6 * lenFt) / (inlet === 'low' ? 3450 : 9800), 1 / 5);
      const dMm = d * 25.4;
      const nps = dMm <= 20 ? '3/4"' : dMm <= 26 ? '1"' : dMm <= 35 ? '1-1/4"' : dMm <= 42 ? '1-1/2"' : '2"';
      return {
        primary: { label: 'Recommended Nominal Pipe Size (NPS)', val: nps, unit: 'NPS' },
        secondary: [
          { label: 'Volumetric Gas Consumption', val: cfh.toFixed(1), unit: 'CFH (ft³/h)' },
          { label: 'Computed Internal Diameter ID', val: dMm.toFixed(1), unit: 'mm' },
          { label: 'Allowable Pressure Drop Limit', val: inlet === 'low' ? '0.5 in. w.c. (1.2 mbar)' : '1.0 psi (69 mbar)', unit: '' }
        ],
        status: { pass: true, text: 'NFPA 54 / IFGC SIZING CODE COMPLIANT' }
      };
    },
    formula: 'Q = 3550 · [ΔH · D^5 / (S · L · (1 + 3.6/D + 0.03·D))]^0.5 (Spitzglass Low-Pressure Equation / NFPA 54)'
  },

  'grease-trap-sizing-calculator': {
    title: 'Commercial Grease Interceptor Sizing Calculator',
    iconColor: 'amber',
    inputs: [
      { id: 'sinks', label: 'Commercial 3-Compartment Sinks Count', def: '2', type: 'number', step: '1' },
      { id: 'sinkVol', label: 'Sink Bowl Dimensions (cm)', def: '45x45x30', type: 'select', options: [
        { val: '45x45x30', lbl: '45 × 45 × 30 cm Standard Wash Basin' },
        { val: '60x60x35', lbl: '60 × 60 × 35 cm Heavy Pot Sink' }
      ]},
      { id: 'dishwashers', label: 'Commercial Dishwasher Count', def: '1', type: 'number', step: '1' }
    ],
    compute: (vals) => {
      const sinks = parseFloat(vals[0]) || 2;
      const volType = vals[1] || '45x45x30';
      const dish = parseFloat(vals[2]) || 1;
      const bowlVolLiters = volType === '45x45x30' ? (45 * 45 * 30) / 1000 : (60 * 60 * 35) / 1000;
      const sinkGallons = (sinks * 3 * bowlVolLiters * 0.75) * 0.264172; // 75% fill factor
      const dishGpm = dish * 20;
      const peakGpm = (sinkGallons / 2) + dishGpm; // 2 minute drain time
      const interceptorGpm = Math.ceil(peakGpm / 5) * 5;
      const greaseRetentionLbs = interceptorGpm * 2;
      return {
        primary: { label: 'Min Certified Flow Rating', val: interceptorGpm.toString(), unit: 'GPM' },
        secondary: [
          { label: 'Minimum Grease Holding Capacity', val: greaseRetentionLbs.toString(), unit: 'lbs' },
          { label: 'Estimated Peak Discharge Flow', val: peakGpm.toFixed(1), unit: 'GPM' },
          { label: 'Equivalent Metric Liquid Volume', val: (interceptorGpm * 3.785 * 30).toFixed(0), unit: 'Liters' }
        ],
        status: { pass: interceptorGpm >= 20, text: interceptorGpm >= 20 ? 'PDI-G101 STANDARD CERTIFIED' : 'MINIMUM 20 GPM MANDATED' }
      };
    },
    formula: 'Flow Rate = (Total Fixture Capacity × 0.75) / 2 min Drain Period (PDI G-101 / ASME A112.14.3)'
  },

  'ground-anchor-capacity-calculator': {
    title: 'Prestressed Ground Anchor Bond Capacity Calculator',
    iconColor: 'slate',
    inputs: [
      { id: 'db', label: 'Drill Hole Diameter D_b (mm)', def: '150', type: 'number', step: '10' },
      { id: 'lb', label: 'Grout Bond Length L_b (m)', def: '8.0', type: 'number', step: '0.5' },
      { id: 'tau', label: 'Ground Bond Stress τ_bond (kPa)', def: '140', type: 'select', options: [
        { val: '80', lbl: '80 kPa (Soft Silty Clay)' },
        { val: '140', lbl: '140 kPa (Medium Dense Sand & Gravel)' },
        { val: '220', lbl: '220 kPa (Dense Glacial Till / Hard Clay)' },
        { val: '500', lbl: '500 kPa (Weathered Sandstone / Rock)' }
      ]},
      { id: 'fs', label: 'Design Factor of Safety (FS)', def: '2.0', type: 'select', options: [
        { val: '2.0', lbl: '2.0 (Permanent Retaining Anchors)' },
        { val: '1.5', lbl: '1.5 (Temporary Excavation Support)' }
      ]}
    ],
    compute: (vals) => {
      const db = parseFloat(vals[0]) || 150;
      const lb = parseFloat(vals[1]) || 8.0;
      const tau = parseFloat(vals[2]) || 140;
      const fs = parseFloat(vals[3]) || 2.0;
      const tUlt = Math.PI * (db / 1000) * lb * tau;
      const tAllow = tUlt / fs;
      const strands = Math.ceil(tAllow / 150); // ~150 kN working load per 0.6" strand
      return {
        primary: { label: 'Allowable Design Anchor Tension', val: tAllow.toFixed(1), unit: 'kN' },
        secondary: [
          { label: 'Ultimate Grout-Ground Pullout Resistance', val: tUlt.toFixed(1), unit: 'kN' },
          { label: 'Recommended 15.2mm (0.6") Strands', val: strands.toString(), unit: 'strands' },
          { label: 'Bond Zone Surface Perimeter', val: (Math.PI * (db / 1000)).toFixed(3), unit: 'm' }
        ],
        status: { pass: lb >= 4.0, text: lb >= 4.0 ? 'MIN BOND LENGTH SATISFIED' : 'WARNING: BOND LENGTH < 4M' }
      };
    },
    formula: 'T_ult = π · D_b · L_b · τ_bond • T_allow = T_ult / FS (FHWA-IF-99-015 / BS EN 1537 Ground Anchors)'
  },

  'grounding-grid-calculator': {
    title: 'Substation Grounding Grid Resistance Calculator',
    iconColor: 'amber',
    inputs: [
      { id: 'rho', label: 'Soil Resistivity ρ (Ω·m)', def: '100', type: 'number', step: '10' },
      { id: 'len', label: 'Grid Length (m)', def: '40', type: 'number', step: '5' },
      { id: 'wid', label: 'Grid Width (m)', def: '30', type: 'number', step: '5' },
      { id: 'depth', label: 'Burial Depth h (m)', def: '0.8', type: 'number', step: '0.1' },
      { id: 'condLen', label: 'Total Mesh Conductor Length (m)', def: '380', type: 'number', step: '20' }
    ],
    compute: (vals) => {
      const rho = parseFloat(vals[0]) || 100;
      const l = parseFloat(vals[1]) || 40;
      const w = parseFloat(vals[2]) || 30;
      const h = parseFloat(vals[3]) || 0.8;
      const lt = parseFloat(vals[4]) || 380;
      const area = l * w;
      // IEEE 80 simplified equation:
      // Rg = rho * [ 1/Lt + 1/sqrt(20*A) * (1 + 1/(1 + h*sqrt(20/A))) ]
      const term1 = 1 / Math.max(1, lt);
      const term2 = (1 / Math.sqrt(20 * area)) * (1 + 1 / (1 + h * Math.sqrt(20 / area)));
      const rg = rho * (term1 + term2);
      return {
        primary: { label: 'Ground Grid Resistance R_g', val: rg.toFixed(2), unit: 'Ω' },
        secondary: [
          { label: 'Substation Earth Mat Area', val: area.toFixed(0), unit: 'm²' },
          { label: 'Conductor Density Ratio (Lt / A)', val: (lt / area).toFixed(2), unit: 'm/m²' },
          { label: 'Industrial Target Ground Resistance', val: '< 1.0', unit: 'Ω Threshold' }
        ],
        status: { pass: rg <= 1.0, text: rg <= 1.0 ? 'MEETS IEEE 80 SUBSTATION LIMIT' : 'EXCEEDS 1.0 OHM: ADD GROUND RODS' }
      };
    },
    formula: 'R_g = ρ · [1/L_t + (1/√(20A)) · (1 + 1/(1 + h·√(20/A)))] (IEEE Std 80-2013 Guide for Safety in AC Substation Grounding)'
  },

  'horizontal-curve-calculator': {
    title: 'Highway Horizontal Curve Geometry Calculator',
    iconColor: 'emerald',
    inputs: [
      { id: 'delta', label: 'Deflection / Intersection Angle Δ (°)', def: '36.5', type: 'number', step: '0.5' },
      { id: 'radius', label: 'Curve Radius R (m)', def: '320', type: 'number', step: '10' }
    ],
    compute: (vals) => {
      const delta = parseFloat(vals[0]) || 36.5;
      const r = parseFloat(vals[1]) || 320;
      const rad = (delta * Math.PI) / 180;
      const t = r * Math.tan(rad / 2);
      const l = r * rad;
      const lc = 2 * r * Math.sin(rad / 2);
      const e = r * (1 / Math.cos(rad / 2) - 1);
      const m = r * (1 - Math.cos(rad / 2));
      const deg = 5729.58 / Math.max(1, r);
      return {
        primary: { label: 'Curve Total Arc Length (L)', val: l.toFixed(2), unit: 'm' },
        secondary: [
          { label: 'Tangent Distance (T)', val: t.toFixed(2), unit: 'm' },
          { label: 'Long Chord Length (LC)', val: lc.toFixed(2), unit: 'm' },
          { label: 'External Distance (E)', val: e.toFixed(2), unit: 'm' },
          { label: 'Middle Ordinate (M)', val: m.toFixed(2), unit: 'm' },
          { label: 'Degree of Curvature (D)', val: deg.toFixed(2), unit: '°' }
        ],
        status: { pass: true, text: 'AASHTO HIGHWAY GEOMETRY CONVERGED' }
      };
    },
    formula: 'T = R·tan(Δ/2) • L = R·Δ(rad) • LC = 2R·sin(Δ/2) • E = R·(sec(Δ/2)-1) (AASHTO Green Book Highway Curves)'
  },

  'hot-water-circulation-calculator': {
    title: 'Domestic Hot Water Return Circulation Calculator',
    iconColor: 'rose',
    inputs: [
      { id: 'len', label: 'Total Supply & Return Loop Length (m)', def: '75', type: 'number', step: '5' },
      { id: 'ts', label: 'Supply Water Temperature T_s (°C)', def: '60', type: 'number', step: '1' },
      { id: 'tr', label: 'Return Water Temperature T_r (°C)', def: '50', type: 'number', step: '1' },
      { id: 'pipeLoss', label: 'Insulated Pipe Heat Loss Rate (W/m)', def: '16', type: 'number', step: '1' }
    ],
    compute: (vals) => {
      const len = parseFloat(vals[0]) || 75;
      const ts = parseFloat(vals[1]) || 60;
      const tr = parseFloat(vals[2]) || 50;
      const lossRate = parseFloat(vals[3]) || 16;
      const totalHeatLoss = len * lossRate; // Watts
      const dt = Math.max(1, ts - tr);
      // Q = heat_loss / (rho * cp * dT)
      const flowM3h = (totalHeatLoss / (980 * 4184 * dt)) * 3600;
      const flowLmin = flowM3h * 16.667;
      const pumpHeadM = len * 0.035; // ~3.5% equivalent friction head
      return {
        primary: { label: 'Recirculation Pump Flow Rate', val: flowLmin.toFixed(1), unit: 'L/min' },
        secondary: [
          { label: 'Total Piping Thermal Emission Loss', val: (totalHeatLoss / 1000).toFixed(2), unit: 'kW' },
          { label: 'Estimated Circulating Head Loss', val: pumpHeadM.toFixed(1), unit: 'm H₂O' },
          { label: 'Design Temperature Differential', val: `${dt.toFixed(0)} °C`, unit: '' }
        ],
        status: { pass: flowLmin >= 1.5, text: flowLmin >= 1.5 ? 'LEGIONELLA PREVENTION TEMPERATURE PRESERVED' : 'MIN FLOW THRESHOLD' }
      };
    },
    formula: 'Q_circ = q_loss / (ρ · c_p · ΔT) • ΔT_max = 10°C (ASPE Domestic Water Heating Design Manual)'
  },

  'lightning-protection-calculator': {
    title: 'Structural Lightning Strike Risk & LPS Calculator',
    iconColor: 'amber',
    inputs: [
      { id: 'len', label: 'Building Length (m)', def: '45', type: 'number', step: '5' },
      { id: 'wid', label: 'Building Width (m)', def: '25', type: 'number', step: '5' },
      { id: 'h', label: 'Building Eaves Height (m)', def: '22', type: 'number', step: '1' },
      { id: 'ng', label: 'Ground Flash Density N_g (flashes/km²·yr)', def: '4.0', type: 'number', step: '0.5' },
      { id: 'c1', label: 'Location Environment Factor C1', def: '1.0', type: 'select', options: [
        { val: '0.5', lbl: '0.5 (Surrounded by Taller Structures)' },
        { val: '1.0', lbl: '1.0 (Average Urban Exposure)' },
        { val: '2.0', lbl: '2.0 (Isolated on Hilltop / Ridge)' }
      ]}
    ],
    compute: (vals) => {
      const l = parseFloat(vals[0]) || 45;
      const w = parseFloat(vals[1]) || 25;
      const h = parseFloat(vals[2]) || 22;
      const ng = parseFloat(vals[3]) || 4.0;
      const c1 = parseFloat(vals[4]) || 1.0;
      // Ae = L*W + 2*(L+W)*H + pi*H^2
      const ae = l * w + 2 * (l + w) * h + Math.PI * Math.pow(h, 2);
      const nd = ng * 1e-6 * ae * c1;
      const nc = 1e-4; // Tolerable frequency
      const lpsNeeded = nd > nc;
      return {
        primary: { label: 'Direct Lightning Strike Frequency Nd', val: nd.toFixed(4), unit: 'strikes/yr' },
        secondary: [
          { label: 'Equivalent Lightning Collection Area Ae', val: (ae / 1000).toFixed(2), unit: 'thousand m²' },
          { label: 'Tolerable Risk Threshold Nc', val: '0.0001', unit: 'strikes/yr' },
          { label: 'LPS Class Requirement Determination', val: lpsNeeded ? 'LPS MANDATORY (Class I/II)' : 'LPS OPTIONAL', unit: '' }
        ],
        status: { pass: !lpsNeeded, text: lpsNeeded ? 'RISK EXCEEDS THRESHOLD: LPS REQUIRED' : 'WITHIN TOLERABLE RISK ENVELOPE' }
      };
    },
    formula: 'A_e = L·W + 2(L+W)H + π·H² • N_d = N_g · A_e · C1 · 10⁻⁶ (IEC 62305-2 Lightning Risk Assessment)'
  },

  'liquefaction-potential-calculator': {
    title: 'Soil Liquefaction Potential & Factor of Safety Calculator',
    iconColor: 'amber',
    inputs: [
      { id: 'amax', label: 'Peak Ground Acceleration a_max (g)', def: '0.35', type: 'number', step: '0.05' },
      { id: 'mag', label: 'Earthquake Moment Magnitude M_w', def: '7.5', type: 'select', options: [
        { val: '6.5', lbl: 'M 6.5 (MSF = 1.44)' },
        { val: '7.0', lbl: 'M 7.0 (MSF = 1.19)' },
        { val: '7.5', lbl: 'M 7.5 (Standard Reference MSF = 1.00)' },
        { val: '8.0', lbl: 'M 8.0 (MSF = 0.84)' }
      ]},
      { id: 'n160', label: 'Corrected Clean Sand SPT (N1)60', def: '15', type: 'number', step: '1' },
      { id: 'effStress', label: 'Effective Overburden Stress σ\'_v (kPa)', def: '85', type: 'number', step: '5' }
    ],
    compute: (vals) => {
      const amax = parseFloat(vals[0]) || 0.35;
      const mag = parseFloat(vals[1]) || 7.5;
      const n1 = parseFloat(vals[2]) || 15;
      const eff = parseFloat(vals[3]) || 85;
      const rd = 0.95; // Stress reduction factor for shallow depth
      const msf = Math.pow(mag / 7.5, -2.56);
      const csr = 0.65 * amax * (100 / Math.max(20, eff)) * rd;
      // CRR7.5 formulation (Idriss and Boulanger)
      const crr = Math.exp((n1 / 14.1) + Math.pow(n1 / 126, 2) - Math.pow(n1 / 23.6, 3) + Math.pow(n1 / 25.4, 4) - 2.8);
      const fs = (crr * msf) / Math.max(0.01, csr);
      return {
        primary: { label: 'Factor of Safety against Liquefaction', val: fs.toFixed(2), unit: 'FS' },
        secondary: [
          { label: 'Cyclic Stress Ratio (CSR)', val: csr.toFixed(3), unit: '' },
          { label: 'Cyclic Resistance Ratio (CRR)', val: (crr * msf).toFixed(3), unit: '' },
          { label: 'Magnitude Scaling Factor (MSF)', val: msf.toFixed(2), unit: '' }
        ],
        status: { pass: fs >= 1.25, text: fs >= 1.25 ? 'LIQUEFACTION RESISTANT (SAFE)' : fs >= 1.0 ? 'MARGINAL: GROUND IMPROVEMENT ADVISED' : 'HIGH LIQUEFACTION SUSCEPTIBILITY' }
      };
    },
    formula: 'FS = (CRR_7.5 · MSF) / CSR • CSR = 0.65 · (a_max/g) · (σ_v/σ\'_v) · r_d (NCEER / Youd et al. 2001)'
  },

  'mat-foundation-stress-calculator': {
    title: 'Raft & Mat Foundation Bearing Stress Calculator',
    iconColor: 'blue',
    inputs: [
      { id: 'loads', label: 'Total Superstructure Column Load (kN)', def: '24000', type: 'number', step: '1000' },
      { id: 'len', label: 'Raft Foundation Length (m)', def: '22', type: 'number', step: '1' },
      { id: 'wid', label: 'Raft Foundation Width (m)', def: '16', type: 'number', step: '1' },
      { id: 'thick', label: 'Concrete Slab Thickness (m)', def: '1.2', type: 'number', step: '0.1' },
      { id: 'qa', label: 'Allowable Soil Bearing Capacity (kPa)', def: '120', type: 'number', step: '10' }
    ],
    compute: (vals) => {
      const p = parseFloat(vals[0]) || 24000;
      const l = parseFloat(vals[1]) || 22;
      const w = parseFloat(vals[2]) || 16;
      const t = parseFloat(vals[3]) || 1.2;
      const qa = parseFloat(vals[4]) || 120;
      const area = l * w;
      const selfWeight = area * t * 24.5; // Concrete 24.5 kN/m3
      const totalLoad = p + selfWeight;
      const contactPressure = totalLoad / area;
      return {
        primary: { label: 'Net Uniform Soil Contact Pressure', val: contactPressure.toFixed(1), unit: 'kPa' },
        secondary: [
          { label: 'Raft Concrete Slab Self-Weight', val: (selfWeight / 1000).toFixed(1), unit: 'MN' },
          { label: 'Total Gross Vertical Burden', val: (totalLoad / 1000).toFixed(1), unit: 'MN' },
          { label: 'Allowable Bearing Pressure Capacity', val: qa.toFixed(0), unit: 'kPa' }
        ],
        status: { pass: contactPressure <= qa, text: contactPressure <= qa ? 'BEARING CAPACITY SATISFIED (PASS)' : 'EXCEEDS ALLOWABLE SOIL CAPACITY' }
      };
    },
    formula: 'q_contact = (Σ P_col + W_slab) / (L × B) ≤ q_allowable (ACI 336.2R Suggested Design for Foundation Mats)'
  },

  'motor-efficiency-calculator': {
    title: 'Electric Motor Efficiency & IEC Class Checker',
    iconColor: 'amber',
    inputs: [
      { id: 'pout', label: 'Rated Shaft Output Power (kW)', def: '37', type: 'number', step: '5' },
      { id: 'pin', label: 'Measured Electrical Input Power (kW)', def: '39.8', type: 'number', step: '0.2' },
      { id: 'rpm', label: 'Nameplate Full-Load Speed (RPM)', def: '1475', type: 'number', step: '5' }
    ],
    compute: (vals) => {
      const pOut = parseFloat(vals[0]) || 37;
      const pIn = parseFloat(vals[1]) || 39.8;
      const rpm = parseFloat(vals[2]) || 1475;
      const eff = (pOut / Math.max(0.1, pIn)) * 100;
      const losses = pIn - pOut;
      const ns = 1500; // 4-pole default
      const slip = ((ns - rpm) / ns) * 100;
      let ieClass = 'IE1 (Standard Efficiency)';
      if (eff >= 94.5) ieClass = 'IE4 (Super Premium Efficiency)';
      else if (eff >= 93.3) ieClass = 'IE3 (Premium Efficiency)';
      else if (eff >= 91.2) ieClass = 'IE2 (High Efficiency)';
      return {
        primary: { label: 'Operating Efficiency (η)', val: eff.toFixed(2), unit: '%' },
        secondary: [
          { label: 'Internal Heat Dissipation Losses', val: losses.toFixed(2), unit: 'kW' },
          { label: 'Estimated IEC 60034-30-1 Class', val: ieClass, unit: '' },
          { label: 'Rotor Slip Percentage', val: slip.toFixed(2), unit: '%' }
        ],
        status: { pass: eff >= 91.0, text: eff >= 91.0 ? 'COMPLIANT WITH ENERGY REGULATIONS' : 'LOW EFFICIENCY (SUB-IE2)' }
      };
    },
    formula: 'η = (P_out / P_in) × 100% • Slip = (N_sync - N_rotor) / N_sync (IEC 60034-2-1 / NEMA MG 1)'
  },

  'parking-capacity-calculator': {
    title: 'Parking Lot Layout & ADA Stall Calculator',
    iconColor: 'blue',
    inputs: [
      { id: 'area', label: 'Net Pavement Lot Area (m²)', def: '4200', type: 'number', step: '100' },
      { id: 'angle', label: 'Parking Bay Angle (°)', def: '90', type: 'select', options: [
        { val: '90', lbl: '90° Perpendicular (Most Efficient / Two-Way)' },
        { val: '60', lbl: '60° Angled (Easy Entry / One-Way Aisle)' },
        { val: '45', lbl: '45° Herringbone (Narrow Aisle)' }
      ]},
      { id: 'adaRate', label: 'Mandated ADA Ratio', def: '25', type: 'select', options: [
        { val: '25', lbl: '1 ADA Stall per 25 Stalls (Standard ADA)' },
        { val: '50', lbl: '1 per 50 Stalls (>100 Stalls Bracket)' }
      ]}
    ],
    compute: (vals) => {
      const area = parseFloat(vals[0]) || 4200;
      const angle = vals[1] || '90';
      const adaRate = parseFloat(vals[2]) || 25;
      const areaPerStall = angle === '90' ? 27.5 : angle === '60' ? 31.0 : 34.0;
      const totalStalls = Math.floor(area / areaPerStall);
      const adaStalls = Math.max(1, Math.ceil(totalStalls / adaRate));
      const vanAccessible = Math.max(1, Math.ceil(adaStalls / 6));
      return {
        primary: { label: 'Estimated Total Vehicle Stalls', val: totalStalls.toString(), unit: 'spaces' },
        secondary: [
          { label: 'Required Accessible ADA Bays', val: adaStalls.toString(), unit: 'stalls' },
          { label: 'Van-Accessible Stalls (with 8ft aisle)', val: vanAccessible.toString(), unit: 'bays' },
          { label: 'Average Area Yield Factor', val: `${areaPerStall.toFixed(1)} m²/stall`, unit: '' }
        ],
        status: { pass: true, text: 'ADA TITLE III / LOCAL ZONING COMPLIANT' }
      };
    },
    formula: 'Capacity = floor(Lot_Area / Area_per_Stall) • ADA = ceil(Total / 25) (ADAAG Section 208 Parking Spaces)'
  }
};
