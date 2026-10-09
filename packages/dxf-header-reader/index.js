'use strict';

const VERSION_MAP = {
  'AC1032': 'AutoCAD 2018-2026',
  'AC1027': 'AutoCAD 2013-2017',
  'AC1024': 'AutoCAD 2010-2012',
  'AC1021': 'AutoCAD 2007-2009',
  'AC1018': 'AutoCAD 2004-2006',
  'AC1015': 'AutoCAD 2000-2002',
  'AC1014': 'AutoCAD Release 14',
  'AC1012': 'AutoCAD Release 13',
  'AC1009': 'AutoCAD Release 11/12',
  'AC1006': 'AutoCAD Release 10',
  'MC0.0': 'AutoCAD Release 1.0'
};

function parseDxfHeader(buffer) {
  const text = typeof buffer === 'string' ? buffer : buffer.toString('utf-8', 0, Math.min(buffer.length, 4096));
  
  // Check binary DWG first
  const magic = text.slice(0, 6);
  if (VERSION_MAP[magic]) {
    return {
      type: 'DWG',
      version: magic,
      release: VERSION_MAP[magic],
      isBinary: true
    };
  }

  // Check ASCII DXF header
  const acadVerMatch = text.match(/\$ACADVER\s+1\s+([A-Z0-9]+)/i);
  const version = acadVerMatch ? acadVerMatch[1].trim() : 'UNKNOWN';
  
  const codePageMatch = text.match(/\$DWGCODEPAGE\s+3\s+([A-Z0-9_]+)/i);
  const codePage = codePageMatch ? codePageMatch[1].trim() : 'ANSI_1252';

  return {
    type: 'DXF',
    version,
    release: VERSION_MAP[version] || 'Custom/Third-party DXF',
    codePage,
    isBinary: false
  };
}

module.exports = {
  VERSION_MAP,
  parseDxfHeader
};
