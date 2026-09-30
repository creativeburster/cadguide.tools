const fs = require('fs');

const DWG_HEADER_MAP = {
  'AC1032': { releases: 'AutoCAD 2018 - 2026', releaseYear: '2018+', isModernFormat: true },
  'AC1027': { releases: 'AutoCAD 2013 - 2017', releaseYear: '2013', isModernFormat: true },
  'AC1024': { releases: 'AutoCAD 2010 - 2012', releaseYear: '2010', isModernFormat: false },
  'AC1021': { releases: 'AutoCAD 2007 - 2009', releaseYear: '2007', isModernFormat: false },
  'AC1018': { releases: 'AutoCAD 2004 - 2006', releaseYear: '2004', isModernFormat: false },
  'AC1015': { releases: 'AutoCAD 2000 - 2002', releaseYear: '2000', isModernFormat: false },
  'AC1014': { releases: 'AutoCAD Release 14', releaseYear: 'R14', isModernFormat: false },
  'AC1012': { releases: 'AutoCAD Release 13', releaseYear: 'R13', isModernFormat: false },
  'AC1009': { releases: 'AutoCAD Release 11 / 12', releaseYear: 'R11/R12', isModernFormat: false },
};

/**
 * Parses the first 6 bytes of an AutoCAD DWG binary file buffer.
 * @param {Buffer|Uint8Array} buffer 
 * @returns {object} DWG version metadata
 */
function parseDWGHeader(buffer) {
  if (!buffer || buffer.length < 6) {
    throw new Error('Buffer is too small to contain a valid DWG header (minimum 6 bytes required).');
  }
  const magicCode = buffer.subarray(0, 6).toString('ascii');
  const match = DWG_HEADER_MAP[magicCode];
  
  if (!match) {
    throw new Error(`Unsupported or invalid DWG header magic bytes: ${magicCode}`);
  }
  
  return {
    magicCode,
    ...match
  };
}

/**
 * Calculates Sheet Metal K-Factor, Bend Allowance (BA), and Bend Deduction (BD).
 */
function calculateKFactor(thickness, radius, angle = 90, k = 0.44) {
  const rad = (angle * Math.PI) / 180;
  const ba = rad * (radius + k * thickness);
  const setback = Math.tan(rad / 2) * (thickness + radius);
  const bd = 2 * setback - ba;
  
  return {
    thickness,
    radius,
    angle,
    kFactor: k,
    bendAllowance: Number(ba.toFixed(4)),
    outsideSetback: Number(setback.toFixed(4)),
    bendDeduction: Number(bd.toFixed(4))
  };
}

module.exports = {
  DWG_HEADER_MAP,
  parseDWGHeader,
  calculateKFactor
};
