/**
 * @willsunagency/cad-format-detector
 * Pure JavaScript CAD file signature & magic byte inspector.
 * Designed for zero-upload browser environments & Node.js backend pipelines.
 * Homepage: https://cadguide.tools/toolbox/dwg-version-checker
 */

const DWG_MAP = {
  'AC1032': { version: '2018-2026', name: 'AutoCAD 2018/2021/2024/2026' },
  'AC1027': { version: '2013-2017', name: 'AutoCAD 2013-2017' },
  'AC1024': { version: '2010-2012', name: 'AutoCAD 2010-2012' },
  'AC1021': { version: '2007-2009', name: 'AutoCAD 2007-2009' },
  'AC1018': { version: '2004-2006', name: 'AutoCAD 2004-2006' },
  'AC1015': { version: '2000-2002', name: 'AutoCAD 2000-2002' },
  'AC1014': { version: 'R14', name: 'AutoCAD Release 14' },
  'AC1012': { version: 'R13', name: 'AutoCAD Release 13' },
  'AC1009': { version: 'R11/R12', name: 'AutoCAD Release 11/12' }
};

function detectCADFormat(buffer) {
  if (!buffer || buffer.length < 6) {
    return { detected: false, error: 'Buffer too small' };
  }

  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const headStr = String.fromCharCode(...bytes.slice(0, 128));

  // 1. DWG Magic Bytes
  const magic = headStr.slice(0, 6);
  if (DWG_MAP[magic]) {
    return {
      detected: true,
      format: 'DWG',
      magic: magic,
      version: DWG_MAP[magic].version,
      description: DWG_MAP[magic].name,
      isBinary: true
    };
  }

  // 2. Binary DXF
  if (headStr.startsWith('AutoCAD Binary DXF')) {
    return {
      detected: true,
      format: 'DXF',
      variant: 'binary',
      description: 'AutoCAD Binary Drawing Interchange Format',
      isBinary: true
    };
  }

  // 3. ASCII DXF
  if (headStr.includes('SECTION') && (headStr.includes('HEADER') || headStr.includes('$ACADVER'))) {
    return {
      detected: true,
      format: 'DXF',
      variant: 'ascii',
      description: 'AutoCAD ASCII Drawing Interchange Format',
      isBinary: false
    };
  }

  // 4. STEP (ISO 10303-21)
  if (headStr.includes('ISO-10303-21') || headStr.includes('STEP-FILE')) {
    return {
      detected: true,
      format: 'STEP',
      description: 'Standard for the Exchange of Product Model Data (ISO 10303-21)',
      isBinary: false
    };
  }

  // 5. IGES
  if (headStr.length >= 80 && headStr[72] === 'S' && headStr[79] === '1') {
    return {
      detected: true,
      format: 'IGES',
      description: 'Initial Graphics Exchange Specification',
      isBinary: false
    };
  }

  // 6. IFC (Industry Foundation Classes)
  if (headStr.includes('IFC2X3') || headStr.includes('IFC4') || headStr.includes('FILE_SCHEMA')) {
    return {
      detected: true,
      format: 'IFC',
      description: 'Industry Foundation Classes BIM Schema',
      isBinary: false
    };
  }

  return {
    detected: false,
    format: 'UNKNOWN',
    preview: headStr.slice(0, 32)
  };
}

module.exports = {
  detectCADFormat,
  DWG_MAP
};
