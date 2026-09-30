'use strict';

/**
 * Standard typical K-Factors by material type and bending method
 */
const MATERIAL_K_FACTORS = {
  mild_steel_air_bend: { name: 'Mild Steel / Low Carbon Steel (Air Bending)', kFactor: 0.44 },
  mild_steel_bottom_bend: { name: 'Mild Steel (Bottom Bending)', kFactor: 0.48 },
  stainless_steel_air: { name: 'Stainless Steel 304/316 (Air Bending)', kFactor: 0.45 },
  aluminum_soft: { name: 'Aluminum 3003 / 5052 (Soft)', kFactor: 0.40 },
  aluminum_hard: { name: 'Aluminum 6061-T6 (Hard)', kFactor: 0.42 },
  copper_brass: { name: 'Copper & Brass', kFactor: 0.38 }
};

/**
 * Calculates Bend Allowance (BA), Outside Setback (OSSB), and Bend Deduction (BD).
 * 
 * @param {Object} params
 * @param {number} params.thickness - Material thickness (T) in mm or inches
 * @param {number} params.insideRadius - Inside bend radius (R)
 * @param {number} params.angleDegrees - Bend angle in degrees (e.g. 90)
 * @param {number} params.kFactor - K-Factor (ratio of neutral axis offset t to thickness T, typically 0.25 to 0.50)
 * @returns {Object} { bendAllowance, outsideSetback, bendDeduction, neutralAxisOffset }
 */
function calculateSheetMetalBend({ thickness, insideRadius, angleDegrees, kFactor }) {
  if (thickness <= 0) throw new Error('Material thickness must be greater than 0');
  if (insideRadius < 0) throw new Error('Inside bend radius must be non-negative');
  if (angleDegrees <= 0 || angleDegrees >= 180) throw new Error('Bend angle must be between 0 and 180 degrees');
  if (kFactor < 0 || kFactor > 1) throw new Error('K-Factor must be between 0.0 and 1.0');

  const rad = (Math.PI / 180) * angleDegrees;
  
  // Bend Allowance (BA) = (pi / 180) * Angle * (R + K * T)
  const bendAllowance = rad * (insideRadius + kFactor * thickness);

  // Outside Setback (OSSB) = tan(Angle / 2) * (R + T)
  const outsideSetback = Math.tan(rad / 2) * (insideRadius + thickness);

  // Bend Deduction (BD) = 2 * OSSB - BA
  const bendDeduction = 2 * outsideSetback - bendAllowance;

  // Neutral Axis Offset from inside surface (t = K * T)
  const neutralAxisOffset = kFactor * thickness;

  return {
    thickness,
    insideRadius,
    angleDegrees,
    kFactor,
    bendAllowance: Number(bendAllowance.toFixed(4)),
    outsideSetback: Number(outsideSetback.toFixed(4)),
    bendDeduction: Number(bendDeduction.toFixed(4)),
    neutralAxisOffset: Number(neutralAxisOffset.toFixed(4))
  };
}

module.exports = {
  calculateSheetMetalBend,
  MATERIAL_K_FACTORS
};
