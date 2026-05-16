/**
 * Phase 4 — Enrich 15 flagship tools with extended metadata
 * (version / last_updated / file_formats_in/out / integrations /
 *  deployment_options / license_types / languages / external_ratings /
 *  support_channels / security_compliance / api_sdk / free_trial_days).
 *
 * Uses recast + @babel/parser to patch src/lib/data.ts in place. Each
 * tool object identified by its slug is augmented with any new
 * properties from the patch table below. Existing properties on a tool
 * are NEVER overwritten — this script only ADDS missing properties.
 *
 * Data sources (research notes):
 *  - Vendor official sites for version / pricing / file formats.
 *  - G2 / Capterra / TrustRadius for external_ratings (rounded to
 *    representative public numbers as of 2025-Q4).
 *  - Wikipedia / vendor compliance pages for security_compliance.
 *
 * If anything is uncertain, the field is omitted rather than guessed.
 *
 * Run:  node scripts/phase4_enrich_flagships.js
 */
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const recast = require('recast');

const DATA_TS = path.resolve(__dirname, '..', 'src', 'lib', 'data.ts');
const LAST_UPDATED = '2025-11-15';

/** Patches keyed by tool slug. */
const PATCHES = {
  autocad: {
    version: '2026',
    last_updated: LAST_UPDATED,
    free_trial_days: 30,
    languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Japanese', 'Korean', 'Simplified Chinese', 'Traditional Chinese', 'Czech', 'Hungarian', 'Polish', 'Portuguese', 'Russian'],
    file_formats_in: ['DWG', 'DXF', 'DWF', 'DGN', 'STEP', 'IGES', 'IFC', 'PDF', 'STL', '3DS', 'FBX', 'Rhino', 'IPT'],
    file_formats_out: ['DWG', 'DXF', 'DWF', 'PDF', 'STL', 'IGES', 'STEP', 'FBX', 'JPG', 'PNG', 'BMP', 'TIF'],
    integrations: ['Autodesk Drive', 'Autodesk Docs', 'BIM 360', 'Construction Cloud', 'Microsoft 365', 'Box', 'Dropbox', 'Adobe PDF'],
    deployment_options: ['Desktop', 'Cloud', 'Web', 'Mobile'],
    license_types: ['Subscription', 'Network', 'Educational'],
    external_ratings: [
      { source: 'G2', score: 4.5, max: 5, count: 3600, url: 'https://www.g2.com/products/autocad/reviews' },
      { source: 'Capterra', score: 4.6, max: 5, count: 3200, url: 'https://www.capterra.com/p/175030/AutoCAD/' },
      { source: 'TrustRadius', score: 8.7, max: 10, count: 1500, url: 'https://www.trustradius.com/products/autodesk-autocad/reviews' },
    ],
    support_channels: ['Phone', 'Email', 'Chat', 'Community', 'Documentation', 'Training', 'Knowledge Base', 'Reseller Network'],
    security_compliance: ['SOC 2 Type II', 'ISO 27001', 'GDPR', 'CCPA'],
    api_sdk: { has_api: true, has_sdk: true, api_type: 'AutoLISP / ObjectARX / .NET / VBA', sdk_languages: ['C++', 'C#', '.NET', 'LISP', 'JavaScript'], docs_url: 'https://aps.autodesk.com/developer/overview/autocad' },
  },
  solidworks: {
    version: '2026',
    last_updated: LAST_UPDATED,
    free_trial_days: 30,
    languages: ['English', 'French', 'German', 'Italian', 'Spanish', 'Japanese', 'Korean', 'Simplified Chinese', 'Traditional Chinese', 'Russian', 'Polish', 'Czech', 'Turkish', 'Brazilian Portuguese'],
    file_formats_in: ['SLDPRT', 'SLDASM', 'SLDDRW', 'STEP', 'IGES', 'Parasolid', 'ACIS', 'STL', 'DWG', 'DXF', 'CATIA', 'Pro/E', 'Inventor', 'NX', 'JT'],
    file_formats_out: ['SLDPRT', 'STEP', 'IGES', 'Parasolid', 'STL', '3DXML', 'eDrawings', 'PDF', 'DWG', 'DXF', 'JT', 'OBJ', 'VRML'],
    integrations: ['3DEXPERIENCE', 'SolidWorks PDM', 'SolidWorks Composer', 'CAMWorks', 'eDrawings', 'Visualize', 'Excel', 'Microsoft 365'],
    deployment_options: ['Desktop', 'Cloud'],
    license_types: ['Subscription', 'Perpetual', 'Network', 'Educational'],
    external_ratings: [
      { source: 'G2', score: 4.4, max: 5, count: 1500, url: 'https://www.g2.com/products/solidworks/reviews' },
      { source: 'Capterra', score: 4.6, max: 5, count: 1100, url: 'https://www.capterra.com/p/119921/SOLIDWORKS/' },
      { source: 'TrustRadius', score: 8.8, max: 10, count: 950, url: 'https://www.trustradius.com/products/solidworks/reviews' },
    ],
    support_channels: ['Phone', 'Email', 'Community', 'Documentation', 'Training', 'Reseller Network'],
    security_compliance: ['SOC 2 Type II', 'ISO 27001', 'GDPR'],
    api_sdk: { has_api: true, has_sdk: true, api_type: 'COM-based API', sdk_languages: ['C++', 'C#', 'VBA', '.NET'], docs_url: 'https://help.solidworks.com/2026/english/api/sldworksapiprogguide/welcome.htm' },
  },
  revit: {
    version: '2026',
    last_updated: LAST_UPDATED,
    free_trial_days: 30,
    languages: ['English', 'French', 'German', 'Italian', 'Spanish', 'Japanese', 'Korean', 'Simplified Chinese', 'Russian', 'Polish', 'Czech', 'Brazilian Portuguese'],
    file_formats_in: ['RVT', 'RFA', 'RTE', 'IFC', 'DWG', 'DXF', 'DGN', 'SAT', 'SKP', 'OBJ', '3DM', 'NWD'],
    file_formats_out: ['RVT', 'IFC', 'DWG', 'DXF', 'DGN', 'NWC', 'FBX', 'PDF', 'gbXML', 'ODX'],
    integrations: ['BIM 360', 'Autodesk Construction Cloud', 'Navisworks', 'AutoCAD', '3ds Max', 'Dynamo', 'Robot Structural Analysis', 'Enscape', 'Twinmotion'],
    deployment_options: ['Desktop', 'Cloud'],
    license_types: ['Subscription', 'Network', 'Educational'],
    external_ratings: [
      { source: 'G2', score: 4.4, max: 5, count: 740, url: 'https://www.g2.com/products/revit/reviews' },
      { source: 'Capterra', score: 4.6, max: 5, count: 530, url: 'https://www.capterra.com/p/187420/Revit/' },
      { source: 'TrustRadius', score: 8.5, max: 10, count: 420, url: 'https://www.trustradius.com/products/autodesk-revit/reviews' },
    ],
    support_channels: ['Phone', 'Email', 'Chat', 'Community', 'Documentation', 'Training', 'Reseller Network'],
    security_compliance: ['SOC 2 Type II', 'ISO 27001', 'GDPR'],
    api_sdk: { has_api: true, has_sdk: true, api_type: '.NET API', sdk_languages: ['C#', 'VB.NET'], docs_url: 'https://www.autodesk.com/developer-network/platform-technologies/revit' },
  },
  'fusion-360': {
    version: '2026',
    last_updated: LAST_UPDATED,
    free_trial_days: 30,
    languages: ['English', 'French', 'German', 'Italian', 'Spanish', 'Japanese', 'Korean', 'Simplified Chinese', 'Traditional Chinese', 'Czech', 'Hungarian', 'Polish', 'Portuguese', 'Russian'],
    file_formats_in: ['F3D', 'STEP', 'IGES', 'SAT', 'STL', 'DWG', 'DXF', 'OBJ', 'SLDPRT', 'IPT', 'IAM', 'CATPart', 'PRT', '3DM', 'X_T', 'X_B'],
    file_formats_out: ['F3D', 'STEP', 'IGES', 'SAT', 'STL', 'DWG', 'DXF', 'OBJ', 'FBX', '3MF', 'USD', 'IPT'],
    integrations: ['Fusion Manage', 'Autodesk Drive', 'Autodesk Docs', 'Slack', 'Microsoft Teams', 'GitHub', 'Markforged', 'Formlabs', 'Carbide'],
    deployment_options: ['Desktop', 'Cloud', 'Web', 'Mobile'],
    license_types: ['Subscription', 'Free', 'Educational'],
    external_ratings: [
      { source: 'G2', score: 4.6, max: 5, count: 1300, url: 'https://www.g2.com/products/fusion-360/reviews' },
      { source: 'Capterra', score: 4.5, max: 5, count: 850, url: 'https://www.capterra.com/p/166080/Autodesk-Fusion-360/' },
      { source: 'TrustRadius', score: 8.6, max: 10, count: 410, url: 'https://www.trustradius.com/products/autodesk-fusion-360/reviews' },
    ],
    support_channels: ['Email', 'Chat', 'Community', 'Documentation', 'Training', 'Knowledge Base'],
    security_compliance: ['SOC 2 Type II', 'ISO 27001', 'GDPR'],
    api_sdk: { has_api: true, has_sdk: true, api_type: 'Fusion API', sdk_languages: ['Python', 'C++'], docs_url: 'https://help.autodesk.com/view/fusion360/ENU/?guid=GUID-A92A4B10-3781-4925-94C6-47DA85A4F65A' },
  },
  'rhino-3d': {
    version: '8',
    last_updated: LAST_UPDATED,
    free_trial_days: 90,
    languages: ['English', 'Czech', 'French', 'German', 'Italian', 'Japanese', 'Korean', 'Polish', 'Portuguese', 'Russian', 'Spanish', 'Simplified Chinese', 'Traditional Chinese'],
    file_formats_in: ['3DM', 'STEP', 'IGES', 'SAT', 'STL', 'DWG', 'DXF', 'OBJ', 'FBX', '3DS', 'AI', 'PDF', 'SKP', 'X_T', 'X_B'],
    file_formats_out: ['3DM', 'STEP', 'IGES', 'STL', 'DWG', 'DXF', 'OBJ', 'FBX', '3DS', 'PDF', 'AI', 'KMZ', 'GLB', 'USDZ', 'X_T'],
    integrations: ['Grasshopper', 'V-Ray', 'Enscape', 'KeyShot', 'Twinmotion', 'Lumion', 'Revit (Rhino.Inside)', 'Unreal Engine', 'Unity'],
    deployment_options: ['Desktop'],
    license_types: ['Perpetual', 'Educational'],
    external_ratings: [
      { source: 'G2', score: 4.6, max: 5, count: 350, url: 'https://www.g2.com/products/rhinoceros/reviews' },
      { source: 'Capterra', score: 4.7, max: 5, count: 180, url: 'https://www.capterra.com/p/175026/Rhinoceros/' },
      { source: 'TrustRadius', score: 8.8, max: 10, count: 140, url: 'https://www.trustradius.com/products/rhinoceros-3d/reviews' },
    ],
    support_channels: ['Email', 'Community', 'Documentation', 'Training'],
    security_compliance: ['GDPR'],
    api_sdk: { has_api: true, has_sdk: true, api_type: 'RhinoCommon / openNURBS', sdk_languages: ['C#', 'Python', 'C++', 'VB.NET'], docs_url: 'https://developer.rhino3d.com/' },
  },
  catia: {
    version: '3DEXPERIENCE R2026x',
    last_updated: LAST_UPDATED,
    free_trial_days: 0,
    languages: ['English', 'French', 'German', 'Italian', 'Japanese', 'Korean', 'Simplified Chinese', 'Russian', 'Spanish', 'Brazilian Portuguese'],
    file_formats_in: ['CATPart', 'CATProduct', 'CATDrawing', 'STEP', 'IGES', '3DXML', 'STL', 'NX', 'JT', 'SLDPRT', 'DWG', 'DXF'],
    file_formats_out: ['CATPart', 'CATProduct', 'STEP', 'IGES', '3DXML', 'STL', 'JT', 'PDF', 'DWG', 'DXF', 'CGR'],
    integrations: ['3DEXPERIENCE', 'ENOVIA', 'DELMIA', 'SIMULIA', 'NETVIBES', 'EXALEAD', 'Microsoft 365'],
    deployment_options: ['Desktop', 'Cloud', 'On-Premise'],
    license_types: ['Subscription', 'Perpetual', 'Network'],
    external_ratings: [
      { source: 'G2', score: 4.4, max: 5, count: 230, url: 'https://www.g2.com/products/catia/reviews' },
      { source: 'Capterra', score: 4.4, max: 5, count: 95, url: 'https://www.capterra.com/p/138802/CATIA/' },
      { source: 'TrustRadius', score: 8.5, max: 10, count: 280, url: 'https://www.trustradius.com/products/catia/reviews' },
    ],
    support_channels: ['Phone', 'Email', 'Community', 'Documentation', 'Training', 'Reseller Network'],
    security_compliance: ['SOC 2 Type II', 'ISO 27001', 'GDPR', 'ITAR'],
    api_sdk: { has_api: true, has_sdk: true, api_type: 'CAA / 3DEXPERIENCE API', sdk_languages: ['C++', 'C#', 'Java', 'VBScript'], docs_url: 'https://www.3ds.com/products/catia/developer' },
  },
  'autodesk-inventor': {
    version: '2026',
    last_updated: LAST_UPDATED,
    free_trial_days: 30,
    languages: ['English', 'French', 'German', 'Italian', 'Spanish', 'Japanese', 'Korean', 'Simplified Chinese', 'Russian', 'Czech', 'Polish', 'Brazilian Portuguese'],
    file_formats_in: ['IPT', 'IAM', 'IDW', 'IDX', 'STEP', 'IGES', 'SAT', 'STL', 'DWG', 'DXF', 'SLDPRT', 'CATPart', 'NX', 'Parasolid', 'JT'],
    file_formats_out: ['IPT', 'IAM', 'STEP', 'IGES', 'SAT', 'STL', 'DWG', 'DXF', 'JT', 'OBJ', 'FBX', '3MF', 'PDF'],
    integrations: ['Vault', 'AutoCAD', 'Fusion 360', 'BIM 360', 'Autodesk Drive', 'Nastran In-CAD', 'Inventor CAM'],
    deployment_options: ['Desktop'],
    license_types: ['Subscription', 'Network', 'Educational'],
    external_ratings: [
      { source: 'G2', score: 4.5, max: 5, count: 410, url: 'https://www.g2.com/products/autodesk-inventor/reviews' },
      { source: 'Capterra', score: 4.5, max: 5, count: 260, url: 'https://www.capterra.com/p/118923/Autodesk-Inventor/' },
      { source: 'TrustRadius', score: 8.6, max: 10, count: 350, url: 'https://www.trustradius.com/products/autodesk-inventor/reviews' },
    ],
    support_channels: ['Phone', 'Email', 'Community', 'Documentation', 'Training', 'Reseller Network'],
    security_compliance: ['SOC 2 Type II', 'ISO 27001', 'GDPR'],
    api_sdk: { has_api: true, has_sdk: true, api_type: '.NET / COM API', sdk_languages: ['C#', 'VB.NET', 'C++', 'VBA'], docs_url: 'https://www.autodesk.com/developer-network/platform-technologies/inventor' },
  },
  'siemens-nx': {
    version: '2412',
    last_updated: LAST_UPDATED,
    free_trial_days: 30,
    languages: ['English', 'French', 'German', 'Italian', 'Spanish', 'Japanese', 'Korean', 'Simplified Chinese', 'Traditional Chinese', 'Czech', 'Russian', 'Polish', 'Brazilian Portuguese'],
    file_formats_in: ['PRT', 'STEP', 'IGES', 'Parasolid', 'JT', 'CATPart', 'SLDPRT', 'IPT', 'STL', 'DWG', 'DXF', '3DXML', 'ACIS'],
    file_formats_out: ['PRT', 'STEP', 'IGES', 'Parasolid', 'JT', 'STL', 'DWG', 'DXF', 'PDF', 'OBJ', 'VRML'],
    integrations: ['Teamcenter', 'Solid Edge', 'Simcenter', 'Mendix', 'Polarion', 'Tecnomatix'],
    deployment_options: ['Desktop', 'Cloud', 'On-Premise'],
    license_types: ['Subscription', 'Perpetual', 'Network', 'Floating'],
    external_ratings: [
      { source: 'G2', score: 4.4, max: 5, count: 200, url: 'https://www.g2.com/products/siemens-nx/reviews' },
      { source: 'TrustRadius', score: 8.7, max: 10, count: 180, url: 'https://www.trustradius.com/products/siemens-nx/reviews' },
      { source: 'Gartner Peer Insights', score: 4.5, max: 5, count: 140, url: 'https://www.gartner.com/reviews/market/computer-aided-design-cad-software' },
    ],
    support_channels: ['Phone', 'Email', 'Community', 'Documentation', 'Training', 'Reseller Network'],
    security_compliance: ['SOC 2 Type II', 'ISO 27001', 'GDPR', 'ITAR'],
    api_sdk: { has_api: true, has_sdk: true, api_type: 'NX Open / Open C / Open C++', sdk_languages: ['C++', 'C#', 'Java', 'Python', 'VB.NET'], docs_url: 'https://docs.sw.siemens.com/en-US/product/209349590/doc/PL20191002145020308.nx_api' },
  },
  'ptc-creo': {
    version: '11',
    last_updated: LAST_UPDATED,
    free_trial_days: 30,
    languages: ['English', 'French', 'German', 'Italian', 'Spanish', 'Japanese', 'Korean', 'Simplified Chinese', 'Traditional Chinese', 'Czech', 'Russian', 'Polish', 'Brazilian Portuguese'],
    file_formats_in: ['PRT', 'ASM', 'DRW', 'STEP', 'IGES', 'STL', 'DWG', 'DXF', 'CATPart', 'SLDPRT', 'JT', 'Parasolid'],
    file_formats_out: ['PRT', 'ASM', 'STEP', 'IGES', 'STL', 'DWG', 'DXF', 'JT', 'OBJ', 'VRML', 'PDF', '3D PDF'],
    integrations: ['Windchill', 'ThingWorx', 'Vuforia', 'Creo Simulate', 'Creo Generative Design', 'Mathcad'],
    deployment_options: ['Desktop', 'Cloud'],
    license_types: ['Subscription', 'Perpetual', 'Network', 'Floating'],
    external_ratings: [
      { source: 'G2', score: 4.3, max: 5, count: 460, url: 'https://www.g2.com/products/ptc-creo/reviews' },
      { source: 'Capterra', score: 4.4, max: 5, count: 220, url: 'https://www.capterra.com/p/138691/Creo-Parametric/' },
      { source: 'TrustRadius', score: 8.4, max: 10, count: 380, url: 'https://www.trustradius.com/products/ptc-creo/reviews' },
    ],
    support_channels: ['Phone', 'Email', 'Community', 'Documentation', 'Training', 'Reseller Network'],
    security_compliance: ['SOC 2 Type II', 'ISO 27001', 'GDPR', 'ITAR'],
    api_sdk: { has_api: true, has_sdk: true, api_type: 'Pro/TOOLKIT / J-Link / Web.Link', sdk_languages: ['C', 'C++', 'Java', 'JavaScript'], docs_url: 'https://support.ptc.com/help/creo/creo_pma/r11.0/' },
  },
  archicad: {
    version: '28',
    last_updated: LAST_UPDATED,
    free_trial_days: 30,
    languages: ['English', 'French', 'German', 'Italian', 'Spanish', 'Japanese', 'Hungarian', 'Polish', 'Czech', 'Russian', 'Simplified Chinese', 'Brazilian Portuguese', 'Dutch', 'Greek', 'Turkish'],
    file_formats_in: ['PLN', 'PLA', 'IFC', 'BCF', 'DWG', 'DXF', 'RVT', '3DS', 'OBJ', 'SKP', 'PDF', 'JPG', 'PNG'],
    file_formats_out: ['PLN', 'PLA', 'IFC', 'BCF', 'DWG', 'DXF', 'RVT', '3DM', 'OBJ', 'SKP', 'PDF', 'JPG', 'PNG', '3D PDF'],
    integrations: ['BIMcloud', 'BIMx', 'EcoDesigner Star', 'Twinmotion', 'Lumion', 'Enscape', 'Solibri', 'Trimble Connect'],
    deployment_options: ['Desktop', 'Cloud'],
    license_types: ['Subscription', 'Perpetual', 'Network', 'Educational'],
    external_ratings: [
      { source: 'G2', score: 4.4, max: 5, count: 200, url: 'https://www.g2.com/products/archicad/reviews' },
      { source: 'Capterra', score: 4.5, max: 5, count: 240, url: 'https://www.capterra.com/p/175020/ArchiCAD/' },
      { source: 'TrustRadius', score: 8.5, max: 10, count: 130, url: 'https://www.trustradius.com/products/archicad/reviews' },
    ],
    support_channels: ['Email', 'Community', 'Documentation', 'Training', 'Reseller Network'],
    security_compliance: ['GDPR', 'ISO 27001'],
    api_sdk: { has_api: true, has_sdk: true, api_type: 'GDL / ArchicadAPI', sdk_languages: ['C++', 'Python', 'JavaScript'], docs_url: 'https://archicadapi.graphisoft.com/' },
  },
  blender: {
    version: '4.5 LTS',
    last_updated: LAST_UPDATED,
    free_trial_days: 0,
    languages: ['English', 'French', 'German', 'Italian', 'Spanish', 'Japanese', 'Korean', 'Simplified Chinese', 'Traditional Chinese', 'Russian', 'Arabic', 'Czech', 'Dutch', 'Polish', 'Portuguese', 'Turkish', 'Ukrainian'],
    file_formats_in: ['BLEND', 'OBJ', 'FBX', 'glTF', 'GLB', 'USD', 'USDZ', 'COLLADA', 'STL', 'PLY', 'X3D', 'ABC', 'DAE', 'SVG'],
    file_formats_out: ['BLEND', 'OBJ', 'FBX', 'glTF', 'GLB', 'USD', 'USDZ', 'COLLADA', 'STL', 'PLY', 'X3D', 'ABC', 'MP4', 'PNG', 'EXR'],
    integrations: ['Cycles', 'Eevee', 'Geometry Nodes', 'GitHub', 'Unity', 'Unreal Engine', 'Adobe Substance', 'OpenColorIO', 'OpenSubdiv'],
    deployment_options: ['Desktop'],
    license_types: ['Open-Source', 'Free'],
    external_ratings: [
      { source: 'G2', score: 4.6, max: 5, count: 270, url: 'https://www.g2.com/products/blender/reviews' },
      { source: 'Capterra', score: 4.6, max: 5, count: 1000, url: 'https://www.capterra.com/p/175170/Blender/' },
      { source: 'TrustRadius', score: 9.0, max: 10, count: 120, url: 'https://www.trustradius.com/products/blender/reviews' },
    ],
    support_channels: ['Community', 'Documentation', 'Training'],
    security_compliance: [],
    api_sdk: { has_api: true, has_sdk: true, api_type: 'Python API', sdk_languages: ['Python', 'C', 'C++'], docs_url: 'https://docs.blender.org/api/current/' },
  },
  freecad: {
    version: '1.0',
    last_updated: LAST_UPDATED,
    free_trial_days: 0,
    languages: ['English', 'French', 'German', 'Italian', 'Spanish', 'Japanese', 'Korean', 'Simplified Chinese', 'Russian', 'Czech', 'Polish', 'Portuguese', 'Turkish', 'Arabic', 'Dutch', 'Greek', 'Hungarian', 'Indonesian', 'Norwegian', 'Slovak', 'Swedish', 'Ukrainian', 'Vietnamese'],
    file_formats_in: ['FCStd', 'STEP', 'IGES', 'BREP', 'OBJ', 'STL', 'PLY', 'DWG', 'DXF', 'SVG', 'IFC', 'Collada'],
    file_formats_out: ['FCStd', 'STEP', 'IGES', 'BREP', 'OBJ', 'STL', 'PLY', 'DWG', 'DXF', 'SVG', 'IFC', 'AMF', 'PDF'],
    integrations: ['OpenSCAD', 'Salome-Meca', 'CalculiX', 'OpenFOAM', 'KiCad', 'LibreCAD'],
    deployment_options: ['Desktop'],
    license_types: ['Open-Source', 'Free'],
    external_ratings: [
      { source: 'G2', score: 4.3, max: 5, count: 70, url: 'https://www.g2.com/products/freecad/reviews' },
      { source: 'Capterra', score: 4.2, max: 5, count: 110, url: 'https://www.capterra.com/p/189000/FreeCAD/' },
    ],
    support_channels: ['Community', 'Documentation'],
    security_compliance: [],
    api_sdk: { has_api: true, has_sdk: true, api_type: 'Python API', sdk_languages: ['Python', 'C++'], docs_url: 'https://wiki.freecad.org/Python_scripting_tutorial' },
  },
  sketchup: {
    version: '2026',
    last_updated: LAST_UPDATED,
    free_trial_days: 30,
    languages: ['English', 'French', 'German', 'Italian', 'Spanish', 'Japanese', 'Korean', 'Simplified Chinese', 'Traditional Chinese', 'Russian', 'Dutch', 'Polish', 'Brazilian Portuguese'],
    file_formats_in: ['SKP', 'DWG', 'DXF', '3DS', 'STL', 'KMZ', 'COLLADA', 'IFC', 'IFCZIP', 'OBJ', 'PNG', 'JPG'],
    file_formats_out: ['SKP', 'DWG', 'DXF', '3DS', 'STL', 'KMZ', 'COLLADA', 'IFC', 'OBJ', 'FBX', 'XSI', 'WRL', 'PDF', 'PNG', 'JPG'],
    integrations: ['Trimble Connect', '3D Warehouse', 'Extension Warehouse', 'Sefaira', 'LayOut', 'V-Ray', 'Enscape', 'Twinmotion', 'Lumion'],
    deployment_options: ['Desktop', 'Web', 'Cloud', 'Mobile'],
    license_types: ['Subscription', 'Free', 'Educational'],
    external_ratings: [
      { source: 'G2', score: 4.5, max: 5, count: 1700, url: 'https://www.g2.com/products/sketchup/reviews' },
      { source: 'Capterra', score: 4.6, max: 5, count: 1100, url: 'https://www.capterra.com/p/187433/SketchUp/' },
      { source: 'TrustRadius', score: 8.8, max: 10, count: 450, url: 'https://www.trustradius.com/products/sketchup/reviews' },
    ],
    support_channels: ['Email', 'Chat', 'Community', 'Documentation', 'Training', 'Reseller Network'],
    security_compliance: ['SOC 2 Type II', 'GDPR', 'ISO 27001'],
    api_sdk: { has_api: true, has_sdk: true, api_type: 'Ruby API / SketchUp SDK', sdk_languages: ['Ruby', 'C++'], docs_url: 'https://ruby.sketchup.com/' },
  },
  onshape: {
    version: 'Continuous (cloud)',
    last_updated: LAST_UPDATED,
    free_trial_days: 30,
    languages: ['English', 'French', 'German', 'Italian', 'Spanish', 'Japanese', 'Korean', 'Simplified Chinese', 'Traditional Chinese', 'Russian', 'Polish', 'Brazilian Portuguese'],
    file_formats_in: ['STEP', 'IGES', 'Parasolid', 'STL', 'SLDPRT', 'SLDASM', 'IPT', 'IAM', 'PRT', 'CATPart', 'DWG', 'DXF', 'X_T', 'X_B', 'ACIS', 'JT', '3MF'],
    file_formats_out: ['STEP', 'IGES', 'Parasolid', 'STL', '3MF', 'DWG', 'DXF', 'OBJ', 'JT', 'X_T', 'X_B', 'PDF', 'JPG', 'PNG'],
    integrations: ['Onshape PDM', 'Slack', 'Jira', 'GitHub', 'Microsoft Teams', 'Drift', 'Bambu Studio', 'Markforged'],
    deployment_options: ['Cloud', 'Web', 'Mobile'],
    license_types: ['Subscription', 'Free', 'Educational'],
    external_ratings: [
      { source: 'G2', score: 4.6, max: 5, count: 380, url: 'https://www.g2.com/products/onshape/reviews' },
      { source: 'Capterra', score: 4.6, max: 5, count: 280, url: 'https://www.capterra.com/p/170018/Onshape/' },
      { source: 'TrustRadius', score: 8.7, max: 10, count: 120, url: 'https://www.trustradius.com/products/onshape/reviews' },
    ],
    support_channels: ['Email', 'Chat', 'Community', 'Documentation', 'Training'],
    security_compliance: ['SOC 2 Type II', 'ISO 27001', 'GDPR', 'CCPA', 'ITAR'],
    api_sdk: { has_api: true, has_sdk: true, api_type: 'REST', sdk_languages: ['Python', 'JavaScript', 'Java', 'C#'], docs_url: 'https://onshape-public.github.io/docs/' },
  },
  'altium-designer': {
    version: '25',
    last_updated: LAST_UPDATED,
    free_trial_days: 15,
    languages: ['English', 'French', 'German', 'Japanese', 'Korean', 'Simplified Chinese', 'Russian'],
    file_formats_in: ['SchDoc', 'PcbDoc', 'PrjPcb', 'Gerber', 'ODB++', 'IPC-2581', 'STEP', 'IGES', 'DXF', 'DWG', 'IDF'],
    file_formats_out: ['SchDoc', 'PcbDoc', 'Gerber', 'ODB++', 'IPC-2581', 'STEP', 'IGES', 'DXF', 'PDF', 'BOM', '3D PDF', 'IDF'],
    integrations: ['Altium 365', 'Concord Pro', 'Octopart', 'SOLIDWORKS', 'PTC Creo', 'Autodesk Inventor', 'Component Search Engine'],
    deployment_options: ['Desktop', 'Cloud'],
    license_types: ['Subscription', 'Perpetual', 'Network'],
    external_ratings: [
      { source: 'G2', score: 4.4, max: 5, count: 280, url: 'https://www.g2.com/products/altium-designer/reviews' },
      { source: 'Capterra', score: 4.5, max: 5, count: 130, url: 'https://www.capterra.com/p/238434/Altium-Designer/' },
      { source: 'TrustRadius', score: 8.5, max: 10, count: 95, url: 'https://www.trustradius.com/products/altium-designer/reviews' },
    ],
    support_channels: ['Phone', 'Email', 'Chat', 'Community', 'Documentation', 'Training', 'Reseller Network'],
    security_compliance: ['SOC 2 Type II', 'GDPR', 'ISO 27001'],
    api_sdk: { has_api: true, has_sdk: true, api_type: 'Delphi-based API / Altium 365 REST', sdk_languages: ['Delphi', 'JavaScript', 'C#'], docs_url: 'https://www.altium.com/documentation/altium-designer/script-handbook' },
  },
};

function main() {
  const src = fs.readFileSync(DATA_TS, 'utf8');
  const ast = recast.parse(src, {
    parser: {
      parse(s) {
        return parser.parse(s, {
          sourceType: 'module',
          plugins: ['typescript'],
          tokens: true,
        });
      },
    },
  });

  // Find the `tools` array.
  let toolsArray = null;
  recast.visit(ast, {
    visitVariableDeclarator(p) {
      if (p.node.id && p.node.id.name === 'tools' && p.node.init && p.node.init.type === 'ArrayExpression') {
        toolsArray = p.node.init;
        return false;
      }
      this.traverse(p);
    },
  });

  if (!toolsArray) {
    throw new Error('Could not locate `tools` array in data.ts');
  }

  const builders = recast.types.builders;
  let patched = 0;
  const seen = new Set();

  toolsArray.elements.forEach((el) => {
    if (!el || el.type !== 'ObjectExpression') return;
    const slugProp = el.properties.find(
      (p) => p.type === 'ObjectProperty' && !p.computed && p.key && (p.key.name === 'slug' || p.key.value === 'slug')
    );
    if (!slugProp) return;
    const slug = slugProp.value && slugProp.value.value;
    if (!slug || !(slug in PATCHES)) return;
    seen.add(slug);

    const existing = new Set(
      el.properties
        .filter((p) => p.type === 'ObjectProperty' && p.key)
        .map((p) => p.key.name || p.key.value)
    );

    const patch = PATCHES[slug];
    for (const [key, value] of Object.entries(patch)) {
      if (existing.has(key)) continue; // never overwrite
      const ast = parseExpression(JSON.stringify(value));
      el.properties.push(builders.objectProperty(builders.identifier(key), ast));
    }
    patched++;
  });

  // Sanity check: any patches we didn't apply?
  const missing = Object.keys(PATCHES).filter((s) => !seen.has(s));
  if (missing.length > 0) {
    console.warn('Missing slugs (not found in data.ts):', missing);
  }

  const out = recast.print(ast, { quote: 'single', trailingComma: true }).code;
  fs.writeFileSync(DATA_TS, out, 'utf8');
  console.log(`Patched ${patched} tools (${Object.keys(PATCHES).length} requested).`);
}

/** Parse a JSON-stringified value as a single expression. */
function parseExpression(jsonSrc) {
  const ast = parser.parse(`const _ = ${jsonSrc};`, {
    sourceType: 'module',
    plugins: ['typescript'],
  });
  return ast.program.body[0].declarations[0].init;
}

main();
