import { tools } from './data';

export interface LicensingShieldPage {
  slug: string;
  toolSlug: string;
  toolName: string;
  daemonName: string;
  telemetryDomains: string[];
  netshScript: string;
  optionsTemplate: string;
  silentCommand: string;
  excerpt: string;
  tagline: string;
  complianceChecklist: string[];
  dealLink: string;
}

export const LICENSING_TOOLS = [
  'autocad', 'solidworks', 'revit', 'autodesk-inventor', 'rhino-3d',
  'microstation', 'archicad', 'ptc-creo', 'catia', 'siemens-nx',
  'vectorworks', 'fusion-360', 'tekla-structures', 'civil-3d', 'bricscad',
  'draftsight', 'gstarcad', 'altium-designer', 'allegro-pcb', '3ds-max',
  'maya', 'solid-edge', 'zwcad', 'eplan-electric-p8', 'aveva-e3d-design',
  'ansys-mechanical', 'comsol-multiphysics', 'abaqus', 'midas-civil', 'sketchup'
];

// Helper to determine vendor and specific configurations
function getShieldDetails(toolSlug: string, toolName: string) {
  const isAutodesk = ['autocad', 'revit', 'autodesk-inventor', 'civil-3d', '3ds-max', 'maya', 'fusion-360'].includes(toolSlug);
  const isDassault = ['solidworks', 'catia', 'abaqus', 'draftsight'].includes(toolSlug);
  const isSiemens = ['siemens-nx', 'solid-edge'].includes(toolSlug);
  const isBentley = ['microstation', 'midas-civil'].includes(toolSlug);

  // Default values
  let daemonName = 'FLEXlm License Manager';
  let telemetryDomains = [`telemetry.${toolSlug}.com`, `genuine.${toolSlug}.com`];
  let optionsTemplate = `# Default FLEXlm Options File for ${toolName}\nTIMEOUTALL 3600\nRESERVE 1 ${toolSlug.toUpperCase()} USER admin`;
  let silentCommand = `msiexec.exe /i "${toolSlug}_setup.msi" /qn /norestart`;
  
  if (isAutodesk) {
    daemonName = 'FLEXlm (adskflex.exe)';
    telemetryDomains = [
      'genuine.autodesk.com',
      'curate.autodesk.com',
      'clm.api.autodesk.com',
      'identity.autodesk.com',
      'licensing.autodesk.com'
    ];
    optionsTemplate = `# Autodesk FLEXlm (adskflex) Options Configuration
TIMEOUTALL 3600
RESERVE 2 AutoCAD USER engineering_core
RESERVE 1 Revit USER bim_coordinator
EXCLUDE ALL USER former_employee
# Disable licensing log tracking to reduce I/O wear
DEBUGLOG %WINDIR%\\Temp\\adskflex.log`;
    silentCommand = `setup.exe --silent --install_mode deploy --manifest manifest.xml --log "c:\\temp\\install.log"`;
  } else if (isDassault) {
    if (toolSlug === 'solidworks' || toolSlug === 'draftsight') {
      daemonName = 'SolidNetWork (snl_lic.exe)';
      telemetryDomains = [
        'telemetry.solidworks.com',
        'license.solidworks.com',
        'media.solidworks.com',
        'activation.solidworks.com'
      ];
      optionsTemplate = `# Dassault SNL License Options
TIMEOUTALL 1800
RESERVE 1 Solidworks USER mechanical_r_d
EXCLUDE Solidworks USER external_vendor`;
      silentCommand = `msiexec.exe /i "SolidWorks.msi" /qb ACTIVATIONSERIALNUMBERS="9000-XXXX-XXXX-XXXX" ADDLOCAL=SolidWorks,SolidWorksElectrical /l*v "c:\\temp\\sw_install.log"`;
    } else {
      daemonName = 'DSLS (Dassault License Server)';
      telemetryDomains = ['telemetry.3ds.com', 'licensing.3ds.com', 'verify.3ds.com'];
      optionsTemplate = `# Dassault Systemes License Server (DSLS) Config Statement
# DSLS uses cfg options rather than typical FLEXlm options syntax
# Define authorized group mapping
ADMIN_GROUP = local_domain\\it_admins
LICENSE_TIMEOUT = 1800`;
      silentCommand = `Start /Wait "" "DSLS_Setup.exe" -s -f1"c:\\temp\\dsls_install.iss"`;
    }
  } else if (isSiemens) {
    daemonName = 'Siemens PLM License (ugslmd.exe / sedg.exe)';
    telemetryDomains = ['telemetry.plm.siemens.com', 'verify.siemens.com', 'licensing.siemens.com'];
    optionsTemplate = `# Siemens PLM License Option Setup
TIMEOUTALL 3600
RESERVE 2 NX_Core USER advanced_modeling
RESERVE 1 SolidEdge USER drafting_team`;
    silentCommand = `SiemensNX_setup.msi /qn ADDLOCAL=ALL LICENSESERVER=28000@licserver.corp.local /l*v "c:\\temp\\nx_silent.log"`;
  } else if (isBentley) {
    daemonName = 'Bentley SELECTserver / SES Gateway';
    telemetryDomains = ['budi.bentley.com', 'telemetry.bentley.com', 'selectserver.bentley.com'];
    optionsTemplate = `# Bentley SES Configuration Registry Override
# Save as 'bentley_lic_override.reg' and import to disable outbound SES telemetry
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\\SOFTWARE\\Bentley\\Licensing\\1.0]
"DisableUsageReporting"=dword:00000001`;
    silentCommand = `Setup_MicroStationx64.exe /q /norestart /log "c:\\temp\\microstation.log"`;
  } else if (toolSlug === 'rhino-3d') {
    daemonName = 'McNeel Zoo / Cloud Zoo';
    telemetryDomains = ['cloudzoo.mcneel.com', 'verify.mcneel.com', 'auth.mcneel.com'];
    optionsTemplate = `# Rhino Zoo Options file override
# Set local license pooling parameters
SetZooServerPort 80
DisableOutboundCloudZooSync 1`;
    silentCommand = `rhino_setup.exe /quiet /norestart LICENSE_METHOD=ZOO ZOO_SERVER=zoo.corp.local`;
  } else if (toolSlug === 'altium-designer') {
    daemonName = 'Altium Private License Server';
    telemetryDomains = ['services.altium.com', 'genuine.altium.com', 'portal.altium.com'];
    optionsTemplate = `# Altium PLS server configuration block
# Load locally to limit outbound telemetry pings
[ServerConfiguration]
EnableTelemetry=0
LocalLicensingPort=21001`;
    silentCommand = `AltiumDesignerSetup.exe /S /InstallAllUser /NoTelemetry`;
  } else if (toolSlug === 'allegro-pcb') {
    daemonName = 'FLEXlm (cdslmd.exe)';
    telemetryDomains = ['genuine.cadence.com', 'telemetry.cadence.com', 'license.cadence.com'];
    optionsTemplate = `# Cadence Allegro FLEXlm Option Configuration
TIMEOUTALL 3600
RESERVE 1 Allegro_PCB USER ecad_expert`;
    silentCommand = `setup.exe -silent -silent_install.ini`;
  } else if (toolSlug === 'tekla-structures') {
    daemonName = 'Trimble Identity & Tekla License Server';
    telemetryDomains = ['identity.trimble.com', 'telemetry.tekla.com', 'licensing.tekla.com'];
    optionsTemplate = `# Tekla structures license options
TIMEOUTALL 1800
RESERVE 1 Steel_Detailer USER detailer_group`;
    silentCommand = `TeklaStructures_Setup.exe /s /v"/qn /norestart"`;
  } else if (toolSlug === 'zwcad' || toolSlug === 'gstarcad' || toolSlug === 'bricscad') {
    daemonName = 'RLM / Network License Manager';
    telemetryDomains = [`license.${toolSlug}.com`, `telemetry.${toolSlug}.com`];
    optionsTemplate = `# Network Licensing Manager Options
TIMEOUTALL 3600
RESERVE 1 ${toolSlug}_standard USER cad_operators`;
    silentCommand = `${toolSlug}_setup.msi /qn /norestart`;
  }

  // Generate outbound blocking Netsh firewall rules
  const firewallRules = telemetryDomains.map((domain, index) => 
    `netsh advfirewall firewall add rule name="Block_${toolSlug}_Telemetry_${index}" dir=out action=block remoteip="${domain}" enable=yes`
  ).join('\n');

  const netshScript = `@echo off
echo ==========================================================
echo   CAD DIRECTIVE: ${toolName.toUpperCase()} TELEMETRY & AUDIT BLOCKER
echo ==========================================================
echo [+] Initializing local licensing outbound shields...
${firewallRules}
echo [+] Injecting licensing hosts loopbacks...
${telemetryDomains.map(d => `echo 127.0.0.1 ${d} >> %WINDIR%\\system32\\drivers\\etc\\hosts`).join('\n')}
echo [+] Complete. ${toolName} corporate license telemetry offline.
pause`;

  return {
    daemonName,
    telemetryDomains,
    netshScript,
    optionsTemplate,
    silentCommand
  };
}

export function getLicensingShieldData(toolSlug: string): LicensingShieldPage | null {
  const toolInfo = tools.find(t => t.slug === toolSlug);
  if (!toolInfo) return null;
  if (!LICENSING_TOOLS.includes(toolSlug)) return null;

  const { daemonName, telemetryDomains, netshScript, optionsTemplate, silentCommand } = getShieldDetails(toolSlug, toolInfo.name);

  return {
    slug: `shield-${toolSlug}`,
    toolSlug,
    toolName: toolInfo.name,
    daemonName,
    telemetryDomains,
    netshScript,
    optionsTemplate,
    silentCommand,
    excerpt: `Enterprise guide to securing ${toolInfo.name} license setups, blocking Named-User telemetry data sweeps, configuring local FLEXlm options, and executing silent mass-deployments to prevent vendor EULA compliance audit penalties.`,
    tagline: `Outbound telemetry blocks, FLEXlm Option configs, and EULA compliance audit defense for ${toolInfo.name}.`,
    complianceChecklist: [
      `Review EULA definitions on virtualized desktop deployments (VDI) to prevent multi-seat licensing audit penalties.`,
      `Implement dedicated FLEXlm option policies (RESERVE/EXCLUDE) to block unentitled network seat usage.`,
      `Establish local outbound firewall rules preventing background executables from reporting telemetry to external domains.`,
      `Regularly audit local software directories to wipe stale activation remnants and educational watermarks.`
    ],
    dealLink: `/deals#${toolSlug}`
  };
}
