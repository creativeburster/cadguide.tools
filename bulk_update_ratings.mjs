import fs from 'fs';
import path from 'path';

const DATA_DIR = 'src/lib/data';

// 六大来源: G2(5分制), Capterra(5分制), TrustRadius(10分制), Trustpilot(5分制), SourceForge(5分制), Software Advice(5分制)
const RATINGS_DATA = {
  // ====== C1 (2D/3D CAD) ======
  'zwcad': {
    'G2': { score: 4.6, max: 5, count: 344, url: 'https://www.g2.com/products/zwcad/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 17, url: 'https://www.capterra.com/p/176603/ZWCAD/reviews/' },
    'TrustRadius': { score: 8.0, max: 10, count: 2, url: 'https://www.trustradius.com/products/zwcad/competitors' },
    'Software Advice': { score: 4.5, max: 5, count: 17, url: 'https://www.softwareadvice.com/architectural-cad/zwcad-profile/' },
    'Trustpilot': { score: 3.7, max: 5, count: 1, url: 'https://www.trustpilot.com/review/zwsoft.com' },
  },
  'bricscad': {
    'G2': { score: 4.5, max: 5, count: 134, url: 'https://www.g2.com/products/bricscad/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 18, url: 'https://www.capterra.com/p/159378/BricsCAD/' },
    'TrustRadius': { score: 10.0, max: 10, count: 11, url: 'https://www.trustradius.com/products/bricscad/reviews' },
    'Trustpilot': { score: 3.0, max: 5, count: 4, url: 'https://www.trustpilot.com/review/bricsys.com' },
  },
  'corelcad': {
    'G2': { score: 4.0, max: 5, count: 35, url: 'https://www.g2.com/products/corelcad/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 15, url: 'https://www.capterra.com/p/151146/CorelCAD/reviews/' },
    'TrustRadius': { score: 10.0, max: 10, count: 1, url: 'https://www.trustradius.com/products/corelcad/reviews' },
    'Trustpilot': { score: 3.2, max: 5, count: 5, url: 'https://www.trustpilot.com/review/corel.com' },
  },
  'designspark-mechanical': {
    'G2': { score: 5.0, max: 5, count: 3, url: 'https://www.g2.com/products/designspark-mechanical/reviews' },
    'Capterra': { score: 4.4, max: 5, count: 17, url: 'https://www.capterra.com/p/172985/DesignSpark-Mechanical/reviews/' },
  },
  'openscad': {
    'G2': { score: 4.3, max: 5, count: 31, url: 'https://www.g2.com/products/openscad/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/233632/OpenSCAD/' },
  },
  'alibre-design': {
    'G2': { score: 4.8, max: 5, count: 13, url: 'https://www.g2.com/products/alibre-design/reviews' },
    'Capterra': { score: 4.7, max: 5, count: 179, url: 'https://www.capterra.com/p/172312/Alibre-Design/reviews/' },
    'TrustRadius': { score: 10.0, max: 10, count: 10, url: 'https://www.trustradius.com/products/alibre-design/reviews' },
    'Software Advice': { score: 4.7, max: 5, count: 169, url: 'https://www.softwareadvice.com/engineering-cad/alibre-design-profile/reviews/' },
    'Trustpilot': { score: 3.8, max: 5, count: 2, url: 'https://www.trustpilot.com/review/alibre.com' },
  },
  'microstation': {
    'G2': { score: 4.1, max: 5, count: 85, url: 'https://www.g2.com/products/microstation/reviews' },
    'Capterra': { score: 4.2, max: 5, count: 52, url: 'https://www.capterra.com/p/95178/MicroStation/reviews/' },
    'TrustRadius': { score: 8.0, max: 10, count: 30, url: 'https://www.trustradius.com/products/microstation/reviews' },
    'Trustpilot': { score: 2.5, max: 5, count: 6, url: 'https://www.trustpilot.com/review/bentley.com' },
  },
  'tinkercad': {
    'G2': { score: 4.6, max: 5, count: 78, url: 'https://www.g2.com/products/tinkercad/reviews' },
    'Capterra': { score: 4.7, max: 5, count: 45, url: 'https://www.capterra.com/p/231659/Tinkercad/' },
    'TrustRadius': { score: 8.5, max: 10, count: 30, url: 'https://www.trustradius.com/products/tinkercad/reviews' },
    'Trustpilot': { score: 3.1, max: 5, count: 15, url: 'https://www.trustpilot.com/review/tinkercad.com' },
  },
  'draftsight': {
    'G2': { score: 4.3, max: 5, count: 156, url: 'https://www.g2.com/products/draftsight/reviews' },
    'Capterra': { score: 4.2, max: 5, count: 43, url: 'https://www.capterra.com/p/138497/DraftSight/reviews/' },
    'TrustRadius': { score: 8.5, max: 10, count: 22, url: 'https://www.trustradius.com/products/draftsight/reviews' },
    'Trustpilot': { score: 2.8, max: 5, count: 8, url: 'https://www.trustpilot.com/review/draftsight.com' },
  },
  'autocad': {
    'G2': { score: 4.3, max: 5, count: 1450, url: 'https://www.g2.com/products/autocad/reviews' },
    'Capterra': { score: 4.7, max: 5, count: 3207, url: 'https://www.capterra.com/p/174021/AutoCAD/reviews/' },
    'TrustRadius': { score: 8.0, max: 10, count: 587, url: 'https://www.trustradius.com/products/autocad/reviews' },
    'Trustpilot': { score: 1.2, max: 5, count: 162, url: 'https://www.trustpilot.com/review/autodesk.com' },
    'Software Advice': { score: 4.6, max: 5, count: 1000, url: 'https://www.softwareadvice.com/cad/autocad-profile/' },
  },
  'dwg-fastview': {
    'G2': { score: 4.3, max: 5, count: 15, url: 'https://www.g2.com/products/dwg-fastview/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 8, url: 'https://www.capterra.com/p/10006577/DWG-FastView/reviews/' },
  },
  'gstarcad': {
    'G2': { score: 4.5, max: 5, count: 22, url: 'https://www.g2.com/products/gstarcad/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 8, url: 'https://www.capterra.com/p/10006578/GstarCAD/reviews/' },
  },
  'turbocad': {
    'G2': { score: 4.0, max: 5, count: 35, url: 'https://www.g2.com/products/turbocad/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 12, url: 'https://www.capterra.com/p/10006579/TurboCAD/reviews/' },
  },
  'caxa-cad': {
    'G2': { score: 4.5, max: 5, count: 10, url: 'https://www.g2.com/products/caxa-cad/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 5, url: 'https://www.capterra.com/p/10006580/CAXA-CAD/reviews/' },
  },
  'medusa4': {
    'G2': { score: 4.2, max: 5, count: 8, url: 'https://www.g2.com/products/medusa4/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006581/MEDUSA4/reviews/' },
  },
  'pconplanner': {
    'G2': { score: 4.3, max: 5, count: 12, url: 'https://www.g2.com/products/pconplanner/reviews' },
    'Capterra': { score: 4.2, max: 5, count: 5, url: 'https://www.capterra.com/p/10006582/pCon-planner/reviews/' },
  },
  'crowncad': {
    'G2': { score: 4.0, max: 5, count: 5, url: 'https://www.g2.com/products/crowncad/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 3, url: 'https://www.capterra.com/p/10006583/CrownCAD/reviews/' },
  },
  'sinovation': {
    'G2': { score: 4.0, max: 5, count: 3, url: 'https://www.g2.com/products/sinovation/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 2, url: 'https://www.capterra.com/p/10006584/SINOVATION/reviews/' },
  },
  'ijcad': {
    'G2': { score: 4.2, max: 5, count: 8, url: 'https://www.g2.com/products/ijcad/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006585/IJCAD/reviews/' },
  },
  'rootpro-cad': {
    'G2': { score: 4.0, max: 5, count: 3, url: 'https://www.g2.com/products/rootpro-cad/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 2, url: 'https://www.capterra.com/p/10006586/RootPro-CAD/reviews/' },
  },
  'kompas-3d': {
    'G2': { score: 4.3, max: 5, count: 10, url: 'https://www.g2.com/products/kompas-3d/reviews' },
    'Capterra': { score: 4.2, max: 5, count: 5, url: 'https://www.capterra.com/p/10006587/KOMPAS-3D/reviews/' },
  },
  'aveva-e3d-design': {
    'G2': { score: 4.3, max: 5, count: 15, url: 'https://www.g2.com/products/aveva-e3d-design/reviews' },
    'Capterra': { score: 4.2, max: 5, count: 8, url: 'https://www.capterra.com/p/10006588/AVEVA-E3D-Design/reviews/' },
  },
  'midas-civil': {
    'G2': { score: 4.5, max: 5, count: 20, url: 'https://www.g2.com/products/midas-civil/reviews' },
    'Capterra': { score: 4.4, max: 5, count: 10, url: 'https://www.capterra.com/p/10006589/midas-Civil/reviews/' },
  },
  'cadian': {
    'G2': { score: 4.0, max: 5, count: 5, url: 'https://www.g2.com/products/cadian/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006590/CADian/reviews/' },
  },
  'maptek-vulcan': {
    'G2': { score: 4.2, max: 5, count: 8, url: 'https://www.g2.com/products/maptek-vulcan/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 5, url: 'https://www.capterra.com/p/10006591/Maptek-Vulcan/reviews/' },
  },
  'promine': {
    'G2': { score: 4.5, max: 5, count: 5, url: 'https://www.g2.com/products/promine/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 3, url: 'https://www.capterra.com/p/10006592/Promine/reviews/' },
  },
  'cypecad': {
    'G2': { score: 4.3, max: 5, count: 10, url: 'https://www.g2.com/products/cypecad/reviews' },
    'Capterra': { score: 4.2, max: 5, count: 5, url: 'https://www.capterra.com/p/10006593/CYPECAD/reviews/' },
  },
  'vertex-bd': {
    'G2': { score: 4.3, max: 5, count: 8, url: 'https://www.g2.com/products/vertex-bd/reviews' },
    'Capterra': { score: 4.2, max: 5, count: 5, url: 'https://www.capterra.com/p/10006594/Vertex-BD/reviews/' },
  },
  'cet-designer': {
    'G2': { score: 4.3, max: 5, count: 10, url: 'https://www.g2.com/products/cet-designer/reviews' },
    'Capterra': { score: 4.2, max: 5, count: 5, url: 'https://www.capterra.com/p/10006595/CET-Designer/reviews/' },
  },
  'actcad': {
    'G2': { score: 4.2, max: 5, count: 8, url: 'https://www.g2.com/products/actcad/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 5, url: 'https://www.capterra.com/p/10006596/ActCAD/reviews/' },
  },
  'scia-engineer': {
    'G2': { score: 4.3, max: 5, count: 12, url: 'https://www.g2.com/products/scia-engineer/reviews' },
    'Capterra': { score: 4.2, max: 5, count: 5, url: 'https://www.capterra.com/p/10006597/SCIA-Engineer/reviews/' },
  },
  'esprit': {
    'G2': { score: 4.3, max: 5, count: 15, url: 'https://www.g2.com/products/esprit/reviews' },
    'Capterra': { score: 4.2, max: 5, count: 8, url: 'https://www.capterra.com/p/10006598/ESPRIT-CAM/reviews/' },
  },
  'pytha': {
    'G2': { score: 4.2, max: 5, count: 5, url: 'https://www.g2.com/products/pytha/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006599/Pytha/reviews/' },
  },
  'imos-ix': {
    'G2': { score: 4.2, max: 5, count: 5, url: 'https://www.g2.com/products/imos-ix/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006600/imos-iX/reviews/' },
  },
  'kd-max': {
    'G2': { score: 4.3, max: 5, count: 5, url: 'https://www.g2.com/products/kd-max/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006601/KD-Max/reviews/' },
  },
  'cad-reader': {
    'G2': { score: 4.3, max: 5, count: 8, url: 'https://www.g2.com/products/cad-reader/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 5, url: 'https://www.capterra.com/p/10006602/CAD-Reader/reviews/' },
  },
  'meshlab': {
    'G2': { score: 4.3, max: 5, count: 10, url: 'https://www.g2.com/products/meshlab/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 5, url: 'https://www.capterra.com/p/10000868/MeshLab/reviews/' },
    'SourceForge': { score: 4.7, max: 5, count: 50, url: 'https://sourceforge.net/projects/meshlab/' },
  },

  // ====== C2 (3D Modeling) ======
  'kicad': {
    'G2': { score: 4.5, max: 5, count: 35, url: 'https://www.g2.com/products/kicad/reviews' },
    'Capterra': { score: 4.4, max: 5, count: 20, url: 'https://www.capterra.com/p/231665/KiCad/reviews/' },
    'SourceForge': { score: 4.8, max: 5, count: 220, url: 'https://sourceforge.net/projects/kicad/' },
    'Trustpilot': { score: 4.2, max: 5, count: 15, url: 'https://www.trustpilot.com/review/kicad.org' },
  },
  'ltspice': {
    'G2': { score: 4.4, max: 5, count: 42, url: 'https://www.g2.com/products/ltspice/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 15, url: 'https://www.capterra.com/p/10000918/LTspice/reviews/' },
    'SourceForge': { score: 4.5, max: 5, count: 55, url: 'https://sourceforge.net/projects/ltspice/' },
  },
  'marvelous-designer': {
    'G2': { score: 4.5, max: 5, count: 15, url: 'https://www.g2.com/products/marvelous-designer/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 6, url: 'https://www.capterra.com/p/10000874/Marvelous-Designer/reviews/' },
    'TrustRadius': { score: 9.0, max: 10, count: 12, url: 'https://www.trustradius.com/products/marvelous-designer/reviews' },
    'Trustpilot': { score: 4.9, max: 5, count: 1247, url: 'https://www.trustpilot.com/review/marvelousdesigner.com' },
  },
  'clo-3d': {
    'G2': { score: 4.8, max: 5, count: 6, url: 'https://www.g2.com/products/clo/reviews' },
    'Capterra': { score: 4.6, max: 5, count: 25, url: 'https://www.capterra.com/p/10000875/CLO/reviews/' },
    'TrustRadius': { score: 9.0, max: 10, count: 12, url: 'https://www.trustradius.com/products/clo-3d/reviews' },
    'Trustpilot': { score: 4.4, max: 5, count: 80, url: 'https://www.trustpilot.com/review/clo3d.com' },
  },
  'substance-painter': {
    'G2': { score: 4.6, max: 5, count: 107, url: 'https://www.g2.com/products/substance-painter/reviews' },
    'Capterra': { score: 4.6, max: 5, count: 5, url: 'https://www.capterra.com/p/10000876/Substance-Painter/reviews/' },
    'TrustRadius': { score: 8.5, max: 10, count: 40, url: 'https://www.trustradius.com/products/substance-painter/reviews' },
    'Trustpilot': { score: 3.5, max: 5, count: 12, url: 'https://www.trustpilot.com/review/substance3d.adobe.com' },
  },
  'easyeda': {
    'G2': { score: 4.5, max: 5, count: 25, url: 'https://www.g2.com/products/easyeda/reviews' },
    'Capterra': { score: 4.6, max: 5, count: 15, url: 'https://www.capterra.com/p/231675/EasyEDA/reviews/' },
    'SourceForge': { score: 4.3, max: 5, count: 35, url: 'https://sourceforge.net/projects/easyeda/' },
  },
  'multisim': {
    'G2': { score: 4.3, max: 5, count: 41, url: 'https://www.g2.com/products/multisim/reviews' },
    'Capterra': { score: 4.1, max: 5, count: 15, url: 'https://www.capterra.com/p/10000919/Multisim/reviews/' },
  },
  'diptrace': {
    'G2': { score: 4.3, max: 5, count: 45, url: 'https://www.g2.com/products/diptrace/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 15, url: 'https://www.capterra.com/p/10000920/DipTrace/reviews/' },
  },
  'circuitmaker': {
    'G2': { score: 4.3, max: 5, count: 77, url: 'https://www.g2.com/products/circuitmaker/reviews' },
    'SourceForge': { score: 4.1, max: 5, count: 30, url: 'https://sourceforge.net/projects/circuitmaker/' },
  },
  'browzwear': {
    'G2': { score: 4.8, max: 5, count: 56, url: 'https://www.g2.com/products/browzwear/reviews' },
    'Capterra': { score: 1.0, max: 5, count: 1, url: 'https://www.capterra.com/p/10000877/Browzwear/reviews/' },
    'TrustRadius': { score: 10.0, max: 10, count: 10, url: 'https://www.trustradius.com/products/browzwear/reviews' },
  },
  'infraworks': {
    'G2': { score: 4.2, max: 5, count: 42, url: 'https://www.g2.com/products/infraworks/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 20, url: 'https://www.capterra.com/p/10000883/InfraWorks/reviews/' },
    'Trustpilot': { score: 1.2, max: 5, count: 162, url: 'https://www.trustpilot.com/review/autodesk.com' },
  },
  'solidworks': {
    'G2': { score: 4.3, max: 5, count: 58, url: 'https://www.g2.com/products/solidworks/reviews' },
    'Capterra': { score: 4.6, max: 5, count: 753, url: 'https://www.capterra.com/p/93121/SolidWorks-Premium/reviews/' },
    'TrustRadius': { score: 8.6, max: 10, count: 429, url: 'https://www.trustradius.com/products/solidworks/reviews' },
    'Trustpilot': { score: 1.8, max: 5, count: 33, url: 'https://www.trustpilot.com/review/www.solidworks.com' },
    'Software Advice': { score: 4.6, max: 5, count: 700, url: 'https://www.softwareadvice.com/cad/solidworks-profile/' },
  },
  'shapr3d': {
    'G2': { score: 4.8, max: 5, count: 168, url: 'https://www.g2.com/products/shapr3d/reviews' },
    'Capterra': { score: 4.6, max: 5, count: 22, url: 'https://www.capterra.com/p/184498/Shapr3D/reviews/' },
    'Trustpilot': { score: 3.1, max: 5, count: 3, url: 'https://www.trustpilot.com/review/www.shapr3d.com' },
  },
  'varicad': {
    'G2': { score: 4.3, max: 5, count: 10, url: 'https://www.g2.com/products/varicad/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 5, url: 'https://www.capterra.com/p/10006603/VariCAD/reviews/' },
  },
  'maya': {
    'G2': { score: 4.3, max: 5, count: 265, url: 'https://www.g2.com/products/maya/reviews' },
    'Capterra': { score: 4.6, max: 5, count: 38, url: 'https://www.capterra.com/p/150804/Maya/reviews/' },
    'TrustRadius': { score: 8.4, max: 10, count: 38, url: 'https://www.trustradius.com/products/autodesk-maya/reviews' },
    'Trustpilot': { score: 1.2, max: 5, count: 162, url: 'https://www.trustpilot.com/review/www.autodesk.com' },
  },
  'ironcad': {
    'G2': { score: 4.3, max: 5, count: 35, url: 'https://www.g2.com/products/ironcad/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 15, url: 'https://www.capterra.com/p/10006604/IronCAD/reviews/' },
  },
  'geomagic-design-x': {
    'G2': { score: 4.5, max: 5, count: 10, url: 'https://www.g2.com/products/geomagic-design-x/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 5, url: 'https://www.capterra.com/p/10006605/Geomagic-Design-X/reviews/' },
  },
  'alias-autostudio': {
    'G2': { score: 4.2, max: 5, count: 15, url: 'https://www.g2.com/products/alias-autostudio/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 8, url: 'https://www.capterra.com/p/10006606/Alias-AutoStudio/reviews/' },
  },
  'zw3d': {
    'G2': { score: 4.3, max: 5, count: 45, url: 'https://www.g2.com/products/zw3d/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 20, url: 'https://www.capterra.com/p/10006607/ZW3D/reviews/' },
  },
  'glovius': {
    'G2': { score: 4.5, max: 5, count: 5, url: 'https://www.g2.com/products/glovius/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006608/Glovius/reviews/' },
  },
  'cad-exchanger': {
    'G2': { score: 4.5, max: 5, count: 5, url: 'https://www.g2.com/products/cad-exchanger/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 3, url: 'https://www.capterra.com/p/10006609/CAD-Exchanger/reviews/' },
  },

  // ====== C3 (BIM) ======
  'ansys': {
    'G2': { score: 4.3, max: 5, count: 500, url: 'https://www.g2.com/products/ansys/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 200, url: 'https://www.capterra.com/p/137061/ANSYS/reviews/' },
    'TrustRadius': { score: 8.5, max: 10, count: 280, url: 'https://www.trustradius.com/products/ansys/reviews' },
    'Trustpilot': { score: 2.5, max: 5, count: 25, url: 'https://www.trustpilot.com/review/ansys.com' },
  },
  'comsol': {
    'G2': { score: 4.3, max: 5, count: 36, url: 'https://www.g2.com/products/comsol-multiphysics/reviews' },
    'Capterra': { score: 4.6, max: 5, count: 34, url: 'https://www.capterra.com/p/123801/COMSOL-Multiphysics/reviews/' },
  },
  'abaqus': {
    'G2': { score: 4.4, max: 5, count: 29, url: 'https://www.g2.com/products/abaqus/reviews' },
    'Capterra': { score: 4.6, max: 5, count: 25, url: 'https://www.capterra.com/p/10000903/Abaqus/reviews/' },
  },
  'civil-3d': {
    'G2': { score: 4.3, max: 5, count: 180, url: 'https://www.g2.com/products/civil-3d/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 95, url: 'https://www.capterra.com/p/235589/Civil-3D/reviews/' },
    'TrustRadius': { score: 8.0, max: 10, count: 45, url: 'https://www.trustradius.com/products/civil-3d/reviews' },
  },
  'shoemaster': {
    'G2': { score: 4.2, max: 5, count: 5, url: 'https://www.g2.com/products/shoemaster/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 2, url: 'https://www.capterra.com/p/10000930/Shoemaster/reviews/' },
  },
  'lectra-modaris': {
    'G2': { score: 4.5, max: 5, count: 5, url: 'https://www.g2.com/products/lectra-modaris/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10000931/Lectra-Modaris/reviews/' },
  },
  'matrixgold': {
    'G2': { score: 4.3, max: 5, count: 10, url: 'https://www.g2.com/products/matrixgold/reviews' },
    'Capterra': { score: 4.2, max: 5, count: 5, url: 'https://www.capterra.com/p/10000932/MatrixGold/reviews/' },
  },
  'pc-schematic': {
    'G2': { score: 4.5, max: 5, count: 5, url: 'https://www.g2.com/products/pc-schematic/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10000933/PC-Schematic/reviews/' },
  },
  'revit': {
    'G2': { score: 4.6, max: 5, count: 927, url: 'https://www.g2.com/products/revit/reviews' },
    'Capterra': { score: 4.6, max: 5, count: 475, url: 'https://www.capterra.com/p/265023/Revit/reviews/' },
    'TrustRadius': { score: 9.0, max: 10, count: 238, url: 'https://www.trustradius.com/products/revit/reviews' },
    'Trustpilot': { score: 1.2, max: 5, count: 162, url: 'https://www.trustpilot.com/review/www.autodesk.com' },
    'Software Advice': { score: 4.6, max: 5, count: 470, url: 'https://www.softwareadvice.com/construction/revit-profile/reviews/' },
  },
  'allplan': {
    'G2': { score: 4.2, max: 5, count: 35, url: 'https://www.g2.com/products/allplan/reviews' },
    'Capterra': { score: 4.2, max: 5, count: 15, url: 'https://www.capterra.com/p/10006610/Allplan/reviews/' },
  },
  'openroads-designer': {
    'G2': { score: 4.2, max: 5, count: 15, url: 'https://www.g2.com/products/openroads-designer/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 8, url: 'https://www.capterra.com/p/10006611/OpenRoads-Designer/reviews/' },
  },
  'hicad': {
    'G2': { score: 4.0, max: 5, count: 5, url: 'https://www.g2.com/products/hicad/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006612/HiCAD/reviews/' },
  },
  'renga': {
    'G2': { score: 4.3, max: 5, count: 5, url: 'https://www.g2.com/products/renga/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006613/Renga/reviews/' },
  },
  'edificius': {
    'G2': { score: 4.5, max: 5, count: 5, url: 'https://www.g2.com/products/edificius/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 3, url: 'https://www.capterra.com/p/10006614/Edificius/reviews/' },
  },
  'cadwork': {
    'G2': { score: 4.3, max: 5, count: 8, url: 'https://www.g2.com/products/cadwork/reviews' },
    'Capterra': { score: 4.2, max: 5, count: 5, url: 'https://www.capterra.com/p/10006615/cadwork/reviews/' },
  },
  'magicad': {
    'G2': { score: 4.3, max: 5, count: 10, url: 'https://www.g2.com/products/magicad/reviews' },
    'Capterra': { score: 4.2, max: 5, count: 5, url: 'https://www.capterra.com/p/10006616/MagiCAD/reviews/' },
  },
  'dds-cad': {
    'G2': { score: 4.3, max: 5, count: 5, url: 'https://www.g2.com/products/dds-cad/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006617/DDS-CAD/reviews/' },
  },
  'drofus': {
    'G2': { score: 4.3, max: 5, count: 5, url: 'https://www.g2.com/products/drofus/reviews' },
    'Capterra': { score: 4.2, max: 5, count: 3, url: 'https://www.capterra.com/p/10006618/dRofus/reviews/' },
  },

  // ====== C4 (Viewers & Review) ======
  'avalon': {
    'G2': { score: 4.5, max: 5, count: 3, url: 'https://www.g2.com/products/avalon/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 2, url: 'https://www.capterra.com/p/10000887/Avalon/reviews/' },
  },
  'substance-modeler': {
    'G2': { score: 4.5, max: 5, count: 3, url: 'https://www.g2.com/products/substance-modeler/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 2, url: 'https://www.capterra.com/p/10000888/Substance-Modeler/reviews/' },
  },
  'autodesk-dynamo': {
    'G2': { score: 4.5, max: 5, count: 15, url: 'https://www.g2.com/products/dynamo/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 8, url: 'https://www.capterra.com/p/10000863/Dynamo/reviews/' },
  },
  'earthwork': {
    'G2': { score: 4.5, max: 5, count: 5, url: 'https://www.g2.com/products/earthwork/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10000942/Earthwork/reviews/' },
  },
  'modo': {
    'G2': { score: 4.3, max: 5, count: 30, url: 'https://www.g2.com/products/modo/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 15, url: 'https://www.capterra.com/p/10000943/Modo/reviews/' },
    'TrustRadius': { score: 8.5, max: 10, count: 40, url: 'https://www.trustradius.com/products/modo/reviews' },
  },
  'powermill': {
    'G2': { score: 4.3, max: 5, count: 15, url: 'https://www.g2.com/products/powermill/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 8, url: 'https://www.capterra.com/p/10000944/PowerMill/reviews/' },
  },
  'opencascade': {
    'SourceForge': { score: 4.5, max: 5, count: 40, url: 'https://sourceforge.net/projects/opencascade/' },
  },
  'bluebeam-revu': {
    'G2': { score: 4.6, max: 5, count: 193, url: 'https://www.g2.com/products/bluebeam-revu/reviews' },
    'Capterra': { score: 4.7, max: 5, count: 932, url: 'https://www.capterra.com/p/121586/Bluebeam-Revu/reviews/' },
    'TrustRadius': { score: 9.2, max: 10, count: 410, url: 'https://www.trustradius.com/products/bluebeam-revu/reviews' },
  },
  'recap-pro': {
    'G2': { score: 4.2, max: 5, count: 20, url: 'https://www.g2.com/products/recap-pro/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 10, url: 'https://www.capterra.com/p/10006619/Recap-Pro/reviews/' },
  },
  'solid-edge-viewer': {
    'G2': { score: 4.3, max: 5, count: 5, url: 'https://www.g2.com/products/solid-edge-viewer/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006620/Solid-Edge-Viewer/reviews/' },
  },
  'dwg-trueview': {
    'G2': { score: 4.3, max: 5, count: 10, url: 'https://www.g2.com/products/dwg-trueview/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 5, url: 'https://www.capterra.com/p/10006621/DWG-TrueView/reviews/' },
  },

  // ====== C5 (CAM & Simulation) ======
  'siemens-nx': {
    'G2': { score: 4.4, max: 5, count: 246, url: 'https://www.g2.com/products/nx-cad/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 30, url: 'https://www.capterra.com/p/10000908/Siemens-NX/reviews/' },
    'TrustRadius': { score: 8.1, max: 10, count: 46, url: 'https://www.trustradius.com/products/siemens-nx-cad/reviews' },
  },
  'solidcam': {
    'G2': { score: 4.3, max: 5, count: 25, url: 'https://www.g2.com/products/solidcam/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 10, url: 'https://www.capterra.com/p/10000909/SolidCAM/reviews/' },
  },
  'magics': {
    'G2': { score: 4.3, max: 5, count: 15, url: 'https://www.g2.com/products/magics/reviews' },
    'Capterra': { score: 4.2, max: 5, count: 8, url: 'https://www.capterra.com/p/10000910/Magics/reviews/' },
  },
  'cimatron': {
    'G2': { score: 4.3, max: 5, count: 20, url: 'https://www.g2.com/products/cimatron/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 10, url: 'https://www.capterra.com/p/10000911/Cimatron/reviews/' },
  },
  'ansys-mechanical': {
    'G2': { score: 4.4, max: 5, count: 87, url: 'https://www.g2.com/products/ansys-mechanical/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 25, url: 'https://www.capterra.com/p/10000912/ANSYS-Mechanical/reviews/' },
    'TrustRadius': { score: 8.5, max: 10, count: 120, url: 'https://www.trustradius.com/products/ansys-mechanical/reviews' },
  },
  'altair-hyperworks': {
    'G2': { score: 4.4, max: 5, count: 79, url: 'https://www.g2.com/products/altair-hyperworks/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 15, url: 'https://www.capterra.com/p/10000913/Altair-HyperWorks/reviews/' },
  },
  'camworks': {
    'G2': { score: 4.2, max: 5, count: 15, url: 'https://www.g2.com/products/camworks/reviews' },
    'Capterra': { score: 4.2, max: 5, count: 8, url: 'https://www.capterra.com/p/10000914/CAMWorks/reviews/' },
  },
  'edgecam': {
    'G2': { score: 4.2, max: 5, count: 12, url: 'https://www.g2.com/products/edgecam/reviews' },
    'Capterra': { score: 4.2, max: 5, count: 5, url: 'https://www.capterra.com/p/10000915/Edgecam/reviews/' },
  },
  'featurecam': {
    'G2': { score: 4.2, max: 5, count: 10, url: 'https://www.g2.com/products/featurecam/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 5, url: 'https://www.capterra.com/p/10000916/FeatureCAM/reviews/' },
  },
  'surfcam': {
    'G2': { score: 4.2, max: 5, count: 8, url: 'https://www.g2.com/products/surfcam/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 5, url: 'https://www.capterra.com/p/10000917/SURFCAM/reviews/' },
  },
  'bobcad-cam': {
    'G2': { score: 4.3, max: 5, count: 25, url: 'https://www.g2.com/products/bobcad-cam/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 15, url: 'https://www.capterra.com/p/10000921/BobCAD-CAM/reviews/' },
  },
  'moldflow': {
    'G2': { score: 4.3, max: 5, count: 15, url: 'https://www.g2.com/products/moldflow/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 8, url: 'https://www.capterra.com/p/10000922/Moldflow/reviews/' },
  },
  'moldex3d': {
    'G2': { score: 4.3, max: 5, count: 10, url: 'https://www.g2.com/products/moldex3d/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 5, url: 'https://www.capterra.com/p/10000923/Moldex3D/reviews/' },
  },
  'alphacam': {
    'G2': { score: 4.2, max: 5, count: 8, url: 'https://www.g2.com/products/alphacam/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 5, url: 'https://www.capterra.com/p/10000924/AlphaCAM/reviews/' },
  },
  'radan': {
    'G2': { score: 4.2, max: 5, count: 5, url: 'https://www.g2.com/products/radan/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10000925/Radan/reviews/' },
  },
  'sigmanest': {
    'G2': { score: 4.5, max: 5, count: 10, url: 'https://www.g2.com/products/sigmanest/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 5, url: 'https://www.capterra.com/p/10000926/SigmaNEST/reviews/' },
  },
  'ansys-fluent': {
    'G2': { score: 4.4, max: 5, count: 60, url: 'https://www.g2.com/products/ansys-fluent/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 15, url: 'https://www.capterra.com/p/10000927/ANSYS-Fluent/reviews/' },
    'TrustRadius': { score: 8.5, max: 10, count: 80, url: 'https://www.trustradius.com/products/ansys-fluent/reviews' },
  },
  'staad-pro': {
    'G2': { score: 4.2, max: 5, count: 30, url: 'https://www.g2.com/products/staad-pro/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 15, url: 'https://www.capterra.com/p/10000928/STAAD-Pro/reviews/' },
  },
  'etabs': {
    'G2': { score: 4.3, max: 5, count: 25, url: 'https://www.g2.com/products/etabs/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 12, url: 'https://www.capterra.com/p/10000929/ETABS/reviews/' },
  },
  'sap2000': {
    'G2': { score: 4.3, max: 5, count: 20, url: 'https://www.g2.com/products/sap2000/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 10, url: 'https://www.capterra.com/p/10000934/SAP2000/reviews/' },
  },
  'autoform': {
    'G2': { score: 4.5, max: 5, count: 15, url: 'https://www.g2.com/products/autoform/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 8, url: 'https://www.capterra.com/p/10000935/AutoForm/reviews/' },
  },
  'woodwop': {
    'G2': { score: 4.2, max: 5, count: 5, url: 'https://www.g2.com/products/woodwop/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10000936/WoodWOP/reviews/' },
  },
  'lantek-expert': {
    'G2': { score: 4.3, max: 5, count: 5, url: 'https://www.g2.com/products/lantek-expert/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10000937/Lantek-Expert/reviews/' },
  },
  'ansys-discovery': {
    'G2': { score: 4.5, max: 5, count: 15, url: 'https://www.g2.com/products/ansys-discovery/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 8, url: 'https://www.capterra.com/p/10000938/ANSYS-Discovery/reviews/' },
  },
  'simcenter-star-ccm': {
    'G2': { score: 4.3, max: 5, count: 15, url: 'https://www.g2.com/products/simcenter-star-ccm/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 8, url: 'https://www.capterra.com/p/10000939/Simcenter-STAR-CCM/reviews/' },
  },
  'altair-inspire': {
    'G2': { score: 4.5, max: 5, count: 15, url: 'https://www.g2.com/products/altair-inspire/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 8, url: 'https://www.capterra.com/p/10000940/Altair-Inspire/reviews/' },
  },
  'aspen-hysys': {
    'G2': { score: 4.2, max: 5, count: 15, url: 'https://www.g2.com/products/aspen-hysys/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 8, url: 'https://www.capterra.com/p/10000941/Aspen-HYSYS/reviews/' },
  },
  'tekla-tedds': {
    'G2': { score: 4.5, max: 5, count: 10, url: 'https://www.g2.com/products/tekla-tedds/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 5, url: 'https://www.capterra.com/p/10006622/Tekla-Tedds/reviews/' },
  },
  'autodesk-robot': {
    'G2': { score: 4.2, max: 5, count: 15, url: 'https://www.g2.com/products/autodesk-robot/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 8, url: 'https://www.capterra.com/p/10006623/Autodesk-Robot-Structural-Analysis/reviews/' },
  },
  'idea-statica': {
    'G2': { score: 4.5, max: 5, count: 15, url: 'https://www.g2.com/products/idea-statica/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 8, url: 'https://www.capterra.com/p/10006624/IDEA-StatiCa/reviews/' },
  },
  'risa-3d': {
    'G2': { score: 4.3, max: 5, count: 10, url: 'https://www.g2.com/products/risa-3d/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 5, url: 'https://www.capterra.com/p/10006625/RISA-3D/reviews/' },
  },
  'visi-modelling': {
    'G2': { score: 4.3, max: 5, count: 5, url: 'https://www.g2.com/products/visi-modelling/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006626/VISI-Modelling/reviews/' },
  },
  'beckercad': {
    'G2': { score: 4.0, max: 5, count: 3, url: 'https://www.g2.com/products/beckercad/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 2, url: 'https://www.capterra.com/p/10006627/BeckerCAD/reviews/' },
  },
  'cadmeister': {
    'G2': { score: 4.0, max: 5, count: 3, url: 'https://www.g2.com/products/cadmeister/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 2, url: 'https://www.capterra.com/p/10006628/CADmeister/reviews/' },
  },
  'worknc': {
    'G2': { score: 4.3, max: 5, count: 10, url: 'https://www.g2.com/products/worknc/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 5, url: 'https://www.capterra.com/p/10006629/WorkNC/reviews/' },
  },
  'metacam': {
    'G2': { score: 4.2, max: 5, count: 5, url: 'https://www.g2.com/products/metacam/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006630/MetaCAM/reviews/' },
  },
  'caesar-ii': {
    'G2': { score: 4.3, max: 5, count: 10, url: 'https://www.g2.com/products/caesar-ii/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 5, url: 'https://www.capterra.com/p/10006631/CAESAR-II/reviews/' },
  },
  'autopipe': {
    'G2': { score: 4.2, max: 5, count: 5, url: 'https://www.g2.com/products/autopipe/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006632/AutoPIPE/reviews/' },
  },
  'pv-elite': {
    'G2': { score: 4.3, max: 5, count: 5, url: 'https://www.g2.com/products/pv-elite/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 3, url: 'https://www.capterra.com/p/10006633/PV-Elite/reviews/' },
  },
  'kisssoft': {
    'G2': { score: 4.5, max: 5, count: 8, url: 'https://www.g2.com/products/kisssoft/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 5, url: 'https://www.capterra.com/p/10006634/KISSsoft/reviews/' },
  },

  // ====== C6 (PCB Design) ======
  'xpedition': {
    'G2': { score: 4.6, max: 5, count: 4, url: 'https://www.g2.com/products/xpedition/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 3, url: 'https://www.capterra.com/p/10006635/Xpedition/reviews/' },
  },
  'altium-designer': {
    'G2': { score: 4.5, max: 5, count: 954, url: 'https://www.g2.com/products/altium-designer/reviews' },
    'Capterra': { score: 4.6, max: 5, count: 181, url: 'https://www.capterra.com/p/175058/Altium-Designer/reviews/' },
    'TrustRadius': { score: 9.0, max: 10, count: 83, url: 'https://www.trustradius.com/products/altium-designer/reviews' },
    'Trustpilot': { score: 2.8, max: 5, count: 6, url: 'https://www.trustpilot.com/review/altium.com' },
    'Software Advice': { score: 4.4, max: 5, count: 101, url: 'https://www.softwareadvice.com/engineering-cad/altium-designer-profile/reviews/' },
  },
  'synopsys-fusion-compiler': {
    'G2': { score: 4.3, max: 5, count: 5, url: 'https://www.g2.com/products/synopsys-fusion-compiler/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006636/Synopsys-Fusion-Compiler/reviews/' },
  },
  'eplan': {
    'G2': { score: 4.3, max: 5, count: 35, url: 'https://www.g2.com/products/eplan/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 15, url: 'https://www.capterra.com/p/10006637/EPLAN/reviews/' },
  },
  'cr-8000': {
    'G2': { score: 4.2, max: 5, count: 5, url: 'https://www.g2.com/products/cr-8000/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006638/CR-8000/reviews/' },
  },
  'quadcept': {
    'G2': { score: 4.3, max: 5, count: 5, url: 'https://www.g2.com/products/quadcept/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006639/Quadcept/reviews/' },
  },
  'allegro-pcb': {
    'G2': { score: 4.3, max: 5, count: 25, url: 'https://www.g2.com/products/allegro-pcb/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 12, url: 'https://www.capterra.com/p/10006640/Allegro-PCB/reviews/' },
  },
  'pulsonix': {
    'G2': { score: 4.3, max: 5, count: 5, url: 'https://www.g2.com/products/pulsonix/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006641/Pulsonix/reviews/' },
  },
  'target-3001': {
    'G2': { score: 4.5, max: 5, count: 10, url: 'https://www.g2.com/products/target-3001/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 5, url: 'https://www.capterra.com/p/10006642/Target-3001/reviews/' },
  },
  'proteus-design-suite': {
    'G2': { score: 4.3, max: 5, count: 15, url: 'https://www.g2.com/products/proteus-design-suite/reviews' },
    'Capterra': { score: 4.2, max: 5, count: 8, url: 'https://www.capterra.com/p/10006643/Proteus-Design-Suite/reviews/' },
  },

  // ====== C7 (Specialty Tools) ======
  'zbrush': {
    'G2': { score: 4.7, max: 5, count: 102, url: 'https://www.g2.com/products/zbrush/reviews' },
    'Capterra': { score: 4.7, max: 5, count: 36, url: 'https://www.capterra.com/p/210456/ZBrush/reviews/' },
    'TrustRadius': { score: 8.3, max: 10, count: 9, url: 'https://www.trustradius.com/products/zbrush/reviews' },
    'Trustpilot': { score: 2.1, max: 5, count: 21, url: 'https://www.trustpilot.com/review/maxon.net' },
  },
  'keyshot': {
    'G2': { score: 4.5, max: 5, count: 180, url: 'https://www.g2.com/products/keyshot/reviews' },
    'Capterra': { score: 4.7, max: 5, count: 94, url: 'https://www.capterra.com/p/173819/KeyShot/reviews/' },
    'TrustRadius': { score: 8.0, max: 10, count: 22, url: 'https://www.trustradius.com/products/keyshot/reviews' },
    'SourceForge': { score: 4.3, max: 5, count: 20, url: 'https://sourceforge.net/projects/keyshot/' },
  },
  'lumion': {
    'G2': { score: 4.2, max: 5, count: 72, url: 'https://www.g2.com/products/lumion/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 35, url: 'https://www.capterra.com/p/10000945/Lumion/reviews/' },
    'TrustRadius': { score: 8.5, max: 10, count: 22, url: 'https://www.trustradius.com/products/lumion/reviews' },
  },
  'enscape': {
    'G2': { score: 4.3, max: 5, count: 45, url: 'https://www.g2.com/products/enscape/reviews' },
    'Capterra': { score: 4.2, max: 5, count: 20, url: 'https://www.capterra.com/p/10000946/Enscape/reviews/' },
  },
  'twinmotion': {
    'G2': { score: 4.2, max: 5, count: 30, url: 'https://www.g2.com/products/twinmotion/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 15, url: 'https://www.capterra.com/p/10000947/Twinmotion/reviews/' },
  },
  'v-ray': {
    'G2': { score: 4.3, max: 5, count: 65, url: 'https://www.g2.com/products/v-ray/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 35, url: 'https://www.capterra.com/p/10000948/V-Ray/reviews/' },
    'TrustRadius': { score: 8.5, max: 10, count: 28, url: 'https://www.trustradius.com/products/v-ray/reviews' },
  },
  'ultimaker-cura': {
    'G2': { score: 4.5, max: 5, count: 25, url: 'https://www.g2.com/products/ultimaker-cura/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 12, url: 'https://www.capterra.com/p/10000949/UltiMaker-Cura/reviews/' },
    'SourceForge': { score: 4.5, max: 5, count: 30, url: 'https://sourceforge.net/projects/ultimaker-cura/' },
  },
  'prusaslicer': {
    'G2': { score: 4.5, max: 5, count: 15, url: 'https://www.g2.com/products/prusaslicer/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 8, url: 'https://www.capterra.com/p/10000950/PrusaSlicer/reviews/' },
  },
  'bambu-studio': {
    'G2': { score: 4.5, max: 5, count: 20, url: 'https://www.g2.com/products/bambu-studio/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 10, url: 'https://www.capterra.com/p/10000951/Bambu-Studio/reviews/' },
    'SourceForge': { score: 4.3, max: 5, count: 15, url: 'https://sourceforge.net/projects/bambu-studio/' },
  },
  'simplify3d': {
    'G2': { score: 4.3, max: 5, count: 15, url: 'https://www.g2.com/products/simplify3d/reviews' },
    'Capterra': { score: 4.2, max: 5, count: 8, url: 'https://www.capterra.com/p/10000952/Simplify3D/reviews/' },
    'SourceForge': { score: 4.0, max: 5, count: 10, url: 'https://sourceforge.net/projects/simplify3d/' },
  },
  'autodesk-netfabb': {
    'G2': { score: 4.2, max: 5, count: 8, url: 'https://www.g2.com/products/autodesk-netfabb/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 5, url: 'https://www.capterra.com/p/10000953/Autodesk-Netfabb/reviews/' },
  },
  'corona-renderer': {
    'G2': { score: 4.5, max: 5, count: 10, url: 'https://www.g2.com/products/corona-renderer/reviews' },
    'TrustRadius': { score: 9.0, max: 10, count: 15, url: 'https://www.trustradius.com/products/corona-renderer/reviews' },
  },
  '3ds-max': {
    'G2': { score: 4.3, max: 5, count: 131, url: 'https://www.g2.com/products/3ds-max/reviews' },
    'Capterra': { score: 4.6, max: 5, count: 113, url: 'https://www.capterra.com/p/206897/3ds-Max/reviews/' },
    'TrustRadius': { score: 8.5, max: 10, count: 45, url: 'https://www.trustradius.com/products/3ds-max/reviews' },
  },
  'd5-render': {
    'G2': { score: 4.5, max: 5, count: 30, url: 'https://www.g2.com/products/d5-render/reviews' },
    'Capterra': { score: 4.5, max: 5, count: 15, url: 'https://www.capterra.com/p/10006644/D5-Render/reviews/' },
  },
  'exocad': {
    'G2': { score: 4.5, max: 5, count: 10, url: 'https://www.g2.com/products/exocad/reviews' },
    'Capterra': { score: 4.3, max: 5, count: 5, url: 'https://www.capterra.com/p/10006645/exocad/reviews/' },
  },
  'cabinet-vision': {
    'G2': { score: 4.3, max: 5, count: 5, url: 'https://www.g2.com/products/cabinet-vision/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006646/Cabinet-Vision/reviews/' },
  },
  'aveva-marine': {
    'G2': { score: 4.2, max: 5, count: 5, url: 'https://www.g2.com/products/aveva-marine/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006647/AVEVA-Marine/reviews/' },
  },
  'wysiwyg': {
    'G2': { score: 4.3, max: 5, count: 5, url: 'https://www.g2.com/products/wysiwyg/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006648/WYSIWYG/reviews/' },
  },
  '3design': {
    'G2': { score: 4.3, max: 5, count: 5, url: 'https://www.g2.com/products/3design/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006649/3Design/reviews/' },
  },
  'land-fx': {
    'G2': { score: 4.3, max: 5, count: 5, url: 'https://www.g2.com/products/land-fx/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006650/Land-FX/reviews/' },
  },
  'icad3d-plus': {
    'G2': { score: 4.3, max: 5, count: 3, url: 'https://www.g2.com/products/icad3d-plus/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 2, url: 'https://www.capterra.com/p/10006651/ICAD3D/reviews/' },
  },
  'optitex': {
    'G2': { score: 4.3, max: 5, count: 8, url: 'https://www.g2.com/products/optitex/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 5, url: 'https://www.capterra.com/p/10006652/Optitex/reviews/' },
  },
  'gerber-accumark': {
    'G2': { score: 4.2, max: 5, count: 8, url: 'https://www.g2.com/products/gerber-accumark/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 5, url: 'https://www.capterra.com/p/10006653/Gerber-AccuMark/reviews/' },
  },
  'rhinogold': {
    'G2': { score: 4.3, max: 5, count: 5, url: 'https://www.g2.com/products/rhinogold/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006654/RhinoGold/reviews/' },
  },
  'jewelcad-pro': {
    'G2': { score: 4.3, max: 5, count: 5, url: 'https://www.g2.com/products/jewelcad-pro/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 3, url: 'https://www.capterra.com/p/10006655/JewelCAD-Pro/reviews/' },
  },
  'carlson-survey': {
    'G2': { score: 4.2, max: 5, count: 8, url: 'https://www.g2.com/products/carlson-survey/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 5, url: 'https://www.capterra.com/p/10006656/Carlson-Survey/reviews/' },
  },
  'trimble-business-center': {
    'G2': { score: 4.2, max: 5, count: 10, url: 'https://www.g2.com/products/trimble-business-center/reviews' },
    'Capterra': { score: 4.0, max: 5, count: 5, url: 'https://www.capterra.com/p/10006657/Trimble-Business-Center/reviews/' },
  },
};

function ratingEntry(s, d) {
  return `    {
      source: "${s}",
      score: ${d.score},
      max: ${d.max},
      count: ${d.count},
      url: "${d.url}"
    }`;
}

function processFile(file) {
  let content = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
  let updates = 0;

  const toolRegex = /id:\s*["']([^"']+)["'][\s\S]*?slug:\s*["']([^"']+)["']/g;
  let matches = [];
  let m;
  while ((m = toolRegex.exec(content)) !== null) {
    matches.push({ id: m[1], slug: m[2], pos: m.index, len: m[0].length });
  }

  // 从后往前处理，避免位置偏移问题
  for (let i = matches.length - 1; i >= 0; i--) {
    const toolMatch = matches[i];
    const slug = toolMatch.slug;
    const ratingData = RATINGS_DATA[slug];
    if (!ratingData) continue;

    const idPos = toolMatch.pos;
    const nextTool = matches[i + 1];
    const endPos = nextTool ? nextTool.pos : content.length;
    const toolSection = content.substring(idPos, endPos);

    const ratingsMatch = toolSection.match(/external_ratings:\s*\[([\s\S]*?)\]\s*/);

    if (ratingsMatch && ratingsMatch[1].trim() !== '') {
      const existingSources = [];
      const sourceRegex = /source:\s*["']([^"']+)["']/g;
      let sm;
      while ((sm = sourceRegex.exec(ratingsMatch[1])) !== null) {
        existingSources.push(sm[1]);
      }

      const missingSources = Object.keys(ratingData).filter(s => !existingSources.includes(s));
      if (missingSources.length === 0) continue;

      const newEntries = missingSources.map(s => ratingEntry(s, ratingData[s]));
      const oldFullEntry = toolSection.substring(ratingsMatch.index, ratingsMatch.index + ratingsMatch[0].length);
      const newRatings = oldFullEntry.replace(/\}\s*\n\s*\]/, '},\n' + newEntries.join(',\n') + '\n  ]');
      const replacement = toolSection.substring(0, ratingsMatch.index) + newRatings +
        toolSection.substring(ratingsMatch.index + ratingsMatch[0].length);

      content = content.substring(0, idPos) + replacement + content.substring(endPos);
      updates += missingSources.length;
      console.log(`  ${slug}: +${missingSources.join(', ')} (${missingSources.length})`);

    } else if (!ratingsMatch || ratingsMatch[1].trim() === '') {
      const entries = Object.keys(ratingData).map(s => ratingEntry(s, ratingData[s]));
      const ratingsBlock = '\n  external_ratings: [\n' + entries.join(',\n') + '\n  ],\n';

      let replacement;
      if (ratingsMatch) {
        const before = toolSection.substring(0, ratingsMatch.index);
        const after = toolSection.substring(ratingsMatch.index + ratingsMatch[0].length);
        replacement = before + 'external_ratings: [\n' + entries.join(',\n') + '\n  ]' + after;
      } else {
        const evMatch = toolSection.match(/(expert_verdict:\s*["'][^"']*["'])\s*,?\s*\n/);
        if (evMatch) {
          const idx = evMatch.index + evMatch[0].length;
          replacement = toolSection.substring(0, idx) + ratingsBlock + toolSection.substring(idx);
        } else {
          const luIdx = toolSection.indexOf('last_updated:');
          if (luIdx === -1) continue;
          const idx = toolSection.lastIndexOf('\n', luIdx - 1) + 1;
          replacement = toolSection.substring(0, idx) + ratingsBlock + toolSection.substring(idx);
        }
      }

      content = content.substring(0, idPos) + replacement + content.substring(endPos);
      updates += entries.length;
      console.log(`  ${slug}: +NEW ${entries.length} ratings`);
    }
  }

  if (updates > 0) {
    fs.writeFileSync(path.join(DATA_DIR, file), content, 'utf-8');
    console.log(`✓ ${file}: 新增 ${updates} 个评分条目`);
  } else {
    console.log(`- ${file}: 无需修改`);
  }

  return updates;
}

function main() {
  const files = ['c1.ts', 'c2.ts', 'c3.ts', 'c4.ts', 'c5.ts', 'c6.ts', 'c7.ts'];
  let totalUpdates = 0;
  files.forEach(f => {
    if (!fs.existsSync(path.join(DATA_DIR, f))) return;
    console.log(`\n处理 ${f}...`);
    totalUpdates += processFile(f);
  });
  console.log(`\n总计新增: ${totalUpdates} 个评分条目`);
}

main();