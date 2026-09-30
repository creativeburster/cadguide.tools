'use strict';

const DWG_VERSION_MAP = {
  'AC1032': { version: 'AutoCAD 2018 - 2026', releaseYear: 2018, code: 'AC1032', compatible: 'AutoCAD 2018+' },
  'AC1027': { version: 'AutoCAD 2013 - 2017', releaseYear: 2013, code: 'AC1027', compatible: 'AutoCAD 2013-2017' },
  'AC1024': { version: 'AutoCAD 2010 - 2012', releaseYear: 2010, code: 'AC1024', compatible: 'AutoCAD 2010-2012' },
  'AC1021': { version: 'AutoCAD 2007 - 2009', releaseYear: 2007, code: 'AC1021', compatible: 'AutoCAD 2007-2009' },
  'AC1018': { version: 'AutoCAD 2004 - 2006', releaseYear: 2004, code: 'AC1018', compatible: 'AutoCAD 2004-2006' },
  'AC1015': { version: 'AutoCAD 2000 - 2002', releaseYear: 2000, code: 'AC1015', compatible: 'AutoCAD 2000-2002' },
  'AC1014': { version: 'AutoCAD Release 14', releaseYear: 1997, code: 'AC1014', compatible: 'AutoCAD R14' },
  'AC1012': { version: 'AutoCAD Release 13', releaseYear: 1994, code: 'AC1012', compatible: 'AutoCAD R13' },
  'AC1009': { version: 'AutoCAD Release 11/12', releaseYear: 1990, code: 'AC1009', compatible: 'AutoCAD R11/R12' },
  'AC1006': { version: 'AutoCAD Release 10', releaseYear: 1988, code: 'AC1006', compatible: 'AutoCAD R10' },
  'AC1004': { version: 'AutoCAD Release 9', releaseYear: 1987, code: 'AC1004', compatible: 'AutoCAD R9' },
  'AC1002': { version: 'AutoCAD Release 2.5', releaseYear: 1986, code: 'AC1002', compatible: 'AutoCAD 2.5' },
  'AC2.10': { version: 'AutoCAD Release 2.1', releaseYear: 1985, code: 'AC2.10', compatible: 'AutoCAD 2.1' },
  'MC0.0':  { version: 'MicroCAD Release 1.0', releaseYear: 1982, code: 'MC0.0', compatible: 'MicroCAD 1.0' }
};

/**
 * Parses the first 6 bytes of a DWG file buffer or Uint8Array to detect its internal AutoCAD version.
 * @param {Buffer|Uint8Array|ArrayBuffer} buffer - At least 6 bytes of the DWG file
 * @returns {{ valid: boolean, code?: string, version?: string, releaseYear?: number, compatible?: string, error?: string }}
 */
function parseDwgHeader(buffer) {
  if (!buffer) {
    return { valid: false, error: 'Empty buffer provided' };
  }

  let bytes;
  if (buffer instanceof Uint8Array || Buffer.isBuffer(buffer)) {
    bytes = buffer.subarray(0, 6);
  } else if (buffer instanceof ArrayBuffer) {
    bytes = new Uint8Array(buffer, 0, 6);
  } else {
    return { valid: false, error: 'Unsupported buffer format' };
  }

  if (bytes.length < 6) {
    return { valid: false, error: 'File too small to be a valid DWG header (requires at least 6 bytes)' };
  }

  const magic = String.fromCharCode(...bytes);
  const match = DWG_VERSION_MAP[magic];

  if (!match) {
    return {
      valid: false,
      code: magic,
      error: `Unknown or non-DWG header magic: "${magic}"`
    };
  }

  return {
    valid: true,
    code: match.code,
    version: match.version,
    releaseYear: match.releaseYear,
    compatible: match.compatible
  };
}

module.exports = {
  parseDwgHeader,
  DWG_VERSION_MAP
};
