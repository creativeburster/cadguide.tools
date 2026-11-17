'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { MapPin, Info, RotateCcw, Copy, Check, Download, AlertTriangle, ArrowLeftRight } from 'lucide-react';

// WGS 84 ellipsoid parameters
const WGS84_A = 6378137.0; // Equatorial radius (m)
const WGS84_F = 1 / 298.257223563; // Flattening
const WGS84_E2 = WGS84_F * (2 - WGS84_F); // First eccentricity squared
const WGS84_EP2 = WGS84_E2 / (1 - WGS84_E2); // Second eccentricity squared
const UTM_K0 = 0.9996;
const UTM_FALSE_EASTING = 500000.0;
const UTM_FALSE_NORTHING_SOUTH = 10000000.0;

// MGRS / UTM latitude band letters from 80S to 84N (excluding I and O)
const UTM_BANDS = 'CDEFGHJKLMNPQRSTUVWXX';

function parseFinite(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) ? n : Number.NaN;
}

function parseIntStrict(raw: string): number {
  const t = raw.trim();
  if (!/^-?\d+$/.test(t)) return Number.NaN;
  const n = Number(t);
  return Number.isInteger(n) ? n : Number.NaN;
}

function getUtmBand(lat: number): string {
  if (lat < -80 || lat > 84) return '';
  if (lat >= 72 && lat <= 84) return 'X';
  const idx = Math.floor((lat + 80) / 8);
  return UTM_BANDS[Math.min(Math.max(idx, 0), UTM_BANDS.length - 1)];
}

function meridionalArc(phi: number): number {
  const e2 = WGS84_E2;
  const e4 = e2 * e2;
  const e6 = e4 * e2;
  return (
    WGS84_A *
    ((1 - e2 / 4 - (3 * e4) / 64 - (5 * e6) / 256) * phi -
      ((3 * e2) / 8 + (3 * e4) / 32 + (45 * e6) / 1024) * Math.sin(2 * phi) +
      ((15 * e4) / 256 + (45 * e6) / 1024) * Math.sin(4 * phi) -
      ((35 * e6) / 3072) * Math.sin(6 * phi))
  );
}

function latLonToUtm(latDeg: number, lonDeg: number, forcedZone?: number) {
  const zone =
    forcedZone && Number.isInteger(forcedZone)
      ? forcedZone
      : Math.min(60, Math.max(1, Math.floor((lonDeg + 180) / 6) + 1));

  const centralMeridianDeg = (zone - 1) * 6 - 180 + 3;
  const phi = (latDeg * Math.PI) / 180;
  const lam = (lonDeg * Math.PI) / 180;
  const lam0 = (centralMeridianDeg * Math.PI) / 180;

  let dLam = lam - lam0;
  while (dLam > Math.PI) dLam -= 2 * Math.PI;
  while (dLam < -Math.PI) dLam += 2 * Math.PI;

  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);
  const tanPhi = Math.tan(phi);

  const N = WGS84_A / Math.sqrt(1 - WGS84_E2 * sinPhi * sinPhi);
  const T = tanPhi * tanPhi;
  const C = WGS84_EP2 * cosPhi * cosPhi;
  const A = cosPhi * dLam;
  const M = meridionalArc(phi);

  const A2 = A * A;
  const A3 = A2 * A;
  const A4 = A3 * A;
  const A5 = A4 * A;
  const A6 = A5 * A;

  const easting =
    UTM_FALSE_EASTING +
    UTM_K0 *
      N *
      (A +
        ((1 - T + C) * A3) / 6 +
        ((5 - 18 * T + T * T + 72 * C - 58 * WGS84_EP2) * A5) / 120);

  const northingNorth =
    UTM_K0 *
    (M +
      N *
        tanPhi *
        (A2 / 2 +
          ((5 - T + 9 * C + 4 * C * C) * A4) / 24 +
          ((61 - 58 * T + T * T + 600 * C - 330 * WGS84_EP2) * A6) / 720));

  const hemisphere = latDeg >= 0 ? 'N' : 'S';
  const northing = latDeg >= 0 ? northingNorth : northingNorth + UTM_FALSE_NORTHING_SOUTH;

  // Grid convergence (gamma) in degrees
  const gammaRad =
    sinPhi * dLam +
    (sinPhi * cosPhi * cosPhi * Math.pow(dLam, 3) * (1 + 3 * C + 2 * C * C)) / 3;
  const convergenceDeg = (gammaRad * 180) / Math.PI;

  // Point scale factor
  const pointScale =
    UTM_K0 *
    (1 +
      ((1 + C) * A2) / 2 +
      ((5 - 4 * T + 42 * C + 13 * C * C - 28 * WGS84_EP2) * A4) / 24);

  return {
    zone,
    band: getUtmBand(latDeg),
    hemisphere,
    centralMeridianDeg,
    easting,
    northing,
    convergenceDeg,
    pointScale,
    lonOffsetDeg: Math.abs((dLam * 180) / Math.PI),
  };
}

function utmToLatLon(easting: number, northing: number, zone: number, hemisphere: 'N' | 'S') {
  const x = easting - UTM_FALSE_EASTING;
  const y = hemisphere === 'S' ? northing - UTM_FALSE_NORTHING_SOUTH : northing;

  const e1 = (1 - Math.sqrt(1 - WGS84_E2)) / (1 + Math.sqrt(1 - WGS84_E2));
  const M = y / UTM_K0;
  const mu =
    M /
    (WGS84_A *
      (1 - WGS84_E2 / 4 - (3 * WGS84_E2 * WGS84_E2) / 64 - (5 * Math.pow(WGS84_E2, 3)) / 256));

  const phi1 =
    mu +
    ((3 * e1) / 2 - (27 * Math.pow(e1, 3)) / 32) * Math.sin(2 * mu) +
    ((21 * e1 * e1) / 16 - (55 * Math.pow(e1, 4)) / 32) * Math.sin(4 * mu) +
    ((151 * Math.pow(e1, 3)) / 96) * Math.sin(6 * mu) +
    ((1097 * Math.pow(e1, 4)) / 512) * Math.sin(8 * mu);

  const sin1 = Math.sin(phi1);
  const cos1 = Math.cos(phi1);
  const tan1 = Math.tan(phi1);

  const N1 = WGS84_A / Math.sqrt(1 - WGS84_E2 * sin1 * sin1);
  const T1 = tan1 * tan1;
  const C1 = WGS84_EP2 * cos1 * cos1;
  const R1 = (WGS84_A * (1 - WGS84_E2)) / Math.pow(1 - WGS84_E2 * sin1 * sin1, 1.5);
  const D = x / (N1 * UTM_K0);

  const D2 = D * D;
  const D3 = D2 * D;
  const D4 = D3 * D;
  const D5 = D4 * D;
  const D6 = D5 * D;

  const latRad =
    phi1 -
    ((N1 * tan1) / R1) *
      (D2 / 2 -
        ((5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * WGS84_EP2) * D4) / 24 +
        ((61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * WGS84_EP2 - 3 * C1 * C1) * D6) / 720);

  const centralMeridianDeg = (zone - 1) * 6 - 180 + 3;
  const lonRad =
    (centralMeridianDeg * Math.PI) / 180 +
    (D -
      ((1 + 2 * T1 + C1) * D3) / 6 +
      ((5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * WGS84_EP2 + 24 * T1 * T1) * D5) / 120) /
      cos1;

  const latDeg = (latRad * 180) / Math.PI;
  const lonDeg = (lonRad * 180) / Math.PI;

  return {
    latDeg,
    lonDeg,
    centralMeridianDeg,
    band: getUtmBand(latDeg),
  };
}

function fmt(val: number, decimals = 2): string {
  return Number.isFinite(val) ? val.toFixed(decimals) : '—';
}

export default function CoordinateConverterCalculatorClient() {
  const [mode, setMode] = useState<'toUtm' | 'toLatLon'>('toUtm');

  // Lat/Lon -> UTM state
  const [latStr, setLatStr] = useState('39.9');
  const [lonStr, setLonStr] = useState('116.4');
  const [zoneMode, setZoneMode] = useState<'auto' | 'manual'>('auto');
  const [manualZoneStr, setManualZoneStr] = useState('50');

  // UTM -> Lat/Lon state
  const [eastingStr, setEastingStr] = useState('448709.3802');
  const [northingStr, setNorthingStr] = useState('4416830.5623');
  const [utmZoneStr, setUtmZoneStr] = useState('50');
  const [hemisphere, setHemisphere] = useState<'N' | 'S'>('N');

  const [copied, setCopied] = useState(false);

  const applyPreset = (preset: 'beijing' | 'sydney') => {
    setCopied(false);
    setMode('toUtm');
    setZoneMode('auto');
    if (preset === 'beijing') {
      setLatStr('39.9');
      setLonStr('116.4');
      setManualZoneStr('50');
    } else {
      setLatStr('-33.8688');
      setLonStr('151.2093');
      setManualZoneStr('56');
    }
  };

  const handleReset = () => {
    setMode('toUtm');
    setLatStr('39.9');
    setLonStr('116.4');
    setZoneMode('auto');
    setManualZoneStr('50');
    setEastingStr('448709.3802');
    setNorthingStr('4416830.5623');
    setUtmZoneStr('50');
    setHemisphere('N');
    setCopied(false);
  };

  const toUtmResult = useMemo(() => {
    const lat = parseFinite(latStr);
    const lon = parseFinite(lonStr);
    const fz = zoneMode === 'manual' ? parseIntStrict(manualZoneStr) : undefined;

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      lat < -80 ||
      lat > 84 ||
      lon < -180 ||
      lon > 180
    ) {
      return {
        valid: false as const,
        reason: Number.isFinite(lat) && (lat < -80 || lat > 84)
          ? 'Standard UTM projection covers latitudes 80° S to 84° N (polar UPS regions excluded).'
          : 'Enter valid latitude (-80 to +84°) and longitude (-180 to +180°).',
      };
    }

    if (zoneMode === 'manual' && (!Number.isInteger(fz) || (fz as number) < 1 || (fz as number) > 60)) {
      return { valid: false as const, reason: 'UTM zone number must be an integer from 1 to 60.' };
    }

    const res = latLonToUtm(lat, lon, fz);
    return { valid: true as const, ...res, lat, lon };
  }, [latStr, lonStr, zoneMode, manualZoneStr]);

  const toLatLonResult = useMemo(() => {
    const e = parseFinite(eastingStr);
    const n = parseFinite(northingStr);
    const z = parseIntStrict(utmZoneStr);

    if (
      !Number.isFinite(e) ||
      !Number.isFinite(n) ||
      !Number.isInteger(z) ||
      z < 1 ||
      z > 60 ||
      e < 100000 ||
      e > 900000 ||
      n < 0 ||
      n > 10000000
    ) {
      return {
        valid: false as const,
        reason: 'Enter UTM Zone (1–60), Easting (100,000–900,000 m), and Northing (0–10,000,000 m).',
      };
    }

    const res = utmToLatLon(e, n, z, hemisphere);
    if (res.latDeg < -80 || res.latDeg > 84 || !Number.isFinite(res.lonDeg)) {
      return {
        valid: false as const,
        reason: 'Coordinates resolve outside the standard UTM latitude coverage (80° S to 84° N).',
      };
    }

    return { valid: true as const, ...res, zone: z, hemisphere, easting: e, northing: n };
  }, [eastingStr, northingStr, utmZoneStr, hemisphere]);

  const handleSyncToInverse = () => {
    if (!toUtmResult.valid) return;
    setEastingStr(toUtmResult.easting.toFixed(4));
    setNorthingStr(toUtmResult.northing.toFixed(4));
    setUtmZoneStr(String(toUtmResult.zone));
    setHemisphere(toUtmResult.hemisphere as 'N' | 'S');
    setMode('toLatLon');
    setCopied(false);
  };

  const handleCopy = async () => {
    let text = '';
    if (mode === 'toUtm' && toUtmResult.valid) {
      text = `WGS84 (${toUtmResult.lat.toFixed(6)}, ${toUtmResult.lon.toFixed(6)}) -> UTM Zone ${toUtmResult.zone}${toUtmResult.band} (${toUtmResult.hemisphere}) E=${toUtmResult.easting.toFixed(2)} m, N=${toUtmResult.northing.toFixed(2)} m, Scale=${toUtmResult.pointScale.toFixed(6)}`;
    } else if (mode === 'toLatLon' && toLatLonResult.valid) {
      text = `UTM Zone ${toLatLonResult.zone}${toLatLonResult.hemisphere} E=${toLatLonResult.easting.toFixed(2)} m, N=${toLatLonResult.northing.toFixed(2)} m -> WGS84 Lat=${toLatLonResult.latDeg.toFixed(6)} deg, Lon=${toLatLonResult.lonDeg.toFixed(6)} deg`;
    }
    if (!text) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadCsv = () => {
    let rows: string[][] = [];
    if (mode === 'toUtm' && toUtmResult.valid) {
      rows = [
        ['parameter', 'value', 'unit'],
        ['datum', 'WGS84', '-'],
        ['latitude', toUtmResult.lat.toFixed(6), 'deg'],
        ['longitude', toUtmResult.lon.toFixed(6), 'deg'],
        ['utm_zone', `${toUtmResult.zone}${toUtmResult.band}`, '-'],
        ['hemisphere', toUtmResult.hemisphere, '-'],
        ['central_meridian', String(toUtmResult.centralMeridianDeg), 'deg'],
        ['easting', toUtmResult.easting.toFixed(4), 'm'],
        ['northing', toUtmResult.northing.toFixed(4), 'm'],
        ['point_scale_factor', toUtmResult.pointScale.toFixed(6), '-'],
        ['grid_convergence', toUtmResult.convergenceDeg.toFixed(4), 'deg'],
      ];
    } else if (mode === 'toLatLon' && toLatLonResult.valid) {
      rows = [
        ['parameter', 'value', 'unit'],
        ['datum', 'WGS84', '-'],
        ['utm_zone', `${toLatLonResult.zone}${toLatLonResult.hemisphere}`, '-'],
        ['easting', toLatLonResult.easting.toFixed(4), 'm'],
        ['northing', toLatLonResult.northing.toFixed(4), 'm'],
        ['latitude', toLatLonResult.latDeg.toFixed(6), 'deg'],
        ['longitude', toLatLonResult.lonDeg.toFixed(6), 'deg'],
      ];
    }
    if (rows.length === 0) return;
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wgs84_utm_conversion.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">WGS 84 Geographic &amp; UTM Projection Converter</h2>
            <p className="text-sm font-medium text-slate-500">
              Full Transverse Mercator ellipsoidal series (a = 6,378,137 m, k₀ = 0.9996)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            data-testid="preset-beijing"
            onClick={() => applyPreset('beijing')}
            className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-black border border-teal-200 transition-colors cursor-pointer"
          >
            Beijing (39.9°N, 116.4°E)
          </button>
          <button
            type="button"
            data-testid="preset-sydney"
            onClick={() => applyPreset('sydney')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition-colors cursor-pointer"
          >
            Sydney (-33.8688°, 151.2093°)
          </button>
          <button
            type="button"
            data-testid="reset-button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-black border border-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className="px-6 md:px-8 pt-6 flex flex-wrap gap-2">
        <button
          type="button"
          data-testid="tab-to-utm"
          onClick={() => setMode('toUtm')}
          className={`px-4 py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${
            mode === 'toUtm'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Lat / Lon → UTM (Forward)
        </button>
        <button
          type="button"
          data-testid="tab-to-latlon"
          onClick={() => setMode('toLatLon')}
          className={`px-4 py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${
            mode === 'toLatLon'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          UTM → Lat / Lon (Inverse)
        </button>
      </div>

      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-5">
          {mode === 'toUtm' ? (
            <>
              <div>
                <label htmlFor="coord-lat" className="block text-sm font-black text-slate-700 mb-1.5">
                  Latitude φ (decimal degrees, −80° to +84°)
                </label>
                <input
                  id="coord-lat"
                  data-testid="input-lat"
                  type="text"
                  inputMode="decimal"
                  value={latStr}
                  onChange={(e) => setLatStr(e.target.value)}
                  placeholder="39.9"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label htmlFor="coord-lon" className="block text-sm font-black text-slate-700 mb-1.5">
                  Longitude λ (decimal degrees, −180° to +180°)
                </label>
                <input
                  id="coord-lon"
                  data-testid="input-lon"
                  type="text"
                  inputMode="decimal"
                  value={lonStr}
                  onChange={(e) => setLonStr(e.target.value)}
                  placeholder="116.4"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-600 uppercase tracking-wider">UTM Zone Selection</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setZoneMode('auto')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black cursor-pointer ${
                        zoneMode === 'auto' ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      Auto (6°)
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoneMode('manual')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black cursor-pointer ${
                        zoneMode === 'manual' ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      Force Zone
                    </button>
                  </div>
                </div>

                {zoneMode === 'manual' && (
                  <div>
                    <label htmlFor="coord-force-zone" className="block text-xs font-bold text-slate-600 mb-1">
                      Forced UTM Zone (1–60)
                    </label>
                    <input
                      id="coord-force-zone"
                      data-testid="input-force-zone"
                      type="text"
                      inputMode="numeric"
                      value={manualZoneStr}
                      onChange={(e) => setManualZoneStr(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-sm text-slate-900"
                    />
                  </div>
                )}

                {toUtmResult.valid && (
                  <button
                    type="button"
                    data-testid="sync-to-inverse-button"
                    onClick={handleSyncToInverse}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-teal-50 text-teal-800 border border-teal-200 text-xs font-black cursor-pointer transition-colors"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    Send to Inverse UTM → Lat/Lon Check
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="coord-zone" className="block text-sm font-black text-slate-700 mb-1.5">
                    UTM Zone (1–60)
                  </label>
                  <input
                    id="coord-zone"
                    data-testid="input-utm-zone"
                    type="text"
                    inputMode="numeric"
                    value={utmZoneStr}
                    onChange={(e) => setUtmZoneStr(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-1.5">Hemisphere</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      data-testid="hemi-n"
                      onClick={() => setHemisphere('N')}
                      className={`py-3 rounded-xl font-black text-sm border cursor-pointer ${
                        hemisphere === 'N'
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      North (N)
                    </button>
                    <button
                      type="button"
                      data-testid="hemi-s"
                      onClick={() => setHemisphere('S')}
                      className={`py-3 rounded-xl font-black text-sm border cursor-pointer ${
                        hemisphere === 'S'
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      South (S)
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="coord-easting" className="block text-sm font-black text-slate-700 mb-1.5">
                  Easting E (m)
                </label>
                <input
                  id="coord-easting"
                  data-testid="input-easting"
                  type="text"
                  inputMode="decimal"
                  value={eastingStr}
                  onChange={(e) => setEastingStr(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900"
                />
              </div>

              <div>
                <label htmlFor="coord-northing" className="block text-sm font-black text-slate-700 mb-1.5">
                  Northing N (m)
                </label>
                <input
                  id="coord-northing"
                  data-testid="input-northing"
                  type="text"
                  inputMode="decimal"
                  value={northingStr}
                  onChange={(e) => setNorthingStr(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900"
                />
              </div>
            </>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              data-testid="copy-summary-button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-black transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Result'}
            </button>
            <button
              type="button"
              data-testid="export-csv-button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-sm font-black transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            {mode === 'toUtm' ? (
              <>
                {!toUtmResult.valid && (
                  <div className="rounded-2xl p-4 bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-sm font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <span>{toUtmResult.reason}</span>
                  </div>
                )}

                <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6">
                  <div className="text-xs font-black text-teal-800 uppercase tracking-wider mb-1">
                    UTM Grid Zone &amp; Hemisphere
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span data-testid="result-utm-zone" className="text-4xl font-black text-slate-900">
                      {toUtmResult.valid ? `${toUtmResult.zone}${toUtmResult.hemisphere}` : '—'}
                    </span>
                    <span className="text-sm font-bold text-teal-800">
                      {toUtmResult.valid
                        ? `Band ${toUtmResult.band} • Central Meridian ${toUtmResult.centralMeridianDeg}°`
                        : '—'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Easting (X)</div>
                    <div className="flex items-baseline gap-1.5">
                      <span data-testid="result-easting" className="text-2xl font-black text-slate-900 font-mono">
                        {toUtmResult.valid ? fmt(toUtmResult.easting, 2) : '—'}
                      </span>
                      <span className="text-sm font-bold text-slate-500">m</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Northing (Y)</div>
                    <div className="flex items-baseline gap-1.5">
                      <span data-testid="result-northing" className="text-2xl font-black text-slate-900 font-mono">
                        {toUtmResult.valid ? fmt(toUtmResult.northing, 2) : '—'}
                      </span>
                      <span className="text-sm font-bold text-slate-500">m</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Point Scale Factor (k)</div>
                    <div data-testid="result-scale" className="text-2xl font-black text-slate-800 font-mono">
                      {toUtmResult.valid ? toUtmResult.pointScale.toFixed(6) : '—'}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Grid Convergence (γ)</div>
                    <div className="flex items-baseline gap-1.5">
                      <span data-testid="result-convergence" className="text-2xl font-black text-slate-800 font-mono">
                        {toUtmResult.valid ? fmt(toUtmResult.convergenceDeg, 4) : '—'}
                      </span>
                      <span className="text-sm font-bold text-slate-500">deg</span>
                    </div>
                  </div>
                </div>

                {toUtmResult.valid && toUtmResult.lonOffsetDeg > 3.5 && (
                  <div className="rounded-2xl p-4 bg-amber-50 border border-amber-200 flex items-start gap-2 text-xs font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <span>
                      Point is {toUtmResult.lonOffsetDeg.toFixed(2)}° from Central Meridian ({toUtmResult.centralMeridianDeg}°), outside the nominal ±3° zone width. Expect increased scale distortion.
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                {!toLatLonResult.valid && (
                  <div className="rounded-2xl p-4 bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-sm font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <span>{toLatLonResult.reason}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6">
                    <div className="text-xs font-black text-teal-800 uppercase mb-1">Latitude (WGS 84)</div>
                    <div className="flex items-baseline gap-1.5">
                      <span data-testid="result-inv-lat" className="text-3xl font-black text-slate-900 font-mono">
                        {toLatLonResult.valid ? toLatLonResult.latDeg.toFixed(6) : '—'}
                      </span>
                      <span className="text-sm font-bold text-teal-800">°</span>
                    </div>
                  </div>
                  <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6">
                    <div className="text-xs font-black text-teal-800 uppercase mb-1">Longitude (WGS 84)</div>
                    <div className="flex items-baseline gap-1.5">
                      <span data-testid="result-inv-lon" className="text-3xl font-black text-slate-900 font-mono">
                        {toLatLonResult.valid ? toLatLonResult.lonDeg.toFixed(6) : '—'}
                      </span>
                      <span className="text-sm font-bold text-teal-800">°</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>WGS 84 Ellipsoid &amp; UTM Convention:</strong>{' '}
                Equatorial radius <code>a = 6,378,137 m</code>, flattening <code>f = 1 / 298.257223563</code>, 6° longitudinal zones (80° S to 84° N), central meridian scale factor <code>k₀ = 0.9996</code>, false easting <code>500,000 m</code>, and southern hemisphere equator false northing <code>10,000,000 m</code>.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
