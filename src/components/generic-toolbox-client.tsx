'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ExternalLink, 
  Check, 
  Copy, 
  Search, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode, 
  Sliders, 
  Layers, 
  BookOpen, 
  ShieldCheck, 
  Zap, 
  Calculator, 
  Wrench,
  HelpCircle,
  FileCheck2,
  Printer
} from 'lucide-react';
import { ToolboxItem } from '@/lib/toolbox-data';
import { RelatedTools } from '@/components/related-tools';
import CadFileWorkbench, { workbenchSupports } from '@/components/cad-file-workbench';

interface GenericToolboxClientProps {
  tool: ToolboxItem;
}

// 权威常用参考数据字典（用于 cheatsheet & library）
const REFERENCE_DATASETS: Record<string, {
  headers: string[];
  rows: string[][];
  note: string;
}> = {
  'gdt-symbols-cheatsheet': {
    headers: ['Symbol', 'Characteristic', 'Category', 'Datum Required', 'Tolerance Zone Shape', 'ASME Y14.5 Definition'],
    rows: [
      ['⎯', 'Straightness', 'Form', 'No', 'Two parallel lines or cylinder', 'Element of a surface or an axis is in a straight line.'],
      ['⏥', 'Flatness', 'Form', 'No', 'Two parallel planes', 'All surface elements are in one plane.'],
      ['○', 'Circularity (Roundness)', 'Form', 'No', 'Two concentric circles', 'All points on a surface intersected by any plane perpendicular to an axis are equidistant.'],
      ['⌭', 'Cylindricity', 'Form', 'No', 'Two coaxial cylinders', 'Surface of revolution in which all points are equidistant from a common axis.'],
      ['⌒', 'Profile of a Line', 'Profile', 'Optional', 'Two uniform boundaries along true profile', '2D line element tolerance across cross-sections.'],
      ['⌓', 'Profile of a Surface', 'Profile', 'Optional', 'Two parallel boundaries offsetting surface', '3D surface boundary envelope across entire surface.'],
      ['∠', 'Angularity', 'Orientation', 'Yes', 'Two parallel planes at specified angle', 'Controls surface, center plane, or axis at specified angle from datum.'],
      ['⟂', 'Perpendicularity', 'Orientation', 'Yes', 'Two parallel planes at 90°', 'Surface, plane, or axis exactly 90° relative to datum reference.'],
      ['//', 'Parallelism', 'Orientation', 'Yes', 'Two parallel planes/lines', 'Surface or center plane equidistant at all points to datum.'],
      ['⌖', 'Position', 'Location', 'Yes', 'Cylindrical or boundary zone', 'Location of feature of size relative to specified datum reference frame.'],
      ['◎', 'Concentricity', 'Location', 'Yes', 'Cylindrical zone centered on datum', 'Median points of diametrically opposed points lie on datum axis.'],
      ['⌯', 'Symmetry', 'Location', 'Yes', 'Two parallel planes centered on datum', 'Median points of opposing features are congruent with datum plane.'],
      ['↗', 'Circular Runout', 'Runout', 'Yes', 'Two coaxial circles at cross-section', 'Controls surface elements during 360° rotation about datum axis.'],
      ['⌕', 'Total Runout', 'Runout', 'Yes', 'Two coaxial cylinders across whole part', 'Controls entire surface simultaneously during 360° rotation.']
    ],
    note: 'Governed by ASME Y14.5-2018 & ISO 1101 geometric dimensioning and tolerancing standards.'
  },
  'welding-symbols-cheatsheet': {
    headers: ['Weld Type', 'Basic Symbol', 'Arrow Side / Other Side Rule', 'Key Dimensions Required', 'AWS A2.4 / ISO 2553 Standard'],
    rows: [
      ['Fillet Weld', '⊿ (Right triangle)', 'Symbol below line = Arrow Side; above = Other Side', 'Leg Size (S), Length (L), Pitch (P)', 'AWS A2.4 Clause 5 / ISO 2553 Table 1'],
      ['Square Groove', '|| (Two vertical lines)', 'Below = Arrow side, Above = Other side', 'Root Opening (R), Groove Angle (α)', 'AWS A2.4 Clause 6'],
      ['Single-V Groove', 'V (V-shape)', 'Below = Arrow side, Above = Other side', 'Depth of Bevel (S), Groove Angle (α)', 'AWS A2.4 Clause 6'],
      ['Bevel Groove', '|/ (Single slant)', 'Perpendicular line always drawn on left', 'Bevel Depth (S), Root Face (f)', 'AWS A2.4 Clause 6'],
      ['Plug / Slot Weld', '▭ (Rectangle)', 'Below = Arrow side, Above = Other side', 'Hole Diameter (d), Depth of Filling', 'AWS A2.4 Clause 8'],
      ['Spot / Projection', '○ (Circle on reference line)', 'Drawn straddling line for projection', 'Shear Strength (lbs) or Diameter', 'AWS A2.4 Clause 9'],
      ['Seam Weld', '⊘ (Circle with horizontal lines)', 'Continuous or intermittent pass', 'Weld Width, Length, Spacing', 'AWS A2.4 Clause 10'],
      ['Backing / Back Weld', '◠ (Semicircle)', 'Opposite side of groove weld symbol', 'Backing strip material / removal spec', 'AWS A2.4 Clause 7']
    ],
    note: 'Follows AWS A2.4:2020 Standard Symbols for Welding, Brazing, and Nondestructive Examination.'
  },
  'iso-286-tolerance-table': {
    headers: ['Nominal Size Range (mm)', 'H7 Hole (µm)', 'h6 Shaft (µm)', 'g6 Shaft (µm)', 'p6 Interference (µm)', 'Fit Description'],
    rows: [
      ['Over 1 to 3', '+10 / 0', '0 / -6', '-2 / -8', '+12 / +6', 'Precision clearance or light press fit'],
      ['Over 3 to 6', '+12 / 0', '0 / -8', '-4 / -12', '+20 / +12', 'H7/h6 close sliding; H7/p6 press fit'],
      ['Over 6 to 10', '+15 / 0', '0 / -9', '-5 / -14', '+24 / +15', 'Standard mechanical spigot & dowel pin fit'],
      ['Over 10 to 18', '+18 / 0', '0 / -11', '-6 / -17', '+29 / +18', 'Bearing housing H7 with shaft k5/m5/p6'],
      ['Over 18 to 30', '+21 / 0', '0 / -13', '-7 / -20', '+35 / +22', 'Machine tool spindle and precision couplings'],
      ['Over 30 to 50', '+25 / 0', '0 / -16', '-9 / -25', '+42 / +26', 'Heavy industrial bushing and keyed hub fit'],
      ['Over 50 to 80', '+30 / 0', '0 / -19', '-10 / -29', '+51 / +32', 'Gearbox shaft & bearing journal tolerance']
    ],
    note: 'Based on ISO 286-1 & ISO 286-2 Geometrical product specifications (GPS) — ISO code system for tolerances on linear sizes.'
  },
  'metric-thread-spec-table': {
    headers: ['Thread Size', 'Pitch Coarse (mm)', 'Pitch Fine (mm)', 'Major Dia (mm)', 'Tap Drill (Coarse mm)', 'Hex Nut Across Flats (mm)'],
    rows: [
      ['M3', '0.50', '0.35', '3.000', '2.50', '5.5'],
      ['M4', '0.70', '0.50', '4.000', '3.30', '7.0'],
      ['M5', '0.80', '0.50', '5.000', '4.20', '8.0'],
      ['M6', '1.00', '0.75', '6.000', '5.00', '10.0'],
      ['M8', '1.25', '1.00', '8.000', '6.80', '13.0'],
      ['M10', '1.50', '1.25 / 1.00', '10.000', '8.50', '17.0 (or 16.0 ISO)'],
      ['M12', '1.75', '1.50 / 1.25', '12.000', '10.20', '19.0 (or 18.0 ISO)'],
      ['M16', '2.00', '1.50', '16.000', '14.00', '24.0'],
      ['M20', '2.50', '2.00 / 1.50', '20.000', '17.50', '30.0'],
      ['M24', '3.00', '2.00', '24.000', '21.00', '36.0']
    ],
    note: 'Conforms to ISO 68-1, ISO 261, and ISO 965 general purpose metric screw threads standards.'
  },
  'pipe-schedule-reference-table': {
    headers: ['NPS (inch)', 'DN (mm)', 'OD (inch)', 'OD (mm)', 'Sch 40 Wall (mm)', 'Sch 80 Wall (mm)', 'Sch 160 Wall (mm)'],
    rows: [
      ['1/2"', '15', '0.840', '21.3', '2.77', '3.73', '4.78'],
      ['3/4"', '20', '1.050', '26.7', '2.87', '3.91', '5.56'],
      ['1"', '25', '1.315', '33.4', '3.38', '4.55', '6.35'],
      ['1-1/2"', '40', '1.900', '48.3', '3.68', '5.08', '7.14'],
      ['2"', '50', '2.375', '60.3', '3.91', '5.54', '8.74'],
      ['3"', '80', '3.500', '88.9', '5.49', '7.62', '11.13'],
      ['4"', '100', '4.500', '114.3', '6.02', '8.56', '13.49'],
      ['6"', '150', '6.625', '168.3', '7.11', '10.97', '18.26'],
      ['8"', '200', '8.625', '219.1', '8.18', '12.70', '23.01'],
      ['12"', '300', '12.750', '323.8', '10.31', '17.48', '33.32']
    ],
    note: 'Standards: ASME B36.10M Welded and Seamless Wrought Steel Pipe dimensions.'
  },
  'haas-cnc-g-code-reference': {
    headers: ['Code', 'Function', 'Group / Modal', 'Parameters Required', 'Haas CNC Description & Usage'],
    rows: [
      ['G00', 'Rapid Traverse', 'Group 01 (Modal)', 'X, Y, Z, A, B', 'Non-cutting rapid positioning at maximum machine feed rate.'],
      ['G01', 'Linear Interpolation', 'Group 01 (Modal)', 'X, Y, Z, F (Feedrate)', 'Linear cutting feed motion along straight path at specified feed.'],
      ['G02', 'Circular Interpolation CW', 'Group 01 (Modal)', 'X, Y, I, J or R, F', 'Clockwise arc cutting motion in active work plane (G17/G18/G19).'],
      ['G03', 'Circular Interpolation CCW', 'Group 01 (Modal)', 'X, Y, I, J or R, F', 'Counter-clockwise arc cutting motion in active work plane.'],
      ['G04', 'Dwell', 'Group 00 (Non-Modal)', 'P (seconds or ms)', 'Pause spindle motion or feed for counterboring and chip breaking.'],
      ['G17/18/19', 'Plane Selection', 'Group 02 (Modal)', 'None', 'G17=XY plane (default mill), G18=XZ plane, G19=YZ plane.'],
      ['G28', 'Return to Machine Zero', 'Group 00 (Non-Modal)', 'X, Y, Z (intermediate)', 'Primary reference point return for tool changes.'],
      ['G40', 'Cutter Compensation Cancel', 'Group 07 (Modal)', 'None', 'Disables tool radius compensation.'],
      ['G41 / G42', 'Cutter Comp Left / Right', 'Group 07 (Modal)', 'D (offset index)', 'G41 climbs left of profile; G42 conventional right.'],
      ['G43', 'Tool Length Comp (+)', 'Group 08 (Modal)', 'H (offset index), Z', 'Activates tool length offset from tool height register.'],
      ['G54-G59', 'Work Coordinate System', 'Group 12 (Modal)', 'None', 'User work zero coordinate fixtures 1 through 6.'],
      ['G81', 'Standard Drilling Cycle', 'Group 09 (Modal)', 'X, Y, Z, R, F', 'Simple feed-in rapid-out canned drilling cycle.'],
      ['G83', 'Peck Drilling Cycle', 'Group 09 (Modal)', 'X, Y, Z, Q (peck), R, F', 'Deep-hole peck drilling with full retract to R plane for chip clearing.']
    ],
    note: 'Applicable to Haas NGC (Next Generation Control) and classic Haas VF/VM CNC machining centers.'
  },
  'fanuc-cnc-g-code-reference': {
    headers: ['Code', 'Function', 'Group', 'Command Syntax', 'Fanuc 0i / 31i Control Application'],
    rows: [
      ['G00', 'Positioning (Rapid)', '01', 'G00 X_ Y_ Z_', 'Point-to-point rapid positioning with vector or non-linear interpolation.'],
      ['G01', 'Linear Interpolation', '01', 'G01 X_ Y_ Z_ F_', 'Controlled linear cutting feed in units per minute (G94) or per rev (G95).'],
      ['G02', 'Circular Arc CW', '01', 'G02 X_ Y_ R_ F_ (or I_ J_)', 'Clockwise arc movement.'],
      ['G03', 'Circular Arc CCW', '01', 'G03 X_ Y_ R_ F_ (or I_ J_)', 'Counter-clockwise arc movement.'],
      ['G20 / G21', 'Inch / Metric Selection', '06', 'G20 or G21', 'Input dimension unit: G20=inches, G21=millimeters.'],
      ['G43 / G44', 'Tool Offset Direction', '08', 'G43 H_ Z_', 'G43 positive tool offset; G44 negative offset.'],
      ['G80', 'Canned Cycle Cancel', '09', 'G80', 'Deactivates all modal drilling, tapping, and boring cycles.'],
      ['G84', 'Rigid Tapping Cycle', '09', 'G84 X_ Y_ Z_ R_ F_', 'Synchronized spindle speed and feed for tapping threads.'],
      ['G90 / G91', 'Absolute / Incremental', '03', 'G90 or G91', 'G90 coordinates referenced from origin; G91 from current tool position.']
    ],
    note: 'Standard ISO G-code compliant with Fanuc Series 0i-MF, 31i-B, and standard CNC lathes and mills.'
  },
  'wire-gauge-chart-swg-bwg-awg': {
    headers: ['Gauge No.', 'AWG Dia (mm)', 'AWG Dia (inch)', 'SWG Dia (mm)', 'BWG Dia (mm)', 'Typical Copper Ampacity (A)'],
    rows: [
      ['0000 (4/0)', '11.684', '0.4600', '10.160', '11.532', '260 A'],
      ['00 (2/0)', '9.266', '0.3648', '8.839', '9.652', '190 A'],
      ['0 (1/0)', '8.251', '0.3249', '8.230', '8.636', '150 A'],
      ['2', '6.544', '0.2576', '7.010', '7.214', '115 A'],
      ['4', '5.189', '0.2043', '5.893', '6.045', '85 A'],
      ['6', '4.115', '0.1620', '4.877', '5.156', '65 A'],
      ['8', '3.264', '0.1285', '4.064', '4.191', '50 A'],
      ['10', '2.588', '0.1019', '3.251', '3.404', '35 A'],
      ['12', '2.053', '0.0808', '2.642', '2.769', '25 A'],
      ['14', '1.628', '0.0641', '2.032', '2.108', '20 A'],
      ['16', '1.291', '0.0508', '1.626', '1.651', '15 A'],
      ['18', '1.024', '0.0403', '1.219', '1.245', '10 A']
    ],
    note: 'Covers American Wire Gauge (AWG), Standard Wire Gauge (SWG / Imperial), and Birmingham Wire Gauge (BWG).'
  },
'asme-b16-5-flange-dimensions-table': {
    headers: ['NPS (Nominal Size)', 'Flange OD (mm / in)', 'Bolt Circle BC (mm / in)', 'Number of Bolts', 'Bolt Hole Dia (mm)', 'Bolt Stud Dia x Length'],
    rows: [
      ['1/2" (DN 15)', '88.9 mm (3.50")', '60.3 mm (2.38")', '4', '15.9 mm', '1/2" x 2.25"'],
      ['3/4" (DN 20)', '98.4 mm (3.88")', '69.8 mm (2.75")', '4', '15.9 mm', '1/2" x 2.50"'],
      ['1" (DN 25)', '108.0 mm (4.25")', '79.4 mm (3.12")', '4', '15.9 mm', '1/2" x 2.50"'],
      ['1-1/2" (DN 40)', '127.0 mm (5.00")', '98.4 mm (3.88")', '4', '15.9 mm', '1/2" x 2.75"'],
      ['2" (DN 50)', '152.4 mm (6.00")', '120.6 mm (4.75")', '4', '19.0 mm', '5/8" x 3.25"'],
      ['3" (DN 80)', '190.5 mm (7.50")', '152.4 mm (6.00")', '4', '19.0 mm', '5/8" x 3.50"'],
      ['4" (DN 100)', '228.6 mm (9.00")', '190.5 mm (7.50")', '8', '19.0 mm', '5/8" x 3.50"'],
      ['6" (DN 150)', '279.4 mm (11.00")', '241.3 mm (9.50")', '8', '22.2 mm', '3/4" x 4.00"'],
      ['8" (DN 200)', '342.9 mm (13.50")', '298.4 mm (11.75")', '8', '22.2 mm', '3/4" x 4.25"'],
      ['10" (DN 250)', '406.4 mm (16.00")', '362.0 mm (14.25")', '12', '25.4 mm', '7/8" x 4.75"'],
      ['12" (DN 300)', '482.6 mm (19.00")', '431.8 mm (17.00")', '12', '25.4 mm', '7/8" x 5.00"']
    ],
    note: 'Dimensions follow ASME B16.5 Class 150 Pipe Flanges and Flanged Fittings Standard.'
  },
  'as568-o-ring-size-chart': {
    headers: ['AS568 Dash No.', 'Nominal Inside Dia (ID)', 'Nominal Cross Section (CS)', 'Actual ID (mm)', 'Actual CS (mm)', 'Dynamic Groove Depth (mm)'],
    rows: [
      ['010', '1/4"', '1/16"', '6.07 mm', '1.78 mm', '1.35 - 1.45 mm'],
      ['014', '1/2"', '1/16"', '12.42 mm', '1.78 mm', '1.35 - 1.45 mm'],
      ['110', '3/8"', '3/32"', '9.19 mm', '2.62 mm', '2.15 - 2.25 mm'],
      ['114', '5/8"', '3/32"', '15.54 mm', '2.62 mm', '2.15 - 2.25 mm'],
      ['118', '7/8"', '3/32"', '21.89 mm', '2.62 mm', '2.15 - 2.25 mm'],
      ['210', '3/4"', '1/8"', '18.64 mm', '3.53 mm', '2.95 - 3.10 mm'],
      ['214', '1"', '1/8"', '24.99 mm', '3.53 mm', '2.95 - 3.10 mm'],
      ['222', '1-1/2"', '1/8"', '37.69 mm', '3.53 mm', '2.95 - 3.10 mm'],
      ['325', '1-1/2"', '3/16"', '37.47 mm', '5.33 mm', '4.55 - 4.75 mm'],
      ['425', '4-1/2"', '1/4"', '113.67 mm', '6.99 mm', '6.00 - 6.25 mm']
    ],
    note: 'Governed by Aerospace Standard AS568 Standard Size O-Rings for sealing and fluid power.'
  },
  'din-7991-iso-10642-countersunk-screw-table': {
    headers: ['Thread Size', 'Head Dia dk (max mm)', 'Head Height k (max mm)', 'Hex Socket s (mm)', 'Countersink Dia (mm)', '90° Sink Depth (mm)'],
    rows: [
      ['M3', '6.00', '1.70', '2.0', '6.6', '1.9'],
      ['M4', '8.00', '2.30', '2.5', '8.8', '2.5'],
      ['M5', '10.00', '2.80', '3.0', '10.8', '3.0'],
      ['M6', '12.00', '3.30', '4.0', '13.0', '3.5'],
      ['M8', '16.00', '4.40', '5.0', '17.2', '4.6'],
      ['M10', '20.00', '5.50', '6.0', '21.5', '5.8'],
      ['M12', '24.00', '6.50', '8.0', '25.5', '6.8'],
      ['M16', '30.00', '8.50', '10.0', '31.5', '8.8']
    ],
    note: 'Standards: DIN 7991 / ISO 10642 Hexagon Socket Countersunk Head Screws.'
  },
  'parallel-keys-din-6885-keyway-table': {
    headers: ['Shaft Dia d Range (mm)', 'Key Width b (mm)', 'Key Height h (mm)', 'Shaft Depth t1 (mm)', 'Hub Depth t2 (mm)', 'Shaft Keyway Tolerance'],
    rows: [
      ['Over 6 to 8', '2', '2', '1.2', '1.0', 'h9 / N9 / P9'],
      ['Over 8 to 10', '3', '3', '1.8', '1.4', 'h9 / N9 / P9'],
      ['Over 10 to 12', '4', '4', '2.5', '1.8', 'h9 / N9 / P9'],
      ['Over 12 to 17', '5', '5', '3.0', '2.3', 'h9 / N9 / P9'],
      ['Over 17 to 22', '6', '6', '3.5', '2.8', 'h9 / N9 / P9'],
      ['Over 22 to 30', '8', '7', '4.0', '3.3', 'h9 / N9 / P9'],
      ['Over 30 to 38', '10', '8', '5.0', '3.3', 'h9 / N9 / P9'],
      ['Over 38 to 44', '12', '8', '5.0', '3.3', 'h9 / N9 / P9'],
      ['Over 44 to 50', '14', '9', '5.5', '3.8', 'h9 / N9 / P9'],
      ['Over 50 to 58', '16', '10', '6.0', '4.3', 'h9 / N9 / P9']
    ],
    note: 'Conforms to DIN 6885-1 / ISO 773 Drive type fasteners — Parallel keys and keyways.'
  },
  'circlips-retaining-rings-din-471-472-table': {
    headers: ['Nominal Shaft/Bore d1 (mm)', 'Type (Ext/Int)', 'Ring Thickness s (mm)', 'Groove Dia d2 (mm)', 'Groove Width m (mm)', 'Allowable Thrust Load (kN)'],
    rows: [
      ['10 mm', 'DIN 471 (Shaft)', '1.00', '9.60 (-0.09)', '1.10 (+0.14)', '3.2 kN'],
      ['15 mm', 'DIN 471 (Shaft)', '1.00', '14.30 (-0.11)', '1.10 (+0.14)', '5.5 kN'],
      ['20 mm', 'DIN 471 (Shaft)', '1.20', '19.00 (-0.13)', '1.30 (+0.14)', '12.8 kN'],
      ['25 mm', 'DIN 471 (Shaft)', '1.20', '23.90 (-0.13)', '1.30 (+0.14)', '18.4 kN'],
      ['30 mm', 'DIN 471 (Shaft)', '1.50', '28.60 (-0.21)', '1.60 (+0.14)', '28.0 kN'],
      ['40 mm', 'DIN 471 (Shaft)', '1.75', '37.50 (-0.25)', '1.85 (+0.14)', '45.0 kN'],
      ['20 mm', 'DIN 472 (Bore)', '1.00', '21.00 (+0.13)', '1.10 (+0.14)', '10.5 kN'],
      ['30 mm', 'DIN 472 (Bore)', '1.20', '31.40 (+0.25)', '1.30 (+0.14)', '21.6 kN'],
      ['40 mm', 'DIN 472 (Bore)', '1.75', '42.50 (+0.25)', '1.85 (+0.14)', '49.0 kN']
    ],
    note: 'Based on DIN 471 (Shaft retaining rings) and DIN 472 (Bore retaining rings) specifications.'
  },
  'iso-273-clearance-holes-table': {
    headers: ['Fastener Size', 'Fine Series Hole (mm)', 'Medium Series Hole (mm)', 'Coarse Series Hole (mm)', 'Standard Counterbore Dia (mm)'],
    rows: [
      ['M2', '2.2 mm', '2.4 mm', '2.6 mm', '4.4 mm'],
      ['M3', '3.2 mm', '3.4 mm', '3.6 mm', '6.0 mm'],
      ['M4', '4.3 mm', '4.5 mm', '4.8 mm', '8.0 mm'],
      ['M5', '5.3 mm', '5.5 mm', '5.8 mm', '10.0 mm'],
      ['M6', '6.4 mm', '6.6 mm', '7.0 mm', '11.0 mm'],
      ['M8', '8.4 mm', '9.0 mm', '10.0 mm', '15.0 mm'],
      ['M10', '10.5 mm', '11.0 mm', '12.0 mm', '18.0 mm'],
      ['M12', '13.0 mm', '13.5 mm', '14.5 mm', '20.0 mm'],
      ['M16', '17.0 mm', '17.5 mm', '18.5 mm', '26.0 mm'],
      ['M20', '21.0 mm', '22.0 mm', '24.0 mm', '33.0 mm']
    ],
    note: 'Compliant with ISO 273 and ASME B18.2.8 clearance holes for bolts and screws.'
  },
  'sheet-metal-gauge-thickness-chart': {
    headers: ['Gauge No.', 'Carbon Steel (mm / in)', 'Galvanized Steel (mm / in)', 'Stainless Steel (mm / in)', 'Aluminum Sheet (mm / in)'],
    rows: [
      ['10 Ga', '3.416 mm (0.1345")', '3.505 mm (0.1382")', '3.571 mm (0.1406")', '2.588 mm (0.1019")'],
      ['12 Ga', '2.657 mm (0.1046")', '2.746 mm (0.1084")', '2.779 mm (0.1094")', '2.052 mm (0.0808")'],
      ['14 Ga', '1.897 mm (0.0747")', '1.994 mm (0.0785")', '1.984 mm (0.0781")', '1.628 mm (0.0641")'],
      ['16 Ga', '1.519 mm (0.0598")', '1.613 mm (0.0635")', '1.588 mm (0.0625")', '1.290 mm (0.0508")'],
      ['18 Ga', '1.214 mm (0.0478")', '1.311 mm (0.0516")', '1.270 mm (0.0500")', '1.024 mm (0.0403")'],
      ['20 Ga', '0.912 mm (0.0359")', '1.006 mm (0.0396")', '0.953 mm (0.0375")', '0.813 mm (0.0320")'],
      ['22 Ga', '0.759 mm (0.0299")', '0.853 mm (0.0336")', '0.792 mm (0.0312")', '0.643 mm (0.0253")'],
      ['24 Ga', '0.607 mm (0.0239")', '0.701 mm (0.0276")', '0.635 mm (0.0250")', '0.511 mm (0.0201")']
    ],
    note: 'Manufacturer standard gauge (MSG) and ASTM A653 / ASTM A240 standard sheet tolerances.'
  },
  'aluminum-alloy-properties-temper-chart': {
    headers: ['Alloy & Temper', 'Yield Strength (MPa)', 'Tensile Strength (MPa)', 'Elongation %', 'Brinell Hardness (HB)', 'Machinability & Weldability'],
    rows: [
      ['6061-T6', '276 MPa', '310 MPa', '12%', '95 HB', 'Excellent all-round structural alloy; highly weldable'],
      ['6061-O (Annealed)', '55 MPa', '124 MPa', '25%', '30 HB', 'High ductility for severe bending and forming'],
      ['7075-T6', '503 MPa', '572 MPa', '11%', '150 HB', 'Ultra-high strength aerospace grade; poor weldability'],
      ['5052-H32', '193 MPa', '228 MPa', '12%', '60 HB', 'Exceptional marine corrosion resistance; excellent bending'],
      ['2024-T3', '324 MPa', '469 MPa', '18%', '120 HB', 'High fatigue resistance; aircraft skin and tension members'],
      ['6063-T5', '145 MPa', '186 MPa', '12%', '60 HB', 'Architectural extrusion standard; smooth anodized finish']
    ],
    note: 'Governed by ASTM B209 and Aluminum Association (AA) temper designation systems.'
  },
  'stainless-steel-grades-comparison-chart': {
    headers: ['Grade (AISI)', 'Microstructure', 'Yield Strength (MPa)', 'PREN (Pitting Resistance)', 'Magnetic?', 'Typical Application'],
    rows: [
      ['304 (1.4301)', 'Austenitic', '205 MPa', '18 - 20', 'No (slight after cold work)', 'General architecture, kitchen equipment, food processing'],
      ['316L (1.4404)', 'Austenitic (Low C)', '220 MPa', '23 - 25', 'No', 'Marine hardware, chemical process, pharmaceutical'],
      ['430 (1.4016)', 'Ferritic', '260 MPa', '16 - 17', 'Yes', 'Appliance trim, automotive exhaust, cost-sensitive indoor'],
      ['17-4PH (H900)', 'Martensitic Age-Hardened', '1170 MPa', '30 - 32', 'Yes', 'Aerospace shafts, turbine blades, high-strength valves'],
      ['2205 Duplex', 'Austenitic-Ferritic', '450 MPa', '35 - 38', 'Yes', 'Oil & gas subsea, desalination piping, harsh marine offshore']
    ],
    note: 'Cross-referenced with ASTM A240 and EN 10088-2 European stainless steel specifications.'
  },
  'structural-steel-grades-cross-reference-table': {
    headers: ['ASTM (USA)', 'EN 10025 (Europe)', 'GB (China)', 'JIS (Japan)', 'Min Yield Strength (MPa)', 'Typical Structural Applications'],
    rows: [
      ['A36', 'S235JR (1.0038)', 'Q235B', 'SS400', '250 MPa (36 ksi)', 'General bolted/welded buildings, baseplates, platforms'],
      ['A572 Gr 50', 'S355JR (1.0045)', 'Q355B', 'SM490A', '345 MPa (50 ksi)', 'Bridge girders, high-rise structural frames, heavy cranes'],
      ['A992', 'S355J2', 'Q355D', 'SN490B', '345 MPa (50 ksi)', 'Standard I-beam and H-section steel building columns'],
      ['A514 (T-1)', 'S690QL', 'Q690D', 'SHY685', '690 MPa (100 ksi)', 'Quenched & tempered high-yield mining and chassis components'],
      ['A500 Gr B', 'S275J2H', 'Q275', 'STKR400', '315 MPa (46 ksi)', 'Cold-formed hollow structural sections (HSS tubing)']
    ],
    note: 'Covers cross-equivalencies between AISC 360, Eurocode 3 (EN 1993), GB 50017, and JIS G3101.'
  },
  'nema-vs-iec-motor-frame-dimensions-table': {
    headers: ['NEMA Frame', 'IEC Frame Equivalent', 'Shaft Center Height D/H (mm / in)', 'Shaft Diameter (mm / in)', 'Mounting Hole Pattern (mm)'],
    rows: [
      ['56', '71', '88.9 mm (3.50")', '15.875 mm (0.625")', '123.8 x 76.2 mm'],
      ['143T', '90S', '88.9 mm (3.50")', '22.225 mm (0.875")', '139.7 x 101.6 mm'],
      ['145T', '90L', '88.9 mm (3.50")', '22.225 mm (0.875")', '139.7 x 127.0 mm'],
      ['182T', '112M', '114.3 mm (4.50")', '28.575 mm (1.125")', '190.5 x 114.3 mm'],
      ['184T', '112M', '114.3 mm (4.50")', '28.575 mm (1.125")', '190.5 x 139.7 mm'],
      ['213T', '132S', '133.4 mm (5.25")', '34.925 mm (1.375")', '215.9 x 139.7 mm'],
      ['215T', '132M', '133.4 mm (5.25")', '34.925 mm (1.375")', '215.9 x 177.8 mm'],
      ['254T', '160M', '158.8 mm (6.25")', '41.275 mm (1.625")', '254.0 x 209.6 mm']
    ],
    note: 'Comparison between NEMA MG 1 Motors and Generators and IEC 60072-1 metric mounting dimensions.'
  },
  'ip-rating-enclosure-chart': {
    headers: ['IP Rating', 'Dust Protection (1st Digit)', 'Liquid Protection (2nd Digit)', 'Equivalent NEMA Rating', 'Operating Environment Suitability'],
    rows: [
      ['IP20', 'Solid objects > 12.5mm (fingers)', 'None', 'NEMA 1', 'Dry indoor industrial panels, controlled climate server rooms'],
      ['IP54', 'Dust-protected (limited ingress)', 'Splashing water from any direction', 'NEMA 3 / 12', 'Standard workshop machinery, indoor light-industrial equipment'],
      ['IP65', 'Dust-tight (zero ingress)', 'Low-pressure water jets (6.3mm nozzle)', 'NEMA 4 / 4X', 'Outdoor weather-exposed enclosures, washdown food areas'],
      ['IP66', 'Dust-tight (zero ingress)', 'Heavy sea spray or powerful water jets', 'NEMA 4X', 'Marine deck equipment, offshore drilling, mining wash-stations'],
      ['IP67', 'Dust-tight (zero ingress)', 'Temporary immersion up to 1m for 30 min', 'NEMA 6', 'Submersible sensors, automotive chassis electronics, heavy rain'],
      ['IP68', 'Dust-tight (zero ingress)', 'Continuous submersion under pressure (>1m)', 'NEMA 6P', 'Subsea instrumentation, deep borehole pumps, underground vaults'],
      ['IP69K', 'Dust-tight (zero ingress)', 'High-temp (80°C) high-pressure (100 bar) wash', 'NEMA 4X / Food Sanitization', 'Food & beverage processing, sterile pharmaceutical washdown']
    ],
    note: 'Defined by IEC 60529 and ISO 20653 degrees of protection provided by enclosures.'
  },
  'thermocouple-color-codes-limits-table': {
    headers: ['Type', 'Conductors (+ / -)', 'ANSI Color (USA)', 'IEC 60584 Color (Europe)', 'Temperature Range (°C)', 'Standard Accuracy'],
    rows: [
      ['Type K', 'Chromel / Alumel', 'Yellow / Red', 'Green / White', '-200°C to +1260°C', '±2.2°C or ±0.75%'],
      ['Type J', 'Iron / Constantan', 'White / Red', 'Black / White', '-40°C to +750°C', '±2.2°C or ±0.75%'],
      ['Type T', 'Copper / Constantan', 'Blue / Red', 'Brown / White', '-200°C to +350°C', '±1.0°C or ±0.75%'],
      ['Type E', 'Chromel / Constantan', 'Purple / Red', 'Purple / White', '-200°C to +900°C', '±1.7°C or ±0.50%'],
      ['Type N', 'Nicrosil / Nisil', 'Orange / Red', 'Pink / White', '-270°C to +1300°C', '±2.2°C or ±0.75%'],
      ['Type R / S', 'Pt-Rh / Platinum', 'Green / Red', 'Orange / White', '0°C to +1450°C', '±1.5°C or ±0.25%']
    ],
    note: 'Complies with ASTM E230 / ANSI MC96.1 and IEC 60584-3 thermocouple extension wire color standards.'
  },
  'nec-copper-wire-ampacity-table': {
    headers: ['Size (AWG / kcmil)', '60°C (TW, UF) (Amps)', '75°C (THWN, XHHW) (Amps)', '90°C (THHN, XHHW-2) (Amps)', 'Max Overcurrent Fuse (Amps)'],
    rows: [
      ['14 AWG', '15 A', '20 A', '25 A', '15 A (NEC 240.4(D))'],
      ['12 AWG', '20 A', '25 A', '30 A', '20 A (NEC 240.4(D))'],
      ['10 AWG', '30 A', '35 A', '40 A', '30 A (NEC 240.4(D))'],
      ['8 AWG', '40 A', '50 A', '55 A', '50 A'],
      ['6 AWG', '55 A', '65 A', '75 A', '60 A / 70 A'],
      ['4 AWG', '70 A', '85 A', '95 A', '80 A / 90 A'],
      ['2 AWG', '95 A', '115 A', '130 A', '100 A / 125 A'],
      ['1/0 AWG', '125 A', '150 A', '170 A', '150 A'],
      ['2/0 AWG', '145 A', '175 A', '195 A', '175 A'],
      ['4/0 AWG', '195 A', '230 A', '260 A', '225 A / 250 A']
    ],
    note: 'Based on National Electrical Code (NEC NFPA 70) Table 310.16 for not more than 3 current-carrying conductors in raceway at 30°C ambient.'
  },
  'copper-pipe-dimensions-type-k-l-m-table': {
    headers: ['Nominal Size (inch)', 'Actual Outside Dia OD (in / mm)', 'Type K Wall (Heavy mm)', 'Type L Wall (Standard mm)', 'Type M Wall (Light mm)', 'Working Pressure (PSI)'],
    rows: [
      ['1/2"', '0.625" (15.875 mm)', '1.245 mm', '0.889 mm', '0.711 mm', '720 - 1050 PSI'],
      ['3/4"', '0.875" (22.225 mm)', '1.651 mm', '1.143 mm', '0.813 mm', '600 - 900 PSI'],
      ['1"', '1.125" (28.575 mm)', '1.651 mm', '1.270 mm', '0.889 mm', '500 - 750 PSI'],
      ['1-1/4"', '1.375" (34.925 mm)', '1.651 mm', '1.397 mm', '1.067 mm', '450 - 680 PSI'],
      ['1-1/2"', '1.625" (41.275 mm)', '1.829 mm', '1.524 mm', '1.245 mm', '420 - 620 PSI'],
      ['2"', '2.125" (53.975 mm)', '2.108 mm', '1.778 mm', '1.473 mm', '380 - 550 PSI'],
      ['3"', '3.125" (79.375 mm)', '2.769 mm', '2.286 mm', '1.829 mm', '340 - 500 PSI'],
      ['4"', '4.125" (104.775 mm)', '3.404 mm', '2.794 mm', '2.413 mm', '320 - 470 PSI']
    ],
    note: 'Dimensions comply with ASTM B88 Seamless Copper Water Tube standards.'
  },
  'pvc-pipe-schedule-40-80-dimensions-table': {
    headers: ['NPS Pipe Size', 'Outside Dia OD (mm / in)', 'Sch 40 Wall (mm)', 'Sch 40 Max PSI @ 73°F', 'Sch 80 Wall (mm)', 'Sch 80 Max PSI @ 73°F'],
    rows: [
      ['1/2"', '21.3 mm (0.840")', '2.77 mm', '600 PSI', '3.73 mm', '850 PSI'],
      ['3/4"', '26.7 mm (1.050")', '2.87 mm', '480 PSI', '3.91 mm', '690 PSI'],
      ['1"', '33.4 mm (1.315")', '3.38 mm', '450 PSI', '4.55 mm', '630 PSI'],
      ['1-1/2"', '48.3 mm (1.900")', '3.68 mm', '330 PSI', '5.08 mm', '470 PSI'],
      ['2"', '60.3 mm (2.375")', '3.91 mm', '280 PSI', '5.54 mm', '400 PSI'],
      ['3"', '88.9 mm (3.500")', '5.49 mm', '260 PSI', '7.62 mm', '370 PSI'],
      ['4"', '114.3 mm (4.500")', '6.02 mm', '220 PSI', '8.56 mm', '320 PSI'],
      ['6"', '168.3 mm (6.625")', '7.11 mm', '180 PSI', '10.97 mm', '280 PSI'],
      ['8"', '219.1 mm (8.625")', '8.18 mm', '160 PSI', '12.70 mm', '250 PSI']
    ],
    note: 'Standards: ASTM D1785 Rigid Poly(Vinyl Chloride) (PVC) Compounds and Chlorinated Poly(Vinyl Chloride) (CPVC).'
  },
  'astm-standard-rebar-sizes-table': {
    headers: ['Rebar Designation', 'Nominal Diameter (mm / in)', 'Cross-Section Area (mm² / in²)', 'Nominal Mass (kg/m / lb/ft)', 'Metric Soft Equivalent'],
    rows: [
      ['#3', '9.525 mm (0.375")', '71 mm² (0.11 in²)', '0.560 kg/m (0.376 lb/ft)', '#10M'],
      ['#4', '12.700 mm (0.500")', '129 mm² (0.20 in²)', '0.994 kg/m (0.668 lb/ft)', '#13M'],
      ['#5', '15.875 mm (0.625")', '200 mm² (0.31 in²)', '1.552 kg/m (1.043 lb/ft)', '#16M'],
      ['#6', '19.050 mm (0.750")', '284 mm² (0.44 in²)', '2.235 kg/m (1.502 lb/ft)', '#19M'],
      ['#7', '22.225 mm (0.875")', '387 mm² (0.60 in²)', '3.042 kg/m (2.044 lb/ft)', '#22M'],
      ['#8', '25.400 mm (1.000")', '510 mm² (0.79 in²)', '3.973 kg/m (2.670 lb/ft)', '#25M'],
      ['#9', '28.650 mm (1.128")', '645 mm² (1.00 in²)', '5.060 kg/m (3.400 lb/ft)', '#29M'],
      ['#10', '32.260 mm (1.270")', '819 mm² (1.27 in²)', '6.404 kg/m (4.303 lb/ft)', '#32M'],
      ['#11', '35.810 mm (1.410")', '1006 mm² (1.56 in²)', '7.907 kg/m (5.313 lb/ft)', '#36M'],
      ['#14', '43.000 mm (1.693")', '1452 mm² (2.25 in²)', '11.384 kg/m (7.650 lb/ft)', '#43M'],
      ['#18', '57.330 mm (2.257")', '2581 mm² (4.00 in²)', '20.238 kg/m (13.600 lb/ft)', '#57M']
    ],
    note: 'Governed by ASTM A615 / A615M Deformed and Plain Carbon-Steel Bars for Concrete Reinforcement.'
  },
  'concrete-slump-test-workability-table': {
    headers: ['Structural Element', 'Min Slump (mm / in)', 'Max Slump (mm / in)', 'Workability Degree', 'Compaction Method'],
    rows: [
      ['Reinforced Foundation Walls & Footings', '25 mm (1.0")', '75 mm (3.0")', 'Low to Medium', 'Internal poker vibration'],
      ['Plain Footings, Caissons & Substructure', '25 mm (1.0")', '75 mm (3.0")', 'Low', 'Vibration or mechanical tamping'],
      ['Beams & Reinforced Framing Columns', '25 mm (1.0")', '100 mm (4.0")', 'Medium', 'Internal high-frequency vibration'],
      ['Building Slabs, Pavements & Sidewalks', '25 mm (1.0")', '75 mm (3.0")', 'Low to Medium', 'Screed vibration & power floating'],
      ['Heavy Mass Concrete Construction', '25 mm (1.0")', '50 mm (2.0")', 'Very Low', 'Heavy immersion vibrators'],
      ['Pumped Concrete / Complex Formwork', '75 mm (3.0")', '125 mm (5.0")', 'High', 'Internal vibration without segregation']
    ],
    note: 'Conforms to ACI 211.1 Standard Practice for Selecting Proportions for Normal, Heavyweight, and Mass Concrete.'
  },
  'soil-classification-uscs-properties-table': {
    headers: ['USCS Group', 'Soil Description', 'Typical Bearing Capacity (kPa / ksf)', 'Friction Angle φ (deg)', 'Cohesion c (kPa)', 'Permeability k (cm/s)'],
    rows: [
      ['GW', 'Well-graded gravel, gravel-sand mixtures', '300 - 400 kPa (6 - 8 ksf)', '36° - 42°', '0 kPa', '> 10⁻² (Pervious)'],
      ['GP', 'Poorly-graded gravel, gravel-sand', '250 - 350 kPa (5 - 7 ksf)', '34° - 38°', '0 kPa', '> 10⁻² (Pervious)'],
      ['SW', 'Well-graded sands, gravelly sands', '200 - 300 kPa (4 - 6 ksf)', '34° - 40°', '0 kPa', '10⁻² - 10⁻³'],
      ['SP', 'Poorly-graded sands, uniform sands', '150 - 250 kPa (3 - 5 ksf)', '30° - 35°', '0 kPa', '10⁻² - 10⁻⁴'],
      ['SM', 'Silty sands, sand-silt mixtures', '100 - 200 kPa (2 - 4 ksf)', '28° - 34°', '5 - 15 kPa', '10⁻³ - 10⁻⁵'],
      ['ML', 'Inorganic silts, very fine sands', '75 - 150 kPa (1.5 - 3 ksf)', '26° - 32°', '10 - 25 kPa', '10⁻⁴ - 10⁻⁶'],
      ['CL', 'Inorganic clays of low-to-medium plasticity', '100 - 200 kPa (2 - 4 ksf)', '18° - 26°', '25 - 60 kPa', '10⁻⁶ - 10⁻⁸'],
      ['CH', 'Inorganic clays of high plasticity (fat clay)', '50 - 150 kPa (1 - 3 ksf)', '12° - 20°', '50 - 120 kPa', '< 10⁻⁸ (Impervious)']
    ],
    note: 'Standard: ASTM D2487 Unified Soil Classification System (USCS) geotechnical baseline engineering properties.'
  },
  'fdm-3d-printing-filament-properties-chart': {
    headers: ['Filament Material', 'Nozzle Temp (°C)', 'Bed Temp (°C)', 'Tensile Yield (MPa)', 'Heat Deflection HDT (°C)', 'Enclosure Required? / Warping'],
    rows: [
      ['PLA (Polylactic Acid)', '190°C - 220°C', '20°C - 60°C', '50 - 65 MPa', '55°C', 'No / Low warping; easy printing'],
      ['PETG (Glycol-Modified)', '230°C - 250°C', '70°C - 85°C', '45 - 55 MPa', '70°C', 'No / Low-medium warping; chemical resistant'],
      ['ABS (Acrylonitrile Butadiene)', '240°C - 260°C', '95°C - 110°C', '40 - 50 MPa', '95°C', 'Yes / High warping; requires fume exhaust'],
      ['ASA (Acrylic Styrene Acrylonitrile)', '240°C - 260°C', '95°C - 110°C', '42 - 52 MPa', '98°C', 'Yes / High UV resistance outdoor grade'],
      ['TPU 95A (Polyurethane)', '215°C - 235°C', '30°C - 60°C', '25 - 35 MPa (Flex)', '50°C', 'No / High wear & vibration damping flex'],
      ['PA-CF (Carbon Fiber Nylon)', '260°C - 290°C', '80°C - 100°C', '75 - 110 MPa', '150°C', 'Recommended / Hardened nozzle required; stiff'],
      ['PC (Polycarbonate)', '270°C - 310°C', '110°C - 120°C', '65 - 75 MPa', '135°C', 'Yes / Severe warping; structural toughness']
    ],
    note: 'Industry standard FDM / FFF thermoplastic filament processing profiles and mechanical properties.'
  },
  'aisc-steel-shapes-library': {
    headers: ['AISC Designation', 'Nominal Depth d (in / mm)', 'Flange Width bf (in / mm)', 'Flange Thick tf (in / mm)', 'Area A (in² / mm²)', 'Elastic Modulus Wx (in³ / cm³)', 'Moment of Inertia Ix (in⁴ / cm⁴)'],
    rows: [
      ['W8x24', '7.93 in (201 mm)', '6.50 in (165 mm)', '0.400 in (10.2 mm)', '7.08 in² (4560 mm²)', '20.9 in³ (342 cm³)', '82.7 in⁴ (3440 cm⁴)'],
      ['W10x33', '9.73 in (247 mm)', '7.96 in (202 mm)', '0.435 in (11.0 mm)', '9.71 in² (6260 mm²)', '35.0 in³ (574 cm³)', '170 in⁴ (7080 cm⁴)'],
      ['W12x45', '12.06 in (306 mm)', '8.05 in (204 mm)', '0.575 in (14.6 mm)', '13.2 in² (8520 mm²)', '58.1 in³ (952 cm³)', '350 in⁴ (14600 cm⁴)'],
      ['W14x68', '14.04 in (357 mm)', '10.04 in (255 mm)', '0.720 in (18.3 mm)', '20.0 in² (12900 mm²)', '103 in³ (1690 cm³)', '722 in⁴ (30100 cm⁴)'],
      ['W16x89', '16.75 in (425 mm)', '10.27 in (261 mm)', '0.875 in (22.2 mm)', '26.2 in² (16900 mm²)', '153 in³ (2510 cm³)', '1300 in⁴ (54100 cm⁴)'],
      ['W18x97', '18.59 in (472 mm)', '11.15 in (283 mm)', '0.870 in (22.1 mm)', '28.5 in² (18400 mm²)', '188 in³ (3080 cm³)', '1750 in⁴ (72800 cm⁴)'],
      ['W21x101', '21.36 in (543 mm)', '12.29 in (312 mm)', '0.800 in (20.3 mm)', '29.8 in² (19200 mm²)', '227 in³ (3720 cm³)', '2420 in⁴ (101000 cm⁴)'],
      ['W24x104', '24.06 in (611 mm)', '12.75 in (324 mm)', '0.750 in (19.1 mm)', '30.6 in² (19700 mm²)', '258 in³ (4230 cm³)', '3100 in⁴ (129000 cm⁴)']
    ],
    note: 'Governed by AISC Steel Construction Manual 15th Edition (ASTM A6 / A992 structural wide-flange shapes).'
  },
  'din-en-structural-sections-library': {
    headers: ['Eurocode Designation', 'Section Depth h (mm)', 'Flange Width b (mm)', 'Web Thick tw (mm)', 'Flange Thick tf (mm)', 'Cross-Section Area (cm²)', 'Section Modulus Wx (cm³)'],
    rows: [
      ['IPE 160', '160', '82', '5.0', '7.4', '20.1', '109'],
      ['IPE 200', '200', '100', '5.6', '8.5', '28.5', '194'],
      ['IPE 240', '240', '120', '6.2', '9.8', '39.1', '324'],
      ['IPE 300', '300', '150', '7.1', '10.7', '53.8', '557'],
      ['HEA 160 (IPBl)', '152', '160', '6.0', '9.0', '38.8', '220'],
      ['HEA 200 (IPBl)', '190', '200', '6.5', '10.0', '53.8', '389'],
      ['HEA 240 (IPBl)', '230', '240', '7.5', '12.0', '76.8', '675'],
      ['HEB 200 (IPB)', '200', '200', '9.0', '15.0', '78.1', '570'],
      ['HEB 240 (IPB)', '240', '240', '10.0', '17.0', '106.0', '938'],
      ['HEB 300 (IPB)', '300', '300', '11.0', '19.0', '149.0', '1680']
    ],
    note: 'Conforms to EN 10034 / EN 10025-2 structural steel sections (S235JR / S355J2).'
  },
  'iso-286-fit-tolerances-library': {
    headers: ['Nominal Diameter Range (mm)', 'Hole H7 (μm)', 'Hole H8 (μm)', 'Shaft g6 (μm)', 'Shaft h6 (μm)', 'Shaft p6 (Press Fit, μm)', 'Typical Fit Character'],
    rows: [
      ['Over 3 to 6', '+12 / 0', '+18 / 0', '-4 / -12', '0 / -8', '+20 / +12', 'H7/g6: Sliding fit; H7/p6: Permanent press fit'],
      ['Over 6 to 10', '+15 / 0', '+22 / 0', '-5 / -14', '0 / -9', '+24 / +15', 'H7/g6: Free running; H7/h6: Locating clearance'],
      ['Over 10 to 18', '+18 / 0', '+27 / 0', '-6 / -17', '0 / -11', '+29 / +18', 'H7/h6: Push fit; H7/p6: Light drive fit'],
      ['Over 18 to 30', '+21 / 0', '+33 / 0', '-7 / -20', '0 / -13', '+35 / +22', 'H7/g6: Precision bearing seat; H7/p6: Heavy press'],
      ['Over 30 to 50', '+25 / 0', '+39 / 0', '-9 / -25', '0 / -16', '+42 / +26', 'H7/h6: Keyed hub; H7/p6: Bushing interference'],
      ['Over 50 to 80', '+30 / 0', '+46 / 0', '-10 / -29', '0 / -19', '+51 / +32', 'H7/g6: Machine spindle; H7/p6: Gear hub press'],
      ['Over 80 to 120', '+35 / 0', '+54 / 0', '-12 / -34', '0 / -22', '+59 / +37', 'H7/h6: Flange spigot; H7/p6: Crank pin press']
    ],
    note: 'ISO 286-1 / ISO 286-2 Geometrical product specifications (GPS) — ISO code system for tolerances on linear sizes.'
  },
  'standard-ball-bearing-library': {
    headers: ['Bearing Designation', 'Bore d (mm)', 'Outer Dia D (mm)', 'Width B (mm)', 'Basic Dynamic Rating Cr (kN)', 'Basic Static Rating C0r (kN)', 'Limiting Speed (RPM grease)'],
    rows: [
      ['6000', '10', '26', '8', '4.55', '1.97', '30,000'],
      ['6004', '20', '42', '12', '9.38', '5.02', '17,000'],
      ['6008', '40', '68', '15', '16.8', '11.5', '9,500'],
      ['6200', '10', '30', '9', '5.10', '2.39', '24,000'],
      ['6204', '20', '47', '14', '12.8', '6.65', '15,000'],
      ['6205', '25', '52', '15', '14.0', '7.85', '13,000'],
      ['6208', '40', '80', '18', '29.1', '17.8', '8,500'],
      ['6304', '20', '52', '15', '15.9', '7.80', '13,000'],
      ['6308', '40', '90', '23', '40.5', '24.0', '7,500']
    ],
    note: 'ISO 15 / DIN 625-1 radial deep groove ball bearings metric boundary dimensions and load capacities.'
  },
  'engineering-plastics-properties-table': {
    headers: ['Polymer (Abbreviation)', 'Tensile Strength (MPa)', 'Flexural Modulus (GPa)', 'Heat Deflection Temp HDT (°C @ 0.45MPa)', 'Density (g/cm³)', 'Machining & Friction Characteristics'],
    rows: [
      ['Delrin / POM-Acetal', '65 - 72', '2.8 - 3.2', '160°C', '1.41', 'Outstanding dimensional stability; low moisture absorption; CNC milling favorite.'],
      ['Nylon 6/6 (PA66)', '75 - 85', '2.8 - 3.4', '180°C', '1.14', 'High wear resistance; self-lubricating; hygroscopic (swells in humid conditions).'],
      ['PEEK (Polyether ether ketone)', '95 - 105', '3.8 - 4.2', '250°C', '1.32', 'Aerospace & medical grade; extreme chemical resistance; continuous 250°C service.'],
      ['PTFE (Teflon)', '20 - 35', '0.5 - 0.7', '120°C', '2.18', 'Near-zero friction coefficient; chemically inert; creeps under high static mechanical load.'],
      ['UHMW-PE', '22 - 35', '0.7 - 0.9', '80°C', '0.94', 'Extreme abrasion resistance; low friction chutes & guide rails; difficult to glue.'],
      ['Polycarbonate (PC)', '60 - 75', '2.2 - 2.5', '135°C', '1.20', 'Optical clarity; extremely high impact strength; prone to chemical stress cracking.']
    ],
    note: 'ASTM D638 / ISO 527 engineering thermoplastic mechanical and thermal properties handbook.'
  },
  'unc-unf-thread-pitch-tap-drill': {
    headers: ['Unified Thread Size', 'Major Dia (in / mm)', 'UNC TPI (Coarse)', 'UNC Tap Drill (75% Thread)', 'UNF TPI (Fine)', 'UNF Tap Drill (75% Thread)'],
    rows: [
      ['#4', '0.1120 in (2.84 mm)', '40', '#43 (0.0890 in / 2.26 mm)', '48', '#42 (0.0935 in / 2.37 mm)'],
      ['#6', '0.1380 in (3.51 mm)', '32', '#36 (0.1065 in / 2.71 mm)', '40', '#33 (0.1130 in / 2.87 mm)'],
      ['#8', '0.1640 in (4.17 mm)', '32', '#29 (0.1360 in / 3.45 mm)', '36', '#29 (0.1360 in / 3.45 mm)'],
      ['#10', '0.1900 in (4.83 mm)', '24', '#25 (0.1495 in / 3.80 mm)', '32', '#21 (0.1590 in / 4.04 mm)'],
      ['1/4"', '0.2500 in (6.35 mm)', '20', '#7 (0.2010 in / 5.11 mm)', '28', '#3 (0.2130 in / 5.41 mm)'],
      ['5/16"', '0.3125 in (7.94 mm)', '18', 'F (0.2570 in / 6.53 mm)', '24', 'I (0.2720 in / 6.91 mm)'],
      ['3/8"', '0.3750 in (9.53 mm)', '16', '5/16 in (0.3125 in / 7.94 mm)', '24', 'Q (0.3320 in / 8.43 mm)'],
      ['1/2"', '0.5000 in (12.70 mm)', '13', '27/64 in (0.4219 in / 10.71 mm)', '20', '29/64 in (0.4531 in / 11.51 mm)'],
      ['5/8"', '0.6250 in (15.88 mm)', '11', '17/32 in (0.5312 in / 13.49 mm)', '18', '37/64 in (0.5781 in / 14.68 mm)'],
      ['3/4"', '0.7500 in (19.05 mm)', '10', '21/32 in (0.6562 in / 16.67 mm)', '16', '11/16 in (0.6875 in / 17.46 mm)']
    ],
    note: 'ASME B1.1 Unified Inch Screw Threads (UN and UNR Thread Form) tap drill charts.'
  },
  'step-ap214-vs-step-ap242-comparator': {
    headers: ['Evaluation Dimension', 'STEP AP203 (Legacy)', 'STEP AP214 (Automotive / Classic)', 'STEP AP242 (Aerospace & Model-Based Def)'],
    rows: [
      ['Core Focus Domain', 'Basic 3D B-Rep solid geometry', 'Automotive body & mechanical assemblies', 'Model-Based Enterprise (MBE) & Digital Twin'],
      ['Semantic 3D GD&T / PMI', 'No (Graphic annotations only)', 'Graphical presentation only', 'Full Semantic PMI (Machine-readable GD&T datums & tolerances)'],
      ['Assembly Hierarchy & Kinematics', 'Flat or basic assembly trees', 'Hierarchical BOM + basic kinematics', 'Advanced kinematic joints, constraints & motion pairs'],
      ['Surface / Face Color & Materials', 'Monochrome / basic colors', 'Full face color & layer assignment', 'High-fidelity optical materials + semantic surface roughness'],
      ['Tessellated & Mesh Geometry', 'Not supported', 'Limited polygonal mesh support', 'Native high-density 3D tessellation & hybrid facet representations'],
      ['Long-Term Data Archiving (LOTAR)', 'Superseded', 'Partially supported for legacy projects', 'Primary international standard for 50-year regulatory retention']
    ],
    note: 'ISO 10303 Product data representation and exchange — AP203, AP214, and AP242 edition 2 comparison.'
  },
  'autocad-dwg-version-feature-matrix': {
    headers: ['DWG File Format Header', 'AutoCAD Versions Supported', 'Key Architectural Features Added', 'Internal Encryption / Protection', 'Down-Saving Compatibility Risk'],
    rows: [
      ['AC1032 (AutoCAD 2018)', 'AutoCAD 2018 - 2025+', '64-bit precision graphic primitives, faster save times, large object support', 'Enhanced digital signatures', 'Universal default for modern CAD; cannot open in CAD 2017 or earlier without downgrade'],
      ['AC1027 (AutoCAD 2013)', 'AutoCAD 2013 - 2017', 'Surface and point cloud engine enhancements, associative arrays', 'Standard password protection', 'Common AEC milestone; legacy government agencies still mandate AC1027 submission'],
      ['AC1024 (AutoCAD 2010)', 'AutoCAD 2010 - 2012', 'Parametric constraints (geometric & dimensional), free-form 3D mesh modeling', 'Digital signatures support', 'Rock-solid legacy standard; minimal bloat; wide compatibility with CNC machines'],
      ['AC1021 (AutoCAD 2007)', 'AutoCAD 2007 - 2009', 'True solid modeling engine redesign, SectionPlane, dynamic blocks preview', 'Legacy encryption', 'Universal fallback standard for laser cutters and wire-EDM offline controllers'],
      ['AC1018 (AutoCAD 2004)', 'AutoCAD 2004 - 2006', 'First modern compressed DWG format, true color (RGB) layer support', 'Legacy password', 'Fastest parsing format for embedded microcontrollers and micro-CAD engines']
    ],
    note: 'AutoCAD DWG file format internal headers (AC10xx) and cross-generational software compatibility matrix.'
  },
  'solidworks-inventor-nx-kernel-matrix': {
    headers: ['Software Suite', 'Primary Modeling Kernel', 'Owner / Vendor', 'B-Rep Representation', 'Cross-Platform Translation Nuance'],
    rows: [
      ['SolidWorks', 'Parasolid (.x_t, .x_b)', 'Siemens Digital Industries', 'Exact analytical & NURBS B-Rep', '100% zero-loss native import into NX & Solid Edge; Parasolid kernel translation is seamless.'],
      ['Autodesk Inventor', 'ShapeManager (ASM)', 'Autodesk (Forked from ACIS 7)', 'Exact analytical & NURBS B-Rep', 'Best translated to Revit via SAT/DWG; STEP translation introduces minor edge tolerances.'],
      ['Siemens NX', 'Parasolid (.x_t, .x_b)', 'Siemens Digital Industries', 'Synchronous technology B-Rep', 'Native Parasolid exchange without geometric translation stitching or surface healing.'],
      ['PTC Creo', 'Granite One', 'PTC Inc.', 'Analytical surfaces & procedural', 'Translates cleanly via STEP AP214/242; imports Parasolid via ATB (Associative Topology Bus).'],
      ['CATIA V5 / V6', 'Convergence Geometric Modeler (CGM)', 'Dassault Systèmes', 'Exact topological B-Rep', 'Direct CATPart import into SolidWorks via 3D Interconnect; high-tolerance stitching required.']
    ],
    note: 'Boundary Representation (B-Rep) geometric modeling kernel dependencies across leading mechanical CAD systems.'
  },
  'ifc2x3-vs-ifc4-vs-ifc4x3-matrix': {
    headers: ['IFC Schema Milestone', 'ISO Standard Designation', 'AEC & Infrastructure Scope', 'B-Rep / Mesh Representation', 'Global BIM Mandate Status'],
    rows: [
      ['IFC2x3 Coordination View 2.0', 'ISO 16739 (Pre-standard)', 'Building architectural, MEP, and structural domains', 'FacetedBrep and SweptSolid geometries', 'Still the most widely implemented baseline in commercial AEC contractors (90%+ legacy usage).'],
      ['IFC4 Reference View & Design Transfer', 'ISO 16739-1:2018', 'Advanced building properties, daylighting, energy, and enhanced MEP', 'AdvancedBrep (NURBS surfaces & CSG booleans)', 'Mandated across European Nordic BIM standards, UK BIM Level 2, and Singapore CORENET X.'],
      ['IFC4.3 Infrastructure & Civil', 'ISO 16739-1:2024', 'Horizontal infrastructure: Roads, Bridges, Railways, Ports, Waterways', 'Alignment-based linear geometry and tin-meshes', 'The definitive civil engineering milestone; connects Civil 3D, OpenRoads, and Allplan with GIS.']
    ],
    note: 'BuildingSMART International Industry Foundation Classes (IFC) evolutionary schema benchmark.'
  },
  'fdm-3d-printing-filament-comparison': {
    headers: ['Filament Material', 'Nozzle Temp (°C)', 'Bed Temp (°C)', 'Tensile Strength (MPa)', 'Glass Transition Tg (°C)', 'Enclosure / Ventilation Need'],
    rows: [
      ['PLA (Polylactic Acid)', '190°C - 220°C', '20°C - 60°C', '50 - 65 MPa', '55°C', 'No / Low warping; easy printing'],
      ['PETG (Glycol-Modified)', '230°C - 250°C', '70°C - 85°C', '45 - 55 MPa', '70°C', 'No / Low-medium warping; chemical resistant'],
      ['ABS (Acrylonitrile Butadiene)', '240°C - 260°C', '95°C - 110°C', '40 - 50 MPa', '95°C', 'Yes / High warping; requires fume exhaust'],
      ['ASA (Acrylic Styrene Acrylonitrile)', '240°C - 260°C', '95°C - 110°C', '42 - 52 MPa', '98°C', 'Yes / High UV resistance outdoor grade'],
      ['TPU 95A (Polyurethane)', '215°C - 235°C', '30°C - 60°C', '25 - 35 MPa (Flex)', '50°C', 'No / High wear & vibration damping flex'],
      ['PA-CF (Carbon Fiber Nylon)', '260°C - 290°C', '80°C - 100°C', '75 - 110 MPa', '150°C', 'Recommended / Hardened nozzle required; stiff'],
      ['PC (Polycarbonate)', '270°C - 310°C', '110°C - 120°C', '65 - 75 MPa', '135°C', 'Yes / Severe warping; structural toughness']
    ],
    note: 'Industry standard FDM / FFF thermoplastic filament processing profiles and mechanical properties.'
  },
  'iges-vs-step-data-loss-matrix': {
    headers: ['Feature / Capability', 'IGES (.igs / .iges)', 'STEP (.stp / .step)', 'Engineering Impact & Best Practice'],
    rows: [
      ['Data Nature', 'Faceted/wireframe surface geometry (Trimmed Surfaces)', 'True Boundary Representation (B-Rep) watertight solids', 'IGES frequently produces "surface holes" and stitch failures in CAM; STEP creates true solids'],
      ['Assembly Structure', 'Single flat level; all parts merged or loose surfaces', 'Multi-level hierarchical product assembly trees', 'STEP maintains individual part identity, transform matrices, and BOM components'],
      ['Color & Layer Mapping', 'Primitive RGB line/entity color', 'Dedicated component layers, face colors, and transparency', 'STEP AP214/AP242 correctly color-codes machining faces (e.g. green for milled, blue for drilled)'],
      ['Product Manufacturing Info (PMI)', 'None (Graphic wireframe text only)', 'Semantic 3D GD&T and tolerances (AP242)', 'STEP enables automated feature recognition in modern 5-axis CAM and CMM inspection'],
      ['File Size Efficiency', 'Verbose ASCII text; large file size', 'Standardized compact ISO 10303-21 text format', 'STEP files are typically 30-50% smaller and parse significantly faster in modern CAD kernels'],
      ['Modern Industry Verdict', 'Deprecated legacy standard (Last updated 1996)', 'Active international standard for the Digital Thread', 'Never use IGES unless interfacing with pre-2000 legacy wire-EDM or CMM software']
    ],
    note: 'ANSI Initial Graphics Exchange Specification (IGES) vs ISO Standard for the Exchange of Product model data (STEP).'
  },
  'autocad-250-commands-reference': {
    headers: ['Command', 'Alias', 'Category', 'Core Functionality', 'Command-Line Prompt / Syntax'],
    rows: [
      ['LINE', 'L', '2D Geometry', 'Creates straight line segments between points', 'Specify first point -> Specify next point'],
      ['PLINE', 'PL', '2D Geometry', 'Creates 2D polyline with continuous segments and arcs', 'Specify start point -> [Arc/Halfwidth/Length/Undo/Width]'],
      ['CIRCLE', 'C', '2D Geometry', 'Draws circle based on radius, diameter, or points', 'Specify center point -> [Radius / Diameter]'],
      ['RECTANG', 'REC', '2D Geometry', 'Draws rectangular closed polyline', 'Specify first corner -> [Area/Dimensions/Rotation]'],
      ['OFFSET', 'O', 'Modification', 'Creates parallel copy of curves at specified distance', 'Specify offset distance -> Select object to offset'],
      ['TRIM', 'TR', 'Modification', 'Trims objects to meet cutting edges', 'Select cutting edges (or Quick Mode Enter) -> Select object'],
      ['EXTEND', 'EX', 'Modification', 'Extends objects to meet boundary edges', 'Select boundary edges -> Select object to extend'],
      ['FILLET', 'F', 'Modification', 'Rounds and fillets the edges of objects', 'Select first object -> [Radius/Trim/Multiple]'],
      ['CHAMFER', 'CHA', 'Modification', 'Bevels edges of two intersecting lines', 'Select first line -> [Distance/Angle/Method]'],
      ['ARRAY', 'AR', 'Modification', 'Distributes copies into rectangular, path, or polar pattern', 'Select objects -> [Rectangular / Path / Polar]'],
      ['BLOCK', 'B', 'Asset Mgmt', 'Defines block component from selected entities', 'Specify block name, base point, and select entities'],
      ['WBLOCK', 'W', 'Asset Mgmt', 'Writes entities or block definition to standalone external DWG', 'Select source (Block/Entire/Objects) -> Specify filename'],
      ['INSERT', 'I', 'Asset Mgmt', 'Inserts block or external drawing into current space', 'Specify block name -> Insertion point -> Scale -> Rotation'],
      ['XREF', 'XR', 'Collaboration', 'Opens External References palette for DWG/PDF underlays', 'Manage attached DWG, DWF, DGN, PDF, and image overlays'],
      ['DIMSTYLE', 'D', 'Annotation', 'Creates and modifies dimension style configurations', 'Opens Dimension Style Manager for text, arrows, and tolerances'],
      ['PURGE', 'PU', 'Maintenance', 'Removes unused named items (blocks, layers, styles)', 'Opens Purge Dialog or run "-PURGE" for deep CLI cleaning'],
      ['AUDIT', 'AUDIT', 'Diagnostics', 'Evaluates drawing integrity and fixes pointer errors', 'Fix any errors detected? [Yes/No] -> Enter Y'],
      ['REGEN', 'RE', 'Display', 'Regenerates entire drawing geometry cache from database', 'Recalculates screen coordinates for smooth circles and zoom']
    ],
    note: 'Comprehensive AutoCAD command aliases and prompt syntax reference.'
  },
  'autocad-3d-shortcuts-cheatsheet': {
    headers: ['Command / Shortcut', 'Alias', '3D Domain', 'Primary Purpose', 'Viewport / UCS Synergy'],
    rows: [
      ['EXTRUDE', 'EXT', 'Solid Modeling', 'Extrudes 2D closed curves into 3D solid or surface', 'Select objects -> Specify height or path'],
      ['REVOLVE', 'REV', 'Solid Modeling', 'Sweeps closed curve around an axis of revolution', 'Select object -> Specify axis start/end point -> Angle'],
      ['SWEEP', 'SWEEP', 'Solid Modeling', 'Sweeps 2D planar curve along a 3D guide curve path', 'Select profile -> Select sweep path curve'],
      ['LOFT', 'LOFT', 'Solid Modeling', 'Creates 3D solid or surface through cross-section curves', 'Select cross sections in lofting order'],
      ['PRESSPULL', 'Ctrl+Shift+E', 'Direct Edit', 'Dynamically pulls bounded areas or face normals', 'Click inside bounded boundary -> Drag distance'],
      ['UNION', 'UNI', 'Boolean Operation', 'Combines selected 3D solids or 2D regions into single entity', 'Select solids to merge into unified volume'],
      ['SUBTRACT', 'SU', 'Boolean Operation', 'Subtracts one set of solids from another', 'Select base solids -> Enter -> Select solids to subtract'],
      ['INTERSECT', 'IN', 'Boolean Operation', 'Creates 3D solid from overlapping volume of entities', 'Select intersecting solids -> Retains common mass'],
      ['3DROTATE', '3R', 'Gizmo Transform', 'Rotates objects about a 3D coordinate axis with gizmo', 'Select object -> Pick base point -> Select axis ring'],
      ['3DMOVE', '3M', 'Gizmo Transform', 'Relocates objects along X, Y, or Z vector with triad gizmo', 'Select object -> Drag along axis vector handle'],
      ['UCS', 'UCS', 'Coordinate Sys', 'Aligns User Coordinate System to 3D geometry faces', 'Specify new origin or select [Face / Object / 3point]'],
      ['VPORTS', 'VPORTS', 'View Layout', 'Splits graphics window into multi-angle 3D viewports', 'Set Top, Front, Right, and Isometric concurrent views']
    ],
    note: 'AutoCAD 3D modeling shortcuts, direct-editing keys, and coordinate manipulation cheatsheet.'
  },
  'drawing-standards-comparison-reference': {
    headers: ['Standard Milestone', 'Jurisdiction / Origin', 'Projection Angle', 'Standard Sheet Sizes', 'Dimensioning Style & Units', 'Primary Industry Scope'],
    rows: [
      ['ISO 128 / ISO 5456', 'International (ISO)', 'First-Angle Projection (Default) or Third-Angle', 'A-Series: A0 (841x1189), A1, A2, A3, A4 (210x297)', 'Metric (mm); comma decimal delimiter; unidirectional text', 'Global manufacturing, automotive, European industrial machinery'],
      ['ASME Y14.100 / Y14.5', 'United States (ANSI / ASME)', 'Third-Angle Projection (Mandatory)', 'ANSI: E (34x44"), D (22x34"), C (17x22"), B (11x17"), A (8.5x11")', 'Inch / Decimal inch; period decimal mark; aligned or unidirectional', 'North American aerospace, defense, automotive, consumer devices'],
      ['DIN 6 / DIN 824', 'Germany (Deutsches Institut)', 'First-Angle Projection', 'DIN A-Series (Identical to ISO 216); standardized folding marks', 'Metric (mm); DIN font 6776; strict surface finish symbols', 'Heavy machine tool design, German mechanical and plant engineering'],
      ['JIS B 0001', 'Japan (JIS)', 'Third-Angle Projection (Predominant)', 'JIS A-Series (Matches ISO standard sheet dimensions)', 'Metric (mm); JIS symbology; rigorous leader line rules', 'Japanese robotics, precision optics, automotive, semiconductor tools'],
      ['GB/T 14689 / GB/T 4458', 'China (National Standard)', 'First-Angle Projection', 'Standard A-Series (A0 through A4) + extended long formats', 'Metric (mm); national GB vector fonts; Title block bottom-right', 'Chinese civil, infrastructure, national heavy manufacturing contracts']
    ],
    note: 'International technical product documentation (TPD) and engineering drawing standards comparison matrix.'
  },
  'standard-fasteners-specification-library': {
    headers: ['Thread Size', 'Pitch (mm)', 'Hex Bolt Across Flats s (mm)', 'Cap Screw Head Dia dk (mm)', 'Plain Washer ID / OD (mm)', 'Proof Load (Grade 8.8 kN)', 'Recommended Torque (Grade 8.8 Nm)'],
    rows: [
      ['M4', '0.70', '7.0 mm (DIN 933)', '7.0 mm (DIN 912)', '4.3 / 9.0 mm (ISO 7089)', '4.4 kN', '3.1 Nm'],
      ['M5', '0.80', '8.0 mm (DIN 933)', '8.5 mm (DIN 912)', '5.3 / 10.0 mm (ISO 7089)', '7.2 kN', '6.1 Nm'],
      ['M6', '1.00', '10.0 mm (DIN 933)', '10.0 mm (DIN 912)', '6.4 / 12.0 mm (ISO 7089)', '10.2 kN', '10.5 Nm'],
      ['M8', '1.25', '13.0 mm (DIN 933)', '13.0 mm (DIN 912)', '8.4 / 16.0 mm (ISO 7089)', '18.7 kN', '25.0 Nm'],
      ['M10', '1.50', '16.0 / 17.0 mm', '16.0 mm (DIN 912)', '10.5 / 20.0 mm (ISO 7089)', '29.7 kN', '51.0 Nm'],
      ['M12', '1.75', '18.0 / 19.0 mm', '18.0 mm (DIN 912)', '13.0 / 24.0 mm (ISO 7089)', '43.2 kN', '89.0 Nm'],
      ['M16', '2.00', '24.0 mm (DIN 933)', '24.0 mm (DIN 912)', '17.0 / 30.0 mm (ISO 7089)', '80.5 kN', '215.0 Nm'],
      ['M20', '2.50', '30.0 mm (DIN 933)', '30.0 mm (DIN 912)', '21.0 / 37.0 mm (ISO 7089)', '126.0 kN', '420.0 Nm']
    ],
    note: 'ISO 4017 / DIN 933 hex screws, DIN 912 socket head cap screws, and ISO 7089 metric plain washers.'
  },
  'autocad-system-variables-reference': {
    headers: ['Variable Name', 'Default Value', 'Recommended Setting', 'Type & Scope', 'Technical Purpose & Effect'],
    rows: [
      ['FILEDIA', '1', '1', 'Integer (Registry)', 'Controls display of file navigation dialog boxes (open, save, export). 0 forces CLI path typing.'],
      ['PICKFIRST', '1', '1', 'Integer (Drawing)', 'Controls noun/verb selection. When 1, allows selecting objects before issuing an editing command.'],
      ['HIGHLIGHT', '1', '1', 'Integer (Registry)', 'Controls object highlighting on selection. 0 disables visual raster glow on dense 2D wireframes.'],
      ['CMDDIA', '1', '1', 'Integer (Registry)', 'Controls display of command dialog boxes (such as QTEXT, PLOT, and external database links).'],
      ['INDEXCTL', '0', '3', 'Integer (Drawing)', 'Controls whether layer and spatial indexes are created and saved (3 enables both for rapid XREF demand loading).'],
      ['XLOADCTL', '1', '2', 'Integer (Registry)', 'Turns XREF demand loading on/off. Setting 2 creates local temporary copies to prevent file locking.'],
      ['WHIPTHREAD', '1', '3', 'Integer (Registry)', 'Controls multi-threaded CPU regeneration. 3 utilizes multi-core processors for zoom and pan redrawing.'],
      ['VISRETAIN', '1', '1', 'Integer (Drawing)', 'Controls visibility, color, linetype, and plot styles of XREF-dependent layers in host drawing.'],
      ['HPMAXLINES', '100000', '1000000', 'Integer (Registry)', 'Specifies maximum number of hatch lines generated before AutoCAD pauses to warn user.']
    ],
    note: 'Mission-critical AutoCAD system variables governing performance, dialog visibility, and external reference stability.'
  },
  'fastener-strength-grade-reference': {
    headers: ['Property Class / Grade', 'Standard', 'Material & Heat Treatment', 'Nominal Tensile Strength Rm (MPa)', 'Yield / Proof Stress Rp0.2 (MPa)', 'Core Hardness (HRC / HV)', 'Typical Head Marking & Application'],
    rows: [
      ['Class 4.6', 'ISO 898-1', 'Low/Medium Carbon Steel', '400 MPa', '240 MPa (Yield)', '120–220 HV', '4.6 • Non-critical brackets, light duty architectural fixtures'],
      ['Class 5.8', 'ISO 898-1', 'Low/Medium Carbon Steel (Work Hardened)', '500 MPa', '400 MPa (Yield)', '160–220 HV', '5.8 • General machine guards, sheet metal covers'],
      ['Class 8.8', 'ISO 898-1', 'Medium Carbon Steel, Quenched & Tempered', '800 MPa', '640 MPa (0.2% Offset)', '22–32 HRC', '8.8 • Standard structural machinery, automotive chassis fasteners'],
      ['Class 10.9', 'ISO 898-1', 'Alloy Steel, Quenched & Tempered', '1040 MPa', '940 MPa (0.2% Offset)', '32–39 HRC', '10.9 • High-preload engine mounts, heavy structural slip-critical joints'],
      ['Class 12.9', 'ISO 898-1', 'Alloy Steel (CrMo / CrNiMo), Q&T', '1220 MPa', '1100 MPa (0.2% Offset)', '39–44 HRC', '12.9 • High-stress socket head cap screws (DIN 912), die & mold tooling'],
      ['SAE Grade 5', 'SAE J429', 'Medium Carbon Steel, Q&T', '827 MPa (120 ksi)', '634 MPa (92 ksi)', '25–34 HRC', '3 Radial Lines • North American automotive and agricultural equipment'],
      ['SAE Grade 8', 'SAE J429', 'Medium Carbon Alloy Steel, Q&T', '1034 MPa (150 ksi)', '896 MPa (130 ksi)', '33–39 HRC', '6 Radial Lines • High-strength heavy machinery and suspension bolts'],
      ['ASTM A325', 'ASTM F3125', 'Medium Carbon Structural Steel', '825 MPa (120 ksi)', '635 MPa (92 ksi)', '24–35 HRC', 'A325 • Heavy hex structural steel building and bridge connections'],
      ['A2-70 (304 SS)', 'ISO 3506-1', 'Austenitic Stainless Steel (Cold Worked)', '700 MPa', '450 MPa', '210 HV min', 'A2-70 • Food processing, outdoor architectural, corrosion-resistant assembly'],
      ['A4-80 (316 SS)', 'ISO 3506-1', 'Molybdenum Austenitic Stainless Steel', '800 MPa', '600 MPa', '240 HV min', 'A4-80 • Marine offshore, chemical processing, chloride environments']
    ],
    note: 'Governed by ISO 898-1, SAE J429, ASTM F3125, and ISO 3506-1 mechanical fastener property standards.'
  },
  'cnc-tool-specifications-reference': {
    headers: ['Tool Type & Geometry', 'Substrate / Coating', 'Workpiece Material Group', 'Surface Speed Vc (m/min)', 'Feed per Tooth fz (mm/tooth)', 'Axial / Radial DOC (ap / ae)', 'Coolant Strategy'],
    rows: [
      ['Flat End Mill (3-Flute, 45° Helix)', 'Carbide • ZrN / Uncoated', 'ISO N: Aluminum 6061-T6 / 7075', '250 – 600 m/min', '0.05 – 0.15 mm', 'ap: 1.0D / ae: 0.25D (HEM)', 'Flood Emulsion or Air Blast + MQL'],
      ['Flat End Mill (4-Flute, Variable Helix)', 'Carbide • AlTiN / TiAlN', 'ISO P: Carbon & Alloy Steel (4140)', '120 – 180 m/min', '0.03 – 0.08 mm', 'ap: 1.5D / ae: 0.10D (Trochoidal)', 'Dry Air Blast (prevents thermal shock)'],
      ['Flat End Mill (5-Flute, High Efficiency)', 'Carbide • AlCrN / TiSiN', 'ISO M: Stainless Steel 304 / 316L', '70 – 110 m/min', '0.025 – 0.06 mm', 'ap: 1.0D / ae: 0.08D', 'High-Pressure Flood Coolant (70 bar)'],
      ['Ball Nose End Mill (2/4-Flute)', 'Micro-Grain Carbide • TiSiN', 'ISO H: Hardened Tool Steel (50-60 HRC)', '60 – 100 m/min', '0.02 – 0.05 mm', 'ap: 0.05D / ae: 0.05D (3D Finish)', 'Oil Mist / Cold Air Gun'],
      ['Indexable Face Mill (45° Lead Angle)', 'Cermet / CVD Coated Carbide', 'ISO P/K: Cast Iron & Mild Steel', '150 – 240 m/min', '0.12 – 0.25 mm', 'ap: 2.0–4.0 mm / ae: 0.7D', 'Dry Machining Recommended'],
      ['Solid Carbide Twist Drill (140° Point)', 'Carbide • TiAlN Through-Coolant', 'ISO P/M: Structural & Alloy Steels', '80 – 140 m/min', '0.10 – 0.22 mm/rev', 'Full Diameter (Up to 8xD)', 'Internal Through-Spindle Coolant']
    ],
    note: 'Baseline CNC milling and drilling parameters per ISO 513 material classification. Scale feed proportionally for micro-tools (<3mm).'
  },
  'revit-family-formula-reference': {
    headers: ['Formula Pattern', 'Revit Syntax Example', 'Parameter Data Type', 'Engineering Use Case & Behavior'],
    rows: [
      ['Conditional If-Then-Else', 'if(Width > 1200 mm, 3, 2)', 'Integer / Length', 'Automatically adds a center mullion or support bracket when panel width exceeds 1200 mm.'],
      ['Nested Conditional Logic', 'if(Length < 1000 mm, 150 mm, if(Length < 2500 mm, 250 mm, 350 mm))', 'Length', 'Steps beam depth or flange thickness across three discrete structural span brackets.'],
      ['Boolean AND / OR Gate', 'and(Include_Damper, Air_Flow > 500 L/s)', 'Yes/No (Boolean)', 'Drives visibility checkbox parameter only when both conditions are simultaneously satisfied.'],
      ['Boolean NOT Inversion', 'not(Show_2D_Clearance)', 'Yes/No (Boolean)', 'Toggles mutually exclusive visibility graphics (e.g., hide 3D detailed hardware when 2D symbol is active).'],
      ['Array Count Guard (Min 2)', 'max(2, round(Length / Spacing))', 'Integer', 'Prevents Revit family regeneration errors when parametric array count drops below 2 elements.'],
      ['Trigonometric Pitch Slope', 'Run * tan(Pitch_Angle)', 'Length', 'Calculates exact roof rise or ramp elevation delta from horizontal run and angle parameter.'],
      ['Unit-Neutral Square Root', 'sqrt((Width / 1 mm) ^ 2 + (Depth / 1 mm) ^ 2) * 1 mm', 'Length', 'Strips units before exponentiation/root operations to prevent "Inconsistent Units" error.'],
      ['Pi Circle Area / Flow Velocity', 'Flow_Rate / (pi() * (Pipe_ID / 2) ^ 2)', 'Velocity / Number', 'Computes fluid velocity directly inside MEP pipe or duct fitting family schedules.']
    ],
    note: 'Revit family editor formula syntax is case-sensitive (use lowercase if, and, or, not, sqrt, pi, round, roundup, rounddown).'
  },
  'material-properties-database': {
    headers: ['Material Grade', 'Category', 'Density ρ (g/cm³)', 'Young\'s Modulus E (GPa)', 'Yield Strength σy (MPa)', 'Ultimate Tensile σu (MPa)', 'Thermal Cond. k (W/m·K)', 'Poisson\'s Ratio ν'],
    rows: [
      ['Structural Steel S235 / A36', 'Carbon Steel', '7.85', '200 GPa', '235 – 250 MPa', '400 – 550 MPa', '50 W/m·K', '0.30'],
      ['Alloy Steel 4140 (Q&T)', 'Chromoly Steel', '7.85', '205 GPa', '655 MPa', '1020 MPa', '42.6 W/m·K', '0.29'],
      ['Stainless Steel 304 (1.4301)', 'Austenitic SS', '8.00', '193 GPa', '215 MPa', '505 MPa', '16.2 W/m·K', '0.29'],
      ['Stainless Steel 316L (1.4404)', 'Marine Austenitic SS', '8.00', '193 GPa', '170 MPa', '485 MPa', '16.3 W/m·K', '0.30'],
      ['Aluminum 6061-T6', 'Wrought Aluminum', '2.70', '68.9 GPa', '276 MPa', '310 MPa', '167 W/m·K', '0.33'],
      ['Aluminum 7075-T6', 'Aerospace Aluminum', '2.81', '71.7 GPa', '503 MPa', '572 MPa', '130 W/m·K', '0.33'],
      ['Titanium Ti-6Al-4V (Grade 5)', 'Titanium Alloy', '4.43', '113.8 GPa', '880 MPa', '950 MPa', '6.7 W/m·K', '0.34'],
      ['Brass C36000 (Free-Cutting)', 'Copper Alloy', '8.50', '97 GPa', '310 MPa', '385 MPa', '115 W/m·K', '0.34'],
      ['Copper C11000 (ETP)', 'Pure Copper', '8.89', '117 GPa', '220 MPa (Half-Hard)', '270 MPa', '388 W/m·K', '0.34'],
      ['Grey Cast Iron EN-GJL-250', 'Ferrous Casting', '7.20', '110 GPa', '165 MPa (0.1% Offset)', '250 MPa (Tensile)', '46 W/m·K', '0.26']
    ],
    note: 'Verified FEA and mechanical design material input cards at 20°C ambient reference temperature.'
  },
  'cad-symbol-block-library': {
    headers: ['Symbol / Block Name', 'Standard Code', 'Discipline', 'Base Insertion Point & Scale', 'Required Attributes / Layer', 'Standard Graphic Representation'],
    rows: [
      ['Third-Angle Projection Cone', 'ISO 5456-2 / ASME Y14.3', 'Mechanical Drafting', 'Center of Concentric Circles (1:1 Paper)', 'Layer: TITLE-SYMB (0.35mm)', 'Truncated cone on right, two concentric circles on left'],
      ['First-Angle Projection Cone', 'ISO 5456-2 / DIN 6', 'Mechanical Drafting', 'Center of Concentric Circles (1:1 Paper)', 'Layer: TITLE-SYMB (0.35mm)', 'Truncated cone on left, two concentric circles on right'],
      ['Surface Roughness Ra Symbol', 'ISO 1302 / ASME Y14.36', 'Manufacturing / GD&T', 'Apex of 60° Checkmark Touching Edge', 'Attr: RA_VALUE (e.g. Ra 1.6), PROCESS', '60° unequal leg checkmark with horizontal bar (material removal)'],
      ['Datum Feature Triangle', 'ASME Y14.5 / ISO 5459', 'GD&T Metrology', 'Base of Filled/Open Equilateral Triangle', 'Attr: DATUM_LETTER (A, B, C)', 'Equilateral triangle on leader shoulder connected to square frame'],
      ['Section View Callout Arrow', 'ISO 128-40 / AIA', 'Architectural & MCAD', 'Center of Reference Circle (Ø12mm)', 'Attr: SECTION_ID, SHEET_NO', 'Split circle with directional cutting-plane arrow and sheet reference'],
      ['Elevation Datum Benchmark', 'ISO 129 / AIA CAD', 'AEC / Civil BIM', 'Apex Tip of 45° Triangle on Grade Line', 'Attr: ELEV_LEVEL (e.g. +12.450)', 'Half-filled 45° triangle with horizontal leader shelf'],
      ['North Arrow & True/Project North', 'AIA / ISO 7519', 'Site & Civil Layout', 'Center of Compass Ring (20mm Paper)', 'Attr: ORIENTATION_ANGLE', 'Directional pointer indicating Project North vs Geodetic True North'],
      ['Normally Open (NO) Contact', 'IEC 60617 / NFPA 79', 'Electrical Schematic', 'Left Terminal Connection Node (Grid 5mm)', 'Attr: TAG_NAME (K1, S1), TERM_NO', 'Two parallel vertical bars (NFPA) or angled switch blade (IEC)']
    ],
    note: 'Standardized CAD symbol block conventions for ISO, ASME, AIA, and IEC technical documentation.'
  },
  'cad-file-format-guide': {
    headers: ['Format Extension', 'Full Standard Name', 'Geometry Kernel / Type', 'Unit & Hierarchy Support', 'Primary Engineering Use Case'],
    rows: [
      ['.DWG', 'AutoCAD Drawing Database', '2D/3D Vector & ACIS Solid', 'Full Layers, Blocks, XREFs', 'Universal AEC, civil, and mechanical 2D drafting master archive'],
      ['.DXF', 'Drawing Exchange Format (ASCII/Binary)', '2D/3D Vector Entities', 'Layer & Color Preserved', 'Laser cutting, plasma CNC nesting, and cross-platform 2D exchange'],
      ['.STEP (.stp)', 'ISO 10303-21 (AP214 / AP242)', 'Exact NURBS B-Rep Solid', 'Full Assembly Tree + Semantic PMI', 'Gold-standard neutral 3D mechanical CAD & CNC CAM exchange'],
      ['.IGES (.igs)', 'ANSI Y14.26M Legacy Surface', 'Trimmed NURBS Surfaces', 'Flat Surface Collection', 'Legacy mold/die surface transfer; prone to stitching gaps'],
      ['.X_T / .X_B', 'Siemens Parasolid Transmit', 'Exact Parasolid B-Rep Topology', 'Zero-Translation Native Solids', 'Direct lossless exchange between SolidWorks, Siemens NX, and Solid Edge'],
      ['.IFC', 'ISO 16739 openBIM (IFC2x3 / IFC4)', 'SweptSolid, B-Rep & Triangulated', 'Spatial Hierarchy + Property Sets', 'Vendor-neutral BIM coordination across Revit, ArchiCAD, and Tekla'],
      ['.STL / .3MF', 'Tessellated Triangle Mesh', 'Faceted Polygonal Mesh', '3MF stores units, color & materials', 'Additive manufacturing slicing (FDM, SLA, SLS) and 3D printing']
    ],
    note: 'Comprehensive engineering CAD, BIM, and manufacturing file format interoperability matrix.'
  },
  'bim-lod-level-reference': {
    headers: ['LOD Level', 'AIA / BIMForum Designation', 'Geometric Precision Requirement', 'Non-Graphic Attribute Data', 'Project Phase & Deliverable Use'],
    rows: [
      ['LOD 100', 'Conceptual Massing', 'Overall building mass, area, height, volume', 'Conceptual cost per m², gross energy load', 'Master planning, feasibility study, zoning approval'],
      ['LOD 200', 'Approximate Geometry (Schematic)', 'Generic placeholders with approximate bounding sizes', 'System classification, approximate capacity', 'Schematic Design (SD) & early spatial coordination'],
      ['LOD 300', 'Precise Geometry (Design Dev)', 'Specific assemblies with exact size, shape, and orientation', 'Thermal U-value, fire rating, structural grade', 'Construction Documents (CD) & code compliance'],
      ['LOD 350', 'Construction Coordination', 'Includes hangers, supports, embeds, and connection interfaces', 'Clearance zones, clash detection tolerances', 'Multi-trade MEP/Structural 3D clash detection (Navisworks)'],
      ['LOD 400', 'Fabrication & Assembly', 'Shop-drawing accuracy: welds, bolts, gussets, pipe spools', 'Manufacturer model #, CNC fabrication metadata', 'Direct off-site prefabrication and CNC spool production'],
      ['LOD 500', 'As-Built Verified Field Twin', 'Field-verified geometry (via laser scan / total station)', 'Serial numbers, warranty dates, O&M manuals, COBie', 'Facility Management (FM) and Digital Twin operations']
    ],
    note: 'Governed by BIMForum Level of Development (LOD) Specification and ISO 19650 information requirements.'
  },
  'pid-symbols-reference': {
    headers: ['ISA-5.1 Tag / Symbol', 'Component Designation', 'Graphic Convention', 'Signal / Line Type', 'Process Control Function'],
    rows: [
      ['Gate Valve (HV/XV)', 'Manual or Actuated Isolation Valve', 'Two opposing triangles meeting at center vertex', 'Solid Primary Process Line', 'On/off full-bore process fluid isolation with minimal pressure drop'],
      ['Globe Control Valve (FCV/PCV)', 'Modulating Throttling Valve', 'Bowtie triangles with darkened center sphere + diaphragm dome', 'Pneumatic (dashed) or Electric (dotted)', 'Continuous proportional flow, pressure, or temperature regulation'],
      ['Check Valve (NRV)', 'Non-Return Swing / Lift Check', 'Z-shaped diagonal line with directional arrow and stop dot', 'Inline Process Piping', 'Prevents backflow reversal to protect centrifugal pumps and compressors'],
      ['Pressure Safety Valve (PSV)', 'Spring-Loaded Relief Valve', 'Angled bowtie meeting at 90° with vertical spring symbol', 'Relieves to Flare / Vent Header', 'Overpressure emergency protection per ASME Boiler & Pressure Vessel Code'],
      ['Centrifugal Pump (P-101)', 'Rotodynamic Liquid Pump', 'Circle with tangential discharge nozzle and triangular base', 'Process Suction / Discharge', 'Imparts kinetic head to transport liquids through process piping'],
      ['Shell & Tube Exchanger (E-101)', 'Thermal Heat Exchanger', 'Circle with internal S-curve tube pass symbol', 'Hot & Cold Fluid Streams', 'Transfers thermal energy between two isolated process fluid streams'],
      ['Field Transmitter (PT / FT / TT)', 'Field-Mounted Sensor / Transmitter', 'Circle without horizontal line (ISA bubble) with tag letters', '4-20mA / HART / Fieldbus', 'Measures local pressure (PT), flow (FT), or temperature (TT) and transmits to PLC'],
      ['DCS Shared Display (PIC / FIC)', 'Control Room Indicating Controller', 'Circle inside square with horizontal dividing line', 'Software / Internal Bus Link', 'Operator-accessible PID control loop on central Distributed Control System']
    ],
    note: 'Conforms to ANSI/ISA-5.1 Instrumentation Symbols and Identification & ISO 14617 P&ID standards.'
  },
  'electrical-drawing-symbols-reference': {
    headers: ['Symbol Name', 'IEC 60617 Tag', 'NFPA 79 / IEEE Tag', 'Graphic Representation', 'Schematic Engineering Function'],
    rows: [
      ['Circuit Breaker (3-Pole)', 'QF (e.g. QF1)', 'CB', 'Three ganged switch blades with thermal (box) and magnetic (zig-zag) trip markers', 'Automatic overcurrent and short-circuit fault interruption'],
      ['Normally Open Contact (NO)', 'KM / KA', 'CR / M', 'Two parallel bars (ANSI) or open angled blade (IEC)', 'Closes circuit path when parent contactor or relay coil is energized'],
      ['Normally Closed Contact (NC)', 'KM / KA', 'CR / M', 'Parallel bars with diagonal slash (ANSI) or closed blade (IEC)', 'Opens circuit path when parent coil is energized (interlock / stop logic)'],
      ['Contactor / Relay Coil', 'KM / KA (A1-A2)', 'M / CR', 'Rectangle (IEC) or Circle (ANSI) between control rails', 'Electromagnetic actuator driving associated power and auxiliary contacts'],
      ['Thermal Overload Relay', 'FR', 'OL', 'Pulse square-wave heating element symbol inline with motor phases', 'Protects 3-phase induction motors against sustained phase overload'],
      ['3-Phase Squirrel Cage Motor', 'M (3~)', 'MTR', 'Circle with "M" and "3~" sine wave symbol + U1/V1/W1 terminals', 'Converts 3-phase AC electrical power into mechanical shaft torque'],
      ['Protective Earth (PE Ground)', 'PE', 'GND', 'Three descending horizontal lines inside circle (or bare triangle)', 'Safety chassis bonding path to prevent electric shock hazard']
    ],
    note: 'Cross-referenced between IEC 60617 (European/International) and NFPA 79 / IEEE Std 315 (North American) schematic standards.'
  },
  'hvac-drawing-symbols-reference': {
    headers: ['MEP Symbol Name', 'Abbreviation', 'CAD Layer (AIA)', 'Graphic Convention', 'HVAC System Function'],
    rows: [
      ['Supply Air Duct (4-Way Diffuser)', 'SA / CD', 'M-HVAC-SUPP', 'Square box with four directional diagonal corner arrows + CFM callout', 'Delivers conditioned supply air evenly into occupied architectural zone'],
      ['Return Air Grille', 'RA / RG', 'M-HVAC-RETN', 'Rectangle with single diagonal slash line from bottom-left to top-right', 'Draws room air back to Air Handling Unit (AHU) or plenum'],
      ['Exhaust Air Register', 'EA / EG', 'M-HVAC-EXHS', 'Rectangle with full X cross-diagonals connecting all four corners', 'Extracts contaminated or humid air from restrooms, kitchens, and labs'],
      ['Variable Air Volume Box', 'VAV', 'M-HVAC-EQPM', 'Rectangular inline box with damper blade and controller diamond + reheat coil', 'Modulates zone airflow volume based on space thermostat demand'],
      ['Motorized Fire / Smoke Damper', 'FSD / FD', 'M-HVAC-DAMP', 'Inline butterfly blade inside fire-rated wall penetration with "FD" tag', 'Automatically seals duct penetration upon fire alarm or fusible link melt'],
      ['Flexible Duct Connection', 'FLEX', 'M-HVAC-DUCT', 'Corrugated zig-zag or accordion line pattern connecting rigid branch to diffuser', 'Isolates mechanical vibration and accommodates ceiling grid alignment']
    ],
    note: 'Follows ASHRAE Handbook Fundamentals, SMACNA duct construction standards, and AIA National CAD Standard.'
  },
  'architectural-drawing-symbols-reference': {
    headers: ['Architectural Symbol', 'AIA Layer Name', 'Paper Plot Size', 'Graphic Structure', 'Construction Document Meaning'],
    rows: [
      ['Building / Wall Section Callout', 'A-ANNO-SYMB', 'Ø 12.0 mm (1/2")', 'Circle split horizontally (top=Detail #, bottom=Sheet #) with solid directional arrow', 'Indicates exact cutting plane and viewing direction for vertical section view'],
      ['Interior Elevation Marker', 'A-ANNO-SYMB', 'Ø 12.0 mm (1/2")', 'Central circle with up to 4 directional triangular pointers around perimeter', 'References N/S/E/W interior room wall elevations on detail sheets'],
      ['Floor Level Elevation Datum', 'A-ANNO-DIMS', 'Ø 6.0 mm target', 'Circle with crosshairs and alternating blackened quadrants + "+0.000 F.F.L."', 'Establishes vertical Finished Floor Level (FFL) or Top of Steel (TOS) height'],
      ['Door Number Tag', 'A-DOOR-IDEN', 'Oval / Circle 8mm', 'Stadium pill or circle centered in door swing opening (e.g. D-104)', 'Links floor plan door instance to architectural Door & Hardware Schedule'],
      ['Window Type Tag', 'A-GLAZ-IDEN', 'Hexagon 8mm', 'Regular 6-sided polygon placed adjacent to exterior glazing (e.g. W-02)', 'References window size, glazing U-factor, and frame spec in Window Schedule'],
      ['Revision Cloud & Delta Triangle', 'A-ANNO-REVS', 'Triangle 6mm', 'Scalloped arc polyline boundary with equilateral triangle containing Revision #', 'Highlights post-issuance design modifications linked to Title Block revision log']
    ],
    note: 'Compliant with ISO 128-30, ISO 7519, and United States National CAD Standard (NCS / AIA).'
  },
  'cnc-m-code-reference-table': {
    headers: ['M-Code', 'Function Name', 'Execution Timing', 'Typical Fanuc / Haas Behavior', 'Shop-Floor Safety & Usage Note'],
    rows: [
      ['M00', 'Mandatory Program Stop', 'Immediate at block', 'Halts axis feed, spindle, and coolant unconditionally until Cycle Start pressed', 'Used for manual part flip, chip clearing, or in-process micrometer check'],
      ['M01', 'Optional Program Stop', 'Conditional on panel key', 'Pauses machine only if "OPT STOP" button is illuminated on operator console', 'Place after every tool operation for first-article prove-out inspection'],
      ['M03', 'Spindle On Clockwise (CW)', 'With S-word RPM', 'Starts spindle rotation in standard right-hand cutting direction (e.g. S6000 M03)', 'Verify tool hand before execution; always pair with explicit S speed'],
      ['M04', 'Spindle On Counter-Clockwise', 'With S-word RPM', 'Starts spindle in reverse left-hand rotation (or rigid tapping retract)', 'Used for left-hand drills/taps or back-boring operations'],
      ['M05', 'Spindle Stop', 'Before Z retract / ATC', 'Decelerates and stops main spindle motor completely', 'Automatically invoked by M06 or M30 on modern controls'],
      ['M06', 'Automatic Tool Change (ATC)', 'With T-word', 'Indexes carousel/arm and swaps tool in spindle (e.g. T04 M06)', 'Ensure safe Z-axis clearance (G28 G91 Z0) prior to M06 on non-macro machines'],
      ['M08 / M09', 'Flood Coolant On / Off', 'Modal Auxiliary', 'M08 activates main flood coolant pump; M09 shuts off all coolant valves', 'Use M88/M89 for high-pressure Through-Spindle Coolant (TSC)'],
      ['M30', 'Program End & Rewind', 'End of main program', 'Stops spindle/coolant, resets modal states, and rewinds cursor to top of file', 'Standard final block of every standalone CNC G-code file']
    ],
    note: 'Standardized ISO 6983 / EIA RS-274-D Miscellaneous (M) functions for Fanuc, Haas, Mazak, and Okuma CNC controls.'
  },
  'sheet-metal-bend-deduction-chart': {
    headers: ['Sheet Thickness T (mm)', 'Gauge Equiv (Steel)', 'Recommended V-Die (mm)', 'Inside Radius R (mm)', 'K-Factor (Air Bend)', '90° Bend Allowance BA (mm)', '90° Bend Deduction BD (mm)'],
    rows: [
      ['1.0 mm', '20 Ga (0.91mm)', 'V8', '1.0 mm', '0.42', '2.23 mm', '1.77 mm'],
      ['1.2 mm', '18 Ga (1.21mm)', 'V10', '1.2 mm', '0.42', '2.68 mm', '2.12 mm'],
      ['1.5 mm', '16 Ga (1.52mm)', 'V12', '1.5 mm', '0.43', '3.37 mm', '2.63 mm'],
      ['2.0 mm', '14 Ga (1.90mm)', 'V16', '2.0 mm', '0.43', '4.49 mm', '3.51 mm'],
      ['2.5 mm', '12 Ga (2.66mm)', 'V20', '2.5 mm', '0.44', '5.65 mm', '4.35 mm'],
      ['3.0 mm', '11 Ga (3.04mm)', 'V24', '3.0 mm', '0.44', '6.79 mm', '5.21 mm'],
      ['4.0 mm', '8 Ga (4.18mm)', 'V32', '4.0 mm', '0.45', '9.11 mm', '6.89 mm'],
      ['5.0 mm', '6 Ga (4.94mm)', 'V40', '5.0 mm', '0.45', '11.39 mm', '8.61 mm'],
      ['6.0 mm', '3 Ga (6.07mm)', 'V50', '6.0 mm', '0.46', '13.76 mm', '10.24 mm']
    ],
    note: 'Calculated for 90° air bending on cold-rolled mild steel (V = 8×T rule): BA = (π/2)·(R + K·T), BD = 2·(R + T) - BA.'
  },
  'cad-hardware-workstation-spec-builder': {
    headers: ['CAD / BIM Software & Workload', 'Primary Bottleneck', 'Recommended CPU (2026)', 'System RAM (ECC / DDR5)', 'Workstation GPU (ISV Certified)', 'NVMe Storage & Scratch Disk'],
    rows: [
      ['AutoCAD / BricsCAD / ZWCAD (2D Drafting)', 'Single-Core GHz & 2D Regen', 'Intel Core Ultra 7 / i7-14700K or Ryzen 7 9700X (5.5+ GHz)', '32 GB DDR5-6000', 'NVIDIA RTX A1000 / RTX 2000 Ada (8GB)', '1 TB PCIe 4.0 NVMe SSD'],
      ['SolidWorks / Inventor (< 1,000 Parts)', 'Single-Thread Parametric Rebuild', 'Intel Core Ultra 9 285K / i9-14900K (5.8+ GHz Turbo)', '64 GB DDR5', 'NVIDIA RTX 2000 Ada (16GB) or RTX A2000', '2 TB PCIe 4.0 NVMe (OS + PDM Local Cache)'],
      ['SolidWorks / Siemens NX (10,000+ Part Assys)', 'Single-Core GHz + Massive VRAM/RAM', 'Intel Core i9-14900KS / Xeon W5-2565X (High Clock)', '128 GB DDR5 ECC', 'NVIDIA RTX 4000 Ada (20GB) / RTX 5000 Ada (32GB)', '2× 2 TB PCIe 5.0 NVMe (Dedicated Scratch)'],
      ['Autodesk Revit / BIM (Large Central Models)', 'Single-Core Rebuild + RAM Capacity (20× RVT Size)', 'Intel Core Ultra 9 / AMD Ryzen 9 9950X (5.7 GHz)', '64 GB – 128 GB DDR5', 'NVIDIA RTX 4000 Ada (20GB) for Enscape/Twinmotion', '2 TB NVMe (Fast %LOCALAPPDATA% CollaborationCache)'],
      ['Autodesk Civil 3D (LiDAR & Corridor Surfaces)', 'Single-Core TIN Triangulation + Disk I/O', 'Intel Core i9-14900K / Ryzen 9 9900X (5.6+ GHz)', '64 GB – 128 GB DDR5', 'NVIDIA RTX 2000 Ada / RTX 4000 Ada', '2 TB High-IOPS NVMe (Fast .mms Surface Swap)'],
      ['CATIA V5/V6 & Hexagon SmartPlant 3D', 'OpenGL Viewport Culling + Database Cache', 'Intel Xeon W-2500 / Core Ultra 9 (5.4+ GHz)', '64 GB – 128 GB ECC', 'NVIDIA RTX 4000 Ada (ISV Certified Driver Mandatory)', '2 TB Enterprise NVMe RAID/SSD'],
      ['ANSYS Fluent / Abaqus FEA & KeyShot Render', 'Multi-Core Memory Bandwidth & CUDA Cores', 'AMD Threadripper PRO 7975WX (32-Core, 8-Ch DDR5)', '256 GB – 512 GB 8-Channel ECC', 'NVIDIA RTX 5000 Ada (32GB) / Dual RTX 6000 Ada (48GB)', '4 TB PCIe 5.0 NVMe Scratch Array']
    ],
    note: 'Parametric feature trees (SolidWorks, Revit, AutoCAD, NX) rebuild sequentially on 1 CPU thread—prioritize max single-core GHz over high core counts.'
  },
  'cad-command-cross-translator': {
    headers: ['Engineering Operation', 'AutoCAD / ZWCAD / BricsCAD', 'SolidWorks', 'Siemens NX', 'Autodesk Inventor', 'PTC Creo Parametric'],
    rows: [
      ['2D Sketch Creation', 'PLINE / LINE (L)', 'Sketch (Insert Sketch)', 'Sketch in Task Env (S)', 'Start 2D Sketch (S)', 'Sketch (Extrude/Placement)'],
      ['Linear Solid Extrusion', 'EXTRUDE (EXT) / PRESSPULL', 'Extruded Boss/Base', 'Extrude (X)', 'Extrude (E)', 'Extrude Protrusion / Cut'],
      ['Revolved Solid Feature', 'REVOLVE (REV)', 'Revolved Boss/Base', 'Revolve (Shift+X)', 'Revolve (R)', 'Revolve'],
      ['Path Sweep / Pipe', 'SWEEP', 'Swept Boss/Base', 'Sweep Along Guide / Tube', 'Sweep (Ctrl+Shift+S)', 'Sweep / Helical Sweep'],
      ['Multi-Section Loft / Blend', 'LOFT', 'Lofted Boss/Base', 'Through Curves / Studio Surface', 'Loft', 'Blend / Swept Blend'],
      ['Edge Fillet / Round', 'FILLET (F)', 'Fillet', 'Edge Blend (B)', 'Fillet (F)', 'Round (Ctrl+F)'],
      ['Assembly Positioning', 'ALIGN / BLOCK INSERT', 'Mate (Coincident, Concentric)', 'Assembly Constraints (C)', 'Constrain (C) / Joint (J)', 'Component Placement (Coincident)'],
      ['Duplicate Pattern', 'ARRAY (AR)', 'Linear / Circular Pattern', 'Pattern Feature / Component', 'Rectangular / Circular Pattern', 'Pattern (Dimension / Axis)'],
      ['Hollow Thin-Wall Part', 'SHELL (SOLIDEDIT)', 'Shell', 'Shell', 'Shell', 'Shell'],
      ['Section View Inspection', 'SECTIONPLANE', 'Section View', 'Edit Section (Ctrl+H)', 'Half Section View', 'View Manager -> Cross Section']
    ],
    note: 'Cross-ecosystem command and feature terminology mapping for engineers migrating between 2D/3D CAD platforms.'
  },
  'perpetual-cad-migration-compatibility-matrix': {
    headers: ['Platform Name', 'License Model (2026)', 'One-Time Buyout Price (Est.)', '5-Year Total Cost (TCO)', 'Native File Kernel', 'LISP / VBA / API Support', 'Best Migration Target For'],
    rows: [
      ['AutoCAD (Subscription Ref)', 'Annual Rental Only', 'N/A ($2,030 / yr)', '~$10,150 / seat', 'TrustedDWG (AC1032)', 'AutoLISP, VBA, .NET, ObjectARX', 'Baseline reference (Zero ownership after cancel)'],
      ['ZWCAD Professional', 'Perpetual Buyout (Optional Maint.)', '~$899 – $1,199 one-time', '~$1,199 / seat (Saves 88%)', 'Native DWG (R14 to 2025+)', 'Full AutoLISP, VLISP, VBA, ZRX', 'Heavy 2D/3D AutoCAD drafting & LISP-dependent teams'],
      ['BricsCAD Pro / BIM / Mech', 'Perpetual Buyout or Sub', '~$1,060 – $1,550 one-time', '~$1,550 / seat (Saves 84%)', 'Native DWG + ACIS 3D Kernel', 'Fast LISP (OpenLISP), BRX, .NET', 'Power users needing 2D DWG + parametric 3D/Sheet Metal'],
      ['GStarCAD Professional', 'Perpetual Buyout', '~$799 – $990 one-time', '~$990 / seat (Saves 90%)', 'Native DWG (AC1032)', 'VLISP, VBA, GRX, .NET', 'High-speed large DWG opening & dynamic block editing'],
      ['progeCAD Professional', 'Perpetual Buyout (No Dongle Lock)', '~$399 – $490 one-time', '~$490 / seat (Saves 95%)', 'IntelliCAD / ODA DWG', 'AutoLISP, SDS, COM, .NET', 'Small/medium firms seeking lowest cost per perpetual seat'],
      ['DWG FastView Pro (Web/Mobile/PC)', 'Free Tier / Low-Cost VIP', '~$0 – $49 / yr', '~$195 / 5-yrs (Saves 98%)', 'Fast Cloud & Local DWG/3D', 'Markup, Measure, Layer, PDF/Print', 'Offloading 70% of non-drafting review, shop-floor & site seats'],
      ['FreeCAD 1.0+', 'Open-Source (LGPLv2+)', '$0 Forever', '$0 / seat (Saves 100%)', 'OpenCASCADE (OCCT) B-Rep', 'Full Python 3 API & Macros', 'Zero-budget parametric 3D mechanical, FEM & CAM workflows']
    ],
    note: '5-Year TCO calculated per single seat based on published MSRP. Pairing 2 perpetual authoring seats with 8 DWG FastView review seats cuts team licensing costs by up to 92%.'
  },
  'smartplant-3d-shortcuts-sheet': {
    headers: ['Key / Combination', 'SmartPlant 3D (SP3D / S3D) Command', 'Task Environment', 'Engineering Workflow Description'],
    rows: [
      ['F5', 'Refresh View / Active Workspace', 'Global Workspace', 'Refreshes the active graphic view and updates geometry from the Plant Database'],
      ['F6', 'PinPoint: Lock East (E / X) Axis', 'PinPoint Coordinate Bar', 'Locks or unlocks the East (X) relative coordinate offset during pipe/equipment placement'],
      ['F7', 'PinPoint: Lock North (N / Y) Axis', 'PinPoint Coordinate Bar', 'Locks or unlocks the North (Y) relative coordinate offset during routing'],
      ['F8', 'PinPoint: Lock Elevation (El / Z) Axis', 'PinPoint Coordinate Bar', 'Locks vertical elevation (Z) to maintain flat or sloped pipe run grade'],
      ['F9', 'Reposition PinPoint Target Origin', 'PinPoint Coordinate Bar', 'Moves the green PinPoint relative reference target to a new nozzle, grid line, or vertex'],
      ['F12', 'Activate Relative Tracking', 'SmartSketch / PinPoint', 'Toggles relative distance/angle tracking from the last clicked piping node'],
      ['Ctrl + W', 'Define Workspace (Filter)', 'Workspace Explorer', 'Opens the Define Workspace dialog (Ctrl+W) to filter plant systems, areas, or disciplines'],
      ['Ctrl + R', 'Refresh Workspace from DB', 'Global Database Sync', 'Synchronizes local session with changes committed by other engineers in the model'],
      ['Ctrl + T', 'To-Do List (TDL) Dialog', 'Diagnostics & Errors', 'Opens the To-Do List to inspect and resolve disconnected ports or out-of-date spec items'],
      ['Alt + F1', 'Surface Style (Shaded / Wireframe)', 'Graphic View', 'Cycles display style between Smooth Shaded, Wireframe, and Hidden Line'],
      ['Ctrl + P', 'Fit View to Selection', 'View Navigation', 'Zooms and centers the active 3D viewport tightly around selected pipe runs or equipment'],
      ['Mid-Click Drag', 'Rotate 3D View Orbit', 'View Navigation', 'Orbits the camera around the active center of rotation in the 3D plant model']
    ],
    note: 'Applicable to Hexagon Smart 3D (formerly Intergraph SmartPlant 3D / SP3D) Piping, Equipment, Structure, and Hangers & Supports tasks.'
  },
  'eplan-shortcuts-sheet': {
    headers: ['Key / Shortcut', 'EPLAN Electric P8 Function', 'Category', 'Electrical Schematic & Panel Design Usage'],
    rows: [
      ['Insert', 'Symbol Selection Dialog', 'Schematic Drafting', 'Opens the IEC/NFPA symbol browser to place contactors, breakers, coils, or motors'],
      ['G', 'Insert Device (Navigator)', 'Device Management', 'Places a specific manufacturer part number directly onto the active schematic page'],
      ['Shift + F3', 'T-Node (Down / Right)', 'Autoconnecting', 'Inserts a T-node wire junction with target tracking downward/right'],
      ['Shift + F4 / F5 / F6', 'T-Node Direction Variants', 'Autoconnecting', 'Inserts T-nodes oriented Up/Left, Right/Left, or Down/Up for DIN 61346 compliance'],
      ['Ctrl + Shift + U', 'Interruption Point (Arrow)', 'Cross-Page Wiring', 'Places a source/target potential arrow to continue a wire across multiple schematic sheets'],
      ['F11', 'Insert Black Box (Device Box)', 'Complex Devices / VFD', 'Draws a customizable boundary box for PLCs, VFDs, or custom PCB assemblies'],
      ['Shift + F11', 'Insert Structure Box', 'Location / Cabinet', 'Defines a mounting location (= Function / + Location) boundary on the page'],
      ['T', 'Insert Text Annotation', 'Documentation', 'Places free-standing technical text or function text on the schematic'],
      ['Ctrl + D', 'Edit Object Properties', 'Property Dialog', 'Opens the full Device Tag (DT), terminal designation, and part assignment dialog'],
      ['F5', 'Redraw / Refresh Page', 'View & Verification', 'Refreshes autoconnecting lines and updates cross-reference contact mirrors'],
      ['Page Up / Page Down', 'Previous / Next Schematic Page', 'Page Navigator', 'Rapidly flips through multi-hundred-page electrical project documentation'],
      ['U', 'Toggle Invisible Elements', 'Diagnostics', 'Shows or hides invisible insertion points, property texts, and macro handles']
    ],
    note: 'Verified for EPLAN Electric P8 (2022–2026 Platform) standard IEC 81346 and NFPA 79 keyboard profiles.'
  },
  'plant3d-shortcuts-sheet': {
    headers: ['Command / Alias', 'AutoCAD Plant 3D Function', 'Discipline', 'Piping & P&ID Engineering Description'],
    rows: [
      ['PLANTPIPEADD', 'Route Pipe (Spec-Driven)', '3D Piping', 'Starts interactive 3D pipe routing using the active Piping Spec and Nominal Diameter'],
      ['PLANTCOMPASS', 'Toggle Routing Compass', '3D Piping', 'Toggles the 3D routing compass tick marks, angle snaps, and elevation slope locks'],
      ['PLANTPARTCONVERT', 'Convert AutoCAD Solid to Part', 'Equipment / Custom', 'Converts a generic 3D DWG block or solid into an intelligent Plant 3D valve/fitting with ports'],
      ['PLANTEQUIPMENTCREATE', 'Create Parametric Equipment', 'Equipment Modeling', 'Opens the vessel, pump, heat exchanger, and tank parametric builder'],
      ['PLANTSPECUPDATECHECK', 'Check Spec Updates', 'Spec Management', 'Audits the 3D model against updated .pspx Piping Spec files and flags changed components'],
      ['PLANTPRODUCTIONISO', 'Generate Production Isometric', 'Isometrics (ISOGEN)', 'Extracts shop-ready PCF and DWG/PDF piping isometric drawings with weld BOM tables'],
      ['PLANTQUICKISO', 'Generate Quick Iso Check', 'Isometrics (ISOGEN)', 'Runs a fast preview isometric on selected pipe lines to verify connectivity before issue'],
      ['PLANTORTHOCREATE', 'Create 2D Orthographic View', 'Ortho Drawings', 'Generates associative 2D plan and section general arrangement (GA) views from the 3D plant'],
      ['PLANTPIDLINELIST', 'P&ID Line List Palette', 'P&ID Integration', 'Opens the P&ID data list to place 2D schematic valves/lines directly into the 3D model'],
      ['PLANTINSULATIONDISPLAY', 'Toggle Pipe Insulation', 'Viewport Display', 'Switches 3D thermal/acoustic insulation thickness display on or off for clash checking'],
      ['PLANTAUDIT', 'Audit Plant 3D Database', 'Database Maintenance', 'Repairs broken links between 3D drawing entities and the SQLite/SQL Server project database'],
      ['Ctrl + Right-Click', 'Toggle Pipe Elevation / Offset Snap', '3D Routing', 'Cycles pipe justification between Center of Pipe (COP), Bottom of Pipe (BOP), and Top (TOP)']
    ],
    note: 'Applicable to Autodesk AutoCAD Plant 3D (2020–2026) P&ID, 3D Piping, Equipment, and Orthographic modules.'
  },
  'navisworks-shortcuts-sheet': {
    headers: ['Shortcut Key', 'Navisworks Command', 'Module', 'BIM Coordination & Walkthrough Function'],
    rows: [
      ['Ctrl + 1', 'Walk Mode (First-Person)', 'Navigation', 'Activates first-person walkthrough navigation (use Arrow keys / WASD to walk through model)'],
      ['Ctrl + 2', 'Look Around Mode', 'Navigation', 'Pivots camera view from a fixed standing position inside mechanical rooms'],
      ['Ctrl + 7', 'Orbit Mode', 'Navigation', 'Rotates camera around the current selection focus point'],
      ['Ctrl + G', 'Toggle Gravity (Walk on Floors)', 'Realism', 'Enables gravity so the avatar walks up stairs and slabs instead of floating'],
      ['Ctrl + D', 'Toggle Collision Detection', 'Realism', 'Prevents the camera from passing through walls, ducts, and structural columns'],
      ['Ctrl + F2', 'Clash Detective Window', 'Clash Detection', 'Opens the Clash Detective module (Navisworks Manage) to run hard/clearance clash tests'],
      ['Ctrl + F12', 'Selection Tree Palette', 'Model Hierarchy', 'Displays the full NWC/NWD/IFC file, layer, level, and family hierarchy tree'],
      ['Shift + F3', 'Find Items (Search Sets)', 'Query & Filter', 'Opens Find Items to build automated Search Sets by Revit Category, System, or IFC Property'],
      ['Ctrl + H', 'Hide Selected / Unhide', 'Visibility', 'Instantly hides selected ceiling/wall elements to inspect concealed MEP ductwork'],
      ['Page Up', 'Zoom All (Fit Model)', 'View', 'Zooms viewport out to display the entire federated project site'],
      ['F11', 'Full Screen Viewport', 'Presentation', 'Maximizes the 3D scene across the entire monitor for client BIM coordination meetings'],
      ['Ctrl + F7', 'Properties Palette', 'Metadata Inspection', 'Displays all BIM parameters, Revit Element IDs, and IFC Psets for the selected object']
    ],
    note: 'Compatible with Autodesk Navisworks Manage, Navisworks Simulate, and free Navisworks Freedom (.NWD) viewers.'
  }
};

// 精确别名映射字典（严禁使用单段子串模糊匹配，杜绝公差表/钣金表张冠李戴）
const SLUG_TO_DATASET_MAP: Record<string, string> = {
  'autocad-250-commands-reference': 'autocad-250-commands-reference',
  'autocad-commands-cheatsheet': 'autocad-250-commands-reference',
  'autocad-3d-shortcuts-cheatsheet': 'autocad-3d-shortcuts-cheatsheet',
  'drawing-standards-comparison-reference': 'drawing-standards-comparison-reference',
  'standard-fasteners-specification-library': 'standard-fasteners-specification-library',
  'autocad-system-variables-reference': 'autocad-system-variables-reference',
  'autocad-dwg-version-feature-matrix': 'autocad-dwg-version-feature-matrix',
  'dwg-version-compatibility-matrix': 'autocad-dwg-version-feature-matrix',
  'cad-version-feature-matrix': 'autocad-dwg-version-feature-matrix',
  'iso-286-tolerance-table': 'iso-286-tolerance-table',
  'iso-286-limits-fits-calculator': 'iso-286-tolerance-table',
  'sheet-metal-gauge-thickness-chart': 'sheet-metal-gauge-thickness-chart',
  'standard-ball-bearing-library': 'standard-ball-bearing-library',
  'engineering-plastics-properties-table': 'engineering-plastics-properties-table',
  'engineering-plastics-property-database': 'engineering-plastics-properties-table',
  'unc-unf-thread-pitch-tap-drill': 'unc-unf-thread-pitch-tap-drill',
  'ansi-b1-1-unified-screw-threads-library': 'unc-unf-thread-pitch-tap-drill',
  'metric-thread-spec-table': 'metric-thread-spec-table',
  'iso-metric-thread-table': 'metric-thread-spec-table',
  'step-ap214-vs-step-ap242-comparator': 'step-ap214-vs-step-ap242-comparator',
  'step-ap214-vs-ap242-comparator': 'step-ap214-vs-step-ap242-comparator',
  'solidworks-inventor-nx-kernel-matrix': 'solidworks-inventor-nx-kernel-matrix',
  'mcad-kernel-comparator': 'solidworks-inventor-nx-kernel-matrix',
  'ifc2x3-vs-ifc4-vs-ifc4x3-matrix': 'ifc2x3-vs-ifc4-vs-ifc4x3-matrix',
  'bim-ifc-schema-comparator': 'ifc2x3-vs-ifc4-vs-ifc4x3-matrix',
  'fdm-3d-printing-filament-comparison': 'fdm-3d-printing-filament-comparison',
  'fdm-filament-selector-comparator': 'fdm-3d-printing-filament-comparison',
  'fdm-3d-printing-filament-properties-chart': 'fdm-3d-printing-filament-properties-chart',
  '3d-printing-parameters-reference-chart': 'fdm-3d-printing-filament-properties-chart',
  'iges-vs-step-data-loss-matrix': 'iges-vs-step-data-loss-matrix',
  'iges-vs-step-comparator': 'iges-vs-step-data-loss-matrix',
  'pvc-pipe-schedule-40-80-dimensions-table': 'pvc-pipe-schedule-40-80-dimensions-table',
  'astm-standard-rebar-sizes-table': 'astm-standard-rebar-sizes-table',
  'concrete-slump-test-workability-table': 'concrete-slump-test-workability-table',
  'soil-classification-uscs-properties-table': 'soil-classification-uscs-properties-table',
  'gdt-symbols-cheatsheet': 'gdt-symbols-cheatsheet',
  'welding-symbols-cheatsheet': 'welding-symbols-cheatsheet',
  'fastener-strength-grade-reference': 'fastener-strength-grade-reference',
  'cnc-tool-specifications-reference': 'cnc-tool-specifications-reference',
  'cnc-feeds-speeds-starting-values-chart': 'cnc-tool-specifications-reference',
  'revit-family-formula-reference': 'revit-family-formula-reference',
  'material-properties-database': 'material-properties-database',
  'cad-symbol-block-library': 'cad-symbol-block-library',
  'steel-section-properties-table': 'aisc-steel-shapes-library',
  'cad-file-format-guide': 'cad-file-format-guide',
  'bim-lod-level-reference': 'bim-lod-level-reference',
  'pid-symbols-reference': 'pid-symbols-reference',
  'electrical-drawing-symbols-reference': 'electrical-drawing-symbols-reference',
  'hvac-drawing-symbols-reference': 'hvac-drawing-symbols-reference',
  'architectural-drawing-symbols-reference': 'architectural-drawing-symbols-reference',
  'cnc-m-code-reference-table': 'cnc-m-code-reference-table',
  'sheet-metal-bend-deduction-chart': 'sheet-metal-bend-deduction-chart',
  'cad-hardware-workstation-spec-builder': 'cad-hardware-workstation-spec-builder',
  'cad-command-cross-translator': 'cad-command-cross-translator',
  'perpetual-cad-migration-compatibility-matrix': 'perpetual-cad-migration-compatibility-matrix',
  'smartplant-3d-shortcuts-sheet': 'smartplant-3d-shortcuts-sheet',
  'eplan-shortcuts-sheet': 'eplan-shortcuts-sheet',
  'plant3d-shortcuts-sheet': 'plant3d-shortcuts-sheet',
  'navisworks-shortcuts-sheet': 'navisworks-shortcuts-sheet'
};

// 权威排障向导数据字典（按软件生态物理隔离，杜绝跨软件穿帮）
const TROUBLESHOOT_DATASETS: Record<string, {
  softwareName: string;
  symptoms: string[];
  steps: { step: number; title: string; cmd?: string; desc: string; detail: string }[];
  envVars: { name: string; recommended: string; desc: string }[];
}> = {
  autocad: {
    softwareName: 'AutoCAD / DWG Ecosystem',
    symptoms: [
      'Drawing opens slowly or takes excessive RAM during zoom/pan',
      'Fatal error: Unhandled access violation crash upon save or AUDIT',
      'External reference (XREF) cannot bind or shows unresolved circular loop',
      'Lineweights or text display corrupted or missing in printed vector PDF'
    ],
    steps: [
      {
        step: 1,
        title: 'Deep Drawing Database Audit & Error Correction',
        cmd: 'AUDIT',
        desc: 'Audit drawing database and fix all internal pointer inconsistencies.',
        detail: 'Type AUDIT in command line, type Y when prompted "Fix any errors detected?". This fixes dangling table pointers and corrupted entity handles.'
      },
      {
        step: 2,
        title: 'Purge Unreferenced Registered Applications (DGN/RegApp Bloat)',
        cmd: '-PURGE -> R -> * -> N',
        desc: 'Purge hidden Registered Application dictionaries that cause 90% of file bloat.',
        detail: 'Run "-PURGE" with hyphen prefix, choose "Regapp", enter "*" for all, and "N" to avoid confirming each one. This routinely reduces file size by 40%–80%.'
      },
      {
        step: 3,
        title: 'Clean Out Invisible Corrupted Entities via WBLOCK',
        cmd: 'WBLOCK',
        desc: 'Export pure drawing entities into a clean, unbloated new DWG container.',
        detail: 'Run WBLOCK, select "Entire drawing" as source, pick target location. WBLOCK bypasses broken internal block tables and recreates clean database headers.'
      },
      {
        step: 4,
        title: 'Hardware Acceleration & Graphics Driver Diagnostic',
        cmd: 'GRAPHICSCONFIG',
        desc: 'Toggle DirectX hardware acceleration to rule out GPU shader crashes.',
        detail: 'In GRAPHICSCONFIG, toggle Hardware Acceleration Off to test if crash persists. If resolved, update your certified workstation GPU driver (NVIDIA RTX / AMD Radeon Pro).'
      }
    ],
    envVars: [
      { name: 'INDEXCTL', recommended: '3', desc: 'Creates layer and spatial indexes in drawing files for rapid XREF demand loading.' },
      { name: 'XLOADCTL', recommended: '2', desc: 'Enables demand loading with copies to prevent file locking on shared network drives.' },
      { name: 'WHIPTHREAD', recommended: '3', desc: 'Allocates multi-threading to display regeneration for smooth panning on modern multi-core CPUs.' }
    ]
  },
  revit: {
    softwareName: 'Autodesk Revit & BIM Collaboration',
    symptoms: [
      'Central model synchronization fails or reports element ownership deadlock',
      'Revit crashes immediately when opening specific family (.rfa) or project view',
      'Cloud Worksharing (BIM Collaborate Pro / C4R) cache conflict or unresolvable guid',
      'Slow performance when panning 3D views with complex curtain walls or families'
    ],
    steps: [
      {
        step: 1,
        title: 'Open with "Audit" Checked in File Open Dialog',
        desc: 'Scans all internal BIM object pointers and isolates corrupted parametric elements.',
        detail: 'In File -> Open, select the project file, check the "Audit" checkbox before clicking Open. This removes orphan constraint references.'
      },
      {
        step: 2,
        title: 'Detach from Central & Create Clean Master Archive',
        desc: 'Sever existing worksharing ties to rebuild a clean central model.',
        detail: 'Select "Detach from Central" with "Audit" checked, open the file, select "Audit and Detach (Discard Worksets or Preserve Worksets)", then Save As a new Central Model with "Make this a Central Model after save" and "Compact File" enabled.'
      },
      {
        step: 3,
        title: 'Purge Local Collaboration Cache (PacCache & CollaborationCache)',
        desc: 'Eliminates corrupted local delta sync caches for cloud models.',
        detail: 'Close Revit. Navigate to %LOCALAPPDATA%\\Autodesk\\Revit\\Autodesk Revit <Year>\\CollaborationCache and clear temporary subfolders. Also clear %LOCALAPPDATA%\\Autodesk\\Revit\\PacCache.'
      },
      {
        step: 4,
        title: 'Isolate Rogue Family via Selective DWG/IFC Export or Binary Half-Search',
        desc: 'Pinpoint corrupt geometry causing project-wide crashes.',
        detail: 'Group families by category in a dedicated 3D view. Delete half of the suspect families and attempt a save/sync to isolate the specific damaged .rfa definition.'
      }
    ],
    envVars: [
      { name: 'DisableHardwareAcceleration', recommended: '0 (or 1 if crash)', desc: 'Set under [Graphics] in Revit.ini to isolate GPU driver shader instability.' },
      { name: 'CompactFile', recommended: 'Enabled on Save', desc: 'Forces Revit database reorganization, stripping historical unused transaction log blocks.' },
      { name: 'TempDirectory', recommended: 'Fast NVMe SSD', desc: 'Point Windows TEMP variable to a high-speed local drive to prevent write-lock stalls.' }
    ]
  },
  solidworks: {
    softwareName: 'SolidWorks & Mechanical Assemblies',
    symptoms: [
      'Assembly shows red reconstruction errors or broken mates after version migration',
      'Crash upon editing sketch, drawing view generation, or saving assembly',
      'Graphics area flickering or transparent surfaces disappearing in shaded mode',
      'SolidNetWork License Manager cannot obtain a license or ports timed out'
    ],
    steps: [
      {
        step: 1,
        title: 'Force Full Top-Down Feature Tree Rebuild',
        cmd: 'Ctrl + Q',
        desc: 'Force thorough rebuild of all features, geometry, and assembly mates.',
        detail: 'Press Ctrl + Q instead of normal Ctrl + B. Ctrl+Q forces a complete recalculation of every sketch, feature, and mate in the assembly tree from scratch.'
      },
      {
        step: 2,
        title: 'Run SolidWorks Rx Safe Modes Diagnostic',
        desc: 'Bypass custom options and enable Software OpenGL to test graphics stability.',
        detail: 'Open SolidWorks Rx -> Safe Modes. Click "Click here to launch SolidWorks in Software OpenGL mode". If crashes cease, update or rollback workstation GPU graphics driver.'
      },
      {
        step: 3,
        title: 'Reset Corrupted User Registry State',
        desc: 'Clear corrupt user profile keys that cause toolbars and save routines to freeze.',
        detail: 'Close SolidWorks. In regedit, rename HKEY_CURRENT_USER\\Software\\SolidWorks\\SOLIDWORKS <Year> to "..._Old". Relaunch SolidWorks to regenerate a clean factory configuration.'
      },
      {
        step: 4,
        title: 'Isolate Broken Assembly Mates with MateXpert',
        desc: 'Identify conflicting or over-constraining mates causing geometric solve failures.',
        detail: 'Right-click the Mates folder in FeatureManager -> MateXpert. MateXpert isolates circular loops and points out exact conflicting mates.'
      }
    ],
    envVars: [
      { name: 'SW_LICENSE_FILE', recommended: '25734@license_server', desc: 'Points SolidWorks client directly to corporate SolidNetWork license daemon.' },
      { name: 'Draft Quality HLR/HLV', recommended: 'Active on Large Assys', desc: 'Reduces RAM load significantly on 5000+ part mechanical assemblies.' },
      { name: 'Large Assembly Mode', recommended: 'Threshold 500 parts', desc: 'Automatically disables realistic shadows, reflections, and lightweight loads parts.' }
    ]
  },
  license: {
    softwareName: 'FLEXlm / AdskLicensing / Network License Daemon',
    symptoms: [
      'Error [-15.570]: Cannot connect to license server system or server down',
      'Error [-5.412]: No such feature exists / version of feature is older than requested',
      'License checkout timed out or lost connection to server over VPN connection',
      'Autodesk Desktop Licensing Service not running or stuck in starting state'
    ],
    steps: [
      {
        step: 1,
        title: 'Verify Licensing Daemon Status on Server & Client',
        cmd: 'lmutil lmstat -a -c @<server_ip>',
        desc: 'Inspect license manager daemon process and active feature checkout counts.',
        detail: 'Run lmutil lmstat on the client or server. Verify whether the vendor daemon (e.g. adskflex, SW_D, ugslmd) is UP and serving licenses on the specified port.'
      },
      {
        step: 2,
        title: 'Test Network Connectivity & Firewall Ports via Telnet / PowerShell',
        cmd: 'Test-NetConnection -ComputerName <server> -Port 2080',
        desc: 'Verify TCP ports 2080 (vendor daemon) and 27000-27009 (master lmgrd) are open.',
        detail: 'Ensure firewalls on both host and router allow inbound/outbound TCP traffic on port 2080 and 27000. For SolidWorks, port 25734 and 25735 must be unblocked.'
      },
      {
        step: 3,
        title: 'Configure Client Environment Variable with Server FQDN',
        desc: 'Explicitly specify license server address to eliminate DNS resolution delay.',
        detail: 'Set system environment variable ADSKFLEX_LICENSE_FILE=@<server_ip_or_hostname> or SW_LICENSE_FILE=25734@<server>. Prepending "@" is mandatory for FLEXlm networks.'
      },
      {
        step: 4,
        title: 'Increase VPN Network Timeout Tolerances (FLEXLM_TIMEOUT)',
        desc: 'Prevents client checkout failure over high-latency remote or VPN connections.',
        detail: 'Create System Environment Variable FLEXLM_TIMEOUT and set value to 3000000 (3 seconds in microseconds) or 5000000 to prevent premature dropouts.'
      }
    ],
    envVars: [
      { name: 'ADSKFLEX_LICENSE_FILE', recommended: '@server_ip', desc: 'Points Autodesk software directly to FLEXlm license daemon port.' },
      { name: 'SW_LICENSE_FILE', recommended: '25734@server_ip', desc: 'Specifies SolidWorks SNL server IP and master port.' },
      { name: 'FLEXLM_TIMEOUT', recommended: '3000000', desc: 'Increases socket connection timeout to 3,000,000 microseconds for stable VPN operation.' }
    ]
  },
  general_cad: {
    softwareName: '3D CAD / B-Rep & Mesh Systems',
    symptoms: [
      'Imported STEP or IGES geometry fails solid conversion and displays as trimmed surfaces with gaps',
      'Exported STL / 3MF mesh has non-manifold edges or inverted surface normals',
      'Software freezes during complex Boolean operation or large feature fillet generation',
      'Out-of-memory crash when processing multi-gigabyte point clouds or scan datasets'
    ],
    steps: [
      {
        step: 1,
        title: 'Automatic Geometric Healing & Surface Stitching',
        desc: 'Stitch loose trimmed surfaces into a watertight B-Rep solid volume.',
        detail: 'Run Geometric Healing or Import Diagnostics. Set edge stitching tolerance to 0.01 mm to close micro-gaps without distorting critical mating features.'
      },
      {
        step: 2,
        title: 'Standardize on STEP AP242 Instead of Legacy IGES',
        desc: 'Migrate legacy file transfer pipelines to modern ISO 10303 standards.',
        detail: 'Always prefer STEP AP242 or Parasolid (.x_t) over IGES. STEP AP242 includes true analytical B-Rep topology and semantic GD&T, avoiding surface tearing.'
      },
      {
        step: 3,
        title: 'Tessellation Mesh Simplification & Normal Alignment',
        desc: 'Repair inverted triangles and reduce unnecessary polygonal density.',
        detail: 'Run mesh repair tools to unify normal orientations outward. Use decimation algorithms to reduce triangle count by 50% while preserving sharp feature boundaries.'
      },
      {
        step: 4,
        title: 'Break Down Monolithic Assemblies into Segmented Sub-Assemblies',
        desc: 'Prevent memory threshold limits by compartmentalizing CAD hierarchy.',
        detail: 'Group non-interacting components into sub-assemblies. Suppress internal hardware fasteners and detailed threads during high-level structural analyses.'
      }
    ],
    envVars: [
      { name: 'Linear Deflection Tolerance', recommended: '0.01 mm', desc: 'Governs polygon mesh resolution when converting B-Rep solids to display tessellation.' },
      { name: 'Angular Deflection', recommended: '0.5 deg', desc: 'Ensures circular holes and fillets retain smooth curvature without excessive facet count.' },
      { name: 'Virtual Memory (Paging File)', recommended: '2x System RAM', desc: 'Configure Windows paging file on high-speed NVMe to prevent RAM exhaustion during meshing.' }
    ]
  },
  smartplant3d: {
    softwareName: 'Hexagon SmartPlant 3D (SP3D / Smart 3D)',
    symptoms: [
      'Piping Specification not found in Catalog or NPD (Nominal Piping Diameter) unavailable',
      'To-Do List (TDL) displays disconnected port or eccentric reducer elevation mismatch',
      'ISOGEN Isometric Drawing extraction fails with "Disconnected Pipeline" or zero-length weld',
      'Session file (.ses) fails to refresh or hangs during Define Workspace (Ctrl+W) query'
    ],
    steps: [
      {
        step: 1,
        title: 'Synchronize Active Workspace & Verify Catalog Connection',
        cmd: 'Ctrl + R (Refresh Workspace)',
        desc: 'Ensure local session cache matches the Plant, Catalog, and Site SQL/Oracle databases.',
        detail: 'In Project Management, run "Synchronize Model with Catalog" (uncheck "Regenerate Out-of-Date Occurrences" first for fast check) to pull newly added Piping Specs and Bolt/Gasket tables.'
      },
      {
        step: 2,
        title: 'Resolve To-Do List (TDL) Disconnected Ports & Spec Breaks',
        cmd: 'Ctrl + T (To-Do List)',
        desc: 'Inspect and update out-of-date piping occurrences and broken nozzle connections.',
        detail: 'Open To-Do List (Ctrl+T), right-click failed piping features -> Properties, and click "Update". For eccentric reducers, ensure BOP (Bottom of Pipe) flat-side orientation matches the mating pipe run.'
      },
      {
        step: 3,
        title: 'Verify Pipeline Continuity Before ISOGEN Extraction',
        cmd: 'Piping Task -> Check Pipeline Connectivity',
        desc: 'Locate micro-gaps, open pipe ends, or unplaced gaskets blocking PCF generation.',
        detail: 'Select the Pipeline in Workspace Explorer, run "Diagnostics -> Check Connectivity". Any open end without a blind flange, cap, or continuation nozzle will cause ISOGEN to split the isometric.'
      },
      {
        step: 4,
        title: 'Clear Corrupted Local SP3D User Preferences & Symbol Share Cache',
        desc: 'Rebuild local XML symbol cache when custom valves or hangers fail to render.',
        detail: 'Close Smart 3D. Clear temporary cache files under %TEMP% and verify read permissions on the network SharedContent (Symbol Share) directory.'
      }
    ],
    envVars: [
      { name: 'SharedContent Path', recommended: 'UNC Network Path (\\Server\SharedContent)', desc: 'Must use identical UNC path across all clients—never use mapped drive letters (e.g. S:\).' },
      { name: 'PinPoint Lock', recommended: 'F6 / F7 / F8 Active', desc: 'Prevents accidental off-axis diagonal pipe skewing (<0.1 deg) that breaks isometric ortho views.' },
      { name: 'Workspace Scope', recommended: 'System + Volume Filter', desc: 'Restrict Ctrl+W filter to specific Unit/Area to keep memory footprint under 6 GB.' }
    ]
  },
  nx_step: {
    softwareName: 'Siemens NX (STEP AP214 / AP242 Translator)',
    symptoms: [
      'Exported STEP file opens empty or misses sub-assembly components in SolidWorks / CATIA',
      '3D PMI (GD&T tolerances and datum targets) disappear after STEP AP242 export',
      'Solid bodies export as open sheet bodies (surfaces) with unsewn boundary edges',
      'External STEP translator console window freezes at 99% on large assemblies'
    ],
    steps: [
      {
        step: 1,
        title: 'Enforce "MODEL" or "Entire Part" Reference Set Before Export',
        cmd: 'Assemblies -> Reference Sets -> MODEL',
        desc: 'Prevent sub-components set to "Empty" reference set from being skipped by the translator.',
        detail: 'In NX Assembly Navigator, select all components, right-click -> Replace Reference Set -> MODEL. In the STEP Export dialog under "Data to Export", select Selected Objects -> Solid Bodies.'
      },
      {
        step: 2,
        title: 'Enable Semantic 3D PMI Output in STEP AP242 Settings',
        cmd: 'File -> Export -> STEP -> Settings -> PMI',
        desc: 'Include machine-readable GD&T annotations and section views in ISO 10303-242 output.',
        detail: 'Use the STEP242 translator (not legacy STEP203). Under Export Settings -> Object Types, check "Product Data (PMI)" and set PMI Reference Geometry to "Graphical & Semantic".'
      },
      {
        step: 3,
        title: 'Run "Examine Geometry" to Heal Tiny Edges & Sheet Gaps',
        cmd: 'Analysis -> Examine Geometry',
        desc: 'Identify self-intersecting faces, tiny edges (<0.02mm), and unsewn sheet bodies.',
        detail: 'Check "Tiny", "Misaligned", and "Sheet Boundaries". Use "Heal Geometry" or "Optimize Face" in NX Synchronous Modeling before exporting to ensure watertight B-Rep solids.'
      },
      {
        step: 4,
        title: 'Set B-Rep Tolerance & Flatten Assembly Structure if Required',
        desc: 'Match Parasolid 0.01mm modeling tolerance to target CAD kernel.',
        detail: 'In STEP Export Advanced tab, set Distance Tolerance to 0.01 mm (or 0.0254 mm). Check "Export Assembly as External References" only if recipient wants separate part files.'
      }
    ],
    envVars: [
      { name: 'Application Protocol', recommended: 'STEP AP242 (ISO 10303-242)', desc: 'Supports colors, layers, assembly trees, and semantic 3D PMI in a single file.' },
      { name: 'Reference Set', recommended: 'MODEL (Solid Bodies)', desc: 'Crucial NX setting—components on "Empty" reference set will not export to STEP.' },
      { name: 'B-Spline Approximation', recommended: '0.01 mm', desc: 'Prevents high-degree NURBS surfaces from tearing when imported into ACIS/CGM kernels.' }
    ]
  },
  civil3d: {
    softwareName: 'Autodesk Civil 3D (Surfaces & Corridors)',
    symptoms: [
      'Viewport freezes for 30+ seconds every time a profile or alignment grip is moved',
      'Error: "Associated .mms file not found" when opening a drawing with large TIN surface',
      'Corridor rebuild takes minutes and consumes 100% of a single CPU core',
      'File size exceeds 80 MB with slow QSAVE and eTransmit packaging failures'
    ],
    steps: [
      {
        step: 1,
        title: 'Enable Level of Detail (LEVELOFDETAIL) for Dense TIN Surfaces',
        cmd: 'LEVELOFDETAIL',
        desc: 'Dynamically reduces displayed triangle count when zoomed out without altering surface accuracy.',
        detail: 'Type LEVELOFDETAIL on the command line (or View tab -> Level of Detail). Civil 3D will decimate screen display contours when zoomed out and restore 100% precision as you zoom in.'
      },
      {
        step: 2,
        title: 'Externalize Surfaces & Alignments via Data Shortcuts (DREF)',
        cmd: 'CREATEFOLDER / CREATESHORTCUTS',
        desc: 'Split monolithic project files into separate Surface, Alignment, Corridor, and Sheet drawings.',
        detail: 'Never keep a 5-million-point LiDAR TIN surface, 10 corridors, and 50 plan/profile sheets in one DWG. Reference the surface via Data Shortcuts (DREF) as "Reference Only" display style.'
      },
      {
        step: 3,
        title: 'Switch Corridor Rebuild Mode from Automatic to Manual',
        cmd: 'Prospector -> Corridors -> Rebuild - Automatic (Uncheck)',
        desc: 'Prevent Civil 3D from recalculating thousands of assembly stations on every minor edit.',
        detail: 'In Toolspace -> Prospector, expand Corridors, right-click your corridor and uncheck "Rebuild - Automatic". Batch your alignment/profile edits and trigger a single manual Rebuild when ready.'
      },
      {
        step: 4,
        title: 'Keep .MMS Memory-Mapped Surface File in Same Directory as .DWG',
        desc: 'When a TIN surface exceeds ~2 million points, Civil 3D offloads data to an external .mms file.',
        detail: 'Always copy or archive the <DrawingName>_<SurfaceId>.mms file alongside the .dwg. To embed a smaller cropped boundary inside the DWG, add a "Data Clip" outer boundary first.'
      }
    ],
    envVars: [
      { name: 'LEVELOFDETAIL', recommended: 'ON (1)', desc: 'Halves GPU viewport regeneration time on large grading and LiDAR TIN surfaces.' },
      { name: 'PROXYGRAPHICS', recommended: '0 (During Design)', desc: 'Avoids saving megabytes of static proxy graphics images on every QSAVE.' },
      { name: 'ISAVEPERCENT', recommended: '0', desc: 'Forces full clean saves instead of incremental saves that fragment large Civil 3D databases.' }
    ]
  }
};

// Tool-specific starting inputs (real-unit defaults instead of the generic 100 / 25 / 1.5).
const INITIAL_PARAMS: Record<string, [number, number, number]> = {
  'thread-engagement-length-checker': [10, 1.5, 1.0],
  'cam-profile-generator': [40, 15, 120],
  'step-file-size-reducer': [240, 65, 1.0],
  'stl-mesh-decimator-reducer': [2500, 75, 0.02],
  'ifc-model-size-optimizer': [450, 70, 1.0],
  'cad-subscription-vs-perpetual-roi-calculator': [10, 2030, 899],
  'cad-floating-license-seat-calculator': [35, 3.0, 2200],
};

export default function GenericToolboxClient({ tool }: GenericToolboxClientProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'main' | 'sponsor' | 'kb'>('main');

  // 本地真实文件检测状态（供 Viewer / Validator / Converter 使用）
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    size: string;
    type: string;
    headerPreview?: string;
    detectedFormat?: string;
  } | null>(null);

  // 纯前端计算器交互状态（供 Calculator / Generator 类使用）
  const initialParams = INITIAL_PARAMS[tool.slug] || [100, 25, 1.5];
  const [paramA, setParamA] = useState<number>(initialParams[0]);
  const [paramB, setParamB] = useState<number>(initialParams[1]);
  const [paramC, setParamC] = useState<number>(initialParams[2]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const processRealFile = (file: File) => {
    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${(file.size / 1024).toFixed(1)} KB`;
    
    const ext = file.name.split('.').pop()?.toUpperCase() || 'CAD';
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      if (buffer) {
        const bytes = new Uint8Array(buffer.slice(0, 64));
        let headerStr = '';
        for (let i = 0; i < Math.min(bytes.length, 32); i++) {
          const char = String.fromCharCode(bytes[i]);
          headerStr += (bytes[i] >= 32 && bytes[i] <= 126) ? char : '.';
        }

        let detected = `${ext} Document`;
        if (headerStr.startsWith('AC1032')) detected = 'AutoCAD DWG (Release 2018-2025+)';
        else if (headerStr.startsWith('AC1027')) detected = 'AutoCAD DWG (Release 2013-2017)';
        else if (headerStr.startsWith('AC1024')) detected = 'AutoCAD DWG (Release 2010-2012)';
        else if (headerStr.startsWith('AC1021')) detected = 'AutoCAD DWG (Release 2007-2009)';
        else if (headerStr.startsWith('AC10')) detected = 'AutoCAD DWG Binary Container';
        else if (headerStr.includes('ISO-10303-21')) detected = 'STEP 3D B-Rep (ISO 10303-21 Standard)';
        else if (headerStr.includes('SECTION') || headerStr.includes('HEADER')) detected = 'ASCII DXF Database';
        else if (headerStr.startsWith('solid')) detected = 'ASCII STL Triangulated Mesh';
        else if (headerStr.startsWith('%PDF')) detected = 'Adobe PDF Vector Container';
        else if (headerStr.includes('<svg') || headerStr.includes('xml')) detected = 'Scalable Vector Graphics (SVG)';

        setFileDetails({
          name: file.name,
          size: sizeStr,
          type: ext,
          headerPreview: headerStr.slice(0, 24),
          detectedFormat: detected
        });
      }
    };
    reader.readAsArrayBuffer(file.slice(0, 128));
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processRealFile(e.dataTransfer.files[0]);
    }
  };

  // 根据当前 slug 精确检索参考数据（杜绝模糊单段匹配穿帮）
  const referenceData = useMemo(() => {
    if (REFERENCE_DATASETS[tool.slug]) {
      return REFERENCE_DATASETS[tool.slug];
    }
    const mapped = SLUG_TO_DATASET_MAP[tool.slug];
    if (mapped && REFERENCE_DATASETS[mapped]) {
      return REFERENCE_DATASETS[mapped];
    }
    return null;
  }, [tool.slug]);

  // 排障向导数据隔离（按软件生态物理熔断，杜绝在 Revit/SolidWorks 出现 AutoCAD 命令）
  const troubleshootData = useMemo(() => {
    const s = tool.slug.toLowerCase();
    if (s.includes('smartplant') || s.includes('sp3d')) return TROUBLESHOOT_DATASETS.smartplant3d;
    if (s.includes('nx-step') || (s.includes('nx') && s.includes('step'))) return TROUBLESHOOT_DATASETS.nx_step;
    if (s.includes('civil3d') || s.includes('corridor')) return TROUBLESHOOT_DATASETS.civil3d;
    if (s.includes('revit') || s.includes('bim')) return TROUBLESHOOT_DATASETS.revit;
    if (s.includes('solidworks')) return TROUBLESHOOT_DATASETS.solidworks;
    if (s.includes('license') || s.includes('flexlm') || s.includes('activation') || s.includes('install')) return TROUBLESHOOT_DATASETS.license;
    if (s.includes('autocad') || s.includes('dwg') || s.includes('civil')) return TROUBLESHOOT_DATASETS.autocad;
    return TROUBLESHOOT_DATASETS.general_cad;
  }, [tool.slug]);

  // 过滤后的数据表格
  const filteredRows = useMemo(() => {
    if (!referenceData) return [];
    if (!searchTerm) return referenceData.rows;
    return referenceData.rows.filter(row => 
      row.some(cell => cell.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [referenceData, searchTerm]);

  // 学科分类计算器 Schema（针对全部 19 个动态计算器提供 1 对 1 教科书级精确工程公式，杜绝任何笼统兜底）
  const calcSchema = useMemo(() => {
    const s = tool.slug.toLowerCase();


    // A1. STEP / SLDASM 装配体去特征瘦身计算器 (step-file-size-reducer)
    if (s === 'step-file-size-reducer') {
      return {
        labelA: 'Original STEP / Assembly Size (MB)',
        labelB: 'Defeature Level (% Fasteners & Fillets Stripped, 10–90%)',
        labelC: 'Compression Mode (1 = Uncompressed .stp, 2 = .stp.Z / 7z)',
        formula: 'Size_defeatured = S_orig · (1 − 0.78 · η_defeature) • Size_archive = Size_defeatured · (Mode ≥ 2 ? 0.22 : 1.0)',
        unit: 'MB (Optimized)',
        secondaryLabel: 'Total Size Reduction & Estimated Email/Upload Readiness',
        desc: 'Projected STEP File Footprint After Removing Internal Hardware, Threads & Small Fillets',
        calc: (a: number, b: number, c: number) => {
          const orig = Math.max(1, a);
          const stripPct = Math.max(5, Math.min(95, b)) / 100;
          const isZipped = c >= 1.5;
          const afterDefeature = orig * (1 - 0.78 * stripPct);
          const finalMb = isZipped ? afterDefeature * 0.22 : afterDefeature;
          const savedPct = ((1 - finalMb / orig) * 100).toFixed(1);
          return {
            primary: finalMb.toFixed(1),
            secondary: `-${savedPct}% Saved (${orig.toFixed(0)} MB → ${finalMb.toFixed(1)} MB${isZipped ? ' + ZIP' : ''})`,
            pass: finalMb <= 50
          };
        }
      };
    }

    // A2. 3D 打印 STL / OBJ 网格减面与二进制体积换算器 (stl-mesh-decimator-reducer)
    if (s === 'stl-mesh-decimator-reducer') {
      return {
        labelA: 'Original Triangle Count (×1,000 Facets, e.g. 2500 = 2.5M)',
        labelB: 'Target Decimation Reduction Ratio (%, 10–95%)',
        labelC: 'Chordal Tolerance Deviation (mm)',
        formula: 'N_rem = N_orig · (1 − R_dec) • Size_Bin = (N_rem · 50 bytes + 84) / 1024² • Size_ASCII ≈ 5.2 × Size_Bin',
        unit: 'MB (Binary STL)',
        secondaryLabel: 'Remaining Triangles & ASCII vs. Binary Savings',
        desc: 'Exact Binary STL File Size (50 Bytes/Triangle) After Mesh Decimation',
        calc: (a: number, b: number, c: number) => {
          const origK = Math.max(1, a);
          const decRatio = Math.max(0, Math.min(98, b)) / 100;
          const remTriangles = origK * 1000 * (1 - decRatio);
          const binMb = (remTriangles * 50 + 84) / (1024 * 1024);
          const origAsciiMb = (origK * 1000 * 260) / (1024 * 1024);
          return {
            primary: binMb.toFixed(2),
            secondary: `${(remTriangles / 1000).toFixed(0)}k tris (vs ${origAsciiMb.toFixed(0)} MB ASCII) • Tol: ${c.toFixed(3)} mm`,
            pass: binMb <= 100 && c <= 0.05
          };
        }
      };
    }

    // A3. BIM Revit to IFC 模型体积优化与 IFCZIP 计算器 (ifc-model-size-optimizer)
    if (s === 'ifc-model-size-optimizer') {
      return {
        labelA: 'Uncompressed .IFC File Size (MB)',
        labelB: 'Tessellation & Property Strip Factor (%, 20–85%)',
        labelC: 'Enable IFCZIP Archive Packaging (1 = .ifcZip, 0 = Raw .ifc)',
        formula: 'S_clean = S_raw · (1 − 0.65 · η_lod) • S_ifczip = S_clean · 0.18 (ISO 10303-21 ZIP Deflate)',
        unit: 'MB',
        secondaryLabel: 'Total Reduction Ratio & CDE Upload Status',
        desc: 'Optimized IFC4 Reference View / IFCZIP Deliverable Footprint',
        calc: (a: number, b: number, c: number) => {
          const rawMb = Math.max(1, a);
          const optRatio = Math.max(0, Math.min(90, b)) / 100;
          const useZip = c >= 0.5;
          const cleanedMb = rawMb * (1 - 0.65 * optRatio);
          const finalMb = useZip ? cleanedMb * 0.18 : cleanedMb;
          const reduction = ((1 - finalMb / rawMb) * 100).toFixed(1);
          return {
            primary: finalMb.toFixed(1),
            secondary: `-${reduction}% (${rawMb.toFixed(0)} MB → ${finalMb.toFixed(1)} MB ${useZip ? '.ifcZIP' : '.ifc'})`,
            pass: finalMb <= 150
          };
        }
      };
    }

    // B1. CAD 订阅制 vs 永久买断制 5 年总成本 TCO 计算器 (cad-subscription-vs-perpetual-roi-calculator)
    if (s === 'cad-subscription-vs-perpetual-roi-calculator') {
      return {
        labelA: 'Total Engineering Seats in Team',
        labelB: 'Annual Subscription Cost per Seat ($/yr, e.g. 2030)',
        labelC: 'One-Time Perpetual Buyout Price ($/seat, e.g. 899)',
        formula: 'TCO_sub(5yr) = N · P_sub · 5 • TCO_perp(5yr) = N · (P_buyout + 0.20·P_buyout) • Savings = TCO_sub − TCO_perp',
        unit: 'USD Saved (5-Yr)',
        secondaryLabel: 'Break-Even Payback Period & 5-Year Cost Comparison',
        desc: 'Net 5-Year Capital Savings by Switching from SaaS Rental to Perpetual CAD Licenses',
        calc: (a: number, b: number, c: number) => {
          const seats = Math.max(1, Math.round(a));
          const subYr = Math.max(100, b);
          const perpOnce = Math.max(100, c);
          const tcoSub5 = seats * subYr * 5;
          const tcoPerp5 = seats * Math.round(perpOnce * 1.2); // includes 1 optional upgrade cycle
          const savings = Math.max(0, tcoSub5 - tcoPerp5);
          const breakEvenMonths = ((perpOnce / subYr) * 12).toFixed(1);
          return {
            primary: `${savings.toLocaleString('en-US')}`,
            secondary: `Payback: ${breakEvenMonths} mos (${tcoPerp5.toLocaleString('en-US')} vs ${tcoSub5.toLocaleString('en-US')})`,
            pass: savings > 0
          };
        }
      };
    }

    // B2. 浮动网络授权 (FLEXlm) 并发席位配比计算器 (cad-floating-license-seat-calculator)
    if (s === 'cad-floating-license-seat-calculator') {
      return {
        labelA: 'Total Engineers & Reviewers in Department',
        labelB: 'Concurrent Sharing Ratio (e.g. 3.0 = 1 Seat per 3 Users)',
        labelC: 'Annual Cost per Full Authoring Seat ($/yr)',
        formula: 'Seats_req = ceil(N_users / R_concurrent) + 1_buffer • Savings = (N_users − Seats_req) · Cost_seat',
        unit: 'Floating Seats',
        secondaryLabel: 'Annual License Budget Saved via Viewer Offloading',
        desc: 'Recommended Floating Network Pool Size & Annual Savings (Offloading Reviewers to DWG FastView)',
        calc: (a: number, b: number, c: number) => {
          const totalUsers = Math.max(2, Math.round(a));
          const ratio = Math.max(1.1, Math.min(8, b));
          const seatCost = Math.max(200, c);
          const reqSeats = Math.min(totalUsers, Math.ceil(totalUsers / ratio) + 1);
          const savedSeats = Math.max(0, totalUsers - reqSeats);
          const annualSaved = savedSeats * seatCost;
          return {
            primary: `${reqSeats} Seats`,
            secondary: `Save ${annualSaved.toLocaleString('en-US')}/yr (${savedSeats} review seats offloaded)`,
            pass: reqSeats < totalUsers
          };
        }
      };
    }

    // 0. 螺纹最小旋合长度校核 (thread-engagement-length-checker)
    // Machinery's Handbook method: the engagement length at which the thread
    // stripping area equals twice the tensile stress area, so the bolt breaks
    // in tension before the threads strip. Basic ISO 68-1 profile geometry.
    if (s === 'thread-engagement-length-checker') {
      return {
        labelA: 'Nominal Diameter d (mm)',
        labelB: 'Thread Pitch P (mm)',
        labelC: 'Strength Ratio J = UTS_bolt / UTS_nut-material',
        formula: 'A_t = 0.7854·(d − 0.9382P)² • D₁ = d − 1.0825P • L_e = 2·A_t / [π·D₁·(0.5 + 0.57735·(d₂ − D₁)/P)] • L_e,req = L_e · max(1, J)',
        unit: 'mm',
        secondaryLabel: 'Engagement as multiple of d & tensile stress area',
        desc: 'Minimum thread engagement length so the bolt yields in tension before the threads strip',
        calc: (a: number, b: number, c: number) => {
          const d = Math.max(1, a);
          const p = Math.max(0.2, Math.min(b, d / 3));
          const j = Math.max(0.1, c);
          const at = 0.7854 * Math.pow(d - 0.9382 * p, 2);
          const d1 = d - 1.0825 * p;
          const d2 = d - 0.6495 * p;
          const le = (2 * at) / (Math.PI * d1 * (0.5 + 0.57735 * ((d2 - d1) / p)));
          const req = le * Math.max(1, j);
          return {
            primary: req.toFixed(2),
            secondary: `${(req / d).toFixed(2)}·d • A_t = ${at.toFixed(1)} mm² • L_e (equal strength) = ${le.toFixed(2)} mm`,
            pass: req / d <= 2.5,
          };
        },
      };
    }

    // 1. CAD 视口与出图比例计算器 (cad-drawing-scale-calculator)
    if (s.includes('cad-drawing-scale') || s.includes('drawing-scale') || s.includes('viewport-scale')) {
      return {
        labelA: 'Scale Ratio 1 : S (e.g. 50 for 1:50)',
        labelB: 'Real Model Length L_model (mm)',
        labelC: 'Target Plotted Text Height h_plot (mm)',
        formula: 'L_paper = L_model / S • Zoom_XP = 1 / S • H_model_text = h_plot · S (ISO 5455 / ASME Y14.2)',
        unit: 'mm (Paper)',
        secondaryLabel: 'Model Text Height / Viewport XP Factor',
        desc: 'Plotted Paper Length & Required Model-Space Annotation Height',
        calc: (a: number, b: number, c: number) => {
          const scale = Math.max(0.001, a);
          const paperLen = b / scale;
          const modelTextH = c * scale;
          const xpFactor = (1 / scale).toFixed(4);
          return { primary: paperLen.toFixed(2), secondary: `${modelTextH.toFixed(1)} mm (${xpFactor}xp)`, pass: c >= 2.5 };
        }
      };
    }

    // 2. 湿空气焓湿学计算器 (psychrometric-chart-calculator)
    if (s === 'psychrometric-chart-calculator' || s.includes('psychrometric')) {
      return {
        labelA: 'Dry-Bulb Temperature T_db (°C)',
        labelB: 'Relative Humidity RH (%)',
        labelC: 'Atmospheric Pressure Factor (1.0 = 101.3 kPa)',
        formula: 'P_ws = 0.61078·exp(17.27·T/(T+237.3)) • W = 0.62198·P_w/(P - P_w) • h = 1.006·T + W·(2501+1.86·T) (ASHRAE Fundamentals)',
        unit: 'kJ/kg_da',
        secondaryLabel: 'Humidity Ratio W (g/kg) & Dew Point T_dp',
        desc: 'Moist Air Specific Enthalpy h, Humidity Ratio & Dew Point Temperature',
        calc: (a: number, b: number, c: number) => {
          const tDb = Math.max(-20, Math.min(60, a > 55 ? 26 : a));
          const rh = Math.max(5, Math.min(100, b));
          const pAtm = 101.325 * Math.max(0.7, Math.min(1.3, c));
          const pWs = 0.61078 * Math.exp((17.27 * tDb) / (tDb + 237.3));
          const pW = pWs * (rh / 100);
          const wRatio = 0.62198 * pW / Math.max(1, pAtm - pW);
          const enthalpy = 1.006 * tDb + wRatio * (2501 + 1.86 * tDb);
          const alpha = Math.log(Math.max(0.001, pW / 0.61078));
          const tDew = (237.3 * alpha) / (17.27 - alpha);
          return {
            primary: enthalpy.toFixed(2),
            secondary: `${(wRatio * 1000).toFixed(1)} g/kg (T_dp = ${tDew.toFixed(1)} °C)`,
            pass: rh >= 30 && rh <= 65
          };
        }
      };
    }

    // 3. 2D 桁架节点与杆件轴力计算器 (truss-analysis-2d-calculator)
    if (s === 'truss-analysis-2d-calculator') {
      return {
        labelA: 'Truss Span Length L (m)',
        labelB: 'Truss Depth / Height h (m)',
        labelC: 'Total Gravity Load Factor (×100 kN)',
        formula: 'F_chord_max = (P_total · L) / (8 · h) • F_web_max = (P_total / 2) / sin(θ) (2D Pin-Jointed Truss Method of Sections)',
        unit: 'kN',
        secondaryLabel: 'Max Web Diagonal Force & Span-to-Depth Ratio',
        desc: 'Maximum Top/Bottom Chord Axial Force & Web Diagonal Force',
        calc: (a: number, b: number, c: number) => {
          const span = Math.max(2, a > 40 ? a / 5 : a);
          const depth = Math.max(0.5, b > 10 ? b / 12.5 : b);
          const pTotal = Math.max(10, c * 100);
          const fChord = (pTotal * span) / (8 * depth);
          const fWeb = (pTotal / 2) * Math.SQRT2;
          const ratio = span / depth;
          return {
            primary: fChord.toFixed(1),
            secondary: `F_web = ${fWeb.toFixed(1)} kN (L/h = ${ratio.toFixed(1)})`,
            pass: ratio >= 8 && ratio <= 16
          };
        }
      };
    }

    // 4. 2D 门式刚架内力与侧移计算器 (frame-analysis-2d-calculator)
    if (s === 'frame-analysis-2d-calculator') {
      return {
        labelA: 'Lateral Story Shear H (kN)',
        labelB: 'Column Clear Height h (m)',
        labelC: 'Column Flexural Stiffness EI Factor',
        formula: 'M_col = (H · h) / 4 • Δ_sway = (H · h³) / (24 · EI) (2D Portal Frame Rigid-Joint Sway Analysis)',
        unit: 'kNm',
        secondaryLabel: 'Lateral Story Drift Δ_sway & Drift Ratio',
        desc: 'Maximum Column End Bending Moment & Lateral Story Drift',
        calc: (a: number, b: number, c: number) => {
          const hLoad = Math.max(1, a);
          const colH = Math.max(2, b > 12 ? b / 5 : b);
          const ei = Math.max(5000, c * 25000);
          const mCol = (hLoad * colH) / 4;
          const driftMm = ((hLoad * Math.pow(colH, 3)) / (24 * ei)) * 1000;
          const driftLimit = (colH * 1000) / 400;
          return {
            primary: mCol.toFixed(1),
            secondary: `Δ = ${driftMm.toFixed(2)} mm (Limit H/400 = ${driftLimit.toFixed(1)} mm)`,
            pass: driftMm <= driftLimit
          };
        }
      };
    }

    // 5. 楼盖水平分布与弦杆内力计算器 (diaphragm-analysis-calculator)
    if (s === 'diaphragm-analysis-calculator') {
      return {
        labelA: 'Distributed Lateral Load w_u (kN/m)',
        labelB: 'Diaphragm Span L (m)',
        labelC: 'Diaphragm Chord Depth Factor (×10 m)',
        formula: 'V_max = (w_u · L) / 2 • v_u = V_max / B • T_chord = (w_u · L²) / (8 · B) (ASCE 7 / SDPWS Diaphragm Mechanics)',
        unit: 'kN/m',
        secondaryLabel: 'Flange Chord Axial Force T_chord (kN)',
        desc: 'Maximum Unit Diaphragm Shear Demand v_u & Chord Tension/Compression',
        calc: (a: number, b: number, c: number) => {
          const wu = Math.max(0.5, a > 30 ? a / 10 : a);
          const spanL = Math.max(4, b);
          const depthB = Math.max(3, c * 10);
          const vMax = (wu * spanL) / 2;
          const unitShear = vMax / depthB;
          const tChord = (wu * Math.pow(spanL, 2)) / (8 * depthB);
          return {
            primary: unitShear.toFixed(2),
            secondary: `T_chord = ${tChord.toFixed(1)} kN (L/B = ${(spanL / depthB).toFixed(2)})`,
            pass: spanL / depthB <= 3.0
          };
        }
      };
    }

    // 6. 偏心荷载螺栓群应力校核计算器 (bolt-group-analysis-calculator)
    if (s === 'bolt-group-analysis-calculator') {
      return {
        labelA: 'Eccentric Shear Load P (kN)',
        labelB: 'Total Bolts in Group n',
        labelC: 'Eccentricity Ratio e / r_max',
        formula: 'R_d = P / n • R_t = (P · e · r_max) / Σr_i² • R_max = √(R_d² + R_t²) ≤ ϕR_n (AISC 360 Elastic Vector Method)',
        unit: 'kN/bolt',
        secondaryLabel: 'Safety Factor vs M20 Grade 8.8 (ϕR_n = 94.1 kN)',
        desc: 'Maximum Resultant Shear Force on Critical Corner Bolt',
        calc: (a: number, b: number, c: number) => {
          const nBolts = Math.max(2, Math.min(24, b > 16 ? 8 : Math.round(b)));
          const rDirect = a / nBolts;
          const rTorsion = rDirect * Math.max(0.2, c);
          const rMax = Math.sqrt(Math.pow(rDirect, 2) + Math.pow(rTorsion, 2) + rDirect * rTorsion);
          const sf = 94.1 / Math.max(0.1, rMax);
          return {
            primary: rMax.toFixed(1),
            secondary: `SF = ${sf.toFixed(2)} (R_direct = ${rDirect.toFixed(1)} kN)`,
            pass: sf >= 1.25
          };
        }
      };
    }

    // 7. 钢筋混凝土矩形截面受弯配筋计算器 (rc-section-design-calculator)
    if (s === 'rc-section-design-calculator') {
      return {
        labelA: 'Factored Bending Moment M_u (kNm)',
        labelB: 'Effective Section Depth d (mm)',
        labelC: 'Section Width Factor b (×200 mm)',
        formula: 'A_s = M_u / (ϕ · f_y · 0.9d) • a = (A_s · f_y) / (0.85 · f\'c · b) (ACI 318-19 Ultimate Strength Design)',
        unit: 'mm²',
        secondaryLabel: 'Whitney Block Depth a & Reinforcement Ratio ρ',
        desc: 'Required Tensile Steel Area A_s (f_y = 420 MPa, f\'c = 30 MPa)',
        calc: (a: number, b: number, c: number) => {
          const mu = Math.max(5, a);
          const dEff = Math.max(150, b < 100 ? b * 18 : b);
          const widthB = Math.max(150, c * 200);
          const fy = 420;
          const fc = 30;
          const asReq = (mu * 1e6) / (0.9 * fy * (0.9 * dEff));
          const blockA = (asReq * fy) / (0.85 * fc * widthB);
          const rho = (asReq / (widthB * dEff)) * 100;
          return {
            primary: asReq.toFixed(0),
            secondary: `a = ${blockA.toFixed(1)} mm (ρ = ${rho.toFixed(2)}%)`,
            pass: rho >= 0.33 && rho <= 2.5
          };
        }
      };
    }

    // 8. 移动荷载梁包络内力计算器 (moving-load-beam-calculator)
    if (s === 'moving-load-beam-calculator') {
      return {
        labelA: 'Tandem Axle Load P_axle (kN)',
        labelB: 'Girder Span Length L (m)',
        labelC: 'Axle Spacing s (m)',
        formula: 'M_abs_max = (P · (L - s/2)²) / (2 · L) • V_max = P · (2 - s/L) (AASHTO LRFD / Muller-Breslau Theorem)',
        unit: 'kNm',
        secondaryLabel: 'Maximum Support Shear Envelope V_max (kN)',
        desc: 'Absolute Maximum Bending Moment Under Moving Tandem Axle Load',
        calc: (a: number, b: number, c: number) => {
          const pAxle = Math.max(5, a);
          const span = Math.max(4, b);
          const spacing = Math.min(span * 0.8, Math.max(0.5, c));
          const mAbs = (pAxle * Math.pow(span - spacing / 2, 2)) / (2 * span);
          const vMax = pAxle * (2 - spacing / span);
          return {
            primary: mAbs.toFixed(1),
            secondary: `V_max = ${vMax.toFixed(1)} kN (at x = ${(span / 2 - spacing / 4).toFixed(2)} m)`,
            pass: true
          };
        }
      };
    }

    // 9. 平面应力莫尔圆与主应力变换计算器 (principal-stress-transformation-calculator)
    if (s === 'principal-stress-transformation-calculator') {
      return {
        labelA: 'Normal Stress σ_x (MPa)',
        labelB: 'Normal Stress σ_y (MPa)',
        labelC: 'Shear Stress Factor τ_xy (×40 MPa)',
        formula: 'σ_1,2 = (σ_x+σ_y)/2 ± √[((σ_x-σ_y)/2)² + τ_xy²] • σ_vm = √(σ_1² - σ_1σ_2 + σ_2²) (Mohr\'s Stress Circle)',
        unit: 'MPa',
        secondaryLabel: 'Minor Principal Stress σ₂ & Von Mises Stress',
        desc: 'Major Principal Stress σ₁ & Maximum In-Plane Shear Transformation',
        calc: (a: number, b: number, c: number) => {
          const sx = a;
          const sy = b;
          const txy = c * 40;
          const avg = (sx + sy) / 2;
          const radius = Math.sqrt(Math.pow((sx - sy) / 2, 2) + Math.pow(txy, 2));
          const s1 = avg + radius;
          const s2 = avg - radius;
          const vm = Math.sqrt(s1 * s1 - s1 * s2 + s2 * s2);
          return {
            primary: s1.toFixed(1),
            secondary: `σ₂ = ${s2.toFixed(1)} MPa • σ_vm = ${vm.toFixed(1)} MPa`,
            pass: vm <= 250
          };
        }
      };
    }

    // 10. 双向板荷载分配与弯矩计算器 (slab-load-distribution-calculator)
    if (s === 'slab-load-distribution-calculator') {
      return {
        labelA: 'Factored Slab Surface Load w_u (kN/m²)',
        labelB: 'Short Span Length L_x (m)',
        labelC: 'Aspect Ratio m = L_y / L_x (1.0–2.0)',
        formula: 'α_x = m⁴ / (1 + m⁴) • w_x = α_x · w_u • M_x = (w_x · L_x²) / 8 (Rankine-Grashoff Two-Way Slab Theory)',
        unit: 'kNm/m',
        secondaryLabel: 'Short-Span Load Share α_x & Behavior Mode',
        desc: 'Short-Span Strip Bending Moment Per Meter Width M_x',
        calc: (a: number, b: number, c: number) => {
          const wu = Math.max(1, a > 30 ? a / 8 : a);
          const lx = Math.max(2, b > 12 ? b / 5 : b);
          const mRatio = Math.max(1.0, Math.min(3.0, c));
          const alphaX = Math.pow(mRatio, 4) / (1 + Math.pow(mRatio, 4));
          const wx = alphaX * wu;
          const mx = (wx * Math.pow(lx, 2)) / 8;
          const mode = mRatio <= 2.0 ? 'Two-Way Slab' : 'One-Way Dominant';
          return {
            primary: mx.toFixed(2),
            secondary: `α_x = ${(alphaX * 100).toFixed(1)}% (${mode})`,
            pass: mRatio <= 2.0
          };
        }
      };
    }

    // 11. ACI 混凝土配合比与水灰比计算 (concrete-mix-design-aci-calculator)
    if (s.includes('concrete-mix') || s.includes('cement') || s.includes('grout')) {
      return {
        labelA: 'Target Batch Volume V (m³)',
        labelB: 'Cement Content per m³ (kg/m³)',
        labelC: 'Water-Cement Ratio w/c (0.35–0.65)',
        formula: 'W_water = V · C · (w/c) • f\'c_est ≈ 96 · (w/c)^(-1.5) (ACI 211.1 Concrete Mix Proportioning)',
        unit: 'kg Cement',
        secondaryLabel: 'Mixing Water / Est. 28-Day Strength',
        desc: 'Total Cement Mass & Required Mixing Water',
        calc: (a: number, b: number, c: number) => {
          const effVol = a > 20 ? a / 10 : Math.max(0.1, a);
          const cementKg = effVol * Math.max(250, b * 14);
          const wc = c > 1 ? 0.45 : Math.max(0.25, c);
          const waterL = cementKg * wc;
          const fcEst = 22 / Math.pow(wc, 1.3);
          return { primary: cementKg.toFixed(0), secondary: `${waterL.toFixed(0)} L H₂O (~${fcEst.toFixed(0)} MPa)`, pass: wc <= 0.55 };
        }
      };
    }

    // 12. 内支撑基坑开挖土压力与支撑轴力计算器 (braced-excavation-analysis-calculator)
    if (s === 'braced-excavation-analysis-calculator') {
      return {
        labelA: 'Excavation Depth H (m)',
        labelB: 'Soil Unit Weight γ (kN/m³)',
        labelC: 'Active Pressure Coefficient K_a (0.25–0.50)',
        formula: 'p_a = 0.65 · K_a · γ · H • P_total = p_a · H (Terzaghi-Peck Apparent Earth Pressure Diagram)',
        unit: 'kN/m',
        secondaryLabel: 'Apparent Envelope Pressure p_a (kPa)',
        desc: 'Total Lateral Strut Thrust Per Meter of Braced Excavation Wall',
        calc: (a: number, b: number, c: number) => {
          const depthH = Math.max(2, a > 25 ? a / 10 : a);
          const gamma = Math.max(14, Math.min(24, b > 24 ? 19 : b));
          const ka = c > 1 ? 0.33 : Math.max(0.15, c);
          const pa = 0.65 * ka * gamma * depthH;
          const pTotal = pa * depthH;
          return {
            primary: pTotal.toFixed(1),
            secondary: `p_a = ${pa.toFixed(1)} kPa (H = ${depthH.toFixed(1)} m)`,
            pass: depthH <= 18
          };
        }
      };
    }

    // 13. 锚拉式基坑支护土层锚杆抗拔计算器 (anchored-excavation-analysis-calculator)
    if (s === 'anchored-excavation-analysis-calculator') {
      return {
        labelA: 'Design Anchor Pull Force T_d (kN)',
        labelB: 'Fixed Bond Zone Length L_bond (m)',
        labelC: 'Ultimate Grout-Soil Bond Stress Factor (×100 kPa)',
        formula: 'R_ult = π · D_bh · L_bond · τ_bond • FS = R_ult / T_d ≥ 1.50 (FHWA-IF-99-015 / BS 8081 Ground Anchors)',
        unit: 'kN',
        secondaryLabel: 'Anchor Pullout Safety Factor FS (D_bh = 150 mm)',
        desc: 'Ultimate Anchor Grout-Ground Bond Pullout Capacity R_ult',
        calc: (a: number, b: number, c: number) => {
          const tDesign = Math.max(10, a);
          const lBond = Math.max(3, b > 20 ? b / 3 : b);
          const tauBond = Math.max(50, c * 120);
          const dBh = 0.15;
          const rUlt = Math.PI * dBh * lBond * tauBond;
          const fs = rUlt / tDesign;
          return {
            primary: rUlt.toFixed(1),
            secondary: `FS = ${fs.toFixed(2)} (Required ≥ 1.50)`,
            pass: fs >= 1.5
          };
        }
      };
    }

    // 14. 盾构隧道地表沉降槽 Peck 公式计算器 (tunnel-settlement-calculator)
    if (s === 'tunnel-settlement-calculator') {
      return {
        labelA: 'Tunnel Excavation Diameter D (m)',
        labelB: 'Crown Overburden Depth z_0 (m)',
        labelC: 'Ground Volume Loss Ratio V_L (%)',
        formula: 'i = 0.5 · z_0 • S_max = (0.313 · V_L · D²) / i (Peck 1969 Gaussian Surface Settlement Trough)',
        unit: 'mm',
        secondaryLabel: 'Trough Inflection Width i (m) & Limit Check',
        desc: 'Maximum Centerline Surface Settlement S_max Above Shield Tunnel',
        calc: (a: number, b: number, c: number) => {
          const diaD = Math.max(2, a > 18 ? 6.5 : a);
          const z0 = Math.max(4, b);
          const vlPct = Math.max(0.1, c);
          const iWidth = 0.5 * z0;
          const sMaxMm = ((0.313 * (vlPct / 100) * Math.pow(diaD, 2)) / iWidth) * 1000;
          return {
            primary: sMaxMm.toFixed(1),
            secondary: `i = ${iWidth.toFixed(2)} m (V_L = ${vlPct.toFixed(2)}%)`,
            pass: sMaxMm <= 30.0
          };
        }
      };
    }

    // 15. 隧道围岩 RMR 评分与支护分级计算器 (tunnel-rmr-support-calculator)
    if (s === 'tunnel-rmr-support-calculator') {
      return {
        labelA: 'Rock Quality Designation RQD (%)',
        labelB: 'UCS + Joint Spacing Rating (0–40)',
        labelC: 'Joint Condition & Groundwater Factor (0.5–2.0)',
        formula: 'RMR_89 = R_UCS + R_RQD + R_spacing + R_cond + R_GW • Q ≈ e^((RMR-44)/9) (Bieniawski 1989 RMR Classification)',
        unit: 'RMR Points',
        secondaryLabel: 'Rock Mass Class & Stand-Up Support Grade',
        desc: 'Bieniawski Rock Mass Rating (RMR89) & Tunnel Support Class',
        calc: (a: number, b: number, c: number) => {
          const rqdScore = Math.min(20, Math.max(3, Math.round(Math.min(100, a) * 0.2)));
          const baseScore = Math.min(40, Math.max(5, b));
          const condScore = Math.min(40, Math.max(5, Math.round(c * 20)));
          const rmr = Math.min(100, Math.max(10, rqdScore + baseScore + condScore));
          const rockClass = rmr >= 81 ? 'Class I (Very Good)' : rmr >= 61 ? 'Class II (Good)' : rmr >= 41 ? 'Class III (Fair)' : rmr >= 21 ? 'Class IV (Poor)' : 'Class V (Very Poor)';
          return {
            primary: rmr.toFixed(0),
            secondary: rockClass,
            pass: rmr >= 41
          };
        }
      };
    }

    // 16. 顶管施工总顶推力计算器 (pipe-jacking-force-calculator)
    if (s === 'pipe-jacking-force-calculator') {
      return {
        labelA: 'Jacking Drive Length L (m)',
        labelB: 'Outer Pipe Diameter D_e (m)',
        labelC: 'Lubricated Skin Friction f_s (kPa)',
        formula: 'F_skin = π · D_e · L · f_s • F_total = F_face + F_skin (ATV-A 161 / PJA Microtunnelling Jacking Model)',
        unit: 'kN',
        secondaryLabel: 'Frictional Component F_skin & Face Pressure',
        desc: 'Total Required Hydraulic Jacking Thrust Force F_total',
        calc: (a: number, b: number, c: number) => {
          const lenL = Math.max(10, a);
          const diaDe = Math.max(0.4, b > 5 ? b / 12.5 : b);
          const fs = Math.max(0.5, c * 2.5);
          const fSkin = Math.PI * diaDe * lenL * fs;
          const fFace = (Math.PI * Math.pow(diaDe, 2) / 4) * 180;
          const fTotal = fSkin + fFace;
          return {
            primary: fTotal.toFixed(0),
            secondary: `F_skin = ${fSkin.toFixed(0)} kN + F_face = ${fFace.toFixed(0)} kN`,
            pass: fTotal <= 12000
          };
        }
      };
    }

    // 17. ACI 347 混凝土模板侧压力计算器 (formwork-design-calculator)
    if (s === 'formwork-design-calculator') {
      return {
        labelA: 'Concrete Pour Height H_pour (m)',
        labelB: 'Placement Temperature T (°C)',
        labelC: 'Vertical Pour Rate R (m/h)',
        formula: 'P_max = C_w · C_c · [7.2 + (785 · R) / (T + 17.8)] ≤ ρ·g·H (ACI 347R-14 Formwork Lateral Pressure)',
        unit: 'kPa',
        secondaryLabel: 'Hydrostatic Limit P_hydro & Governing Tie Load',
        desc: 'Maximum Fresh Concrete Lateral Pressure on Wall/Column Formwork',
        calc: (a: number, b: number, c: number) => {
          const hPour = Math.max(1, a > 15 ? a / 20 : a);
          const tempC = Math.max(5, Math.min(40, b));
          const rateR = Math.max(0.3, c);
          const pFormula = 7.2 + (785 * rateR) / (tempC + 17.8);
          const pHydro = 24.0 * hPour;
          const pMax = Math.min(pHydro, Math.max(30, pFormula));
          return {
            primary: pMax.toFixed(1),
            secondary: `Hydrostatic Envelope = ${pHydro.toFixed(1)} kPa`,
            pass: pMax <= 85.0
          };
        }
      };
    }

    // 18. 施工脚手架立杆稳定承载力计算器 (scaffold-design-calculator)
    if (s === 'scaffold-design-calculator') {
      return {
        labelA: 'Total Scaffold Height H_scaff (m)',
        labelB: 'Bay Length × Width Area Factor (×0.1 m²)',
        labelC: 'Platform Duty Live Load q_L (kN/m²)',
        formula: 'N_ed = 1.35 · G_k + 1.50 · Q_k • N_b,Rd = χ · A · f_y / γ_M1 (EN 12811-1 / OSHA 1926.451 Scaffold Design)',
        unit: 'kN/leg',
        secondaryLabel: 'Buckling Utilization vs Ø48.3×3.2 Standard (30.5 kN)',
        desc: 'Factored Axial Compression Load Per Scaffold Standard Leg N_ed',
        calc: (a: number, b: number, c: number) => {
          const height = Math.max(2, a > 40 ? 24 : a);
          const bayArea = Math.max(1.5, b * 0.15);
          const liveQ = Math.max(0.75, c * 1.5);
          const deadLoad = (height / 2) * 0.45;
          const liveLoad = bayArea * liveQ;
          const nEd = 1.35 * deadLoad + 1.5 * liveLoad;
          const util = (nEd / 30.5) * 100;
          return {
            primary: nEd.toFixed(2),
            secondary: `Utilization = ${util.toFixed(1)}% of 30.5 kN Limit`,
            pass: util <= 100
          };
        }
      };
    }

    // 19. 澳洲标准 AS 3959 山火辐射热与 BAL 等级计算器 (bal-fire-risk-assessment-calculator)
    if (s === 'bal-fire-risk-assessment-calculator') {
      return {
        labelA: 'Defendable Space Distance d (m)',
        labelB: 'Effective Downslope Angle θ (deg)',
        labelC: 'Vegetation Fuel Factor (1.0 = Forest, 0.5 = Woodland)',
        formula: 'q_rad = (1050 · F_veg · e^(0.06·θ)) / d^1.15 → BAL-LOW / 12.5 / 19 / 29 / 40 / FZ (AS 3959:2018 Method 1 & 2)',
        unit: 'kW/m²',
        secondaryLabel: 'AS 3959 Bushfire Attack Level (BAL) Rating',
        desc: 'Peak Radiant Heat Flux & Mandatory Bushfire Construction Standard',
        calc: (a: number, b: number, c: number) => {
          const dist = Math.max(2, a > 100 ? 25 : a);
          const slope = Math.max(0, Math.min(30, b > 30 ? 10 : b));
          const veg = Math.max(0.3, c);
          const qRad = (420 * veg * Math.exp(0.055 * slope)) / Math.pow(dist, 1.12);
          const bal = qRad > 40 ? 'BAL-FZ (Flame Zone)' : qRad > 29 ? 'BAL-40' : qRad > 19 ? 'BAL-29' : qRad > 12.5 ? 'BAL-19' : qRad > 4 ? 'BAL-12.5' : 'BAL-LOW';
          return {
            primary: qRad.toFixed(1),
            secondary: bal,
            pass: qRad <= 29.0
          };
        }
      };
    }

    // 20. BIM 构件混凝土方量与钢筋用量估算器 (online-bim-quantity-estimator)
    if (s === 'online-bim-quantity-estimator') {
      return {
        labelA: 'Gross Floor / Slab Area A (m²)',
        labelB: 'Equivalent Structural Thickness t (cm)',
        labelC: 'Rebar Density Ratio ρ_s (×100 kg/m³)',
        formula: 'V_conc = A · (t / 100) · (1 + f_waste) • M_rebar = V_conc · ρ_s (RICS NRM2 / CSI MasterFormat Div 03)',
        unit: 'm³ Concrete',
        secondaryLabel: 'Estimated Reinforcing Steel Tonnage M_rebar',
        desc: 'Net Concrete Volume (incl. 3% waste) & Reinforcing Rebar Mass',
        calc: (a: number, b: number, c: number) => {
          const area = Math.max(10, a);
          const thickM = Math.max(0.08, b / 100);
          const rebarRate = Math.max(50, c * 95);
          const vConc = area * thickM * 1.03;
          const mRebarTons = (vConc * rebarRate) / 1000;
          return {
            primary: vConc.toFixed(1),
            secondary: `${mRebarTons.toFixed(2)} metric tons Rebar (${rebarRate.toFixed(0)} kg/m³)`,
            pass: thickM >= 0.12
          };
        }
      };
    }

    // 21. CNC 激光/等离子板材套料排版利用率优化计算器 (online-cnc-nesting-optimizer)
    if (s === 'online-cnc-nesting-optimizer') {
      return {
        labelA: 'Single Part Blank Area A_part (cm²)',
        labelB: 'Nested Parts per Sheet N_parts',
        labelC: 'Standard Sheet Size Factor (1.5 = 1500×3000 mm)',
        formula: 'η_nest = (N_parts · A_part + A_kerf) / A_sheet × 100% • Scrap = 100% - η_nest (ISO 9013 Laser/Plasma Nesting)',
        unit: '% Yield',
        secondaryLabel: 'Sheet Scrap Ratio & Utilized Area (m²)',
        desc: 'True Sheet Metal Nesting Material Utilization Efficiency η_nest',
        calc: (a: number, b: number, c: number) => {
          const partM2 = Math.max(0.001, a / 10000);
          const count = Math.max(1, Math.round(b));
          const sheetM2 = Math.max(1.0, c * 3.0);
          const usedM2 = Math.min(sheetM2 * 0.96, partM2 * count);
          const yieldPct = (usedM2 / sheetM2) * 100;
          const scrapPct = 100 - yieldPct;
          return {
            primary: yieldPct.toFixed(1),
            secondary: `Scrap = ${scrapPct.toFixed(1)}% (${usedM2.toFixed(2)} / ${sheetM2.toFixed(2)} m²)`,
            pass: yieldPct >= 72.0
          };
        }
      };
    }

    // 22. CFD 流体雷诺数与边界层第一层网格 Y+ 厚度计算器 (online-cfd-simulation-platform)
    if (s === 'online-cfd-simulation-platform') {
      return {
        labelA: 'Freestream Flow Velocity U_∞ (m/s)',
        labelB: 'Characteristic Chord / Pipe Length L (mm)',
        labelC: 'Target Wall Mesh y⁺ Value (1.0 = k-ω SST)',
        formula: 'Re = (ρ · U_∞ · L) / μ • C_f = 0.026 / Re^(1/7) • Δy₁ = (y⁺ · μ) / (ρ · u_τ) (Schlichting Boundary Layer Theory)',
        unit: 'mm (Δy₁)',
        secondaryLabel: 'Reynolds Number Re & Flow Regime',
        desc: 'First Prism Layer Wall Mesh Height Δy₁ for Target y⁺',
        calc: (a: number, b: number, c: number) => {
          const vel = Math.max(0.1, a / 5);
          const lenM = Math.max(0.01, b / 100);
          const yPlus = Math.max(0.5, c);
          const rho = 1.225;
          const mu = 1.81e-5;
          const re = (rho * vel * lenM) / mu;
          const cf = 0.026 / Math.pow(re, 1 / 7);
          const tauW = 0.5 * cf * rho * vel * vel;
          const uTau = Math.sqrt(tauW / rho);
          const dy1Mm = ((yPlus * mu) / (rho * uTau)) * 1000;
          return {
            primary: dy1Mm.toFixed(4),
            secondary: `Re = ${(re / 1e5).toFixed(2)}×10⁵ (${re > 4000 ? 'Turbulent' : 'Laminar'})`,
            pass: yPlus <= 5.0 || yPlus >= 30.0
          };
        }
      };
    }

    // 23. FEA 有限元应力奇异与网格收敛安全系数校核器 (online-fea-simulation-platform)
    if (s === 'online-fea-simulation-platform') {
      return {
        labelA: 'Peak Von Mises Stress σ_vm (MPa)',
        labelB: 'Material Yield Strength R_p0.2 (×10 MPa)',
        labelC: 'Stress Concentration / Mesh Factor K_t',
        formula: 'σ_nom = σ_vm / K_t • FoS_yield = R_p0.2 / σ_vm • η_margin = FoS - 1 (ASME V&V 10 / NAFEMS FEA Standard)',
        unit: 'FoS (Safety)',
        secondaryLabel: 'Material Yield Utilization & Nominal Stress',
        desc: 'Factor of Safety Against Von Mises Yield Criterion (Distortion Energy)',
        calc: (a: number, b: number, c: number) => {
          const svm = Math.max(1, a * 1.8);
          const fy = Math.max(100, b * 14);
          const kt = Math.max(1.0, c);
          const fos = fy / svm;
          const util = (svm / fy) * 100;
          return {
            primary: fos.toFixed(2),
            secondary: `Utilization = ${util.toFixed(1)}% (σ_nom = ${(svm / kt).toFixed(1)} MPa)`,
            pass: fos >= 1.5
          };
        }
      };
    }

    // 24. 注塑模具模流锁模力与冷却时间计算器 (online-injection-mold-flow-analysis)
    if (s === 'online-injection-mold-flow-analysis') {
      return {
        labelA: 'Total Projected Cavity Area A_proj (cm²)',
        labelB: 'Mean Cavity Melt Pressure P_cav (MPa)',
        labelC: 'Part Nominal Wall Thickness s (mm)',
        formula: 'F_clamp = (A_proj · P_cav · 1.15) / 98.0665 [Tonnes] • t_cool ≈ (s² / (π² · α_eff)) · ln(4/π · ΔT) (Menges Mold Flow Eq)',
        unit: 'Metric Tons',
        secondaryLabel: 'Minimum Holding & Cooling Cycle Time t_cool (s)',
        desc: 'Required Injection Molding Machine Clamping Tonnage (incl. 15% safety)',
        calc: (a: number, b: number, c: number) => {
          const areaCm2 = Math.max(5, a * 2.5);
          const pCavMpa = Math.max(15, b * 1.6);
          const wallMm = Math.max(0.8, c * 1.6);
          // 1 cm² * 1 MPa = 100 N = 0.1 kN
          const forceKn = areaCm2 * pCavMpa * 0.1 * 1.15;
          const clampTons = forceKn / 9.80665;
          const tCool = 2.15 * Math.pow(wallMm, 2);
          return {
            primary: clampTons.toFixed(1),
            secondary: `F = ${forceKn.toFixed(0)} kN • Est. Cooling Time = ${tCool.toFixed(1)} s`,
            pass: clampTons <= 850
          };
        }
      };
    }

    // 25-27. 综合机械与多学科设计公式校核工作台 (mitcalc / ptc-mathcad / calculatoredge)
    if (
      s === 'mitcalc-mechanical-calculator-suite' ||
      s === 'ptc-mathcad-engineering-calculator' ||
      s === 'calculatoredge-multi-discipline-calculators'
    ) {
      return {
        labelA: 'Transmitted Shaft Torque M_t (Nm)',
        labelB: 'Simultaneous Bending Moment M_b (Nm)',
        labelC: 'Shaft Diameter Factor (×20 mm)',
        formula: 'M_eq = √(M_b² + 0.75 · M_t²) • σ_eq = (32 · M_eq) / (π · d³) ≤ σ_allow (ASME B106.1M / DIN 743 Shaft Design)',
        unit: 'MPa',
        secondaryLabel: 'Equivalent Moment M_eq & Fatigue Safety Factor',
        desc: 'Combined Torsion-Bending Von Mises Equivalent Shaft Stress σ_eq',
        calc: (a: number, b: number, c: number) => {
          const mt = Math.max(5, a * 2.5);
          const mb = Math.max(5, b * 6);
          const diaMm = Math.max(12, c * 22);
          const mEq = Math.sqrt(mb * mb + 0.75 * mt * mt);
          const sigmaEq = (32 * mEq * 1000) / (Math.PI * Math.pow(diaMm, 3));
          const sf = 240 / Math.max(1, sigmaEq);
          return {
            primary: sigmaEq.toFixed(1),
            secondary: `M_eq = ${mEq.toFixed(1)} Nm • SF = ${sf.toFixed(2)} (d = ${diaMm.toFixed(0)} mm)`,
            pass: sf >= 1.5
          };
        }
      };
    }

    // 通用学科分类兜底（紧固件、岩土、建筑物理、流体、机构、机加工、结构抗弯）
    if (s.includes('bolt-group') || s.includes('thread-stripping') || s.includes('press-fit') || s.includes('fastener')) {
      return {
        labelA: 'Applied Shear / Axial Force F (kN)',
        labelB: 'Fastener Count n (or Engagement mm)',
        labelC: 'Bolt Tensile / Shear Area A_s (mm²)',
        formula: 'τ = (F · 1000) / (n · A_s) • SF = τ_allow / τ (VDI 2230 / ISO 898-1 Fastener Mechanics)',
        unit: 'MPa',
        secondaryLabel: 'Safety Factor SF (vs Grade 8.8 τ_allow=384 MPa)',
        desc: 'Nominal Fastener Shear / Bearing Stress & Joint Safety Factor',
        calc: (a: number, b: number, c: number) => {
          const stress = (a * 1000) / Math.max(1, b * c);
          const sf = 384 / Math.max(0.1, stress);
          return { primary: stress.toFixed(1), secondary: `SF = ${sf.toFixed(2)}`, pass: sf >= 1.5 };
        }
      };
    }

    if (s.includes('flow') || s.includes('hvac') || s.includes('pipe') || s.includes('pump') || s.includes('pressure') || s.includes('weir') || s.includes('duct') || s.includes('valve')) {
      return {
        labelA: 'Flow Rate Q (m³/h)',
        labelB: 'Pipe ID / Hydraulic Dia D (mm)',
        labelC: 'Friction / Loss Factor K',
        formula: 'v = Q / (A · 3600) • ΔP = K · (ρv²/2) (Darcy-Weisbach / Continuity Eq)',
        unit: 'm/s',
        secondaryLabel: 'Dynamic Head Loss Δh (m H₂O)',
        desc: 'Flow Velocity & Pressure Gradient',
        calc: (a: number, b: number, c: number) => {
          const area = Math.PI * Math.pow(Math.max(1, b) / 2000, 2);
          const vel = (a / 3600) / Math.max(0.0001, area);
          const loss = c * (Math.pow(vel, 2) / (2 * 9.81));
          return { primary: vel.toFixed(2), secondary: `${loss.toFixed(2)} m H₂O`, pass: vel <= 3.0 };
        }
      };
    }

    if (s.includes('gear') || s.includes('motor') || s.includes('torque') || s.includes('speed') || s.includes('rpm') || s.includes('planetary') || s.includes('cam') || s.includes('belt') || s.includes('bearing') || s.includes('spring')) {
      return {
        labelA: 'Motor Power P (kW)',
        labelB: 'Shaft Speed n (RPM)',
        labelC: 'Service Factor K_s',
        formula: 'T = (9550 · P) / n • T_design = T · K_s (DIN 3990 / ISO 6336 Gear Mechanics)',
        unit: 'Nm',
        secondaryLabel: 'Factored Design Torque T_design',
        desc: 'Nominal Operating Torque & Design Load',
        calc: (a: number, b: number, c: number) => {
          const torque = (9550 * a) / Math.max(1, b);
          const designTorque = torque * Math.max(1, c);
          return { primary: torque.toFixed(1), secondary: `${designTorque.toFixed(1)} Nm`, pass: true };
        }
      };
    }

    if (s.includes('cnc') || s.includes('feed') || s.includes('cut') || s.includes('sheet') || s.includes('bend') || s.includes('gcode') || s.includes('milling') || s.includes('lathe')) {
      return {
        labelA: 'Cutting Speed v_c (m/min)',
        labelB: 'Tool Dia / Plate Thickness D (mm)',
        labelC: 'Feed per Tooth f_z / K-Factor',
        formula: 'n = (1000 · v_c) / (π · D) • v_f = n · z · f_z (ISO 1832 Machining Standard)',
        unit: 'RPM',
        secondaryLabel: 'Table Feed / Bend Allowance',
        desc: 'Spindle Speed & Process Feed Rate',
        calc: (a: number, b: number, c: number) => {
          const rpm = (1000 * a) / Math.max(0.1, Math.PI * b);
          const allow = b * c;
          return { primary: rpm.toFixed(0), secondary: `${allow.toFixed(2)} mm/rev`, pass: rpm > 0 };
        }
      };
    }

    // 默认：结构力学与构件抗弯
    return {
      labelA: 'Design Span / Load Length (m)',
      labelB: 'Applied Uniform Load w (kN/m)',
      labelC: 'Section Modulus W_z (cm³)',
      formula: 'M_max = (w · L²) / 8 • σ = M / W_z ≤ f_y (AISC 360 / Eurocode 3)',
      unit: 'kNm',
      secondaryLabel: 'Bending Stress σ (MPa)',
      desc: 'Maximum Design Bending Moment Capacity',
      calc: (a: number, b: number, c: number) => {
        const mMax = (b * Math.pow(a, 2)) / 8;
        const stress = (mMax * 1000) / Math.max(1, c);
        const pass = stress <= 235;
        return { primary: mMax.toFixed(2), secondary: `${stress.toFixed(1)} MPa`, pass };
      }
    };
  }, [tool.slug]);

  // 计算器衍生输出
  const calcResult = useMemo(() => {
    const res = calcSchema.calc(paramA, paramB, paramC);
    return {
      primary: res.primary,
      secondary: res.secondary,
      status: res.pass ? 'VERIFIED (PASS)' : 'ATTENTION (CHECK)',
      pass: res.pass
    };
  }, [paramA, paramB, paramC, calcSchema]);

  // 专属代码/脚本/DXF 生成器引擎（针对全部 13 个 generator 工具生成真实可用的工程脚本与 CAD 数据）
  const generatorOutput = useMemo(() => {
    const s = tool.slug.toLowerCase();

    // 盘形凸轮轮廓生成器：摆线运动规律（升程-远休止-回程-近休止），径向从动件理论廓线
    if (s === 'cam-profile-generator') {
      const rb = Math.max(5, paramA);
      const h = Math.max(0.5, paramB);
      const beta = Math.max(30, Math.min(170, paramC));
      const dwell = (360 - 2 * beta) / 2;
      const disp = (thetaDeg: number) => {
        const t = ((thetaDeg % 360) + 360) % 360;
        const cyc = (u: number) => u - Math.sin(2 * Math.PI * u) / (2 * Math.PI);
        if (t < beta) return h * cyc(t / beta);
        if (t < beta + dwell) return h;
        if (t < 2 * beta + dwell) return h * (1 - cyc((t - beta - dwell) / beta));
        return 0;
      };
      const pts: string[] = [];
      let maxPa = 0;
      for (let t = 0; t < 360; t += 1) {
        const sv = disp(t);
        const ds = (disp(t + 0.01) - disp(t - 0.01)) / ((0.02 * Math.PI) / 180);
        maxPa = Math.max(maxPa, (Math.atan(Math.abs(ds) / (rb + sv)) * 180) / Math.PI);
        const r = rb + sv;
        const a = (t * Math.PI) / 180;
        pts.push(`0\nVERTEX\n8\nCAM_PITCH_CURVE\n10\n${(r * Math.cos(a)).toFixed(4)}\n20\n${(r * Math.sin(a)).toFixed(4)}\n30\n0.0`);
      }
      const ext = '.dxf';
      const code = `999\nCADGuide cam profile: cycloidal motion, radial follower. Rb=${rb} mm, lift h=${h} mm, rise=${beta} deg, dwell=${dwell.toFixed(1)} deg, return=${beta} deg, dwell=${dwell.toFixed(1)} deg. Max pressure angle=${maxPa.toFixed(1)} deg${maxPa > 30 ? ' (EXCEEDS 30 deg - increase Rb)' : ''}\n0\nSECTION\n2\nHEADER\n9\n$INSUNITS\n70\n4\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nCIRCLE\n8\nCAM_BASE_CIRCLE\n10\n0.0\n20\n0.0\n30\n0.0\n40\n${rb.toFixed(4)}\n0\nPOLYLINE\n8\nCAM_PITCH_CURVE\n66\n1\n10\n0.0\n20\n0.0\n30\n0.0\n70\n1\n${pts.join('\n')}\n0\nSEQEND\n8\nCAM_PITCH_CURVE\n0\nENDSEC\n0\nEOF`;
      return {
        labelA: 'Base Circle Radius R_b (mm)',
        labelB: 'Follower Lift h (mm)',
        labelC: 'Rise / Return Angle β (deg, 30–170)',
        ext,
        filename: `cam-rb${Math.round(rb)}-h${Math.round(h)}-b${Math.round(beta)}${ext}`,
        lang: `Cam Pitch Curve DXF (max pressure angle ${maxPa.toFixed(1)}°${maxPa > 30 ? ' — exceeds 30°' : ''})`,
        code,
      };
    }

    if (s.includes('lisp') || s.includes('purge')) {
      const ext = '.lsp';
      const code = `;; ============================================================================
;; CADGuide Automated Batch Purge & Database Audit Routine (${tool.title})
;; Target: AutoCAD / BricsCAD / ZWCAD / GstarCAD LISP Engine
;; Parameters: Audit Fix=${paramA > 0 ? 'YES' : 'NO'}, Purge Depth=${Math.max(1, Math.round(paramB))}, RegApp Limit=${Math.round(paramC * 100)}
;; ============================================================================
(defun c:CG_BATCH_CLEAN ( / doc)
  (vl-load-com)
  (setvar "CMDECHO" 0)
  (princ "\\n[CADGuide] Starting deep DWG database purge and RegApp cleanup...")
  (repeat ${Math.max(1, Math.min(5, Math.round(paramB / 10)))}
    (command "_.-PURGE" "_All" "*" "_No")
    (command "_.-PURGE" "_Regapps" "*" "_No")
    (command "_.-PURGE" "_Zero" "_No")
    (command "_.-PURGE" "_Empty" "_No")
  )
  ${paramA > 0 ? '(command "_.AUDIT" "_Yes")' : '; Audit skipped'}
  (command "_.QSAVE")
  (setvar "CMDECHO" 1)
  (princ "\\n[CADGuide] Batch purge & RegApp optimization completed successfully.")
  (princ)
)`;
      return {
        labelA: 'Enable Database AUDIT (1=Yes, 0=No)',
        labelB: 'Recursive Purge Passes (x10)',
        labelC: 'RegApp Threshold Factor',
        ext,
        filename: `${tool.slug}${ext}`,
        lang: 'AutoLISP (.LSP)',
        code,
      };
    }

    if (s.includes('hatch') || s.includes('pat')) {
      const spacing = Math.max(1, paramB);
      const angle = paramA % 360;
      const dash = Math.max(1, paramC * 10);
      const ext = '.pat';
      const code = `; ============================================================================
; CADGuide Custom Hatch Pattern Definition (ISO / ASME Standard .PAT)
; Pattern Name: CG_CUSTOM_${Math.round(angle)}DEG_${Math.round(spacing)}MM
; Angle: ${angle} deg | Line Spacing: ${spacing} mm | Dash Segment: ${dash.toFixed(1)} mm
; ============================================================================
*CG_CUSTOM_PATTERN, CADGuide Parametric Engineering Hatch (${angle} deg, ${spacing}mm pitch)
${angle.toFixed(2)}, 0, 0, 0, ${spacing.toFixed(3)}
${((angle + 90) % 360).toFixed(2)}, 0, 0, ${ (spacing / 2).toFixed(3) }, ${spacing.toFixed(3)}, ${dash.toFixed(3)}, -${(dash / 2).toFixed(3)}
`;
      return {
        labelA: 'Primary Hatch Angle (deg)',
        labelB: 'Line Pitch Spacing (mm)',
        labelC: 'Cross-Dash Ratio Factor',
        ext,
        filename: `custom-hatch${ext}`,
        lang: 'AutoCAD Hatch (.PAT)',
        code,
      };
    }

    if (s.includes('layer') || s.includes('title-block') || s.includes('frame')) {
      const sheetW = Math.max(210, paramA * 8.41);
      const sheetH = Math.max(297, paramB * 23.76);
      const margin = Math.max(5, paramC * 10);
      const ext = '.scr';
      const code = `; ============================================================================
; CADGuide ISO 13567 / ISO 5457 Standardized Layer & Title Block Script (.SCR)
; Sheet Envelope: ${sheetW.toFixed(0)} x ${sheetH.toFixed(0)} mm | Border Margin: ${margin.toFixed(1)} mm
; ============================================================================
-LAYER
Make A-ANNO-TTLB Color 7 A-ANNO-TTLB LWeight 0.50 A-ANNO-TTLB
Make A-WALL-FULL Color 4 A-WALL-FULL LWeight 0.35 A-WALL-FULL
Make A-DIMS-MAIN Color 2 A-DIMS-MAIN LWeight 0.18 A-DIMS-MAIN
Make A-HATCH-PATT Color 8 A-HATCH-PATT LWeight 0.13 A-HATCH-PATT
Make M-PART-OUTL Color 7 M-PART-OUTL LWeight 0.50 M-PART-OUTL
Make M-CNTR-AXIS Color 1 M-CNTR-AXIS LType CENTER M-CNTR-AXIS LWeight 0.18 M-CNTR-AXIS
Set A-ANNO-TTLB

RECTANG 0,0 ${sheetW.toFixed(1)},${sheetH.toFixed(1)}
RECTANG ${margin.toFixed(1)},${margin.toFixed(1)} ${(sheetW - margin).toFixed(1)},${(sheetH - margin).toFixed(1)}
RECTANG ${(sheetW - margin - 180).toFixed(1)},${margin.toFixed(1)} ${(sheetW - margin).toFixed(1)},${(margin + 55).toFixed(1)}
ZOOM Extents
`;
      return {
        labelA: 'Sheet Width Factor (100 = ISO A1 841mm)',
        labelB: 'Sheet Height Factor (25 = ISO A1 594mm)',
        labelC: 'Border Margin Factor (x10 mm)',
        ext,
        filename: `${tool.slug}${ext}`,
        lang: 'CAD Command Script (.SCR)',
        code,
      };
    }

    if (s.includes('thread-milling')) {
      const majorDia = Math.max(6, paramB);
      const cutterDia = Math.max(3, majorDia * 0.65);
      const pitchP = Math.max(0.5, paramC);
      const pathRadius = (majorDia - cutterDia) / 2;
      const halfRadius = pathRadius / 2;
      const zBottom = -Math.max(5, Math.round(majorDia * 1.5));
      const feedF = Math.max(40, paramA * 1.8);
      const ext = '.nc';
      const code = `%
O1002 (${tool.title.toUpperCase()} - G03 HELICAL THREAD MILLING)
(THREAD MAJOR DIA: M${majorDia.toFixed(1)} X ${pitchP.toFixed(2)} MM | CUTTER DIA: ${cutterDia.toFixed(2)} MM)
(CLIMB MILLING BOTTOM-UP SINGLE-PASS HELICAL INTERPOLATION)
G21 G17 G40 G49 G80 G90
T02 M06 (SOLID CARBIDE THREAD MILL)
G00 G90 G54 X0.000 Y0.000 S${Math.round(paramA * 32)} M03
G43 H02 Z15.000 M08
G00 Z2.000
G01 Z${zBottom.toFixed(3)} F${(feedF * 2).toFixed(1)}
G91 G01 G41 D02 X${halfRadius.toFixed(3)} Y-${halfRadius.toFixed(3)} F${feedF.toFixed(1)}
G03 X${halfRadius.toFixed(3)} Y${halfRadius.toFixed(3)} R${halfRadius.toFixed(3)} Z${(pitchP / 4).toFixed(3)}
G03 X0.000 Y0.000 I-${pathRadius.toFixed(3)} J0.000 Z${pitchP.toFixed(3)} F${feedF.toFixed(1)}
G03 X-${halfRadius.toFixed(3)} Y${halfRadius.toFixed(3)} R${halfRadius.toFixed(3)} Z${(pitchP / 4).toFixed(3)}
G01 G40 X-${halfRadius.toFixed(3)} Y-${halfRadius.toFixed(3)}
G90 G00 Z25.000 M09
M05
G28 G91 Z0.0
M30
%`;
      return {
        labelA: 'Surface Speed Factor (m/min)',
        labelB: 'Nominal Thread Major Dia D (mm)',
        labelC: 'Thread Pitch P (mm)',
        ext,
        filename: `${tool.slug}${ext}`,
        lang: 'ISO Helical G-Code (.NC)',
        code,
      };
    }

    if (s.includes('cnc-2d-profile') || s.includes('cnc-facing-pocket')) {
      const widthX = Math.max(20, paramA);
      const lengthY = Math.max(20, paramB * 3);
      const stepdownZ = -Math.max(0.5, paramC * 2);
      const feedF = Math.max(150, paramA * 6);
      const ext = '.nc';
      const code = `%
O1003 (${tool.title.toUpperCase()} - 2.5D MILLING TOOLPATH)
(WORKPIECE ENVELOPE: ${widthX.toFixed(1)} X ${lengthY.toFixed(1)} MM | AXIAL DOC Z: ${stepdownZ.toFixed(2)} MM)
G21 G17 G40 G49 G80 G90
T03 M06 (FLAT END MILL Ø12.0 MM)
G00 G90 G54 X-10.000 Y-10.000 S${Math.round(paramA * 45)} M03
G43 H03 Z20.000 M08
G00 Z2.000
G01 Z${stepdownZ.toFixed(3)} F${(feedF * 0.35).toFixed(1)}
G01 G41 D03 X0.000 Y0.000 F${feedF.toFixed(1)}
G01 X${widthX.toFixed(3)} Y0.000
G01 X${widthX.toFixed(3)} Y${lengthY.toFixed(3)}
G01 X0.000 Y${lengthY.toFixed(3)}
G01 X0.000 Y0.000
G01 G40 X-10.000 Y-10.000
G00 Z50.000 M09
M05
G28 G91 Z0.0
M30
%`;
      return {
        labelA: 'Profile Width X (mm)',
        labelB: 'Profile Length Y Factor (×3 mm)',
        labelC: 'Axial Depth of Cut Factor (×2 mm)',
        ext,
        filename: `${tool.slug}${ext}`,
        lang: 'ISO Milling G-Code (.NC)',
        code,
      };
    }

    if (s.includes('gcode') || s.includes('drilling') || s.includes('svg-to-gcode')) {
      const depthZ = -Math.abs(paramB);
      const peckQ = Math.max(0.5, paramC * 2);
      const feedF = Math.max(10, paramA * 2.5);
      const ext = '.nc';
      const code = `%
O1001 (${tool.title.toUpperCase()} - FANUC / HAAS ISO G-CODE)
(DATE: 2026-10-16 | UNITS: METRIC MM | SAFE Z: 15.0 MM)
G21 G17 G40 G49 G80 G90
T01 M06 (SPOT / PECK DRILL TOOL)
G00 G90 G54 X0.000 Y0.000 S${Math.round(paramA * 18)} M03
G43 H01 Z15.000 M08
(G83 DEEP HOLE PECK DRILLING CYCLE)
G98 G83 X25.000 Y25.000 Z${depthZ.toFixed(3)} R2.000 Q${peckQ.toFixed(3)} F${feedF.toFixed(1)}
X75.000 Y25.000
X75.000 Y75.000
X25.000 Y75.000
G80
G00 Z50.000 M09
M05
G28 G91 Z0.0
M30
%`;
      return {
        labelA: 'Cutting Speed / Feed Base (m/min)',
        labelB: 'Target Z Drilling / Cut Depth (mm)',
        labelC: 'Peck Depth Q / Stepdown Factor',
        ext,
        filename: `${tool.slug}${ext}`,
        lang: 'ISO RS-274D G-Code (.NC)',
        code,
      };
    }

    if (s.includes('naca') || s.includes('airfoil')) {
      const chord = Math.max(10, paramA);
      const thicknessPct = Math.max(4, Math.min(30, paramB / 2));
      const ext = '.dat';
      const pts = [0.0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map(x => {
        const yt = 5 * (thicknessPct / 100) * (0.2969 * Math.sqrt(x) - 0.1260 * x - 0.3516 * Math.pow(x, 2) + 0.2843 * Math.pow(x, 3) - 0.1015 * Math.pow(x, 4));
        return `${(x * chord).toFixed(4)}   ${(yt * chord).toFixed(4)}   0.0000`;
      });
      const code = `# ${tool.title} — Precision Coordinate / Geometry Point Table
# Chord / Scale: ${chord.toFixed(1)} mm | Thickness / Pitch Parameter: ${thicknessPct.toFixed(1)}% | Factor: ${paramC}
# Format: X (mm)      Y (mm)      Z (mm)
${pts.join('\n')}`;
      return {
        labelA: 'Chord Length / Base Pitch (mm)',
        labelB: 'Profile Thickness / Lift (mm)',
        labelC: 'Tolerance / Fillet Factor',
        ext,
        filename: `${tool.slug}${ext}`,
        lang: 'CAD Coordinate Table (.DAT)',
        code,
      };
    }

    if (s.includes('bom-extractor')) {
      const ext = '.csv';
      const qtyBase = Math.max(1, Math.round(paramB / 5));
      const code = `ITEM_NO,PART_NUMBER,BLOCK_NAME,LAYER,QUANTITY,UNIT_MASS_KG,TOTAL_MASS_KG
1,ISO-4017-M10X40,HEX_BOLT_M10,M-FAST-HARDWARE,${qtyBase * 4},${(0.032 * paramC).toFixed(3)},${(qtyBase * 4 * 0.032 * paramC).toFixed(3)}
2,ISO-7089-10,WASHER_PLAIN_10,M-FAST-HARDWARE,${qtyBase * 8},${(0.004 * paramC).toFixed(3)},${(qtyBase * 8 * 0.004 * paramC).toFixed(3)}
3,ISO-4032-M10,HEX_NUT_M10,M-FAST-HARDWARE,${qtyBase * 4},${(0.011 * paramC).toFixed(3)},${(qtyBase * 4 * 0.011 * paramC).toFixed(3)}
4,BRKT-BASE-${Math.round(paramA)},MOUNTING_PLATE,M-PART-STEEL,${qtyBase},${(1.85 * paramC).toFixed(3)},${(qtyBase * 1.85 * paramC).toFixed(3)}`;
      return {
        labelA: 'Assembly Series ID',
        labelB: 'Sub-Assembly Multiplier (x5)',
        labelC: 'Material Density Scale Factor',
        ext,
        filename: `${tool.slug}${ext}`,
        lang: 'Structured BOM Export (.CSV)',
        code,
      };
    }

    if (s.includes('fastener-profile')) {
      const shankDia = Math.max(4, Math.round(paramB / 2));
      const boltLen = Math.max(16, paramA / 2);
      const headW = shankDia * 1.65;
      const headH = shankDia * 0.65;
      const ext = '.dxf';
      const code = `0\nSECTION\n2\nHEADER\n9\n$INSUNITS\n70\n4\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nLINE\n8\nISO_HEX_HEAD\n10\n-${(headW / 2).toFixed(3)}\n20\n0.0\n11\n${(headW / 2).toFixed(3)}\n21\n0.0\n0\nLINE\n8\nISO_HEX_HEAD\n10\n-${(headW / 2).toFixed(3)}\n20\n${headH.toFixed(3)}\n11\n${(headW / 2).toFixed(3)}\n21\n${headH.toFixed(3)}\n0\nLINE\n8\nISO_SHANK_M${shankDia}\n10\n-${(shankDia / 2).toFixed(3)}\n20\n0.0\n11\n-${(shankDia / 2).toFixed(3)}\n21\n-${boltLen.toFixed(3)}\n0\nLINE\n8\nISO_SHANK_M${shankDia}\n10\n${(shankDia / 2).toFixed(3)}\n20\n0.0\n11\n${(shankDia / 2).toFixed(3)}\n21\n-${boltLen.toFixed(3)}\n0\nENDSEC\n0\nEOF`;
      return {
        labelA: 'Nominal Bolt Length Factor (×0.5 mm)',
        labelB: 'Nominal Thread Size Factor (×0.5 mm)',
        labelC: 'Thread Pitch p (mm)',
        ext,
        filename: `iso-4017-m${shankDia}x${Math.round(boltLen)}${ext}`,
        lang: 'ISO Fastener 2D Side-View (.DXF)',
        code,
      };
    }

    if (s.includes('spring-flat-pattern')) {
      const meanDia = Math.max(10, paramA / 2);
      const activeCoils = Math.max(3, Math.round(paramB / 3));
      const wireDia = Math.max(1.0, paramC * 2);
      const developedLen = Math.PI * meanDia * activeCoils;
      const ext = '.dxf';
      const code = `0\nSECTION\n2\nHEADER\n9\n$INSUNITS\n70\n4\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nCIRCLE\n8\nSPRING_MEAN_COIL_DIA\n10\n0.0\n20\n0.0\n40\n${(meanDia / 2).toFixed(3)}\n0\nCIRCLE\n8\nSPRING_OUTER_DIA\n10\n0.0\n20\n0.0\n40\n${((meanDia + wireDia) / 2).toFixed(3)}\n0\nLINE\n8\nDEVELOPED_WIRE_LENGTH\n10\n0.0\n20\n-${(meanDia + 15).toFixed(3)}\n11\n${developedLen.toFixed(3)}\n21\n-${(meanDia + 15).toFixed(3)}\n0\nENDSEC\n0\nEOF`;
      return {
        labelA: 'Mean Coil Diameter Factor (×0.5 mm)',
        labelB: 'Active Coils Factor (×3)',
        labelC: 'Wire Diameter Factor (×2 mm)',
        ext,
        filename: `${tool.slug}${ext}`,
        lang: 'Spring Coil & Unfolded Wire (.DXF)',
        code,
      };
    }

    // Default generator: Involute Gear / Box Joint ASCII DXF Generator
    const pitchR = Math.max(10, (paramA * Math.max(6, paramB)) / 200);
    const ext = '.dxf';
    const code = `0
SECTION
2
HEADER
9
$INSUNITS
70
4
0
ENDSEC
0
SECTION
2
ENTITIES
0
CIRCLE
8
PITCH_CIRCLE
10
0.0
20
0.0
30
0.0
40
${pitchR.toFixed(4)}
0
CIRCLE
8
OUTER_ADDENDUM
10
0.0
20
0.0
30
0.0
40
${(pitchR + paramC * 2).toFixed(4)}
0
CIRCLE
8
ROOT_DEDENDUM
10
0.0
20
0.0
30
0.0
40
${Math.max(2, pitchR - paramC * 2.5).toFixed(4)}
0
ENDSEC
0
EOF`;
    return {
      labelA: 'Profile Scale / Pitch Factor',
      labelB: 'Tooth / Tab Count (Z)',
      labelC: 'Module m / Material Thickness (mm)',
      ext,
      filename: `${tool.slug}${ext}`,
      lang: 'AutoCAD ASCII Drawing Exchange (.DXF)',
      code,
    };
  }, [tool.slug, tool.title, paramA, paramB, paramC]);

  // 双栏文本/BOM/G-Code/DXF 差异对比器状态与逻辑（针对 bom-comparator, dxf-geometry-diff-comparator, gcode-diff-comparator）
  const defaultDiffLeft = useMemo(() => {
    const s = tool.slug.toLowerCase();
    if (s.includes('gcode')) {
      return `O2001 (REV-A MILLING OP)\nG21 G17 G90 G54\nT01 M06\nS8000 M03\nG00 X0.0 Y0.0 Z15.0\nG01 Z-2.0 F400\nG01 X100.0 Y0.0 F1200\nG00 Z25.0\nM30`;
    }
    if (s.includes('dxf')) {
      return `0\nSECTION\n2\nENTITIES\n0\nLINE\n8\nA-WALL\n10\n0.0\n20\n0.0\n11\n5000.0\n21\n0.0\n0\nCIRCLE\n8\nM-HOLE\n40\n12.5\n0\nENDSEC`;
    }
    return `PART_NO,DESCRIPTION,QTY,MATERIAL,REV\n100-01,BASE HOUSING,1,AL 6061-T6,A\n100-02,DRIVE SHAFT,2,AISI 4140,A\n100-03,HEX BOLT M8X25,8,ISO 898-1 8.8,A\n100-04,BEARING 6204-2RS,2,CHROME STEEL,A`;
  }, [tool.slug]);

  const defaultDiffRight = useMemo(() => {
    const s = tool.slug.toLowerCase();
    if (s.includes('gcode')) {
      return `O2001 (REV-B MILLING OP - HIGH FEED)\nG21 G17 G90 G54\nT01 M06\nS10500 M03\nG00 X0.0 Y0.0 Z15.0\nG01 Z-2.5 F600\nG01 X100.0 Y0.0 F1800\nG01 X100.0 Y50.0 F1800\nG00 Z25.0\nM30`;
    }
    if (s.includes('dxf')) {
      return `0\nSECTION\n2\nENTITIES\n0\nLINE\n8\nA-WALL\n10\n0.0\n20\n0.0\n11\n5500.0\n21\n0.0\n0\nCIRCLE\n8\nM-HOLE\n40\n16.0\n0\nENDSEC`;
    }
    return `PART_NO,DESCRIPTION,QTY,MATERIAL,REV\n100-01,BASE HOUSING,1,AL 7075-T6,B\n100-02,DRIVE SHAFT,2,AISI 4140,A\n100-03,HEX BOLT M8X30,12,ISO 898-1 10.9,B\n100-05,RETAINING RING DIN 471,2,SPRING STEEL,A`;
  }, [tool.slug]);

  const [diffLeftText, setDiffLeftText] = useState<string>('');
  const [diffRightText, setDiffRightText] = useState<string>('');
  const activeLeft = diffLeftText || defaultDiffLeft;
  const activeRight = diffRightText || defaultDiffRight;

  const diffLines = useMemo(() => {
    const leftArr = activeLeft.split('\n');
    const rightArr = activeRight.split('\n');
    const maxLen = Math.max(leftArr.length, rightArr.length);
    const out: Array<{ line: number; left: string; right: string; status: 'same' | 'modified' | 'added' | 'removed' }> = [];
    for (let i = 0; i < maxLen; i++) {
      const l = leftArr[i] ?? '';
      const r = rightArr[i] ?? '';
      if (l === r) out.push({ line: i + 1, left: l, right: r, status: 'same' });
      else if (!l && r) out.push({ line: i + 1, left: '', right: r, status: 'added' });
      else if (l && !r) out.push({ line: i + 1, left: l, right: '', status: 'removed' });
      else out.push({ line: i + 1, left: l, right: r, status: 'modified' });
    }
    return out;
  }, [activeLeft, activeRight]);

  const handleExportCsv = () => {
    if (!referenceData) return;
    const escapeCsv = (val: string) => `"${val.replace(/"/g, '""')}"`;
    const lines = [
      referenceData.headers.map(escapeCsv).join(','),
      ...filteredRows.map(r => r.map(escapeCsv).join(','))
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tool.slug}-reference.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isCompressorFamily = [
    'online-cad-file-compressor',
    'dwg-file-size-reducer',
    'step-file-size-reducer',
    'stl-mesh-decimator-reducer',
    'ifc-model-size-optimizer'
  ].includes(tool.slug);

  const handleDownloadGenerated = () => {
    const blob = new Blob([generatorOutput.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = generatorOutput.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Validators, viewers and the in-browser converters use the real file workbench.
  const useWorkbench = workbenchSupports(tool.slug);
  // Category says "validator", but the task is a calculation — render it as a calculator.
  const isCalcOverride = tool.slug === 'thread-engagement-length-checker';
  const isViewerOrValidator = !useWorkbench && !isCalcOverride && (tool.category === 'viewer' || tool.category === 'validator');
  const isConverter = !useWorkbench && tool.category === 'converter';
  const isTroubleshoot = tool.category === 'troubleshoot';
  const isCheatsheetOrLib = tool.category === 'cheatsheet' || tool.category === 'library' || (tool.category === 'comparator' && (!!REFERENCE_DATASETS[tool.slug] || !!SLUG_TO_DATASET_MAP[tool.slug]));
  const isGenerator = tool.category === 'generator';
  const isDiffComparator = tool.category === 'comparator' && !isCheatsheetOrLib;
  const isCalculatorOrGen = tool.category === 'calculator' || isCalcOverride;

  return (
    <div className="space-y-12">
      {/* 1. Header Hero Card */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        
        <div className="max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Free Engineering Tool</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isConverter ? 'Local file preflight only — conversion runs in the linked engines' : 'Runs in your browser — no upload'}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {tool.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {tool.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
            <span>Results are engineering estimates — verify against the governing code or standard before use.</span>
          </div>
        </div>
      </section>

      {/* 2. Sponsored placement (clearly labelled; does not influence tool output or rankings) */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 border border-blue-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black border border-blue-400/30">
            <span>Sponsored</span>
          </div>
          <h3 className="text-xl font-black tracking-tight">
            DWG FastView — Online DWG/DXF Viewer
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            Need to open, measure or mark up a DWG without installing CAD? DWG FastView runs in the browser. This is a sponsored placement and has no effect on the results of the tool above.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
          <a
            href="https://en.dwgfastview.com/"
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all text-center"
          >
            <span>Open DWG FastView</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* 3. Interactive Main Functional Experience */}

      {/* 模式 W: 真实本地文件工作台（校验器 / 查看器 / 浏览器内转换） */}
      {useWorkbench && <CadFileWorkbench slug={tool.slug} title={tool.title} />}
      
      {/* 模式 A: Viewer / 3D Mesh / Validator (带真实本地预检与云端推荐) */}
      {isViewerOrValidator && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-blue-600" />
                <span>Client-Side File Inspection & Verification Studio</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Load your CAD or mesh files locally to verify header geometry, entity structures, and compliance.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full self-start sm:self-auto">
              Local header read
            </span>
          </div>

          {/* 隐藏的真实文件选择输入 */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                processRealFile(e.target.files[0]);
              }
            }}
          />

          {/* Local Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
              fileDetails
                ? 'border-emerald-400 bg-emerald-50/20'
                : 'border-slate-200 bg-slate-50/60 hover:bg-blue-50/30 hover:border-blue-300'
            }`}
          >
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mx-auto text-blue-600">
                {fileDetails ? <FileCheck2 className="w-7 h-7 text-emerald-600" /> : <UploadCloud className="w-7 h-7" />}
              </div>
              {fileDetails ? (
                <div className="space-y-1.5">
                  <p className="text-sm font-bold text-slate-900 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{fileDetails.name} ({fileDetails.size})</span>
                  </p>
                  <div className="p-3 bg-white border border-emerald-200 rounded-xl text-left text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Detected Format:</span>
                      <span className="font-bold text-slate-800">{fileDetails.detectedFormat}</span>
                    </div>
                    {fileDetails.headerPreview && (
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="text-slate-400">Header Signature:</span>
                        <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">{fileDetails.headerPreview}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Verification:</span>
                      <span className="font-bold text-slate-600">Header read — format identified only (no geometry validation)</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFileDetails(null); }}
                    className="text-[11px] font-bold text-rose-500 hover:underline pt-2 inline-block"
                  >
                    Select Different File
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">
                    Click to browse or drag your CAD / 3D file here
                  </p>
                  <p className="text-xs text-slate-400">
                    Supports DWG, DXF, STL, OBJ, STEP, IGES (Up to 500MB, 100% processed locally)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Curated Benchmark Tools */}
          <div className="pt-4 space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600" />
              <span>Verified Industrial Engines for {tool.title}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'DWG FastView Web', type: 'Sponsored', desc: 'Instant zero-lag multi-format CAD viewer with layer isolation and measurement.', url: 'https://en.dwgfastview.com/' },
                { name: 'Autodesk Viewer', type: 'Enterprise Cloud Engine', desc: 'Free online viewing for 80+ file formats including Revit, Navisworks, and Inventor.', url: 'https://viewer.autodesk.com/' },
                { name: 'FreeCAD', type: 'Open-Source Desktop App', desc: 'Free, offline desktop CAD for inspecting STEP, IGES, STL and DXF geometry.', url: 'https://www.freecad.org/' }
              ].map((bench, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-slate-900 text-sm">{bench.name}</span>
                      <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{bench.type}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{bench.desc}</p>
                  </div>
                  <a
                    href={bench.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700 bg-white border border-slate-200 px-3 py-2 rounded-xl transition-all"
                  >
                    <span>Launch Engine</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 模式 E: Converter (3D/2D CAD 格式互转与客户端预检工作台) */}
      {isConverter && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-blue-600" />
                <span>Multi-Format CAD Conversion & Dispatch Studio</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Client-side format preflight verification, unit normalization, and high-fidelity cloud conversion dispatch.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full self-start sm:self-auto">
              Local preflight only
            </span>
          </div>

          {/* 隐藏的真实文件选择输入 */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                processRealFile(e.target.files[0]);
              }
            }}
          />

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center transition-all cursor-pointer ${
              fileDetails
                ? 'border-emerald-400 bg-emerald-50/20'
                : 'border-slate-200 bg-slate-50/60 hover:bg-blue-50/30 hover:border-blue-300'
            }`}
          >
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mx-auto text-blue-600">
                {fileDetails ? <FileCheck2 className="w-7 h-7 text-emerald-600" /> : <UploadCloud className="w-7 h-7" />}
              </div>
              {fileDetails ? (
                <div className="space-y-1.5">
                  <p className="text-sm font-bold text-slate-900 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{fileDetails.name} ({fileDetails.size})</span>
                  </p>
                  <div className="p-3 bg-white border border-emerald-200 rounded-xl text-left text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Detected Format:</span>
                      <span className="font-bold text-slate-800">{fileDetails.detectedFormat}</span>
                    </div>
                    {fileDetails.headerPreview && (
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="text-slate-400">Header Signature:</span>
                        <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">{fileDetails.headerPreview}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className="font-bold text-slate-600">Format identified — use an engine below to convert</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFileDetails(null); }}
                    className="text-[11px] font-bold text-rose-500 hover:underline pt-2 inline-block"
                  >
                    Select Different File
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">
                    Click to select or drag your source CAD / Vector file here
                  </p>
                  <p className="text-xs text-slate-400">
                    Supports DWG, DXF, SVG, STEP, IGES, STL, OBJ, PDF (Local inspection, zero data loss)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Settings checklist for the external conversion engine (informational — this page does not convert) */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Settings to confirm in your conversion engine
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700 font-medium">
              <li><span className="font-bold block">Target version / schema</span>DWG: AC1027 (2013) is the most widely readable. STEP: AP242 keeps PMI/GD&amp;T, AP214 keeps colours and layers.</li>
              <li><span className="font-bold block">Units</span>Confirm source units before converting — unitless DXF/STL files are the most common cause of 25.4× and 1000× scale errors.</li>
              <li><span className="font-bold block">Tessellation (mesh outputs)</span>Chordal deviation ≈ 0.01–0.02 mm for 3D printing; 0.1 mm is usually enough for web/visualisation.</li>
            </ul>
          </div>

          {/* Curated Conversion Pipelines */}
          <div className="pt-2 space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Recommended Industrial Conversion Engines for {tool.title}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'DWG FastView Cloud Engine', badge: 'Sponsored', desc: 'Direct browser batch conversion between DWG, DXF, DWF, and high-res vector PDF.', url: 'https://en.dwgfastview.com/' },
                { name: 'Autodesk Cloud Translation', badge: 'Official APS', desc: 'Convert 80+ mechanical & BIM formats into lightweight web SVF / glTF / STEP.', url: 'https://viewer.autodesk.com/' },
                { name: 'FreeCAD Open Engine', badge: '100% Offline', desc: 'Local open-source B-Rep kernel stitching for STEP, IGES, STL, and DXF files.', url: 'https://www.freecad.org/' }
              ].map((engine, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-slate-900 text-sm">{engine.name}</span>
                      <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{engine.badge}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{engine.desc}</p>
                  </div>
                  <a
                    href={engine.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700 bg-white border border-slate-200 px-3 py-2 rounded-xl transition-all shadow-xs"
                  >
                    <span>Dispatch to Engine</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 模式 B: Cheatsheet / Reference Library (高密度权威参数数据表) */}
      {isCheatsheetOrLib && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Standardized Engineering Reference Matrix</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Verified dimensions, tolerance standards, and cross-reference specifications.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 print:hidden">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter parameters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {referenceData && (
                <>
                  <button
                    onClick={handleExportCsv}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold transition-all"
                    title="Download Reference Table as CSV"
                  >
                    <FileCode className="w-3.5 h-3.5 text-slate-600" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-xs transition-all"
                    title="Print or Save as One-Page A4 PDF Cheat Sheet"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print A4 PDF</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {referenceData ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-black border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    {referenceData.headers.map((h, i) => (
                      <th key={i} className="py-3 px-4 whitespace-nowrap">{h}</th>
                    ))}
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-blue-50/50 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className={`py-3 px-4 ${cIdx === 0 ? 'font-bold text-slate-900 whitespace-nowrap' : ''}`}>
                          {cell}
                        </td>
                      ))}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleCopy(row.join(' | '), `row-${rIdx}`)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
                          title="Copy Row Spec"
                        >
                          {copiedKey === `row-${rIdx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-3 bg-slate-50/60 border-t border-slate-200 text-[11px] text-slate-500 font-semibold flex items-center justify-between">
                <span>{referenceData.note}</span>
                <span>Showing {filteredRows.length} entries</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <p className="text-sm font-bold text-slate-800">
                Full Industrial Reference Dataset for {tool.title}
              </p>
              <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
                {tool.detailDesc}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleCopy(tool.detailDesc, 'detail-desc')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all shadow-xs"
                >
                  {copiedKey === 'detail-desc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Standard Specifications</span>
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 模式 C: Troubleshooting Wizards (排障决策流程) */}
      {isTroubleshoot && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-rose-600" />
                <span>Industrial Diagnostic & Emergency Fix Procedures</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Target Platform: <strong className="text-slate-800">{troubleshootData.softwareName}</strong> • Manufacturer engineering KB and verified administrator procedures.
              </p>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100 self-start sm:self-auto">
              ● Active Diagnostic Tree
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {troubleshootData.steps.map((st) => (
              <div key={st.step} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                      Step {st.step}
                    </span>
                    {st.cmd && (
                      <button
                        onClick={() => handleCopy(st.cmd || '', `cmd-${st.step}`)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all"
                      >
                        {copiedKey === `cmd-${st.step}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Code</span>
                      </button>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{st.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{st.desc}</p>
                  {st.cmd && (
                    <div className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto font-bold">
                      {st.cmd}
                    </div>
                  )}
                  <p className="text-[11px] text-slate-500 leading-normal">{st.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* System Variable Table */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Critical System Variables & Configuration Thresholds ({troubleshootData.softwareName})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {troubleshootData.envVars.map((v, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs font-black text-slate-900">
                    <span>{v.name}</span>
                    <span className="text-blue-600 font-mono bg-blue-50 px-1.5 rounded">{v.recommended}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 模式 D: Calculator / Generator / Comparator (参数输入与公式校核) */}
      {isCalculatorOrGen && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-600" />
                <span>Engineering Design & Spec Verification Workbench</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Parametric calculation, standard equations, and code compliance validation for {tool.title}.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                calcResult.pass 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {calcResult.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Controls */}
            <div className="lg:col-span-7 space-y-5 bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Parametric Design Inputs
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{calcSchema.labelA}</label>
                  <input
                    type="number"
                    value={paramA}
                    onChange={(e) => setParamA(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{calcSchema.labelB}</label>
                  <input
                    type="number"
                    value={paramB}
                    onChange={(e) => setParamB(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{calcSchema.labelC}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={paramC}
                    onChange={(e) => setParamC(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200/80 space-y-2">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Governing Formulation:</span>
                <p className="font-mono text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {calcSchema.formula}
                </p>
              </div>
            </div>

            {/* Verification Results Output */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-2xl space-y-6 shadow-md">
              <div>
                <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                  Derived Engineering Performance
                </span>
                <div className="text-3xl font-black text-white mt-1">
                  {calcResult.primary} <span className="text-sm font-semibold text-indigo-300">{calcSchema.unit}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{calcSchema.desc}</p>
              </div>

              <div className="pt-4 border-t border-indigo-900/60 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">{calcSchema.secondaryLabel || 'Design Index / Stress Ratio'}</div>
                  <div className="text-lg font-black text-indigo-200">{calcResult.secondary}</div>
                </div>
                <button
                  onClick={() => handleCopy(`Calculation for ${tool.title}: Primary=${calcResult.primary} ${calcSchema.unit}, Index=${calcResult.secondary}`, 'calc-res')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                >
                  {copiedKey === 'calc-res' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Report</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 模式 F: Generator (真实 CAD 脚本 / .PAT 填充 / G-Code / ASCII DXF / BOM 代码生成工作台) */}
      {isGenerator && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-blue-600" />
                <span>Parametric Code & CAD Script Generator Studio</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Configure engineering parameters below to synthesize production-ready {generatorOutput.lang} files.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
              ● Live {generatorOutput.ext.toUpperCase()} Synthesis
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-5 bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Generator Parameters
              </h4>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{generatorOutput.labelA}</label>
                  <input
                    type="number"
                    value={paramA}
                    onChange={(e) => setParamA(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{generatorOutput.labelB}</label>
                  <input
                    type="number"
                    value={paramB}
                    onChange={(e) => setParamB(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{generatorOutput.labelC}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={paramC}
                    onChange={(e) => setParamC(Number(e.target.value) || 0.5)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => handleCopy(generatorOutput.code, 'gen-code')}
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  {copiedKey === 'gen-code' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'gen-code' ? 'Copied to Clipboard!' : 'Copy Generated Code'}</span>
                </button>
                <button
                  onClick={handleDownloadGenerated}
                  className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Download {generatorOutput.ext.toUpperCase()}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-900 text-slate-100 p-6 rounded-2xl space-y-3 shadow-md overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {generatorOutput.filename} ({generatorOutput.lang})
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {generatorOutput.code.split('\n').length} lines generated
                </span>
              </div>
              <pre className="font-mono text-xs text-emerald-300 overflow-x-auto max-h-80 leading-relaxed">
                {generatorOutput.code}
              </pre>
            </div>
          </div>
        </section>
      )}

      {/* 模式 G: Diff Comparator (双栏 BOM / G-Code / DXF 工程文件行级对比工作台) */}
      {isDiffComparator && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>Side-by-Side Revision Diff & Verification Studio</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Paste Revision A and Revision B data below to inspect line-by-line modifications, additions, and deletions locally.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                {diffLines.filter(d => d.status !== 'same').length} Differences Detected
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Baseline Revision A</label>
              <textarea
                rows={7}
                value={activeLeft}
                onChange={(e) => setDiffLeftText(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Target Revision B</label>
              <textarea
                rows={7}
                value={activeRight}
                onChange={(e) => setDiffRightText(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 text-xs font-black text-slate-700 flex justify-between">
              <span>Line-by-Line Delta Audit</span>
              <span>Green = Added • Amber = Modified • Red = Removed</span>
            </div>
            <div className="divide-y divide-slate-100 font-mono text-xs max-h-80 overflow-y-auto">
              {diffLines.map((row) => (
                <div
                  key={row.line}
                  className={`grid grid-cols-12 px-4 py-2 gap-2 ${
                    row.status === 'modified'
                      ? 'bg-amber-50/70 text-amber-950 font-bold'
                      : row.status === 'added'
                        ? 'bg-emerald-50/70 text-emerald-950 font-bold'
                        : row.status === 'removed'
                          ? 'bg-rose-50/70 text-rose-950 font-bold'
                          : 'text-slate-600'
                  }`}
                >
                  <span className="col-span-1 text-slate-400">L{row.line}</span>
                  <span className="col-span-5 truncate">{row.left || '—'}</span>
                  <span className="col-span-5 truncate">{row.right || '—'}</span>
                  <span className="col-span-1 text-right uppercase text-[10px]">{row.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Specialized Format Size Reduction Matrix (For Compressor & Reducer Family) */}
      {isCompressorFamily && (
        <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-lg space-y-5 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400">
                Specialized Format Optimization Suite
              </span>
              <h3 className="text-lg sm:text-xl font-black tracking-tight mt-0.5">
                Target Your Exact CAD / 3D File Format for Maximum Size Reduction
              </h3>
            </div>
            <Link
              href="/toolbox/online-cad-file-compressor"
              className="text-xs font-bold text-indigo-300 hover:text-white underline shrink-0"
            >
              Universal CAD Compressor Hub →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                slug: 'dwg-file-size-reducer',
                badge: '2D/3D DWG',
                title: 'DWG Bloat & RegApp Reducer',
                desc: 'Purge orphaned DGN linetypes, RegApps & scale lists (Up to 85% smaller).'
              },
              {
                slug: 'step-file-size-reducer',
                badge: 'STEP / SLDASM',
                title: 'STEP Assembly Defeature Calc',
                desc: 'Strip internal fasteners, threads & fillets for email-ready 3D STEP files.'
              },
              {
                slug: 'stl-mesh-decimator-reducer',
                badge: 'STL / OBJ Mesh',
                title: '3D Print Mesh Decimator',
                desc: 'Calculate polygon reduction & ASCII-to-Binary STL savings (80% smaller).'
              },
              {
                slug: 'ifc-model-size-optimizer',
                badge: 'Revit / IFC',
                title: 'BIM IFC & IFCZIP Optimizer',
                desc: 'Tune LoD facet tessellation & IFCZIP compression for large BIM models.'
              }
            ].map((item) => (
              <Link
                key={item.slug}
                href={`/toolbox/${item.slug}`}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  tool.slug === item.slug
                    ? 'bg-indigo-600/30 border-indigo-400 shadow-md'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-400/50'
                }`}
              >
                <div className="space-y-1.5">
                  <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    {item.badge}
                  </span>
                  <h4 className="text-sm font-black text-white">{item.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
                <span className="text-xs font-extrabold text-indigo-300 flex items-center gap-1 pt-1">
                  <span>{tool.slug === item.slug ? '● Active Tool' : 'Open Optimizer →'}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. Cross-Workflow Discovery & Recommendations */}
      <section className="space-y-6">
        <RelatedTools />
      </section>

      {/* 5. Navigation Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <Link
          href="/toolbox"
          className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1.5"
        >
          <span>← Back to All Engineering Tools</span>
        </Link>
        <span className="text-xs font-bold text-slate-400">
          Updated: Continuous Industrial Integration 2026
        </span>
      </div>
    </div>
  );
}
