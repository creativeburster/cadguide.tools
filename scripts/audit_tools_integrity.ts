import { tools } from '../src/lib/data';

export interface AuditIssue {
  slug: string;
  name: string;
  category: string;
  field: string;
  level: 'ERROR' | 'WARN';
  message: string;
}

export function runAudit(): AuditIssue[] {
  const issues: AuditIssue[] = [];

  // Known Windows-only software that often gets mistakenly flagged with macOS/Linux
  const knownWindowsOnly = [
    'solidworks',
    'inventor',
    'revit',
    'microstation',
    'solid-edge',
    'creo',
    'creo-parametric',
    'mastercam',
    'powermill',
    '3ds-max',
    'cimatron',
    'tebis',
    'topsolid',
    'visicad',
    'edgecam',
    'esprit-cam',
    'hypermill',
    'gibbscam',
    'bobcad-cam',
    'spaceclaim',
    'ansys-discovery',
  ];

  // Known Free / Open Source tools
  const knownOpenSource = [
    'freecad',
    'blender',
    'kicad',
    'librecad',
    'qcad',
    'openscad',
  ];

  // Known discontinued or rebranded tools
  const knownDiscontinued = [
    'eagle', // Discontinued by Autodesk, integrated into Fusion 360
    'autodesk-123d',
  ];

  for (const t of tools) {
    // 1. Pricing logic checks
    if ((t.pricing_type === 'Free' || t.pricing_type === 'Open Source') && t.starting_price > 0) {
      issues.push({
        slug: t.slug,
        name: t.name,
        category: t.category_id,
        field: 'pricing',
        level: 'ERROR',
        message: `${t.pricing_type} tool has starting_price > 0 ($${t.starting_price})`,
      });
    }

    if ((t.pricing_type === 'Subscription' || t.pricing_type === 'Perpetual') && t.starting_price === 0 && !t.quote_only) {
      issues.push({
        slug: t.slug,
        name: t.name,
        category: t.category_id,
        field: 'pricing',
        level: 'WARN',
        message: `${t.pricing_type} tool has starting_price == 0 but quote_only is false`,
      });
    }

    // 2. Platforms check
    if (!t.platforms || t.platforms.length === 0) {
      issues.push({
        slug: t.slug,
        name: t.name,
        category: t.category_id,
        field: 'platforms',
        level: 'ERROR',
        message: 'Empty platforms array',
      });
    }

    if (knownWindowsOnly.includes(t.slug)) {
      const hasMac = t.platforms.some(p => p.toLowerCase().includes('mac'));
      if (hasMac) {
        issues.push({
          slug: t.slug,
          name: t.name,
          category: t.category_id,
          field: 'platforms',
          level: 'ERROR',
          message: `Windows-only CAD package mistakenly claims macOS support: [${t.platforms.join(', ')}]`,
        });
      }
    }

    // 3. File Formats check
    if (!t.file_formats_in || t.file_formats_in.length === 0) {
      issues.push({
        slug: t.slug,
        name: t.name,
        category: t.category_id,
        field: 'file_formats_in',
        level: 'WARN',
        message: 'Missing input file formats (file_formats_in)',
      });
    }

    if (!t.file_formats_out || t.file_formats_out.length === 0) {
      issues.push({
        slug: t.slug,
        name: t.name,
        category: t.category_id,
        field: 'file_formats_out',
        level: 'WARN',
        message: 'Missing output file formats (file_formats_out)',
      });
    }

    // 4. Kernel / Tech Specs check
    if (t.category_id === 'c1') {
      if (t.slug === 'librecad' && t.tech_specs?.engine && /parasolid|acis/i.test(t.tech_specs.engine)) {
        issues.push({
          slug: t.slug,
          name: t.name,
          category: t.category_id,
          field: 'engine',
          level: 'ERROR',
          message: `Pure 2D CAD has 3D solid kernel: ${t.tech_specs.engine}`,
        });
      }
    }

    // 5. Official URL check
    if (!t.official_url || !t.official_url.startsWith('http')) {
      issues.push({
        slug: t.slug,
        name: t.name,
        category: t.category_id,
        field: 'official_url',
        level: 'ERROR',
        message: `Invalid official URL: ${t.official_url}`,
      });
    }

    // 6. Discontinued status check
    if (knownDiscontinued.includes(t.slug) && !t.discontinued) {
      issues.push({
        slug: t.slug,
        name: t.name,
        category: t.category_id,
        field: 'discontinued',
        level: 'WARN',
        message: 'Tool is known to be discontinued/merged but discontinued flag is false',
      });
    }
  }

  return issues;
}

const issues = runAudit();
const errors = issues.filter(i => i.level === 'ERROR');
const warnings = issues.filter(i => i.level === 'WARN');

console.log(`Found ${errors.length} ERRORS and ${warnings.length} WARNINGS.\n`);

if (errors.length > 0) {
  console.log('🔴 ERRORS:');
  for (const err of errors) {
    console.log(`  - [${err.slug}] (${err.field}): ${err.message}`);
  }
  console.log('');
}

if (warnings.length > 0) {
  console.log(`🟡 WARNINGS Summary:`);
  const warnFields: Record<string, number> = {};
  for (const w of warnings) {
    warnFields[w.field] = (warnFields[w.field] || 0) + 1;
  }
  console.log(warnFields);
}
